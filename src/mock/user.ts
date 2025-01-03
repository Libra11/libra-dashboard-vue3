/*
 * @Author: Libra
 * @Date: 2025-01-04 00:15:23
 * @LastEditors: Libra
 * @Description: 用户相关接口mock
 */
import Mock from "mockjs";
import type { ResponseData } from "@/types/http";

// 模拟登录接口
Mock.mock("/api/auth/login", "post", (): ResponseData<string> => {
  return {
    code: 0,
    data: Mock.Random.string("lower", 32),
    message: "登录成功",
    timestamp: Mock.Random.now("yyyy-MM-dd HH:mm:ss"),
    path: "/api/auth/login",
  };
});

// 模拟获取用户信息接口
Mock.mock("/api/user/info", "get", (): ResponseData<any> => {
  return {
    code: 0,
    data: {
      id: Mock.Random.integer(1, 100),
      name: Mock.Random.cname(),
      email: Mock.Random.email(),
      avatar: Mock.Random.image("100x100"),
    },
    message: "获取成功",
    timestamp: Mock.Random.now("yyyy-MM-dd HH:mm:ss"),
    path: "/api/user/info",
  };
});

// 模拟退出登录接口
Mock.mock("/api/auth/logout", "post", (): ResponseData<null> => {
  return {
    code: 0,
    data: null,
    message: "退出成功",
    timestamp: Mock.Random.now("yyyy-MM-dd HH:mm:ss"),
    path: "/api/auth/logout",
  };
});
