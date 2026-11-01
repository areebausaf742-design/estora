export type Purpose = 'Buy' | 'Rent' | 'Commercial';

export type PropertyType =
  | 'Apartment'
  | 'Independent House'
  | 'Villa'
  | 'Penthouse'
  | 'Studio'
  | 'Plot'
  | 'Office'
  | 'Retail'
  | 'Industrial';

export type Bedroom = '1 BHK' | '2 BHK' | '3 BHK' | '4 BHK' | '5+ BHK';

export interface Property {
  id: string;
  purpose: Purpose;
  city: string;
  locality: string;
  address: string;
  type: PropertyType;
  bedrooms?: Bedroom;
  bathrooms: number;
  area: number;
  price: number;
  pricePerSqFt: number;
  furnished: string;
  parking: number;
  availability: string;
  reraNumber: string;
  description: string;
  features: string[];
  images: string[];
  thumbnail: string;
  isSample: boolean;
  createdAt: string;
  floor?: string;
  possession?: string;
}

export interface FilterState {
  purpose: Purpose | 'All';
  city: string;
  locality: string;
  type: PropertyType | 'All';
  bedrooms: Bedroom | 'All';
  minPrice: number | '';
  maxPrice: number | '';
  minArea: number | '';
  maxArea: number | '';
  furnished: string;
}

export interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
  propertyId?: string;
  general?: string;
}