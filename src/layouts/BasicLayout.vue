<!--
 * @Author: Libra
 * @Date: 2025-01-04 00:01:40
 * @LastEditors: Libra
 * @Description: 
-->
<template>
  <el-container class="layout-container">
    <el-aside width="200px">
      <el-menu
        :default-active="route.path"
        class="el-menu-vertical"
        :router="true"
      >
        <el-menu-item index="/home">
          <el-icon><House /></el-icon>
          <span>首页</span>
        </el-menu-item>
        <!-- 可以在这里添加更多菜单项 -->
      </el-menu>
    </el-aside>
    
    <el-container>
      <el-header>
        <div class="header-right">
          <!-- 主题切换 -->
          <el-button
            :icon="themeStore.isDark ? Sunny : Moon"
            circle
            @click="themeStore.toggleTheme"
            style="margin-right: 20px"
          />
          
          <el-dropdown @command="handleCommand" style="margin-right: 20px">
            <span class="el-dropdown-link">
              <el-icon><User /></el-icon>
              {{ t("message.hello") }}
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="logout">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
          
          <!-- 语言切换 -->
          <el-dropdown @command="handleLanguage">
            <span class="el-dropdown-link">
              <el-icon><Location /></el-icon>
              {{ currentLang }}
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="zh-CN">中文</el-dropdown-item>
                <el-dropdown-item command="en-US">English</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>
      
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { House, User, Location, Moon, Sunny } from "@element-plus/icons-vue";
import { useRouter, useRoute } from "vue-router";
import { useUserStore } from "@/stores/modules/userStore";
import { useI18nStore } from "@/stores/modules/i18nStore";
import { useThemeStore } from "@/stores/modules/themeStore";
import { useI18n } from "vue-i18n";

const router = useRouter();
const route = useRoute();
const userStore = useUserStore();
const i18nStore = useI18nStore();
const themeStore = useThemeStore();
const { t } = useI18n();

const currentLang = computed(() => (i18nStore.locale === "zh-CN" ? "中文" : "English"));

const handleCommand = async (command: string) => {
  if (command === "logout") {
    userStore.logout();
    router.push("/login");
  }
};

const handleLanguage = (command: string) => {
  i18nStore.setLocale(command);
};
</script>

<style scoped>
</style> 