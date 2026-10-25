export default defineNuxtPlugin(() => {
  console.log('✅ api plugin loaded')

  const authStore = useAuthStore()

  globalThis.$fetch = $fetch.create({
    onRequest({ options }) {
      const token = authStore.token || (process.client ? localStorage.getItem('token') : null)
      if (token) {
        const headers = new Headers(options.headers as HeadersInit)
        if (!headers.has('Authorization')) {
          headers.set('Authorization', `Bearer ${token}`)
        }
        options.headers = headers
      }
    },
    onResponseError({ request, response }) {
      const url = String(request)
      const isAuthCall = url.includes('/users/login') || url.includes('/users/register')
      // токен есть, но сервер его не принял — сессия истекла
      if (!isAuthCall && authStore.token && (response.status === 401 || response.status === 403)) {
        authStore.logout()
        navigateTo('/login') // подставьте свой путь к странице входа
      }
    }
  })
})