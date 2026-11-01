export interface EmiCalculationResult {
  monthlyEmi: number;
  principalAmount: number;
  totalInterest: number;
  totalPayment: number;
  interestPercentage: number;
  principalPercentage: number;
  monthlyBreakdown: Array<{
    month: number;
    principalPaid: number;
    interestPaid: number;
    remainingBalance: number;
  }>;
}

export interface EmiInput {
  propertyPrice: number;
  downPaymentPercent: number; // e.g. 20 for 20%
  annualInterestRate: number; // e.g. 8.5 for 8.5%
  tenureYears: number; // e.g. 20 years
}

/**
 * Calculates Home Loan EMI using the standard Indian amortization formula:
 * E = P * r * (1 + r)^n / ((1 + r)^n - 1)
 * where P = Loan Amount, r = Monthly Interest Rate, n = Tenure in Months
 */
export function calculateHomeLoanEmi(input: EmiInput): EmiCalculationResult {
  const propertyPrice = Math.max(0, input.propertyPrice || 0);
  const downPaymentPercent = Math.min(100, Math.max(0, input.downPaymentPercent ?? 20));
  const downPayment = (propertyPrice * downPaymentPercent) / 100;
  const principal = Math.max(0, propertyPrice - downPayment);
  const annualRate = Math.max(0.1, input.annualInterestRate || 8.5);
  const tenureYears = Math.max(1, Math.min(30, input.tenureYears || 20));

  if (principal === 0) {
    return {
      monthlyEmi: 0,
      principalAmount: 0,
      totalInterest: 0,
      totalPayment: 0,
      interestPercentage: 0,
      principalPercentage: 100,
      monthlyBreakdown: [],
    };
  }

  const monthlyRate = annualRate / 12 / 100;
  const totalMonths = tenureYears * 12;

  // Formula: E = P * r * (1+r)^n / ((1+r)^n - 1)
  const factor = Math.pow(1 + monthlyRate, totalMonths);
  const monthlyEmi = Math.round((principal * monthlyRate * factor) / (factor - 1));

  const totalPayment = monthlyEmi * totalMonths;
  const totalInterest = Math.max(0, totalPayment - principal);

  const interestPercentage = totalPayment > 0 ? Math.round((totalInterest / totalPayment) * 100) : 0;
  const principalPercentage = 100 - interestPercentage;

  // Generate breakdown for preview (first 12 months)
  const monthlyBreakdown: EmiCalculationResult['monthlyBreakdown'] = [];
  let remaining = principal;
  for (let m = 1; m <= Math.min(12, totalMonths); m++) {
    const interestPart = Math.round(remaining * monthlyRate);
    const principalPart = Math.min(remaining, monthlyEmi - interestPart);
    remaining = Math.max(0, remaining - principalPart);
    monthlyBreakdown.push({
      month: m,
      principalPaid: principalPart,
      interestPaid: interestPart,
      remainingBalance: remaining,
    });
  }

  return {
    monthlyEmi,
    principalAmount: Math.round(principal),
    totalInterest: Math.round(totalInterest),
    totalPayment: Math.round(totalPayment),
    interestPercentage,
    principalPercentage,
    monthlyBreakdown,
  };
}

export const BANK_HOME_LOAN_RATES = [
  { bank: 'State Bank of India', rate: 8.50, type: 'Floating', maxLtv: '80%' },
  { bank: 'HDFC Bank', rate: 8.55, type: 'Floating', maxLtv: '80%' },
  { bank: 'ICICI Bank', rate: 8.60, type: 'Floating', maxLtv: '80%' },
  { bank: 'Axis Bank', rate: 8.75, type: 'Floating', maxLtv: '75%' },
  { bank: 'Kotak Mahindra', rate: 8.65, type: 'Floating', maxLtv: '80%' },
] as const;
