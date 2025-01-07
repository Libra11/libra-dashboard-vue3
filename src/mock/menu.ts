/*
 * @Author: Libra
 * @Date: 2025-01-06 17:00:00
 * @LastEditors: Libra
 * @Description: 菜单模拟数据
 */

export interface MenuItem {
  id: number;
  name: string;
  path?: string;
  component?: string;
  icon?: string;
  sort: number;
  hidden: boolean;
  children?: MenuItem[];
  createdAt: string;
  updatedAt: string;
}

export const mockMenus: MenuItem[] = [
  {
    id: 1,
    name: "首页",
    path: "/home",
    component: "HomeView.vue",
    icon: "House",
    sort: 1,
    hidden: false,
    createdAt: "2025-01-06 17:00:00",
    updatedAt: "2025-01-06 17:00:00",
  },
  {
    id: 2,
    name: "系统管理",
    path: "/system",
    icon: "Setting",
    sort: 2,
    hidden: false,
    children: [
      {
        id: 21,
        name: "用户管理",
        path: "/system/user",
        component: "system/UserManage.vue",
        icon: "User",
        sort: 1,
        hidden: false,
        createdAt: "2025-01-06 17:00:00",
        updatedAt: "2025-01-06 17:00:00",
      },
      {
        id: 22,
        name: "角色管理",
        path: "/system/role",
        component: "system/RoleManage.vue",
        icon: "Setting",
        sort: 2,
        hidden: false,
        createdAt: "2025-01-06 17:00:00",
        updatedAt: "2025-01-06 17:00:00",
      },
      {
        id: 23,
        name: "权限管理",
        path: "/system/permission",
        component: "system/PermissionManage.vue",
        icon: "Lock",
        sort: 3,
        hidden: false,
        createdAt: "2025-01-06 17:00:00",
        updatedAt: "2025-01-06 17:00:00",
      },
      {
        id: 24,
        name: "菜单管理",
        path: "/system/menu",
        component: "system/MenuManage.vue",
        icon: "Menu",
        sort: 4,
        hidden: false,
        createdAt: "2025-01-06 17:00:00",
        updatedAt: "2025-01-06 17:00:00",
      },
    ],
    createdAt: "2025-01-06 17:00:00",
    updatedAt: "2025-01-06 17:00:00",
  },
];
