/*
 * @Author: Libra
 * @Date: 2025-01-07 10:10:31
 * @LastEditors: Libra
 * @Description: 权限管理接口
 */
import { http } from "@/utils/http";
import type { ResponseData } from "@/types/http";

// 权限类型
export type PermissionType = "button" | "api";

// 权限组接口
export interface PermissionGroup {
  id: number;
  code: string;
  name: string;
  description?: string;
  permissions: Permission[];
  createdAt?: string;
  updatedAt?: string;
}

// 权限接口
export interface Permission {
  id: number;
  code: string;
  name: string;
  description?: string;
  type: PermissionType;
  group?: PermissionGroup;
  groupId?: number;
  createdAt?: string;
  updatedAt?: string;
}

// 创建权限参数
export interface CreatePermissionParams {
  code: string;
  name: string;
  description?: string;
  type: PermissionType;
  groupId?: number;
}

// 更新权限参数
export interface UpdatePermissionParams
  extends Partial<CreatePermissionParams> {}

// 创建权限组参数
export interface CreatePermissionGroupParams {
  code: string;
  name: string;
  description?: string;
  permissionIds: number[];
}

// 更新权限组参数
export interface UpdatePermissionGroupParams
  extends Partial<CreatePermissionGroupParams> {}

// 权限管理接口
export const permissionApi = {
  // 获取权限列表
  getPermissionList: () => {
    return http.get<ResponseData<Permission[]>>("/permissions");
  },

  // 获取权限详情
  getPermission: (id: number) => {
    return http.get<ResponseData<Permission>>(`/permissions/${id}`);
  },

  // 创建权限
  createPermission: (data: CreatePermissionParams) => {
    return http.post<ResponseData<Permission>>("/permissions", data, {
      requestOptions: {
        successMessage: "创建成功",
      },
    });
  },

  // 更新权限
  updatePermission: (id: number, data: UpdatePermissionParams) => {
    return http.patch<ResponseData<Permission>>(`/permissions/${id}`, data, {
      requestOptions: {
        successMessage: "更新成功",
      },
    });
  },

  // 删除权限
  deletePermission: (id: number) => {
    return http.delete<ResponseData<null>>(`/permissions/${id}`, {
      requestOptions: {
        successMessage: "删除成功",
      },
    });
  },

  // 获取权限组列表
  getPermissionGroupList: () => {
    return http.get<ResponseData<PermissionGroup[]>>("/permission-groups");
  },

  // 获取权限组详情
  getPermissionGroup: (id: number) => {
    return http.get<ResponseData<PermissionGroup>>(`/permission-groups/${id}`);
  },

  // 创建权限组
  createPermissionGroup: (data: CreatePermissionGroupParams) => {
    return http.post<ResponseData<PermissionGroup>>(
      "/permission-groups",
      data,
      {
        requestOptions: {
          successMessage: "创建成功",
        },
      }
    );
  },

  // 更新权限组
  updatePermissionGroup: (id: number, data: UpdatePermissionGroupParams) => {
    return http.patch<ResponseData<PermissionGroup>>(
      `/permission-groups/${id}`,
      data,
      {
        requestOptions: {
          successMessage: "更新成功",
        },
      }
    );
  },

  // 删除权限组
  deletePermissionGroup: (id: number) => {
    return http.delete<ResponseData<null>>(`/permission-groups/${id}`, {
      requestOptions: {
        successMessage: "删除成功",
      },
    });
  },
};
