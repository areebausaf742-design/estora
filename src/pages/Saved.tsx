import { Link } from 'react-router-dom';
import { Heart, Trash2 } from 'lucide-react';
import { useSaved } from '../context/SavedContext';
import { PROPERTIES } from '../data/properties';
import { PropertyCard } from '../components/PropertyCard';
import { useLanguage } from '../context/LanguageContext';

export function Saved() {
  const { savedIds, clearSaved } = useSaved();
  const { t } = useLanguage();

  const savedProperties = PROPERTIES.filter((p) => savedIds.includes(p.id));

  return (
    <section className="section">
      <div className="container">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 pb-6 border-b border-[#E6DCC8]">
          <div>
            <span className="eyebrow flex items-center gap-2">
              <Heart size={14} className="text-[#B08A3E]" />
              {t('nav_saved')} Portfolio
            </span>
            <h1 className="section-title">Your Shortlisted Residences</h1>
            <p className="section-sub">
              {savedProperties.length} {savedProperties.length === 1 ? 'home' : 'homes'} saved for review.
            </p>
          </div>

          {savedProperties.length > 0 && (
            <button
              type="button"
              onClick={clearSaved}
              className="btn btn--outline btn--sm flex items-center gap-1.5 self-start sm:self-auto text-xs"
            >
              <Trash2 size={14} />
              <span>Clear shortlist</span>
            </button>
          )}
        </div>

        {savedProperties.length === 0 ? (
          <div className="bg-white rounded-3xl border border-[#E6DCC8] p-12 text-center max-w-lg mx-auto shadow-sm">
            <div className="w-16 h-16 rounded-full bg-[#F3EBDD] text-[#B08A3E] flex items-center justify-center mx-auto mb-4">
              <Heart size={28} />
            </div>
            <h3 className="font-serif text-xl font-bold text-[#1B1B18] mb-2">No residences shortlisted yet</h3>
            <p className="text-xs text-[#6B675E] leading-relaxed mb-6">
              Click the heart icon on any residence in Buy, Rent, or Commercial to curate your private portfolio.
            </p>
            <div className="flex justify-center gap-3">
              <Link to="/buy" className="btn btn--primary btn--sm">
                Explore Buy
              </Link>
              <Link to="/rent" className="btn btn--outline btn--sm">
                Explore Rent
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedProperties.map((prop) => (
              <PropertyCard key={prop.id} property={prop} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
