import { defineStore } from 'pinia'

export interface User {
  id?: number
  login: string
  email: string
  nickName?: string
  createdAt?: string
}

export interface LoginResponse {
  token: string
  id: number
  email: string
  nickName: string
}

export interface RegisterResponse {
  email: string
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as User | null,
    token: null as string | null,
    isAuthenticated: false,
    isLoading: false,
    error: null as string | null
  }),

  actions: {
    async initAuth() {
      if (!import.meta.client) return

      const token = localStorage.getItem('token')
      const userStr = localStorage.getItem('user')

      if (!token) return

      this.token = token
      this.isAuthenticated = true

      if (userStr) {
        try {
          this.user = JSON.parse(userStr)
        } catch {
          localStorage.removeItem('user')
        }
      }
    },

    async login(form: { email: string; password: string }) {
      const { $api } = useNuxtApp()

      this.isLoading = true
      this.error = null

      try {
        const response = await $api<{
          status: number
          message: string
          data: LoginResponse
        }>('/v1/users/login', {
          method: 'POST',
          body: {
            email: form.email,
            password: form.password
          }
        })

        const data = response?.data

        if (!data?.token) {
          throw new Error('Неверный ответ от сервера')
        }

        localStorage.setItem('token', data.token)
        this.token = data.token

        const user: User = {
          id: data.id,
          login: data.nickName,
          email: data.email,
          nickName: data.nickName
        }

        localStorage.setItem('user', JSON.stringify(user))
        this.user = user
        this.isAuthenticated = true

        return { success: true }
      } catch (e: any) {
        console.error('LOGIN ERROR:', e)
        this.error = e?.data?.message || e?.message || 'Ошибка входа'
        return { success: false }
      } finally {
        this.isLoading = false
      }
    },

    async register(form: {
      email: string
      nickName: string
      password: string
    }) {
      const { $api } = useNuxtApp()

      this.isLoading = true
      this.error = null

      try {
        const response = await $api<{
          status: number
          message: string
          data: RegisterResponse
        }>('/v1/users/register', {
          method: 'POST',
          body: {
            email: form.email,
            nickName: form.nickName,
            password: form.password
          }
        })

        if (!response?.data) {
          throw new Error('Неверный ответ от сервера')
        }

        return await this.login({
          email: form.email,
          password: form.password
        })
      } catch (e: any) {
        console.error('REGISTER ERROR:', e)
        this.error = e?.data?.message || e?.message || 'Ошибка регистрации'
        return { success: false }
      } finally {
        this.isLoading = false
      }
    },

    logout() {
      localStorage.removeItem('token')
      localStorage.removeItem('user')

      this.token = null
      this.user = null
      this.isAuthenticated = false
    }
  }
})