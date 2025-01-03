<!--
 * @Author: Libra
 * @Date: 2025-01-03 23:39:44
 * @LastEditors: Libra
 * @Description: 主页
-->
<template>
  <div class="home-container">
    <el-row :gutter="20">
      <el-col :span="8">
        <el-card>
          <template #header>
            欢迎使用
          </template>
          <div>
            这里是首页内容
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.home-container {
  padding: 20px;
}
</style>
