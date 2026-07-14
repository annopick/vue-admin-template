<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { ElScrollbar, ElMenu } from 'element-plus'
import SidebarItem from './SidebarItem.vue'
import Logo from './Logo.vue'
import { useRouteStore } from '@/store/modules/route'
import { useSettingsStore } from '@/store/modules/settings'
import { useAppStore } from '@/store/modules/app'
import variables from '@/styles/variables'

const route = useRoute()
const routeStore = useRouteStore()
const settingsStore = useSettingsStore()
const appStore = useAppStore()

const sidebar = computed(() => appStore.sidebar)

const activeMenu = computed(() => {
  const { meta, path } = route
  if (meta.activeMenu) {
    return meta.activeMenu as string
  }
  return path
})

const routes = computed(() => routeStore.routes)
const showLogo = computed(() => settingsStore.sidebarLogo)
</script>

<template>
  <div class="sidebar-wrapper">
    <logo v-if="showLogo" :collapse="!sidebar.opened" />
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="activeMenu"
        :collapse="!sidebar.opened"
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
        :active-text-color="variables.menuActiveText"
        :unique-opened="false"
        :collapse-transition="false"
        mode="vertical"
      >
        <sidebar-item
          v-for="route in routes"
          :key="route.path"
          :item="route"
          :base-path="route.path"
        />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<style lang="scss" scoped>
.sidebar-wrapper {
  height: 100%;
}
</style>
