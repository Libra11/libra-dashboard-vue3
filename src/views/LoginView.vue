<!--
 * @Author: Libra
 * @Date: 2025-01-03 23:39:29
 * @LastEditors: Libra
 * @Description: 登录页面
-->
<template>
  <div>
    <h1>登录页面</h1>
    <el-button type="primary" @click="userStore.login">登录</el-button>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from "@/stores/modules/userStore";
import { onMounted } from "vue";
import { useRouter } from "vue-router";

const userStore = useUserStore();
const router = useRouter();
onMounted(() => {
  userStore.login();
  router.push("/home");
});
</script>
