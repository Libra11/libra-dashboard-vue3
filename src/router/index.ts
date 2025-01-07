/*
 * @Author: Libra
 * @Date: 2025-01-03 23:36:16
 * @LastEditors: Libra
 * @Description: vue-router
 */
import { createRouter, createWebHistory } from "vue-router";
import { useUserStore } from "@/stores/modules/userStore";
import BasicLayout from "@/layouts/BasicLayout.vue";
import type { RouteRecordRaw } from "vue-router";
import { type MenuItem } from "@/api/menu";
import { mockMenus } from "@/mock/menu";
import { roleApi } from "@/api/system/role";

// 静态路由
const staticRoutes: RouteRecordRaw[] = [
  {
    path: "/",
    redirect: "/home",
  },
  {
    path: "/login",
    name: "login",
    component: () => import("@/views/LoginView.vue"),
  },
];

// 布局路由
const layoutRoute: RouteRecordRaw = {
  path: "/",
  component: BasicLayout,
  children: [
    {
      path: "",
      redirect: "/home",
    },
  ],
};

// 创建路由实例
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: staticRoutes,
});

// 将菜单转换为路由配置
const generateRoutes = (menus: MenuItem[]): RouteRecordRaw[] => {
  return menus.map((menu) => {
    const route: RouteRecordRaw = {
      path: menu.path || "",
      name: menu.path?.replace(/\//g, "-").slice(1) || "",
      component: menu.component
        ? () => import(`../views/${menu.component}`)
        : undefined,
      children: [],
      meta: {
        title: menu.name,
        icon: menu.icon,
      },
    };

    if (menu.children?.length) {
      route.children = generateRoutes(menu.children);
    }

    return route;
  });
};

// 添加动态路由
export const setupRouter = async () => {
  try {
    // 从后端获取菜单数据
    const userStore = useUserStore();
    const user = userStore.userInfo;
    const id = user?.roles[0].id;
    const res = await roleApi.getRole(id!);
    if (res.code === 200) {
      const menus = res.data.menus;
      // 生成路由配置
      const routes = generateRoutes(menus);

      // 添加到布局路由
      layoutRoute.children?.push(...routes);

      // 添加布局路由
      router.addRoute(layoutRoute);

      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error("生成路由失败:", error);
    return false;
  }
};

// 路由守卫
router.beforeEach(async (to, _, next) => {
  const userStore = useUserStore();
  const token = userStore.getAccessToken();

  if (to.path === "/login") {
    if (token) {
      next("/home");
    } else {
      next();
    }
  } else {
    if (token) {
      // 确保动态路由已添加
      if (router.getRoutes().length === staticRoutes.length) {
        const success = await setupRouter();
        if (success) {
          // 重新进入当前路由
          next({ ...to, replace: true });
        } else {
          next("/login");
        }
      } else {
        next();
      }
    } else {
      next("/login");
    }
  }
});

export default router;
