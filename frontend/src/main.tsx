import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { LANGUAGES } from './lib/i18n.ts'

// Set default language direction based on stored preference
const savedLang = localStorage.getItem('agrismart_lang') || 'ur';
const langConfig = LANGUAGES.find(l => l.code === savedLang);
document.documentElement.dir = langConfig?.dir || 'rtl';
document.documentElement.lang = savedLang;

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
