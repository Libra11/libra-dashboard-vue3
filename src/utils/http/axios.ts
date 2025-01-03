/*
 * @Author: Libra
 * @Date: 2025-01-04 00:05:11
 * @LastEditors: Libra
 * @Description: axios请求封装
 */
import type { AxiosError, AxiosInstance } from "axios";
import axios from "axios";
import type { CreateRequestConfig, ResponseData } from "@/types/http";
import { useUserStore } from "@/stores/modules/userStore";
import { ElMessage, ElLoading } from "element-plus";
import qs from "qs";

// 加载实例
let loadingInstance: any;

export class RequestHttp {
  private instance: AxiosInstance;
  private readonly options: CreateRequestConfig;
  private readonly defaultConfig: CreateRequestConfig = {
    // 基础请求地址
    baseURL: import.meta.env.VITE_API_URL,
    // 超时时间
    timeout: 10000,
    // 请求头
    headers: {
      "Content-Type": "application/json",
    },
    // 请求参数序列化
    paramsSerializer: {
      serialize: (params) => qs.stringify(params, { arrayFormat: "repeat" }),
    },
    // 默认请求配置
    requestOptions: {
      loading: true,
      showError: true,
      isReturnResponseData: true,
    },
  };

  constructor(options: CreateRequestConfig) {
    this.options = Object.assign(this.defaultConfig, options);
    this.instance = axios.create(this.options);
    this.setupInterceptors();
  }

  // 设置拦截器
  private setupInterceptors() {
    // 请求拦截器
    this.instance.interceptors.request.use(
      (config) => {
        const userStore = useUserStore();
        const token = userStore.getToken();

        // 添加token
        if (token && config.headers) {
          config.headers["Authorization"] = `Bearer ${token}`;
        }

        // 显示loading
        const { loading = true } =
          (config as CreateRequestConfig).requestOptions || {};
        if (loading) {
          loadingInstance = ElLoading.service({
            lock: true,
            text: "加载中...",
            background: "rgba(0, 0, 0, 0.7)",
          });
        }

        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // 响应拦截器
    this.instance.interceptors.response.use(
      (response) => {
        const { requestOptions } = response.config as CreateRequestConfig;
        const {
          showError = true,
          successMessage,
          isReturnResponseData = true,
        } = requestOptions || {};

        // 关闭loading
        loadingInstance?.close();

        const res = response.data as ResponseData;
        if (res.code !== 0) {
          // 显示错误信息
          if (showError) {
            ElMessage.error(res.message || "请求失败");
          }
          return Promise.reject(res);
        }

        // 显示成功信息
        if (successMessage) {
          ElMessage.success(successMessage);
        }

        return isReturnResponseData ? res.data : res;
      },
      (error: AxiosError<ResponseData>) => {
        loadingInstance?.close();

        const { requestOptions } = error.config as CreateRequestConfig;
        const { showError = true } = requestOptions || {};

        // 处理错误
        if (error.response) {
          switch (error.response.status) {
            case 401:
              // token过期处理
              const userStore = useUserStore();
              userStore.logout();
              window.location.href = "/login";
              break;
            case 403:
              ElMessage.error("没有权限访问");
              break;
            case 404:
              ElMessage.error("请求的资源不存在");
              break;
            case 500:
              ElMessage.error("服务器错误");
              break;
            default:
              if (showError) {
                ElMessage.error(error.response.data?.message || "请求失败");
              }
          }
        } else {
          if (showError) {
            ElMessage.error("网络连接失败");
          }
        }

        return Promise.reject(error);
      }
    );
  }

  // 通用请求方法
  request<T = any>(config: CreateRequestConfig): Promise<T> {
    return this.instance.request(config);
  }

  get<T = any>(
    url: string,
    params?: any,
    config?: CreateRequestConfig
  ): Promise<T> {
    return this.instance.get(url, { params, ...config });
  }

  post<T = any>(
    url: string,
    data?: any,
    config?: CreateRequestConfig
  ): Promise<T> {
    return this.instance.post(url, data, config);
  }

  put<T = any>(
    url: string,
    data?: any,
    config?: CreateRequestConfig
  ): Promise<T> {
    return this.instance.put(url, data, config);
  }

  patch<T = any>(
    url: string,
    data?: any,
    config?: CreateRequestConfig
  ): Promise<T> {
    return this.instance.patch(url, data, config);
  }

  delete<T = any>(url: string, config?: CreateRequestConfig): Promise<T> {
    return this.instance.delete(url, config);
  }
}
