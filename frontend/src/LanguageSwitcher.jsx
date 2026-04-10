import React from 'react';
import { useTranslation } from 'react-i18next';
import { languages, rtlLanguages } from './languages';
import './LanguageSwitcher.css';

function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const handleLanguageChange = (e) => {
    const code = e.target.value;
    i18n.changeLanguage(code);
    localStorage.setItem('i18nextLng', code);

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
  };

  return (
    <div className="language-switcher">
      <span className="lang-icon">🌐</span>
      <select
        value={i18n.language || 'en'}
        onChange={handleLanguageChange}
        className="lang-select"
      >
        {languages.map(lang => (
          <option key={lang.code} value={lang.code}>
            {lang.native} ({lang.name})
          </option>
        ))}
      </select>
    </div>
  );
}

export default LanguageSwitcher;
