/*
 * @Author: Libra
 * @Date: 2025-01-03 23:36:16
 * @LastEditors: Libra
 * @Description: vue-router
 */
import { createRouter, createWebHistory } from "vue-router";
import { useUserStore } from "@/stores/modules/userStore";
import BasicLayout from "@/layouts/BasicLayout.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/login",
      name: "login",
      component: () => import("@/views/LoginView.vue"),
    },
    {
      path: "/",
      component: BasicLayout,
      children: [
        {
          path: "",
          redirect: "/home",
        },
        {
          path: "home",
          name: "home",
          component: () => import("@/views/HomeView.vue"),
        },
      ],
    },
    {
      path: "/example",
      name: "example",
      component: () => import("@/views/ExampleView.vue"),
    },
  ],
});

// 路由守卫
router.beforeEach((to, _, next) => {
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
      next();
    } else {
      next("/login");
    }
  }
});

export default router;
