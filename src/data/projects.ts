export interface Project {
  id: string;
  name: string;
  city: string;
  locality: string;
  status: 'Pre-launch' | 'Under construction' | 'Ready to move';
  type: string;
  units: string;
  priceFrom: number;
  possession: string;
  description: string;
  image: string;
  isSample: boolean;
}

// Illustrative sample projects only. NOT real developments.
export const PROJECTS: Project[] = [
  {
    id: 'proj-101',
    name: 'The Verdant Residences',
    city: 'Mumbai',
    locality: 'Andheri West',
    status: 'Under construction',
    type: 'Apartment',
    units: '18 homes',
    priceFrom: 42000000,
    possession: 'Q3 2027',
    description: 'Illustrative sample: Two towers of residences around a landscaped courtyard in Andheri West.',
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=80',
    isSample: true,
  },
  {
    id: 'proj-102',
    name: 'Aranya Woods',
    city: 'Bengaluru',
    locality: 'Whitefield',
    status: 'Ready to move',
    type: 'Villa',
    units: '6 villas',
    priceFrom: 18500000,
    possession: 'Immediate',
    description: 'Illustrative sample: Cluster of private villas within a managed woodland estate.',
    image: 'https://images.unsplash.com/photo-1600596542815-6ad4c602717a?w=1200&q=80',
    isSample: true,
  },
  {
    id: 'proj-103',
    name: 'Sahara Courtyard',
    city: 'Delhi NCR',
    locality: 'Gurgaon',
    status: 'Pre-launch',
    type: 'Apartment',
    units: '24 homes',
    priceFrom: 98000000,
    possession: 'Q2 2028',
    description: 'Illustrative sample: Residential community centred on a central courtyard.',
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef1d79938?w=1200&q=80',
    isSample: true,
  },
  {
    id: 'proj-104',
    name: 'Kaveri Greens',
    city: 'Pune',
    locality: 'Koregaon Park',
    status: 'Under construction',
    type: 'Apartment',
    units: '12 homes',
    priceFrom: 26000000,
    possession: 'Q1 2028',
    description: 'Illustrative sample: Mid-rise residences beside a central park.',
    image: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=1200&q=80',
    isSample: true,
  },
];