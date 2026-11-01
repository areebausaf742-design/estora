import { SlidersHorizontal } from 'lucide-react';
import type { FilterState } from '../types';
import { BEDROOMS, CITIES, PROPERTY_TYPES, PURPOSES } from '../constants';

interface FiltersProps {
  filters: FilterState;
  localities: string[];
  onChange: (next: FilterState) => void;
}

function toNumber(value: number | ''): string {
  return value === '' ? '' : String(value);
}

export function Filters({ filters, localities, onChange }: FiltersProps) {
  const set = (patch: Partial<FilterState>) => onChange({ ...filters, ...patch });

  const localityOptions = filters.city
    ? localities.filter((entry) => entry.toLowerCase() === filters.city.toLowerCase())
    : localities;

  return (
    <aside className="filters" aria-label="Property filters">
      <div className="filters__head">
        <h2 className="filters__title">
          <SlidersHorizontal size={18} style={{ verticalAlign: '-3px', marginRight: 8 }} />
          Filters
        </h2>
        <button type="button" className="filters__clear" onClick={() => onChange({ ...filters, city: '', locality: '', type: 'All', bedrooms: 'All', minPrice: '', maxPrice: '', minArea: '', maxArea: '', furnished: '' })}>
          Clear all
        </button>
      </div>

      <div className="filters__group">
        <p className="filters__legend">Purpose</p>
        <div className="filters__field">
          <label className="filters__group-label" htmlFor="filter-purpose">Purpose</label>
          <select
            id="filter-purpose"
            className="select"
            value={filters.purpose}
            onChange={(event) => set({ purpose: event.target.value as FilterState['purpose'] })}
          >
            <option value="All">All</option>
            {PURPOSES.map((purpose) => (
              <option key={purpose} value={purpose}>{purpose}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="filters__group">
        <p className="filters__legend">Location</p>
        <div className="filters__field">
          <label className="filters__group-label" htmlFor="filter-city">City</label>
          <select
            id="filter-city"
            className="select"
            value={filters.city}
            onChange={(event) => set({ city: event.target.value, locality: '' })}
          >
            <option value="">All cities</option>
            {CITIES.map((city) => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
        </div>
        <div className="filters__field">
          <label className="filters__group-label" htmlFor="filter-locality">Locality</label>
          <select
            id="filter-locality"
            className="select"
            value={filters.locality}
            onChange={(event) => set({ locality: event.target.value })}
          >
            <option value="">All localities</option>
            {localityOptions.map((locality) => (
              <option key={locality} value={locality}>{locality}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="filters__group">
        <p className="filters__legend">Configuration</p>
        <div className="filters__field">
          <label className="filters__group-label" htmlFor="filter-type">Property type</label>
          <select
            id="filter-type"
            className="select"
            value={filters.type}
            onChange={(event) => set({ type: event.target.value as FilterState['type'] })}
          >
            <option value="All">All types</option>
            {PROPERTY_TYPES.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
        <div className="filters__field">
          <label className="filters__group-label" htmlFor="filter-bedrooms">Bedrooms</label>
          <select
            id="filter-bedrooms"
            className="select"
            value={filters.bedrooms}
            onChange={(event) => set({ bedrooms: event.target.value as FilterState['bedrooms'] })}
          >
            <option value="All">Any</option>
            {BEDROOMS.map((bedroom) => (
              <option key={bedroom} value={bedroom}>{bedroom}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="filters__group">
        <p className="filters__legend">Budget &amp; size</p>
        <div className="filters__field">
          <label className="filters__group-label" htmlFor="filter-min-price">Min price</label>
          <input
            id="filter-min-price"
            className="input"
            type="number"
            min={0}
            inputMode="numeric"
            placeholder="Min"
            value={toNumber(filters.minPrice)}
            onChange={(event) => set({ minPrice: event.target.value === '' ? '' : Number(event.target.value) })}
          />
        </div>
        <div className="filters__field">
          <label className="filters__group-label" htmlFor="filter-max-price">Max price</label>
          <input
            id="filter-max-price"
            className="input"
            type="number"
            min={0}
            inputMode="numeric"
            placeholder="Max"
            value={toNumber(filters.maxPrice)}
            onChange={(event) => set({ maxPrice: event.target.value === '' ? '' : Number(event.target.value) })}
          />
        </div>
        <div className="filters__field">
          <label className="filters__group-label" htmlFor="filter-min-area">Min area</label>
          <input
            id="filter-min-area"
            className="input"
            type="number"
            min={0}
            inputMode="numeric"
            placeholder="Min sq. ft."
            value={toNumber(filters.minArea)}
            onChange={(event) => set({ minArea: event.target.value === '' ? '' : Number(event.target.value) })}
          />
        </div>
        <div className="filters__field">
          <label className="filters__group-label" htmlFor="filter-max-area">Max area</label>
          <input
            id="filter-max-area"
            className="input"
            type="number"
            min={0}
            inputMode="numeric"
            placeholder="Max sq. ft."
            value={toNumber(filters.maxArea)}
            onChange={(event) => set({ maxArea: event.target.value === '' ? '' : Number(event.target.value) })}
          />
        </div>
        <div className="filters__field">
          <label className="filters__group-label" htmlFor="filter-furnished">Furnishing</label>
          <select
            id="filter-furnished"
            className="select"
            value={filters.furnished}
            onChange={(event) => set({ furnished: event.target.value })}
          >
            <option value="">Any</option>
            <option value="Furnished">Furnished</option>
            <option value="Semi-furnished">Semi-furnished</option>
            <option value="Unfurnished">Unfurnished</option>
          </select>
        </div>
      </div>

      <div className="filters__actions">
        <button type="button" className="btn btn--primary btn--block" onClick={() => onChange({ ...filters })}>
          Apply filters
        </button>
      </div>
    </aside>
  );
}
