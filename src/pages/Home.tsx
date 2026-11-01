import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  Award,
  Briefcase,
  Building2,
  KeyRound,
  Leaf,
  Search,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { CITIES, PURPOSES } from '../constants';
import { FEATURED_PROPERTIES } from '../data/properties';
import { PropertyCard } from '../components/PropertyCard';
import { AiSearchBox } from '../components/AiSearchBox';
import { EmiCalculator } from '../components/EmiCalculator';
import { MakeLeadCaptureModal } from '../components/MakeLeadCaptureModal';
import { useLanguage } from '../context/LanguageContext';
import heroImage from '../assets/estora-hero.png';
import type { ParsedSearchQuery } from '../utils/aiSearch';

export function Home() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [city, setCity] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [budget, setBudget] = useState('');
  const [bhk, setBhk] = useState('');

  const [makeModalOpen, setMakeModalOpen] = useState(false);

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const params = new URLSearchParams();
    if (city) params.set('city', city);
    if (propertyType) params.set('type', propertyType);
    if (budget) params.set('budget', budget);
    if (bhk) params.set('bedrooms', bhk);
    navigate(`/buy${params.toString() ? `?${params.toString()}` : ''}`);
  };

  const handleAiSearch = (parsed: ParsedSearchQuery) => {
    const targetPath = parsed.purpose === 'Rent'
      ? '/rent'
      : parsed.purpose === 'Commercial'
      ? '/commercial'
      : '/buy';

    const params = new URLSearchParams();
    if (parsed.city) params.set('city', parsed.city);
    if (parsed.locality) params.set('locality', parsed.locality);
    if (parsed.bedrooms) params.set('bedrooms', parsed.bedrooms);
    if (parsed.propertyType) params.set('type', parsed.propertyType);
    if (parsed.maxPrice) params.set('maxPrice', String(parsed.maxPrice));

    navigate(`${targetPath}${params.toString() ? `?${params.toString()}` : ''}`);
  };

  return (
    <>
      <section className="hero">
        <div className="container">
          <div className="hero__grid">
            <div>
              <span className="eyebrow">
                <Sparkles size={14} className="text-[#B08A3E] mr-1" />
                Estates &amp; Architecture
              </span>
              <h1 className="hero__title">{t('tagline')}</h1>
              <p className="hero__lede">
                {t('hero_sub')}
              </p>
              <div className="hero__actions flex flex-wrap gap-3">
                <Link to="/buy" className="btn btn--primary btn--lg">
                  {t('hero_cta_buy')}
                  <ArrowRight size={17} />
                </Link>
                <Link to="/rent" className="btn btn--outline btn--lg">
                  {t('hero_cta_rent')}
                </Link>
                <Link to="/new-projects" className="btn btn--outline btn--lg">
                  {t('hero_cta_projects')}
                </Link>
              </div>
              <div className="hero__meta">
                <span>
                  <ShieldCheck size={16} />
                  {t('rera_documented')}
                </span>
                <span>
                  <Award size={16} />
                  {t('verified_partners')}
                </span>
                <span>
                  <Leaf size={16} />
                  {t('thoughtful_design')}
                </span>
              </div>
            </div>
            <div className="hero__media">
              <img
                src={heroImage}
                alt="Modern luxury house architecture at dusk"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src =
                    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&auto=format&fit=crop&q=80';
                }}
              />
              <div className="hero__card">
                <ShieldCheck size={26} className="text-[#B08A3E]" />
                <div>
                  <strong>{t('rera_documented')}</strong>
                  <span>{t('rera_sub')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AI Search & Classic Filter Hub */}
      <section className="search-panel" aria-label="Search properties">
        <div className="container space-y-5">
          {/* AI Natural Language Search */}
          <div className="bg-white rounded-2xl p-4 border border-[#E6DCC8] shadow-sm">
            <AiSearchBox onSearch={handleAiSearch} />
          </div>

          {/* Quick Filter Form */}
          <form className="property-search" onSubmit={handleSearch}>
            <label className="search-field">
              <span>{t('city_label')}</span>
              <select value={city} onChange={(event) => setCity(event.target.value)}>
                <option value="">{t('all_cities')}</option>
                {CITIES.slice(0, 7).map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>
            <label className="search-field">
              <span>{t('type_label')}</span>
              <select value={propertyType} onChange={(event) => setPropertyType(event.target.value)}>
                <option value="">{t('all_types')}</option>
                {PURPOSES.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>
            <label className="search-field">
              <span>{t('budget_label')}</span>
              <select value={budget} onChange={(event) => setBudget(event.target.value)}>
                <option value="">{t('all_budgets')}</option>
                <option value="under-1cr">Under ₹1 Cr</option>
                <option value="1-2cr">₹1–2 Cr</option>
                <option value="2-5cr">₹2–5 Cr</option>
                <option value="above-5cr">Above ₹5 Cr</option>
              </select>
            </label>
            <label className="search-field">
              <span>{t('bedrooms_label')}</span>
              <select value={bhk} onChange={(event) => setBhk(event.target.value)}>
                <option value="">{t('all_bedrooms')}</option>
                <option value="2 BHK">2 BHK</option>
                <option value="3 BHK">3 BHK</option>
                <option value="4 BHK">4 BHK</option>
                <option value="5+ BHK">5+ BHK</option>
              </select>
            </label>
            <button className="btn btn--primary search-submit" type="submit">
              <Search size={17} aria-hidden="true" />
              <span>Search</span>
            </button>
          </form>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="section">
        <div className="container">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <span className="eyebrow">{t('sort_featured')}</span>
              <h2 className="section-title">Considered architectural addresses</h2>
              <p className="section-sub">
                A preview of residences currently in Estora curation with certified RERA filings.
              </p>
            </div>
            <Link to="/buy" className="btn btn--outline btn--sm self-start sm:self-auto">
              View all homes
              <ArrowRight size={15} />
            </Link>
          </div>
          <div className="property-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURED_PROPERTIES.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        </div>
      </section>

      {/* Category Pillars (Buy, Rent, New Projects, Commercial) */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link
              to="/buy"
              className="p-6 rounded-3xl bg-white border border-[#E6DCC8] hover:border-[#2F4A3C] shadow-sm hover:shadow-md transition-all group block text-inherit no-underline"
            >
              <div className="w-12 h-12 rounded-2xl bg-[#F3EBDD] text-[#2F4A3C] flex items-center justify-center mb-4 group-hover:bg-[#2F4A3C] group-hover:text-white transition-colors">
                <Sparkles size={22} />
              </div>
              <h3 className="font-serif text-lg font-bold text-[#1B1B18] m-0 mb-1">{t('nav_buy')}</h3>
              <p className="text-xs text-[#6B675E] leading-relaxed mb-4">
                Penthouses, sea-facing residences, and private villas for sale.
              </p>
              <span className="text-xs font-semibold text-[#2F4A3C] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                Browse Buy <ArrowRight size={13} />
              </span>
            </Link>

            <Link
              to="/rent"
              className="p-6 rounded-3xl bg-white border border-[#E6DCC8] hover:border-[#2F4A3C] shadow-sm hover:shadow-md transition-all group block text-inherit no-underline"
            >
              <div className="w-12 h-12 rounded-2xl bg-[#F3EBDD] text-[#2F4A3C] flex items-center justify-center mb-4 group-hover:bg-[#2F4A3C] group-hover:text-white transition-colors">
                <KeyRound size={22} />
              </div>
              <h3 className="font-serif text-lg font-bold text-[#1B1B18] m-0 mb-1">{t('nav_rent')}</h3>
              <p className="text-xs text-[#6B675E] leading-relaxed mb-4">
                Furnished high-rise apartments and estates for short or multi-year leases.
              </p>
              <span className="text-xs font-semibold text-[#2F4A3C] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                Browse Rent <ArrowRight size={13} />
              </span>
            </Link>

            <Link
              to="/new-projects"
              className="p-6 rounded-3xl bg-white border border-[#E6DCC8] hover:border-[#2F4A3C] shadow-sm hover:shadow-md transition-all group block text-inherit no-underline"
            >
              <div className="w-12 h-12 rounded-2xl bg-[#F3EBDD] text-[#2F4A3C] flex items-center justify-center mb-4 group-hover:bg-[#2F4A3C] group-hover:text-white transition-colors">
                <Building2 size={22} />
              </div>
              <h3 className="font-serif text-lg font-bold text-[#1B1B18] m-0 mb-1">{t('nav_new_projects')}</h3>
              <p className="text-xs text-[#6B675E] leading-relaxed mb-4">
                Pre-launch &amp; under-construction developments by India's top architects.
              </p>
              <span className="text-xs font-semibold text-[#2F4A3C] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                Explore Projects <ArrowRight size={13} />
              </span>
            </Link>

            <Link
              to="/commercial"
              className="p-6 rounded-3xl bg-white border border-[#E6DCC8] hover:border-[#2F4A3C] shadow-sm hover:shadow-md transition-all group block text-inherit no-underline"
            >
              <div className="w-12 h-12 rounded-2xl bg-[#F3EBDD] text-[#2F4A3C] flex items-center justify-center mb-4 group-hover:bg-[#2F4A3C] group-hover:text-white transition-colors">
                <Briefcase size={22} />
              </div>
              <h3 className="font-serif text-lg font-bold text-[#1B1B18] m-0 mb-1">{t('nav_commercial')}</h3>
              <p className="text-xs text-[#6B675E] leading-relaxed mb-4">
                Grade-A offices in BKC, Cyber City, and retail flagships in prime districts.
              </p>
              <span className="text-xs font-semibold text-[#2F4A3C] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                Commercial Hub <ArrowRight size={13} />
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* Embedded EMI Calculator on Home */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <EmiCalculator
            onApplyLoan={() => setMakeModalOpen(true)}
          />
        </div>
      </section>

      {/* City Hubs */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Metro Markets</span>
            <h2 className="section-title">Cities we curate</h2>
            <p className="section-sub">Considered micro-markets with verified masterplans.</p>
          </div>
          <div className="city-grid">
            {CITIES.map((cityName) => (
              <Link key={cityName} to={`/buy?city=${encodeURIComponent(cityName)}`} className="city-card">
                <div className="city-card__name">{cityName}</div>
                <div className="city-card__count">Curated properties</div>
                <div className="city-card__arrow">
                  <ArrowRight size={18} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Lead Capture Modal */}
      <MakeLeadCaptureModal
        isOpen={makeModalOpen}
        onClose={() => setMakeModalOpen(false)}
        leadType="loan_calc"
        propertyTitle="Home Loan Pre-Approval Consultation"
        initialMessage="Requesting home loan consultation and bank rate comparison."
      />
    </>
  );
}
