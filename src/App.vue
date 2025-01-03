<template>
  <el-config-provider :locale="locale">
    <router-view></router-view>
  </el-config-provider>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { ElConfigProvider } from "element-plus";
import zhCn from "element-plus/es/locale/lang/zh-cn";
import en from "element-plus/es/locale/lang/en";
import { useI18nStore } from "@/stores/modules/i18nStore";

const i18nStore = useI18nStore();
const locale = ref(i18nStore.locale === "zh-CN" ? zhCn : en);

// 监听语言变化
watch(
  () => i18nStore.locale,
  (val) => {
    locale.value = val === "zh-CN" ? zhCn : en;
    i18nStore.setLocale(val as "zh-CN" | "en-US");
  },
  { immediate: true }
);
</script>

<style>
html,
body {
  margin: 0;
  padding: 0;
  height: 100%;
}
</style>