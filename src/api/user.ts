import { http } from '@/utils/http'
import type { ResponseData } from '@/types/http'

// 定义接口返回数据类型
interface LoginParams {
  username: string
  password: string
}

interface UserInfo {
  id: number
  name: string
  email: string
}

// 用户相关接口
export const userApi = {
  // 登录
  login: (data: LoginParams) => {
    return http.post<ResponseData<string>>('/auth/login', data, {
      requestOptions: {
        successMessage: '登录成功'
      }
    })
  },

  // 获取用户信息
  getUserInfo: () => {
    return http.get<ResponseData<UserInfo>>('/user/info')
  },

  // 退出登录
  logout: () => {
    return http.post('/auth/logout', null, {
      requestOptions: {
        successMessage: '退出成功'
      }
    })
  }
} 