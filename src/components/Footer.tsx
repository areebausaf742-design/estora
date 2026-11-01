import { Link } from 'react-router-dom';
import { Mail, MapPin, Phone } from 'lucide-react';
import { BRAND, CITIES, NAV_LINKS } from '../constants';

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="site-footer__top">
          <div className="site-footer__brand">
            <Link to="/" className="brand" style={{ marginBottom: 18 }} aria-label="Estora home">
              <span className="brand__mark">
                <svg width="20" height="20" viewBox="0 0 64 64" role="img" aria-label="">
                  <rect width="64" height="64" rx="16" fill="#3A5A4A" />
                  <path d="M17 46 V20a9 9 0 0 1 9-9h14a9 9 0 0 1 9 9v26" fill="none" stroke="#C5A059" strokeWidth="4" strokeLinecap="round" />
                  <path d="M23 46 V24a2.5 2.5 0 0 1 2.5-2.5h7A2.5 2.5 0 0 1 35 24v22" fill="none" stroke="#FDFBF7" strokeWidth="2.5" strokeLinecap="round" opacity="0.9" />
                </svg>
              </span>
              <span className="brand__name" style={{ color: 'var(--ivory)' }}>
                Estora
              </span>
            </Link>
            <p>{BRAND.tagline}</p>
            <p className="small">{BRAND.disclosure}</p>
          </div>

          <div>
            <h4>Explore</h4>
            <ul className="site-footer__links">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link to={link.href}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4>Cities</h4>
            <ul className="site-footer__links">
              {CITIES.map((city) => (
                <li key={city}>
                  <Link to={`/buy?city=${encodeURIComponent(city)}`}>{city}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4>Contact</h4>
            <ul className="site-footer__contact">
              <li>
                <MapPin size={16} />
                <span>{BRAND.corporateOffice}</span>
              </li>
              <li>
                <Phone size={16} />
                <a href="tel:+919000000000" style={{ color: 'inherit', textDecoration: 'none' }}>
                  {BRAND.phone}
                </a>
              </li>
              <li>
                <Mail size={16} />
                <a href={`mailto:${BRAND.email}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                  {BRAND.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="site-footer__bottom">
          <span>
            © {year} Estora. All rights reserved. Illustrative sample content for design preview.
          </span>
          <nav aria-label="Footer">
            <Link to="/privacy">Privacy Policy</Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}