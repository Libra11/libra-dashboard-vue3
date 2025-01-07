<!--
 * @Author: Libra
 * @Date: 2025-01-07 10:15:00
 * @LastEditors: Libra
 * @Description: 用户管理
-->
<template>
  <div class="p-4">
    <el-card class="mb-4">
      <div class="flex justify-between items-center mb-4">
        <div class="flex gap-4">
          <el-input
            v-model="searchForm.keyword"
            placeholder="请输入用户名/昵称/邮箱搜索"
            class="w-[300px]"
            clearable
            @keyup.enter="handleSearch"
          />
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="resetSearch">重置</el-button>
        </div>
        <el-button type="primary" @click="handleAdd">新增用户</el-button>
      </div>
    </el-card>

    <el-card>
      <el-table :data="filteredTableData" v-loading="loading" border>
        <el-table-column type="index" label="序号" width="80" align="center" />
        <el-table-column prop="username" label="用户名" />
        <el-table-column prop="nickname" label="昵称" />
        <el-table-column prop="email" label="邮箱" />
        <el-table-column prop="avatar" label="头像" width="80" align="center">
          <template #default="{ row }">
            <el-avatar :size="32" :src="row.avatar">
              {{ row.nickname?.charAt(0)?.toUpperCase() }}
            </el-avatar>
          </template>
        </el-table-column>
        <el-table-column prop="roles" label="角色" min-width="120">
          <template #default="{ row }">
            <el-space wrap>
              <el-tag
                v-for="role in row.roles"
                :key="role.id"
                size="small"
              >
                {{ role.name }}
              </el-tag>
            </el-space>
          </template>
        </el-table-column>
        <el-table-column prop="isActive" label="状态" width="80" align="center">
          <template #default="{ row }">
            <el-tag :type="row.isActive ? 'success' : 'danger'">
              {{ row.isActive ? '启用' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="创建时间" width="180" />
        <el-table-column label="操作" width="250" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="handleEdit(row)">编辑</el-button>
            <el-button link type="primary" @click="handleResetPassword(row)">重置密码</el-button>
            <el-button link type="danger" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 用户表单弹窗 -->
    <el-dialog
      :title="dialogTitle"
      v-model="dialogVisible"
      width="600px"
      destroy-on-close
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item 
          label="密码" 
          prop="password"
          v-if="dialogTitle === '新增用户' || isResetPassword"
        >
          <el-input v-model="form.password" type="password" placeholder="请输入密码" show-password />
        </el-form-item>
        <el-form-item label="昵称" prop="nickname">
          <el-input v-model="form.nickname" placeholder="请输入昵称" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="form.email" placeholder="请输入邮箱" />
        </el-form-item>
        <el-form-item label="头像" prop="avatar">
          <el-input v-model="form.avatar" placeholder="请输入头像地址" />
        </el-form-item>
        <el-form-item label="角色" prop="roleIds">
          <el-select
            v-model="form.roleIds"
            multiple
            placeholder="请选择角色"
            class="w-full"
          >
            <el-option
              v-for="role in roles"
              :key="role.id"
              :label="role.name"
              :value="role.id"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="submitLoading">
          确定
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage, ElMessageBox } from 'element-plus'
import { userManageApi, type User, type CreateUserParams } from '@/api/system/user'
import { roleApi, type Role } from '@/api/system/role'

// 搜索表单
const searchForm = reactive({
  keyword: '',
})

// 表格数据
const loading = ref(false)
const tableData = ref<User[]>([])

// 过滤后的表格数据
const filteredTableData = computed(() => {
  const keyword = searchForm.keyword.toLowerCase()
  if (!keyword) return tableData.value
  
  return tableData.value.filter(item => 
    item.username.toLowerCase().includes(keyword) ||
    item.nickname.toLowerCase().includes(keyword) ||
    item.email.toLowerCase().includes(keyword)
  )
})

// 用户表单
const dialogVisible = ref(false)
const dialogTitle = ref('')
const submitLoading = ref(false)
const isResetPassword = ref(false)
const currentEditId = ref<number>()
const formRef = ref<FormInstance>()
const form = reactive<CreateUserParams>({
  username: '',
  password: '',
  nickname: '',
  email: '',
  avatar: '',
  roleIds: [],
})

// 角色列表
const roles = ref<Role[]>([])

// 获取角色列表
const fetchRoles = async () => {
  try {
    const res = await roleApi.getRoleList()
    if (res.code === 200) {
      roles.value = res.data
    }
  } catch (error) {
    console.error('获取角色列表失败:', error)
  }
}

// 表单校验规则
const rules = reactive<FormRules>({
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能小于6位', trigger: 'blur' },
  ],
  nickname: [
    { required: true, message: '请输入昵称', trigger: 'blur' },
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' },
  ],
  roleIds: [
    { required: true, message: '请选择角色', trigger: 'change' },
    { type: 'array', min: 1, message: '请至少选择一个角色', trigger: 'change' },
  ],
})

// 搜索
const handleSearch = () => {
  // 已通过计算属性实现
}

// 重置搜索
const resetSearch = () => {
  searchForm.keyword = ''
}

// 获取表格数据
const fetchData = async () => {
  loading.value = true
  try {
    const res = await userManageApi.getUserList()
    if (res.code === 200) {
      tableData.value = res.data
    }
  } catch (error) {
    console.error('获取用户列表失败:', error)
  } finally {
    loading.value = false
  }
}

// 新增用户
const handleAdd = () => {
  dialogTitle.value = '新增用户'
  dialogVisible.value = true
  isResetPassword.value = false
  // 重置表单
  form.username = ''
  form.password = ''
  form.nickname = ''
  form.email = ''
  form.avatar = ''
  form.roleIds = []
}

// 编辑用户
const handleEdit = async (row: User) => {
  dialogTitle.value = '编辑用户'
  dialogVisible.value = true
  isResetPassword.value = false
  currentEditId.value = row.id
  // 填充表单
  form.username = row.username
  form.nickname = row.nickname
  form.email = row.email
  form.avatar = row.avatar
  form.roleIds = row.roles.map(role => role.id)
}

// 重置密码
const handleResetPassword = (row: User) => {
  dialogTitle.value = '重置密码'
  dialogVisible.value = true
  isResetPassword.value = true
  currentEditId.value = row.id
  // 只需要密码字段
  form.password = ''
}

// 删除用户
const handleDelete = async (row: User) => {
  try {
    await ElMessageBox.confirm('确定要删除该用户吗？', '提示', {
      type: 'warning'
    })
    const res = await userManageApi.deleteUser(row.id)
    if (res.code === 200) {
      ElMessage.success('删除成功')
      fetchData()
    }
  } catch {
    // 取消操作
  }
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return
  
  await formRef.value.validate(async (valid) => {
    if (valid) {
      submitLoading.value = true
      try {
        if (dialogTitle.value === '新增用户') {
          const res = await userManageApi.createUser(form)
          if (res.code === 200) {
            ElMessage.success('创建成功')
            dialogVisible.value = false
            fetchData()
          }
        } else if (dialogTitle.value === '重置密码') {
          const res = await userManageApi.updateUser(currentEditId.value!, {
            password: form.password
          })
          if (res.code === 200) {
            ElMessage.success('密码重置成功')
            dialogVisible.value = false
          }
        } else {
          const res = await userManageApi.updateUser(currentEditId.value!, {
            nickname: form.nickname,
            email: form.email,
            avatar: form.avatar,
            roleIds: form.roleIds
          })
          if (res.code === 200) {
            ElMessage.success('更新成功')
            dialogVisible.value = false
            fetchData()
          }
        }
      } finally {
        submitLoading.value = false
      }
    }
  })
}

// 初始化
onMounted(() => {
  fetchData()
  fetchRoles()
})
</script> 