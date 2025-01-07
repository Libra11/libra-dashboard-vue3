/*
 * @Author: Libra
 * @Date: 2025-01-06 17:30:00
 * @LastEditors: Libra
 * @Description: 菜单管理接口
 */
import { http } from "@/utils/http";
import type { ResponseData } from "@/types/http";

// 菜单项接口
export interface MenuItem {
  id: number;
  name: string;
  path: string;
  component: string;
  icon: string;
  sort: number;
  hidden: boolean;
  parent?: MenuItem;
  children?: MenuItem[];
  createdAt: string;
  updatedAt: string;
}

// 创建菜单参数
export interface CreateMenuParams {
  id?: number;
  name: string;
  path: string;
  component: string;
  icon: string;
  sort: number;
  hidden: boolean;
  parentId?: number;
}

// 更新菜单参数
export interface UpdateMenuParams extends Partial<CreateMenuParams> {}

// 菜单相关接口
export const menuApi = {
  // 获取菜单树
  getMenuTree: () => {
    return http.get<ResponseData<MenuItem[]>>("/menus");
  },

  // 创建菜单
  createMenu: (data: CreateMenuParams) => {
    return http.post<ResponseData<MenuItem>>("/menus", data, {
      requestOptions: {
        successMessage: "创建成功",
      },
    });
  },

  // 更新菜单
  updateMenu: (id: number, data: UpdateMenuParams) => {
    return http.patch<ResponseData<MenuItem>>(`/menus/${id}`, data, {
      requestOptions: {
        successMessage: "更新成功",
      },
    });
  },

  // 删除菜单
  deleteMenu: (id: number) => {
    return http.delete<ResponseData<null>>(`/menus/${id}`, {
      requestOptions: {
        successMessage: "删除成功",
      },
    });
  },
};
