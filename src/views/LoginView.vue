<!--
 * @Author: Libra
 * @Date: 2025-01-03 23:39:29
 * @LastEditors: Libra
 * @Description: 登录页面
-->
<template>
  <div class="min-h-screen flex items-center justify-center">
    <el-card class="w-[420px] shadow-lg">
      <template #header>
        <h2 class="text-2xl font-bold text-center">系统登录</h2>
      </template>
      
      <el-form 
        ref="formRef"
        :model="loginForm"
        :rules="rules"
        @keyup.enter="handleLogin"
      >
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            placeholder="请输入用户名"
            :prefix-icon="User"
          />
        </el-form-item>
        
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            type="password"
            placeholder="请输入密码"
            :prefix-icon="Lock"
            show-password
          />
        </el-form-item>

        <el-form-item prop="captchaCode">
          <div class="flex gap-4">
            <el-input
              v-model="loginForm.captchaCode"
              placeholder="请输入验证码"
              :prefix-icon="Key"
            />
            <div 
              class="w-[120px] cursor-pointer  flex items-center justify-center"
              @click="refreshCaptcha"
              v-html="captchaImage"
            />
          </div>
        </el-form-item>

        <el-form-item>
          <el-button 
            type="primary" 
            @click="handleLogin" 
            :loading="loading" 
            class="w-full"
          >
            登录
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/modules/userStore'
import { User, Lock, Key } from '@element-plus/icons-vue'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'
import { userApi } from '@/api/user'

const router = useRouter()
const userStore = useUserStore()
const loading = ref(false)
const formRef = ref<FormInstance>()
const captchaImage = ref('')

const loginForm = reactive({
  username: '',
  password: '',
  captchaId: '',
  captchaCode: ''
})

const rules = reactive<FormRules>({
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
  ],
  captchaCode: [
    { required: true, message: '请输入验证码', trigger: 'blur' },
    { min: 4, max: 4, message: '验证码长度为4位', trigger: 'blur' }
  ]
})

const getCaptcha = async () => {
  try {
    const response = await userApi.getCaptcha()
    if (response.code === 200) {
      const { data } = response
      captchaImage.value = data.image
      loginForm.captchaId = data.id
    }
  } catch (error) {
    ElMessage.error('获取验证码失败')
  }
}

const refreshCaptcha = () => {
  getCaptcha()
}

const handleLogin = async () => {
  if (!formRef.value) return
  
  await formRef.value.validate(async (valid) => {
    if (valid) {
      loading.value = true
      try {
        const success = await userStore.login(loginForm)
        if (success) {
          router.push('/home')
        }
      } finally {
        loading.value = false
      }
    }
  })
}

onMounted(() => {
  getCaptcha()
})
</script>

<style scoped>
:deep(svg) {
  width: 100%;
  height: 100%;
}
</style>
