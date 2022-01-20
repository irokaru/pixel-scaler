import { createI18n } from 'vue-i18n';

import ja from './ja.json';
import en from './en.json';

import System from '../lib/System';

const messages = {
  ja, en
};

const i18n = createI18n({
  locale: System.language(),
  fallbackLocale: 'ja',
  messages
});

export default i18n;
