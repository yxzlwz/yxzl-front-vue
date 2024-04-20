<script setup lang="ts">
import { Axios, errorHandler } from '../../plugins/axios';
import { useMessage } from 'naive-ui';
import { ref } from 'vue';
import { useStore } from '../../stores';
// import { getReCaptcha } from '../../plugins/recaptcha';
import router from '../../router';
import { useReCaptcha } from 'vue-recaptcha-v3';
import { _ } from '../../i18n';

const { executeRecaptcha, recaptchaLoaded } = useReCaptcha();

const message = useMessage(),
  store = useStore();

if (router.currentRoute.value.query.message) {
  message.success(
    _(`user.${router.currentRoute.value.query.message as string}`)
  );
}

const username = ref(''),
  password = ref(''),
  email = ref('');

const login = async () => {
    if (!username.value || !password.value) {
      message.error('用户名或密码不能为空');
      return;
    }
    await recaptchaLoaded();
    const recaptcha = await executeRecaptcha('login');
    console.log(recaptcha);
    Axios.post('/user/login/', {
      username: username.value,
      password: password.value,
      recaptcha: recaptcha,
    })
      .then((res: any) => {
        store.user = res.data.user;
        message.success('登录成功');
        if (router.currentRoute.value.query.next) {
          router.push(router.currentRoute.value.query.next as string);
        } else {
          router.push({ name: 'user-center' });
        }
      })
      .catch(errorHandler);
  },
  register = async () => {
    if (!username.value || !password.value || !email.value) {
      message.error('注册信息不能为空');
      return;
    }
    await recaptchaLoaded();
    const recaptcha = await executeRecaptcha('login');
    console.log(recaptcha);
    Axios.post('/user/register/', {
      username: username.value,
      password: password.value,
      email: email.value,
      recaptcha: recaptcha,
    })
      .then((res: any) => {
        message.success(res.data?.detail);
      })
      .catch(errorHandler);
  };
</script>

<template>
  <div style="display: flex; justify-content: center">
    <n-card style="max-width: 35rem; margin: 10vh 0">
      <n-tabs
        animated
        default-value="signin"
        size="large"
        justify-content="space-evenly"
      >
        <n-tab-pane name="signin" tab="登录">
          <n-form style="padding: 1rem; margin-top: 0.5rem">
            <n-form-item-row label="用户名">
              <n-input v-model:value="username" />
            </n-form-item-row>
            <n-form-item-row label="密码">
              <n-input
                type="password"
                show-password-on="mousedown"
                v-model:value="password"
                @keydown.enter="login"
              />
            </n-form-item-row>
            <n-form-item-row>
              <n-button type="primary" block secondary strong @click="login">
                登录
              </n-button>
            </n-form-item-row>
          </n-form>
        </n-tab-pane>

        <n-tab-pane name="signup" tab="注册">
          <n-form style="padding: 1rem; margin-top: 0.5rem">
            <n-form-item-row label="用户名">
              <n-input v-model:value="username" />
            </n-form-item-row>
            <n-form-item-row label="密码">
              <n-input
                type="password"
                show-password-on="mousedown"
                v-model:value="password"
              />
            </n-form-item-row>
            <n-form-item-row label="邮箱">
              <n-input v-model:value="email" />
            </n-form-item-row>
            <n-form-item-row>
              <n-button type="primary" block secondary strong @click="register">
                注册
              </n-button>
            </n-form-item-row>
          </n-form>
        </n-tab-pane>
      </n-tabs>
    </n-card>
  </div>
</template>
