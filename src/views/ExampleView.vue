<template>
  <div class="example-container">
    <el-space direction="vertical" size="large">
      <el-button @click="handleDefault">默认请求</el-button>
      <el-button @click="handleNoLoading">无Loading请求</el-button>
      <el-button @click="handleNoError">无错误提示请求</el-button>
      <el-button @click="handleCustomError">自定义错误提示</el-button>
      <el-button @click="handleSuccess">带成功提示</el-button>
      <el-button @click="handleComplex">组合配置</el-button>
    </el-space>
  </div>
</template>

<script setup lang="ts">
import { exampleApi } from "@/api/example";

const handleDefault = async () => {
  try {
    const res = await exampleApi.getDefault();
    console.log('默认请求响应:', res);
  } catch (error) {
    console.error('默认请求失败:', error);
  }
};

const handleNoLoading = async () => {
  try {
    const res = await exampleApi.getWithoutLoading();
    console.log('无Loading请求响应:', res);
  } catch (error) {
    console.error('无Loading请求失败:', error);
  }
};

const handleNoError = async () => {
  try {
    const res = await exampleApi.getWithoutError();
    console.log('无错误提示请求响应:', res);
  } catch (error) {
    console.error('无错误提示请求失败:', error);
  }
};

const handleCustomError = async () => {
  try {
    const res = await exampleApi.getWithCustomError();
    console.log('自定义错误提示响应:', res);
  } catch (error) {
    console.error('自定义错误提示失败:', error);
  }
};

const handleSuccess = async () => {
  try {
    const res = await exampleApi.createWithSuccess();
    console.log('成功提示响应:', res);
  } catch (error) {
    console.error('成功提示失败:', error);
  }
};

const handleComplex = async () => {
  try {
    const res = await exampleApi.complexExample();
    console.log('组合配置响应:', res);
  } catch (error) {
    console.error('组合配置失败:', error);
  }
};
</script>

<style scoped>
.example-container {
  padding: 20px;
}
</style> 