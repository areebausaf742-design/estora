import { ListingsExplorer } from '../components/ListingsExplorer';
import { useLanguage } from '../context/LanguageContext';
import { KeyRound, ShieldCheck, UserCheck } from 'lucide-react';

export function Rent() {
  const { t } = useLanguage();

  return (
    <section className="section">
      <div className="container">
        <div className="section-head mb-8">
          <span className="eyebrow flex items-center gap-2">
            <KeyRound size={14} className="text-[#B08A3E]" />
            {t('nav_rent')} &middot; Estora Living
          </span>
          <h1 className="section-title">
            Curated residences for lease.
          </h1>
          <p className="section-sub">
            Designer penthouses, serviced apartments, and private villas ready for immediate move-in across India's premier neighbourhoods.
          </p>

          <div className="flex flex-wrap gap-3 mt-4 pt-2 text-xs text-[#6B675E]">
            <span className="flex items-center gap-1.5 bg-[#F3EBDD] px-3 py-1 rounded-full text-[#1B1B18] font-medium">
              <UserCheck size={14} className="text-[#2F4A3C]" />
              Corporate Leases &amp; Expat Relocation
            </span>
            <span className="flex items-center gap-1.5 bg-[#F3EBDD] px-3 py-1 rounded-full text-[#1B1B18] font-medium">
              <ShieldCheck size={14} className="text-[#2F4A3C]" />
              Verified Owners &amp; Transparent Tenancy
            </span>
          </div>
        </div>

        <ListingsExplorer purpose="Rent" />
      </div>
    </section>
  );
}
