import axios, { type AxiosInstance, type InternalAxiosRequestConfig, type AxiosResponse } from 'axios'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getToken } from './auth'

/**
 * Generic API response envelope. The backend wraps every payload in
 * { code, message, data }. code === 20000 means business success.
 */
export interface ApiResponse<T = unknown> {
  code: number
  message: string
  data: T
}

const service: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API,
  timeout: 5000,
})

// Request interceptor: attach the session token to every outbound request.
service.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getToken()
    if (token) {
      config.headers['X-Token'] = token
    }
    return config
  },
  (error) => Promise.reject(error),
)

// Response interceptor: unwrap the business envelope, surface errors.
// The fulfilled handler returns res (the ApiResponse), not the AxiosResponse,
// so callers receive { code, message, data } directly.
service.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    const res = response.data
    if (res.code !== 20000) {
      ElMessage({ message: res.message || 'Error', type: 'error', duration: 5 * 1000 })
      // Token-related failures: prompt re-login.
      if ([50008, 50012, 50014].includes(res.code)) {
        ElMessageBox.confirm(
          '您已登出，可以取消以留在本页，或重新登录',
          '确认登出',
          { confirmButtonText: '重新登录', cancelButtonText: '取消', type: 'warning' },
        ).then(async () => {
          const { useUserStore } = await import('@/store/modules/user')
          const userStore = useUserStore()
          await userStore.resetToken()
          location.reload()
        }).catch(() => {
          // user cancelled — stay on page
        })
      }
      return Promise.reject(new Error(res.message || 'Error'))
    }
    return res as unknown as AxiosResponse
  },
  (error) => {
    console.log(`err${error}`)
    ElMessage({ message: error.message, type: 'error', duration: 5 * 1000 })
    return Promise.reject(error)
  },
)

export default service
