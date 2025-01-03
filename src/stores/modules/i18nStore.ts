/*
 * @Author: Libra
 * @Date: 2025-01-04 01:00:12
 * @LastEditors: Libra
 * @Description: 国际化store
 */
import i18n from "@/locales";
import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type { Ref } from "vue";
import zhCn from "element-plus/es/locale/lang/zh-cn";
import en from "element-plus/es/locale/lang/en";

export const useI18nStore = defineStore(
  "i18n",
  () => {
    // 状态
    const locale: Ref<"zh-CN" | "en-US"> = ref("zh-CN");

    // 计算属性：返回 Element Plus 的语言包
    const elLocale = computed(() => {
      return locale.value === "zh-CN" ? zhCn : en;
    });

    // 切换语言
    const setLocale = (lang: "zh-CN" | "en-US") => {
      locale.value = lang;
      i18n.global.locale.value = lang;
    };

    // 初始化语言
    const initLocale = () => {
      i18n.global.locale.value = locale.value;
    };

    return {
      locale,
      elLocale,
      setLocale,
      initLocale,
    };
  },
  {
    persist: true,
  }
);
