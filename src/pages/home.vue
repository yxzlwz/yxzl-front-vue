<script lang="ts" setup>
import LinkCard from '../components/LinkCard.vue';
</script>

<template>
  <h1>异想之旅の工具箱</h1>
  <n-space style="justify-content: space-evenly">
    <LinkCard
      title="🔗短链接"
      description="支持自定义后缀的短链接服务"
      :to="{ name: 'surl-create' }"
    />
    <LinkCard
      title="💬亿言"
      description="异想之旅精选句子库，支持API"
      :to="{ name: 'yiyan-show' }"
    />
    <LinkCard
      title="🔑TOTP"
      description="在线TOTP保存服务，支持端到端加密"
      :to="{ name: 'totp' }"
    />
  </n-space>
</template>

<style scoped lang="scss">
.tool-card {
  display: flex;
  justify-content: center;
  // div.card {
  //   width: 100%;
  // }
}
</style>
