<script lang="ts" setup>
import { ref } from 'vue';
import { isMobile } from '../../consts';
import { Axios, errorHandler } from '../../plugins/axios';
import { _ } from '../../i18n';
import { CreateOutline, TrashBinOutline } from '@vicons/ionicons5';
import { FormRules } from 'naive-ui';
import { TOTP } from 'totp-generator';
import naiveui from '../../plugins/naiveui';

const time = ref(0),
  totp = (secret: string, _time: any) => {
    const otp = TOTP.generate(secret);
    return otp.otp;
  };
time.value = setInterval(() => {
  time.value++;
}, 1000);

const totpData = ref<Totp>({ config: [], use_aes: false }),
  getTotpData = () => {
    Axios.get('/totp/')
      .then(res => {
        if (res.data.config === null) {
          res.data.config = [];
        } else if (typeof res.data.config === 'string') {
          if (res.data.use_aes) {
          } else {
            console.log(123);
            res.data.config = JSON.parse(res.data.config);
          }
        }
        totpData.value = res.data;
      })
      .catch(errorHandler);
  };
getTotpData();

const addData = ref({
    secret: '',
    name: '',
    issuer_name: '',
  }),
  rules: FormRules = {
    secret: [{ required: true, message: '请输入密钥', trigger: 'blur' }],
    name: [{ required: true, message: '请输入账号', trigger: 'blur' }],
  },
  addTotp = () => {
    if (!addData.value.secret || !addData.value.name) {
      naiveui.message.error('请填写完整信息');
      return;
    }

    totpData.value.config.push({
      secret: addData.value.secret,
      name: addData.value.name,
      issuer_name: addData.value.issuer_name,
    });

    Axios.post('/totp/', {
      config: JSON.stringify(totpData.value.config),
    })
      .then(_res => {
        naiveui.message.success('更新成功');
        addData.value = {
          secret: '',
          name: '',
          issuer_name: '',
        };
      })
      .catch(errorHandler);
  },
  update = (item: TotpItem) => {
    naiveui.notification.create({
      title: '你正在编辑TOTP',
      content: `你正在编辑TOTP：${item.issuer_name} - ${item.name}，该条目将被暂时从页面中移除，你可以在页面底部重新编辑它。如果想要取消编辑，请放心刷新界面，删除操作不会被保存。`,
      closable: true,
      duration: 20000,
    });
    addData.value = {
      secret: item.secret,
      name: item.name,
      issuer_name: item.issuer_name,
    };
    totpData.value.config = totpData.value.config.filter(
      i =>
        i.secret !== item.secret ||
        i.name !== item.name ||
        i.issuer_name !== item.issuer_name
    );
  },
  doDelete = (item: TotpItem) => {
    naiveui.dialog.warning({
      title: '你确定要删除该TOTP吗？',
      content: `这是你删除${item.issuer_name} - ${item.name}前的最后警告。我们强烈建议你在确保设置好账号恢复方式后再执行删除操作。`,
      positiveText: '确定删除',
      negativeText: '取消',
      onPositiveClick: () => {
        totpData.value.config = totpData.value.config.filter(
          i =>
            i.secret !== item.secret ||
            i.name !== item.name ||
            i.issuer_name !== item.issuer_name
        );
        Axios.post('/totp/', {
          config: JSON.stringify(totpData.value.config),
        })
          .then(_res => {
            naiveui.message.success('删除成功');
          })
          .catch(errorHandler);
      },
    });
  };
</script>

<template>
  <n-h1> 我的TOTP密钥 </n-h1>
  <n-grid :cols="isMobile ? 1 : 3" :x-gap="20" :y-gap="20">
    <n-gi v-for="item in totpData.config" :key="item.secret" class="totp-item">
      <n-card
        :title="`${item.issuer_name} - ${item.name}`"
        :bordered="false"
        embedded
        class="totp-card"
      >
        <template #header-extra>
          <n-space>
            <n-button text @click="update(item)">
              <n-icon size="19" :component="CreateOutline" />
            </n-button>
            <n-popconfirm @positive-click="doDelete(item)">
              <template #trigger>
                <n-button text>
                  <n-icon size="19" :component="TrashBinOutline" />
                </n-button>
              </template>
              你确定要删除该TOTP吗？
            </n-popconfirm>
          </n-space>
        </template>
        <n-h2 class="totp-code">
          {{ totp(item.secret, time) }}
        </n-h2>
      </n-card>
    </n-gi>
  </n-grid>

  <n-divider />

  <n-form
    :model="addData"
    :rules="rules"
    label-placement="left"
    label-width="auto"
    require-mark-placement="right-hanging"
    :style="{
      maxWidth: '500px',
    }"
  >
    <n-form-item path="secret" label="密钥">
      <n-input v-model:value="addData.secret" placeholder="密钥信息" />
    </n-form-item>
    <n-form-item path="name" label="账号">
      <n-input v-model:value="addData.name" placeholder="可任填" />
    </n-form-item>
    <n-form-item path="issuer_name" label="签发者">
      <n-input v-model:value="addData.issuer_name" placeholder="可任填" />
    </n-form-item>
    <n-form-item label="">
      <n-button @click="addTotp" type="primary"> 添加 </n-button>
    </n-form-item>
  </n-form>
</template>

<style lang="scss" scoped>
.totp-item {
  display: flex;
  justify-content: center;
  .totp-card {
    margin-bottom: 20px;
    max-width: 500px;
    .totp-code {
      text-align: center;
      font-size: 30px;
      letter-spacing: 8px;
    }
  }
}
</style>
