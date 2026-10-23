<template>
  <div class="min-h-screen bg-gradient-to-br from-stone-900 via-stone-800 to-amber-950 relative overflow-hidden">
    <div class="absolute inset-0 opacity-[0.07] pointer-events-none"
         style="background-image: radial-gradient(#f5efe0 1px, transparent 1px); background-size: 18px 18px;" />
    <div class="absolute -top-40 -left-40 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
    <div class="absolute -bottom-40 -right-40 w-96 h-96 bg-amber-700/10 rounded-full blur-3xl pointer-events-none" />

    <div class="relative z-10 max-w-3xl mx-auto px-4 py-12">
      <div class="text-center mb-10">
        <div class="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 mb-4">
          <span class="text-3xl">🎩</span>
        </div>
        <h1 class="text-4xl font-serif font-bold text-amber-50 mb-2">Лобби</h1>
        <p class="text-amber-200/70">Пригласи друзей по коду</p>
      </div>

      <!-- Код -->
      <div class="bg-stone-900/70 backdrop-blur rounded-2xl p-8 shadow-2xl border border-amber-900/40 mb-6">
        <div class="text-center">
          <div class="text-amber-200/70 text-sm uppercase tracking-widest mb-2">Код комнаты</div>
          <div class="text-6xl font-mono font-bold tracking-[0.3em] text-amber-400 mb-4">{{ code }}</div>
          <button @click="copyCode"
                  class="px-5 py-2 bg-amber-600 hover:bg-amber-500 text-stone-900 rounded-xl font-semibold transition text-sm">
            {{ copied ? '✓ Скопировано' : '📋 Скопировать код' }}
          </button>
        </div>
      </div>

      <!-- Игроки -->
      <div class="bg-stone-900/70 backdrop-blur rounded-2xl p-6 shadow-2xl border border-amber-900/40 mb-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-bold text-amber-100">Игроки</h2>
          <span class="text-amber-300 font-mono">{{ players.length }} / 6</span>
        </div>

        <div class="space-y-3">
          <div v-for="p in players" :key="p.userId"
               class="flex items-center justify-between bg-stone-800/60 rounded-xl px-4 py-3 border border-amber-800/30">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300 font-bold">
                {{ p.nickName?.[0]?.toUpperCase() ?? '?' }}
              </div>
              <div>
                <div class="text-amber-50 font-semibold">{{ p.nickName }}</div>
                <div class="text-xs text-amber-300/70">
                  <span v-if="p.userId === authStore.user?.id">Вы</span>
                  <span v-else>Игрок</span>
                  <span v-if="p.isHost" class="ml-2 px-2 py-0.5 bg-amber-500/20 text-amber-300 rounded text-[10px] uppercase tracking-wider">Хост</span>
                </div>
              </div>
            </div>
            <span v-if="p.isReady === true"
                  class="px-3 py-1 bg-green-900/40 text-green-300 rounded-lg text-xs font-semibold border border-green-700/40">
              Готов
            </span>
            <span v-else
                  class="px-3 py-1 bg-stone-700/40 text-stone-400 rounded-lg text-xs font-semibold border border-stone-600/40">
              Не готов
            </span>
          </div>

          <div v-for="n in Math.max(0, 6 - players.length)" :key="'e' + n"
               class="flex items-center justify-between bg-stone-800/20 rounded-xl px-4 py-3 border border-dashed border-stone-700/40">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-full bg-stone-800/50 border border-dashed border-stone-700 flex items-center justify-center text-stone-600">+</div>
              <div class="text-stone-500 italic">Ожидание игрока…</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Параметры -->
      <div class="bg-stone-900/70 backdrop-blur rounded-2xl p-6 shadow-2xl border border-amber-900/40 mb-6">
        <h2 class="text-xl font-bold text-amber-100 mb-4">Параметры партии</h2>
        <div class="grid grid-cols-2 gap-4 text-sm">
          <div>
            <div class="text-amber-200/60">Длительность раунда</div>
            <div class="text-amber-50 font-semibold">
              {{ Math.round((sessionStore.current?.roundDurationSeconds ?? 600) / 60) }} мин
            </div>
          </div>
          <div>
            <div class="text-amber-200/60">Цель по очкам</div>
            <div class="text-amber-50 font-semibold">{{ sessionStore.current?.scoreMax ?? 100 }}</div>
          </div>
        </div>
      </div>

      <!-- Ошибка -->
      <div v-if="sessionStore.error" class="mb-4 bg-red-900/40 border border-red-700/50 rounded-xl p-3">
        <p class="text-red-200 text-sm text-center">{{ sessionStore.error }}</p>
      </div>

      <!-- Кнопки -->
      <div class="flex gap-3">
        <button @click="leave"
                class="flex-1 py-3 bg-stone-800 hover:bg-stone-700 text-amber-100 rounded-xl font-semibold border border-stone-700 transition">
          Выйти
        </button>

        <!-- Готовность доступна всем, включая хоста -->
        <button @click="toggleReady"
                :disabled="sessionStore.isLoading"
                class="flex-1 py-3 rounded-xl font-bold transition disabled:opacity-50"
                :class="myReady
                  ? 'bg-stone-700 text-amber-100 hover:bg-stone-600'
                  : 'bg-green-600 hover:bg-green-500 text-white'">
          {{ myReady ? 'Отменить готовность' : 'Я готов' }}
        </button>

        <!-- Старт доступен только хосту -->
        <button v-if="isHost" @click="handleStart"
                :disabled="!canStart || sessionStore.isLoading"
                class="flex-1 py-3 bg-amber-500 hover:bg-amber-400 text-stone-900 rounded-xl font-bold transition disabled:opacity-50">
          {{ startLabel }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Client } from '@stomp/stompjs'
import { useAuthStore } from '~/stores/auth'
import { useSessionStore } from '~/stores/session'

definePageMeta({ layout: false })

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const sessionStore = useSessionStore()

const code = computed(() => String(route.params.code || '').toUpperCase())
const copied = ref(false)

const players = computed(() => sessionStore.current?.players ?? [])

const me = computed(() => players.value.find(p => p.userId === authStore.user?.id) ?? null)
const isHost = computed(() => me.value?.isHost === true)
const myReady = computed(() => me.value?.isReady === true)

const canStart = computed(() =>
  isHost.value &&
  players.value.length >= 2 &&
  players.value.every(p => p.isReady === true)
)

const startLabel = computed(() => {
  if (players.value.length < 2) return 'Нужно ≥ 2 игроков'
  if (!players.value.every(p => p.isReady === true)) return 'Ждём готовности всех'
  return 'Начать игру'
})

// realtime-лобби через STOMP (RabbitMQ)
let client: Client | null = null

onMounted(() => {
  const userId = authStore.user?.id
  if (!userId) return

  const proto = location.protocol === 'https:' ? 'wss' : 'ws'
  client = new Client({
    brokerURL: `${proto}://${location.host}/ws`,
    reconnectDelay: 3000,
    onConnect: async () => {
      // сначала подписка, потом вход в комнату — чтобы не пропустить события
      client!.subscribe(`/topic/lobby.${code.value}`, (msg) => {
        sessionStore.applyLobbyState(JSON.parse(msg.body))
      })
      // вход + актуальное состояние (срабатывает и после переподключения)
      await sessionStore.joinSession(userId, code.value)
    }
  })
  client.activate()
})

onUnmounted(() => {
  client?.deactivate()
  client = null
})

// если статус стал IN_PROCESS — переход в игру
watch(() => sessionStore.current?.status, (status) => {
  if (status === 'IN_PROCESS') {
    router.push(`/game/${code.value}`)
  }
}, { immediate: true })

const copyCode = async () => {
  try {
    await navigator.clipboard.writeText(code.value)
    copied.value = true
    setTimeout(() => (copied.value = false), 2000)
  } catch {}
}

const leave = () => {
  sessionStore.leave()
  router.push('/')
}

const toggleReady = async () => {
  if (!authStore.user?.id) return
  await sessionStore.setReady(authStore.user.id, code.value, !myReady.value)
}

const handleStart = async () => {
  if (!authStore.user?.id) return
  const res = await sessionStore.startGame(authStore.user.id, code.value)
  if (res.success) {
    router.push(`/game/${code.value}`)
  }
}
</script>