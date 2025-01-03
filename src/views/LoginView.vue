<!--
 * @Author: Libra
 * @Date: 2025-01-03 23:39:29
 * @LastEditors: Libra
 * @Description: 登录页面
-->
<template>
  <div class="login-container">
    <el-card class="login-card">
      <template #header>
        <h2>系统登录</h2>
      </template>
      
      <el-form>
        <el-form-item>
          <el-button type="primary" @click="handleLogin" :loading="loading" block>
            登录
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/modules/userStore'

const router = useRouter()
const userStore = useUserStore()
const loading = ref(false)

const handleLogin = async () => {
  loading.value = true
  try {
    const success = await userStore.login()
    if (success) {
      router.push('/home')
    }
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-container {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f5f7fa;
}

.login-card {
  width: 400px;
}

:deep(.el-card__header) {
  text-align: center;
}
</style>
