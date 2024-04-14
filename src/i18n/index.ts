import { createI18n } from 'vue-i18n';
import enLocale from './en';
import zhLocale from './zh';

const messages = {
  en: {
    ...enLocale,
  },
  zh: {
    ...zhLocale,
  },
};

const i18n = createI18n({
  legacy: false,
  locale: 'zh',
  fallbackLocale: 'zh',
  messages: messages, // 设置资源文件对象
});


export default i18n;
export const _ = i18n.global.t;
