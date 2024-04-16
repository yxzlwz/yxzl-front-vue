<script lang="ts" setup>
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { _ } from '../i18n';
import MdEditor from '../components/MdEditor.vue';
const route = useRoute();
const content = ref(null);

const init = () => {
  content.value = null;
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
  <MdEditor :content="content" previewOnly v-if="content" />
  <!-- <n-space style="margin: 3vh 2vw; align-items: center" v-else>
    <n-spin size="medium" />
    <n-h4 style="margin: 0">{{ _('feedback.loading') }}</n-h4>
  </n-space> -->
</template>
