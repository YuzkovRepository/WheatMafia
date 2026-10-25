<template>
  <div
    class="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
    @click.self="emit('close')"
  >
    <div class="bg-stone-50 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden">
      <!-- шапка -->
      <div class="flex items-center justify-between px-5 py-4 border-b border-stone-200">
        <div>
           <h2 class="text-xl font-semibold text-stone-800">🏪 Маркетплейс</h2>
           <p class="text-xs text-stone-500">Торговля между игроками партии · у вас 🪙 <b>{{ market.coins }}</b></p>
        </div>
        <button @click="emit('close')" class="text-stone-500 hover:text-stone-800 text-2xl leading-none">×</button>
      </div>

      <!-- вкладки -->
      <div class="flex gap-2 px-5 pt-3">
        <button
          v-for="t in tabs"
          :key="t.key"
          @click="tab = t.key"
          class="px-4 py-2 rounded-xl font-semibold text-sm transition"
          :class="tab === t.key ? 'bg-amber-500 text-stone-900' : 'bg-stone-200 text-stone-600 hover:bg-stone-300'"
        >
          {{ t.label }}
        </button>
      </div>

      <p v-if="market.error" class="mx-5 mt-3 bg-red-100 border border-red-300 text-red-700 text-sm rounded-xl p-2">
        {{ market.error }}
      </p>

      <!-- ЖУРНАЛ -->
      <template v-if="tab === 'journal'">
        <div class="flex flex-wrap gap-1.5 px-5 pt-3">
          <button
            v-for="f in filters"
            :key="f.key"
            @click="filter = f.key"
            class="px-3 py-1 rounded-lg text-xs font-semibold transition"
            :class="filter === f.key ? 'bg-stone-800 text-amber-50' : 'bg-stone-200 text-stone-600 hover:bg-stone-300'"
          >
            {{ f.label }}
          </button>
        </div>

        <div class="p-5 overflow-y-auto space-y-2 min-h-0">
          <div
            v-for="l in filteredLots"
            :key="l.slotId"
            class="rounded-xl border-2 bg-white p-3 flex items-center gap-3"
            :class="isMine(l) ? 'border-amber-300' : 'border-stone-200'"
          >
            <ProductIcon :code="l.productCode" :size="44" />

            <div class="flex-1 min-w-0">
              <div class="font-semibold text-stone-800">
                {{ l.productTitle }} <span class="text-stone-500">×{{ l.quantity }}</span>
              </div>
              <div class="text-xs text-stone-500">
                Продаёт: <b class="text-stone-700">{{ l.sellerNick }}</b><span v-if="isMine(l)"> (вы)</span>
              </div>
              <div v-if="l.description" class="text-xs text-stone-400 truncate">«{{ l.description }}»</div>
            </div>

            <div class="text-right">
              <div class="font-bold text-stone-800">🪙 {{ total(l) }}</div>
              <div class="text-[11px] text-stone-400">{{ l.price }} за шт.</div>
            </div>

            <button
              v-if="isMine(l)"
              :disabled="busy"
              @click="onCancel(l)"
              class="px-3 py-2 rounded-xl font-semibold text-sm bg-stone-200 hover:bg-stone-300 text-stone-700 disabled:opacity-40"
            >
              Снять
            </button>
            <button
              v-else
              :disabled="busy || market.coins < total(l)"
              :title="market.coins < total(l) ? 'Не хватает монет' : ''"
              @click="onBuy(l)"
              class="px-3 py-2 rounded-xl font-semibold text-sm bg-amber-500 hover:bg-amber-400 text-stone-900 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Купить
            </button>
          </div>

          <p v-if="filteredLots.length === 0" class="text-stone-500 text-center py-8">
            {{ market.isLoading ? 'Загрузка…' : 'Пока ничего не продаётся.' }}
          </p>
        </div>
      </template>

      <!-- ПРОДАТЬ -->
      <div v-else class="p-5 overflow-y-auto space-y-4 min-h-0">
        <p v-if="sellable.length === 0" class="text-stone-500 text-center py-8">
          На складе нечего продавать. Соберите урожай или запустите производство.
        </p>

        <template v-else>
          <div>
            <h3 class="text-xs font-semibold uppercase tracking-wide text-stone-400 mb-2">Что продаём</h3>
            <div class="grid grid-cols-2 sm:grid-cols-3 gap-2">
              <button
                v-for="i in sellable"
                :key="i.code"
                @click="pickSell(i.code)"
                class="flex items-center gap-2 rounded-xl border-2 px-3 py-2 text-left transition"
                :class="sellCode === i.code ? 'border-amber-500 bg-amber-50' : 'border-stone-200 bg-white hover:border-amber-300'"
              >
                <ProductIcon :code="i.code" :size="32" />
                <div class="min-w-0 leading-tight">
                  <div class="text-sm font-semibold text-stone-700 truncate">{{ i.title }}</div>
                  <div class="text-xs text-stone-500">на складе ×{{ i.qty }}</div>
                </div>
              </button>
            </div>
          </div>

          <div v-if="sellItem" class="rounded-xl border-2 border-stone-200 bg-white p-4 space-y-3">
            <div class="grid grid-cols-2 gap-3">
              <label class="text-xs text-stone-500">
                Количество (до {{ maxQty }})
                <div class="flex gap-1 mt-1">
                  <input
                    v-model.number="sellQty"
                    type="number" min="1" :max="maxQty"
                    class="w-full rounded-lg border border-stone-300 px-2 py-1.5 text-sm text-stone-800"
                  />
                  <button type="button" @click="sellQty = maxQty"
                          class="px-2 rounded-lg bg-stone-200 hover:bg-stone-300 text-xs font-semibold text-stone-700">
                    всё
                  </button>
                </div>
              </label>
              <label class="text-xs text-stone-500">
                Цена за штуку, 🪙
                <input
                  v-model.number="sellPrice"
                  type="number" min="1"
                  class="mt-1 w-full rounded-lg border border-stone-300 px-2 py-1.5 text-sm text-stone-800"
                />
              </label>
            </div>

            <label class="block text-xs text-stone-500">
              Комментарий (необязательно)
              <input
                v-model="sellDesc"
                maxlength="100"
                class="mt-1 w-full rounded-lg border border-stone-300 px-2 py-1.5 text-sm text-stone-800"
              />
            </label>

            <p v-if="formError" class="text-sm text-red-600">{{ formError }}</p>

            <div class="flex items-center justify-between">
              <span class="text-sm text-stone-600">Всего за лот: <b>🪙 {{ sellTotal }}</b></span>
              <button
                :disabled="busy"
                @click="onSell"
                class="px-4 py-2 rounded-xl font-semibold text-sm bg-amber-500 hover:bg-amber-400 text-stone-900 disabled:opacity-40"
              >
                Выставить на продажу
              </button>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useMarketStore, type Lot } from '~/stores/market'
import { useStorageStore } from '~/stores/storage'
import { useCatalogStore } from '~/stores/catalog'
import { useAuthStore } from '~/stores/auth'

const props = defineProps<{ code: string }>()
const emit = defineEmits<{ (e: 'close'): void }>()

const market = useMarketStore()
const storage = useStorageStore()
const catalog = useCatalogStore()
const auth = useAuthStore()

const userId = computed(() => auth.user?.id)

const tab = ref<'journal' | 'sell'>('journal')
const tabs = [
  { key: 'journal' as const, label: '📜 Журнал' },
  { key: 'sell' as const, label: '💰 Продать' }
]

const filter = ref<'ALL' | 'MINE' | 'CROP' | 'MATERIAL' | 'GOODS'>('ALL')
const filters = [
  { key: 'ALL' as const, label: 'Все' },
  { key: 'MINE' as const, label: 'Мои' },
  { key: 'CROP' as const, label: '🌾 Культуры' },
  { key: 'MATERIAL' as const, label: '🥣 Материалы' },
  { key: 'GOODS' as const, label: '🍷 Товары' }
]

const busy = ref(false)
const formError = ref<string | null>(null)

const refresh = async () => {
  if (!userId.value) return
  await Promise.all([
    market.load(props.code, userId.value),
    storage.load(props.code, userId.value)
  ])
}
onMounted(() => {
  market.error = null
  refresh()
})

/* ---------- журнал ---------- */
const isMine = (l: Lot) => l.sellerId === userId.value
const total = (l: Lot) => l.price * l.quantity

const filteredLots = computed(() =>
  market.lots.filter(l =>
    filter.value === 'ALL' ? true
      : filter.value === 'MINE' ? isMine(l)
      : l.productKind === filter.value
  )
)

const onBuy = async (l: Lot) => {
  if (!userId.value || busy.value) return
  busy.value = true
  try {
    if (await market.buy(props.code, userId.value, l.slotId)) {
      await storage.load(props.code, userId.value)
    }
  } finally {
    busy.value = false
  }
}

const onCancel = async (l: Lot) => {
  if (!userId.value || busy.value) return
  busy.value = true
  try {
    if (await market.cancel(props.code, userId.value, l.slotId)) {
      await storage.load(props.code, userId.value)
    }
  } finally {
    busy.value = false
  }
}

/* ---------- продажа ---------- */
const sellable = computed(() =>
  storage.items
    .filter(i => i.qty > 0)
    .map(i => ({ code: i.code, qty: i.qty, title: catalog.productByCode(i.code)?.title ?? i.code }))
)

const sellCode = ref<string | null>(null)
const sellQty = ref(1)
const sellPrice = ref(10)
const sellDesc = ref('')

const sellItem = computed(() => sellable.value.find(i => i.code === sellCode.value) ?? null)
const maxQty = computed(() => Math.min(100, sellItem.value?.qty ?? 1))

const sellTotal = computed(() => {
  const q = Math.max(0, Math.floor(Number(sellQty.value) || 0))
  const p = Math.max(0, Math.floor(Number(sellPrice.value) || 0))
  return q * p
})

const pickSell = (code: string) => {
  sellCode.value = code
  sellQty.value = 1
  formError.value = null
  market.error = null
}

const onSell = async () => {
  if (!userId.value || !sellItem.value || busy.value) return
  const quantity = Math.floor(Number(sellQty.value))
  const price = Math.floor(Number(sellPrice.value))

  if (!(quantity >= 1 && quantity <= maxQty.value)) {
    formError.value = `Количество: от 1 до ${maxQty.value}`
    return
  }
  if (!(price >= 1)) {
    formError.value = 'Цена должна быть не меньше 1'
    return
  }
  formError.value = null

  busy.value = true
  try {
    const ok = await market.sell(props.code, userId.value, {
      productCode: sellItem.value.code,
      quantity,
      price,
      description: sellDesc.value.trim() || null
    })
    if (ok) {
      await storage.load(props.code, userId.value)
      sellCode.value = null
      sellDesc.value = ''
      tab.value = 'journal'
    }
  } finally {
    busy.value = false
  }
}
</script>