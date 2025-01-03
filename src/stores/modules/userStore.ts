/*
 * @Author: Libra
 * @Date: 2025-01-03 23:41:04
 * @LastEditors: Libra
 * @Description: 用户store
 */
import { defineStore } from "pinia";
import { ref } from "vue";
import { userApi } from "@/api/user";

export const useUserStore = defineStore(
  "user",
  () => {
    // 状态
    const token = ref<string>("");

    // 方法
    const login = async () => {
      try {
        const response = await userApi.login({
          username: "admin",
          password: "123456",
        });
        console.log("登录响应:", response);
        // 从 response.data 中获取 token
        token.value = response.data;
        // 验证token是否被正确设置
        console.log("设置后的token:", token.value);
        return true;
      } catch (error) {
        console.error("登录失败:", error);
        return false;
      }
    };

    const logout = async () => {
      try {
        await userApi.logout();
        // 清除状态
        token.value = "";
        // 验证token是否被正确清除
        console.log("登出后的token:", token.value);
        return true;
      } catch (error) {
        console.error("退出失败:", error);
        return false;
      }
    };

    const getToken = () => {
      // 验证获取到的token
      console.log("当前token:", token.value);
      return token.value;
    };

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
