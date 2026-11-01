import { BookOpen, Calendar, Clock } from 'lucide-react';
import { INSIGHTS } from '../data/insights';

export function Insights() {
  return (
    <section className="section">
      <div className="container max-w-5xl">
        <div className="section-head mb-12">
          <span className="eyebrow flex items-center gap-2">
            <BookOpen size={14} className="text-[#B08A3E]" />
            Editorial &amp; Research
          </span>
          <h1 className="section-title">Estora Market Insights</h1>
          <p className="section-sub">
            Quarterly market intelligence, legal due diligence advisories, and architectural essays on luxury living in India.
          </p>
        </div>

        <div className="space-y-8">
          {INSIGHTS.map((item) => (
            <article
              key={item.slug}
              className="bg-white rounded-3xl border border-[#E6DCC8] p-8 sm:p-10 shadow-sm hover:border-[#2F4A3C] transition-colors"
            >
              <div className="flex items-center gap-3 text-xs text-[#B08A3E] font-bold uppercase tracking-wider mb-2">
                <span className="px-2.5 py-0.5 rounded-full bg-[#F3EBDD] text-[#1B1B18]">
                  {item.category}
                </span>
                <span className="flex items-center gap-1 text-[#6B675E]">
                  <Calendar size={12} />
                  {item.date}
                </span>
                <span className="flex items-center gap-1 text-[#6B675E]">
                  <Clock size={12} />
                  {item.readMinutes} min read
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#1B1B18] m-0 mb-3">
                {item.title}
              </h2>

              <p className="text-sm text-[#6B675E] leading-relaxed mb-6">
                {item.excerpt}
              </p>

              <div className="space-y-3 pt-4 border-t border-[#E6DCC8] text-sm text-[#1B1B18]/85 leading-relaxed">
                {item.body.map((para, i) => (
                  <p key={i} className="m-0">{para}</p>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
