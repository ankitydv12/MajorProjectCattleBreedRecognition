import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from './locales/en/translation.json';
import hi from './locales/hi/translation.json';
import bn from './locales/bn/translation.json';
import te from './locales/te/translation.json';
import mr from './locales/mr/translation.json';
import ta from './locales/ta/translation.json';
// Add placeholder fallbacks for the rest for now (they are copied from english)
import gu from './locales/gu/translation.json';
import kn from './locales/kn/translation.json';
import ml from './locales/ml/translation.json';
import pa from './locales/pa/translation.json';
import or from './locales/or/translation.json';
import asLang from './locales/as/translation.json';
import mai from './locales/mai/translation.json';
import sat from './locales/sat/translation.json';
import ks from './locales/ks/translation.json';
import ne from './locales/ne/translation.json';
import sd from './locales/sd/translation.json';
import kok from './locales/kok/translation.json';
import dgo from './locales/dgo/translation.json';
import mni from './locales/mni/translation.json';
import brx from './locales/brx/translation.json';
import ur from './locales/ur/translation.json';

const resources = {
  en: { translation: en },
  hi: { translation: hi },
  bn: { translation: bn },
  te: { translation: te },
  mr: { translation: mr },
  ta: { translation: ta },
  gu: { translation: gu },
  kn: { translation: kn },
  ml: { translation: ml },
  pa: { translation: pa },
  or: { translation: or },
  as: { translation: asLang },
  mai: { translation: mai },
  sat: { translation: sat },
  ks: { translation: ks },
  ne: { translation: ne },
  sd: { translation: sd },
  kok: { translation: kok },
  dgo: { translation: dgo },
  mni: { translation: mni },
  brx: { translation: brx },
  ur: { translation: ur },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // React already safes from xss
    },
  });

export default i18n;
