<template>
  <div class="min-h-screen bg-stone-100">
    <header class="bg-stone-900 text-amber-50 shadow-lg">
      <div class="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <NuxtLink to="/" class="flex items-center gap-2">
          <span class="text-2xl">🌾</span>
          <span class="font-serif font-bold text-xl tracking-wide text-amber-100">
            Wheat<span class="text-amber-400">Mafia</span>
          </span>
        </NuxtLink>

        <div class="flex items-center gap-4">
          <template v-if="authStore.isAuthenticated">
            <div class="hidden sm:flex items-center gap-3 px-3 py-1.5 bg-stone-800 rounded-full">
              <span class="text-amber-400 font-semibold">🪙 {{ authStore.user?.coins ?? 0 }}</span>
              <span class="text-amber-300">⭐ {{ authStore.user?.reputation ?? 0 }}</span>
            </div>
            <span class="hidden md:inline text-amber-100/90 font-semibold">
              {{ displayName }}
            </span>
            <button
              @click="handleLogout"
              class="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-stone-900 rounded-lg font-semibold transition"
            >
              Выйти
            </button>
          </template>
          <template v-else>
            <NuxtLink to="/auth/login" class="px-4 py-2 text-amber-100 hover:text-white transition">
              Войти
            </NuxtLink>
            <NuxtLink
              to="/auth/register"
              class="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-stone-900 rounded-lg font-semibold transition"
            >
              Регистрация
            </NuxtLink>
          </template>
        </div>
      </div>
    </header>

    <main>
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'

const authStore = useAuthStore()
const router = useRouter()

const displayName = computed(() => {
  const u = authStore.user
  if (!u) return ''
  return u.nickName || u.email || 'Игрок'
})

const handleLogout = () => {
  authStore.logout()
  router.push('/')
}
</script>