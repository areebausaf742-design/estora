import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Heart, Menu, Phone, X } from 'lucide-react';
import { BRAND, NAV_LINKS } from '../constants';
import { useSaved } from '../context/SavedContext';
import { Logo } from './Logo';

export function Header() {
  const [open, setOpen] = useState(false);
  const { savedCount } = useSaved();

  const closeNav = () => setOpen(false);

  return (
    <header className="site-header">
      <div className="header">
        <div className="header__inner">
          <Link to="/" className="brand" onClick={closeNav} aria-label="Estora home">
            <span className="brand__mark">
              <Logo size={20} />
            </span>
            <span>
              <span className="brand__name">Estora</span>
              <div className="brand__tag">Estates</div>
            </span>
          </Link>

          <nav className="nav" aria-label="Primary">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.href}
                to={link.href}
                end={link.href === '/'}
                className={({ isActive }) =>
                  `nav__link whitespace-nowrap${isActive ? ' nav__link--active' : ''}`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="header__actions">
            <Link to="/saved" className="icon-btn" aria-label={`Saved properties, ${savedCount} saved`}>
              <Heart size={18} />
              {savedCount > 0 ? <span className="icon-btn__count">{savedCount}</span> : null}
            </Link>
            <a className="header__phone" href="tel:+919000000000">
              <Phone size={15} />
              <span className="header__phone-text">{BRAND.phone}</span>
            </a>
            <Link to="/contact" className="btn btn--primary btn--sm">
              Enquire
            </Link>
            <button
              type="button"
              className="icon-btn nav-toggle"
              aria-expanded={open}
              aria-controls="mobile-nav"
              aria-label={open ? 'Close menu' : 'Open menu'}
              onClick={() => setOpen((current) => !current)}
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      <div className={`mobile-nav__scrim${open ? ' mobile-nav__scrim--open' : ''}`} onClick={closeNav} aria-hidden="true" />
      <nav
        id="mobile-nav"
        className={`mobile-nav${open ? ' mobile-nav--open' : ''}`}
        aria-label="Mobile"
      >
        <div className="mobile-nav__list">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.href}
              to={link.href}
              end={link.href === '/'}
              className={({ isActive }) =>
                `mobile-nav__link${isActive ? ' mobile-nav__link--active' : ''}`
              }
              onClick={closeNav}
            >
              {link.label}
            </NavLink>
          ))}
        </div>
      </nav>
    </header>
  );
}
