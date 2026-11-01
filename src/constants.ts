export const BRAND = {
  name: 'Estora',
  tagline: 'Premium homes. Thoughtfully crafted.',
  rera: 'RERA Reg. No.: [EDITABLE - VERIFY BEFORE LAUNCH]',
  corporateOffice: '[EDITABLE - Corporate Office Address]',
  phone: '+91 [EDITABLE - Verified office number]',
  email: 'hello@estora.example',
  whatsappNumber: '9190000000000',
  whatsappDisplay: '+91 [EDITABLE - Verified WhatsApp number]',
  disclosure:
    'All properties, prices, images, and details shown on this website are illustrative sample content only. They are not real listings. Replace with verified inventory before launch.',
} as const;

export const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Buy', href: '/buy' },
  { label: 'Rent', href: '/rent' },
  { label: 'New Projects', href: '/new-projects' },
  { label: 'Commercial', href: '/commercial' },
  { label: 'Sell or List', href: '/sell' },
  { label: 'About', href: '/about' },
  { label: 'Insights', href: '/insights' },
  { label: 'Contact', href: '/contact' },
] as const;

export const CITIES = [
  'Mumbai',
  'Delhi NCR',
  'Bengaluru',
  'Pune',
  'Hyderabad',
  'Chennai',
  'Kolkata',
  'Ahmedabad',
] as const;

export const PROPERTY_TYPES = [
  'Apartment',
  'Independent House',
  'Villa',
  'Penthouse',
  'Studio',
  'Plot',
  'Office',
  'Retail',
  'Industrial',
] as const;

export const BEDROOMS = ['1 BHK', '2 BHK', '3 BHK', '4 BHK', '5+ BHK'] as const;

export const MAX_COMPARE = 3;

export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
} as const;
export const PURPOSES = ['Buy', 'Rent'] as const;
