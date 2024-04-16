<template>
  <n-layout
    :has-sider="showSider"
    :position="isMobile ? 'static' : 'absolute'"
    :style="{
      top: isMobile ? '' : 'var(--header-height)',
    }"
  >
    <n-layout-sider
      v-if="showSider"
      :native-scrollbar="false"
      :collapsed-width="0"
      collapse-mode="transform"
      trigger-style="top: 240px;"
      collapsed-trigger-style="top: 240px; right: -20px;"
      bordered
      show-trigger="arrow-circle"
    >
      <n-menu
        :options="menuOptions"
        @update:value="(key:string) => router.push({ name: key })"
      />
    </n-layout-sider>
    <n-layout
      ref="layoutInstRef"
      :scrollbar-props="{
        containerClass: 'document-scroll-container',
      }"
      :native-scrollbar="false"
      :position="isMobile || showSider ? 'static' : 'absolute'"
      content-style="min-height: calc(100vh - var(--header-height)); display: flex; flex-direction: column;"
    >
      <RouterView />
      <Footer />
    </n-layout>
  </n-layout>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { RouterView, useRoute } from 'vue-router';
import { isMobile } from './consts';
import routes2menu from './utils/routes2menu';
import router from './router';
import { docsRoutes } from './router/routes';
import Footer from './Footer.vue';

const route = useRoute();
console.log(route);

const _showSider = !isMobile.value && route.meta.showSider;
const menuOptions = ref(null);

// 判断是否是文档
if (route.name === 'docs'){
  
}

if (_showSider) {
  if (route.name?.indexOf('docs') === 0) {
    menuOptions.value = routes2menu(docsRoutes);
  }
}

const showSider = _showSider && menuOptions.value && true;
</script>
