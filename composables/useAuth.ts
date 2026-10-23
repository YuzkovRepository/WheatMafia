// composables/useAuth.ts
import { useAuthStore } from '~/stores/auth'

export const useAuth = () => {
  const authStore = useAuthStore()
  
  const isAdmin = computed(() => {
    const roles = authStore.user?.roles || []
    return roles.includes('ROLE_ADMIN')
  })
  
  const isModerator = computed(() => {
    const roles = authStore.user?.roles || []
    return roles.includes('ROLE_MODERATOR')
  })
  
  return {
    isAdmin,
    isModerator
  }
}