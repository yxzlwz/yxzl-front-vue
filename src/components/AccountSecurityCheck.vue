<script setup lang="ts">
import { ref } from 'vue';
import { useStore, useSecurityCheckStore } from '../stores';
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
  securityCheckStore = useSecurityCheckStore();

const type = ref(null),
  sending_code = ref(false),
  code = ref('');

const sendCode = async () => {
    sending_code.value = true;
    await recaptchaLoaded();
    const recaptcha = await executeRecaptcha('verify');
    Axios.post('/user/security_check/send_code/', {
      type: type.value,
      recaptcha: recaptcha,
    })
      .then(res => {
        naiveui.message.success(res.data?.detail);
      })
      .catch(errorHandler)
      .finally(() => {
        sending_code.value = false;
      });
  },
  verifyCode = () => {
    Axios.post('/user/security_check/verify_code/', {
      code: code.value,
    })
      .then(verifySuccess)
      .catch(errorHandler);
  },
  verifyTotp = () => {
    Axios.post('/user/security_check/verify_totp/', {
      code: code.value,
    })
      .then(verifySuccess)
      .catch(errorHandler);
  },
  verifySuccess = (res: any) => {
    naiveui.message.success(res.data?.detail);
    securityCheckStore.verified_at = Date.now();
    securityCheckStore.show_verify = false;
    type.value = null;
    code.value = '';
    securityCheckStore.callback();
  };
</script>

<template>
  <n-modal
    v-model:show="securityCheckStore.show_verify"
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
        <n-button type="primary" @click="sendCode" :loading="sending_code">
          点击获取验证码
        </n-button>
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
    <div v-if="type === 'totp'">
      <n-input-group>
        <n-input
          placeholder="TOTP验证码"
          v-model:value="code"
          style="margin-right: 20px; max-width: 200px"
        />
        <n-button type="primary" @click="verifyTotp"> 确认 </n-button>
      </n-input-group>
    </div>
  </n-modal>
</template>
