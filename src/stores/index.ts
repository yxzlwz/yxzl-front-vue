import { defineStore } from 'pinia';
import naiveui from '../plugins/naiveui';
import { _ } from '../i18n';

export const useStore = defineStore('__default__', {
  state: () => ({
    theme: 'light',
    locale: 'zh',
    user: {
      id: null,
      username: '',
      avatar: '',
      is_superuser: false,
      verified: false,
    },
  }),
  actions: {
    switchTheme() {
      this.theme = this.theme === 'dark' ? 'light' : 'dark';
    },
    setLocale(locale: string) {
      this.locale = locale;
      naiveui.message.info(_('locale.switch'));
    },
    logout() {
      this.user = {
        id: null,
        username: '',
        avatar: '',
        is_superuser: false,
        verified: false,
      };
    },
  },
  getters: {
    loggedIn(state) {
      return state.user.id ? true : false;
    },
  },
  persist: true,
});

export const useMenuStore = defineStore('menu', {
  state: () => ({
    sidebar_menu: [],
  }),
  actions: {
    setSidebarMenu(menu: any) {
      this.sidebar_menu = menu;
    },
  },
  persist: false,
});

export const useVerifyStore = defineStore('verify', {
  state: () => ({
    verified_at: 0,
    callback: () => {},
    show_verify: false,
  }),
  actions: {
    checkVerified(callback: Function) {
      this.callback = callback;
      console.log(Date.now() - this.verified_at);
      if (this.verified) {
        this.show_verify = false;
        this.callback();
      } else {
        this.show_verify = true;
      }
    },
  },
  getters: {
    verified(state) {
      return Date.now() - state.verified_at < 600000;
    },
  },
  persist: {
    storage: window.sessionStorage,
    paths: ['verified_at'],
  },
});

export default useStore;
