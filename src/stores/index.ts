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

export default useStore;
