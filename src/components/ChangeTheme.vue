<!--
 * @Author: Libra
 * @Date: 2025-01-04 01:29:04
 * @LastEditors: Libra
 * @Description: 
-->

<template>
  <el-dropdown @command="handleThemeChange">
    <span class="el-dropdown-link">
      <el-icon><Brush /></el-icon>
      主题切换
    </span>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item command="default">默认蓝</el-dropdown-item>
        <el-dropdown-item command="green">清新绿</el-dropdown-item>
        <el-dropdown-item command="purple">高贵紫</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup lang="ts">
import { Brush } from '@element-plus/icons-vue'
import { useThemeStore, type ThemeType } from '@/stores/modules/themeStore'

const themeStore = useThemeStore()

const handleThemeChange = (command: ThemeType) => {
  themeStore.changeTheme(command)
}
</script>
