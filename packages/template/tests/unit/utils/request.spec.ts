import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import type { InternalAxiosRequestConfig, AxiosResponse } from 'axios'

// Verify the request wrapper's interceptor behavior through its public surface.
// We mock the token getter and observe what the interceptor does to a config,
// and how the response interceptor unwraps the business envelope.

vi.mock('@/utils/auth', () => ({
  getToken: vi.fn(),
  setToken: vi.fn(),
  removeToken: vi.fn(),
}))
vi.mock('element-plus', () => ({
  ElMessage: Object.assign(vi.fn(), {
    error: vi.fn(),
    success: vi.fn(),
    warning: vi.fn(),
  }),
  ElMessageBox: { confirm: vi.fn().mockResolvedValue('confirm') },
}))
vi.mock('@/store', () => ({
  useUserStore: () => ({ resetToken: vi.fn().mockResolvedValue(undefined) }),
}))

import { getToken } from '@/utils/auth'

describe('request wrapper interceptors', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  async function loadService() {
    // Import after mocks are set up so request.ts sees the mocked auth/EP.
    const mod = await import('@/utils/request')
    return mod.default
  }

  async function runRequestInterceptor(headers: Record<string, string> = {}) {
    const service = await loadService()
    const config = {
      headers: { ...headers },
    } as unknown as InternalAxiosRequestConfig
    // The first registered request interceptor is the one request.ts adds.
    const interceptor = (service.interceptors as unknown as {
      request: { handlers: Array<{ fulfilled: (c: InternalAxiosRequestConfig) => InternalAxiosRequestConfig }> }
    }).request.handlers[0].fulfilled
    return interceptor(config)
  }

  it('injects X-Token header when a token exists', async () => {
    vi.mocked(getToken).mockReturnValue('abc123')
    const result = await runRequestInterceptor()
    expect(result.headers?.['X-Token']).toBe('abc123')
  })

  it('does not inject X-Token when no token exists', async () => {
    vi.mocked(getToken).mockReturnValue(null)
    const result = await runRequestInterceptor()
    expect(result.headers?.['X-Token']).toBeUndefined()
  })

  it('returns the data envelope when code === 20000', async () => {
    const service = await loadService()
    const interceptor = (service.interceptors as unknown as {
      response: { handlers: Array<{ fulfilled: (r: AxiosResponse) => unknown }> }
    }).response.handlers[0].fulfilled
    const okResponse = {
      data: { code: 20000, message: 'ok', data: { id: 1 } },
    } as AxiosResponse
    expect(interceptor(okResponse)).toEqual({
      code: 20000,
      message: 'ok',
      data: { id: 1 },
    })
  })

  it('rejects when code !== 20000', async () => {
    const { ElMessage } = await import('element-plus')
    const service = await loadService()
    const interceptor = (service.interceptors as unknown as {
      response: { handlers: Array<{ fulfilled: (r: AxiosResponse) => unknown }> }
    }).response.handlers[0].fulfilled
    const errResponse = {
      data: { code: 500, message: 'boom' },
    } as AxiosResponse
    await expect(interceptor(errResponse)).rejects.toThrow('boom')
    expect(ElMessage).toHaveBeenCalledWith(
      expect.objectContaining({ message: 'boom', type: 'error' }),
    )
  })
})
