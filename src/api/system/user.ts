/*
 * @Author: Libra
 * @Date: 2025-01-07 10:05:39
 * @LastEditors: Libra
 * @Description: 用户管理接口
 */
import { http } from "@/utils/http";
import type { ResponseData } from "@/types/http";
import type { Role } from "./role";

// 用户信息接口
export interface User {
  id: number;
  username: string;
  password: string;
  nickname: string;
  email: string;
  avatar: string;
  isActive: boolean;
  roles: Role[];
  createdAt: string;
  updatedAt: string;
}

// 创建用户参数
export interface CreateUserParams {
  username: string;
  password: string;
  nickname: string;
  email: string;
  avatar: string;
  roleIds: number[];
}

// 更新用户参数
export interface UpdateUserParams extends Partial<CreateUserParams> {}

// 用户管理接口
export const userManageApi = {
  // 获取用户列表
  getUserList: () => {
    return http.get<ResponseData<User[]>>("/users");
  },

  // 获取指定用户
  getUser: (id: number) => {
    return http.get<ResponseData<User>>(`/users/${id}`);
  },

  // 创建用户
  createUser: (data: CreateUserParams) => {
    return http.post<ResponseData<User>>("/users", data, {
      requestOptions: {
        successMessage: "创建成功",
      },
    });
  },

  // 更新用户
  updateUser: (id: number, data: UpdateUserParams) => {
    return http.patch<ResponseData<User>>(`/users/${id}`, data, {
      requestOptions: {
        successMessage: "更新成功",
      },
    });
  },

  // 删除用户
  deleteUser: (id: number) => {
    return http.delete<ResponseData<null>>(`/users/${id}`, {
      requestOptions: {
        successMessage: "删除成功",
      },
    });
  },
};
