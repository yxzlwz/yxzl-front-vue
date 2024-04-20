<script setup lang="ts">
import Axios from '../../plugins/axios';
import { ref } from 'vue';

const _theme = ref(0);

const updateTheme = () => {
  _theme.value = Math.round(Math.random() * 1000) % 5;
};

const yiyan = ref<Yiyan>({
    id: 0,
    content: '',
    provenance: null,
    author: null,
    url: null,
    creator: null,
    from_show: '',
  }),
  loading = ref(false);

const getYiyan = async () => {
  loading.value = true;
  const time = Date.now();
  const res: Yiyan = (await Axios.get('/yiyan/sentence/get/')).data;
  if (res.provenance && res.author) {
    res.from_show = `${res.provenance} · ${res.author}`;
  } else {
    res.from_show = `${res.provenance || res.author}`;
  }
  setTimeout(() => {
    updateTheme();
    yiyan.value = res;
    loading.value = false;
  }, Math.max(0, 300 - (Date.now() - time)));
};
getYiyan();
</script>

<template>
  <h1 v-show="false">亿言</h1>
  <div
    :style="{
      height: 'calc(90vh - var(--header-height) - var(--footer-height))',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      userSelect: 'none',
      transition: 'all 0.5s',
      opacity: !loading ? 1 : 0,
    }"
    @click="getYiyan"
  >
    <h1 style="text-align: center">
      <n-gradient-text
        :type="['primary', 'info', 'danger', 'warning', 'success'][_theme]"
      >
        <div style="letter-spacing: 2px; font-weight: 600">
          {{ yiyan.content }}
        </div>
        <div
          v-show="yiyan.from_show"
          style="margin-top: 50px; letter-spacing: 2px"
        >
          - 「 {{ yiyan.from_show }} 」
        </div>
      </n-gradient-text>
    </h1>
  </div>
</template>
