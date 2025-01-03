<template>
  <el-config-provider :locale="i18nStore.elLocale">
    <router-view></router-view>
  </el-config-provider>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { ElConfigProvider } from "element-plus";
import { useI18nStore } from "@/stores/modules/i18nStore";
import { useModeStore } from "@/stores/modules/modeStore";
import { useThemeStore } from "@/stores/modules/themeStore";

const i18nStore = useI18nStore();
const modeStore = useModeStore();
const themeStore = useThemeStore();

// 初始化主题
onMounted(() => {
  i18nStore.initLocale();
  modeStore.initMode();
  themeStore.initTheme();
});
</script>

<style>
html,
body {
  margin: 0;
  padding: 0;
  height: 100%;
}
</style>