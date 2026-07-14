import { createRouter, createWebHashHistory, type RouteRecordRaw } from 'vue-router'

/* Layout */
import Layout from '@/layout/index.vue'

/**
 * constantRoutes — no role requirement, every authenticated user sees them.
 * Registered unconditionally at startup.
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
]

/**
 * asyncRoutes — role-gated routes filtered by meta.roles at runtime. The
 * navigation guard (permission.ts) registers the user-authorized subset via
 * router.addRoute, then registers the 404 catch-all last so dynamic paths
 * match before falling through.
 */
export const asyncRoutes: RouteRecordRaw[] = [
  {
    path: '/example',
    component: Layout,
    redirect: '/example/table',
    name: 'Example',
    meta: { title: '示例', icon: 'Menu', roles: ['admin', 'editor'] },
    children: [
      {
        path: 'table',
        name: 'Table',
        component: () => import('@/views/example/table/index.vue'),
        meta: { title: '表格', icon: 'Grid', roles: ['admin', 'editor'] },
      },
      {
        path: 'tree',
        name: 'Tree',
        component: () => import('@/views/example/tree/index.vue'),
        meta: { title: '树形', icon: 'Connection', roles: ['admin'] },
      },
    ],
  },
  {
    path: '/form',
    component: Layout,
    meta: { roles: ['admin'] },
    children: [
      {
        path: 'index',
        name: 'Form',
        component: () => import('@/views/form/index.vue'),
        meta: { title: '表单', icon: 'Document', roles: ['admin'] },
      },
    ],
  },
  {
    path: '/nested',
    component: Layout,
    redirect: '/nested/menu1/menu1-1',
    name: 'Nested',
    meta: { title: '多级菜单', icon: 'FolderOpened', roles: ['admin', 'editor'] },
    children: [
      {
        path: 'menu1',
        component: () => import('@/views/nested/menu1/index.vue'),
        name: 'Menu1',
        meta: { title: 'Menu 1', roles: ['admin', 'editor'] },
        children: [
          {
            path: 'menu1-1',
            component: () => import('@/views/nested/menu1/menu1-1/index.vue'),
            name: 'Menu1-1',
            meta: { title: 'Menu 1-1', roles: ['admin', 'editor'] },
          },
          {
            path: 'menu1-2',
            component: () => import('@/views/nested/menu1/menu1-2/index.vue'),
            name: 'Menu1-2',
            meta: { title: 'Menu 1-2', roles: ['admin', 'editor'] },
            children: [
              {
                path: 'menu1-2-1',
                component: () => import('@/views/nested/menu1/menu1-2/menu1-2-1/index.vue'),
                name: 'Menu1-2-1',
                meta: { title: 'Menu 1-2-1', roles: ['admin'] },
              },
              {
                path: 'menu1-2-2',
                component: () => import('@/views/nested/menu1/menu1-2/menu1-2-2/index.vue'),
                name: 'Menu1-2-2',
                meta: { title: 'Menu 1-2-2', roles: ['admin'] },
              },
            ],
          },
          {
            path: 'menu1-3',
            component: () => import('@/views/nested/menu1/menu1-3/index.vue'),
            name: 'Menu1-3',
            meta: { title: 'Menu 1-3', roles: ['admin', 'editor'] },
          },
        ],
      },
      {
        path: 'menu2',
        component: () => import('@/views/nested/menu2/index.vue'),
        name: 'Menu2',
        meta: { title: 'Menu 2', roles: ['admin', 'editor'] },
      },
    ],
  },
]

/** 404 catch-all — registered AFTER dynamic routes so they match first. */
export const notFoundRoute: RouteRecordRaw = {
  path: '/:pathMatch(.*)*',
  component: () => import('@/views/404.vue'),
  meta: { hidden: true },
}

const router = createRouter({
  history: createWebHashHistory(),
  scrollBehavior: () => ({ top: 0 }),
  routes: constantRoutes,
})

/** Remove all dynamically-added routes, keeping only constantRoutes. */
export function resetRouter() {
  // Remove all named routes except the constant ones
  const constantNames = new Set(
    constantRoutes.flatMap((r) => [r.name, ...(r.children?.map((c) => c.name) ?? [])]).filter(Boolean),
  )
  const allRoutes = router.getRoutes()
  allRoutes.forEach((r) => {
    if (r.name && !constantNames.has(r.name)) {
      router.removeRoute(r.name)
    }
  })
}

export default router
