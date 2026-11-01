import test from 'node:test';
import assert from 'node:assert/strict';
import { parseNaturalLanguageQuery } from './aiSearch';

test('parses 3 BHK sea view apartment in Mumbai under 15 Cr', () => {
  const result = parseNaturalLanguageQuery('3 BHK sea view apartment in Mumbai under 15 Cr');
  assert.equal(result.bedrooms, '3 BHK');
  assert.equal(result.city, 'Mumbai');
  assert.equal(result.propertyType, 'Apartment');
  assert.equal(result.maxPrice, 150000000);
  assert.ok(result.keywords.includes('sea view'));
});

test('parses luxury villa in Whitefield Bangalore for rent under 80 lakh', () => {
  const result = parseNaturalLanguageQuery('luxury villa in Whitefield Bengaluru for rent under 80 lakh');
  assert.equal(result.purpose, 'Rent');
  assert.equal(result.city, 'Bengaluru');
  assert.equal(result.locality, 'Whitefield');
  assert.equal(result.propertyType, 'Villa');
  assert.equal(result.maxPrice, 8000000);
});

test('parses commercial office in Gurugram', () => {
  const result = parseNaturalLanguageQuery('grade A commercial office space in Gurugram');
  assert.equal(result.purpose, 'Commercial');
  assert.equal(result.city, 'Delhi NCR');
  assert.equal(result.propertyType, 'Office');
});
