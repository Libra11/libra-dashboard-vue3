/*
 * @Author: Libra
 * @Date: 2025-01-03 23:41:04
 * @LastEditors: Libra
 * @Description: 用户store
 */
import { defineStore } from "pinia";
import { ref } from "vue";

export const useUserStore = defineStore(
  "user",
  () => {
    // 状态
    const token = ref<string>("");

    // 方法
    const login = async () => {
      try {
        // TODO: 这里需要调用实际的登录API
        const fakeToken = "fake_token";
        token.value = fakeToken;
        return true;
      } catch (error) {
        console.error("登录失败:", error);
        return false;
      }
    };

    const logout = () => {
      // 清除状态
      token.value = "";
    };

    const getToken = () => token.value;

    return {
      token,
      login,
      logout,
      getToken,
    };
  },
  {
    persist: true,
  }
);
