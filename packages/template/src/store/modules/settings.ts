import { defineStore } from 'pinia'
import { ref } from 'vue'
import defaultSettings from '@/settings'

const { fixedHeader, sidebarLogo } = defaultSettings

export const useSettingsStore = defineStore('settings', () => {
  const _fixedHeader = ref(fixedHeader)
  const _sidebarLogo = ref(sidebarLogo)

  function changeSetting(key: 'fixedHeader' | 'sidebarLogo', value: boolean) {
    if (key === 'fixedHeader') _fixedHeader.value = value
    if (key === 'sidebarLogo') _sidebarLogo.value = value
  }

  return {
    fixedHeader: _fixedHeader,
    sidebarLogo: _sidebarLogo,
    changeSetting,
  }
})
