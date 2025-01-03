/*
 * @Author: Libra
 * @Date: 2025-01-03 23:40:56
 * @LastEditors: Libra
 * @Description:
 */
import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

export default pinia;
