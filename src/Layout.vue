<template>
  <n-layout :has-sider="showSider" :position="isMobile ? 'static' : 'absolute'" :style="{
    top: isMobile ? '' : 'var(--header-height)'
  }">
    <n-layout-sider v-if="showSider" :native-scrollbar="false" :collapsed-width="0" collapse-mode="transform"
      trigger-style="top: 240px;" collapsed-trigger-style="top: 240px; right: -20px;" bordered
      show-trigger="arrow-circle">
      <!-- <n-menu :value="menuValue" :options="options" :render-label="renderMenuLabel" /> -->
      MENU
    </n-layout-sider>
    <n-layout ref="layoutInstRef" :scrollbar-props="{
      containerClass: 'document-scroll-container'
    }" :native-scrollbar="false" :position="isMobile || showSider ? 'static' : 'absolute'"
      content-style="min-height: calc(100vh - var(--header-height)); display: flex; flex-direction: column;">
      fdshjshjkshjah
      <Footer />
    </n-layout>
  </n-layout>
</template>

<script lang="ts" setup>
import Footer from './Footer.vue'
const showSider = false,
  isMobile = 0
</script>
