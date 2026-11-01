import { Award, Compass, Leaf, ShieldCheck, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export function About() {
  const values = [
    {
      icon: ShieldCheck,
      title: 'Architectural Integrity',
      desc: 'We decline 92% of inventory submitted to us. We exclusively represent homes crafted with enduring materials, natural ventilation, and architectural pedigree.',
    },
    {
      icon: Sparkles,
      title: 'Absolute Discretion',
      desc: 'Our private client practice serves founders, collectors, and corporate trustees with ironclad confidentiality and vetted, qualified buyer introductions.',
    },
    {
      icon: Award,
      title: 'RERA-Certified Rigor',
      desc: 'Every title deed, encumbrance certificate, and environmental approval is audited by our in-house legal counsel before a residence enters our catalog.',
    },
    {
      icon: Leaf,
      title: 'Ecological Responsibility',
      desc: 'We advocate for biophilic estates, water harvesting, solar efficiency, and green buildings certified by IGBC and LEED standards.',
    },
  ];

  return (
    <section className="section">
      <div className="container max-w-4xl">
        <div className="section-head text-center max-w-2xl mx-auto mb-16">
          <span className="eyebrow flex items-center justify-center gap-2">
            <Compass size={14} className="text-[#B08A3E]" />
            About Estora Estates
          </span>
          <h1 className="section-title">Quiet luxury. Serious addresses.</h1>
          <p className="section-sub">
            Founded on the belief that a home is an intimate dialogue between human aspiration, land, and light.
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-[#E6DCC8] p-8 sm:p-12 mb-12 shadow-sm space-y-6 text-[#1B1B18]/85 leading-relaxed text-sm sm:text-base">
          <p>
            Estora was established to provide an antidote to the frenzy of mainstream Indian real estate portals. We operate not as transactional listing brokers, but as architectural curators and trusted private client fiduciaries.
          </p>
          <p>
            Across Mumbai's coastal boulevards, Bengaluru's verdant canopy roads, Gurugram's golf course skylines, and Goa's heritage estates, our portfolio comprises solely properties that demonstrate thoughtful spatial planning, structural craftsmanship, and clear legal pedigree.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-16">
          {values.map((val) => (
            <div
              key={val.title}
              className="p-6 rounded-2xl bg-white border border-[#E6DCC8] shadow-sm hover:border-[#2F4A3C] transition-colors"
            >
              <div className="w-10 h-10 rounded-xl bg-[#F3EBDD] text-[#2F4A3C] flex items-center justify-center mb-4">
                <val.icon size={20} />
              </div>
              <h3 className="font-serif text-lg font-bold text-[#1B1B18] m-0 mb-2">{val.title}</h3>
              <p className="text-xs text-[#6B675E] leading-relaxed m-0">{val.desc}</p>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link to="/buy" className="btn btn--primary btn--lg">
            Explore Curated Homes
          </Link>
        </div>
      </div>
    </section>
  );
}
