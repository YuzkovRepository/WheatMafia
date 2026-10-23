<template>
  <div class="min-h-screen flex items-center justify-center p-4">
    <div class="w-full max-w-md">
      <!-- Логотип и заголовок -->
      <div class="text-center mb-8">
        <div class="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 mb-4">
          <span class="text-3xl">🌾</span>
        </div>
        <h2 class="text-4xl font-serif font-bold text-amber-50 mb-2">Вход в игру</h2>
        <p class="text-amber-200/70">WheatMafia — урожай по-нашему</p>
      </div>

      <div class="bg-stone-900/70 backdrop-blur rounded-2xl p-8 shadow-2xl border border-amber-900/40">
        <form class="space-y-5" @submit.prevent="handleLogin">
          <div>
            <label class="block text-amber-200/80 text-sm font-semibold mb-2">Email</label>
            <input
              v-model="form.email"
              type="email"
              required
              class="w-full px-4 py-3 bg-stone-800 border border-stone-700 rounded-xl text-amber-50 placeholder-stone-500 focus:outline-none focus:border-amber-500 transition"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label class="block text-amber-200/80 text-sm font-semibold mb-2">Пароль</label>
            <input
              v-model="form.password"
              type="password"
              required
              class="w-full px-4 py-3 bg-stone-800 border border-stone-700 rounded-xl text-amber-50 placeholder-stone-500 focus:outline-none focus:border-amber-500 transition"
              placeholder="Введите пароль"
            />
          </div>

          <div v-if="authStore.error" class="bg-red-900/40 border border-red-700/50 rounded-xl p-3">
            <p class="text-red-200 text-sm text-center">{{ authStore.error }}</p>
          </div>

          <button
            type="submit"
            :disabled="authStore.isLoading"
            class="w-full py-3 rounded-xl text-stone-900 font-bold bg-amber-500 hover:bg-amber-400 transition disabled:opacity-50"
          >
            {{ authStore.isLoading ? 'Вход...' : 'Войти' }}
          </button>

          <div class="relative pt-2">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-stone-700"></div>
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-4 bg-stone-900/70 text-stone-400">или</span>
            </div>
          </div>

          <p class="text-center text-amber-200/70 text-sm">
            Нет аккаунта?
            <NuxtLink
              to="/auth/register"
              class="text-amber-400 hover:text-amber-300 font-semibold ml-1 underline underline-offset-2"
            >
              Зарегистрироваться →
            </NuxtLink>
          </p>
        </form>
      </div>

      <p class="text-center text-stone-500 text-xs mt-6">
        Договаривайся. Производи. Кидай. Стань доном.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'

definePageMeta({ layout: 'auth' })

const authStore = useAuthStore()
const router = useRouter()

const form = reactive({
  email: '',
  password: ''
})

const handleLogin = async () => {
  const result = await authStore.login(form)
  if (result.success) {
    await router.push('/')
  }
}
</script>