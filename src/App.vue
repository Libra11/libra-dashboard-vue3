<template>
  <RouterView />
</template>

<script setup lang="ts">
import { RouterView } from "vue-router";
</script>

<style scoped></style>
<!-- 登录页不使用布局，Home页使用布局，布局左边是sider，右边是主页，类似于dashboard，使用element-plus -->