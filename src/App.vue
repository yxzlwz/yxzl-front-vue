<script lang="ts" setup>
import { zhCN, dateZhCN, darkTheme } from 'naive-ui';
import { isMobile } from './consts';
import Header from './Header.vue';
import Layout from './Layout.vue';
import NaiveApi from './components/NaiveApi.vue';
import { useStore } from './stores';
import i18n from './i18n';
import Axios from './plugins/axios';
import AccountSecurityCheck from './components/AccountSecurityCheck.vue';

const store = useStore();
i18n.global.locale.value = store.locale;

if (store.loggedIn) {
  Axios.get('/user/info/')
    .then(res => {
      store.user = res.data.user;
    })
    .catch(err => {
      if (err.response.status === 403) {
        store.logout();
      }
    });
}
</script>

<template>
  <n-config-provider
    :locale="zhCN"
    :date-locale="dateZhCN"
    :theme="store.theme === 'dark' ? darkTheme : null"
  >
    <n-global-style />
    <n-dialog-provider>
      <n-loading-bar-provider>
        <n-message-provider>
          <n-modal-provider>
            <n-notification-provider>
              <NaiveApi />
              <AccountSecurityCheck />
              <n-layout
                :position="isMobile ? 'static' : 'absolute'"
                class="root-layout"
              >
                <Header />
                <Layout />
                <!-- <RouterView /> -->
              </n-layout>
            </n-notification-provider>
          </n-modal-provider>
        </n-message-provider>
      </n-loading-bar-provider>
    </n-dialog-provider>
  </n-config-provider>
</template>
