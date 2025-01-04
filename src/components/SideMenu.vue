<!--
 * @Author: Libra
 * @Description: 侧边菜单组件
-->
<template>
  <div
    class="h-full border-r border-[var(--el-border-color)] bg-[var(--el-bg-color)] transition-[width] duration-300"
    :class="[isCollapse ? 'w-16' : 'w-[220px]']"
  >
    <!-- Logo -->
    <div class="h-16 px-4 flex items-center">
      <img src="@/assets/vue.svg" alt="logo" class="w-8 h-8" />
      <span
        class="ml-3 text-lg font-semibold text-[var(--el-text-color-primary)] transition-transform duration-300 origin-left"
        :class="[isCollapse ? 'scale-x-0' : 'scale-x-100']"
      >
        Libra
      </span>
    </div>

    <!-- 菜单主体 -->
    <div class="px-2 py-4 space-y-1 overflow-y-auto">
      <!-- 首页 -->
      <router-link
        to="/home"
        class="flex items-center px-2 py-3 rounded-lg text-[var(--el-text-color-primary)] transition-colors duration-200 hover:bg-[var(--el-fill-color-light)]"
        :class="[
          isCollapse ? 'justify-center' : '',
          route.path === '/home' ? 'bg-[var(--el-color-primary-light-9)]' : ''
        ]"
      >
        <div class="flex items-center justify-center w-10 h-10 rounded-lg bg-[var(--el-bg-color-overlay)]">
          <House class="w-5 h-5" :class="route.path === '/home' ? 'text-[var(--el-color-primary)]' : 'text-[var(--el-text-color-secondary)]'" />
        </div>
        <span
          class="ml-3 text-sm font-medium transition-transform duration-300 origin-left"
          :class="[isCollapse ? 'scale-x-0' : 'scale-x-100']"
        >
          首页
        </span>
      </router-link>

      <!-- 系统管理 -->
      <div class="space-y-1">
        <button
          @click="toggleSubmenu('system')"
          class="w-full flex items-center px-2 py-3 rounded-lg text-[var(--el-text-color-primary)] transition-colors duration-200 hover:bg-[var(--el-fill-color-light)]"
          :class="[isCollapse ? 'justify-center' : '']"
        >
          <div class="flex items-center justify-center w-10 h-10 rounded-lg bg-[var(--el-bg-color-overlay)]">
            <Document class="w-5 h-5 text-[var(--el-text-color-secondary)]" />
          </div>
          <span
            class="ml-3 text-sm font-medium transition-transform duration-300 origin-left"
            :class="[isCollapse ? 'scale-x-0' : 'scale-x-100']"
          >
            系统管理
          </span>
          <el-icon
            class="ml-auto transition-transform duration-300"
            :class="[
              isCollapse ? 'opacity-0 scale-0' : '',
              openSubmenus.includes('system') ? 'rotate-180' : ''
            ]"
          >
            <ArrowDown class="text-[var(--el-text-color-secondary)]" />
          </el-icon>
        </button>

        <!-- 子菜单 -->
        <div
          class="overflow-hidden transition-[max-height] duration-300"
          :class="[!openSubmenus.includes('system') || isCollapse ? 'max-h-0' : 'max-h-[200px]']"
        >
          <router-link
            to="/system/user"
            class="flex items-center pl-12 pr-2 py-3 rounded-lg text-[var(--el-text-color-primary)] transition-colors duration-200 hover:bg-[var(--el-fill-color-light)]"
            :class="[route.path === '/system/user' ? 'bg-[var(--el-color-primary-light-9)]' : '']"
          >
            <div class="flex items-center justify-center w-10 h-10 rounded-lg bg-[var(--el-bg-color-overlay)]">
              <User class="w-5 h-5" :class="route.path === '/system/user' ? 'text-[var(--el-color-primary)]' : 'text-[var(--el-text-color-secondary)]'" />
            </div>
            <span class="ml-3 text-sm font-medium">用户管理</span>
          </router-link>

          <router-link
            to="/system/role"
            class="flex items-center pl-12 pr-2 py-3 rounded-lg text-[var(--el-text-color-primary)] transition-colors duration-200 hover:bg-[var(--el-fill-color-light)]"
            :class="[route.path === '/system/role' ? 'bg-[var(--el-color-primary-light-9)]' : '']"
          >
            <div class="flex items-center justify-center w-10 h-10 rounded-lg bg-[var(--el-bg-color-overlay)]">
              <Setting class="w-5 h-5" :class="route.path === '/system/role' ? 'text-[var(--el-color-primary)]' : 'text-[var(--el-text-color-secondary)]'" />
            </div>
            <span class="ml-3 text-sm font-medium">角色管理</span>
          </router-link>
        </div>
      </div>
    </div>

    <!-- 折叠按钮 -->
    <div
      class="h-16 flex items-center justify-center cursor-pointer text-[var(--el-text-color-secondary)] transition-colors duration-200 hover:bg-[var(--el-fill-color-light)]"
      @click="toggleCollapse"
    >
      <el-icon class="text-lg transition-transform duration-300" :class="[!isCollapse ? 'rotate-180' : '']">
        <Fold v-if="isCollapse" />
        <Expand v-else />
      </el-icon>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRoute } from "vue-router";
import {
  House,
  Document,
  Setting,
  Location,
  User,
  Grid,
  EditPen,
  Fold,
  Expand,
  ArrowDown,
} from "@element-plus/icons-vue";

const route = useRoute();
const isCollapse = ref(false);
const openSubmenus = ref<string[]>([]);

const toggleCollapse = () => {
  isCollapse.value = !isCollapse.value;
  if (isCollapse.value) {
    openSubmenus.value = [];
  }
};

const toggleSubmenu = (name: string) => {
  const index = openSubmenus.value.indexOf(name);
  if (index > -1) {
    openSubmenus.value.splice(index, 1);
  } else {
    openSubmenus.value.push(name);
  }
};
</script> 