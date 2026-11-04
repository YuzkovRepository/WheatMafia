<template>
  <div
    v-if="visit && pos"
    class="absolute inset-x-0 bottom-0 h-32 z-[5] pointer-events-none overflow-hidden"
  >
    <!-- дорожка к ферме -->
    <div
      class="absolute left-0 bottom-4 h-9 rounded-r-full"
      style="width: 56%; background: linear-gradient(#b8915f, #8f6a3f);
             box-shadow: inset 0 3px 0 rgba(255,255,255,.18), inset 0 -3px 0 rgba(0,0,0,.25);"
    >
      <div
        class="absolute left-0 right-8 top-1/2 h-0.5"
        style="background: repeating-linear-gradient(90deg, rgba(255,255,255,.55) 0 14px, transparent 14px 28px);"
      />
    </div>

    <!-- скупщик на самокате -->
    <button
      class="absolute pointer-events-auto cursor-pointer flex flex-col items-center"
      :style="{ left: left, bottom: '14px', transition: 'left 0.5s linear' }"
      aria-label="Теневой скупщик"
      @click="emit('open')"
    >
      <div
        v-if="!pos.leaving"
        class="mb-1 -translate-x-1/2 px-2 py-0.5 rounded-lg text-[11px] font-bold whitespace-nowrap shadow"
        :class="pos.arriving ? 'bg-stone-900/80 text-amber-100' : 'bg-amber-400 text-stone-900 animate-bounce'"
      >
        {{ label }}
      </div>
      <img
        v-if="!broken"
        src="/object/illegal_buyer.png"
        alt=""
        draggable="false"
        class="w-28 object-contain drop-shadow-xl -translate-x-1/2"
        :class="pos.leaving ? '-scale-x-100' : ''"
        @error="broken = true"
      />
      <span v-else class="text-6xl -translate-x-1/2">🛵</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useBlackMarketStore } from '~/stores/blackMarket'

const emit = defineEmits<{ (e: 'open'): void }>()

const DEPART_MS = 6000 // последние секунды визита скупщик уезжает

const bm = useBlackMarketStore()
const broken = ref(false)

const now = ref(Date.now())
let timer: ReturnType<typeof setInterval> | null = null
onMounted(() => { timer = setInterval(() => (now.value = Date.now()), 500) })
onBeforeUnmount(() => { if (timer) clearInterval(timer) })

const serverNow = computed(() => now.value + bm.offsetMs)

// показываем только свой активный визит (скупщик рисуется на вашей ферме)
const visit = computed(() => {
  const v = bm.current?.mine
  return v && serverNow.value < v.leavesAtMs ? v : null
})

const clamp01 = (x: number) => Math.min(Math.max(x, 0), 1)

const pos = computed(() => {
  const v = visit.value
  if (!v) return null
  const t = serverNow.value
  if (t < v.arrivesAtMs) {
    const p = clamp01((t - v.summonedAtMs) / Math.max(1, v.arrivesAtMs - v.summonedAtMs))
    return { p, arriving: true, leaving: false }
  }
  if (t < v.leavesAtMs - DEPART_MS) return { p: 1, arriving: false, leaving: false }
  return { p: clamp01((v.leavesAtMs - t) / DEPART_MS), arriving: false, leaving: true }
})

// путь: от -14% (за левым краем) до 50% (у передней части поля)
const left = computed(() => `${-14 + (pos.value?.p ?? 0) * 64}%`)

const mmss = (sec: number) => `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, '0')}`

const label = computed(() => {
  const v = visit.value
  const p = pos.value
  if (!v || !p) return ''
  if (p.arriving) return `🛵 едет… ${Math.max(0, Math.ceil((v.arrivesAtMs - serverNow.value) / 1000))}с`
  return `💰 Продаём? ${mmss(Math.max(0, Math.ceil((v.leavesAtMs - DEPART_MS - serverNow.value) / 1000)))}`
})
</script>