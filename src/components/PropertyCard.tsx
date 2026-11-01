import { Link } from 'react-router-dom';
import { Bath, Car, Heart, Ruler } from 'lucide-react';
import type { Property } from '../types';
import { useSaved } from '../context/SavedContext';
import { formatArea, formatINR } from '../utils/format';

interface PropertyCardProps {
  property: Property;
}

export function PropertyCard({ property }: PropertyCardProps) {
  const { isSaved, toggleSaved } = useSaved();
  const saved = isSaved(property.id);

  const specs: Array<{ icon: typeof Ruler; label: string }> = [
    { icon: Ruler, label: `${formatArea(property.area)} built` },
  ];
  if (property.bedrooms) {
    specs.push({ icon: Ruler, label: property.bedrooms });
  }
  if (property.bathrooms > 0) {
    specs.push({ icon: Bath, label: `${property.bathrooms} bath` });
  }
  if (property.parking > 0) {
    specs.push({ icon: Car, label: `${property.parking} parking` });
  }

  return (
    <Link to={`/property/${property.id}`} className="property-card">
      <div className="property-card__media">
        <img src={property.thumbnail} alt={`${property.type} for ${property.purpose === 'Rent' ? 'rent' : 'sale'} in ${property.locality}, ${property.city}`} loading="lazy" />
        <div className="property-card__badges">
          <span className={`badge badge--${property.purpose.toLowerCase()}`}>{property.purpose}</span>
          {property.isSample ? <span className="badge badge--sample">Sample</span> : null}
        </div>
        <button
          type="button"
          className={`property-card__save${saved ? ' property-card__save--saved' : ''}`}
          aria-label={saved ? 'Remove property from saved list' : 'Save property'}
          aria-pressed={saved}
          onClick={(event) => {
            event.preventDefault();
            toggleSaved(property.id);
          }}
        >
          <Heart size={17} fill={saved ? 'currentColor' : 'none'} />
        </button>
      </div>
      <div className="property-card__body">
        <span className="property-card__city">
          {property.locality}, {property.city}
        </span>
        <h3 className="property-card__title">{property.type}</h3>
        <div className="property-card__meta">
          {specs.map((spec, index) => (
            <span key={`${spec.label}-${index}`}>
              <spec.icon size={14} />
              {spec.label}
            </span>
          ))}
        </div>
        <div className="property-card__foot">
          <div className="price">
            <span className="price__value">{formatINR(property.price, property.purpose)}</span>
            <span className="price__unit">{property.purpose === 'Rent' ? 'per month' : 'total price'}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}