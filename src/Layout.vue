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
        :options="menuStore.sidebar_menu"
        @update:value="handleMenuChange"
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
import { ref, watch } from 'vue';
import { RouterView, useRoute } from 'vue-router';
import { isMobile } from './consts';
import routes2menu from './utils/routes2menu';
import handleMenuChange from './utils/handleMenuChange';
import { docsMenu } from './consts/menu';
import Footer from './Footer.vue';
import { useMenuStore } from './stores';

const route = useRoute(),
  menuStore = useMenuStore();

let _showSider: any = false;
const showSider = ref(false);

const loadSider = () => {
  _showSider = (!isMobile.value && route.meta.showSider) || false;
  menuStore.setSidebarMenu(Array());

  if (route.name === 'docs') {
    menuStore.setSidebarMenu(docsMenu);
  }

  // if (_showSider) {
  //   if (route.name?.indexOf('docs') === 0) {
  //     menuOptions.value = routes2menu(docsRoutes);
  //   }
  // }

  showSider.value =
    (_showSider && menuStore.sidebar_menu.length && true) || false;
};
loadSider();
watch(() => route.name, loadSider);
</script>
