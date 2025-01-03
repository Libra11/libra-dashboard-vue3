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

const app = createApp(App);
app.use(router);
app.use(pinia);
app.use(ElementPlus);

app.mount("#app");