import { useEffect } from 'react';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import { Layout } from './components/Layout';
import { CompareTray } from './components/Compare';
import { Home } from './pages/Home';
import { Buy } from './pages/Buy';
import { Rent } from './pages/Rent';
import { NewProjects } from './pages/NewProjects';
import { Commercial } from './pages/Commercial';
import { Sell } from './pages/Sell';
import { About } from './pages/About';
import { Insights } from './pages/Insights';
import { Contact } from './pages/Contact';
import { Privacy } from './pages/Privacy';
import { PropertyDetail } from './pages/PropertyDetail';
import { Saved } from './pages/Saved';
import { NotFound } from './pages/NotFound';

function ScrollToTop() {
  const { pathname, search } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname, search]);
  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="/buy" element={<Buy />} />
          <Route path="/rent" element={<Rent />} />
          <Route path="/new-projects" element={<NewProjects />} />
          <Route path="/commercial" element={<Commercial />} />
          <Route path="/sell" element={<Sell />} />
          <Route path="/about" element={<About />} />
          <Route path="/insights" element={<Insights />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/property/:id" element={<PropertyDetail />} />
          <Route path="/saved" element={<Saved />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
      <CompareTray />
    </BrowserRouter>
  );
}