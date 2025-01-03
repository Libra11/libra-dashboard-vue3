/*
 * @Author: Libra
 * @Date: 2025-01-04 01:00:12
 * @LastEditors: Libra
 * @Description: 国际化store
 */
import i18n from "@/locales";
import { defineStore } from "pinia";
import { ref } from "vue";
import type { Ref } from "vue";

export const useI18nStore = defineStore(
  "i18n",
  () => {
    // 状态
    const locale: Ref<string> = ref("zh-CN");

    // 切换语言
    const setLocale = (lang: "zh-CN" | "en-US") => {
      locale.value = lang;
      i18n.global.locale.value = lang;
    };

    return {
      locale,
      setLocale,
    };
  },
  {
    persist: true,
  }
);
