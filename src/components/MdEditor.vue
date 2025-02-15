<template>
  <MdEditor
    :editorId="`md-editor-${id}`"
    class="md-editor-v3"
    v-model="_content"
    katexJs="https://cdn.staticfile.org/KaTeX/0.15.1/katex.min.js"
    katexCss="https://cdn.staticfile.org/KaTeX/0.15.1/katex.min.css"
    highlightJs="https://cdn.staticfile.org/highlight.js/11.2.0/highlight.min.js"
    highlightCss="https://cdn.staticfile.org/highlight.js/10.0.0/styles/atom-one-dark.min.css"
    noMermaid
    prettierCDN="https://cdn.staticfile.org/prettier/2.0.3/standalone.min.js"
    prettierMDCDN="https://cdn.staticfile.org/prettier/2.0.3/parser-markdown.min.js"
    noCropper
    :toolbars="[
      'revoke',
      'next',
      '-',
      'bold',
      'underline',
      'strikeThrough',
      'quote',
      '-',
      'link',
      'image',
      'katex',
      'codeRow',
      'code',
      '-',
      'preview',
    ]"
    :preview="true"
    :previewOnly="previewOnly"
    :historyLength="20"
    showCodeRowNumber
    previewTheme="vuepress"
    :theme="store.theme"
  />
</template>

<script setup lang="ts">
import MdEditor from 'md-editor-v3';
import 'md-editor-v3/lib/style.css';
import { ref, toRef, watch } from 'vue';
import { useStore } from '../stores';

const store = useStore();

const id = parseInt(Math.random() * 100000).toString();

const emit = defineEmits(['update:content']);
const props = defineProps({
  content: {
    type: String,
    default: '',
  },
  previewOnly: {
    type: Boolean,
    default: true,
  },
});

const _content = ref(props.content);
watch(_content, val => emit('update:content', val));
watch(toRef(props, 'content'), val => (_content.value = val));
</script>

<style lang="scss" scoped>
.md-editor-v3 {
  background-color: var(--n-body-color);
  border-radius: var(--n-border-radius);
  transition: color 0.3s var(--n-bezier), background-color 0.3s var(--n-bezier),
    box-shadow 0.3s var(--n-bezier), border-color 0.3s var(--n-bezier);
}

.md-editor-v3 :deep(img) {
  max-width: 70% !important;
  margin: 0 auto !important;
}

@media (max-width: 768px) {
  .md-editor-v3 :deep(img) {
    max-width: 100% !important;
  }
}

.n-card.md-editor-card :deep(.n-card__content) {
  margin: 0 !important;
  padding: 0 !important;
}

:deep(.github-theme) {
  margin-top: 10px !important;
}
</style>
