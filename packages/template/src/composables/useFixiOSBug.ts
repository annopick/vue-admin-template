import { nextTick, onBeforeUnmount } from 'vue'

/**
 * Replaces the legacy FixiOSBug Vue 2 mixin. Handles the mobile submenu
 * click-to-close behavior: clicking outside an open submenu closes it.
 * Used by SidebarItem on mobile.
 */
export function useFixiOSBug(callback: () => void) {
  function handleClickOutside(event: MouseEvent) {
    const target = event.target as HTMLElement
    // If the click is outside the sidebar menu, fire the callback
    if (!target.closest('.el-menu') && !target.closest('.sidebar-container')) {
      callback()
    }
  }

  nextTick(() => {
    document.body.addEventListener('click', handleClickOutside)
  })

  onBeforeUnmount(() => {
    document.body.removeEventListener('click', handleClickOutside)
  })
}
