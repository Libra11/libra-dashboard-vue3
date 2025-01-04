<!--
 * @Author: Libra
 * @Date: 2025-01-04 00:01:40
 * @LastEditors: Libra
 * @Description: 基础布局
-->
<template>
  <el-container class="h-screen">
    <el-aside :width="'auto'">
      <SideMenu />
    </el-aside>
    
    <el-container>
      <el-header class="p-0">
        <HeaderBar />
      </el-header>
      
      <el-main class=" p-5">
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useI18nStore } from "@/stores/modules/i18nStore";
import { useModeStore } from "@/stores/modules/modeStore";
import { useThemeStore } from "@/stores/modules/themeStore";
import SideMenu from "@/components/SideMenu.vue";
import HeaderBar from "@/components/HeaderBar.vue";

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