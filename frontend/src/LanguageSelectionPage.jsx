import React from 'react';
import { useTranslation } from 'react-i18next';
import { languages, rtlLanguages } from './languages';
import './LanguageSelectionPage.css';

function LanguageSelectionPage({ onLanguageSelected }) {
  const { i18n, t } = useTranslation();

  const handleLanguageSelect = (code) => {
    i18n.changeLanguage(code);
    localStorage.setItem('hasSelectedLanguage', 'true');
    localStorage.setItem('i18nextLng', code);

    // Set RTL/LTR direction
    if (rtlLanguages.includes(code)) {
      document.documentElement.dir = 'rtl';
      document.body.classList.add('rtl');
    } else {
      document.documentElement.dir = 'ltr';
      document.body.classList.remove('rtl');
    }

    // Set font class
    document.body.className = document.body.className.replace(/\blang-[^\s]*\b/g, '').trim();
    document.body.classList.add(`lang-${code}`);

    onLanguageSelected();
  };

  return (
    <div className="lang-selection-container">
      <div className="lang-selection-content">
        <h1 className="lang-selection-title">{t('lang_selection.title')}</h1>

        <div className="lang-grid">
          {languages.map((lang) => (
            <div
              key={lang.code}
              className="lang-card"
              onClick={() => handleLanguageSelect(lang.code)}
            >
              <div className="lang-native">{lang.native}</div>
              <div className="lang-english">{lang.name}</div>
              <div className="lang-region">{lang.region}</div>
            </div>
          ))}
        </div>

        <button
          className="continue-en-btn"
          onClick={() => handleLanguageSelect('en')}
        >
          {t('lang_selection.continue_en')}
        </button>
      </div>
    </div>
  );
}

export default LanguageSelectionPage;
