<script lang="ts" setup>
import { _ } from './i18n';
import router from './router';
</script>

<template>
  <n-layout-footer bordered class="footer footer--centered">
    <div class="footer-links">
      <div class="footer-links-col">
        <n-text depth="1" class="col-header"> {{ _('site.name') }} </n-text>
        <n-button
          text
          tag="a"
          target="_blank"
          href="https://blog.yixiangzhilv.com/"
        >
          异想之旅のBlog
        </n-button>
        <n-button
          text
          tag="a"
          href="https://github.com/yxzlwz/"
          target="_blank"
        >
          GitHub
        </n-button>
        <n-button
          text
          tag="a"
          href="https://twitter.com/yxzlwz"
          target="_blank"
        >
          Twitter
        </n-button>
      </div>
      <div class="footer-links-col footer-links-col--last">
        <n-text depth="1" class="col-header">
          {{ _('footer.contact') }}
        </n-text>
        <n-button text tag="a" href="mailto:mail@yixiangzhilv.com">
          mail@yixiangzhilv.com
        </n-button>
        <n-button
          text
          @click="router.push({ name: 'docs', params: { name: 'wechat' } })"
        >
          服务微信
        </n-button>
      </div>
    </div>
    <n-divider class="footer-divider" />
    <div style="text-align: center; padding: 20px">
      <n-text depth="3">
        © 2018-{{ new Date().getFullYear() }} {{ _('site.name') }}
      </n-text>
    </div>
  </n-layout-footer>
</template>

<style scoped>
.footer {
  --x-padding: 56px;
  margin-top: auto;
}

.footer.footer--centered .footer-links {
  margin: auto;
  max-width: 960px;
  --x-padding: 36px;
}

.footer-links {
  box-sizing: border-box;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  padding: var(--x-padding);
  padding-bottom: 0;
  padding-top: 32px;
}

.footer-links-col {
  flex: 1 0 0;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding-right: 24px;
  padding-bottom: 24px;
}

.col-header {
  white-space: nowrap;
}

@media only screen and (min-width: 1024px) {
  .footer.footer--centered .footer-links-col.footer-links-col--last {
    flex: 0 0 0;
  }
}

.footer.footer--centered .footer-links-col {
  width: initial;
}

.footer-divider {
  margin: 0;
  padding: 0 var(--x-padding);
}

.footer-links-col > * {
  line-height: 2;
}

.col-header {
  font-weight: 500;
}

.link {
  text-decoration: none;
}
</style>
