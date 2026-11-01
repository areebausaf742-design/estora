import { useState } from 'react';
import { Briefcase, Building, ChevronRight, FileText, ShieldCheck, Zap } from 'lucide-react';
import { ListingsExplorer } from '../components/ListingsExplorer';
import { useLanguage } from '../context/LanguageContext';
import { MakeLeadCaptureModal } from '../components/MakeLeadCaptureModal';

export function Commercial() {
  const { t } = useLanguage();
  const [enterpriseModalOpen, setEnterpriseModalOpen] = useState(false);

  return (
    <section className="section">
      <div className="container">
        {/* Page Head */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10 pb-6 border-b border-[#E6DCC8]">
          <div className="max-w-2xl">
            <span className="eyebrow flex items-center gap-2">
              <Briefcase size={14} className="text-[#B08A3E]" />
              {t('nav_commercial')} &middot; Estora Workspaces
            </span>
            <h1 className="section-title">
              {t('commercial_title')}
            </h1>
            <p className="section-sub">
              {t('commercial_sub')}
            </p>

            <div className="flex flex-wrap gap-3 mt-4 text-xs font-medium">
              <span className="flex items-center gap-1.5 bg-[#F3EBDD] px-3 py-1 rounded-full text-[#1B1B18]">
                <ShieldCheck size={14} className="text-[#2F4A3C]" />
                {t('comm_leed')}
              </span>
              <span className="flex items-center gap-1.5 bg-[#F3EBDD] px-3 py-1 rounded-full text-[#1B1B18]">
                <Zap size={14} className="text-[#B08A3E]" />
                {t('comm_power')}
              </span>
              <span className="flex items-center gap-1.5 bg-[#F3EBDD] px-3 py-1 rounded-full text-[#1B1B18]">
                <Building size={14} className="text-[#2F4A3C]" />
                Column-free plates
              </span>
            </div>
          </div>

          <div className="shrink-0">
            <button
              type="button"
              onClick={() => setEnterpriseModalOpen(true)}
              className="btn btn--primary flex items-center gap-2"
            >
              <FileText size={16} />
              <span>Request Enterprise Lease Dossier</span>
              <ChevronRight size={14} />
            </button>
          </div>
        </div>

        {/* Commercial Listings Explorer */}
        <ListingsExplorer purpose="Commercial" />

        {/* Enterprise Lead Capture Modal */}
        <MakeLeadCaptureModal
          isOpen={enterpriseModalOpen}
          onClose={() => setEnterpriseModalOpen(false)}
          leadType="commercial"
          propertyTitle="Estora Corporate Advisory & Commercial Portfolio"
          initialMessage="Looking for commercial office / retail space for our organization. Require lease terms and floor plans."
        />
      </div>
    </section>
  );
}
