import { describe, it, expect, beforeEach, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'

// Verify the user store's observable behavior: login persists the token,
// getInfo populates the profile, logout clears everything. We mock the
// API layer and cookie helpers — the store's contract is what we test.

vi.mock('@/api/user', () => ({
  login: vi.fn(),
  getInfo: vi.fn(),
  logout: vi.fn(),
}))
vi.mock('@/utils/auth', () => ({
  getToken: vi.fn(),
  setToken: vi.fn(),
  removeToken: vi.fn(),
}))
vi.mock('@/router', () => ({
  resetRouter: vi.fn(),
}))

import { useUserStore } from '@/store/modules/user'
import { login as apiLogin, getInfo as apiGetInfo, logout as apiLogout } from '@/api/user'
import { setToken, removeToken } from '@/utils/auth'

describe('useUserStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  describe('login', () => {
    it('stores the token in cookie and state on success', async () => {
      vi.mocked(apiLogin).mockResolvedValue({
        code: 20000,
        message: 'ok',
        data: { token: 'tok-1' },
      })
      const store = useUserStore()
      await store.login({ username: 'admin', password: '111111' })
      expect(setToken).toHaveBeenCalledWith('tok-1')
      expect(store.token).toBe('tok-1')
    })

    it('rejects when the API call fails', async () => {
      vi.mocked(apiLogin).mockRejectedValue(new Error('bad credentials'))
      const store = useUserStore()
      await expect(store.login({ username: 'admin', password: 'wrong' })).rejects.toThrow(
        'bad credentials',
      )
    })
  })

  describe('getInfo', () => {
    it('populates name, avatar, and roles from the response', async () => {
      vi.mocked(apiGetInfo).mockResolvedValue({
        code: 20000,
        message: 'ok',
        data: { name: 'Super Admin', avatar: '/x.png', roles: ['admin'] },
      })
      const store = useUserStore()
      const result = await store.getInfo()
      expect(store.name).toBe('Super Admin')
      expect(store.avatar).toBe('/x.png')
      expect(store.roles).toEqual(['admin'])
      expect(result.roles).toEqual(['admin'])
    })

    it('rejects when the response has no data', async () => {
      vi.mocked(apiGetInfo).mockResolvedValue({
        code: 20000,
        message: 'ok',
        data: null as unknown as { name: string; avatar: string; roles: string[] },
      })
      const store = useUserStore()
      await expect(store.getInfo()).rejects.toThrow()
    })
  })

  describe('logout', () => {
    it('removes the token and resets state', async () => {
      vi.mocked(apiLogout).mockResolvedValue({ code: 20000, message: 'ok', data: {} })
      const store = useUserStore()
      // seed state so we can assert it resets
      store.$patch({ token: 'tok-1', name: 'Admin', avatar: '/a.png', roles: ['admin'] })
      await store.logout()
      expect(removeToken).toHaveBeenCalled()
      expect(store.token).toBe('')
      expect(store.name).toBe('')
      expect(store.roles).toEqual([])
    })
  })

  describe('resetToken', () => {
    it('removes the cookie and clears state', async () => {
      const store = useUserStore()
      store.$patch({ token: 'tok-1', name: 'Admin', roles: ['admin'] })
      await store.resetToken()
      expect(removeToken).toHaveBeenCalled()
      expect(store.token).toBe('')
      expect(store.roles).toEqual([])
    })
  })
})
