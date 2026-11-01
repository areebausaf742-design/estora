import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import { PriceAssistant } from './PriceAssistant';

export function Layout() {
  return (
    <div className="app-shell">
      <a className="skip-link" href="#main">
        Skip to main content
      </a>
      <Header />
      <main id="main" className="app-main">
        <Outlet />
      </main>
      <Footer />
      <PriceAssistant />
    </div>
  );
}
