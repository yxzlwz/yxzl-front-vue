<script lang="ts" setup>
import { isMobile } from './consts';
import Header from './Header.vue';
import Layout from './Layout.vue';
import NaiveApi from './components/NaiveApi.vue';
</script>

<template>
  <n-config-provider>
    <n-global-style />
    <n-message-provider>
      <NaiveApi />
      <n-layout
        :position="isMobile ? 'static' : 'absolute'"
        class="root-layout"
      >
        <Header />
        <Layout />
      </n-layout>
    </n-message-provider>
  </n-config-provider>
</template>
