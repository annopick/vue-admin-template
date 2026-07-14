import request, { type ApiResponse } from '@/utils/request'

export interface LoginPayload {
  username: string
  password: string
}

export interface UserInfo {
  name: string
  avatar: string
  roles: string[]
}

// The response interceptor in request.ts unwraps response.data, so each
// request resolves directly to the ApiResponse envelope (not AxiosResponse).
export function login(data: LoginPayload): Promise<ApiResponse<{ token: string }>> {
  return request({
    url: '/user/login',
    method: 'post',
    data,
  }) as unknown as Promise<ApiResponse<{ token: string }>>
}

export function getInfo(token: string): Promise<ApiResponse<UserInfo>> {
  return request({
    url: `/user/info/${token}`,
    method: 'get',
  }) as unknown as Promise<ApiResponse<UserInfo>>
}

export function logout(): Promise<ApiResponse<Record<string, never>>> {
  return request({
    url: '/user/logout',
    method: 'post',
  }) as unknown as Promise<ApiResponse<Record<string, never>>>
}
