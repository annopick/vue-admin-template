import { defineStore } from 'pinia'
import { ref } from 'vue'
import { login as apiLogin, getInfo as apiGetInfo, logout as apiLogout, type LoginPayload } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'

export const useUserStore = defineStore('user', () => {
  const token = ref<string>(getToken() ?? '')
  const name = ref<string>('')
  const avatar = ref<string>('')
  const roles = ref<string[]>([])

  async function login(payload: LoginPayload) {
    const { username, password } = payload
    const res = await apiLogin({ username: username.trim(), password })
    token.value = res.data.token
    setToken(res.data.token)
  }

  async function getInfo() {
    const res = await apiGetInfo(token.value)
    if (!res.data) {
      throw new Error('Verification failed, please Login again.')
    }
    const { name: n, avatar: a, roles: r } = res.data
    name.value = n
    avatar.value = a
    roles.value = r
    return res.data
  }

  async function logout() {
    await apiLogout()
    removeToken()
    resetRouter()
    resetState()
  }

  async function resetToken() {
    removeToken()
    resetState()
  }

  function resetState() {
    token.value = ''
    name.value = ''
    avatar.value = ''
    roles.value = []
  }

  return { token, name, avatar, roles, login, getInfo, logout, resetToken }
})
