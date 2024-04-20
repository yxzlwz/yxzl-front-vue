<script setup lang="ts">
import { ref, h } from 'vue';
import { NEllipsis, NButton, NSpace } from 'naive-ui';
import { LinkOutline, TrashOutline } from '@vicons/ionicons5';
import { Axios, errorHandler } from '../../plugins/axios';
import naiveui from '../../plugins/naiveui';
import copy from '../../utils/copy';
import { surlPreffix } from '../../consts';

const data = ref<Surl[]>([]),
  loading = ref(false);
const columns = [
  {
    title: 'ID',
    key: 'id',
  },
  {
    title: '网址',
    key: 'url',
    render(row: Surl) {
      return h(
        NEllipsis,
        {
          style: {
            maxWidth: '40vw',
          },
        },
        () => row.url
      );
    },
  },
  { title: '短链接后缀', key: 'key' },
  {
    title: '密码',
    key: 'password',
    render(row: Surl) {
      return row.password || '-';
    },
  },
  {
    title: '过期时间',
    key: 'expire_time',
    render(row: Surl) {
      return row.expire_time || '-';
    },
  },
  {
    title: '操作',
    key: 'action',
    render(row: Surl) {
      return h(NSpace, {}, () => [
        h(
          NButton,
          {
            type: 'info',
            ghost: true,
            size: 'small',
            onClick: event => {
              copy(`${surlPreffix}${row.key}`, event);
              naiveui.message.success('复制成功');
            },
          },
          {
            icon: () => h(LinkOutline),
          }
        ),
        h(
          NButton,
          {
            type: 'error',
            ghost: true,
            size: 'small',
            onClick: () => {
              Axios.delete('/short_url/' + row.key + '/')
                .then(() => {
                  naiveui.message.success('删除成功');
                  getData();
                })
                .catch(errorHandler);
            },
          },
          {
            icon: () => h(TrashOutline),
          }
        ),
      ]);
    },
  },
];

const pagination = ref({
  page: 1,
  pageSize: 20,
  itemCount: 0,
});

const getData = () => {
  loading.value = true;
  Axios.get('/short_url/', { params: { page: pagination.value.page } }).then(
    res => {
      loading.value = false;
      data.value = res.data.results;
      pagination.value.itemCount = res.data.count;
    }
  );
};
getData();
</script>

<template>
  <n-h1>我的短链接</n-h1>

  <n-data-table
    :columns="columns"
    :data="data"
    remote
    :pagination="pagination"
    :bordered="false"
    @update:page="
      (page:number) => {
        pagination.page = page;
        getData();
      }
    "
  />
</template>

<style lang="scss"></style>
