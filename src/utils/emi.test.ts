import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateHomeLoanEmi } from './emi';

test('EMI calculation calculates correct monthly installment for standard ₹1 Cr loan', () => {
  // ₹1,00,00,000 property, 20% down payment = ₹80,00,000 loan
  // 8.5% interest, 20 years (240 months)
  const result = calculateHomeLoanEmi({
    propertyPrice: 10000000,
    downPaymentPercent: 20,
    annualInterestRate: 8.5,
    tenureYears: 20,
  });

  assert.equal(result.principalAmount, 8000000);
  // Standard EMI for ₹80L @ 8.5% for 20 years is ~₹69,426
  assert.ok(result.monthlyEmi >= 69400 && result.monthlyEmi <= 69500);
  assert.ok(result.totalInterest > 0);
  assert.equal(result.totalPayment, result.monthlyEmi * 240);
  assert.equal(result.interestPercentage + result.principalPercentage, 100);
  assert.equal(result.monthlyBreakdown.length, 12);
});

test('EMI calculation handles 100% down payment gracefully', () => {
  const result = calculateHomeLoanEmi({
    propertyPrice: 50000000,
    downPaymentPercent: 100,
    annualInterestRate: 8.5,
    tenureYears: 20,
  });

  assert.equal(result.principalAmount, 0);
  assert.equal(result.monthlyEmi, 0);
  assert.equal(result.totalInterest, 0);
  assert.equal(result.totalPayment, 0);
});

test('EMI calculation clamps input boundaries correctly', () => {
  const result = calculateHomeLoanEmi({
    propertyPrice: -100,
    downPaymentPercent: 150, // should clamp to 100%
    annualInterestRate: 0, // should clamp to min 0.1%
    tenureYears: 50, // should clamp to max 30
  });

  assert.equal(result.principalAmount, 0);
  assert.equal(result.monthlyEmi, 0);
});
