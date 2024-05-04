<script setup lang="ts">
import { ref } from 'vue';
import { isMobile } from '../../consts';
import { Axios, errorHandler } from '../../plugins/axios';
import { _ } from '../../i18n';
import { FormRules } from 'naive-ui';
import naiveui from '../../plugins/naiveui';
import _copy from '../../utils/copy';
import { isUrl } from '../../utils/formatChecker';

const yiyan = ref<Yiyan>({
  content: '',
  provenance: '',
  author: '',
  url: '',
  id: 0,
  creator: null,
  from_show: null,
}),
  loading = ref(false);

const rules: FormRules = {
  content: {
    required: true,
    trigger: 'blur',
    message: _('yiyan.mustInputContent'),
  },
  url: {
    trigger: 'blur',
    validator: (_rule, value) => {
      if (value === '') {
        return true;
      }
      if (isUrl(value)) {
        return true;
      }
      return false;
    },
    message: _('yiyan.urlUnvalid'),
  },
},
  formRef = ref();

const submit = () => {
  formRef.value.validate(errors => {
    if (errors) {
      naiveui.message.error(errors[0][0].message);
      return;
    }

    loading.value = true;
    Axios.post('/yiyan/sentence/', {
      content: yiyan.value.content,
      provenance: yiyan.value.provenance || null,
      author: yiyan.value.author || null,
      url: yiyan.value.url || null,
    })
      .then(_res => {
        naiveui.message.success(_('yiyan.submitSuccess'));
        yiyan.value = { content: '', provenance: '', author: '', url: '', id: 0, creator: null, from_show: null };
        loading.value = false;
      })
      .catch(errorHandler);
  });
};
</script>

<template>
  <n-h1>{{ _('menu.yiyan.create') }}</n-h1>
  <div :class="{ 'simple-create': true, 'simple-create-mobile': isMobile }">
    <n-form :model="yiyan" :rules="rules" ref="formRef">
      <n-form-item :label="_('yiyan.content')" path="content">
        <n-input v-model:value="yiyan.content" type="text" :size="isMobile ? 'medium' : 'large'"
          :placeholder="_('yiyan.content')" round style="margin-bottom: 0" />
      </n-form-item>
      <n-grid cols="1 l:2 xl:2 xxl:2" item-responsive x-gap="30" responsive="screen" class="setting">
        <n-gi>
          <n-form-item :label="_('yiyan.provenance')">
            <n-input v-model:value="yiyan.provenance" :placeholder="_('yiyan.provenance')" round />
          </n-form-item>
        </n-gi>
        <n-gi>
          <n-form-item :label="_('yiyan.author')">
            <n-input v-model:value="yiyan.author" :placeholder="_('yiyan.author')" round />
          </n-form-item>
        </n-gi>
        <n-gi :span="2">
          <n-form-item :label="_('yiyan.url')" path="url">
            <n-input v-model:value="yiyan.url" :placeholder="_('yiyan.url')" round />
          </n-form-item>
        </n-gi>
      </n-grid>
      <n-button type="primary" @click="submit" size="large" :loading="loading">
        {{ _('yiyan.submitYiyan') }}
      </n-button>
    </n-form>
  </div>
</template>

<style lang="scss">
@import url('../../styles/simple-create.scss');
</style>
