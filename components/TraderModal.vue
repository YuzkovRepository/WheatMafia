<template>
  <div
    class="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
    @click.self="emit('close')"
  >
    <div class="bg-stone-50 rounded-2xl shadow-2xl w-full max-w-xl max-h-[85vh] flex flex-col overflow-hidden">
      <!-- шапка -->
      <div class="flex items-center justify-between px-5 py-4 border-b border-stone-200">
        <div>
          <h2 class="text-xl font-semibold text-stone-800">🧑‍💼 Скупщик</h2>
          <p class="text-xs text-stone-500">
            Покупает товары со склада по фиксированным ценам · у вас 🪙 <b>{{ market.coins }}</b>
          </p>
        </div>
        <button @click="emit('close')" class="text-stone-500 hover:text-stone-800 text-2xl leading-none">×</button>
      </div>

      <div class="p-5 overflow-y-auto space-y-3 min-h-0">
        <p v-if="trader.error" class="bg-red-100 border border-red-300 text-red-700 text-sm rounded-xl p-2">
          {{ trader.error }}
        </p>
        <p v-if="notice" class="bg-lime-100 border border-lime-300 text-lime-800 text-sm rounded-xl p-2">
          {{ notice }}
        </p>

        <!-- продать всё сразу -->
        <button
          v-if="buyable.length"
          :disabled="busy"
          @click="onSellEverything"
          class="w-full px-4 py-2 rounded-xl font-semibold text-sm bg-stone-800 hover:bg-stone-700 text-amber-50 disabled:opacity-40"
        >
          Продать всё, что я беру · 🪙 {{ grandTotal }}
        </button>

        <!-- что скупщик берёт -->
        <div
          v-for="i in buyable"
          :key="i.code"
          class="rounded-xl border-2 border-stone-200 bg-white p-3 flex items-center gap-3"
        >
          <ProductIcon :code="i.code" :size="44" />

          <div class="flex-1 min-w-0">
            <div class="font-semibold text-stone-800">{{ i.title }}</div>
            <div class="text-xs text-stone-500">
              на складе ×{{ i.qty }} · 🪙 {{ i.price }} за шт.
            </div>
          </div>

          <div class="flex flex-col gap-1">
            <button
              :disabled="busy"
              @click="onSell(i.code, 1)"
              class="px-3 py-1.5 rounded-xl font-semibold text-xs bg-amber-500 hover:bg-amber-400 text-stone-900 disabled:opacity-40"
            >
              Продать 1 · 🪙 {{ i.price }}
            </button>
            <button
              v-if="i.qty > 1"
              :disabled="busy"
              @click="onSell(i.code, i.qty)"
              class="px-3 py-1.5 rounded-xl font-semibold text-xs bg-stone-200 hover:bg-stone-300 text-stone-800 disabled:opacity-40"
            >
              Все {{ i.qty }} · 🪙 {{ i.price * i.qty }}
            </button>
          </div>
        </div>

        <!-- что скупщик не берёт -->
        <div v-if="refused.length">
          <h3 class="text-xs font-semibold uppercase tracking-wide text-stone-400 mb-2">
            Скупщик не берёт
          </h3>
          <div class="grid grid-cols-2 gap-2">
            <div
              v-for="i in refused"
              :key="i.code"
              class="flex items-center gap-2 rounded-xl border-2 border-dashed border-stone-200 bg-white/60 px-3 py-2 opacity-70"
            >
              <ProductIcon :code="i.code" :size="32" />
              <div class="min-w-0 leading-tight">
                <div class="text-sm font-semibold text-stone-700 truncate">{{ i.title }}</div>
                <div class="text-xs text-stone-500">×{{ i.qty }} · только игрокам</div>
              </div>
            </div>
          </div>
          <p class="text-xs text-stone-400 mt-2">Такие товары можно продать другим игрокам на 🏪 маркетплейсе.</p>
        </div>

        <p v-if="!buyable.length && !refused.length" class="text-stone-500 text-center py-8">
          {{ storage.isLoading ? 'Загрузка…' : 'На складе пусто. Соберите урожай или запустите производство.' }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useTraderStore } from '~/stores/trader'
import { useMarketStore } from '~/stores/market'
import { useStorageStore } from '~/stores/storage'
import { useCatalogStore } from '~/stores/catalog'
import { useAuthStore } from '~/stores/auth'

const props = defineProps<{ code: string }>()
const emit = defineEmits<{ (e: 'close'): void }>()

const trader = useTraderStore()
const market = useMarketStore()
const storage = useStorageStore()
const catalog = useCatalogStore()
const auth = useAuthStore()

const userId = computed(() => auth.user?.id)
const busy = ref(false)
const notice = ref<string | null>(null)

onMounted(() => {
  trader.error = null
  trader.loadPrices()
  if (userId.value) storage.load(props.code, userId.value)
})

const rows = computed(() =>
  storage.items
    .filter(i => i.qty > 0)
    .map(i => ({
      code: i.code,
      qty: i.qty,
      title: catalog.productByCode(i.code)?.title ?? i.code,
      price: trader.prices[i.code] ?? null
    }))
)

const buyable = computed(() =>
  rows.value
    .filter(r => r.price != null)
    .map(r => ({ ...r, price: r.price as number }))
    .sort((a, b) => b.price * b.qty - a.price * a.qty)
)
const refused = computed(() => (trader.isLoading ? [] : rows.value.filter(r => r.price == null)))
const grandTotal = computed(() => buyable.value.reduce((s, r) => s + r.price * r.qty, 0))

const sellOne = async (productCode: string, qty: number): Promise<number | null> => {
  if (!userId.value) return null
  return trader.sell(props.code, userId.value, productCode, qty)
}

const onSell = async (productCode: string, qty: number) => {
  if (busy.value) return
  busy.value = true
  notice.value = null
  try {
    const earned = await sellOne(productCode, qty)
    if (earned != null) {
      const title = catalog.productByCode(productCode)?.title ?? productCode
      notice.value = `Продано: ${title} ×${qty} · +🪙 ${earned}`
      if (userId.value) await storage.load(props.code, userId.value)
    }
  } finally {
    busy.value = false
  }
}

const onSellEverything = async () => {
  if (busy.value) return
  busy.value = true
  notice.value = null
  let total = 0
  try {
    for (const r of [...buyable.value]) {
      const earned = await sellOne(r.code, r.qty)
      if (earned == null) break // ошибка уже в trader.error
      total += earned
    }
    if (total > 0) notice.value = `Продано всё · +🪙 ${total}`
    if (userId.value) await storage.load(props.code, userId.value)
  } finally {
    busy.value = false
  }
}
</script>