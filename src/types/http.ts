/*
 * @Author: Libra
 * @Date: 2025-01-04 00:04:57
 * @LastEditors: Libra
 * @Description: HTTP类型定义
 */
import type { AxiosRequestConfig } from "axios";

// 定义请求配置接口
export interface RequestOptions {
  // 是否显示loading
  loading?: boolean;
  // 是否显示错误信息
  showError?: boolean;
  // 错误提示信息
  errorMessage?: string;
  // 成功提示信息
  successMessage?: string;
  // 是否直接返回 response.data
  isReturnResponseData?: boolean;
}

// 定义请求配置
export interface CreateRequestConfig extends AxiosRequestConfig {
  requestOptions?: RequestOptions;
}

// 定义响应数据接口
export interface ResponseData<T = any> {
  code: number;
  data: T;
  message: string;
  timestamp: string;
  path: string;
}
