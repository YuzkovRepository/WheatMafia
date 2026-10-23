// middleware/auth.global.ts
export default defineNuxtRouteMiddleware(async (to, from) => {
  console.log('=== MIDDLEWARE CHECK ===')
  console.log('Going to:', to.path)
  
  const authStore = useAuthStore()
  
  if (process.client) {
    await authStore.initAuth()
  }
  
  console.log('isAuthenticated:', authStore.isAuthenticated)
  console.log('user:', authStore.user)

  // Публичные маршруты (не требуют авторизации)
  const publicRoutes = ['/auth/login', '/auth/register', '/']
  const isPublicRoute = publicRoutes.some(route => to.path === route)
  
  // Защищенные маршруты (требуют авторизации)
  const protectedRoutes = ['/profile', '/my-offers']
  const isProtectedRoute = protectedRoutes.some(route => to.path.startsWith(route))

  console.log('isProtectedRoute:', isProtectedRoute)
  console.log('isPublicRoute:', isPublicRoute)

  if (!authStore.isAuthenticated && isProtectedRoute) {
    console.log('Redirecting to login...')
    return navigateTo('/auth/login')
  }

  if (authStore.isAuthenticated && (to.path === '/auth/login' || to.path === '/auth/register')) {
    console.log('Redirecting to home...')
    return navigateTo('/')
  }
  
  console.log('Middleware passed, continuing to:', to.path)
})