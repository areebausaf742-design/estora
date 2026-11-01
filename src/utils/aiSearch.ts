import type { Bedroom, PropertyType, Purpose } from '../types';

export interface ParsedSearchQuery {
  rawQuery: string;
  purpose?: Purpose;
  city?: string;
  locality?: string;
  propertyType?: PropertyType;
  bedrooms?: Bedroom;
  maxPrice?: number;
  minPrice?: number;
  keywords: string[];
  explanation: string;
}

const CITIES = [
  'Mumbai',
  'Bengaluru',
  'Delhi NCR',
  'Delhi',
  'Gurugram',
  'Gurgaon',
  'Noida',
  'Pune',
  'Hyderabad',
  'Chennai',
  'Kolkata',
  'Ahmedabad',
  'Goa',
  'Alibaug',
];

const LOCALITIES = [
  'Bandra',
  'Bandra West',
  'Worli',
  'Juhu',
  'BKC',
  'Lower Parel',
  'Indiranagar',
  'Whitefield',
  'Koramangala',
  'Outer Ring Road',
  'Golf Course Road',
  'DLF',
  'Jubilee Hills',
  'Banjara Hills',
  'Koregaon Park',
  'Adyar',
  'Ballygunge',
];

/**
 * Pure smart NLP parser for real estate queries in Indian context.
 * Parses natural language into filter parameters with fallback if API is unreachable.
 */
export function parseNaturalLanguageQuery(query: string): ParsedSearchQuery {
  const q = query.trim();
  const lower = q.toLowerCase();

  const result: ParsedSearchQuery = {
    rawQuery: q,
    keywords: [],
    explanation: '',
  };

  // Purpose extraction
  if (/\b(rent|rental|lease|leasing|on rent|to let)\b/i.test(lower)) {
    result.purpose = 'Rent';
  } else if (/\b(commercial|office|retail|showroom|tech park|co-working|shop)\b/i.test(lower)) {
    result.purpose = 'Commercial';
  } else if (/\b(buy|purchase|sale|for sale|invest)\b/i.test(lower)) {
    result.purpose = 'Buy';
  }

  // City extraction
  for (const city of CITIES) {
    if (lower.includes(city.toLowerCase())) {
      if (['gurugram', 'gurgaon', 'noida', 'delhi'].includes(city.toLowerCase())) {
        result.city = 'Delhi NCR';
      } else {
        result.city = city;
      }
      break;
    }
  }

  // Locality extraction
  for (const loc of LOCALITIES) {
    if (lower.includes(loc.toLowerCase())) {
      result.locality = loc;
      break;
    }
  }

  // Bedrooms extraction
  const bhkMatch = lower.match(/([1-5])\s*\+?\s*bhk/i) || lower.match(/([1-5])\s*(?:bed|bedroom)/i);
  if (bhkMatch) {
    const num = Number(bhkMatch[1]);
    if (num >= 5) result.bedrooms = '5+ BHK';
    else if (num === 4) result.bedrooms = '4 BHK';
    else if (num === 3) result.bedrooms = '3 BHK';
    else if (num === 2) result.bedrooms = '2 BHK';
    else if (num === 1) result.bedrooms = '1 BHK';
  }

  // Property type extraction
  if (/\b(penthouse|terrace penthouse)\b/i.test(lower)) {
    result.propertyType = 'Penthouse';
  } else if (/\b(villa|bungalow|estate|independent house)\b/i.test(lower)) {
    result.propertyType = 'Villa';
  } else if (/\b(office|commercial office|workspace)\b/i.test(lower)) {
    result.propertyType = 'Office';
  } else if (/\b(retail|store|showroom|shop)\b/i.test(lower)) {
    result.propertyType = 'Retail';
  } else if (/\b(apartment|flat|condo|residence)\b/i.test(lower)) {
    result.propertyType = 'Apartment';
  } else if (/\b(plot|land)\b/i.test(lower)) {
    result.propertyType = 'Plot';
  }

  // Budget / Price extraction
  // E.g. "under 15 cr", "below 5 crore", "under 80 lakh", "under 50k", "under 1.5 cr"
  const crMatch = lower.match(/(?:under|below|max|upto|within|budget(?:\s*of)?)\s*(?:₹|rs\.?)?\s*(\d+(?:\.\d+)?)\s*(?:cr|crore|crores)/i)
    || lower.match(/(\d+(?:\.\d+)?)\s*(?:cr|crore|crores)/i);
  if (crMatch) {
    result.maxPrice = Math.round(parseFloat(crMatch[1]) * 10000000);
  }

  const lakhMatch = lower.match(/(?:under|below|max|upto|within|budget(?:\s*of)?)\s*(?:₹|rs\.?)?\s*(\d+(?:\.\d+)?)\s*(?:lakh|lakhs|lac|lacs|l)/i)
    || lower.match(/(\d+(?:\.\d+)?)\s*(?:lakh|lakhs|lac|lacs)/i);
  if (lakhMatch && !crMatch) {
    result.maxPrice = Math.round(parseFloat(lakhMatch[1]) * 100000);
  }

  const kMatch = lower.match(/(?:under|below|max|upto|within)\s*(?:₹|rs\.?)?\s*(\d+)\s*(?:k|thousand)/i);
  if (kMatch && !crMatch && !lakhMatch) {
    result.maxPrice = parseInt(kMatch[1], 10) * 1000;
  }

  // Desired features & special keywords
  const featureList = [
    { key: 'sea view', match: /\b(sea view|ocean view|coastal|waterfront)\b/i },
    { key: 'private pool', match: /\b(pool|swimming pool|private pool)\b/i },
    { key: 'garden', match: /\b(garden|lawn|landscaped)\b/i },
    { key: 'servant quarter', match: /\b(servant|staff quarter|maid room)\b/i },
    { key: 'terrace', match: /\b(terrace|deck|balcony)\b/i },
    { key: 'furnished', match: /\b(furnished|fully furnished)\b/i },
    { key: 'ready to move', match: /\b(ready to move|immediate|ready possession)\b/i },
    { key: 'gated community', match: /\b(gated|society|security)\b/i },
    { key: 'parking', match: /\b(parking|garage)\b/i },
  ];

  for (const item of featureList) {
    if (item.match.test(lower)) {
      result.keywords.push(item.key);
    }
  }

  // Explanation string
  const parts: string[] = [];
  if (result.bedrooms) parts.push(result.bedrooms);
  if (result.propertyType) parts.push(result.propertyType);
  if (result.purpose) parts.push(`for ${result.purpose}`);
  if (result.locality) parts.push(`in ${result.locality}`);
  else if (result.city) parts.push(`in ${result.city}`);
  if (result.maxPrice) {
    if (result.maxPrice >= 10000000) parts.push(`under ₹${(result.maxPrice / 10000000).toFixed(1)} Cr`);
    else if (result.maxPrice >= 100000) parts.push(`under ₹${(result.maxPrice / 100000).toFixed(0)} Lakh`);
    else parts.push(`under ₹${result.maxPrice.toLocaleString('en-IN')}`);
  }
  if (result.keywords.length > 0) {
    parts.push(`featuring ${result.keywords.join(', ')}`);
  }

  result.explanation = parts.length > 0
    ? `Searching ${parts.join(' ')}`
    : `Showing homes matching "${q}"`;

  return result;
}
