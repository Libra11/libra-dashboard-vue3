<!--
 * @Author: Libra
 * @Date: 2025-01-06 10:15:23
 * @LastEditors: Libra
 * @Description: 侧边菜单组件
-->
<template>
  <div
    class="h-full border-r border-[var(--el-border-color)] bg-[var(--el-bg-color)] transition-[width] duration-300"
    :class="[isCollapse ? 'w-16' : 'w-[220px]']"
  >
    <!-- Logo -->
    <div class="h-16 px-4 flex items-center">
      <img src="@/assets/vue.svg" alt="logo" class="w-8 h-8" />
      <span
        class="ml-3 text-lg font-semibold text-[var(--el-text-color-primary)] transition-transform duration-300 origin-left"
        :class="[isCollapse ? 'scale-x-0' : 'scale-x-100']"
      >
        Libra
      </span>
    </div>

    <!-- 菜单主体 -->
    <div class="px-2 py-4 space-y-1 overflow-y-auto">
      <template v-for="menu in sortedMenus" :key="menu.id">
        <!-- 无子菜单 -->
        <router-link
          v-if="!menu.children?.length && menu.path"
          :to="menu.path"
          class="flex items-center px-2 py-3 rounded-lg text-[var(--el-text-color-primary)] transition-colors duration-200 hover:bg-[var(--el-fill-color-light)]"
          :class="[
            isCollapse ? 'justify-center' : '',
            route.path === menu.path ? 'bg-[var(--el-color-primary-light-9)]' : ''
          ]"
        >
          <div class="flex items-center justify-center w-10 h-10 rounded-lg bg-[var(--el-bg-color-overlay)]">
            <component 
              :is="getIconComponent(menu.icon)" 
              class="w-5 h-5"
              :class="route.path === menu.path ? 'text-[var(--el-color-primary)]' : 'text-[var(--el-text-color-secondary)]'"
            />
          </div>
          <span
            class="ml-3 text-sm font-medium transition-transform duration-300 origin-left"
            :class="[isCollapse ? 'scale-x-0' : 'scale-x-100']"
          >
            {{ menu.name }}
          </span>
        </router-link>

        <!-- 有子菜单 -->
        <div v-else class="space-y-1">
          <button
            @click="() => handleToggleSubmenu(menu.id)"
            class="w-full flex items-center px-2 py-3 rounded-lg text-[var(--el-text-color-primary)] transition-colors duration-200 hover:bg-[var(--el-fill-color-light)]"
            :class="[isCollapse ? 'justify-center' : '']"
          >
            <div class="flex items-center justify-center w-10 h-10 rounded-lg bg-[var(--el-bg-color-overlay)]">
              <component 
                :is="getIconComponent(menu.icon)" 
                class="w-5 h-5 text-[var(--el-text-color-secondary)]"
              />
            </div>
            <span
              class="ml-3 text-sm font-medium transition-transform duration-300 origin-left"
              :class="[isCollapse ? 'scale-x-0' : 'scale-x-100']"
            >
              {{ menu.name }}
            </span>
            <el-icon
              class="ml-auto transition-transform duration-300"
              :class="[
                isCollapse ? 'opacity-0 scale-0' : '',
                openSubmenuSet.has(menu.id) ? 'rotate-180' : ''
              ]"
            >
              <ArrowDown class="text-[var(--el-text-color-secondary)]" />
            </el-icon>
          </button>

          <!-- 子菜单 -->
          <div
            class="overflow-hidden transition-[max-height] duration-300"
            :class="[!openSubmenuSet.has(menu.id) || isCollapse ? 'max-h-0' : 'max-h-[300px]']"
          >
            <router-link
              v-for="submenu in menu.children"
              :key="submenu.id"
              :to="submenu.path || ''"
              class="flex items-center pl-12 pr-2 py-3 rounded-lg text-[var(--el-text-color-primary)] transition-colors duration-200 hover:bg-[var(--el-fill-color-light)]"
              :class="[route.path === submenu.path ? 'bg-[var(--el-color-primary-light-9)]' : '']"
            >
              <div class="flex items-center justify-center w-10 h-10 rounded-lg bg-[var(--el-bg-color-overlay)]">
                <component 
                  :is="getIconComponent(submenu.icon)" 
                  class="w-5 h-5"
                  :class="route.path === submenu.path ? 'text-[var(--el-color-primary)]' : 'text-[var(--el-text-color-secondary)]'"
                />
              </div>
              <span class="ml-3 text-sm font-medium">{{ submenu.name }}</span>
            </router-link>
          </div>
        </div>
      </template>
    </div>

    <!-- 折叠按钮 -->
    <div
      class="h-16 flex items-center justify-center cursor-pointer text-[var(--el-text-color-secondary)] transition-colors duration-200 hover:bg-[var(--el-fill-color-light)]"
      @click="handleToggleCollapse"
    >
      <el-icon class="text-lg transition-transform duration-300" :class="[!isCollapse ? 'rotate-180' : '']">
        <Fold v-if="isCollapse" />
        <Expand v-else />
      </el-icon>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, shallowRef, computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import { ArrowDown, Fold, Expand } from "@element-plus/icons-vue";
import * as ElementPlusIcons from '@element-plus/icons-vue'
import { type MenuItem } from '@/api/menu'
import { useUserStore } from "@/stores/modules/userStore";
import { roleApi } from "@/api/system/role";

const route = useRoute();
const isCollapse = ref(false);
const openSubmenuSet = ref(new Set<number>());
const menus = shallowRef<MenuItem[]>([]);

// 递归排序菜单
const sortMenus = (menus: MenuItem[]): MenuItem[] => {
  return menus.sort((a, b) => a.sort - b.sort).map(menu => {
    if (menu.children?.length) {
      menu.children = sortMenus(menu.children)
    }
    return menu
  })
}

// 排序后的菜单
const sortedMenus = computed(() => {
  return sortMenus([...menus.value])
})

// 获取图标组件
const getIconComponent = (name?: string) => {
  if (!name) return ArrowDown;
  return (ElementPlusIcons as Record<string, any>)[name] || ArrowDown;
};

// 折叠/展开菜单
const handleToggleCollapse = () => {
  isCollapse.value = !isCollapse.value;
  if (isCollapse.value) {
    openSubmenuSet.value.clear();
  }
};

// 折叠/展开子菜单
const handleToggleSubmenu = (id: number) => {
  const newSet = new Set(openSubmenuSet.value);
  if (newSet.has(id)) {
    newSet.delete(id);
  } else {
    newSet.add(id);
  }
  openSubmenuSet.value = newSet;
};

const fetchMenus = async () => {
  const userStore = useUserStore();
  const id = userStore.userInfo?.roles[0].id
  const res = await roleApi.getRole(id!)
  if (res.code === 200) {
    menus.value = res.data.menus
  }
}

onMounted(() => {
  fetchMenus()
})
</script> 