/*
 * @Author: Libra
 * @Date: 2025-01-07 10:10:31
 * @LastEditors: Libra
 * @Description: 角色管理接口
 */
import { http } from "@/utils/http";
import type { ResponseData } from "@/types/http";
import type { Permission } from "./permission";
import type { MenuItem } from "@/api/menu";

// 角色接口
export interface Role {
  id: number;
  code: string;
  name: string;
  description: string;
  permissions: Permission[];
  menus: MenuItem[];
  createdAt: string;
  updatedAt: string;
}

// 创建角色参数
export interface CreateRoleParams {
  code: string;
  name: string;
  description: string;
  permissionIds: number[];
}

// 更新角色参数
export interface UpdateRoleParams extends Partial<CreateRoleParams> {}

// 设置权限参数
export interface SetPermissionsParams {
  permissionIds: number[];
}

// 设置角色菜单参数
export interface SetMenusParams {
  menuIds: number[];
}

// 角色管理接口
export const roleApi = {
  // 获取角色列表
  getRoleList: () => {
    return http.get<ResponseData<Role[]>>("/roles");
  },

  // 获取角色详情
  getRole: (id: number) => {
    return http.get<ResponseData<Role>>(`/roles/${id}`);
  },

  // 创建角色
  createRole: (data: CreateRoleParams) => {
    return http.post<ResponseData<Role>>("/roles", data, {
      requestOptions: {
        successMessage: "创建成功",
      },
    });
  },

  // 更新角色
  updateRole: (id: number, data: UpdateRoleParams) => {
    return http.patch<ResponseData<Role>>(`/roles/${id}`, data, {
      requestOptions: {
        successMessage: "更新成功",
      },
    });
  },

  // 删除角色
  deleteRole: (id: number) => {
    return http.delete<ResponseData<null>>(`/roles/${id}`, {
      requestOptions: {
        successMessage: "删除成功",
      },
    });
  },

  // 设置角色权限
  setPermissions: (id: number, data: SetPermissionsParams) => {
    return http.post<ResponseData<Role>>(`/roles/${id}/permissions`, data, {
      requestOptions: {
        successMessage: "设置成功",
      },
    });
  },

  // 设置角色菜单
  setMenus: (id: number, data: SetMenusParams) => {
    return http.post<ResponseData<Role>>(`/roles/${id}/menus`, data, {
      requestOptions: {
        successMessage: "设置成功",
      },
    });
  },
};
