import { describe, it, expect } from 'vitest'
import { hasPermission, filterAsyncRoutes } from '@/router/permission'
import type { RouteRecordRaw } from 'vue-router'

// Verify the permission-filter logic in isolation. These are pure functions
// over route configs — the highest, cheapest seam to assert the filtering
// behavior before wiring it into the navigation guard.

// Helpers to build minimal route records for testing.
function route(path: string, roles?: string[]): RouteRecordRaw {
  return {
    path,
    component: () => Promise.resolve({} as never),
    meta: roles ? { roles } : undefined,
  } as RouteRecordRaw
}

function routeWithChildren(path: string, roles: string[], children: RouteRecordRaw[]): RouteRecordRaw {
  return {
    path,
    component: () => Promise.resolve({} as never),
    meta: { roles },
    children,
  } as RouteRecordRaw
}

describe('hasPermission', () => {
  it('grants access when route has no roles requirement', () => {
    expect(hasPermission(['admin'], route('/x'))).toBe(true)
    expect(hasPermission([], route('/x'))).toBe(true)
  })

  it('grants access when user roles intersect route roles', () => {
    expect(hasPermission(['admin'], route('/x', ['admin']))).toBe(true)
    expect(hasPermission(['admin', 'editor'], route('/x', ['editor']))).toBe(true)
  })

  it('denies access when user roles do not intersect route roles', () => {
    expect(hasPermission(['editor'], route('/x', ['admin']))).toBe(false)
    expect(hasPermission([], route('/x', ['admin']))).toBe(false)
  })
})

describe('filterAsyncRoutes', () => {
  it('keeps routes the user has access to', () => {
    const asyncRoutes = [
      route('/a', ['admin']),
      route('/b', ['editor']),
      route('/c', ['admin', 'editor']),
    ]
    const result = filterAsyncRoutes(asyncRoutes, ['admin'])
    expect(result.map((r) => r.path)).toEqual(['/a', '/c'])
  })

  it('filters child routes recursively', () => {
    const asyncRoutes = [
      routeWithChildren('/parent', ['admin', 'editor'], [
        route('child1', ['admin']),
        route('child2', ['editor']),
        route('child3'), // no roles = everyone
      ]),
    ]
    const result = filterAsyncRoutes(asyncRoutes, ['editor'])
    // Parent survives (editor allowed); child1 dropped (admin-only);
    // child2 + child3 survive
    expect(result).toHaveLength(1)
    expect(result[0].children?.map((c) => c.path)).toEqual(['child2', 'child3'])
  })

  it('drops a parent entirely if the user lacks its role', () => {
    const asyncRoutes = [
      routeWithChildren('/parent', ['admin'], [
        route('child', ['editor']),
      ]),
    ]
    const result = filterAsyncRoutes(asyncRoutes, ['editor'])
    expect(result).toHaveLength(0)
  })

  it('returns empty array for an empty input', () => {
    expect(filterAsyncRoutes([], ['admin'])).toEqual([])
  })
})
