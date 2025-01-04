/*
 * @Author: Libra
 * @Date: 2025-01-04 01:30:12
 * @LastEditors: Libra
 * @Description: 主题store
 */
import { defineStore } from "pinia";
import { ref } from "vue";
import type { Ref } from "vue";

export const useModeStore = defineStore(
  "mode",
  () => {
    // 状态
    const isDark: Ref<boolean> = ref(false);

    // 切换模式
    const toggleMode = (event: MouseEvent) => {
      const x = event.clientX;
      const y = event.clientY;
      isDark.value = !isDark.value;
      // 更新 html 的 class
      const htmlEl = document.documentElement;
      if (document.startViewTransition) {
        const transition = document.startViewTransition(() => {
          htmlEl.classList.toggle("dark");
        });
        transition.ready.then(() => {
          htmlEl.animate(
            {
              clipPath: [
                `circle(0% at ${x}px ${y}px)`,
                `circle(100% at ${x}px ${y}px)`,
              ],
            },
            {
              duration: 300,
              pseudoElement: "::view-transition-new(root)",
            }
          );
        });
      } else {
        htmlEl.classList.toggle("dark");
      }
    };

    // 初始化模式
    const initMode = () => {
      document.documentElement.classList.toggle("dark", isDark.value);
    };

    return {
      isDark,
      toggleMode,
      initMode,
    };
  },
  {
    persist: true,
  }
);
