<!--
 * @Author: Libra
 * @Date: 2025-01-06 16:00:00
 * @LastEditors: Libra
 * @Description: 权限管理
-->
<template>
  <div class="p-4">
    <el-card class="mb-4">
      <div class="flex justify-between items-center mb-4">
        <div class="flex gap-4">
          <el-input
            v-model="searchForm.keyword"
            placeholder="请输入权限名称搜索"
            class="w-[200px]"
            clearable
            @keyup.enter="handleSearch"
          />
          <el-select v-model="searchForm.type" placeholder="权限类型" clearable>
            <el-option label="菜单" value="menu" />
            <el-option label="按钮" value="button" />
            <el-option label="接口" value="api" />
          </el-select>
          <el-select v-model="searchForm.groupId" placeholder="权限组" clearable>
            <el-option
              v-for="group in permissionGroups"
              :key="group.id"
              :label="group.name"
              :value="group.id"
            />
          </el-select>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="resetSearch">重置</el-button>
        </div>
        <div class="flex gap-4">
          <el-button type="primary" @click="handleAddGroup">新增权限组</el-button>
          <el-button type="primary" @click="() => handleAdd()">新增权限</el-button>
        </div>
      </div>
    </el-card>

    <el-card>
      <el-table
        :data="treeData"
        v-loading="loading"
        row-key="id"
        border
        default-expand-all
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      >
        <el-table-column prop="name" label="名称" min-width="200" />
        <el-table-column prop="code" label="编码" min-width="200" />
        <el-table-column prop="type" label="类型" width="100">
          <template #default="{ row }">
            <el-tag v-if="row.type" :type="getPermissionTypeTag(row.type)">
              {{ getPermissionTypeLabel(row.type) }}
            </el-tag>
            <el-tag v-else type="info">权限组</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="description" label="描述" show-overflow-tooltip min-width="200" />
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <template v-if="row.type">
              <el-button link type="primary" @click="handleEdit(row)">编辑</el-button>
              <el-button link type="danger" @click="handleDelete(row)">删除</el-button>
            </template>
            <template v-else>
              <el-button link type="primary" @click="handleEditGroup(row)">编辑</el-button>
              <el-button link type="danger" @click="handleDeleteGroup(row)">删除</el-button>
            </template>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 权限表单弹窗 -->
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
        <el-form-item label="权限类型" prop="type">
          <el-select v-model="form.type" placeholder="请选择权限类型" class="w-full">
            <el-option label="菜单" value="menu" />
            <el-option label="按钮" value="button" />
            <el-option label="接口" value="api" />
          </el-select>
        </el-form-item>
        <el-form-item label="权限名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入权限名称" />
        </el-form-item>
        <el-form-item label="权限编码" prop="code">
          <el-input v-model="form.code" placeholder="请输入权限编码" />
        </el-form-item>
        <el-form-item label="权限描述" prop="description">
          <el-input
            v-model="form.description"
            type="textarea"
            placeholder="请输入权限描述"
          />
        </el-form-item>
        <el-form-item label="所属权限组" prop="groupId">
          <el-select v-model="form.groupId" placeholder="请选择权限组（可选）" class="w-full" clearable>
            <el-option
              v-for="group in permissionGroups"
              :key="group.id"
              :label="group.name"
              :value="group.id"
            />
          </el-select>
          <div class="mt-1 text-gray-400 text-sm">如果没有合适的权限组，可以先不选择，创建后再进行分配</div>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="submitLoading">
          确定
        </el-button>
      </template>
    </el-dialog>

    <!-- 权限组表单弹窗 -->
    <el-dialog
      :title="groupDialogTitle"
      v-model="groupDialogVisible"
      width="600px"
      destroy-on-close
    >
      <el-form
        ref="groupFormRef"
        :model="groupForm"
        :rules="groupRules"
        label-width="100px"
      >
        <el-form-item label="权限组名称" prop="name">
          <el-input v-model="groupForm.name" placeholder="请输入权限组名称" />
        </el-form-item>
        <el-form-item label="权限组编码" prop="code">
          <el-input v-model="groupForm.code" placeholder="请输入权限组编码" />
        </el-form-item>
        <el-form-item label="权限组描述" prop="description">
          <el-input
            v-model="groupForm.description"
            type="textarea"
            placeholder="请输入权限组描述"
          />
        </el-form-item>
        <el-form-item label="包含权限" prop="permissionIds">
          <el-select
            v-model="groupForm.permissionIds"
            multiple
            placeholder="请选择权限（可选）"
            class="w-full"
            clearable
          >
            <el-option
              v-for="permission in permissions"
              :key="permission.id"
              :label="permission.name"
              :value="permission.id"
            />
          </el-select>
          <div class="mt-1 text-gray-400 text-sm">如果还没有创建权限，可以先不选择，创建后再进行分配</div>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="groupDialogVisible = false">取消</el-button>
        <el-button
          type="primary"
          @click="handleGroupSubmit"
          :loading="groupSubmitLoading"
        >
          确定
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  type Permission,
  type PermissionType,
  type PermissionGroup,
  type CreatePermissionParams,
  type CreatePermissionGroupParams,
  permissionApi
} from '@/api/system/permission'

// 搜索表单
const searchForm = reactive({
  keyword: '',
  type: '' as PermissionType | '',
  groupId: undefined as number | undefined
})

// 表格数据
const loading = ref(false)
const tableData = ref<Permission[]>([])
const permissions = ref<Permission[]>([])
const permissionGroups = ref<PermissionGroup[]>([])

// 权限表单
const dialogVisible = ref(false)
const dialogTitle = ref('')
const submitLoading = ref(false)
const formRef = ref<FormInstance>()
const form = reactive({
  id: undefined as number | undefined,
  name: '',
  code: '',
  type: 'menu' as PermissionType,
  description: '',
  groupId: undefined as number | undefined
})

// 权限组表单
const groupDialogVisible = ref(false)
const groupDialogTitle = ref('')
const groupSubmitLoading = ref(false)
const groupFormRef = ref<FormInstance>()
const groupForm = reactive({
  id: undefined as number | undefined,
  name: '',
  code: '',
  description: '',
  permissionIds: [] as number[]
})

// 表单校验规则
const rules = reactive<FormRules>({
  type: [
    { required: true, message: '请选择权限类型', trigger: 'change' }
  ],
  name: [
    { required: true, message: '请输入权限名称', trigger: 'blur' }
  ],
  code: [
    { required: true, message: '请输入权限编码', trigger: 'blur' }
  ]
})

// 权限组表单校验规则
const groupRules = reactive<FormRules>({
  name: [
    { required: true, message: '请输入权限组名称', trigger: 'blur' }
  ],
  code: [
    { required: true, message: '请输入权限组编码', trigger: 'blur' }
  ]
})

// 获取权限类型标签类型
const getPermissionTypeTag = (type: PermissionType): 'success' | 'warning' | 'info' | 'primary' | 'danger' => {
  const map: Record<PermissionType, 'success' | 'warning' | 'info'> = {
    button: 'success',
    api: 'warning'
  }
  return map[type]
}

// 获取权限类型标签文本
const getPermissionTypeLabel = (type: PermissionType) => {
  const map: Record<PermissionType, string> = {
    button: '按钮',
    api: '接口'
  }
  return map[type]
}

// 搜索
const handleSearch = () => {
  fetchData()
}

// 重置搜索
const resetSearch = () => {
  searchForm.keyword = ''
  searchForm.type = ''
  searchForm.groupId = undefined
  handleSearch()
}

// 获取表格数据
const fetchData = async () => {
  loading.value = true
  try {
    const [permissionsRes, groupsRes] = await Promise.all([
      permissionApi.getPermissionList(),
      permissionApi.getPermissionGroupList()
    ])
    permissions.value = permissionsRes.data
    permissionGroups.value = groupsRes.data
    
    // 根据搜索条件过滤
    tableData.value = permissions.value.filter(item => {
      const matchKeyword = !searchForm.keyword || 
        item.name.includes(searchForm.keyword) ||
        item.code.includes(searchForm.keyword)
      const matchType = !searchForm.type || item.type === searchForm.type
      const matchGroup = !searchForm.groupId || item.groupId === searchForm.groupId
      return matchKeyword && matchType && matchGroup
    })
  } catch (error) {
    console.error(error)
    ElMessage.error('获取数据失败')
  } finally {
    loading.value = false
  }
}

// 新增权限
const handleAdd = () => {
  dialogTitle.value = '新增权限'
  dialogVisible.value = true
  // 重置表单
  form.id = undefined
  form.name = ''
  form.code = ''
  form.type = 'api'
  form.description = ''
  form.groupId = undefined
}

// 新增权限组
const handleAddGroup = () => {
  groupDialogTitle.value = '新增权限组'
  groupDialogVisible.value = true
  // 重置表单
  groupForm.id = undefined
  groupForm.name = ''
  groupForm.code = ''
  groupForm.description = ''
  groupForm.permissionIds = []
}

// 编辑权限
const handleEdit = (row: Permission) => {
  dialogTitle.value = '编辑权限'
  dialogVisible.value = true
  // 填充表单
  form.id = row.id
  form.name = row.name
  form.code = row.code
  form.type = row.type
  form.description = row.description || ''
  form.groupId = row.groupId
}

// 删除权限
const handleDelete = async (row: Permission) => {
  try {
    await ElMessageBox.confirm('确定要删除该权限吗？', '提示', {
      type: 'warning'
    })
    await permissionApi.deletePermission(row.id)
    ElMessage.success('删除成功')
    fetchData()
  } catch (error) {
    if (error instanceof Error) {
      ElMessage.error(error.message)
    }
  }
}

// 提交权限表单
const handleSubmit = async () => {
  if (!formRef.value) return
  
  await formRef.value.validate(async (valid) => {
    if (valid) {
      submitLoading.value = true
      try {
        const params: CreatePermissionParams = {
          name: form.name,
          code: form.code,
          type: form.type,
          description: form.description,
          groupId: form.groupId
        }
        if (form.id) {
          await permissionApi.updatePermission(form.id, params)
          ElMessage.success('编辑成功')
        } else {
          await permissionApi.createPermission(params)
          ElMessage.success('新增成功')
        }
        dialogVisible.value = false
        fetchData()
      } catch (error) {
        if (error instanceof Error) {
          ElMessage.error(error.message)
        }
      } finally {
        submitLoading.value = false
      }
    }
  })
}

// 提交权限组表单
const handleGroupSubmit = async () => {
  if (!groupFormRef.value) return
  
  await groupFormRef.value.validate(async (valid) => {
    if (valid) {
      groupSubmitLoading.value = true
      try {
        const params: CreatePermissionGroupParams = {
          name: groupForm.name,
          code: groupForm.code,
          description: groupForm.description,
          permissionIds: groupForm.permissionIds
        }
        if (groupForm.id) {
          await permissionApi.updatePermissionGroup(groupForm.id, params)
          ElMessage.success('编辑成功')
        } else {
          await permissionApi.createPermissionGroup(params)
          ElMessage.success('新增成功')
        }
        groupDialogVisible.value = false
        fetchData()
      } catch (error) {
        if (error instanceof Error) {
          ElMessage.error(error.message)
        }
      } finally {
        groupSubmitLoading.value = false
      }
    }
  })
}

// 编辑权限组
const handleEditGroup = (row: PermissionGroup) => {
  groupDialogTitle.value = '编辑权限组'
  groupDialogVisible.value = true
  // 填充表单
  groupForm.id = row.id
  groupForm.name = row.name
  groupForm.code = row.code
  groupForm.description = row.description || ''
  groupForm.permissionIds = row.permissions.map(p => p.id)
}

// 删除权限组
const handleDeleteGroup = async (row: PermissionGroup) => {
  try {
    await ElMessageBox.confirm('确定要删除该权限组吗？删除后组内权限也会被删除！', '提示', {
      type: 'warning'
    })
    await permissionApi.deletePermissionGroup(row.id)
    ElMessage.success('删除成功')
    fetchData()
  } catch (error) {
    if (error instanceof Error) {
      ElMessage.error(error.message)
    }
  }
}

// 将权限数据转换为树形结构
const treeData = computed(() => {
  const result = permissionGroups.value.map(group => ({
    ...group,
    children: group.permissions
  }))
  console.log(result)
  return result
})

// 初始化
onMounted(() => {
  fetchData()
})
</script> 