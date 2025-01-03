/*
 * @Author: Libra
 * @Date: 2025-01-04 00:30:12
 * @LastEditors: Libra
 * @Description: 请求配置示例
 */
import { http } from "@/utils/http";

// 示例接口
export const exampleApi = {
  // 默认配置：显示loading和错误提示
  getDefault: () => {
    return http.get("/example/default");
  },

  // 不显示loading
  getWithoutLoading: () => {
    return http.get("/example/no-loading", null, {
      requestOptions: {
        loading: false,
      },
    });
  },

  // 不显示错误提示
  getWithoutError: () => {
    return http.get("/example/no-error", null, {
      requestOptions: {
        showError: false,
      },
    });
  },

  // 自定义错误提示
  getWithCustomError: () => {
    return http.get("/example/custom-error", null, {
      requestOptions: {
        errorMessage: "获取数据失败，请稍后重试",
      },
    });
  },

  // 显示成功提示
  createWithSuccess: () => {
    return http.post("/example/create", null, {
      requestOptions: {
        successMessage: "创建成功",
      },
    });
  },

  // 组合使用
  complexExample: () => {
    return http.post("/example/complex", null, {
      requestOptions: {
        loading: true,
        showError: true,
        errorMessage: "操作失败，请检查网络连接",
        successMessage: "操作成功完成",
      },
    });
  },
};
