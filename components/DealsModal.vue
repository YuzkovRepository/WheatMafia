<template>
  <div
    class="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
    @click.self="emit('close')"
  >
    <div class="bg-stone-50 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[88vh] flex flex-col overflow-hidden">
      <!-- шапка -->
      <div class="flex items-center justify-between px-5 py-4 border-b border-stone-200">
        <div>
          <h2 class="text-xl font-semibold text-stone-800">🤝 Контракты и суперзаказы</h2>
          <p class="text-xs text-stone-500">Обмен товарами и заказы на покупку · у вас 🪙 <b>{{ market.coins }}</b></p>
        </div>
        <button @click="emit('close')" class="text-stone-500 hover:text-stone-800 text-2xl leading-none">×</button>
      </div>

      <!-- главные вкладки -->
      <div class="flex gap-2 px-5 pt-3">
        <button
          v-for="t in tabs"
          :key="t.key"
          @click="switchTab(t.key)"
          class="px-4 py-2 rounded-xl font-semibold text-sm transition"
          :class="tab === t.key ? 'bg-amber-500 text-stone-900' : 'bg-stone-200 text-stone-600 hover:bg-stone-300'"
        >
          {{ t.label }} <span class="opacity-70">({{ t.key === 'contracts' ? deals.contracts.length : deals.orders.length }})</span>
        </button>
      </div>

      <!-- подвкладки -->
      <div class="flex flex-wrap gap-1.5 px-5 pt-3">
        <button
          v-for="v in views"
          :key="v.key"
          @click="view = v.key"
          class="px-3 py-1 rounded-lg text-xs font-semibold transition"
          :class="view === v.key ? 'bg-stone-800 text-amber-50' : 'bg-stone-200 text-stone-600 hover:bg-stone-300'"
        >
          {{ v.label }}
        </button>
      </div>

      <p v-if="deals.error" class="mx-5 mt-3 bg-red-100 border border-red-300 text-red-700 text-sm rounded-xl p-2">
        {{ deals.error }}
      </p>
      <p v-if="notice" class="mx-5 mt-3 bg-lime-100 border border-lime-300 text-lime-800 text-sm rounded-xl p-2">
        {{ notice }}
      </p>

      <div class="p-5 overflow-y-auto space-y-3 min-h-0">
        <!-- ==================== КОНТРАКТЫ: список ==================== -->
        <template v-if="tab === 'contracts' && view !== 'create'">
          <div
            v-for="c in shownContracts"
            :key="c.id"
            class="rounded-xl border-2 bg-white p-3 space-y-2"
            :class="isMine(c.creatorId) ? 'border-amber-300' : 'border-stone-200'"
          >
            <div class="flex items-center justify-between text-xs text-stone-500">
              <span>
                Автор: <b class="text-stone-700">{{ c.creatorNick }}</b><span v-if="isMine(c.creatorId)"> (вы)</span>
              </span>
              <span v-if="c.description" class="truncate max-w-[50%] text-stone-400">«{{ c.description }}»</span>
            </div>

            <div class="grid sm:grid-cols-[1fr_auto_1fr] gap-2 items-center">
              <div>
                <div class="text-[11px] font-semibold uppercase tracking-wide text-stone-400 mb-1">Отдаёт</div>
                <div class="flex flex-wrap gap-1.5">
                  <span
                    v-for="i in c.offer"
                    :key="i.code"
                    class="inline-flex items-center gap-1 rounded-lg border border-stone-200 bg-stone-50 px-2 py-0.5 text-xs text-stone-700"
                  >
                    {{ productEmoji(i.code) }} {{ titleOf(i.code) }} <b>×{{ i.qty }}</b>
                  </span>
                </div>
              </div>

              <div class="text-2xl text-stone-400 text-center">⇄</div>

              <div>
                <div class="text-[11px] font-semibold uppercase tracking-wide text-stone-400 mb-1">Хочет получить</div>
                <div class="flex flex-wrap gap-1.5">
                  <span
                    v-for="i in c.request"
                    :key="i.code"
                    class="inline-flex items-center gap-1 rounded-lg border px-2 py-0.5 text-xs"
                    :class="isMine(c.creatorId) || haveOf(i.code) >= i.qty
                      ? 'border-stone-200 bg-stone-50 text-stone-700'
                      : 'border-red-300 bg-red-50 text-red-700'"
                  >
                    {{ productEmoji(i.code) }} {{ titleOf(i.code) }} <b>×{{ i.qty }}</b>
                    <span v-if="!isMine(c.creatorId)" class="opacity-70">({{ haveOf(i.code) }})</span>
                  </span>
                </div>
              </div>
            </div>

            <div class="flex justify-end">
              <button
                v-if="isMine(c.creatorId)"
                :disabled="busy"
                @click="onCancelContract(c)"
                class="px-3 py-1.5 rounded-xl font-semibold text-sm bg-stone-200 hover:bg-stone-300 text-stone-700 disabled:opacity-40"
              >
                Отменить и забрать товары
              </button>
              <button
                v-else
                :disabled="busy || !canAccept(c)"
                :title="canAccept(c) ? '' : 'Не хватает товаров на складе'"
                @click="onAccept(c)"
                class="px-4 py-1.5 rounded-xl font-semibold text-sm bg-amber-500 hover:bg-amber-400 text-stone-900 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Принять обмен
              </button>
            </div>
          </div>

          <p v-if="shownContracts.length === 0" class="text-stone-500 text-center py-8">
            {{ deals.isLoading ? 'Загрузка…' : 'Контрактов пока нет.' }}
          </p>
        </template>

        <!-- ==================== КОНТРАКТЫ: создание ==================== -->
        <template v-else-if="tab === 'contracts'">
          <p class="text-xs text-stone-500">
            Отдаваемые товары сразу уходят со склада в залог и вернутся, если вы отмените контракт.
            Вместе с товарами можно указать до 5 видов с каждой стороны.
          </p>

          <div class="rounded-xl border-2 border-stone-200 bg-white p-4 space-y-3">
            <div class="text-sm font-semibold text-stone-700">Я отдаю</div>
            <div v-for="(r, idx) in offerRows" :key="'o' + idx" class="flex items-center gap-2">
              <select v-model="r.code" class="flex-1 rounded-lg border border-stone-300 px-2 py-1.5 text-sm text-stone-800 bg-white">
                <option value="" disabled>— выберите товар —</option>
                <option v-for="s in myStock" :key="s.code" :value="s.code" :disabled="usedIn(offerRows, s.code, idx)">
                  {{ productEmoji(s.code) }} {{ s.title }} (есть {{ s.qty }})
                </option>
              </select>
              <input
                v-model.number="r.qty" type="number" min="1" :max="stockOf(r.code) || 100"
                class="w-20 rounded-lg border border-stone-300 px-2 py-1.5 text-sm text-stone-800"
              />
              <button v-if="offerRows.length > 1" @click="offerRows.splice(idx, 1)" class="text-stone-400 hover:text-red-600 text-lg leading-none">×</button>
            </div>
            <button
              v-if="offerRows.length < 5"
              @click="offerRows.push({ code: '', qty: 1 })"
              class="text-xs font-semibold text-amber-700 hover:text-amber-600"
            >
              + ещё товар
            </button>

            <div class="text-center text-xl text-stone-400">⇅</div>

            <div class="text-sm font-semibold text-stone-700">Хочу получить</div>
            <div v-for="(r, idx) in requestRows" :key="'r' + idx" class="flex items-center gap-2">
              <select v-model="r.code" class="flex-1 rounded-lg border border-stone-300 px-2 py-1.5 text-sm text-stone-800 bg-white">
                <option value="" disabled>— выберите товар —</option>
                <option v-for="p in allProducts" :key="p.code" :value="p.code" :disabled="usedIn(requestRows, p.code, idx)">
                  {{ productEmoji(p.code) }} {{ p.title }}
                </option>
              </select>
              <input
                v-model.number="r.qty" type="number" min="1" max="100"
                class="w-20 rounded-lg border border-stone-300 px-2 py-1.5 text-sm text-stone-800"
              />
              <button v-if="requestRows.length > 1" @click="requestRows.splice(idx, 1)" class="text-stone-400 hover:text-red-600 text-lg leading-none">×</button>
            </div>
            <button
              v-if="requestRows.length < 5"
              @click="requestRows.push({ code: '', qty: 1 })"
              class="text-xs font-semibold text-amber-700 hover:text-amber-600"
            >
              + ещё товар
            </button>

            <label class="block text-xs text-stone-500">
              Комментарий (необязательно)
              <input
                v-model="cDesc" maxlength="100"
                class="mt-1 w-full rounded-lg border border-stone-300 px-2 py-1.5 text-sm text-stone-800"
              />
            </label>

            <p v-if="formError" class="text-sm text-red-600">{{ formError }}</p>

            <div class="flex justify-end">
              <button
                :disabled="busy"
                @click="onCreateContract"
                class="px-4 py-2 rounded-xl font-semibold text-sm bg-amber-500 hover:bg-amber-400 text-stone-900 disabled:opacity-40"
              >
                Создать контракт
              </button>
            </div>
          </div>
        </template>

        <!-- ==================== СУПЕРЗАКАЗЫ: список ==================== -->
        <template v-else-if="tab === 'orders' && view !== 'create'">
          <div
            v-for="o in shownOrders"
            :key="o.id"
            class="rounded-xl border-2 bg-white p-3 flex items-center gap-3"
            :class="isMine(o.buyerId) ? 'border-amber-300' : 'border-stone-200'"
          >
            <ProductIcon :code="o.productCode" :size="44" />

            <div class="flex-1 min-w-0">
              <div class="font-semibold text-stone-800">
                {{ o.productTitle }}
                <span class="text-stone-500">осталось ×{{ o.remaining }}</span>
                <span v-if="o.remaining < o.quantity" class="text-[11px] text-stone-400">из {{ o.quantity }}</span>
              </div>
              <div class="text-xs text-stone-500">
                Заказчик: <b class="text-stone-700">{{ o.buyerNick }}</b><span v-if="isMine(o.buyerId)"> (вы)</span>
                · 🪙 <b>{{ o.price }}</b> за шт.
              </div>
              <div v-if="o.description" class="text-xs text-stone-400 truncate">«{{ o.description }}»</div>
            </div>

            <template v-if="isMine(o.buyerId)">
              <div class="text-right text-[11px] text-stone-400">
                в резерве<br /><b class="text-stone-700 text-sm">🪙 {{ o.remaining * o.price }}</b>
              </div>
              <button
                :disabled="busy"
                @click="onCancelOrder(o)"
                class="px-3 py-2 rounded-xl font-semibold text-sm bg-stone-200 hover:bg-stone-300 text-stone-700 disabled:opacity-40"
              >
                Отменить
              </button>
            </template>

            <template v-else>
              <div class="flex flex-col items-end gap-1">
                <div class="flex items-center gap-1">
                  <input
                    :value="fulfillQty(o)" @input="setFulfillQty(o, ($event.target as HTMLInputElement).value)"
                    type="number" min="1" :max="Math.min(haveOf(o.productCode), o.remaining)"
                    class="w-16 rounded-lg border border-stone-300 px-2 py-1 text-sm text-stone-800"
                  />
                  <span class="text-xs text-stone-400">из {{ haveOf(o.productCode) }}</span>
                </div>
                <button
                  :disabled="busy || haveOf(o.productCode) < 1 || fulfillQty(o) < 1"
                  :title="haveOf(o.productCode) < 1 ? 'Нет такого товара на складе' : ''"
                  @click="onFulfill(o)"
                  class="px-3 py-1.5 rounded-xl font-semibold text-sm bg-amber-500 hover:bg-amber-400 text-stone-900 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Продать · 🪙 {{ fulfillQty(o) * o.price }}
                </button>
              </div>
            </template>
          </div>

          <p v-if="shownOrders.length === 0" class="text-stone-500 text-center py-8">
            {{ deals.isLoading ? 'Загрузка…' : 'Суперзаказов пока нет.' }}
          </p>
        </template>

        <!-- ==================== СУПЕРЗАКАЗЫ: создание ==================== -->
        <template v-else>
          <p class="text-xs text-stone-500">
            Укажите, сколько штук и по какой цене вы готовы купить. Монеты резервируются сразу,
            а нераспроданный остаток вернётся, если вы отмените заказ.
          </p>

          <div class="rounded-xl border-2 border-stone-200 bg-white p-4 space-y-3">
            <label class="block text-xs text-stone-500">
              Что хотите купить
              <select v-model="oCode" class="mt-1 w-full rounded-lg border border-stone-300 px-2 py-1.5 text-sm text-stone-800 bg-white">
                <option value="" disabled>— выберите товар —</option>
                <option v-for="p in allProducts" :key="p.code" :value="p.code">
                  {{ productEmoji(p.code) }} {{ p.title }}
                </option>
              </select>
            </label>

            <div class="grid grid-cols-2 gap-3">
              <label class="text-xs text-stone-500">
                Количество (до 100)
                <input
                  v-model.number="oQty" type="number" min="1" max="100"
                  class="mt-1 w-full rounded-lg border border-stone-300 px-2 py-1.5 text-sm text-stone-800"
                />
              </label>
              <label class="text-xs text-stone-500">
                Цена за штуку, 🪙
                <input
                  v-model.number="oPrice" type="number" min="1"
                  class="mt-1 w-full rounded-lg border border-stone-300 px-2 py-1.5 text-sm text-stone-800"
                />
              </label>
            </div>

            <label class="block text-xs text-stone-500">
              Комментарий (необязательно)
              <input
                v-model="oDesc" maxlength="100"
                class="mt-1 w-full rounded-lg border border-stone-300 px-2 py-1.5 text-sm text-stone-800"
              />
            </label>

            <p v-if="formError" class="text-sm text-red-600">{{ formError }}</p>

            <div class="flex items-center justify-between">
              <span class="text-sm" :class="orderTotal > market.coins ? 'text-red-600' : 'text-stone-600'">
                В резерв: <b>🪙 {{ orderTotal }}</b>
                <span v-if="orderTotal > market.coins"> — не хватает {{ orderTotal - market.coins }}</span>
              </span>
              <button
                :disabled="busy"
                @click="onCreateOrder"
                class="px-4 py-2 rounded-xl font-semibold text-sm bg-amber-500 hover:bg-amber-400 text-stone-900 disabled:opacity-40"
              >
                Объявить суперзаказ
              </button>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDealsStore, type Contract, type BuyOrder } from '~/stores/deals'
import { useMarketStore } from '~/stores/market'
import { useStorageStore } from '~/stores/storage'
import { useCatalogStore } from '~/stores/catalog'
import { useAuthStore } from '~/stores/auth'
import { productEmoji } from '~/utils/productLook'

const props = defineProps<{ code: string }>()
const emit = defineEmits<{ (e: 'close'): void }>()

const deals = useDealsStore()
const market = useMarketStore()
const storage = useStorageStore()
const catalog = useCatalogStore()
const auth = useAuthStore()

const userId = computed(() => auth.user?.id)

const tab = ref<'contracts' | 'orders'>('contracts')
const tabs = [
  { key: 'contracts' as const, label: '🤝 Контракты' },
  { key: 'orders' as const, label: '⭐ Суперзаказы' }
]

const view = ref<'all' | 'mine' | 'create'>('all')
const views = computed(() => [
  { key: 'all' as const, label: 'Все' },
  { key: 'mine' as const, label: 'Мои' },
  { key: 'create' as const, label: tab.value === 'contracts' ? '+ Новый контракт' : '+ Новый суперзаказ' }
])
const switchTab = (t: 'contracts' | 'orders') => {
  tab.value = t
  view.value = 'all'
  formError.value = null
  deals.error = null
}

const busy = ref(false)
const notice = ref<string | null>(null)
const formError = ref<string | null>(null)

const refresh = async () => {
  if (!userId.value) return
  await Promise.all([
    deals.load(props.code, userId.value),
    storage.load(props.code, userId.value)
  ])
}
onMounted(() => {
  deals.error = null
  refresh()
})

/* ---------- общее ---------- */
const isMine = (id: number) => id === userId.value
const titleOf = (c: string) => catalog.productByCode(c)?.title ?? c
const haveOf = (c: string) => storage.items.find(i => i.code === c)?.qty ?? 0
const stockOf = (c: string) => haveOf(c)

const allProducts = computed(() =>
  [...catalog.products].sort((a, b) => a.title.localeCompare(b.title, 'ru'))
)
const myStock = computed(() =>
  storage.items.filter(i => i.qty > 0).map(i => ({ code: i.code, qty: i.qty, title: titleOf(i.code) }))
)
const usedIn = (rows: { code: string }[], code: string, idx: number) =>
  rows.some((r, i) => i !== idx && r.code === code)

const run = async (fn: () => Promise<boolean>, okText: string) => {
  if (!userId.value || busy.value) return false
  busy.value = true
  notice.value = null
  try {
    const ok = await fn()
    if (ok) {
      notice.value = okText
      await storage.load(props.code, userId.value)
    }
    return ok
  } finally {
    busy.value = false
  }
}

/* ---------- контракты ---------- */
const shownContracts = computed(() =>
  deals.contracts.filter(c => view.value !== 'mine' || isMine(c.creatorId))
)
const canAccept = (c: Contract) => c.request.every(i => haveOf(i.code) >= i.qty)

const onAccept = (c: Contract) =>
  run(() => deals.acceptContract(props.code, userId.value!, c.id), 'Обмен совершён: товары на вашем складе')
const onCancelContract = (c: Contract) =>
  run(() => deals.cancelContract(props.code, userId.value!, c.id), 'Контракт отменён, товары вернулись на склад')

const offerRows = ref<{ code: string; qty: number }[]>([{ code: '', qty: 1 }])
const requestRows = ref<{ code: string; qty: number }[]>([{ code: '', qty: 1 }])
const cDesc = ref('')

const cleanRows = (rows: { code: string; qty: number }[]) =>
  rows
    .filter(r => r.code)
    .map(r => ({ code: r.code, qty: Math.floor(Number(r.qty)) }))

const onCreateContract = async () => {
  const offer = cleanRows(offerRows.value)
  const request = cleanRows(requestRows.value)
  if (!offer.length || !request.length) {
    formError.value = 'Добавьте хотя бы по одному товару с каждой стороны'
    return
  }
  for (const i of [...offer, ...request]) {
    if (!(i.qty >= 1 && i.qty <= 100)) {
      formError.value = 'Количество каждого товара: от 1 до 100'
      return
    }
  }
  for (const i of offer) {
    if (i.qty > haveOf(i.code)) {
      formError.value = `На складе не хватает: ${titleOf(i.code)} (есть ${haveOf(i.code)})`
      return
    }
  }
  if (offer.some(o => request.some(r => r.code === o.code))) {
    formError.value = 'Нельзя менять товар на такой же'
    return
  }
  formError.value = null

  const ok = await run(
    () => deals.createContract(props.code, userId.value!, { offer, request, description: cDesc.value.trim() || null }),
    'Контракт создан, товары в залоге'
  )
  if (ok) {
    offerRows.value = [{ code: '', qty: 1 }]
    requestRows.value = [{ code: '', qty: 1 }]
    cDesc.value = ''
    view.value = 'mine'
  }
}

/* ---------- суперзаказы ---------- */
const shownOrders = computed(() =>
  deals.orders.filter(o => view.value !== 'mine' || isMine(o.buyerId))
)

// сколько штук продать по заказу: по умолчанию — всё, что есть (но не больше остатка)
const fulfillOverride = reactive<Record<number, number>>({})
const fulfillQty = (o: BuyOrder) => {
  const max = Math.min(haveOf(o.productCode), o.remaining)
  const v = fulfillOverride[o.id] ?? max
  return Math.max(0, Math.min(Math.floor(Number(v) || 0), max))
}
const setFulfillQty = (o: BuyOrder, raw: string) => {
  fulfillOverride[o.id] = Math.floor(Number(raw) || 0)
}

const onFulfill = async (o: BuyOrder) => {
  const qty = fulfillQty(o)
  if (qty < 1) return
  const ok = await run(
    () => deals.fulfillOrder(props.code, userId.value!, o.id, qty),
    `Продано: ${o.productTitle} ×${qty} · +🪙 ${qty * o.price}`
  )
  if (ok) delete fulfillOverride[o.id]
}
const onCancelOrder = (o: BuyOrder) =>
  run(() => deals.cancelOrder(props.code, userId.value!, o.id), 'Заказ отменён, монеты вернулись')

const oCode = ref('')
const oQty = ref(1)
const oPrice = ref(10)
const oDesc = ref('')
const orderTotal = computed(() => {
  const q = Math.max(0, Math.floor(Number(oQty.value) || 0))
  const p = Math.max(0, Math.floor(Number(oPrice.value) || 0))
  return q * p
})

const onCreateOrder = async () => {
  const quantity = Math.floor(Number(oQty.value))
  const price = Math.floor(Number(oPrice.value))
  if (!oCode.value) { formError.value = 'Выберите товар'; return }
  if (!(quantity >= 1 && quantity <= 100)) { formError.value = 'Количество: от 1 до 100'; return }
  if (!(price >= 1)) { formError.value = 'Цена должна быть не меньше 1'; return }
  if (quantity * price > market.coins) { formError.value = 'Не хватает монет для резерва'; return }
  formError.value = null

  const ok = await run(
    () => deals.createOrder(props.code, userId.value!, {
      productCode: oCode.value, quantity, price, description: oDesc.value.trim() || null
    }),
    'Суперзаказ объявлен, монеты в резерве'
  )
  if (ok) {
    oCode.value = ''
    oQty.value = 1
    oDesc.value = ''
    view.value = 'mine'
  }
}
</script>