import { Link } from 'react-router-dom';
import { Bath, Car, Heart, Ruler, Calculator } from 'lucide-react';
import type { Property } from '../types';
import { useSaved } from '../context/SavedContext';
import { formatArea, formatINR } from '../utils/format';
import { ImageWithFallback } from './ImageWithFallback';
import { useLanguage } from '../context/LanguageContext';
import { calculateHomeLoanEmi } from '../utils/emi';

interface PropertyCardProps {
  property: Property;
  onOpenEmi?: (property: Property) => void;
}

export function PropertyCard({ property, onOpenEmi }: PropertyCardProps) {
  const { isSaved, toggleSaved } = useSaved();
  const { t } = useLanguage();
  const saved = isSaved(property.id);

  const specs: Array<{ icon: typeof Ruler; label: string }> = [
    { icon: Ruler, label: `${formatArea(property.area)}` },
  ];
  if (property.bedrooms) {
    specs.push({ icon: Ruler, label: property.bedrooms });
  }
  if (property.bathrooms > 0) {
    specs.push({ icon: Bath, label: `${property.bathrooms} ${property.bathrooms === 1 ? t('bath') : t('baths')}` });
  }
  if (property.parking > 0) {
    specs.push({ icon: Car, label: `${property.parking} ${t('parking')}` });
  }

  // Pre-calculate approximate EMI for Buy properties
  const approximateEmi = property.purpose === 'Buy'
    ? calculateHomeLoanEmi({
        propertyPrice: property.price,
        downPaymentPercent: 20,
        annualInterestRate: 8.5,
        tenureYears: 20,
      }).monthlyEmi
    : null;

  return (
    <div className="property-card flex flex-col justify-between">
      <Link to={`/property/${property.id}`} className="property-card__link block text-inherit no-underline">
        <div className="property-card__media relative aspect-[16/10] overflow-hidden rounded-2xl bg-[#E6DCC8]">
          <ImageWithFallback
            src={property.thumbnail}
            alt={`${property.type} for ${property.purpose === 'Rent' ? 'rent' : 'sale'} in ${property.locality}, ${property.city}`}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            loading="lazy"
          />
          <div className="property-card__badges absolute top-3 left-3 flex gap-1.5 z-10">
            <span className={`badge badge--${property.purpose.toLowerCase()}`}>
              {property.purpose === 'Buy' ? t('badge_buy') : property.purpose === 'Rent' ? t('badge_rent') : t('badge_commercial')}
            </span>
            {property.isSample ? <span className="badge badge--sample">{t('badge_sample')}</span> : null}
          </div>
          <button
            type="button"
            className={`property-card__save absolute top-3 right-3 z-10${saved ? ' property-card__save--saved' : ''}`}
            aria-label={saved ? 'Remove property from saved list' : 'Save property'}
            aria-pressed={saved}
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              toggleSaved(property.id);
            }}
          >
            <Heart size={17} fill={saved ? 'currentColor' : 'none'} />
          </button>
        </div>

        <div className="property-card__body pt-4">
          <span className="property-card__city text-xs font-semibold uppercase tracking-wider text-[#B08A3E] block mb-1">
            {property.locality}, {property.city}
          </span>
          <h3 className="property-card__title text-lg font-serif font-bold text-[#1B1B18] m-0 mb-2 truncate">
            {property.type} {property.bedrooms ? `\u00B7 ${property.bedrooms}` : ''}
          </h3>
          <div className="property-card__meta flex flex-wrap gap-3 text-xs text-[#6B675E] mb-3">
            {specs.map((spec, index) => (
              <span key={`${spec.label}-${index}`} className="flex items-center gap-1">
                <spec.icon size={13} />
                {spec.label}
              </span>
            ))}
          </div>
        </div>
      </Link>

      <div className="property-card__foot pt-3 border-t border-[#E6DCC8]/60 flex items-center justify-between">
        <div className="price">
          <span className="price__value text-base font-bold text-[#2F4A3C]">
            {formatINR(property.price, property.purpose)}
          </span>
          <span className="price__unit block text-[11px] text-[#6B675E]">
            {property.purpose === 'Rent' ? t('per_month') : t('total_price')}
          </span>
        </div>

        {approximateEmi && (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onOpenEmi?.(property);
            }}
            className="flex items-center gap-1 text-[11px] font-semibold text-[#2F4A3C] bg-[#2F4A3C]/8 hover:bg-[#2F4A3C]/15 px-2.5 py-1.5 rounded-full transition-colors"
            title="Calculate EMI"
          >
            <Calculator size={12} className="text-[#B08A3E]" />
            <span>EMI ~₹{(approximateEmi / 1000).toFixed(0)}k</span>
          </button>
        )}
      </div>
    </div>
  );
}