<template>
  <div
    class="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4"
    @click.self="$emit('close')"
  >
    <div class="bg-stone-50 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[88vh] flex flex-col overflow-hidden">
      <!-- заголовок -->
      <div class="flex items-center justify-between px-5 py-4 border-b border-stone-200">
        <div>
          <h2 class="text-xl font-semibold text-stone-800">🧪 Исследования</h2>
          <p class="text-xs text-stone-500">
            Регион:
            <b>{{ regionLabel }}</b>
            · открыто {{ unlockedCount }} / {{ totalCount }}
          </p>
        </div>
        <button @click="$emit('close')" class="text-stone-500 hover:text-stone-800 text-2xl leading-none">×</button>
      </div>

      <div class="p-4 overflow-y-auto space-y-5">
        <p v-if="store.error" class="bg-red-100 border border-red-300 text-red-700 text-sm rounded-xl p-2">
          {{ store.error }}
        </p>

        <!-- по этапам -->
        <div v-for="[stage, nodes] in stages" :key="stage">
          <h3 class="text-xs font-semibold uppercase tracking-wide text-stone-400 mb-2">
            Этап {{ stage }}
            <span v-if="stage === 1" class="text-stone-400 normal-case">— стартовые культуры</span>
          </h3>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            <div
              v-for="n in nodes"
              :key="n.code"
              class="rounded-xl border-2 bg-white p-3 flex flex-col gap-1.5"
              :class="nodeClass(n)"
            >
              <div class="flex items-center justify-between">
                <div class="font-semibold text-stone-800 text-sm truncate">{{ n.title }}</div>
                <span v-if="n.unlocked" class="text-lime-600 text-xs font-bold">✓</span>
                <span v-else-if="!n.available" class="text-stone-400 text-xs">🔒</span>
              </div>

              <div class="text-xs text-stone-500">
                {{ n.factoryCode }} → {{ n.outputCode }}
              </div>

              <!-- стоимость -->
              <div v-if="n.cost.length" class="flex flex-wrap gap-1 text-[11px]">
                <span
                  v-for="c in n.cost"
                  :key="c.code"
                  class="inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 border"
                  :class="have(c.code) >= c.qty
                    ? 'border-lime-300 bg-lime-50 text-lime-800'
                    : 'border-red-300 bg-red-50 text-red-700'"
                >
                  {{ productEmoji(c.code) }} {{ productTitle(c.code) }}
                  <b>{{ have(c.code) }}/{{ c.qty }}</b>
                </span>
              </div>
              <div v-else class="text-[11px] text-stone-400">Бесплатно</div>

              <!-- зависимости -->
              <div v-if="n.requires.length && !n.unlocked" class="text-[11px] text-stone-400">
                Требует: {{ n.requires.map(r => titleOf(r)).join(', ') }}
              </div>

              <button
                v-if="!n.unlocked"
                :disabled="!n.available || !store.canAfford(n) || store.isLoading"
                @click="onOpen(n.code)"
                class="mt-1 px-3 py-1.5 rounded-xl text-sm font-semibold transition bg-amber-500 hover:bg-amber-400 text-stone-900 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Исследовать
              </button>
              <div v-else class="mt-1 text-xs font-semibold text-lime-700">Открыто</div>
            </div>
          </div>
        </div>

        <p v-if="stages.size === 0" class="text-stone-500 text-center py-8">
          {{ store.isLoading ? 'Загрузка…' : 'Дерево пусто. Регион не назначен?' }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useResearchStore, type ResearchNode } from '~/stores/research'
import { useCatalogStore } from '~/stores/catalog'
import { useAuthStore } from '~/stores/auth'
import { productEmoji } from '~/utils/productLook'

const props = defineProps<{ code: string }>()
const emit = defineEmits<{ (e: 'close'): void }>()

const store = useResearchStore()
const catalog = useCatalogStore()
const auth = useAuthStore()

const regionLabel = computed(() => {
  const r = store.region
  const map: Record<string, string> = {
    ITALY: '🇮🇹 Италия',
    JAPAN: '🇯🇵 Япония',
    EGYPT: '🇪🇬 Египет',
    BRAZIL: '🇧🇷 Бразилия'
  }
  return map[r] ?? r ?? '—'
})

const stages = computed(() => {
  const arr = [...store.byStage.entries()].sort((a, b) => a[0] - b[0])
  return arr
})

const totalCount = computed(() => store.tree?.nodes.length ?? 0)
const unlockedCount = computed(
  () => (store.tree?.nodes ?? []).filter(n => n.unlocked).length
)

const have = (code: string) => store.tree?.storage?.[code] ?? 0
const productTitle = (code: string) => catalog.productByCode(code)?.title ?? code

const titleOf = (researchCode: string) =>
  (store.tree?.nodes ?? []).find(n => n.code === researchCode)?.title ?? researchCode

const nodeClass = (n: ResearchNode) => {
  if (n.unlocked) return 'border-lime-300 bg-lime-50'
  if (!n.available) return 'border-stone-200 opacity-60'
  if (!store.canAfford(n)) return 'border-amber-300'
  return 'border-amber-400 shadow-md'
}

const onOpen = async (researchCode: string) => {
  const userId = auth.user?.id
  if (!userId) return
  await store.open(props.code, userId, researchCode)
}

onMounted(() => {
  const userId = auth.user?.id
  if (userId) store.load(props.code, userId)
})
</script>