<script lang="ts" setup>
import { zhCN, dateZhCN, darkTheme } from 'naive-ui';
import { isMobile } from './consts';
import Header from './Header.vue';
import Layout from './Layout.vue';
import NaiveApi from './components/NaiveApi.vue';
import { RouterView } from 'vue-router';
import { useStore } from './stores';
import i18n from './i18n';

const store = useStore();
i18n.global.locale.value = store.locale;
</script>

<template>
  <n-config-provider
    :locale="zhCN"
    :date-locale="dateZhCN"
    :theme="store.theme === 'dark' ? darkTheme : null"
  >
    <n-global-style />
    <n-loading-bar-provider>
      <n-message-provider>
        <n-dialog-provider>
          <NaiveApi />
          <n-layout
            :position="isMobile ? 'static' : 'absolute'"
            class="root-layout"
          >
            <Header />
            <Layout />
            <!-- <RouterView /> -->
          </n-layout>
        </n-dialog-provider>
      </n-message-provider>
    </n-loading-bar-provider>
  </n-config-provider>
</template>
