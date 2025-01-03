/*
 * @Author: Libra
 * @Date: 2025-01-04 00:30:23
 * @LastEditors: Libra
 * @Description: 示例接口mock
 */
import Mock from "mockjs";
import type { ResponseData } from "@/types/http";

// 所有请求的通用响应
const mockResponses = {
  default: (): ResponseData => ({
    code: 0,
    data: { message: "默认配置请求成功" },
    message: "success",
    timestamp: Mock.Random.now("yyyy-MM-dd HH:mm:ss"),
    path: "/api/example/default",
  }),

  error: (): ResponseData => ({
    code: 1,
    data: null,
    message: "获取数据失败，请稍后重试",
    timestamp: Mock.Random.now("yyyy-MM-dd HH:mm:ss"),
    path: "/api/example/custom-error",
  }),

  create: (): ResponseData => ({
    code: 0,
    data: { id: Mock.Random.integer(1, 100) },
    message: "创建成功",
    timestamp: Mock.Random.now("yyyy-MM-dd HH:mm:ss"),
    path: "/api/example/create",
  }),
};

// 注册所有mock接口
Mock.mock(/\/api\/example\/default/, "get", mockResponses.default);
Mock.mock(/\/api\/example\/no-loading/, "get", mockResponses.default);
Mock.mock(/\/api\/example\/no-error/, "get", mockResponses.default);
Mock.mock(/\/api\/example\/custom-error/, "get", mockResponses.error);
Mock.mock(/\/api\/example\/create/, "post", mockResponses.create);
Mock.mock(/\/api\/example\/complex/, "post", mockResponses.create);
