import { createI18n } from 'vue-i18n';
import ja from './ja.json';

const messages = {
  ja
};

const i18n = createI18n({
  locale: 'ja',
  fallbackLocale: 'ja',
  messages
});

export default i18n;
