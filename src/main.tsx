import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { SavedProvider } from './context/SavedContext';
import { LanguageProvider } from './context/LanguageContext';
import App from './App';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LanguageProvider>
      <SavedProvider>
        <App />
      </SavedProvider>
    </LanguageProvider>
  </StrictMode>,
);