/*
 * @Author: Libra
 * @Date: 2025-01-04 01:30:12
 * @LastEditors: Libra
 * @Description: 主题store
 */
import { defineStore } from "pinia";
import { ref } from "vue";
import type { Ref } from "vue";

export const useThemeStore = defineStore(
  "theme",
  () => {
    // 状态
    const isDark: Ref<boolean> = ref(false);

    // 切换主题
    const toggleTheme = () => {
      isDark.value = !isDark.value;
      // 更新 html 的 class
      const htmlEl = document.documentElement;
      if (isDark.value) {
        htmlEl.classList.add("dark");
      } else {
        htmlEl.classList.remove("dark");
      }
    };

    // 初始化主题
    const initTheme = () => {
      if (isDark.value) {
        document.documentElement.classList.add("dark");
      }
    };

    return {
      isDark,
      toggleTheme,
      initTheme,
    };
  },
  {
    persist: true,
  }
);
