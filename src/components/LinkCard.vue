<script lang="ts" setup>
import { RouterLink } from 'vue-router';
import { useThemeVars } from 'naive-ui';

const themeVars = useThemeVars();

const props = defineProps({
  title: {
    type: String,
    default: 'Title',
  },
  description: {
    type: String,
    default: 'Description',
  },
  to: {
    type: Object,
    default: () => ({ name: 'home' }),
  },
});
</script>

<template>
  <div
    class="card"
    :style="{
      '--color-normal': themeVars.textColor2,
      '--color-hover': themeVars.cardColor,
      '--background-hover': themeVars.primaryColorHover,
      '--background-normal': themeVars.actionColor,
    }"
  >
    <RouterLink class="card1" :to="props.to">
      <p>{{ props.title }}</p>
      <p class="small">
        {{ props.description }}
      </p>
      <div class="go-corner" href="#">
        <div class="go-arrow">→</div>
      </div>
    </RouterLink>
  </div>
</template>

<style scoped>
.card p {
  font-size: 20px;
  font-weight: 400;
  line-height: 20px;
  color: var(--color-normal);
}

.card p.small {
  font-size: 14px;
  display: block;
}

.go-corner {
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  width: 32px;
  height: 32px;
  overflow: hidden;
  top: 0;
  right: 0;
  background-color: var(--background-hover);
  border-radius: 0 4px 0 32px;
}

.go-arrow {
  margin-top: -4px;
  margin-right: -4px;
  color: white;
  font-family: courier, sans;
}

.card1 {
  display: block;
  position: relative;
  max-width: 262px;
  background-color: var(--background-normal);
  border-radius: 4px;
  padding: 20px 24px;
  margin: 12px;
  text-decoration: none;
  z-index: 0;
  overflow: hidden;
}

.card1:before {
  content: '';
  position: absolute;
  z-index: -1;
  top: -16px;
  right: -16px;
  background: var(--background-hover);
  height: 36px;
  width: 36px;
  border-radius: 32px;
  transform: scale(1);
  transform-origin: 50% 50%;
  transition: transform 0.25s ease-out;
}

.card1:hover:before {
  transform: scale(21);
}

.card1:hover p {
  transition: all 0.3s ease-out;
  /* color: rgba(255, 255, 255, 0.8); */
  color: var(--color-hover);
}
</style>
