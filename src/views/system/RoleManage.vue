<!--
 * @Author: Libra
 * @Date: 2025-01-07 10:10:31
 * @LastEditors: Libra
 * @Description: 角色管理
-->
<template>
  <div class="p-4">
    <el-card class="mb-4">
      <div class="flex justify-between items-center mb-4">
        <div class="flex gap-4">
          <el-input
            v-model="searchForm.keyword"
            placeholder="请输入角色名称搜索"
            class="w-[200px]"
            clearable
            @keyup.enter="handleSearch"
          />
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="resetSearch">重置</el-button>
        </div>
        <el-button type="primary" @click="handleAdd">新增角色</el-button>
      </div>
    </el-card>

    <el-card>
      <el-table
        :data="tableData"
        v-loading="loading"
        border
      >
        <el-table-column prop="name" label="角色名称" />
        <el-table-column prop="code" label="角色编码" />
        <el-table-column prop="description" label="描述" show-overflow-tooltip />
        <el-table-column label="操作" width="250" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="handleEdit(row)">编辑</el-button>
            <el-button link type="primary" @click="handleSetPermissions(row)">权限设置</el-button>
            <el-button link type="danger" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 角色表单弹窗 -->
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
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入角色名称" />
        </el-form-item>
        <el-form-item label="角色编码" prop="code">
          <el-input v-model="form.code" placeholder="请输入角色编码" />
        </el-form-item>
        <el-form-item label="角色描述" prop="description">
          <el-input
            v-model="form.description"
            type="textarea"
            placeholder="请输入角色描述"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="submitLoading">
          确定
        </el-button>
      </template>
    </el-dialog>

    <!-- 权限设置弹窗 -->
    <el-dialog
      title="权限设置"
      v-model="permissionDialogVisible"
      width="800px"
      destroy-on-close
    >
      <el-tabs v-model="activeTab">
        <el-tab-pane label="权限设置" name="permission">
          <div class="mb-4 flex items-center gap-2">
            <el-input
              v-model="permissionSearchKeyword"
              placeholder="请输入权限名称搜索"
              class="w-[200px]"
              clearable
              @input="filterPermissionTree"
            />
            <el-select 
              v-model="permissionSearchType" 
              placeholder="权限类型" 
              clearable
              @change="filterPermissionTree"
            >
              <el-option label="菜单" value="menu" />
              <el-option label="按钮" value="button" />
              <el-option label="接口" value="api" />
            </el-select>
          </div>

          <el-tree
            ref="permissionTreeRef"
            class="mb-4 h-[400px] overflow-y-auto"
            :data="filteredPermissionTree"
            :props="{
              children: 'children',
              label: 'name'
            }"
            show-checkbox
            node-key="id"
            default-expand-all
          >
            <template #default="{ node, data }">
              <div class="flex-1 flex items-center gap-2">
                <span>{{ node.label }}</span>
                <el-tag size="small" :type="data.type ? getPermissionTypeTag(data.type) : 'info'">
                  {{ data.type ? getPermissionTypeLabel(data.type) : '权限组' }}
                </el-tag>
                <el-tag size="small" type="info" v-if="data.code">{{ data.code }}</el-tag>
              </div>
            </template>
          </el-tree>
        </el-tab-pane>

        <el-tab-pane label="菜单设置" name="menu">
          <div class="mb-4">
            <el-input
              v-model="menuSearchKeyword"
              placeholder="请输入菜单名称搜索"
              class="w-[200px]"
              clearable
              @input="filterMenuTree"
            />
          </div>

          <el-tree
            ref="menuTreeRef"
            class="mb-4 h-[400px] overflow-y-auto"
            :data="filteredMenuTree"
            :props="{
              children: 'children',
              label: 'name'
            }"
            show-checkbox
            node-key="id"
            default-expand-all
          >
            <template #default="{ node, data }">
              <div class="flex-1 flex items-center gap-2">
                <span>{{ node.label }}</span>
                <el-tag size="small" type="info" v-if="data.path">{{ data.path }}</el-tag>
              </div>
            </template>
          </el-tree>
        </el-tab-pane>
      </el-tabs>

      <template #footer>
        <el-button @click="permissionDialogVisible = false">取消</el-button>
        <el-button
          type="primary"
          @click="handlePermissionSubmit"
          :loading="permissionSubmitLoading"
        >
          确定
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed, nextTick } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import type { ElTree } from 'element-plus'
import { ElMessage, ElMessageBox } from 'element-plus'
import { roleApi, type Role, type CreateRoleParams, type UpdateRoleParams } from '@/api/system/role'
import { permissionApi, type Permission, type PermissionGroup, type PermissionType } from '@/api/system/permission'
import { menuApi, type MenuItem } from '@/api/menu'

// 搜索表单
const searchForm = reactive({
  keyword: ''
})

// 表格数据
const loading = ref(false)
const tableData = ref<Role[]>([])

// 角色表单
const dialogVisible = ref(false)
const dialogTitle = ref('')
const submitLoading = ref(false)
const formRef = ref<FormInstance>()
const form = reactive({
  id: undefined as number | undefined,
  name: '',
  code: '',
  description: ''
})

// 权限设置
const permissionDialogVisible = ref(false)
const permissionSubmitLoading = ref(false)
const permissionTreeRef = ref<InstanceType<typeof ElTree>>()
const menuTreeRef = ref<InstanceType<typeof ElTree>>()
const currentRoleId = ref<number>()
const activeTab = ref('permission')
const permissionSearchKeyword = ref('')
const permissionSearchType = ref<PermissionType | ''>('')
const menuSearchKeyword = ref('')
const permissionGroups = ref<PermissionGroup[]>([])
const menus = ref<MenuItem[]>([])

// 表单校验规则
const rules = reactive<FormRules>({
  name: [
    { required: true, message: '请输入角色名称', trigger: 'blur' }
  ],
  code: [
    { required: true, message: '请输入角色编码', trigger: 'blur' }
  ]
})

// 获取权限类型标签类型
const getPermissionTypeTag = (type: PermissionType): 'success' | 'warning' | 'info' | 'primary' | 'danger' => {
  const map: Record<PermissionType, 'success' | 'warning' | 'info' | 'primary' | 'danger'> = {
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

// 权限树节点类型
interface TreePermission extends Omit<Permission, 'id'> {
  id: string;
}

interface TreePermissionGroup extends Omit<PermissionGroup, 'id' | 'permissions'> {
  id: string;
  children: TreePermission[];
}

// 权限树数据
const permissionTree = computed<TreePermissionGroup[]>(() => {
  return permissionGroups.value.map(group => ({
    ...group,
    id: `group_${group.id}`,
    children: group.permissions.map(permission => ({
      ...permission,
      id: `permission_${permission.id}`
    }))
  }))
})

// 过滤后的权限树数据
const filteredPermissionTree = computed(() => {
  if (!permissionSearchKeyword.value && !permissionSearchType.value) {
    return permissionTree.value
  }

  return permissionTree.value
    .map(group => {
      // 过滤权限
      const filteredPermissions = group.children.filter(permission => {
        const matchKeyword = !permissionSearchKeyword.value || 
          permission.name.includes(permissionSearchKeyword.value) ||
          permission.code.includes(permissionSearchKeyword.value)
        const matchType = !permissionSearchType.value || permission.type === permissionSearchType.value
        return matchKeyword && matchType
      })

      // 如果权限组下有匹配的权限，或者权限组本身匹配关键字，则返回该组
      if (filteredPermissions.length > 0 || 
        (permissionSearchKeyword.value && 
          (group.name.includes(permissionSearchKeyword.value) || 
           group.code.includes(permissionSearchKeyword.value)))) {
        return {
          ...group,
          children: filteredPermissions
        }
      }
      return null
    })
    .filter(Boolean) as TreePermissionGroup[]
})

// 过滤权限树
const filterPermissionTree = () => {
  // 计算属性会自动更新
}

// 搜索
const handleSearch = () => {
  fetchData()
}

// 重置搜索
const resetSearch = () => {
  searchForm.keyword = ''
  handleSearch()
}

// 获取表格数据
const fetchData = async () => {
  loading.value = true
  try {
    const res = await roleApi.getRoleList()
    tableData.value = res.data
  } catch (error) {
    console.error(error)
    ElMessage.error('获取数据失败')
  } finally {
    loading.value = false
  }
}

// 新增角色
const handleAdd = () => {
  dialogTitle.value = '新增角色'
  dialogVisible.value = true
  // 重置表单
  form.id = undefined
  form.name = ''
  form.code = ''
  form.description = ''
}

// 编辑角色
const handleEdit = (row: Role) => {
  dialogTitle.value = '编辑角色'
  dialogVisible.value = true
  // 填充表单
  form.id = row.id
  form.name = row.name
  form.code = row.code
  form.description = row.description
}

// 删除角色
const handleDelete = async (row: Role) => {
  try {
    await ElMessageBox.confirm('确定要删除该角色吗？', '提示', {
      type: 'warning'
    })
    await roleApi.deleteRole(row.id)
    ElMessage.success('删除成功')
    fetchData()
  } catch (error) {
    if (error instanceof Error) {
      ElMessage.error(error.message)
    }
  }
}

// 提交角色表单
const handleSubmit = async () => {
  if (!formRef.value) return
  
  await formRef.value.validate(async (valid) => {
    if (valid) {
      submitLoading.value = true
      try {
        if (form.id) {
          const params: UpdateRoleParams = {
            name: form.name,
            code: form.code,
            description: form.description
          }
          await roleApi.updateRole(form.id, params)
          ElMessage.success('编辑成功')
        } else {
          const params: CreateRoleParams = {
            name: form.name,
            code: form.code,
            description: form.description,
            permissionIds: []
          }
          await roleApi.createRole(params)
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

// 打开权限设置弹窗
const handleSetPermissions = async (row: Role) => {
  currentRoleId.value = row.id
  permissionDialogVisible.value = true
  activeTab.value = 'permission'
  
  try {
    // 获取所有权限组数据
    const groupsRes = await permissionApi.getPermissionGroupList()
    permissionGroups.value = groupsRes.data

    // 获取所有菜单数据
    const menusRes = await menuApi.getMenuTree()
    menus.value = menusRes.data

    // 获取角色详情，设置已选权限和菜单
    const roleRes = await roleApi.getRole(row.id)
    const selectedPermissionIds = roleRes.data.permissions.map(p => `permission_${p.id}`)
    const selectedMenuIds = roleRes.data.menus.map(m => m.id)
    
    // 等待DOM更新后设置选中状态
    await nextTick()
    if (permissionTreeRef.value) {
      permissionTreeRef.value.setCheckedKeys(selectedPermissionIds, false)
    }
    if (menuTreeRef.value) {
      menuTreeRef.value.setCheckedKeys(selectedMenuIds, false)
    }
  } catch (error) {
    console.error(error)
    ElMessage.error('获取数据失败')
  }
}

// 提交权限设置
const handlePermissionSubmit = async () => {
  if (!currentRoleId.value || !permissionTreeRef.value || !menuTreeRef.value) return

  permissionSubmitLoading.value = true
  try {
    if (activeTab.value === 'permission') {
      // 获取所有选中的权限ID（包括父节点和子节点）
      const checkedKeys = permissionTreeRef.value.getCheckedKeys(false) as string[]
      // 获取半选中的节点（父节点）
      const halfCheckedKeys = permissionTreeRef.value.getHalfCheckedKeys() as string[]
      
      // 过滤并转换权限ID（只保留实际权限的ID，并去除前缀）
      const permissionIds = [...checkedKeys, ...halfCheckedKeys]
        .filter(id => id.startsWith('permission_')) // 只保留权限ID
        .map(id => parseInt(id.replace('permission_', ''))) // 去除前缀并转换为数字

      await roleApi.setPermissions(currentRoleId.value, { permissionIds })
    } else {
      // 获取所有选中的菜单ID
      const checkedKeys = menuTreeRef.value.getCheckedKeys(false) as number[]
      // 获取半选中的节点
      const halfCheckedKeys = menuTreeRef.value.getHalfCheckedKeys() as number[]
      
      const menuIds = [...checkedKeys, ...halfCheckedKeys]

      await roleApi.setMenus(currentRoleId.value, { menuIds })
    }
    ElMessage.success('设置成功')
    permissionDialogVisible.value = false
  } catch (error) {
    if (error instanceof Error) {
      ElMessage.error(error.message)
    }
  } finally {
    permissionSubmitLoading.value = false
  }
}

// 菜单树数据
const menuTree = computed(() => {
  return menus.value
})

// 过滤后的菜单树数据
const filteredMenuTree = computed(() => {
  if (!menuSearchKeyword.value) {
    return menuTree.value
  }

  const filterNode = (node: MenuItem): MenuItem | null => {
    // 如果当前节点匹配关键字，返回当前节点
    if (node.name.includes(menuSearchKeyword.value)) {
      return node
    }

    // 如果有子节点，递归过滤子节点
    if (node.children?.length) {
      const filteredChildren = node.children
        .map(child => filterNode(child))
        .filter(Boolean) as MenuItem[]
      
      if (filteredChildren.length) {
        return {
          ...node,
          children: filteredChildren
        }
      }
    }

    return null
  }

  return menuTree.value
    .map(node => filterNode(node))
    .filter(Boolean) as MenuItem[]
})

// 过滤菜单树
const filterMenuTree = () => {
  // 计算属性会自动更新
}

// 初始化
onMounted(() => {
  fetchData()
})
</script> 