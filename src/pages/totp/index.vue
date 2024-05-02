<script lang="ts" setup>
import { ref, h } from 'vue';
import { isMobile } from '../../consts';
import { Axios, errorHandler } from '../../plugins/axios';
import { _ } from '../../i18n';
import { CreateOutline, TrashBinOutline } from '@vicons/ionicons5';
import { NSpace, NText, NInput, FormRules } from 'naive-ui';
import { TOTP } from 'totp-generator';
import naiveui from '../../plugins/naiveui';
import { useKeyStore } from '../../stores';
import { cbc_encrypt, cbc_decrypt, sha512 } from '../../utils/encrypt';

const keyStore = useKeyStore();

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
            if (sha512(aesKey.value) === res.data.aes_key) {
              res.data.config = cbc_decrypt(res.data.config, aesKey.value);
              res.data.config = JSON.parse(res.data.config);
            } else {
              naiveui.modal.create({
                title: '解密AES数据',
                content: () =>
                  h(NInput, {
                    placeholder: '请输入AES密钥',
                    type: 'password',
                    showPasswordOn: 'mousedown',
                    value: aesKey.value,
                    onUpdateValue: v => (aesKey.value = v),
                  }),
                preset: 'dialog',
                positiveText: '确认',
                maskClosable: false,
                onPositiveClick() {
                  if (!aesKey.value) {
                    naiveui.message.error('请输入AES密钥');
                    return;
                  }
                  if (sha512(aesKey.value) === res.data.aes_key) {
                    res.data.config = cbc_decrypt(
                      res.data.config,
                      aesKey.value
                    );
                    res.data.config = JSON.parse(res.data.config);
                    totpData.value = res.data;
                    keyStore.totp_aes = aesKey.value;
                  } else {
                    naiveui.message.error('AES密钥错误');
                    aesKey.value = '';
                    getTotpData();
                    return;
                  }
                },
              });
              return;
            }
          } else {
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
  doDelete = (item: TotpItem | null = null) => {
    naiveui.dialog.warning({
      title: `你确定要删除TOTP吗？`,
      content:
        item === null
          ? `你确定要删除该所有TOTP信息吗？这是最后警告。`
          : `这是你删除${item.issuer_name} - ${item.name}前的最后警告。我们强烈建议你在确保设置好账号恢复方式后再执行删除操作。`,
      positiveText: '确定删除',
      negativeText: '取消',
      onPositiveClick: () => {
        if (item === null) {
          totpData.value.config = [];
          totpData.value.use_aes = false;
          totpData.value.aes_key = '';
        } else {
          totpData.value.config = totpData.value.config.filter(
            i =>
              i.secret !== item.secret ||
              i.name !== item.name ||
              i.issuer_name !== item.issuer_name
          );
        }
        Axios.post('/totp/', {
          config: JSON.stringify(totpData.value.config),
          use_aes: totpData.value.use_aes,
          aes_key: totpData.value.aes_key,
        })
          .then(_res => {
            naiveui.message.success('删除成功');
          })
          .catch(errorHandler);
      },
    });
  };

const aesKey = ref(keyStore.totp_aes),
  useAes = () => {
    naiveui.modal.create({
      title: '启用AES加密',
      content: () =>
        h(
          NSpace,
          {
            vertical: true,
            style: { margin: '20px 0' },
          },
          {
            default: () => [
              h(
                NText,
                {},
                {
                  default: () =>
                    '按下确认后，你的所有TOTP数据将被AES加密，异想之旅将无法读取这些数据。设置密钥后，以后每次访问TOTP都需要输入密钥才能查看内容。请牢记密钥，该密钥只能通过删除所有AES信息重置。',
                }
              ),
              h(NInput, {
                placeholder: '请输入AES密钥',
                type: 'password',
                showPasswordOn: 'mousedown',
                value: aesKey.value,
                onUpdateValue: v => (aesKey.value = v),
              }),
            ],
          }
        ),
      preset: 'dialog',
      positiveText: '确认',
      negativeText: '取消',
      onPositiveClick() {
        if (!aesKey.value) {
          naiveui.message.error('请输入AES密钥');
          return;
        }
        Axios.post('/totp/', {
          config: cbc_encrypt(
            JSON.stringify(totpData.value.config),
            aesKey.value
          ),
          use_aes: true,
          aes_key: sha512(aesKey.value),
        })
          .then(_res => {
            naiveui.message.success('设置成功');
            getTotpData();
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
      <n-input
        v-model:value="addData.secret"
        placeholder="密钥信息"
        type="password"
        show-password-on="mousedown"
      />
    </n-form-item>
    <n-form-item path="name" label="账号">
      <n-input v-model:value="addData.name" placeholder="可任填" />
    </n-form-item>
    <n-form-item path="issuer_name" label="签发者">
      <n-input v-model:value="addData.issuer_name" placeholder="可任填" />
    </n-form-item>
    <n-form-item label="">
      <n-space>
        <n-button @click="addTotp" type="primary"> 添加 </n-button>
        <n-button
          @click="useAes"
          v-if="totpData.config.length && !totpData.use_aes"
        >
          使用AES加密
        </n-button>
        <n-button @click="doDelete(null)" type="error"> 重置数据 </n-button>
      </n-space>
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
