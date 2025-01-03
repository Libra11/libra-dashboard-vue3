/*
 * @Author: Libra
 * @Date: 2025-01-04 00:15:12
 * @LastEditors: Libra
 * @Description: mock数据入口
 */
import Mock from "mockjs";

// 设置响应延时
Mock.setup({
  timeout: "200-600",
});

// 导入所有mock文件
import "./user";
import "./example";

export default Mock;
