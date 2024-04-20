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
      <n-layout style="margin: 2vh 2vw"> <RouterView /> </n-layout>
      <Footer />
    </n-layout>
  </n-layout>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue';
import { RouterView, useRoute } from 'vue-router';
import { isMobile } from './consts';
import handleMenuChange from './utils/handleMenuChange';
import { docsMenu, surlMenu, yiyanMenu } from './consts/menu';
import Footer from './Footer.vue';
import { useMenuStore } from './stores';

const route = useRoute(),
  menuStore = useMenuStore();

const showSider = ref(false);

const loadSider = () => {
  menuStore.setSidebarMenu(Array());
  if (!route.meta.showSider) {
    showSider.value = false;
    return;
  }

  if (route.name === 'docs') {
    menuStore.setSidebarMenu(docsMenu);
  } else if (route.name.indexOf('surl') === 0) {
    menuStore.setSidebarMenu(surlMenu);
  } else if (route.name.indexOf('yiyan') === 0) {
    menuStore.setSidebarMenu(yiyanMenu);
  }

  showSider.value =
    (!isMobile.value && menuStore.sidebar_menu.length && true) || false;
};
loadSider();
watch(() => route.name, loadSider);
</script>
