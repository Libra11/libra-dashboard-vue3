<!--
 * @Author: Libra
 * @Description: 顶部导航栏组件
-->
<template>
  <div class="flex items-center justify-end h-[60px] px-5 ">
    <!-- 模式切换 -->
    <el-button
      :icon="modeStore.isDark ? Sunny : Moon"
      circle
      class="mr-5"
      @click="(event) => modeStore.toggleMode(event)"
    />

    <!-- 主题切换 -->
    <ChangeTheme class="mr-5" />
    
    <!-- 用户信息 -->
    <el-dropdown @command="handleCommand" class="mr-5">
      <span class="flex items-center cursor-pointer">
        <el-icon class="mr-2"><User /></el-icon>
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
      <span class="flex items-center cursor-pointer">
        <el-icon class="mr-2"><Location /></el-icon>
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
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRouter } from "vue-router";
import { User, Location, Moon, Sunny } from "@element-plus/icons-vue";
import { useUserStore } from "@/stores/modules/userStore";
import { useI18nStore } from "@/stores/modules/i18nStore";
import { useModeStore } from "@/stores/modules/modeStore";
import { useI18n } from "vue-i18n";
import ChangeTheme from "@/components/ChangeTheme.vue";

const router = useRouter();
const userStore = useUserStore();
const i18nStore = useI18nStore();
const modeStore = useModeStore();
const { t } = useI18n();

const currentLang = computed(() => (i18nStore.locale === "zh-CN" ? "中文" : "English"));

const handleCommand = async (command: string) => {
  if (command === "logout") {
    userStore.logout();
    router.push("/login");
  }
};

const handleLanguage = (command: "zh-CN" | "en-US") => {
  i18nStore.setLocale(command);
};
</script> 