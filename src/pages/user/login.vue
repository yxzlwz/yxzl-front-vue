<script setup lang="ts">
import { Axios, errorHandler } from '../../plugins/axios';
import naiveui from '../../plugins/naiveui';
import { ref } from 'vue';
import { useStore } from '../../stores';
import router from '../../router';
import { useReCaptcha } from 'vue-recaptcha-v3';
import { _ } from '../../i18n';

//@ts-ignore
const { executeRecaptcha, recaptchaLoaded } = useReCaptcha();

const store = useStore();

if (router.currentRoute.value.query.message) {
  naiveui.message.success(
    _(`user.${router.currentRoute.value.query.message as string}`)
  );
}

const username = ref(''),
  password = ref(''),
  email = ref(''),
  loading = ref(false);

const login = async () => {
    if (!username.value || !password.value) {
      naiveui.message.error('用户名或密码不能为空');
      return;
    }
    loading.value = true;
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
        naiveui.message.success('登录成功');
        if (router.currentRoute.value.query.next) {
          router.push(router.currentRoute.value.query.next as string);
        } else {
          router.push({ name: 'user-center' });
        }
      })
      .catch(errorHandler)
      .finally(() => {
        loading.value = false;
      });
  },
  register = async () => {
    if (!username.value || !password.value || !email.value) {
      naiveui.message.error('注册信息不能为空');
      return;
    }
    loading.value = true;
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
        naiveui.message.success(res.data?.detail);
      })
      .catch(errorHandler)
      .finally(() => {
        loading.value = false;
      });
  };

const receiveType = ref('email'),
  getTemporaryPassword = async () => {
    if (!username.value) {
      naiveui.message.error('用户名不能为空');
      return;
    }
    loading.value = true;
    await recaptchaLoaded();
    const recaptcha = await executeRecaptcha('login');
    Axios.post('/user/get_temporary_password/', {
      username: username.value,
      email: email.value,
      type: receiveType.value,
      recaptcha: recaptcha,
    })
      .then((res: any) => {
        naiveui.message.success(res.data?.detail);
      })
      .catch(errorHandler)
      .finally(() => {
        loading.value = false;
      });
  };
</script>

<template>
  <div style="display: flex; justify-content: center">
    <n-card style="max-width: 35rem; margin: 10vh 0">
      <n-tabs
        animated
        default-value="login"
        size="large"
        justify-content="space-evenly"
      >
        <n-tab-pane name="login" tab="登录">
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

        <n-tab-pane name="temporaryPassword" tab="获取临时密码">
          <n-form style="padding: 1rem; margin-top: 0.5rem">
            <n-form-item-row label="用户名">
              <n-input v-model:value="username" />
            </n-form-item-row>
            <n-form-item-row label="密码接收方式">
              <n-radio-group v-model:value="receiveType">
                <n-space>
                  <n-radio value="email"> 邮箱 </n-radio>
                  <n-radio value="mobile" disabled> 手机号 </n-radio>
                </n-space>
              </n-radio-group>
            </n-form-item-row>
            <n-form-item-row label="邮箱" v-if="receiveType === 'email'">
              <n-input v-model:value="email" />
            </n-form-item-row>
            <n-form-item-row>
              <n-button
                type="primary"
                block
                secondary
                strong
                @click="getTemporaryPassword"
              >
                获取临时密码
              </n-button>
            </n-form-item-row>
          </n-form>
        </n-tab-pane>
      </n-tabs>
    </n-card>
  </div>
</template>
