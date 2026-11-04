<template>
  <div
    class="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
    @click.self="emit('close')"
  >
    <div class="bg-stone-50 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
      <!-- шапка -->
      <div class="flex items-center gap-4 px-5 py-4 bg-gradient-to-r from-stone-800 to-stone-700 text-amber-50">
        <img
          v-if="!imgBroken"
          src="/object/illegal_buyer.png"
          class="w-20 h-20 object-contain"
          alt=""
          @error="imgBroken = true"
        />
        <span v-else class="text-5xl">🛵</span>
        <div class="flex-1 min-w-0">
          <h2 class="text-xl font-serif font-bold">Теневой скупщик</h2>
          <p class="text-xs text-amber-200/70">
            Берёт нелегальный товар любой страны и платит дорого — но его могут заметить другие игроки
          </p>
        </div>
        <button @click="emit('close')" class="text-amber-100/70 hover:text-white text-2xl leading-none">×</button>
      </div>

      <div class="p-5 overflow-y-auto space-y-4">
        <p v-if="bm.error" class="bg-red-100 border border-red-300 text-red-700 text-sm rounded-xl p-2">
          {{ bm.error }}
        </p>
        <p v-if="flash" class="bg-lime-100 border border-lime-300 text-lime-800 text-sm font-semibold rounded-xl p-2">
          {{ flash }}
        </p>

        <!-- статус -->
        <div class="rounded-xl border-2 border-stone-200 bg-white p-4">
          <!-- нет визита / уехал -->
          <template v-if="phase === 'NONE' || phase === 'LEFT'">
            <div class="font-semibold text-stone-800">Скупщика сейчас нет</div>
            <p class="mt-1 text-xs text-stone-500">
              Вызовите его, когда на складе есть нелегальный товар. Он едет к ферме ~20 секунд, ждёт ~1,5 минуты
              и уезжает. Цена от визита к визиту разная.
            </p>
            <div v-if="phase === 'LEFT' && mine && mine.soldUnits > 0" class="mt-2 text-xs text-stone-600">
              Прошлый визит: продано {{ mine.soldUnits }} шт. на 🪙 {{ fmt(mine.earned) }}
            </div>
            <button
              :disabled="!canSummon || busy"
              @click="summon"
              class="mt-3 px-4 py-2 rounded-xl font-semibold text-sm bg-amber-500 hover:bg-amber-400 text-stone-900 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              🛵 Вызвать скупщика
            </button>
            <p v-if="cooldownLeft > 0" class="mt-2 text-xs text-stone-500">
              Отдыхает, можно вызвать через {{ mmss(cooldownLeft) }}
            </p>
            <p v-else-if="quote.length === 0" class="mt-2 text-xs text-stone-500">
              На складе нет нелегального товара (граппа, самопальное саке, арак, кашаса…).
            </p>
          </template>

          <!-- едет -->
          <template v-else-if="phase === 'ARRIVING'">
            <div class="font-semibold text-stone-800">🛵 Скупщик в пути</div>
            <p class="mt-1 text-xs text-stone-500">Будет через {{ arriveLeft }} с</p>
            <div class="mt-2 h-2 rounded-full bg-stone-200 overflow-hidden">
              <div class="h-full bg-amber-500 transition-all duration-1000 ease-linear"
                   :style="{ width: arrivePct + '%' }" />
            </div>
            <button @click="dismiss" :disabled="busy"
                    class="mt-3 px-3 py-1.5 rounded-xl text-xs font-semibold bg-stone-200 hover:bg-stone-300 text-stone-700 disabled:opacity-50">
              Отменить визит
            </button>
          </template>

          <!-- на месте -->
          <template v-else>
            <div class="flex items-center justify-between gap-3">
              <div>
                <div class="font-semibold text-stone-800">💰 Скупщик на ферме</div>
                <p class="text-xs text-stone-500">
                  Цена сегодня: <b>{{ mine?.pricePct }}%</b> от базовой · уедет через {{ mmss(stayLeft) }}
                </p>
              </div>
              <button @click="dismiss" :disabled="busy"
                      class="px-3 py-1.5 rounded-xl text-xs font-semibold bg-stone-200 hover:bg-stone-300 text-stone-700 disabled:opacity-50">
                Отпустить
              </button>
            </div>
          </template>
        </div>

        <!-- что он купит -->
        <div v-if="quote.length">
          <h3 class="text-xs font-semibold uppercase tracking-wide text-stone-400 mb-2">
            {{ phase === 'PRESENT' ? 'Продать скупщику' : 'Ваш нелегальный товар' }}
          </h3>
          <div class="space-y-2">
            <div
              v-for="q in quote"
              :key="q.code"
              class="flex items-center gap-3 rounded-xl border-2 border-stone-200 bg-white px-3 py-2"
            >
              <span class="text-3xl">{{ productEmoji(q.code) }}</span>
              <div class="flex-1 min-w-0">
                <div class="font-semibold text-stone-800 truncate">{{ q.title }} ×{{ q.qty }}</div>
                <div class="text-xs text-stone-500">
                  🪙 {{ fmt(q.unitPrice) }} за шт. · всего 🪙 {{ fmt(q.total) }}
                  <template v-if="phase !== 'PRESENT'"> (примерно, цена зависит от визита)</template>
                </div>
              </div>
              <button
                v-if="phase === 'PRESENT'"
                :disabled="busy"
                @click="sell(q.code)"
                class="px-3 py-1.5 rounded-xl text-sm font-semibold bg-amber-500 hover:bg-amber-400 text-stone-900 disabled:opacity-40"
              >
                Продать
              </button>
            </div>
          </div>

          <button
            v-if="phase === 'PRESENT'"
            :disabled="busy"
            @click="sell(null)"
            class="mt-3 w-full px-4 py-2.5 rounded-xl font-bold text-sm bg-lime-500 hover:bg-lime-400 text-stone-900 disabled:opacity-40"
          >
            Продать всё · 🪙 {{ fmt(total) }}
          </button>
        </div>

        <!-- другие игроки -->
        <div v-if="others.length">
          <h3 class="text-xs font-semibold uppercase tracking-wide text-stone-400 mb-2">Замечены скупщики</h3>
          <div class="space-y-1.5">
            <div
              v-for="o in others"
              :key="o.userId"
              class="flex items-center justify-between rounded-lg bg-white border border-stone-200 px-3 py-1.5 text-sm"
            >
              <span class="truncate">{{ regionFlag(o.region) }} {{ o.nickName }}</span>
              <span class="text-xs text-stone-500">
                {{ serverNow < o.arrivesAtMs ? 'скупщик едет' : 'скупщик на ферме' }}
              </span>
            </div>
          </div>
        </div>

        <p class="text-[11px] text-stone-400">
          ⚠️ Пока скупщик на ферме, о нём знают все игроки. В будущем это можно будет использовать для санкций.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useBlackMarketStore } from '~/stores/blackMarket'
import { useAuthStore } from '~/stores/auth'
import { useStorageStore } from '~/stores/storage'
import { productEmoji } from '~/utils/productLook'
import { regionFlag } from '~/utils/deputyLook'

const props = defineProps<{ code: string }>()
const emit = defineEmits<{ (e: 'close'): void }>()

const bm = useBlackMarketStore()
const auth = useAuthStore()
const storage = useStorageStore()

const imgBroken = ref(false)
const busy = ref(false)
const flash = ref('')
let flashTimer: ReturnType<typeof setTimeout> | null = null

const now = ref(Date.now())
let timer: ReturnType<typeof setInterval> | null = null
onMounted(() => {
  timer = setInterval(() => (now.value = Date.now()), 1000)
  const userId = auth.user?.id
  if (userId) bm.load(props.code, userId)
})
onBeforeUnmount(() => {
  if (timer) clearInterval(timer)
  if (flashTimer) clearTimeout(flashTimer)
})

const serverNow = computed(() => now.value + bm.offsetMs)
const mine = computed(() => bm.current?.mine ?? null)
const quote = computed(() => bm.current?.quote ?? [])
const total = computed(() => bm.current?.quoteTotal ?? 0)

const phase = computed<'NONE' | 'ARRIVING' | 'PRESENT' | 'LEFT'>(() => {
  const v = mine.value
  if (!v) return 'NONE'
  const t = serverNow.value
  if (t >= v.leavesAtMs) return 'LEFT'
  return t < v.arrivesAtMs ? 'ARRIVING' : 'PRESENT'
})

const cooldownLeft = computed(() =>
  Math.max(0, Math.ceil(((bm.current?.cooldownUntilMs ?? 0) - serverNow.value) / 1000))
)
const canSummon = computed(() =>
  (phase.value === 'NONE' || phase.value === 'LEFT') && cooldownLeft.value === 0 && quote.value.length > 0
)
const arriveLeft = computed(() =>
  Math.max(0, Math.ceil(((mine.value?.arrivesAtMs ?? 0) - serverNow.value) / 1000))
)
const arrivePct = computed(() => {
  const v = mine.value
  if (!v) return 0
  const span = Math.max(1, v.arrivesAtMs - v.summonedAtMs)
  return Math.min(100, Math.max(0, ((serverNow.value - v.summonedAtMs) / span) * 100))
})
const stayLeft = computed(() =>
  Math.max(0, Math.ceil(((mine.value?.leavesAtMs ?? 0) - serverNow.value) / 1000))
)

const others = computed(() => bm.active.filter(a => a.userId !== auth.user?.id))

const fmt = (n: number) => Number(n).toLocaleString('ru-RU')
const mmss = (sec: number) => `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, '0')}`

const showFlash = (text: string) => {
  flash.value = text
  if (flashTimer) clearTimeout(flashTimer)
  flashTimer = setTimeout(() => (flash.value = ''), 4000)
}

const summon = async () => {
  const userId = auth.user?.id
  if (!userId || busy.value) return
  busy.value = true
  try {
    if (await bm.summon(props.code, userId)) showFlash('Скупщик выехал к вашей ферме 🛵')
  } finally {
    busy.value = false
  }
}

const dismiss = async () => {
  const userId = auth.user?.id
  if (!userId || busy.value) return
  busy.value = true
  try {
    await bm.dismiss(props.code, userId)
  } finally {
    busy.value = false
  }
}

const sell = async (productCode: string | null) => {
  const userId = auth.user?.id
  if (!userId || busy.value) return
  busy.value = true
  try {
    const earned = await bm.sell(props.code, userId, productCode, null)
    if (earned != null) {
      showFlash(`Продано! +🪙 ${fmt(earned)}`)
      await storage.load(props.code, userId)
    }
  } finally {
    busy.value = false
  }
}
</script>