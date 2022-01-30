import { createI18n } from 'vue-i18n/index';

import ja from './ja.json';
import en from './en.json';
import es from './es.json';

import System from '../lib/System';

const messages = {
  ja, en, es
};

const i18n = createI18n({
  locale: System.language(),
  fallbackLocale: 'en',
  messages
});

export default i18n;
