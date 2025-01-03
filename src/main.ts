/*
 * @Author: Libra
 * @Date: 2025-01-03 23:28:18
 * @LastEditors: Libra
 * @Description:
 */
import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import router from "./router";
import pinia from "./stores";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
// 导入暗黑模式样式
import "element-plus/theme-chalk/dark/css-vars.css";
import i18n from "@/locales";
// 导入主题样式
import "@/styles/themes.css";

// 根据环境变量决定是否启用mock
if (import.meta.env.VITE_USE_MOCK === "true") {
  import("./mock");
}

const app = createApp(App);
app.use(router);
app.use(pinia);
app.use(ElementPlus);
app.use(i18n);

app.mount("#app");
