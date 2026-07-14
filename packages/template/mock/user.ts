import type { MockMethod } from 'vite-plugin-mock'

// Mock user backend. Two credential sets exercise the permission model
// (slice 5): admin sees everything, editor sees a subset.
const USERS: Record<string, { token: string; name: string; avatar: string; roles: string[] }> = {
  'admin': {
    token: 'admin-token',
    name: 'Super Admin',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    roles: ['admin'],
  },
  'editor': {
    token: 'editor-token',
    name: 'Normal Editor',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    roles: ['editor'],
  },
}

const TOKEN_TO_USER: Record<string, string> = {
  'admin-token': 'admin',
  'editor-token': 'editor',
}

const ok = <T>(data: T) => ({ code: 20000, message: 'ok', data })

export default [
  {
    url: '/user/login',
    method: 'post',
    response: ({ body }: { body: { username: string; password: string } }) => {
      const { username } = body
      const user = USERS[username]
      if (user) {
        return ok({ token: user.token })
      }
      return { code: 60204, message: '用户名或密码错误' }
    },
  },
  {
    url: '/user/info/:token',
    method: 'get',
    response: ({ query }: { query: Record<string, string> }) => {
      // vite-plugin-mock passes path params via query for :token style
      const token = query.token
      const username = TOKEN_TO_USER[token]
      const user = username ? USERS[username] : undefined
      if (user) {
        return ok({ name: user.name, avatar: user.avatar, roles: user.roles })
      }
      return { code: 50008, message: '登录信息已过期' }
    },
  },
  {
    url: '/user/logout',
    method: 'post',
    response: () => ok({}),
  },
] as MockMethod[]
