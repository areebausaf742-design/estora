import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal } from 'lucide-react';
import type { FilterState, Purpose, PropertyType, Bedroom } from '../types';
import { PROPERTIES } from '../data/properties';
import { Filters } from './Filters';
import { PropertyCard } from './PropertyCard';

type SortKey = 'featured' | 'price-asc' | 'price-desc' | 'area-desc';

interface ListingsExplorerProps {
  purpose: Purpose;
}

function toNumberOrEmpty(value: string | null): number | '' {
  if (value === null || value === '') return '';
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : '';
}

function readFiltersFromParams(searchParams: URLSearchParams): FilterState {
  return {
    purpose: 'Buy',
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

export function ListingsExplorer({ purpose }: ListingsExplorerProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState<FilterState>(() => readFiltersFromParams(searchParams));
  const [sort, setSort] = useState<SortKey>('featured');

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
      if (filters.city && entry.city !== filters.city) return false;
      if (filters.locality && !entry.locality.toLowerCase().includes(filters.locality.toLowerCase())) return false;
      if (filters.type !== 'All' && entry.type !== filters.type) return false;
      if (filters.bedrooms !== 'All' && entry.bedrooms !== filters.bedrooms) return false;
      if (filters.minPrice !== '' && entry.price < Number(filters.minPrice)) return false;
      if (filters.maxPrice !== '' && entry.price > Number(filters.maxPrice)) return false;
      if (filters.minArea !== '' && entry.area < Number(filters.minArea)) return false;
      if (filters.maxArea !== '' && entry.area > Number(filters.maxArea)) return false;
      if (filters.furnished && entry.furnished !== filters.furnished) return false;
      return true;
    });
    const sorted = [...filtered];
    if (sort === 'price-asc') sorted.sort((a, b) => a.price - b.price);
    if (sort === 'price-desc') sorted.sort((a, b) => b.price - a.price);
    if (sort === 'area-desc') sorted.sort((a, b) => b.area - a.area);
    return sorted;
  }, [purpose, filters, sort]);

  const heading = purpose === 'Rent' ? 'Homes for rent' : purpose === 'Commercial' ? 'Commercial spaces' : 'Homes for sale';

  return (
    <>
      <div className="listings-toolbar">
        <p className="results-count">
          <strong>{results.length}</strong> {results.length === 1 ? 'home' : 'homes'} found
        </p>
        <label className="small nowrap" htmlFor="sort-order">
          Sort by{' '}
          <select id="sort-order" className="select" style={{ width: 'auto', padding: '8px 34px 8px 12px' }} value={sort} onChange={(event) => setSort(event.target.value as SortKey)}>
            <option value="featured">Featured</option>
            <option value="price-asc">Price: low to high</option>
            <option value="price-desc">Price: high to low</option>
            <option value="area-desc">Area: large to small</option>
          </select>
        </label>
      </div>

      <div className="listings-layout">
        <Filters filters={filters} localities={localities} onChange={setFilters} />
        <div>
          {results.length > 0 ? (
            <div className="property-grid">
              {results.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          ) : (
            <div className="empty">
              <div className="empty__icon">
                <SlidersHorizontal size={24} />
              </div>
              <h3>No homes match your search</h3>
              <p>Try widening the budget or clearing a few filters to see more options.</p>
              <button type="button" className="btn btn--primary" onClick={() => setFilters({ purpose, city: '', locality: '', type: 'All', bedrooms: 'All', minPrice: '', maxPrice: '', minArea: '', maxArea: '', furnished: '' })}>
                Clear filters
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
