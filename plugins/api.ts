export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig()
  const authStore = useAuthStore()

  const api = $fetch.create({
    baseURL: config.public.apiBase,

    onRequest({ options }) {
      const token =
        authStore.token ||
        (import.meta.client ? localStorage.getItem('token') : null)

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
      const isAuthCall =
        url.includes('/users/login') || url.includes('/users/register')

      if (
        !isAuthCall &&
        authStore.token &&
        (response.status === 401 || response.status === 403)
      ) {
        authStore.logout()
        navigateTo('/login')
      }
    }
  })

  return {
    provide: {
      api
    }
  }
})