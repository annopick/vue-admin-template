// 生产环境 mock 服务器：用 mockjs XHR 拦截在客户端模拟后端。
// 仅在 GitHub Pages 演示构建（VITE_USE_MOCK=true）时由 main.ts 动态加载。
//
// 不使用 vite-plugin-mock/dist/client（其 package.json exports 未导出该路径），
// 直接用 mockjs + path-to-regexp 复刻 createProdMockServer 的核心逻辑。
import Mock from 'mockjs'
import { pathToRegexp } from 'path-to-regexp'
import userMock from '../mock/user'
import tableMock from '../mock/table'

interface MockRoute {
  url: string
  method?: string
  response?: (opt: {
    url: string
    body: Record<string, unknown>
    query: Record<string, unknown>
    headers: Record<string, unknown>
  }) => unknown
  timeout?: number
}

function param2Obj(url: string): Record<string, string> {
  const search = url.split('?')[1]
  if (!search) return {}
  return JSON.parse(
    '{"' +
      decodeURIComponent(search)
        .replace(/"/g, '\\"')
        .replace(/&/g, '","')
        .replace(/=/g, '":"')
        .replace(/\+/g, ' ') +
      '"}',
  )
}

export async function setupProdMockServer() {
  const mockList: MockRoute[] = [...userMock, ...tableMock] as unknown as MockRoute[]

  if (mockList.some((m) => m.timeout)) {
    Mock.setup({ timeout: mockList.find((m) => m.timeout)?.timeout })
  }

  for (const item of mockList) {
    const reg = pathToRegexp(item.url, undefined as never, { end: false } as never)
    const method = item.method || 'get'
    // mockjs 的 handler 收到 { url, body, type }，其中 url 是完整请求路径，
    // body 是 JSON 字符串。我们解析后传给 mock 定义里的 response 函数。
    const handler = (options: { url: string; body: string; type: string }) => {
      const { url, body } = options
      const query = param2Obj(url)
      let parsedBody: Record<string, unknown> = {}
      try {
        parsedBody = body ? JSON.parse(body) : {}
      } catch {
        parsedBody = {}
      }
      // response 函数返回数据，mockjs 会自动用 Mock.mock 展开模板字符串。
      // 直接返回原始对象（mockjs 会在外层调 Mock.mock）。
      if (typeof item.response === 'function') {
        return item.response({ url, body: parsedBody, query, headers: {} })
      }
      return item.response
    }
    Mock.mock(reg as unknown as string, method, handler as never)
  }
}
