<script setup lang="ts">
import { ref } from 'vue';
import { useStore } from '../../stores';
import Axios from '../../plugins/axios';
import { defaultAvatar } from '../../consts';
import { LogOutOutline } from '@vicons/ionicons5';
import { isMobile } from '../../consts';
import router from '../../router';
import naiveui from '../../plugins/naiveui';

const store = useStore();

const user = ref<UserDetail>({
  id: 0,
  username: '',
  avatar: defaultAvatar,
  is_superuser: false,
  verified: false,
  email: '',
});

Axios.get('/user/info/').then(res => {
  console.log(res.data.user);
  user.value = res.data.user;
});

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

const editEmail = ref(false),
  updateEmail = () => {};
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
          <n-form-item label="邮箱">
            <n-input v-model:value="user.email" />
          </n-form-item>
        </n-form>
        <n-button type="primary" @click="update"> 保存 </n-button>
        <n-divider />
        <n-h3>邮箱</n-h3>
        <n-form :inline="!isMobile" v-if="editEmail">
          <n-form-item label="邮箱">
            <n-input v-model:value="user.email" disabled />
          </n-form-item>
        </n-form>
      </n-tab-pane>
      <n-tab-pane name="security" tab="安全设置"> Hey Jude </n-tab-pane>
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
