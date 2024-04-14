<template></template>

<script lang="ts" setup>
import { useDialog, useLoadingBar, useMessage } from 'naive-ui';
import naiveui from '../plugins/naiveui';

naiveui.dialog = useDialog();
naiveui.loadingBar = useLoadingBar();
naiveui.message = useMessage();
</script>
