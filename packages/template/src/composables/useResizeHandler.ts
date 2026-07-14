import { onBeforeUnmount, onMounted } from 'vue'
import { useAppStore } from '@/store/modules/app'

const WIDTH = 992 // refer to Bootstrap's responsive design

/**
 * Replaces the legacy ResizeHandler Vue 2 mixin. Watches window resize and
 * the route, switching the layout to mobile mode (sidebar collapsed) when the
 * viewport narrows below the threshold.
 */
export function useResizeHandler() {
  const appStore = useAppStore()

  function isMobile(): boolean {
    const rect = document.body.getBoundingClientRect()
    return rect.width - 1 < WIDTH
  }

  function resizeHandler() {
    if (!document.hidden) {
      const mobile = isMobile()
      appStore.toggleDevice(mobile ? 'mobile' : 'desktop')
      if (mobile) {
        appStore.closeSideBar({ withoutAnimation: true })
      }
    }
  }

  onMounted(() => {
    const mobile = isMobile()
    if (mobile) {
      appStore.toggleDevice('mobile')
      appStore.closeSideBar({ withoutAnimation: true })
    }
    window.addEventListener('resize', resizeHandler)
  })

  onBeforeUnmount(() => {
    window.removeEventListener('resize', resizeHandler)
  })
}
