<script lang="ts" setup>
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import MdEditor from '../../components/MdEditor.vue';

import Introduction from './introduction.md?raw';
import Surl_Api from './surl-api.md?raw';

const route = useRoute();
const content = ref('loading');

const init = () => {
  switch (route.name) {
    case 'docs-introduction':
      content.value = Introduction;
      break;
    case 'about':
      content.value = '### About';
      break;
    case 'docs-surl-api':
      content.value = Surl_Api;
      break;
  }
};
watch(() => route.name, init);
init();
</script>

<template>
  <MdEditor :content="content" previewOnly />
</template>
