import { http } from "@/utils/http";
import type { ResponseData } from "@/types/http";
import type { User } from "./system/user";

// 定义接口返回数据类型
interface LoginParams {
  username: string;
  password: string;
  captchaId: string;
  captchaCode: string;
}

interface LoginResponse {
  access_token: string;
  refresh_token: string;
  user: User;
}

interface UserInfo {
  id: number;
  name: string;
  email: string;
  avatar: string;
}

interface CaptchaResponse {
  id: string;
  image: string;
}

// 用户相关接口
export const userApi = {
  // 获取验证码
  getCaptcha: (mode: boolean) => {
    return http.get<ResponseData<CaptchaResponse>>(
      "/auth/captcha?isDark=" + mode
    );
  },

  // 登录
  login: (data: LoginParams) => {
    return http.post<ResponseData<LoginResponse>>("/auth/login", data, {
      requestOptions: {
        successMessage: "登录成功",
      },
    });
  },

  // 刷新token
  refreshToken: (refresh_token: string) => {
    return http.post<ResponseData<LoginResponse>>("/auth/refresh", {
      refresh_token,
    });
  },

  // 获取用户信息
  getUserInfo: () => {
    return http.get<ResponseData<UserInfo>>("/user/info");
  },

  // 退出登录
  logout: () => {
    return http.post<ResponseData<null>>("/auth/logout", null, {
      requestOptions: {
        successMessage: "退出成功",
      },
    });
  },
};
