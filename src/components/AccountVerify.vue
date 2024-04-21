<script setup lang="ts">
import { ref } from 'vue';
import { useStore, useVerifyStore } from '../stores';
import { Axios, errorHandler } from '../plugins/axios';
import naiveui from '../plugins/naiveui';
import {
  PhonePortraitOutline,
  MailOutline,
  KeypadOutline,
} from '@vicons/ionicons5';
import { useReCaptcha } from 'vue-recaptcha-v3';
import { _ } from '../i18n';

//@ts-ignore
const { executeRecaptcha, recaptchaLoaded } = useReCaptcha();
const store = useStore(),
  verifyStore = useVerifyStore();

const type = ref(null),
  code = ref('');

const sendCode = async () => {
  await recaptchaLoaded();
  const recaptcha = await executeRecaptcha('verify');
  Axios.post('/user/verify/send_code/', {
    type: type.value,
    recaptcha: recaptcha,
  })
    .then(res => {
      naiveui.message.success(res.data?.detail);
    })
    .catch(errorHandler);
};
const verifyCode = () => {
  Axios.post('/user/verify/verify_code/', {
    code: code.value,
  })
    .then(res => {
      naiveui.message.success(res.data?.detail);
      verifyStore.verified_at = Date.now();
      verifyStore.show_verify = false;
      type.value = null;
      verifyStore.callback();
    })
    .catch(errorHandler);
};
</script>

<template>
  <n-modal
    v-model:show="verifyStore.show_verify"
    preset="card"
    style="max-width: 800px; width: 90vw"
    title="身份验证"
    size="huge"
  >
    <div v-if="!type">
      <n-text style="font-size: 1.1em">
        您正在进行敏感操作，为了你的安全，请完成身份验证。
      </n-text>
      <n-space vertical style="margin: 2vh 0" size="large">
        <n-card
          embedded
          hoverable
          v-if="store.user.mobile_number"
          style="cursor: pointer"
          @click="type = 'mobile'"
        >
          <n-space>
            <n-icon :size="24">
              <PhonePortraitOutline />
            </n-icon>
            手机号验证
          </n-space>
        </n-card>
        <n-card
          embedded
          hoverable
          style="cursor: pointer"
          @click="type = 'email'"
        >
          <n-space>
            <n-icon :size="24">
              <MailOutline />
            </n-icon>
            邮箱验证
          </n-space>
        </n-card>
        <n-card
          embedded
          hoverable
          v-if="store.user.totp"
          style="cursor: pointer"
          @click="type = 'totp'"
        >
          <n-space>
            <n-icon :size="24">
              <KeypadOutline />
            </n-icon>
            TOTP密码验证器
          </n-space>
        </n-card>
      </n-space>
    </div>
    <div v-if="type === 'email'">
      <n-space vertical>
        <n-text style="font-size: 1.1em">
          验证邮箱：{{ store.user.email }}
        </n-text>
        <n-button type="primary" @click="sendCode"> 点击获取验证码 </n-button>
        <n-divider />
        <n-input-group>
          <n-input
            placeholder="验证码"
            v-model:value="code"
            style="margin-right: 20px; max-width: 200px"
          />
          <n-button type="primary" @click="verifyCode"> 确认 </n-button>
        </n-input-group>
      </n-space>
    </div>
  </n-modal>
</template>
