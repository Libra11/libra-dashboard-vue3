/*
 * @Author: Libra
 * @Date: 2025-01-04 00:45:12
 * @LastEditors: Libra
 * @Description: i18n配置
 */
import { createI18n } from "vue-i18n";
import zhCN from "@/locales/lang/zh-CN";
import enUS from "@/locales/lang/en-US";

const messages = {
  "zh-CN": zhCN,
  "en-US": enUS,
};

// 创建i18n实例
const i18n = createI18n({
  legacy: false,
  locale: "zh-CN",
  fallbackLocale: "zh-CN",
  messages,
});

export default i18n;
