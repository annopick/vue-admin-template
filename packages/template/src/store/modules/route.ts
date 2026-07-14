import { defineStore } from 'pinia'
import { ref } from 'vue'
import { constantRoutes } from '@/router'
import type { RouteRecordRaw } from 'vue-router'

/**
 * Holds the routes the Sidebar renders. Initialized with constantRoutes;
 * slice 6 (dynamic permission) will append the filtered asyncRoutes here.
 */
export const useRouteStore = defineStore('route', () => {
  const routes = ref<RouteRecordRaw[]>([...constantRoutes])

  function setRoutes(newRoutes: RouteRecordRaw[]) {
    routes.value = newRoutes
  }

  return { routes, setRoutes }
})
