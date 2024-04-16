<script lang="ts" setup>
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import MdEditor from '../components/MdEditor.vue';
const route = useRoute();
const content = ref('loading');

const init = () => {
  console.log(route.name, route.params);
  fetch(`/docs-raw/${route.params.name}.md`).then(res => {
    res.text().then(text => {
      content.value = text;
    });
  });
};
watch(() => route.params, init);
init();
</script>

<template>
  <MdEditor :content="content" previewOnly />
</template>
