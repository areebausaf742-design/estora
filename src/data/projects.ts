export interface Project {
  id: string;
  name: string;
  developer: string;
  city: string;
  locality: string;
  status: 'Pre-launch' | 'Under construction' | 'Ready to move';
  type: string;
  units: string;
  priceFrom: number;
  possession: string;
  reraNumber: string;
  description: string;
  images: string[];
  thumbnail: string;
  features: string[];
  configurations: string[];
  isSample: boolean;
  lat: number;
  lng: number;
}

// Curated luxury developments across India
export const PROJECTS: Project[] = [
  {
    id: 'proj-101',
    name: 'The Verdant Residences',
    developer: 'Oberoi Realty',
    city: 'Mumbai',
    locality: 'Worli Sea Face',
    status: 'Under construction',
    type: 'Luxury Residences & Penthouses',
    units: '48 bespoke sky villas',
    priceFrom: 125000000, // ₹12.50 Cr
    possession: 'December 2026',
    reraNumber: 'P51900034891',
    description: 'Iconic twin sky-villas rising gracefully over Worli Sea Face with private plunge pools on cantilevered wrap-around balconies, private lift elevators, and clubhouse designed by Kerry Hill Architects.',
    thumbnail: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1400&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1400&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1400&auto=format&fit=crop&q=80',
    ],
    features: ['Arabian Sea frontage', 'Private infinity sky-pools', 'Triple-height grand entrance', 'Temperature-controlled indoor pool', 'Resident sommelier & wine cellar'],
    configurations: ['3 BHK (2,400 sq.ft)', '4 BHK (3,600 sq.ft)', '5 BHK Duplex Penthouse (6,800 sq.ft)'],
    isSample: true,
    lat: 19.0178,
    lng: 72.8478,
  },
  {
    id: 'proj-102',
    name: 'Aranya Woods & Water',
    developer: 'Total Environment',
    city: 'Bengaluru',
    locality: 'Whitefield',
    status: 'Ready to move',
    type: 'Earth-sheltered Villas & Sky Condos',
    units: '36 handcrafted estates',
    priceFrom: 48000000, // ₹4.80 Cr
    possession: 'Immediate',
    reraNumber: 'PRM/KA/RERA/1251/310/PR/190820/002812',
    description: 'Handcrafted homes woven gently into native forest canopies. Natural stone masonry, grass-topped roofs, flowing stream waterbodies, and expansive wooden decks.',
    thumbnail: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1400&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1400&auto=format&fit=crop&q=80',
    ],
    features: ['10-acre private woodland', 'Biological swimming pond', 'Organic farming plots', 'Heated salt-water lap pool', 'Bespoke Scandinavian carpentry'],
    configurations: ['4 BHK Villa (4,200 sq.ft)', '5 BHK Forest Estate (6,100 sq.ft)'],
    isSample: true,
    lat: 12.9698,
    lng: 77.7500,
  },
  {
    id: 'proj-103',
    name: 'Sahara Courtyard Penthouses',
    developer: 'DLF Luxury Mews',
    city: 'Delhi NCR',
    locality: 'Golf Course Extension, Gurugram',
    status: 'Pre-launch',
    type: 'High-rise Sanctuary',
    units: '64 limited penthouses',
    priceFrom: 89000000, // ₹8.90 Cr
    possession: 'Q2 2028',
    reraNumber: 'HRERA-PKL-GGM-89-2024',
    description: 'A benchmark in NCR ultra-luxury living. 12-foot clear ceiling heights, floor-to-ceiling glass, private landscaped terrace gardens, and direct private elevator foyer.',
    thumbnail: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1400&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?w=1400&auto=format&fit=crop&q=80',
    ],
    features: ['Golf course panoramas', 'Private high-speed elevator', 'Multi-tier biometric security', '4 dedicated basement parking bays', 'LEED Zero Carbon certified'],
    configurations: ['4 BHK (3,800 sq.ft)', '5 BHK (5,400 sq.ft)'],
    isSample: true,
    lat: 28.4215,
    lng: 77.0850,
  },
  {
    id: 'proj-104',
    name: 'Kaveri Greens Promenade',
    developer: 'Panchshil Realty',
    city: 'Pune',
    locality: 'Koregaon Park Annexe',
    status: 'Under construction',
    type: 'Boutique River Residences',
    units: '28 riverfront apartments',
    priceFrom: 36000000, // ₹3.60 Cr
    possession: 'Q1 2027',
    reraNumber: 'P52100041920',
    description: 'Serene river-facing mid-rise community tucked alongside Koregaon Park’s lush tree-lined avenues. Features open sun decks, rooftop yoga observatory, and clubhouse.',
    thumbnail: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1400&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1502672260266-1c1ef1d79938?w=1400&auto=format&fit=crop&q=80',
    ],
    features: ['Riverfront walkway', 'Rooftop meditation deck', 'EV fast-charging stations', 'Solar water heating', 'Concierge & package drop'],
    configurations: ['3 BHK (2,100 sq.ft)', '4 BHK (2,950 sq.ft)'],
    isSample: true,
    lat: 18.5362,
    lng: 73.8940,
  },
];