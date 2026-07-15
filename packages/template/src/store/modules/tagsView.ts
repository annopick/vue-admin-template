import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface TagView {
  name?: string
  path: string
  fullPath?: string
  title?: string
  meta?: { title?: string; affix?: boolean; noCache?: boolean }
  matched?: unknown[]
  query?: Record<string, unknown>
}

interface ViewResult {
  visitedViews: TagView[]
  cachedViews: string[]
}

function snapshot(visited: TagView[], cached: string[]): ViewResult {
  return { visitedViews: [...visited], cachedViews: [...cached] }
}

export const useTagsViewStore = defineStore('tagsView', () => {
  const visitedViews = ref<TagView[]>([])
  const cachedViews = ref<string[]>([])

  function addView(view: TagView) {
    addVisitedView(view)
    addCachedView(view)
  }

  function addVisitedView(view: TagView) {
    if (visitedViews.value.some((v) => v.path === view.path)) return
    visitedViews.value.push({ ...view, title: view.meta?.title || 'no-name' })
  }

  function addCachedView(view: TagView) {
    const name = view.name
    if (!name) return
    if (cachedViews.value.includes(name)) return
    if (!view.meta?.noCache) cachedViews.value.push(name)
  }

  function delViewSync(view: TagView): ViewResult {
    delVisitedView(view)
    delCachedView(view)
    return snapshot(visitedViews.value, cachedViews.value)
  }

  function delView(view: TagView): Promise<ViewResult> {
    return Promise.resolve(delViewSync(view))
  }

  function delVisitedView(view: TagView): TagView[] {
    const idx = visitedViews.value.findIndex((v) => v.path === view.path)
    if (idx > -1) visitedViews.value.splice(idx, 1)
    return [...visitedViews.value]
  }

  function delCachedView(view: TagView): string[] {
    const name = view.name
    if (name) {
      const index = cachedViews.value.indexOf(name)
      if (index > -1) cachedViews.value.splice(index, 1)
    }
    return [...cachedViews.value]
  }

  function delOthersViewsSync(view: TagView): ViewResult {
    visitedViews.value = visitedViews.value.filter((v) => v.meta?.affix || v.path === view.path)
    const name = view.name
    const index = name ? cachedViews.value.indexOf(name) : -1
    cachedViews.value = index > -1 ? cachedViews.value.slice(index, index + 1) : []
    return snapshot(visitedViews.value, cachedViews.value)
  }

  function delOthersViews(view: TagView): Promise<ViewResult> {
    return Promise.resolve(delOthersViewsSync(view))
  }

  function delAllViewsSync(): ViewResult {
    visitedViews.value = visitedViews.value.filter((tag) => tag.meta?.affix)
    cachedViews.value = []
    return snapshot(visitedViews.value, cachedViews.value)
  }

  function delAllViews(): Promise<ViewResult> {
    return Promise.resolve(delAllViewsSync())
  }

  function updateVisitedView(view: TagView) {
    for (let i = 0; i < visitedViews.value.length; i++) {
      if (visitedViews.value[i].path === view.path) {
        visitedViews.value[i] = Object.assign({}, visitedViews.value[i], view)
        break
      }
    }
  }

  return {
    visitedViews,
    cachedViews,
    addView,
    addVisitedView,
    addCachedView,
    delView,
    delViewSync,
    delVisitedView,
    delCachedView,
    delOthersViews,
    delOthersViewsSync,
    delAllViews,
    delAllViewsSync,
    updateVisitedView,
  }
})
