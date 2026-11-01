import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { LayoutGrid, Map } from 'lucide-react';
import type { FilterState, Purpose, PropertyType, Bedroom, Property } from '../types';
import { PROPERTIES } from '../data/properties';
import { Filters } from './Filters';
import { PropertyCard } from './PropertyCard';
import { MapView } from './MapView';
import { AiSearchBox } from './AiSearchBox';
import { EmiCalculator } from './EmiCalculator';
import { MakeLeadCaptureModal } from './MakeLeadCaptureModal';
import { useLanguage } from '../context/LanguageContext';
import type { ParsedSearchQuery } from '../utils/aiSearch';

type SortKey = 'featured' | 'price-asc' | 'price-desc' | 'area-desc';

interface ListingsExplorerProps {
  purpose: Purpose;
  defaultView?: 'grid' | 'map';
  title?: string;
  subtitle?: string;
}

function toNumberOrEmpty(value: string | null): number | '' {
  if (value === null || value === '') return '';
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : '';
}

function readFiltersFromParams(searchParams: URLSearchParams, purpose: Purpose): FilterState {
  return {
    purpose,
    city: searchParams.get('city') ?? '',
    locality: searchParams.get('locality') ?? '',
    type: (searchParams.get('type') as PropertyType | null) ?? 'All',
    bedrooms: (searchParams.get('bedrooms') as Bedroom | null) ?? 'All',
    minPrice: toNumberOrEmpty(searchParams.get('minPrice')),
    maxPrice: toNumberOrEmpty(searchParams.get('maxPrice')),
    minArea: toNumberOrEmpty(searchParams.get('minArea')),
    maxArea: toNumberOrEmpty(searchParams.get('maxArea')),
    furnished: searchParams.get('furnished') ?? '',
  };
}

export function ListingsExplorer({ purpose, defaultView = 'grid', title: _title, subtitle: _subtitle }: ListingsExplorerProps) {
  const { t } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState<FilterState>(() => readFiltersFromParams(searchParams, purpose));
  const [sort, setSort] = useState<SortKey>('featured');
  const [viewMode, setViewMode] = useState<'grid' | 'map'>(defaultView);
  const [aiKeywords, setAiKeywords] = useState<string[]>([]);

  // EMI modal & Lead capture state
  const [emiProperty, setEmiProperty] = useState<Property | null>(null);
  const [leadModalOpen, setLeadModalOpen] = useState(false);
  const [leadModalProps, setLeadModalProps] = useState<{
    propertyTitle?: string;
    propertyId?: string;
    propertyPrice?: number;
    leadType?: 'enquiry' | 'site_visit' | 'brochure' | 'loan_calc' | 'commercial';
    loanDetails?: {
      loanAmount: number;
      downPayment: number;
      tenureYears: number;
      estimatedEmi: number;
    };
  }>({});

  useEffect(() => {
    // Keep purpose synced when tab changes
    setFilters((prev) => ({ ...prev, purpose }));
  }, [purpose]);

  useEffect(() => {
    const next = new URLSearchParams();
    if (filters.city) next.set('city', filters.city);
    if (filters.locality) next.set('locality', filters.locality);
    if (filters.type !== 'All') next.set('type', filters.type);
    if (filters.bedrooms !== 'All') next.set('bedrooms', filters.bedrooms);
    if (filters.minPrice !== '') next.set('minPrice', String(filters.minPrice));
    if (filters.maxPrice !== '') next.set('maxPrice', String(filters.maxPrice));
    if (filters.minArea !== '') next.set('minArea', String(filters.minArea));
    if (filters.maxArea !== '') next.set('maxArea', String(filters.maxArea));
    if (filters.furnished) next.set('furnished', filters.furnished);
    setSearchParams(next, { replace: true });
  }, [filters, setSearchParams]);

  const localities = useMemo(() => {
    const unique = new Set<string>();
    PROPERTIES.filter((entry) => entry.purpose === purpose).forEach((entry) => unique.add(entry.locality));
    return Array.from(unique).sort((a, b) => a.localeCompare(b));
  }, [purpose]);

  const results = useMemo(() => {
    const list = PROPERTIES.filter((entry) => entry.purpose === purpose);
    const filtered = list.filter((entry) => {
      if (filters.city && entry.city.toLowerCase() !== filters.city.toLowerCase()) return false;
      if (filters.locality && !entry.locality.toLowerCase().includes(filters.locality.toLowerCase())) return false;
      if (filters.type !== 'All' && entry.type !== filters.type) return false;
      if (filters.bedrooms !== 'All' && entry.bedrooms !== filters.bedrooms) return false;
      if (filters.minPrice !== '' && entry.price < Number(filters.minPrice)) return false;
      if (filters.maxPrice !== '' && entry.price > Number(filters.maxPrice)) return false;
      if (filters.minArea !== '' && entry.area < Number(filters.minArea)) return false;
      if (filters.maxArea !== '' && entry.area > Number(filters.maxArea)) return false;
      if (filters.furnished && entry.furnished !== filters.furnished) return false;

      // Filter by AI keyword tags if present
      if (aiKeywords.length > 0) {
        const fullText = `${entry.type} ${entry.locality} ${entry.city} ${entry.description} ${entry.features.join(' ')}`.toLowerCase();
        const matchesAll = aiKeywords.some((k) => fullText.includes(k.toLowerCase()));
        if (!matchesAll) return false;
      }

      return true;
    });

    const sorted = [...filtered];
    if (sort === 'price-asc') sorted.sort((a, b) => a.price - b.price);
    if (sort === 'price-desc') sorted.sort((a, b) => b.price - a.price);
    if (sort === 'area-desc') sorted.sort((a, b) => b.area - a.area);
    return sorted;
  }, [purpose, filters, sort, aiKeywords]);

  const handleAiSearch = (parsed: ParsedSearchQuery) => {
    setFilters((prev) => ({
      ...prev,
      city: parsed.city || prev.city,
      locality: parsed.locality || prev.locality,
      type: parsed.propertyType || prev.type,
      bedrooms: parsed.bedrooms || prev.bedrooms,
      maxPrice: parsed.maxPrice !== undefined ? parsed.maxPrice : prev.maxPrice,
    }));
    if (parsed.keywords.length > 0) {
      setAiKeywords(parsed.keywords);
    }
  };

  const handleOpenEmi = (property: Property) => {
    setEmiProperty(property);
  };

  return (
    <>
      {/* AI Natural Language Search Bar */}
      <div className="mb-8">
        <AiSearchBox onSearch={handleAiSearch} />
      </div>

      {/* Toolbar: Results count, Sort, and Grid/Map View Toggle */}
      <div className="listings-toolbar flex items-center justify-between flex-wrap gap-4 mb-6">
        <p className="results-count text-sm text-[#1B1B18] m-0">
          <strong className="text-base text-[#2F4A3C]">{results.length}</strong>{' '}
          {results.length === 1 ? t('home_found') : t('homes_found')}
        </p>

        <div className="flex items-center gap-3">
          {/* Grid / Map Toggle Buttons */}
          <div className="flex items-center rounded-xl bg-[#F3EBDD] p-1 border border-[#E6DCC8]">
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'grid'
                  ? 'bg-white text-[#1B1B18] shadow-sm'
                  : 'text-[#6B675E] hover:text-[#1B1B18]'
              }`}
            >
              <LayoutGrid size={14} />
              <span>{t('view_grid')}</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('map')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'map'
                  ? 'bg-white text-[#1B1B18] shadow-sm'
                  : 'text-[#6B675E] hover:text-[#1B1B18]'
              }`}
            >
              <Map size={14} />
              <span>{t('view_map')}</span>
            </button>
          </div>

          <label className="small nowrap flex items-center gap-2 m-0 text-xs" htmlFor="sort-order">
            <span className="text-[#6B675E]">{t('sort_by')}</span>
            <select
              id="sort-order"
              className="select text-xs"
              style={{ width: 'auto', padding: '6px 28px 6px 10px', height: 'auto' }}
              value={sort}
              onChange={(event) => setSort(event.target.value as SortKey)}
            >
              <option value="featured">{t('sort_featured')}</option>
              <option value="price-asc">{t('sort_price_asc')}</option>
              <option value="price-desc">{t('sort_price_desc')}</option>
              <option value="area-desc">{t('sort_area_desc')}</option>
            </select>
          </label>
        </div>
      </div>

      {viewMode === 'map' ? (
        <div className="space-y-6">
          <MapView properties={results} />
          {/* Quick list cards below map */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
            {results.map((entry) => (
              <PropertyCard key={entry.id} property={entry} onOpenEmi={handleOpenEmi} />
            ))}
          </div>
        </div>
      ) : (
        <div className="listings-layout">
          <Filters filters={filters} localities={localities} onChange={setFilters} />
          <div>
            {results.length === 0 ? (
              <div className="empty-state py-12 text-center bg-white rounded-2xl border border-[#E6DCC8] p-8">
                <p className="font-semibold text-lg text-[#1B1B18] mb-2">No properties match your current filters.</p>
                <p className="text-sm text-[#6B675E] mb-5">
                  Try widening your budget, selecting another city, or resetting your filter criteria.
                </p>
                <button
                  type="button"
                  className="btn btn--outline btn--sm"
                  onClick={() => {
                    setFilters({
                      purpose,
                      city: '',
                      locality: '',
                      type: 'All',
                      bedrooms: 'All',
                      minPrice: '',
                      maxPrice: '',
                      minArea: '',
                      maxArea: '',
                      furnished: '',
                    });
                    setAiKeywords([]);
                  }}
                >
                  {t('clear_filters')}
                </button>
              </div>
            ) : (
              <div className="properties-grid grid grid-cols-1 md:grid-cols-2 gap-6">
                {results.map((entry) => (
                  <PropertyCard key={entry.id} property={entry} onOpenEmi={handleOpenEmi} />
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* EMI Calculator Drawer/Modal */}
      {emiProperty && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <button
              type="button"
              onClick={() => setEmiProperty(null)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/80 text-[#1B1B18] hover:bg-white shadow"
              aria-label="Close EMI calculator"
            >
              &times;
            </button>
            <EmiCalculator
              initialPrice={emiProperty.price}
              propertyTitle={`${emiProperty.type} - ${emiProperty.locality}, ${emiProperty.city}`}
              propertyId={emiProperty.id}
              onApplyLoan={(details) => {
                setEmiProperty(null);
                setLeadModalProps({
                  propertyTitle: `${emiProperty.type} - ${emiProperty.locality}, ${emiProperty.city}`,
                  propertyId: emiProperty.id,
                  propertyPrice: emiProperty.price,
                  leadType: 'loan_calc',
                  loanDetails: details,
                });
                setLeadModalOpen(true);
              }}
            />
          </div>
        </div>
      )}

      {/* Make.com Lead Capture Modal */}
      <MakeLeadCaptureModal
        isOpen={leadModalOpen}
        onClose={() => setLeadModalOpen(false)}
        {...leadModalProps}
      />
    </>
  );
}
