<script setup lang="ts">
import { ref } from 'vue';
import { useStore, useSecurityCheckStore } from '../../stores';
import { Axios, errorHandler } from '../../plugins/axios';
import { defaultAvatar } from '../../consts';
import { LogOutOutline } from '@vicons/ionicons5';
import { isMobile } from '../../consts';
import router from '../../router';
import naiveui from '../../plugins/naiveui';

const store = useStore(),
  securityCheckStore = useSecurityCheckStore();

const user = ref<UserDetail>({
  id: 0,
  username: '',
  avatar: defaultAvatar,
  is_superuser: false,
  verified: false,
  email: '',
});

const initUserInfo = () => {
  Axios.get('/user/info/').then(res => {
    console.log(res.data.user);
    user.value = res.data.user;
  });
};
initUserInfo();

const update = () => {
  Axios.put('/user/info/', user.value).then(_res => {
    naiveui.message.success('更新成功');
  });
};

const logout = () => {
  Axios.post('/user/logout/').then(_res => {
    store.logout();
    naiveui.message.success('登出成功');
    router.push({ name: 'user-login' });
  });
};

const new_email = ref(''),
  updateEmailLoading = ref(false),
  updateEmail = () => {
    updateEmailLoading.value = true;
    Axios.put('/user/change_email/', { new_email: new_email.value })
      .then(res => {
        naiveui.message.success(res.data?.detail);
      })
      .catch(errorHandler)
      .finally(() => {
        updateEmailLoading.value = false;
      });
  };

const currentTotp = ref(''),
  totpSecret = ref(''),
  settingTotp = ref(false),
  initTotp = () => {
    Axios.post('/user/totp_init/')
      .then(res => {
        settingTotp.value = true;
        totpSecret.value = res.data.totp_secret;
      })
      .catch(errorHandler);
  },
  confirmTotp = () => {
    Axios.post('/user/totp_confirm/', { code: currentTotp.value })
      .then(res => {
        naiveui.message.success(res.data?.detail);
        settingTotp.value = false;
        totpSecret.value = '';
        currentTotp.value = '';
        initUserInfo();
      })
      .catch(errorHandler);
  };

const new_password = ref(['', '']),
  updatePassword = () => {
    Axios.put('/user/change_password/', {
      new_password: new_password.value[0],
    })
      .then(res => {
        naiveui.message.success(res.data?.detail);
        store.logout();
        router.push({ name: 'user-login' });
      })
      .catch(errorHandler);
  };
</script>

<template>
  <n-card>
    <n-tabs type="line" animated size="large">
      <n-tab-pane name="information" tab="基本信息">
        <div
          style="
            display: flex;
            justify-content: space-between;
            margin-top: 15px;
          "
        >
          <div style="display: flex; align-items: center">
            <n-avatar
              :src="user.avatar || null"
              round
              size="large"
              style="margin-right: 1em"
            />
            <n-h3 style="margin: 0"> {{ user.username }} </n-h3>
          </div>
          <n-space>
            <n-button type="warning" @click="logout()">
              <template #icon>
                <LogOutOutline />
              </template>
              退出登录
            </n-button>
            <!-- <n-popconfirm @positive-click="deleteUser" v-if="id">
              <template #trigger>
                <n-button type="error">
                  <template #icon>
                    <TrashBinOutline />
                  </template>
                </n-button>
              </template>
              你确定删除用户 {{ user.username }} 吗？
            </n-popconfirm> -->
          </n-space>
        </div>
        <n-divider />
        <n-h3>基本信息</n-h3>
        <n-form :inline="!isMobile" label-width="520px">
          <n-form-item label="头像URL">
            <n-input v-model:value="user.avatar" />
          </n-form-item>
        </n-form>
        <n-button type="primary" @click="update"> 保存 </n-button>

        <n-divider />

        <n-h3>邮箱</n-h3>
        <n-space vertical>
          <n-text style="font-size: 1.1em">
            当前账号绑定邮箱：{{ user.email }}
          </n-text>
          <n-input-group>
            <n-input
              placeholder="新邮箱"
              v-model:value="new_email"
              style="margin-right: 20px; max-width: 200px"
            />
            <n-button
              type="primary"
              @click="securityCheckStore.check(updateEmail)"
              :loading="updateEmailLoading"
            >
              修改
            </n-button>
          </n-input-group>
        </n-space>
      </n-tab-pane>

      <n-tab-pane name="security" tab="安全设置">
        <n-h3>TOTP验证器</n-h3>
        <n-space vertical>
          <n-text style="font-size: 1.1em">
            当前状态：{{ user.totp ? '已设置' : '未设置' }}
          </n-text>
          <n-button type="primary" @click="securityCheckStore.check(initTotp)">
            {{ user.totp ? '重置' : '设置' }}
          </n-button>
          <n-space vertical v-if="settingTotp">
            <n-input-group>
              <n-input
                placeholder="当前显示的验证码"
                v-model:value="currentTotp"
                style="margin-right: 20px; max-width: 200px"
              />
              <n-button type="primary" @click="confirmTotp"> 确认 </n-button>
            </n-input-group>
            <n-qr-code
              :value="`otpauth://totp/Yixiangzhilv:${encodeURI(
                user.username
              )}?secret=${totpSecret}&issuer=Yixiangzhilv`"
            />
            <span> 密钥：{{ totpSecret }} </span>
          </n-space>
        </n-space>

        <n-divider />

        <n-h3>修改密码</n-h3>
        <n-form :inline="!isMobile">
          <n-form-item label="新密码">
            <n-input v-model:value="new_password[0]" type="password" />
          </n-form-item>
          <n-form-item label="确认新密码">
            <n-input v-model:value="new_password[1]" type="password" />
          </n-form-item>
          <n-form-item>
            <n-button
              type="error"
              @click="securityCheckStore.check(updatePassword)"
            >
              修改
            </n-button>
          </n-form-item>
        </n-form>
      </n-tab-pane>
      <n-tab-pane name="billing" tab="财务相关"> 七里香 </n-tab-pane>
      <n-tab-pane name="admin" tab="管理员"> 七里香 </n-tab-pane>
    </n-tabs>
  </n-card>
</template>

<style scoped lang="scss">
.n-form--inline {
  .n-form-item {
    width: 240px;
  }
}
</style>
