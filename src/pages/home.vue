<script lang="ts" setup>
import LinkCard from '../components/LinkCard.vue';
</script>

<template>
  <n-layout style="padding: 2vh 2vw">
    <h1>欢迎来到异想之旅的</h1>
    <n-grid
      n-grid
      cols="1 m:2 l:4 xl:4 xxl:5"
      x-gap="10"
      y-gap="10"
      style="margin: 0 2em; width: auto"
      item-responsive
      responsive="screen"
    >
      <n-gi>
        <LinkCard
          title="🔗短链接"
          description="支持自定义后缀的短链接服务"
          :to="{ name: 'docs-default' }"
        />
      </n-gi>
      <n-gi>
        <LinkCard title="短链接" description="/surl" />
      </n-gi>
    </n-grid>
  </n-layout>
</template>
