<template>
  <div v-if="st && st.phase !== 'NONE'" class="pointer-events-auto w-[22rem] max-w-[92vw]" @click.stop @contextmenu.stop>
    <!-- голосование -->
    <div
      v-if="st.phase === 'VOTING' && st.event"
      class="rounded-2xl border-2 shadow-2xl backdrop-blur bg-stone-900/90 text-amber-50 overflow-hidden"
      :class="st.event.good ? 'border-lime-400/70' : 'border-red-500/70'"
    >
      <div class="px-4 pt-3 pb-2 flex items-start gap-3">
        <div class="text-4xl leading-none">{{ st.event.emoji }}</div>
        <div class="flex-1 min-w-0">
          <div class="text-[11px] uppercase tracking-wide font-semibold" :class="st.event.good ? 'text-lime-300' : 'text-red-300'">
            ⚖️ Совет семей · {{ st.event.good ? 'награда' : 'беда' }}
          </div>
          <div class="font-serif font-bold text-lg leading-tight">{{ st.event.title }}</div>
          <div class="text-xs text-amber-100/70 mt-0.5">{{ st.event.description }}</div>
        </div>
        <div class="text-right">
          <div class="text-xl font-bold tabular-nums" :class="votingLeft <= 10 ? 'text-red-300' : 'text-amber-300'">
            {{ votingLeft }}
          </div>
          <div class="text-[10px] text-amber-100/50">сек</div>
        </div>
      </div>

      <div class="h-1 bg-white/10">
        <div class="h-full bg-amber-400 transition-all duration-500 ease-linear" :style="{ width: votingPct + '%' }" />
      </div>

      <div class="px-3 py-2">
        <div class="text-xs text-amber-100/70 mb-1.5">
          {{ st.event.good ? 'Кому достанется? Выберите ник:' : 'На чью ферму обрушить? Выберите ник:' }}
        </div>
        <div class="grid grid-cols-2 gap-1.5">
          <button
            v-for="c in st.candidates"
            :key="c.userId"
            :disabled="busy"
            @click="onVote(c.userId)"
            class="px-2 py-1.5 rounded-lg text-sm font-semibold border truncate transition disabled:opacity-60"
            :class="st.myVote === c.userId
              ? 'bg-amber-500 text-stone-900 border-amber-300'
              : 'bg-white/5 text-amber-50 border-white/15 hover:bg-white/15'"
          >
            <span v-if="st.myVote === c.userId">✔ </span>{{ c.nickName }}
          </button>
        </div>
        <div class="mt-1.5 text-[11px] text-amber-100/50">
          Голоса тайные до конца раунда. Свой голос можно менять.
          <span v-if="store.error" class="text-red-300"> · {{ store.error }}</span>
        </div>
      </div>
    </div>

    <!-- итог -->
    <div
      v-else-if="showResult && st.result"
      class="rounded-2xl border-2 shadow-2xl backdrop-blur bg-stone-900/90 text-amber-50 overflow-hidden"
      :class="st.result.skipped ? 'border-stone-500/60' : st.result.event.good ? 'border-lime-400/70' : 'border-red-500/70'"
    >
      <div class="px-4 py-3 flex items-start gap-3">
        <div class="text-4xl leading-none">{{ st.result.event.emoji }}</div>
        <div class="flex-1 min-w-0">
          <div class="text-[11px] uppercase tracking-wide font-semibold text-amber-200/70">
            ⚖️ Итог совета · {{ st.result.event.title }}
          </div>
          <div class="text-sm font-semibold mt-0.5">
            <template v-if="st.result.targetNick">
              Выбран: <span class="text-amber-300">{{ st.result.targetNick }}</span>
              <span v-if="st.result.targetUserId === userId" class="text-amber-300"> (это вы!)</span>
            </template>
          </div>
          <div class="text-xs text-amber-100/80 mt-0.5">{{ st.result.text }}</div>
          <div v-if="st.result.tally.length" class="mt-1.5 flex flex-wrap gap-1">
            <span
              v-for="t in st.result.tally"
              :key="t.userId"
              class="px-1.5 py-0.5 rounded bg-white/10 text-[11px]"
            >
              {{ t.nickName }}: {{ t.votes }}
            </span>
          </div>
        </div>
        <button @click="hideResultNow" class="text-amber-100/50 hover:text-white text-xl leading-none">×</button>
      </div>
    </div>

    <!-- ожидание следующего совета -->
    <div
      v-else-if="untilStart > 0"
      class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-stone-900/70 backdrop-blur text-amber-100/80 text-xs border border-white/10"
    >
      ⚖️ Совет семей через <b class="tabular-nums text-amber-300">{{ fmt(untilStart) }}</b>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useCouncilStore } from '~/stores/council'

const props = defineProps<{ code: string; userId: number }>()

const store = useCouncilStore()
const st = computed(() => store.current)

const now = ref(Date.now())
const busy = ref(false)
const RESULT_SHOW_MS = 20000

// время сервера в мс
const t = computed(() => now.value + store.offsetMs)

const votingLeft = computed(() =>
  st.value?.endsAt ? Math.max(0, Math.ceil((st.value.endsAt - t.value) / 1000)) : 0
)
const votingPct = computed(() => {
  const s = st.value
  if (!s?.startsAt || !s.endsAt) return 0
  return Math.min(100, Math.max(0, ((t.value - s.startsAt) / (s.endsAt - s.startsAt)) * 100))
})
const untilStart = computed(() =>
  st.value?.startsAt ? Math.max(0, Math.ceil((st.value.startsAt - t.value) / 1000)) : 0
)
const fmt = (sec: number) => `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, '0')}`

/* итог показываем RESULT_SHOW_MS от первого получения (или пока не закроют) */
const resultSeenAt = ref(0)
const resultHiddenRound = ref(-1)
watch(
  () => (st.value?.phase === 'RESULT' ? st.value.roundNo : -1),
  (round) => { if (round >= 0) resultSeenAt.value = Date.now() },
  { immediate: true }
)
const showResult = computed(
  () =>
    st.value?.phase === 'RESULT' &&
    resultHiddenRound.value !== st.value.roundNo &&
    now.value - resultSeenAt.value < RESULT_SHOW_MS
)
const hideResultNow = () => {
  if (st.value) resultHiddenRound.value = st.value.roundNo
}

const onVote = async (targetId: number) => {
  if (busy.value) return
  busy.value = true
  try {
    await store.vote(props.code, props.userId, targetId)
  } finally {
    busy.value = false
  }
}

/* на границах фаз просим у сервера свежее состояние (он же и закрывает раунд) */
let lastReload = 0
const tick = () => {
  now.value = Date.now()
  const s = st.value
  if (!s) return
  const due =
    (s.phase === 'VOTING' && s.endsAt && t.value >= s.endsAt + 400) ||
    (s.phase === 'SCHEDULED' && s.startsAt && t.value >= s.startsAt + 300) ||
    (s.phase === 'RESULT' && s.startsAt && t.value >= s.startsAt + 300)
  if (due && Date.now() - lastReload > 2500) {
    lastReload = Date.now()
    store.load(props.code, props.userId)
  }
}

let timer: ReturnType<typeof setInterval> | null = null
onMounted(() => {
  store.load(props.code, props.userId)
  timer = setInterval(tick, 500)
})
onBeforeUnmount(() => { if (timer) clearInterval(timer) })
</script>