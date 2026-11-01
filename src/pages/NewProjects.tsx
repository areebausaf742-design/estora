import { useState } from 'react';
import { Building2, Calendar, CheckCircle2, Download, MapPin } from 'lucide-react';
import { PROJECTS, type Project } from '../data/projects';
import { formatINR } from '../utils/format';
import { ImageWithFallback } from '../components/ImageWithFallback';
import { MakeLeadCaptureModal } from '../components/MakeLeadCaptureModal';
import { useLanguage } from '../context/LanguageContext';

export function NewProjects() {
  const { t } = useLanguage();
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [selectedCity, setSelectedCity] = useState<string>('All');

  const [modalOpen, setModalOpen] = useState(false);
  const [modalProps, setModalProps] = useState<{
    projectTitle: string;
    projectId: string;
    projectPrice: number;
    leadType: 'site_visit' | 'brochure';
  }>({
    projectTitle: '',
    projectId: '',
    projectPrice: 0,
    leadType: 'site_visit',
  });

  const filteredProjects = PROJECTS.filter((p) => {
    if (statusFilter !== 'All' && p.status !== statusFilter) return false;
    if (selectedCity !== 'All' && p.city !== selectedCity) return false;
    return true;
  });

  const cities = ['All', 'Mumbai', 'Bengaluru', 'Delhi NCR', 'Pune'];

  const handleOpenLead = (project: Project, type: 'site_visit' | 'brochure') => {
    setModalProps({
      projectTitle: `${project.name} by ${project.developer} (${project.locality}, ${project.city})`,
      projectId: project.id,
      projectPrice: project.priceFrom,
      leadType: type,
    });
    setModalOpen(true);
  };

  return (
    <section className="section">
      <div className="container">
        {/* Page Head */}
        <div className="section-head mb-8">
          <span className="eyebrow flex items-center gap-2">
            <Building2 size={14} className="text-[#B08A3E]" />
            {t('nav_new_projects')} &middot; Architectural Landmarks
          </span>
          <h1 className="section-title">{t('projects_title')}</h1>
          <p className="section-sub">{t('projects_sub')}</p>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-4 border-b border-[#E6DCC8]">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {['All', 'Pre-launch', 'Under construction', 'Ready to move'].map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => setStatusFilter(status)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all whitespace-nowrap ${
                  statusFilter === status
                    ? 'bg-[#2F4A3C] text-white shadow-sm'
                    : 'bg-[#F3EBDD] text-[#1B1B18] hover:bg-[#E6DCC8]'
                }`}
              >
                {status === 'All' ? t('project_status_all') : status}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-[#6B675E]">{t('city_label')}:</span>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="select text-xs"
              style={{ width: 'auto', padding: '6px 28px 6px 10px', height: 'auto' }}
            >
              {cities.map((c) => (
                <option key={c} value={c}>
                  {c === 'All' ? t('all_cities') : c}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="project-card bg-white rounded-3xl border border-[#E6DCC8] overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                {/* Media Banner */}
                <div className="relative aspect-[16/9] overflow-hidden bg-[#E6DCC8]">
                  <ImageWithFallback
                    src={project.thumbnail}
                    alt={project.name}
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                  />
                  <div className="absolute top-4 left-4 flex gap-2 z-10">
                    <span className="badge bg-[#1B1B18]/85 text-white backdrop-blur-md border border-white/20">
                      {project.status}
                    </span>
                    <span className="badge bg-[#2F4A3C] text-white">
                      RERA: {project.reraNumber}
                    </span>
                  </div>
                  <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-[#1B1B18] shadow">
                    {project.units}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-center justify-between text-xs text-[#B08A3E] font-semibold tracking-wider uppercase mb-1">
                    <span>{project.developer}</span>
                    <span className="flex items-center gap-1 text-[#6B675E]">
                      <MapPin size={12} />
                      {project.locality}, {project.city}
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#1B1B18] m-0 mb-2">
                    {project.name}
                  </h3>

                  <p className="text-xs text-[#6B675E] line-clamp-2 mb-4 leading-relaxed">
                    {project.description}
                  </p>

                  {/* Configurations */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {project.configurations.map((cfg) => (
                      <span
                        key={cfg}
                        className="text-[11px] font-medium px-2.5 py-1 rounded-lg bg-[#F3EBDD] text-[#1B1B18]"
                      >
                        {cfg}
                      </span>
                    ))}
                  </div>

                  {/* Highlights */}
                  <div className="space-y-1.5 pt-3 border-t border-[#E6DCC8] text-xs text-[#1B1B18]">
                    {project.features.slice(0, 3).map((feat) => (
                      <div key={feat} className="flex items-center gap-2">
                        <CheckCircle2 size={13} className="text-[#2F4A3C] shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Card Footer */}
              <div className="p-6 pt-0">
                <div className="pt-4 border-t border-[#E6DCC8] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-[11px] uppercase tracking-wider text-[#6B675E] block">
                      {t('project_starting_from')}
                    </span>
                    <strong className="text-lg font-bold text-[#2F4A3C]">
                      {formatINR(project.priceFrom)}
                    </strong>
                    <span className="text-[11px] text-[#6B675E] block mt-0.5">
                      {t('project_possession')}: {project.possession}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleOpenLead(project, 'brochure')}
                      className="btn btn--outline btn--sm flex items-center gap-1.5 text-xs py-2 px-3"
                    >
                      <Download size={13} />
                      <span>Brochure</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleOpenLead(project, 'site_visit')}
                      className="btn btn--primary btn--sm flex items-center gap-1.5 text-xs py-2 px-3.5"
                    >
                      <Calendar size={13} />
                      <span>Book Visit</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Lead Capture Modal for Site Visit / Brochure */}
        <MakeLeadCaptureModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          propertyTitle={modalProps.projectTitle}
          propertyId={modalProps.projectId}
          propertyPrice={modalProps.projectPrice}
          leadType={modalProps.leadType}
        />
      </div>
    </section>
  );
}
