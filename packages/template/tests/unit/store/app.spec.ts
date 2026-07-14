import { describe, it, expect, beforeEach, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'

vi.mock('js-cookie', () => ({
  default: {
    get: vi.fn(),
    set: vi.fn(),
  },
}))

import { useAppStore } from '@/store/modules/app'

describe('useAppStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  describe('sidebar', () => {
    it('toggles sidebar opened state and persists to cookie', () => {
      const store = useAppStore()
      expect(store.sidebar.opened).toBe(true)
      store.toggleSideBar()
      expect(store.sidebar.opened).toBe(false)
      expect(store.sidebar.withoutAnimation).toBe(false)
    })

    it('closeSideBar sets opened false with animation flag', () => {
      const store = useAppStore()
      store.closeSideBar({ withoutAnimation: true })
      expect(store.sidebar.opened).toBe(false)
      expect(store.sidebar.withoutAnimation).toBe(true)
    })
  })

  describe('device', () => {
    it('toggles device between desktop and mobile', () => {
      const store = useAppStore()
      expect(store.device).toBe('desktop')
      store.toggleDevice('mobile')
      expect(store.device).toBe('mobile')
      store.toggleDevice('desktop')
      expect(store.device).toBe('desktop')
    })
  })
})
