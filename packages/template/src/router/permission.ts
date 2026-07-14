import type { RouteRecordRaw } from 'vue-router'

/**
 * Check whether a user (identified by their roles) has access to a route.
 * A route with no `meta.roles` is accessible to everyone.
 */
export function hasPermission(roles: string[], route: RouteRecordRaw): boolean {
  const routeRoles = route.meta?.roles as string[] | undefined
  if (routeRoles && routeRoles.length > 0) {
    // Route requires specific roles — check intersection
    return roles.some((role) => routeRoles.includes(role))
  }
  // No roles requirement = public
  return true
}

/**
 * Filter a list of async routes to those the user can access, recursing into
 * children. A parent route survives only if the user has its role; children
 * are then individually filtered.
 */
export function filterAsyncRoutes(routes: RouteRecordRaw[], roles: string[]): RouteRecordRaw[] {
  const result: RouteRecordRaw[] = []
  routes.forEach((route) => {
    const tmp = { ...route }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      result.push(tmp)
    }
  })
  return result
}
