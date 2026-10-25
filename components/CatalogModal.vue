<template>
  <div
    class="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
    @click.self="emit('close')"
  >
    <div class="bg-stone-50 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[85vh] flex flex-col overflow-hidden">
      <div class="flex items-center justify-between px-5 py-4 border-b border-stone-200">
        <div>
          <h2 class="text-xl font-semibold text-stone-800">📖 Справочник</h2>
          <p class="text-xs text-stone-500">Все культуры и продукты: где делаются и для чего нужны</p>
        </div>
        <button @click="emit('close')" class="text-stone-500 hover:text-stone-800 text-2xl leading-none">×</button>
      </div>

      <div class="px-5 pt-3 space-y-2">
        <input
          v-model="query"
          placeholder="Поиск по названию…"
          class="w-full rounded-lg border border-stone-300 px-3 py-1.5 text-sm text-stone-800"
        />
        <div class="flex flex-wrap gap-1.5">
          <button
            v-for="t in tabs"
            :key="t.key"
            @click="tab = t.key"
            class="px-3 py-1 rounded-lg text-xs font-semibold transition"
            :class="tab === t.key ? 'bg-amber-500 text-stone-900' : 'bg-stone-200 text-stone-600 hover:bg-stone-300'"
          >
            {{ t.label }}
          </button>
        </div>
      </div>

      <div class="p-5 overflow-y-auto grid gap-3 sm:grid-cols-2 min-h-0">
        <div
          v-for="p in list"
          :key="p.code"
          class="rounded-xl border-2 border-stone-200 bg-white p-3"
        >
          <div class="flex items-center gap-3">
            <ProductIcon :code="p.code" :size="44" />
            <div class="flex-1 min-w-0">
              <div class="font-semibold text-stone-800">
                {{ p.title }}
                <span v-if="p.legality === 'ILLEGAL'" class="ml-1 text-[11px] font-semibold text-red-600">🚫 нелегально</span>
              </div>
              <div class="text-xs text-stone-500">
                {{ kindLabel(p.kind) }} · ⭐ +{{ p.score }}
                <template v-if="p.baseScore > 0"> · 🌱 +{{ p.baseScore }} за выращивание</template>
              </div>
            </div>
          </div>

          <div class="mt-2 space-y-1 text-xs text-stone-600">
            <div v-for="(m, idx) in makers(p.code)" :key="idx">
              🏭 <b>{{ m.where }}</b> · ⏱ {{ fmtDuration(m.time) }}
              <span v-if="m.inputs" class="text-stone-500">· из {{ m.inputs }}</span>
            </div>
            <div v-if="makers(p.code).length === 0" class="text-stone-400">Способ получения не задан</div>
            <div v-if="usedIn(p.code)" class="text-stone-500">➡️ Нужен для: {{ usedIn(p.code) }}</div>
          </div>
        </div>

        <p v-if="list.length === 0" class="text-stone-500 text-center py-8 sm:col-span-2">
          {{ catalog.isLoading ? 'Загрузка…' : 'Ничего не найдено.' }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCatalogStore } from '~/stores/catalog'
import { fmtDuration, productEmoji } from '~/utils/productLook'

const emit = defineEmits<{ (e: 'close'): void }>()
const catalog = useCatalogStore()

const query = ref('')
const tab = ref<'ALL' | 'CROP' | 'MATERIAL' | 'GOODS'>('ALL')
const tabs = [
  { key: 'ALL' as const, label: 'Все' },
  { key: 'CROP' as const, label: '🌾 Культуры' },
  { key: 'MATERIAL' as const, label: '🥣 Материалы' },
  { key: 'GOODS' as const, label: '🍷 Товары' }
]

const kindLabel = (k: string) =>
  k === 'CROP' ? 'Культура' : k === 'MATERIAL' ? 'Материал' : 'Товар'

const list = computed(() => {
  const q = query.value.trim().toLowerCase()
  return catalog.products.filter(p =>
    (tab.value === 'ALL' || p.kind === tab.value) &&
    (!q || p.title.toLowerCase().includes(q) || p.code.toLowerCase().includes(q))
  )
})

const titleOf = (code: string) => catalog.productByCode(code)?.title ?? code

// где и из чего делается продукт
const makers = (code: string) =>
  catalog.recipes
    .filter(r => r.outputCode === code)
    .map(r => {
      const f = catalog.byCode(r.factoryCode)
      return {
        where: f?.kind === 'CROP' ? 'Выращивается на грядке' : (f?.title ?? r.factoryCode),
        time: r.productionTime,
        inputs: (r.inputs ?? [])
          .map(i => `${productEmoji(i.code)} ${i.title || titleOf(i.code)} ×${i.qty}`)
          .join(', ')
      }
    })

// из чего этот продукт нужен
const usedIn = (code: string) =>
  catalog.recipes
    .filter(r => (r.inputs ?? []).some(i => i.code === code))
    .map(r => `${productEmoji(r.outputCode)} ${r.outputTitle || titleOf(r.outputCode)}`)
    .join(', ')
</script>