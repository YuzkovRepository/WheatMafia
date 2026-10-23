<template>
  <main class="max-w-6xl mx-auto px-4 py-10">
    <!-- Приветствие -->
    <div class="mb-10 text-center">
      <h1 class="text-4xl md:text-5xl font-serif font-bold text-stone-800 mb-3">
        Добро пожаловать в <span class="text-amber-700">WheatMafia</span>
      </h1>
      <p class="text-stone-600 text-lg">
        Урожай по-нашему. Договаривайся, производи, кидай — и стань самым влиятельным фермером.
      </p>
    </div>

    <!-- Профиль -->
    <div
      v-if="authStore.isAuthenticated"
      class="mb-8 bg-white rounded-2xl shadow-md p-6 flex flex-wrap items-center justify-between gap-4"
    >
      <div>
        <div class="text-stone-500 text-sm">Вы вошли как</div>
        <div class="text-2xl font-bold text-stone-800">{{ authStore.user?.nickName }}</div>
      </div>
      <div class="flex gap-4">
        <div class="px-4 py-2 bg-amber-50 rounded-xl text-center">
          <div class="text-2xl font-bold text-amber-700">🪙 {{ authStore.user?.coins ?? 0 }}</div>
          <div class="text-xs text-stone-500">Монеты</div>
        </div>
        <div class="px-4 py-2 bg-amber-50 rounded-xl text-center">
          <div class="text-2xl font-bold text-amber-700">⭐ {{ authStore.user?.reputation ?? 0 }}</div>
          <div class="text-xs text-stone-500">Репутация</div>
        </div>
      </div>
    </div>

    <!-- Ошибка -->
    <div v-if="sessionStore.error" class="mb-6 bg-red-100 border border-red-300 rounded-xl p-3">
      <p class="text-red-700 text-sm text-center">{{ sessionStore.error }}</p>
    </div>

    <!-- Действия -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
      <button
        @click="handleCreate"
        :disabled="sessionStore.isLoading"
        class="group bg-gradient-to-br from-amber-600 to-amber-800 text-white rounded-2xl p-8 text-left shadow-lg hover:shadow-xl transition disabled:opacity-50"
      >
        <div class="text-5xl mb-4">🎲</div>
        <div class="text-2xl font-bold mb-2">Создать игру</div>
        <div class="text-amber-100/90">Открой комнату и позови друзей по коду</div>
      </button>

      <button
        @click="handleJoin"
        :disabled="sessionStore.isLoading"
        class="group bg-white text-stone-800 rounded-2xl p-8 text-left shadow-lg hover:shadow-xl transition border border-stone-200 disabled:opacity-50"
      >
        <div class="text-5xl mb-4">🤝</div>
        <div class="text-2xl font-bold mb-2">Присоединиться</div>
        <div class="text-stone-500">Введи код комнаты от друга</div>
      </button>
    </div>

    <!-- Правила -->
    <div class="bg-white rounded-2xl shadow-md p-8">
      <h2 class="text-2xl font-serif font-bold text-stone-800 mb-4">Как играть</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <div class="text-3xl mb-2">🌾</div>
          <div class="font-bold mb-1">Выбери специализацию</div>
          <p class="text-stone-600 text-sm">Земледелец, винодел, ремесленник или животновод — у каждого своя сила и слабость.</p>
        </div>
        <div>
          <div class="text-3xl mb-2">🤝</div>
          <div class="font-bold mb-1">Договаривайся</div>
          <p class="text-stone-600 text-sm">Заключай контракты на поставку. Но помни: нарушить можно — цена — репутация.</p>
        </div>
        <div>
          <div class="text-3xl mb-2">🏆</div>
          <div class="font-bold mb-1">Побеждай по влиянию</div>
          <p class="text-stone-600 text-sm">Деньги, репутация и выполненные контракты — вот что делает тебя доном.</p>
        </div>
      </div>
    </div>

    <!-- Гость -->
    <div v-if="!authStore.isAuthenticated" class="mt-8 text-center">
      <p class="text-stone-600 mb-4">Чтобы создать или присоединиться к игре, войди в аккаунт.</p>
      <NuxtLink to="/auth/login" class="inline-block px-6 py-3 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-xl transition">
        Войти
      </NuxtLink>
    </div>

    <!-- Модалка ввода кода -->
    <div v-if="showJoinModal" class="fixed inset-0 z-50 flex items-center justify-center">
      <div class="absolute inset-0 bg-black/50" @click="showJoinModal = false" />
      <div class="relative bg-white rounded-2xl p-8 w-full max-w-sm mx-4 shadow-2xl">
        <h3 class="text-xl font-bold text-stone-800 mb-4">Код комнаты</h3>
        <input
          v-model="roomCode"
          type="text"
          maxlength="4"
          class="w-full px-4 py-3 border border-stone-300 rounded-xl text-center text-3xl font-mono tracking-[0.5em] uppercase focus:outline-none focus:border-amber-500"
          placeholder="ABCD"
          @input="roomCode = roomCode.toUpperCase()"
        />
        <div class="flex gap-3 mt-6">
          <button
            @click="showJoinModal = false"
            class="flex-1 py-3 bg-stone-200 rounded-xl font-semibold text-stone-700 hover:bg-stone-300 transition"
          >
            Отмена
          </button>
          <button
            @click="confirmJoin"
            :disabled="roomCode.length < 4 || sessionStore.isLoading"
            class="flex-1 py-3 bg-amber-600 text-white rounded-xl font-bold hover:bg-amber-500 transition disabled:opacity-50"
          >
            {{ sessionStore.isLoading ? '...' : 'Войти' }}
          </button>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'
import { useSessionStore } from '~/stores/session'

const authStore = useAuthStore()
const sessionStore = useSessionStore()
const router = useRouter()

const showJoinModal = ref(false)
const roomCode = ref('')

const handleCreate = async () => {
  if (!authStore.isAuthenticated || !authStore.user?.id) {
    router.push('/auth/login')
    return
  }
  const result = await sessionStore.createSession(authStore.user.id)
  if (result.success && result.code) {
    await router.push(`/lobby/${result.code}`)
  }
}

const handleJoin = () => {
  if (!authStore.isAuthenticated || !authStore.user?.id) {
    router.push('/auth/login')
    return
  }
  showJoinModal.value = true
}

const confirmJoin = async () => {
  if (!authStore.user?.id) return
  const result = await sessionStore.joinSession(authStore.user.id, roomCode.value)
  if (result.success && result.code) {
    showJoinModal.value = false
    await router.push(`/lobby/${result.code}`)
  }
}
</script>