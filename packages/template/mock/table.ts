import type { MockMethod } from 'vite-plugin-mock'
import Mock from 'mockjs'

const ok = <T>(data: T) => ({ code: 20000, message: 'ok', data })

const List: Array<Record<string, unknown>> = []
const count = 50

for (let i = 0; i < count; i++) {
  List.push(
    Mock.mock({
      id: '@increment',
      timestamp: +Mock.Random.datetime('T'),
      author: '@first',
      reviewer: '@first',
      title: '@title(5, 10)',
      content_short: 'mock data',
      forecast: '@float(0, 100, 2, 2)',
      importance: '@integer(1, 3)',
      'type|1': ['CN', 'US', 'JP', 'EU'],
      'status|1': ['published', 'draft'],
      display_time: '@datetime',
      pageviews: '@integer(300, 5000)',
    }),
  )
}

export default [
  {
    url: '/table/list',
    method: 'get',
    response: ({ query }: { query: Record<string, string> }) => {
      const page = Number(query.page) || 1
      const limit = Number(query.limit) || 20
      const pageList = List.filter((_, index) => index < limit * page && index >= limit * (page - 1))
      return ok({ items: pageList, total: List.length })
    },
  },
] as MockMethod[]
