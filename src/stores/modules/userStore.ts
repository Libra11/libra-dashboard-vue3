/*
 * @Author: Libra
 * @Date: 2025-01-03 23:41:04
 * @LastEditors: Libra
 * @Description: 用户store
 */
import { defineStore } from "pinia";
import { ref } from "vue";
import { userApi } from "@/api/user";

interface LoginForm {
  username: string;
  password: string;
  captchaId: string;
  captchaCode: string;
}

export const useUserStore = defineStore(
  "user",
  () => {
    // 状态
    const accessToken = ref<string>("");
    const refreshToken = ref<string>("");
    const isAuthenticated = ref(false);

    // 方法
    const setTokens = (access: string, refresh: string) => {
      accessToken.value = access;
      refreshToken.value = refresh;
      isAuthenticated.value = true;
    };

    const clearTokens = () => {
      accessToken.value = "";
      refreshToken.value = "";
      isAuthenticated.value = false;
    };

    const login = async (loginForm: LoginForm) => {
      try {
        const response = await userApi.login(loginForm);
        if (response.code === 201) {
          const { access_token, refresh_token } = response.data;
          setTokens(access_token, refresh_token);
          return true;
        }
        return false;
      } catch (error) {
        console.error("登录失败:", error);
        return false;
      }
    };

    const logout = async () => {
      try {
        clearTokens();
        return true;
      } catch (error) {
        console.error("退出失败:", error);
        return false;
      }
    };

    const getAccessToken = () => accessToken.value;
    const getRefreshToken = () => refreshToken.value;

    return {
      accessToken,
      refreshToken,
      isAuthenticated,
      login,
      logout,
      getAccessToken,
      getRefreshToken,
      setTokens,
      clearTokens,
    };
  },
  {
    persist: true,
  }
);
