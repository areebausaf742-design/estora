import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { SavedProvider } from './context/SavedContext';
import App from './App';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SavedProvider>
      <App />
    </SavedProvider>
  </StrictMode>,
);