import { ListingsExplorer } from '../components/ListingsExplorer';
import { useLanguage } from '../context/LanguageContext';
import { ShieldCheck, Sparkles, Trophy } from 'lucide-react';

export function Buy() {
  const { t } = useLanguage();

  return (
    <section className="section">
      <div className="container">
        <div className="section-head mb-8">
          <span className="eyebrow flex items-center gap-2">
            <Sparkles size={14} className="text-[#B08A3E]" />
            {t('nav_buy')} &middot; Estora Prime
          </span>
          <h1 className="section-title">
            Find a home that feels like yours.
          </h1>
          <p className="section-sub">
            Curated verified residences across Mumbai, Bengaluru, Delhi NCR, Pune, Hyderabad, and Goa. Every address inspected and RERA-documented.
          </p>

          <div className="flex flex-wrap gap-4 mt-4 pt-2 text-xs text-[#6B675E]">
            <span className="flex items-center gap-1.5 bg-[#F3EBDD] px-3 py-1 rounded-full text-[#1B1B18] font-medium">
              <ShieldCheck size={14} className="text-[#2F4A3C]" />
              100% RERA Verified Titles
            </span>
            <span className="flex items-center gap-1.5 bg-[#F3EBDD] px-3 py-1 rounded-full text-[#1B1B18] font-medium">
              <Trophy size={14} className="text-[#B08A3E]" />
              Certified Architectural Standards
            </span>
          </div>
        </div>

        <ListingsExplorer purpose="Buy" />
      </div>
    </section>
  );
}
