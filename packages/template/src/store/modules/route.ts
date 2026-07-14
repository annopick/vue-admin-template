import { defineStore } from 'pinia'
import { ref } from 'vue'
import { constantRoutes } from '@/router'
import type { RouteRecordRaw } from 'vue-router'

/**
 * Holds the routes the Sidebar renders. Initialized with constantRoutes;
 * after the permission guard runs, the filtered asyncRoutes are appended
 * via addRoutes().
 */
export const useRouteStore = defineStore('route', () => {
  const routes = ref<RouteRecordRaw[]>([...constantRoutes])

  function addRoutes(newRoutes: RouteRecordRaw[]) {
    routes.value = [...constantRoutes, ...newRoutes]
  }

  return { routes, addRoutes }
})
