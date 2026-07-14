import { createRouter, createWebHashHistory, type RouteRecordRaw } from 'vue-router'

/* Layout */
import Layout from '@/layout/index.vue'

/**
 * constantRoutes — no role requirement, every authenticated user sees them.
 */
export const constantRoutes: RouteRecordRaw[] = [
  {
    path: '/login',
    component: () => import('@/views/login/index.vue'),
    meta: { hidden: true },
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/dashboard/index.vue'),
        meta: { title: 'Dashboard', icon: 'HomeFilled' },
      },
    ],
  },
  // 404 catch-all — must be last. Slice 6 will move this to register after
  // the dynamic asyncRoutes so they match before falling through to 404.
  {
    path: '/:pathMatch(.*)*',
    component: () => import('@/views/404.vue'),
    meta: { hidden: true },
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  scrollBehavior: () => ({ top: 0 }),
  routes: constantRoutes,
})

// Vue Router 4 replacement for the legacy `router.matcher = newRouter.matcher`
// reset trick: remove all dynamic routes, leaving only the constant ones.
export function resetRouter() {
  const constantChildren = constantRoutes.flatMap((r) => r.children ?? [])
  constantChildren.forEach((c) => {
    if (c.name) router.removeRoute(c.name)
  })
}

export default router
