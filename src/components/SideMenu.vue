<!--
 * @Author: Libra
 * @Date: 2025-01-04 23:17:26
 * @LastEditors: Libra
 * @Description: 
-->
<!--
 * @Author: Libra
 * @Description: 侧边菜单组件
-->
<template>
  <div
    class="h-full transition-all duration-300 flex flex-col"
    :class="[isCollapse ? 'w-16' : 'w-[220px]']"
  >

  <div class="flex justify-center items-center py-2">
    <img src="@/assets/vue.svg" alt="">
    <span class="ml-2">Libra</span>
  </div>

  <div class="text-[var(--el-text-color-secondary)] px-4 py-4">
    Dashboard
  </div>

    <!-- 菜单主体 -->
    <el-menu
      :default-active="route.path"
      :collapse="isCollapse"
      :router="true"
      class="flex-1 !border-none"
      @open="handleOpen"
      @close="handleClose"
    >
      <el-menu-item index="/home" class="menu-item">
        <el-icon><House /></el-icon>
        <template #title>首页</template>
      </el-menu-item>

      <el-sub-menu index="1">
        <template #title>
          <el-icon><Document /></el-icon>
          <span>系统管理</span>
        </template>
          <el-menu-item index="/system/user" class="menu-item">
            <el-icon><User /></el-icon>
            <span>用户管理</span>
          </el-menu-item>
          <el-menu-item index="/system/role" class="menu-item">
            <el-icon><Setting /></el-icon>
            <span>角色管理</span>
          </el-menu-item>
      </el-sub-menu>

      <el-sub-menu index="2">
        <template #title>
          <el-icon><Location /></el-icon>
          <span>示例页面</span>
        </template>
        <el-menu-item index="/example/table" class="menu-item">
          <el-icon><Grid /></el-icon>
          <span>表格页面</span>
        </el-menu-item>
        <el-menu-item index="/example/form" class="menu-item">
          <el-icon><EditPen /></el-icon>
          <span>表单页面</span>
        </el-menu-item>
      </el-sub-menu>
    </el-menu>

    <!-- 折叠按钮 -->
    <div
      class="h-[60px] flex items-center justify-center cursor-pointer transition-colors duration-300"
      @click="toggleCollapse"
    >
      <el-icon
        class="text-base transition-transform duration-300"
        :class="{ 'rotate-180': !isCollapse }"
      >
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
} from "@element-plus/icons-vue";

const route = useRoute();
const isCollapse = ref(false);

const toggleCollapse = () => {
  isCollapse.value = !isCollapse.value;
};

const handleOpen = (key: string, keyPath: string[]) => {
  console.log(key, keyPath);
};

const handleClose = (key: string, keyPath: string[]) => {
  console.log(key, keyPath);
};
</script>

<style lang="scss" scoped>

</style> 