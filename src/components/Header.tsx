import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Globe, Heart, Menu, Phone, Settings, X } from 'lucide-react';
import { BRAND, NAV_LINKS, WHATSAPP_URL } from '../constants';
import { useSaved } from '../context/SavedContext';
import { useLanguage } from '../context/LanguageContext';
import { Logo } from './Logo';
import { MakeLeadCaptureModal } from './MakeLeadCaptureModal';

export function Header() {
  const [open, setOpen] = useState(false);
  const [makeModalOpen, setMakeModalOpen] = useState(false);
  const { savedCount } = useSaved();
  const { language, toggleLanguage, t } = useLanguage();

  const closeNav = () => setOpen(false);

  // Map nav links to translation keys
  const getNavLabel = (href: string, fallback: string) => {
    switch (href) {
      case '/': return t('nav_home');
      case '/buy': return t('nav_buy');
      case '/rent': return t('nav_rent');
      case '/new-projects': return t('nav_new_projects');
      case '/commercial': return t('nav_commercial');
      case '/sell': return t('nav_sell');
      case '/about': return t('nav_about');
      case '/insights': return t('nav_insights');
      case '/contact': return t('nav_contact');
      default: return fallback;
    }
  };

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
            {NAV_LINKS.map((link) =>
              link.href === '/contact' ? (
                <a key={link.href} href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="nav__link whitespace-nowrap">
                  {getNavLabel(link.href, link.label)}
                </a>
              ) : (
                <NavLink
                  key={link.href}
                  to={link.href}
                  end={link.href === '/'}
                  className={({ isActive }) =>
                    `nav__link whitespace-nowrap${isActive ? ' nav__link--active' : ''}`
                  }
                >
                  {getNavLabel(link.href, link.label)}
                </NavLink>
              ),
            )}
          </nav>

          <div className="header__actions flex items-center gap-2">
            {/* Hindi / English Language Switcher Toggle */}
            <button
              type="button"
              onClick={toggleLanguage}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border border-[#E6DCC8] hover:border-[#2F4A3C] bg-[#FBF8F2] text-xs font-semibold text-[#1B1B18] transition-all cursor-pointer"
              title={language === 'en' ? 'Switch to Hindi (हिंदी)' : 'Switch to English'}
              aria-label={language === 'en' ? 'Switch to Hindi' : 'Switch to English'}
            >
              <Globe size={14} className="text-[#2F4A3C]" />
              <span className="font-sans">{language === 'en' ? 'हिंदी' : 'EN'}</span>
            </button>

            {/* Make.com CRM Webhook Settings Trigger */}
            <button
              type="button"
              onClick={() => setMakeModalOpen(true)}
              className="p-2 rounded-full text-[#6B675E] hover:text-[#1B1B18] hover:bg-[#E6DCC8]/40 transition-colors"
              title="Make.com CRM Lead Sync"
              aria-label="Make.com CRM Lead Sync"
            >
              <Settings size={17} />
            </button>

            <Link to="/saved" className="icon-btn" aria-label={`Saved properties, ${savedCount} saved`}>
              <Heart size={18} />
              {savedCount > 0 ? <span className="icon-btn__count">{savedCount}</span> : null}
            </Link>

            <a className="header__phone hidden sm:inline-flex" href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" aria-label="Chat with Estora on WhatsApp">
              <Phone size={14} />
              <span className="header__phone-text">{BRAND.phone}</span>
            </a>

            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="btn btn--primary btn--sm hidden md:inline-flex">
              {t('nav_enquire')}
            </a>

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
          <div className="p-4 border-b border-[#E6DCC8] flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#6B675E]">Language / भाषा</span>
            <button
              type="button"
              onClick={toggleLanguage}
              className="px-3 py-1.5 rounded-full bg-[#2F4A3C] text-white text-xs font-semibold"
            >
              {language === 'en' ? 'Switch to हिंदी' : 'Switch to English'}
            </button>
          </div>

          {NAV_LINKS.map((link) =>
            link.href === '/contact' ? (
              <a key={link.href} href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="mobile-nav__link" onClick={closeNav}>
                {getNavLabel(link.href, link.label)}
              </a>
            ) : (
              <NavLink
                key={link.href}
                to={link.href}
                end={link.href === '/'}
                className={({ isActive }) =>
                  `mobile-nav__link${isActive ? ' mobile-nav__link--active' : ''}`
                }
                onClick={closeNav}
              >
                {getNavLabel(link.href, link.label)}
              </NavLink>
            ),
          )}
        </div>
      </nav>

      {/* Make.com CRM Webhook Modal */}
      <MakeLeadCaptureModal
        isOpen={makeModalOpen}
        onClose={() => setMakeModalOpen(false)}
        leadType="enquiry"
      />
    </header>
  );
}
