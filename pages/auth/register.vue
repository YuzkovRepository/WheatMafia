<template>
  <div class="min-h-screen flex items-center justify-center p-4">
    <div class="w-full max-w-md">
      <div class="text-center mb-8">
        <div class="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 mb-4">
          <span class="text-3xl">🎩</span>
        </div>
        <h1 class="text-4xl font-serif font-bold text-amber-50 mb-2">Создать аккаунт</h1>
        <p class="text-amber-200/70">Вступай в семейное дело</p>
      </div>

      <div class="bg-stone-900/70 backdrop-blur rounded-2xl p-8 shadow-2xl border border-amber-900/40">
        <form class="space-y-4" @submit.prevent="handleRegister">
          <div>
            <label class="block text-amber-200/80 text-sm font-semibold mb-2">Email *</label>
            <input
              v-model="form.email"
              type="email"
              required
              class="w-full px-4 py-3 bg-stone-800 border border-stone-700 rounded-xl text-amber-50 placeholder-stone-500 focus:outline-none focus:border-amber-500 transition"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label class="block text-amber-200/80 text-sm font-semibold mb-2">Никнейм *</label>
            <input
              v-model="form.nickName"
              type="text"
              required
              class="w-full px-4 py-3 bg-stone-800 border border-stone-700 rounded-xl text-amber-50 placeholder-stone-500 focus:outline-none focus:border-amber-500 transition"
              placeholder="don_petrov"
            />
          </div>

          <div>
            <label class="block text-amber-200/80 text-sm font-semibold mb-2">Пароль *</label>
            <input
              v-model="form.password"
              type="password"
              required
              class="w-full px-4 py-3 bg-stone-800 border border-stone-700 rounded-xl text-amber-50 placeholder-stone-500 focus:outline-none focus:border-amber-500 transition"
              placeholder="Минимум 6 символов"
            />
          </div>

          <div>
            <label class="block text-amber-200/80 text-sm font-semibold mb-2">Повтор пароля *</label>
            <input
              v-model="confirmPassword"
              type="password"
              required
              class="w-full px-4 py-3 bg-stone-800 border border-stone-700 rounded-xl text-amber-50 placeholder-stone-500 focus:outline-none focus:border-amber-500 transition"
              placeholder="Повторите пароль"
            />
          </div>

          <div v-if="authStore.error" class="bg-red-900/40 border border-red-700/50 rounded-xl p-3">
            <p class="text-red-200 text-sm text-center">{{ authStore.error }}</p>
          </div>

          <button
            type="submit"
            :disabled="authStore.isLoading || !isFormValid"
            class="w-full py-3 rounded-xl text-stone-900 font-bold bg-amber-500 hover:bg-amber-400 transition disabled:opacity-50"
          >
            {{ authStore.isLoading ? 'Регистрация...' : 'Зарегистрироваться' }}
          </button>

          <p class="text-center text-amber-200/70 text-sm pt-2">
            Уже есть аккаунт?
            <NuxtLink to="/auth/login" class="text-amber-400 hover:text-amber-300 font-semibold ml-1 underline underline-offset-2">
              Войти
            </NuxtLink>
          </p>
        </form>
      </div>
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
  nickName: '',
  password: ''
})
const confirmPassword = ref('')

const isFormValid = computed(() =>
  form.email &&
  form.nickName &&
  form.password.length >= 6 &&
  form.password === confirmPassword.value
)

const handleRegister = async () => {
  if (form.password !== confirmPassword.value) {
    authStore.error = 'Пароли не совпадают'
    return
  }

  const result = await authStore.register({
    email: form.email,
    login: form.nickName,   // если бэкенд ждёт login — маппим сюда
    nickName: form.nickName,
    password: form.password
  } as any)

  if (result.success) {
    await router.push('/')
  }
}
</script>