import { createApp } from 'vue';
import './styles/style.scss';
import App from './App.vue';
import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import router from './router';
import { VueReCaptcha } from 'vue-recaptcha-v3';

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

const app = createApp(App);
app
  .use(pinia)
  .use(router)
  .use(VueReCaptcha, {
    siteKey: '6LdiG9sfAAAAAIG2PGAE6mmgyLCZR6QTbatLalrq',
    loaderOptions: {
      customUrl: 'https://recaptcha.google.cn/recaptcha/api.js',
      autoHideBadge: true,
    },
  })
  .mount('#app');
