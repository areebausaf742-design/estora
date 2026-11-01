import { Link } from 'react-router-dom';
import { ArrowRight, Award, Leaf, ShieldCheck } from 'lucide-react';
import { CITIES, PURPOSES } from '../constants';
import { BRAND } from '../constants';
import { FEATURED_PROPERTIES } from '../data/properties';
import { PROJECTS } from '../data/projects';
import { INSIGHTS } from '../data/insights';
import { PropertyCard } from '../components/PropertyCard';
import { formatINR } from '../utils/format';

export function Home() {
  return (
    <>
      <section className="hero">
        <div className="container">
          <div className="hero__grid">
            <div>
              <span className="eyebrow">Estates &amp; Architecture</span>
              <h1 className="hero__title">Quiet luxury. Serious addresses.</h1>
              <p className="hero__lede">
                Estora is a premium real-estate practice in India, curating homes where design,
                land and light come together. Buy, rent and invest with confidence.
              </p>
              <div className="hero__actions">
                <Link to="/buy" className="btn btn--primary btn--lg">
                  Explore homes for sale
                  <ArrowRight size={17} />
                </Link>
                <Link to="/rent" className="btn btn--outline btn--lg">
                  Rent a home
                </Link>
              </div>
              <div className="hero__meta">
                <span>
                  <ShieldCheck size={16} />
                  RERA disclosures
                </span>
                <span>
                  <Award size={16} />
                  Verified partners
                </span>
                <span>
                  <Leaf size={16} />
                  Thoughtful design
                </span>
              </div>
            </div>
            <div className="hero__media">
              <img src="https://images.unsplash.com/photo-1502672260266-1c1ef1d79938?w=1200&q=80" alt="Modern house exterior at dusk" />
              <div className="hero__card">
                <ShieldCheck size={26} />
                <div>
                  <strong>RERA-documented processes</strong>
                  <span>Transparent paperwork and disclosures</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container">
        <div className="notice" style={{ marginBottom: 56 }}>
          <ShieldCheck size={20} />
          <span>{BRAND.disclosure}</span>
        </div>
      </div>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Featured</span>
            <h2 className="section-title">Homes our clients are considering</h2>
            <p className="section-sub">
              A preview of the residences currently in Estora curation. All details are illustrative samples.
            </p>
          </div>
          <div className="property-grid">
            {FEATURED_PROPERTIES.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: 40 }}>
            <Link to="/buy" className="btn btn--outline">
              View all homes
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container split">
          <div>
            <span className="eyebrow">For families</span>
            <h2 className="section-title">Homes for sale</h2>
            <p className="section-sub">
              Curated apartments, independent houses and villas across India's leading metros.
            </p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <Link to="/buy" className="btn btn--primary">
              Browse buy properties
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container split">
          <div>
            <span className="eyebrow">For residents</span>
            <h2 className="section-title">Homes for rent</h2>
            <p className="section-sub">
              Fully and semi-furnished residences for short and long stays in premium localities.
            </p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <Link to="/rent" className="btn btn--primary">
              Browse rent properties
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Markets</span>
            <h2 className="section-title">Cities we serve</h2>
            <p className="section-sub">Eight principal markets across India.</p>
          </div>
          <div className="city-grid">
            {CITIES.map((city) => {
              const count = FEATURED_PROPERTIES.filter((p) => p.city === city).length;
              return (
                <Link key={city} to={`/buy?city=${encodeURIComponent(city)}`} className="city-card">
                  <div className="city-card__name">{city}</div>
                  <div className="city-card__count">{count} curated sample listings</div>
                  <div className="city-card__arrow">
                    <ArrowRight size={18} />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">New launches</span>
            <h2 className="section-title">Upcoming residences</h2>
            <p className="section-sub">Pre-launch and under-construction sample developments.</p>
          </div>
          <div className="content-grid">
            {PROJECTS.slice(0, 3).map((project) => (
              <Link key={project.id} to="/new-projects" className="post-card">
                <span className="post-card__cat">{project.status}</span>
                <h3>{project.name}</h3>
                <p>{project.description}</p>
                <span className="post-card__meta">
                  <span>{project.city}</span>
                  <span>{project.possession}</span>
                </span>
              </Link>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: 40 }}>
            <Link to="/new-projects" className="btn btn--outline">
              All new projects
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Why Estora</span>
            <h2 className="section-title">A quieter way to buy</h2>
          </div>
          <div className="value-grid">
            <div className="value-card">
              <div className="value-card__icon"><Leaf size={22} /></div>
              <h3>Thoughtful design</h3>
              <p>Residences matched to light, climate and daily rituals of Indian living.</p>
            </div>
            <div className="value-card">
              <div className="value-card__icon"><ShieldCheck size={22} /></div>
              <h3>Transparent process</h3>
              <p>RERA-aligned workflows, clear pricing and honest disclosures.</p>
            </div>
            <div className="value-card">
              <div className="value-card__icon"><Award size={22} /></div>
              <h3>Curated network</h3>
              <p>An advisor team with deep knowledge of Indian property markets.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Insights</span>
            <h2 className="section-title">Notes on Indian living</h2>
          </div>
          <div className="content-grid">
            {INSIGHTS.slice(0, 3).map((insight) => (
              <Link key={insight.slug} to="/insights" className="post-card">
                <span className="post-card__cat">{insight.category}</span>
                <h3>{insight.title}</h3>
                <p>{insight.excerpt}</p>
                <span className="post-card__meta">
                  <span>{insight.date}</span>
                  <span>{insight.readMinutes} min read</span>
                </span>
              </Link>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: 40 }}>
            <Link to="/insights" className="btn btn--outline">
              Read insights
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="cta-panel">
            <h2>Begin your home search</h2>
            <p>Tell us what you are looking for and our advisors will curate a shortlist.</p>
            <div className="hero__actions">
              <Link to="/contact" className="btn btn--brass btn--lg">Talk to an advisor</Link>
              <Link to="/sell" className="btn btn--outline btn--lg" style={{ color: 'var(--ivory)', borderColor: 'rgba(253,251,247,0.5)' }}>Sell or list</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}