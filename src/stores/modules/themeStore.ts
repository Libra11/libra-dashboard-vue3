/*
 * @Author: Libra
 * @Date: 2025-01-04 01:28:23
 * @LastEditors: Libra
 * @Description:
 */

import { defineStore } from "pinia";
import { ref } from "vue";
import type { Ref } from "vue";

export type ThemeType = "default" | "green" | "purple";

export const useThemeStore = defineStore(
  "theme",
  () => {
    // 主题状态
    const theme: Ref<ThemeType> = ref("default");

    // 切换主题
    const changeTheme = (newTheme: ThemeType) => {
      theme.value = newTheme;
      // 更新 html 的 data-theme
      const htmlEl = document.documentElement;
      if (newTheme === "default") {
        htmlEl.removeAttribute("data-theme");
      } else {
        htmlEl.setAttribute("data-theme", newTheme);
      }
    };

    // 初始化主题
    const initTheme = () => {
      if (theme.value !== "default") {
        document.documentElement.setAttribute("data-theme", theme.value);
      }
    };

    return {
      theme,
      changeTheme,
      initTheme,
    };
  },
  {
    persist: true,
  }
);
