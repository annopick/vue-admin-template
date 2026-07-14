import router from './router'
import { asyncRoutes, notFoundRoute } from './router'
import { filterAsyncRoutes } from './router/permission'
import { useUserStore } from './store/modules/user'
import { useRouteStore } from './store/modules/route'
import { getToken } from '@/utils/auth'
import { ElMessage } from 'element-plus'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

NProgress.configure({ showSpinner: false })

const whiteList = ['/login']

router.beforeEach(async (to, _from, next) => {
  NProgress.start()

  const hasToken = getToken()

  if (hasToken) {
    if (to.path === '/login') {
      next({ path: '/' })
      NProgress.done()
    } else {
      const userStore = useUserStore()
      const hasRoles = userStore.roles.length > 0

      if (hasRoles) {
        next()
      } else {
        try {
          // Fetch user info (including roles) first
          const userInfo = await userStore.getInfo()
          const accessRoutes = filterAsyncRoutes(asyncRoutes, userInfo.roles)

          // Register each filtered async route dynamically
          accessRoutes.forEach((route) => {
            router.addRoute(route)
          })
          // 404 catch-all LAST so dynamic paths match before falling through
          router.addRoute(notFoundRoute)

          // Update the sidebar's route store
          const routeStore = useRouteStore()
          routeStore.addRoutes(accessRoutes)

          // Retry the navigation now that routes are registered. Use replace
          // so the redirect doesn't create a history entry.
          next({ ...to, replace: true })
        } catch (err) {
          await userStore.resetToken()
          ElMessage.error((err as Error).message || '发生错误')
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
    if (whiteList.includes(to.path)) {
      next()
    } else {
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  NProgress.done()
})
