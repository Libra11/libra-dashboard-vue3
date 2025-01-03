/*
 * @Author: Libra
 * @Date: 2025-01-04 00:05:12
 * @LastEditors: Libra
 * @Description: http请求封装
 */
import { RequestHttp } from "./axios";

// 创建请求实例
const http = new RequestHttp({
  // 可以在这里覆盖默认配置
});

export { http };
