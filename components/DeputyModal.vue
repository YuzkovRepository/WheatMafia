<template>
  <div
    class="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
    @click.self="emit('close')"
  >
    <div class="bg-stone-50 rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden">
      <div class="flex items-center justify-between px-5 py-4 border-b border-stone-200">
        <div>
          <h2 class="text-2xl font-serif font-bold text-stone-800">🏛️ Депутат</h2>
          <p class="text-xs text-stone-500">
            Депутат заказывает конкретное блюдо каждого этапа. Накормите его по порядку, а затем — золотым экспортом вашей страны.
          </p>
        </div>
        <button @click="emit('close')" class="text-stone-500 hover:text-stone-800 text-2xl leading-none">×</button>
      </div>

      <div class="p-5 overflow-y-auto">
        <p v-if="deputy.error" class="mb-3 bg-red-100 border border-red-300 text-red-700 text-sm rounded-xl p-2">
          {{ deputy.error }}
        </p>

        <div
          v-if="deputy.winner"
          class="mb-4 rounded-xl border-2 border-amber-400 bg-amber-50 px-4 py-3 text-stone-800"
        >
          🏆 Игра окончена. Победил <b>{{ deputy.winner.nickName }}</b>
          <span class="text-stone-500">({{ regionName(deputy.winner.region) }})</span>
        </div>

        <div class="grid gap-5 md:grid-cols-2">
          <!-- ваш депутат -->
          <div>
            <h3 class="text-xs font-semibold uppercase tracking-wide text-stone-400 mb-2">Ваш депутат</h3>

            <template v-if="me">
              <div class="flex items-center gap-3 rounded-xl border-2 border-stone-200 bg-white p-3">
                <img
                  v-if="deputyImgSrc(me.region) && !imgBroken"
                  :src="deputyImgSrc(me.region)"
                  class="w-20 h-20 object-contain"
                  alt=""
                  @error="imgBroken = true"
                />
                <span v-else class="text-5xl">🏛️</span>
                <div class="flex-1 min-w-0">
                  <div class="font-semibold text-stone-800">{{ deputyTitle(me.region) }}</div>
                  <div class="text-xs text-stone-500">{{ regionName(me.region) }}</div>
                  <div class="mt-2 h-2 rounded-full bg-stone-200 overflow-hidden">
                    <div
                      class="h-full bg-gradient-to-r from-lime-400 to-lime-600 transition-all"
                      :style="{ width: pct(me) + '%' }"
                    />
                  </div>
                  <div class="mt-1 text-xs font-semibold text-stone-600">
                    Сдано {{ me.delivered }} из {{ me.total }}
                  </div>
                </div>
              </div>

              <div class="mt-3 space-y-2">
                <div
                  v-for="s in visibleSteps(me.steps)"
                  :key="s.slot"
                  class="rounded-xl border-2 bg-white p-3"
                  :class="s.done ? 'border-lime-400' : 'border-stone-200'"
                >
                  <div class="flex items-center justify-between gap-2">
                    <div class="font-semibold text-stone-800">
                      {{ s.grand ? '👑 Золотой экспорт' : `Этап ${s.stage}` }}
                    </div>
                    <span
                      class="text-[11px] font-bold px-2 py-0.5 rounded-full"
                      :class="s.done ? 'bg-lime-100 text-lime-700' : 'bg-stone-100 text-stone-500'"
                    >
                      {{ s.done ? 'Сдано' : 'Ждёт' }}
                    </span>
                  </div>

                  <!-- карточка заказа: кликабельна → открывает исследования на этом блюде -->
                  <button
                    type="button"
                    class="mt-2 w-full flex items-center gap-3 rounded-xl p-2 -m-2 text-left transition hover:bg-amber-50 focus:outline-none focus:ring-2 focus:ring-amber-300"
                    @click="goToResearch(s)"
                    :title="`Найти «${s.productTitle}» в исследованиях`"
                  >
                    <div
                      class="shrink-0 w-14 h-14 rounded-xl flex items-center justify-center text-3xl shadow-inner"
                      :class="s.done ? 'bg-lime-50 border border-lime-200' : 'bg-amber-50 border border-amber-200'"
                    >
                      {{ productEmoji(s.productCode) }}
                    </div>
                    <div class="min-w-0 flex-1">
                      <div class="text-sm font-semibold text-stone-800 truncate">
                        {{ s.productTitle }}
                      </div>
                      <div v-if="s.done" class="text-[11px] text-stone-500">Блюдо принято</div>
                      <div v-else-if="s.grand" class="text-[11px] text-stone-500">
                        Откроется после блюд всех этапов
                      </div>
                    </div>
                    <span class="text-stone-400 text-lg">🔎</span>
                  </button>

                  <!-- кандидаты на складе -->
                  <div v-if="!s.done" class="mt-3">
                    <div v-if="!s.grand || canGrand" class="flex flex-wrap gap-1.5">
                      <button
                        v-for="c in candidates(s)"
                        :key="c.code"
                        :disabled="feeding || c.code !== s.productCode"
                        @click="feed(c.code)"
                        class="inline-flex items-center gap-1 rounded-lg border px-2 py-1 text-xs font-semibold transition"
                        :class="c.code === s.productCode
                          ? 'border-amber-400 bg-amber-100 hover:bg-amber-200 text-stone-900'
                          : 'border-stone-200 bg-stone-50 text-stone-400 cursor-not-allowed'"
                      >
                        <span class="text-base leading-none">{{ c.emoji }}</span>
                        {{ c.title }} ×{{ c.qty }}
                        <span v-if="c.code === s.productCode">· Сдать</span>
                        <span v-else>· не то</span>
                      </button>
                      <span v-if="candidates(s).length === 0" class="text-xs text-stone-400">
                        На складе нет нужного блюда
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </template>

            <p v-else class="text-sm text-stone-500">
              {{ deputy.isLoading ? 'Загрузка…' : 'Данные депутата пока недоступны.' }}
            </p>
          </div>

          <!-- гонка -->
          <div>
            <h3 class="text-xs font-semibold uppercase tracking-wide text-stone-400 mb-2">Кто сколько сдал</h3>
            <div class="space-y-2">
              <div
                v-for="p in deputy.leaderboard"
                :key="p.userId"
                class="rounded-xl border-2 bg-white p-3"
                :class="p.finished ? 'border-amber-400' : 'border-stone-200'"
              >
                <div class="flex items-center justify-between gap-2">
                  <div class="min-w-0 truncate font-semibold text-stone-800">
                    {{ regionFlag(p.region) }} {{ p.nickName }}
                    <span v-if="p.userId === auth.user?.id" class="text-xs font-normal text-amber-600">(вы)</span>
                    <span v-if="p.finished">🏆</span>
                  </div>
                  <div class="text-sm font-bold text-stone-700">{{ p.delivered }}/{{ p.total }}</div>
                </div>
                <div class="mt-2 h-2 rounded-full bg-stone-200 overflow-hidden">
                  <div
                    class="h-full bg-gradient-to-r from-lime-400 to-lime-600 transition-all"
                    :style="{ width: pct(p) + '%' }"
                  />
                </div>
                <div class="mt-2 flex flex-wrap gap-1">
                  <span
                    v-for="s in visibleSteps(p.steps)"
                    :key="s.slot"
                    class="px-1.5 py-0.5 rounded-md text-[11px] font-semibold border"
                    :class="s.done
                      ? 'border-lime-300 bg-lime-50 text-lime-700'
                      : 'border-stone-200 bg-stone-50 text-stone-400'"
                    :title="s.done ? (s.productTitle ?? '') : 'Ещё не сдано'"
                  >
                    {{ s.grand ? '👑' : s.stage }}
                  </span>
                </div>
              </div>
              <p v-if="deputy.leaderboard.length === 0" class="text-sm text-stone-500">Игроков пока нет.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useDeputyStore, type DeputyPlayer, type DeputyStep } from '~/stores/deputy'
import { useAuthStore } from '~/stores/auth'
import { useStorageStore } from '~/stores/storage'
import { useCatalogStore } from '~/stores/catalog'
import { productEmoji } from '~/utils/productLook'
import { deputyImgSrc, deputyTitle, regionFlag, regionName } from '~/utils/deputyLook'

const props = defineProps<{ code: string }>()
const emit = defineEmits<{
  (e: 'close'): void
  (e: 'open-research', payload: { code: string | null; stage: number }): void
}>()

const deputy = useDeputyStore()
const auth = useAuthStore()
const storage = useStorageStore()
const catalog = useCatalogStore()

const imgBroken = ref(false)
const feeding = ref(false)

onMounted(() => {
  deputy.load(props.code)
  const userId = auth.user?.id
  if (userId) storage.load(props.code, userId)
})

const me = computed<DeputyPlayer | null>(
  () => deputy.current?.players.find(p => p.userId === auth.user?.id) ?? null
)

const pct = (p: DeputyPlayer) => (p.total ? Math.round((p.delivered / p.total) * 100) : 0)

const canGrand = computed(() => !!me.value && me.value.steps.filter(s => !s.grand).every(s => s.done))

/**
 * Отфильтровать «пустые» шаги: если у этапа нет ни одного блюда,
 * сервер присылает productTitle = 'Блюдо' и productCode = null — такой шаг не показываем.
 */
const visibleSteps = (steps: DeputyStep[]): DeputyStep[] =>
  steps.filter(s => {
    if (s.grand) return true
    if (s.done) return true
    return !!s.productCode && s.productTitle && s.productTitle !== 'Блюдо'
  })

const candidates = (step: DeputyStep) => {
  if (!me.value) return []
  return storage.items
    .filter(i => i.qty > 0 && i.code === step.productCode)
    .map(i => ({
      code: i.code,
      qty: i.qty,
      title: catalog.productByCode(i.code)?.title ?? 'Блюдо',
      emoji: productEmoji(i.code)
    }))
}

const feed = async (productCode: string) => {
  const userId = auth.user?.id
  if (!userId || feeding.value) return
  feeding.value = true
  try {
    await deputy.feed(props.code, userId, productCode)
    await storage.load(props.code, userId)
  } finally {
    feeding.value = false
  }
}

/** Перейти к исследованию нужного блюда: родитель откроет ResearchModal с подсветкой. */
const goToResearch = (s: DeputyStep) => {
  emit('open-research', { code: s.productCode, stage: s.stage })
}
</script>