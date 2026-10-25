<template>
  <div
    class="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
    @click.self="$emit('close')"
  >
    <div class="bg-stone-50 rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden">
      <!-- шапка -->
      <div class="shrink-0 px-5 pt-4 pb-3 border-b border-stone-200">
        <div class="flex items-start justify-between gap-3">
          <div class="min-w-0">
            <h2 class="text-2xl font-serif font-bold text-stone-800">🧪 Исследования</h2>
            <p class="text-xs text-stone-500">
              {{ regionLabel }} · исследуйте продукты — вместе с ними откроются здания и рецепты
            </p>
          </div>
          <button @click="$emit('close')" class="text-stone-500 hover:text-stone-800 text-2xl leading-none">×</button>
        </div>

        <div class="mt-3 flex items-center gap-3">
          <div class="flex-1 h-2 rounded-full bg-stone-200 overflow-hidden">
            <div
              class="h-full bg-gradient-to-r from-lime-400 to-lime-600 transition-all"
              :style="{ width: totalPct + '%' }"
            />
          </div>
          <span class="text-xs font-semibold text-stone-600 whitespace-nowrap">
            Открыто {{ totalDone }} из {{ nodes.length }}
          </span>
        </div>
      </div>

      <!-- вкладки этапов -->
      <div class="shrink-0 px-5 pt-3 pb-1 flex gap-2 overflow-x-auto overflow-y-hidden">
        <button
          v-for="s in stageList"
          :key="s"
          @click="activeStage = s"
          class="relative shrink-0 min-w-[110px] px-4 py-2 mt-1 rounded-xl text-sm font-semibold transition text-left"
          :class="activeStage === s
            ? 'bg-amber-500 text-stone-900'
            : 'bg-stone-200 text-stone-600 hover:bg-stone-300'"
        >
          <div class="whitespace-nowrap">{{ stageName(s) }}</div>
          <div class="text-[11px] font-normal opacity-80 whitespace-nowrap">
            {{ stageStats(s).done }}/{{ stageStats(s).total }} открыто
          </div>
          <span
            v-if="stageStats(s).ready > 0"
            class="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-lime-500 text-white text-[10px] font-bold flex items-center justify-center"
            :title="'Можно исследовать: ' + stageStats(s).ready"
          >
            {{ stageStats(s).ready }}
          </span>
        </button>
      </div>

      <!-- фильтры -->
      <div class="shrink-0 px-5 pt-3 pb-1 flex flex-wrap items-center gap-2">
        <button
          v-for="f in filters"
          :key="f.key"
          @click="filter = f.key"
          class="px-3 py-1 rounded-full text-xs font-semibold border transition"
          :class="filter === f.key
            ? 'bg-stone-800 text-amber-50 border-stone-800'
            : 'bg-white text-stone-600 border-stone-300 hover:border-stone-400'"
        >
          {{ f.label }}
        </button>
        <span class="text-xs text-stone-400 ml-auto">{{ stageHint }}</span>
      </div>

      <!-- карточки -->
      <div class="min-h-0 flex-1 p-5 pt-3 overflow-y-auto space-y-3">
        <p v-if="store.error" class="bg-red-100 border border-red-300 text-red-700 text-sm rounded-xl p-2">
          {{ store.error }}
        </p>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div
            v-for="n in visible"
            :key="n.code"
            class="rounded-xl border-2 bg-white p-3 flex flex-col"
            :class="statusOf(n) === 'done'
              ? 'border-lime-400'
              : statusOf(n) === 'ready'
                ? 'border-amber-400 shadow-md'
                : 'border-stone-200'"
          >
            <!-- заголовок -->
            <div class="flex items-start gap-3">
              <div class="text-4xl leading-none">{{ emojiOf(n) }}</div>
              <div class="min-w-0 flex-1">
                <div class="flex items-start justify-between gap-2">
                  <div class="font-semibold text-stone-800 leading-tight">{{ n.title }}</div>
                  <span
                    class="text-[11px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap"
                    :class="statusOf(n) === 'done'
                      ? 'bg-lime-100 text-lime-700'
                      : statusOf(n) === 'ready'
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-stone-100 text-stone-500'"
                  >
                    {{ statusOf(n) === 'done' ? 'Открыто' : statusOf(n) === 'ready' ? 'Можно исследовать' : 'Закрыто' }}
                  </span>
                </div>
                <div v-if="n.factoryTitle && n.factoryCode !== n.outputCode" class="text-xs text-stone-500 mt-0.5">
                  Производится в: 🏭 {{ n.factoryTitle }}
                </div>
              </div>
            </div>

            <!-- что откроется -->
            <div
              v-for="f in opensOf(n)"
              :key="f.code"
              class="mt-2 flex items-center gap-2 rounded-lg bg-amber-50 border border-amber-200 px-2 py-1.5 text-xs text-amber-900"
            >
              <span class="text-base">{{ f.kind === 'CROP' ? '🌱' : '🏗️' }}</span>
              <span>
                {{ n.unlocked ? 'Открыто' : 'Откроет' }}
                {{ f.kind === 'CROP' ? 'культуру' : 'здание' }}:
                <b>{{ f.title }}</b>
              </span>
            </div>

            <!-- рецепты -->
            <div v-if="n.unlocksRecipes.length" class="mt-2 space-y-1.5">
              <div class="text-[11px] font-semibold uppercase tracking-wide text-stone-400">Рецепт</div>
              <div
                v-for="(r, i) in n.unlocksRecipes"
                :key="r.factoryCode + ':' + r.outputCode + ':' + i"
                class="rounded-lg bg-stone-50 border border-stone-200 px-2 py-1.5"
              >
                <div class="text-sm font-semibold text-stone-700">
                  {{ productEmoji(r.outputCode) }} {{ r.outputTitle }}
                  <span v-if="r.outputQty > 1" class="text-stone-500">×{{ r.outputQty }}</span>
                  <span class="text-xs font-normal text-stone-400"> · ⏱ {{ fmtDuration(r.productionTime) }}</span>
                </div>
                <div v-if="r.inputs.length" class="mt-1 flex flex-wrap gap-1">
                  <span
                    v-for="(ing, j) in r.inputs"
                    :key="ing.code + j"
                    class="inline-flex items-center gap-1 rounded-md border px-1.5 py-0.5 text-[11px]"
                    :class="have(ing.code) >= ing.qty
                      ? 'border-lime-300 bg-lime-50 text-lime-800'
                      : 'border-stone-300 bg-white text-stone-600'"
                    :title="have(ing.code) >= ing.qty ? 'Есть на складе' : 'Пока не хватает — возможно, придётся обменять у других игроков'"
                  >
                    {{ productEmoji(ing.code) }} {{ ing.title }} ×{{ ing.qty }}
                  </span>
                </div>
                <div v-else class="text-[11px] text-stone-500 mt-0.5">Ингредиенты не нужны</div>
              </div>
            </div>

            <!-- требования -->
            <div v-if="n.requires.length" class="mt-2">
              <div class="text-[11px] font-semibold uppercase tracking-wide text-stone-400">Сначала изучите</div>
              <div class="mt-1 flex flex-wrap gap-1">
                <span
                  v-for="c in n.requires"
                  :key="c"
                  class="inline-flex items-center gap-1 rounded-md border px-1.5 py-0.5 text-[11px]"
                  :class="isDone(c)
                    ? 'border-lime-300 bg-lime-50 text-lime-800'
                    : 'border-red-300 bg-red-50 text-red-700'"
                >
                  {{ isDone(c) ? '✓' : '✕' }} {{ titleOf(c) }}
                </span>
              </div>
            </div>

            <!-- стоимость -->
            <div v-if="!n.unlocked" class="mt-2">
              <div class="text-[11px] font-semibold uppercase tracking-wide text-stone-400">Стоимость</div>
              <div class="mt-1 flex flex-wrap gap-1">
                <span v-if="n.cost.length === 0" class="text-xs text-lime-700 font-semibold">Бесплатно</span>
                <span
                  v-for="c in n.cost"
                  :key="c.code"
                  class="inline-flex items-center gap-1 rounded-md border px-1.5 py-0.5 text-[11px]"
                  :class="have(c.code) >= c.qty
                    ? 'border-lime-300 bg-lime-50 text-lime-800'
                    : 'border-red-300 bg-red-50 text-red-700'"
                >
                  {{ productEmoji(c.code) }} {{ c.title || 'ресурс' }}
                  <b>{{ have(c.code) }}/{{ c.qty }}</b>
                </span>
              </div>
            </div>

            <!-- действие -->
            <div class="mt-3 pt-2 border-t border-stone-100 flex items-center justify-between gap-3 mt-auto">
              <p class="text-[11px] text-stone-500 leading-snug min-w-0">
                <template v-if="statusOf(n) === 'ready' && !store.canAfford(n)">
                  Не хватает: {{ missingCost(n).join(', ') }}
                </template>
                <template v-else-if="statusOf(n) === 'locked'">
                  Нужно изучить: {{ missingRequires(n).join(', ') }}
                </template>
              </p>
              <button
                v-if="!n.unlocked"
                :disabled="!n.available || !store.canAfford(n) || store.isLoading"
                @click="open(n.code)"
                class="shrink-0 px-3 py-1.5 rounded-xl text-sm font-semibold bg-amber-500 hover:bg-amber-400 text-stone-900 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Исследовать
              </button>
              <span v-else class="shrink-0 text-xs font-semibold text-lime-700">✓ Изучено</span>
            </div>
          </div>
        </div>

        <p v-if="!store.isLoading && nodes.length > 0 && visible.length === 0" class="text-stone-500 text-center py-8">
          На этом этапе нет исследований с таким фильтром.
        </p>
        <p v-if="!store.isLoading && store.tree && nodes.length === 0" class="text-stone-500 text-center py-8">
          Для вашего региона пока нет исследований.
        </p>
        <p v-if="store.isLoading && nodes.length === 0" class="text-stone-500 text-center py-8">Загрузка…</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useResearchStore, type ResearchNode } from '~/stores/research'
import { useCatalogStore } from '~/stores/catalog'
import { useAuthStore } from '~/stores/auth'
import { productEmoji, fmtDuration } from '~/utils/productLook'

const props = defineProps<{ code: string }>()
defineEmits<{ (e: 'close'): void }>()

const store = useResearchStore()
const catalog = useCatalogStore()
const auth = useAuthStore()

onMounted(() => { catalog.load() })

type Status = 'done' | 'ready' | 'locked'
type FilterKey = 'all' | 'ready' | 'done' | 'locked'

const nodes = computed<ResearchNode[]>(() => store.tree?.nodes ?? [])
const nodeByCode = computed(() => new Map(nodes.value.map(n => [n.code, n])))

const have = (c: string): number => store.tree?.storage?.[c] ?? 0
const titleOf = (c: string) => nodeByCode.value.get(c)?.title ?? 'другое исследование'
const isDone = (c: string) => !!nodeByCode.value.get(c)?.unlocked

const statusOf = (n: ResearchNode): Status =>
  n.unlocked ? 'done' : n.available ? 'ready' : 'locked'

const emojiOf = (n: ResearchNode) => productEmoji(n.outputCode ?? n.factoryCode ?? '')

// что открывает это исследование (здание или культуру) — берём из каталога
const opensOf = (n: ResearchNode) =>
  catalog.factories.filter(f => f.requiredResearch === n.code)

const missingRequires = (n: ResearchNode) =>
  n.requires.filter(c => !isDone(c)).map(titleOf)

const missingCost = (n: ResearchNode) =>
  n.cost
    .filter(c => have(c.code) < c.qty)
    .map(c => `${c.title || 'ресурс'} (${have(c.code)}/${c.qty})`)

/* ---------- этапы ---------- */
const stageList = computed(() =>
  [...new Set(nodes.value.map(n => n.stage))].sort((a, b) => a - b)
)

const stageStats = (s: number) => {
  const list = nodes.value.filter(n => n.stage === s)
  return {
    total: list.length,
    done: list.filter(n => n.unlocked).length,
    ready: list.filter(n => n.available).length
  }
}

const stageName = (s: number) => (s === 1 ? 'Этап 1 · Культуры' : `Этап ${s}`)

const totalDone = computed(() => nodes.value.filter(n => n.unlocked).length)
const totalPct = computed(() =>
  nodes.value.length ? Math.round((totalDone.value / nodes.value.length) * 100) : 0
)

const activeStage = ref<number | null>(null)
watch(
  stageList,
  (list) => {
    if (!list.length) return
    if (activeStage.value == null || !list.includes(activeStage.value)) {
      activeStage.value = list.find(s => stageStats(s).ready > 0) ?? list[0]
    }
  },
  { immediate: true }
)

const stageHint = computed(() => {
  const s = activeStage.value
  if (s == null) return ''
  if (s === 1) return 'Культуры растут на грядках и нужны для исследований этапа 2'
  if (s === 2) return 'Первые продукты: открывают здания'
  return `Требует изученных исследований этапа ${s - 1}. Часть ингредиентов придётся получать у других игроков`
})

/* ---------- фильтры ---------- */
const filters: { key: FilterKey; label: string }[] = [
  { key: 'all', label: 'Все' },
  { key: 'ready', label: '✨ Можно исследовать' },
  { key: 'done', label: '✓ Открыто' },
  { key: 'locked', label: '🔒 Закрыто' }
]
const filter = ref<FilterKey>('all')

const rank = (n: ResearchNode) => (n.available ? 0 : n.unlocked ? 2 : 1)

const visible = computed(() =>
  nodes.value
    .filter(n => n.stage === activeStage.value)
    .filter(n => filter.value === 'all' || statusOf(n) === filter.value)
    .slice()
    .sort((a, b) => rank(a) - rank(b))
)

const regionLabel = computed(() => {
  const map: Record<string, string> = {
    ITALY: '🇮🇹 Италия',
    JAPAN: '🇯🇵 Япония',
    EGYPT: '🇪🇬 Египет',
    BRAZIL: '🇧🇷 Бразилия'
  }
  return map[store.region] ?? store.region ?? ''
})

async function open(code: string) {
  const userId = auth.user?.id
  if (!userId) return
  await store.open(props.code, userId, code) // ошибка попадёт в store.error
}
</script>