import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './i18n';
import LanguageSelectionPage from './LanguageSelectionPage';
import LanguageSwitcher from './LanguageSwitcher';
import HomePage from './pages/HomePage';
import PredictPage from './pages/PredictPage';
import BreedExplorerPage from './pages/BreedExplorerPage';
import AboutPage from './pages/AboutPage';
import SymptomCheckerPage from './pages/SymptomCheckerPage';
import VetFinderPage from './pages/VetFinderPage';
import ChatBot from './components/ChatBot';
import './App.css';

function App() {
  const { t, i18n } = useTranslation();
  const [showLangSelection, setShowLangSelection] = useState(!localStorage.getItem('hasSelectedLanguage'));

  useEffect(() => {
    const hasSelected = localStorage.getItem('hasSelectedLanguage');
    if (!hasSelected) {
      setShowLangSelection(true);
    } else {
      // Restore language specific settings
      const lang = i18n.language || 'en';
      const rtlLanguages = ['ur', 'ks', 'sd'];
      if (rtlLanguages.includes(lang)) {
        document.documentElement.dir = 'rtl';
        document.body.classList.add('rtl');
      }
      document.body.classList.add(`lang-${lang}`);
    }
  }, [i18n.language]);

  if (showLangSelection) {
    return <LanguageSelectionPage onLanguageSelected={() => setShowLangSelection(false)} />;
  }

  return (
    <Router>
      <nav className="navbar">
        <div className="navbar-inner">
          <NavLink to="/" className="navbar-brand">
            🐄 <span>CattleAI</span>
          </NavLink>
          <ul className="nav-links">
            <li><NavLink to="/" end>{t('nav.home')}</NavLink></li>
            <li><NavLink to="/predict">{t('nav.predict')}</NavLink></li>
            <li><NavLink to="/breeds">{t('nav.breeds')}</NavLink></li>
            <li><NavLink to="/symptom-checker">Symptom Checker</NavLink></li>
            <li><NavLink to="/vet-finder">🏥 Find Vet</NavLink></li>
            <li><NavLink to="/about">{t('nav.about')}</NavLink></li>
          </ul>
          <LanguageSwitcher />
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/predict" element={<PredictPage />} />
        <Route path="/breeds" element={<BreedExplorerPage />} />
        <Route path="/symptom-checker" element={<SymptomCheckerPage />} />
        <Route path="/vet-finder" element={<VetFinderPage />} />
        <Route path="/about" element={<AboutPage />} />
      </Routes>

      <footer className="footer">
        <p>
          {' '} · Powered by PyTorch & FastAPI · {new Date().getFullYear()}
        </p>
      </footer>
      <ChatBot />
    </Router>
  );
}

export default App;
