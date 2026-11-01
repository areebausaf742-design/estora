import { ShieldCheck } from 'lucide-react';

export function Privacy() {
  return (
    <section className="section">
      <div className="container max-w-3xl">
        <div className="section-head mb-8">
          <span className="eyebrow flex items-center gap-2">
            <ShieldCheck size={14} className="text-[#B08A3E]" />
            Data Protection &amp; Confidentiality
          </span>
          <h1 className="section-title">Privacy Policy</h1>
          <p className="section-sub">
            How Estora collects, protects, and handles private client inquiries and property documents.
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-[#E6DCC8] p-8 sm:p-12 shadow-sm space-y-6 text-sm text-[#1B1B18]/85 leading-relaxed">
          <h3 className="text-base font-serif font-bold text-[#1B1B18] m-0">1. Client Confidentiality</h3>
          <p className="m-0">
            Estora operates on strict principles of discretionary privacy. We do not sell, rent, or publicly disclose client identities, investment budgets, or shortlisted residences to third-party telemarketing networks.
          </p>

          <h3 className="text-base font-serif font-bold text-[#1B1B18] m-0">2. Lead Processing via Make.com</h3>
          <p className="m-0">
            When you submit an inquiry, book a private site visit, or request loan assistance, your contact details are transmitted over encrypted HTTPS channels to our Make.com (Integromat) orchestration workflows for immediate routing to our designated estate directors.
          </p>

          <h3 className="text-base font-serif font-bold text-[#1B1B18] m-0">3. RERA Disclosures</h3>
          <p className="m-0">
            All prospective home buyer data collected is handled in compliance with applicable Real Estate (Regulation and Development) Act (RERA) statutory requirements and Indian data protection norms.
          </p>
        </div>
      </div>
    </section>
  );
}
