export interface Insight {
  slug: string;
  title: string;
  category: string;
  date: string;
  readMinutes: number;
  excerpt: string;
  body: string[];
  isSample: boolean;
}

// Illustrative editorial content only. NOT real coverage.
export const INSIGHTS: Insight[] = [
  {
    slug: 'rera-2026-guide',
    title: 'Understanding RERA compliance in Indian property markets',
    category: 'Legal',
    date: '2026-09-18',
    readMinutes: 6,
    excerpt: 'How buyers can verify registration, sanctioning and disclosure status before signing.',
    body: [
      'Registration with the state regulator remains the first checkpoint for any property transaction in India.',
      'Buyers should verify the RERA number, the project promoter details and the payment schedule before signing any agreement.',
      'This editorial is illustrative sample content.',
    ],
    isSample: true,
  },
  {
    slug: 'luxury-homes-india-2026',
    title: 'The demand for luxury homes in Indian metros',
    category: 'Market',
    date: '2026-08-02',
    readMinutes: 5,
    excerpt: 'Why premium addresses continue to hold value and what buyers expect today.',
    body: [
      'Ultra-premium segments have re-emerged as a distinct category driven by long-term wealth holders.',
      'This editorial is illustrative sample content.',
    ],
    isSample: true,
  },
  {
    slug: 'independent-houses-india',
    title: 'The rise of the independent house in Indian cities',
    category: 'Living',
    date: '2026-06-21',
    readMinutes: 4,
    excerpt: 'Privacy, land ownership and family space drive demand for standalone homes.',
    body: [
      'Standalone homes continue to appeal to families seeking privacy and land ownership.',
      'This editorial is illustrative sample content.',
    ],
    isSample: true,
  },
];