import { describe, it, expect, beforeEach } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useTagsViewStore, type TagView } from '@/store/modules/tagsView'

describe('useTagsViewStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  function makeView(path: string, title: string, name?: string, affix = false): TagView {
    return { path, name, fullPath: path, meta: { title, affix } }
  }

  describe('addView / addVisitedView', () => {
    it('adds a view to visitedViews', () => {
      const store = useTagsViewStore()
      store.addView(makeView('/dashboard', 'Dashboard', 'Dashboard'))
      expect(store.visitedViews).toHaveLength(1)
      expect(store.visitedViews[0].title).toBe('Dashboard')
    })

    it('does not add duplicate views (same path)', () => {
      const store = useTagsViewStore()
      const view = makeView('/dashboard', 'Dashboard', 'Dashboard')
      store.addView(view)
      store.addView(view)
      expect(store.visitedViews).toHaveLength(1)
    })

    it('adds the route name to cachedViews', () => {
      const store = useTagsViewStore()
      store.addView(makeView('/table', 'Table', 'Table'))
      expect(store.cachedViews).toContain('Table')
    })
  })

  describe('delView', () => {
    it('removes a view from both visited and cached', async () => {
      const store = useTagsViewStore()
      store.addView(makeView('/dashboard', 'Dashboard', 'Dashboard'))
      store.addView(makeView('/table', 'Table', 'Table'))
      const result = await store.delView(makeView('/table', 'Table', 'Table'))
      expect(store.visitedViews).toHaveLength(1)
      expect(store.visitedViews[0].path).toBe('/dashboard')
      expect(store.cachedViews).not.toContain('Table')
      expect(result.visitedViews).toHaveLength(1)
    })
  })

  describe('delOthersViews', () => {
    it('keeps only the target and affix tags', async () => {
      const store = useTagsViewStore()
      store.addView(makeView('/dashboard', 'Dashboard', 'Dashboard', true))
      store.addView(makeView('/table', 'Table', 'Table'))
      store.addView(makeView('/form', 'Form', 'Form'))
      await store.delOthersViews(makeView('/table', 'Table', 'Table'))
      expect(store.visitedViews.map((v) => v.path)).toEqual(['/dashboard', '/table'])
    })
  })

  describe('delAllViews', () => {
    it('removes all non-affix views', async () => {
      const store = useTagsViewStore()
      store.addView(makeView('/dashboard', 'Dashboard', 'Dashboard', true))
      store.addView(makeView('/table', 'Table', 'Table'))
      store.addView(makeView('/form', 'Form', 'Form'))
      await store.delAllViews()
      expect(store.visitedViews).toHaveLength(1)
      expect(store.visitedViews[0].path).toBe('/dashboard')
    })
  })
})
