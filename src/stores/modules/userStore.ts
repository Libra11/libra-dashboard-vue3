/*
 * @Author: Libra
 * @Date: 2025-01-03 23:41:04
 * @LastEditors: Libra
 * @Description: 用户store
 */
import { defineStore } from "pinia";
import { ref } from "vue";
import { userApi } from "@/api/user";
import type { User } from "@/api/system/user";
import { roleApi, type Role } from "@/api/system/role";

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
    const userInfo = ref<User | null>(null);

    // 方法
    const setTokens = (access: string, refresh: string, user: User) => {
      accessToken.value = access;
      refreshToken.value = refresh;
      userInfo.value = user;
      isAuthenticated.value = true;
    };

    const clearTokens = () => {
      accessToken.value = "";
      refreshToken.value = "";
      userInfo.value = null;
      isAuthenticated.value = false;
    };

    const login = async (loginForm: LoginForm) => {
      try {
        const response = await userApi.login(loginForm);
        if (response.code === 201) {
          const { access_token, refresh_token, user } = response.data;
          setTokens(access_token, refresh_token, user);
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
      userInfo,
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
