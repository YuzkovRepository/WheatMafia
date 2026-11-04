<template>
  <div class="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-3">
    <div class="bg-stone-50 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden">
      <!-- шапка -->
      <div class="shrink-0 px-5 py-3 border-b border-stone-200 flex items-center gap-3">
        <div class="text-3xl">🕵️</div>
        <div class="min-w-0 flex-1">
          <h2 class="text-lg font-semibold text-stone-800 leading-tight">
            Ферма игрока
            <span class="text-amber-600">{{ view?.targetNick ?? '…' }}</span>
            <span v-if="view?.region" class="ml-1 text-sm">{{ regionFlag(view.region) }}</span>
          </h2>
          <p class="text-xs text-stone-500">
            Осмотритесь: если у фермы стоит нелегальный скупщик — нажмите на него. Осталось визитов: {{ store.current?.remaining ?? 0 }}
          </p>
        </div>
        <div class="text-right">
          <div class="text-2xl font-bold tabular-nums" :class="left <= 15 ? 'text-red-500' : 'text-stone-800'">{{ left }}</div>
          <div class="text-[10px] text-stone-400">сек</div>
        </div>
        <button
          @click="onLeave"
          class="px-3 py-1.5 rounded-xl bg-stone-200 hover:bg-stone-300 text-sm font-semibold text-stone-700"
        >
          Уйти
        </button>
      </div>

      <div class="h-1 bg-stone-200 shrink-0">
        <div class="h-full bg-amber-500 transition-all duration-500 ease-linear" :style="{ width: pct + '%' }" />
      </div>

      <!-- чужая ферма (только просмотр) -->
      <div class="min-h-0 flex-1 overflow-y-auto bg-stone-800 relative">
        <FarmBoard
          v-if="view?.board"
          :board="view.board"
          :cell-px="40"
          :buyer="buyerView"
          @buyer-click="onBuyer"
        />
        <div v-else class="py-16 text-center text-stone-300 text-sm">Загрузка фермы…</div>

        <!-- подсказка и результат -->
        <div class="absolute left-3 bottom-3 right-3 pointer-events-none flex justify-center">
          <div
            v-if="note"
            class="pointer-events-auto max-w-lg px-4 py-2 rounded-xl text-sm font-semibold shadow-xl border"
            :class="noteGood ? 'bg-lime-100 text-lime-900 border-lime-300' : 'bg-stone-900/90 text-amber-50 border-white/10'"
          >
            {{ note }}
          </div>
          <div
            v-else-if="!view?.buyer"
            class="px-3 py-1.5 rounded-xl bg-stone-900/70 text-amber-100/80 text-xs border border-white/10"
          >
            Пока всё спокойно… скупщика не видно.
          </div>
          <div
            v-else
            class="px-3 py-1.5 rounded-xl bg-red-600/90 text-white text-xs font-semibold border border-red-300/60 animate-pulse"
          >
            🚨 Тут скупщик! Нажмите на него.
          </div>
        </div>
      </div>

      <p v-if="store.error" class="shrink-0 px-5 py-2 text-xs text-red-600 bg-red-50 border-t border-red-100">{{ store.error }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useVisitsStore } from '~/stores/visits'
import { regionFlag } from '~/utils/deputyLook'

const props = defineProps<{ code: string; userId: number }>()
const emit = defineEmits<{ (e: 'close'): void }>()

const store = useVisitsStore()
const view = computed(() => store.view)

const now = ref(Date.now())
const t = computed(() => now.value + store.offsetMs)
const note = ref('')
const noteGood = ref(false)
const done = ref(false)
const busy = ref(false)

const startMs = ref(0)
const left = computed(() => (view.value ? Math.max(0, Math.ceil((view.value.endsAtMs - t.value) / 1000)) : 0))
const pct = computed(() => {
  const v = view.value
  if (!v || !startMs.value) return 0
  const span = v.endsAtMs - startMs.value
  return span > 0 ? Math.min(100, Math.max(0, ((t.value - startMs.value) / span) * 100)) : 100
})

const buyerView = computed(() => {
  const b = view.value?.buyer
  if (!b) return null
  return { summonedAtMs: b.summonedAtMs, arrivesAtMs: b.arrivesAtMs, leavesAtMs: b.leavesAtMs, offsetMs: store.offsetMs }
})

const closeLater = (ms: number) => setTimeout(() => emit('close'), ms)

const onBuyer = async () => {
  const v = view.value
  if (!v || busy.value || done.value) return
  busy.value = true
  try {
    const r = await store.report(props.code, props.userId, v.visitId)
    if (!r) return
    note.value = r.message
    noteGood.value = r.found
    if (r.found) {
      done.value = true
      closeLater(4500)
    }
  } finally {
    busy.value = false
  }
}

const onLeave = async () => {
  const v = view.value
  if (v && !done.value) await store.leave(props.code, props.userId, v.visitId)
  emit('close')
}

let poll: ReturnType<typeof setInterval> | null = null
let tick: ReturnType<typeof setInterval> | null = null

onMounted(async () => {
  const v = await store.loadView(props.code, props.userId)
  if (!v) { emit('close'); return }
  startMs.value = Date.now() + store.offsetMs

  tick = setInterval(() => { now.value = Date.now() }, 500)
  // ферма и скупщик меняются со временем — подтягиваем свежее
  poll = setInterval(async () => {
    if (done.value) return
    if (left.value <= 0) {
      note.value = 'Время визита вышло.'
      done.value = true
      await store.load(props.code, props.userId)
      closeLater(1500)
      return
    }
    const v2 = await store.loadView(props.code, props.userId)
    if (!v2) {
      // сервер уже закрыл визит
      note.value = 'Визит закончился.'
      done.value = true
      await store.load(props.code, props.userId)
      closeLater(1200)
    }
  }, 3000)
})

onBeforeUnmount(() => {
  if (poll) clearInterval(poll)
  if (tick) clearInterval(tick)
  store.view = null
})
</script>