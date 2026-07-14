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
  {
    path: '/example',
    component: Layout,
    redirect: '/example/table',
    name: 'Example',
    meta: { title: '示例', icon: 'Menu' },
    children: [
      {
        path: 'table',
        name: 'Table',
        component: () => import('@/views/example/table/index.vue'),
        meta: { title: '表格', icon: 'Grid' },
      },
      {
        path: 'tree',
        name: 'Tree',
        component: () => import('@/views/example/tree/index.vue'),
        meta: { title: '树形', icon: 'Connection' },
      },
    ],
  },
  {
    path: '/form',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'Form',
        component: () => import('@/views/form/index.vue'),
        meta: { title: '表单', icon: 'Document' },
      },
    ],
  },
  {
    path: '/nested',
    component: Layout,
    redirect: '/nested/menu1/menu1-1',
    name: 'Nested',
    meta: { title: '多级菜单', icon: 'FolderOpened' },
    children: [
      {
        path: 'menu1',
        component: () => import('@/views/nested/menu1/index.vue'),
        name: 'Menu1',
        meta: { title: 'Menu 1' },
        children: [
          {
            path: 'menu1-1',
            component: () => import('@/views/nested/menu1/menu1-1/index.vue'),
            name: 'Menu1-1',
            meta: { title: 'Menu 1-1' },
          },
          {
            path: 'menu1-2',
            component: () => import('@/views/nested/menu1/menu1-2/index.vue'),
            name: 'Menu1-2',
            meta: { title: 'Menu 1-2' },
            children: [
              {
                path: 'menu1-2-1',
                component: () => import('@/views/nested/menu1/menu1-2/menu1-2-1/index.vue'),
                name: 'Menu1-2-1',
                meta: { title: 'Menu 1-2-1' },
              },
              {
                path: 'menu1-2-2',
                component: () => import('@/views/nested/menu1/menu1-2/menu1-2-2/index.vue'),
                name: 'Menu1-2-2',
                meta: { title: 'Menu 1-2-2' },
              },
            ],
          },
          {
            path: 'menu1-3',
            component: () => import('@/views/nested/menu1/menu1-3/index.vue'),
            name: 'Menu1-3',
            meta: { title: 'Menu 1-3' },
          },
        ],
      },
      {
        path: 'menu2',
        component: () => import('@/views/nested/menu2/index.vue'),
        name: 'Menu2',
        meta: { title: 'Menu 2' },
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
