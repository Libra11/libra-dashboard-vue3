<!--
 * @Author: Libra
 * @Date: 2025-01-06 16:15:00
 * @LastEditors: Libra
 * @Description: 菜单管理
-->
<template>
  <div class="p-4">
    <el-card class="mb-4">
      <div class="flex justify-between items-center mb-4">
        <div class="flex gap-4">
          <el-input
            v-model="searchForm.keyword"
            placeholder="请输入菜单名称搜索"
            class="w-[200px]"
            clearable
            @keyup.enter="handleSearch"
          />
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="resetSearch">重置</el-button>
        </div>
        <el-button type="primary" @click="handleAdd()">新增菜单</el-button>
      </div>
    </el-card>

    <el-card>
      <el-table
        :data="sortedTableData"
        v-loading="loading"
        row-key="id"
        border
        default-expand-all
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      >
        <el-table-column prop="name" label="菜单名称" />
        <el-table-column prop="path" label="路由路径" />
        <el-table-column prop="component" label="组件路径" />
        <el-table-column prop="icon" label="图标" align="center" width="70">
          <template #default="{ row }">
            <el-icon v-if="row.icon">
              <component :is="getIcon(row.icon)" />
            </el-icon>
          </template>
        </el-table-column>
        <el-table-column prop="sort" label="排序" width="80" align="center" />
        <el-table-column prop="hidden" label="显示" width="80" align="center">
          <template #default="{ row }">
            <el-tag :type="row.hidden ? 'danger' : 'success'">
              {{ row.hidden ? '隐藏' : '显示' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="handleAdd(row)">新增</el-button>
            <el-button link type="primary" @click="handleEdit(row)">编辑</el-button>
            <el-button link type="danger" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 菜单表单弹窗 -->
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
        <el-form-item label="上级菜单">
          <el-tree-select
            v-model="form.parentId"
            :data="menuTree"
            :props="{ label: 'name', value: 'id' }"
            placeholder="请选择上级菜单"
            class="w-full"
            clearable
          />
        </el-form-item>
        <el-form-item label="菜单名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入菜单名称" />
        </el-form-item>
        <el-form-item label="路由路径" prop="path">
          <el-input v-model="form.path" placeholder="请输入路由路径" />
        </el-form-item>
        <el-form-item label="组件路径" prop="component">
          <el-input v-model="form.component" placeholder="请输入组件路径" />
        </el-form-item>
        <el-form-item label="图标" prop="icon">
          <el-input v-model="form.icon" placeholder="请输入图标" />
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input-number v-model="form.sort" :min="0" :max="999" />
        </el-form-item>
        <el-form-item label="是否隐藏" prop="hidden">
          <el-switch v-model="form.hidden" />
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
import * as ElementPlusIcons from '@element-plus/icons-vue'
import { menuApi, type MenuItem, type CreateMenuParams, type UpdateMenuParams } from '@/api/menu'

// 搜索表单
const searchForm = reactive({
  keyword: '',
})

// 表格数据
const loading = ref(false)
const tableData = ref<MenuItem[]>([])

// 排序后的表格数据
const sortedTableData = computed(() => {
  return sortMenus([...tableData.value])
})

// 菜单表单
const dialogVisible = ref(false)
const dialogTitle = ref('')
const submitLoading = ref(false)
const currentEditId = ref<number>()
const formRef = ref<FormInstance>()
const form = reactive<CreateMenuParams>({
  name: '',
  path: '',
  component: '',
  icon: '',
  sort: 0,
  hidden: false,
})

// 菜单树数据
const menuTree = computed(() => {
  return [{ id: 0, name: '根菜单', children: sortedTableData.value }]
})

// 获取图标组件
const getIcon = (name: string) => {
  return (ElementPlusIcons as Record<string, any>)[name] || ElementPlusIcons.Document
}

// 表单校验规则
const rules = reactive<FormRules>({
  name: [
    { required: true, message: '请输入菜单名称', trigger: 'blur' },
  ],
  path: [
    { required: true, message: '请输入路由路径', trigger: 'blur' },
  ],
  component: [
    { required: true, message: '请输入组件路径', trigger: 'blur' },
  ],
})

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
    const res = await menuApi.getMenuTree()
    if (res.code === 200) {
      tableData.value = res.data
    }
  } catch (error) {
    console.error('获取菜单失败:', error)
  } finally {
    loading.value = false
  }
}

// 递归排序菜单
const sortMenus = (menus: MenuItem[]): MenuItem[] => {
  return menus.sort((a, b) => a.sort - b.sort).map(menu => {
    if (menu.children?.length) {
      menu.children = sortMenus(menu.children)
    }
    return menu
  })
}

// 新增菜单
const handleAdd = (row?: MenuItem) => {
  dialogTitle.value = '新增菜单'
  dialogVisible.value = true
  // 重置表单
  form.name = ''
  form.path = ''
  form.component = ''
  form.icon = ''
  form.sort = 0
  form.hidden = false
  form.parentId = row?.id
}

// 编辑菜单
const handleEdit = (row: MenuItem) => {
  dialogTitle.value = '编辑菜单'
  dialogVisible.value = true
  // 填充表单
  form.name = row.name
  form.path = row.path
  form.component = row.component
  form.icon = row.icon
  form.sort = row.sort
  form.hidden = row.hidden
  form.parentId = row.parent?.id
  currentEditId.value = row.id
}

// 删除菜单
const handleDelete = async (row: MenuItem) => {
  try {
    await ElMessageBox.confirm('确定要删除该菜单吗？', '提示', {
      type: 'warning'
    })
    const res = await menuApi.deleteMenu(row.id)
    if (res.code === 200) {
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
        if (dialogTitle.value === '新增菜单') {
          const res = await menuApi.createMenu(form)
          if (res.code === 200) {
            dialogVisible.value = false
            fetchData()
          }
        } else {
          const res = await menuApi.updateMenu(currentEditId.value!, form as UpdateMenuParams)
          if (res.code === 200) {
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
})
</script> 