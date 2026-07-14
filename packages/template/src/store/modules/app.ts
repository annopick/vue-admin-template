import { defineStore } from 'pinia'
import { ref, reactive } from 'vue'
import Cookies from 'js-cookie'

interface SidebarState {
  opened: boolean
  withoutAnimation: boolean
}

export const useAppStore = defineStore('app', () => {
  const sidebar = reactive<SidebarState>({
    opened: Cookies.get('sidebarStatus') ? !!Number(Cookies.get('sidebarStatus')) : true,
    withoutAnimation: false,
  })

  const device = ref<'desktop' | 'mobile'>('desktop')

  function toggleSideBar() {
    sidebar.opened = !sidebar.opened
    sidebar.withoutAnimation = false
    Cookies.set('sidebarStatus', sidebar.opened ? '1' : '0')
  }

  function closeSideBar({ withoutAnimation }: { withoutAnimation: boolean }) {
    Cookies.set('sidebarStatus', '0')
    sidebar.opened = false
    sidebar.withoutAnimation = withoutAnimation
  }

  function toggleDevice(d: 'desktop' | 'mobile') {
    device.value = d
  }

  return { sidebar, device, toggleSideBar, closeSideBar, toggleDevice }
})
