<script setup lang="ts">
import { ref } from 'vue';
import { isMobile, surlPreffix } from '../../consts';
import { Axios, errorHandler } from '../../plugins/axios';
import { _ } from '../../i18n';
import { LinkOutline } from '@vicons/ionicons5';
import { FormRules } from 'naive-ui';
import naiveui from '../../plugins/naiveui';
import _copy from '../../utils/copy';
import { isUrl, isLetterAndNumber } from '../../utils/formatChecker';

const surl = ref({
    url: '',
    _set_ideal_key: false,
    ideal_key: '',
    _use_password: false,
    password: '',
    _use_expire: false,
    expire_time: Date.now() + 1000 * 60 * 60 * 24 * 7,
  }),
  loading = ref(false);

const result = ref({ surl: '', key: '' });

const rules: FormRules = {
    url: {
      message: _('surl.inputTargetUrl'),
      trigger: 'blur',
      required: true,
      validator: (_rule, value) => isUrl(value),
    },
    ideal_key: {
      message: _('surl.idealKeyUnvalid'),
      trigger: 'blur',
      validator: (_rule, value) =>
        value.length < 16 && isLetterAndNumber(value),
    },
    password: {
      message: _('surl.passwordUnvalid'),
      trigger: 'blur',
      validator: (_rule, value) =>
        value.length < 16 && isLetterAndNumber(value),
    },
  },
  formRef = ref();

const submit = () => {
  if (!surl.value._set_ideal_key) surl.value.ideal_key = '';
  if (!surl.value._use_password) surl.value.password = '';
  if (!surl.value._use_expire) surl.value.expire_time = 0;

  formRef.value.validate(errors => {
    if (errors) {
      naiveui.message.error(errors[0][0].message);
      return;
    }

    loading.value = true;
    Axios.post('/short_url/', {
      url: surl.value.url,
      ideal_key: surl.value._set_ideal_key ? surl.value.ideal_key : null,
      password: surl.value._use_password ? surl.value.password : null,
      expire_time: surl.value._use_expire ? surl.value.expire_time : null,
    })
      .then(res => {
        loading.value = false;
        result.value = res.data;
        result.value.surl = surlPreffix + result.value.key;
        naiveui.message.success(_('surl.generateSuccess'));
      })
      .catch(errorHandler);
  });
};

const copy = (e: Event) => {
  _copy(result.value.surl, e);
  naiveui.message.success(_('operation.copySuccess'));
};
</script>

<template>
  <n-h1>{{ _('menu.surl.create') }}</n-h1>
  <div :class="{ 'simple-create': true, 'simple-create-mobile': isMobile }">
    <n-form :rules="rules" :model="surl" ref="formRef">
      <n-form-item :label="_('surl.targetUrl')" path="url">
        <n-input
          v-model:value="surl.url"
          type="text"
          size="large"
          style="margin-bottom: 0"
          :placeholder="_('surl.inputTargetUrl')"
          round
        />
      </n-form-item>
      <n-grid
        cols="1 l:2 xl:2 xxl:2"
        item-responsive
        responsive="screen"
        class="setting"
      >
        <n-gi>
          <div class="n-form n-form--inline">
            <n-form-item :label="_('surl.useIdealKey')">
              <n-switch v-model:value="surl._set_ideal_key" size="large" />
            </n-form-item>
            <n-form-item v-show="surl._set_ideal_key" path="ideal_key">
              <n-input
                v-model:value="surl.ideal_key"
                :placeholder="_('surl.inputIdealKey')"
                round
              />
            </n-form-item>
          </div>
        </n-gi>
        <n-gi>
          <div class="n-form n-form--inline">
            <n-form-item :label="_('surl.usePassword')">
              <n-switch v-model:value="surl._use_password" size="large" />
            </n-form-item>
            <n-form-item v-show="surl._use_password" path="password">
              <n-input
                v-model:value="surl.password"
                :placeholder="_('surl.inputPassword')"
                round
              />
            </n-form-item>
          </div>
        </n-gi>
        <n-gi>
          <div class="n-form n-form--inline">
            <n-form-item :label="_('surl.useExpireTime')">
              <n-switch v-model:value="surl._use_expire" size="large" />
            </n-form-item>
            <n-form-item v-show="surl._use_expire" path="expire_time">
              <n-date-picker v-model:value="surl.expire_time" type="datetime" />
            </n-form-item>
          </div>
        </n-gi>
      </n-grid>
      <n-button type="primary" @click="submit" size="large" :loading="loading">
        {{ _('surl.generateSurl') }}
      </n-button>
    </n-form>

    <n-divider v-if="result.surl" />

    <div v-if="result.surl">
      <n-h2>{{ _('surl.generateResult') }}</n-h2>
      <n-space>
        <n-space>
          <n-button
            text
            tag="a"
            :href="result.surl"
            target="_blank"
            size="large"
          >
            {{ result.surl }}
          </n-button>
          <n-button type="info" ghost @click="copy" size="small">
            <template #icon>
              <LinkOutline />
            </template>
          </n-button>
        </n-space>
      </n-space>
    </div>
  </div>
</template>

<style lang="scss">
@import url('../../styles/simple-create.scss');
</style>
