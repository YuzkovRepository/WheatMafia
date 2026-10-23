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
    }
  })
})