<script setup lang="ts">
import { ref, h } from 'vue';
import { NEllipsis } from 'naive-ui';
import { Axios, errorHandler } from '../../plugins/axios';
import { useStore } from '../../stores';
import naiveui from '../../plugins/naiveui';

const store = useStore();

const data = ref<Surl[]>([]),
  loading = ref(false);
const columns = [
  {
    title: 'ID',
    key: 'id',
  },
  {
    title: '内容',
    key: 'content',
    render(row: Yiyan) {
      return h(
        NEllipsis,
        {
          style: {
            maxWidth: '40vw',
          },
        },
        () => row.content
      );
    },
  },
  {
    title: '来源',
    key: 'provenance',
    render(row: Yiyan) {
      return row.provenance || '-';
    },
  },
  {
    title: '作者',
    key: 'author',
    render(row: Yiyan) {
      return row.author || '-';
    },
  },
  {
    title: '状态',
    key: 'state',
    render(row: Yiyan) {
      switch (row.state) {
        case 0:
          return '审核中';
        case 1:
          return '正常';
        case -1:
          return '未通过';
      }
    },
  },
];

const listType = ref('all'),
  listTypeOptions = [
    { label: '全部', value: 'all' },
    { label: '我的', value: 'my' },
  ];

const pagination = ref({
  page: 1,
  pageSize: 20,
  itemCount: 0,
});

const getData = () => {
  loading.value = true;
  Axios.get('/yiyan/sentence/', {
    params: {
      page: pagination.value.page,
      creator: listType.value === 'my' ? store.user.id : undefined,
    },
  }).then(res => {
    loading.value = false;
    data.value = res.data.results;
    pagination.value.itemCount = res.data.count;
  });
};
getData();
</script>

<template>
  <n-h1> 短链接列表 </n-h1>

  <n-radio-group
    v-model:value="listType"
    style="margin-bottom: 20px"
    @update:value="getData()"
  >
    <n-radio-button
      v-for="item in listTypeOptions"
      :key="item.value"
      :value="item.value"
      :label="item.label"
    />
  </n-radio-group>

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
