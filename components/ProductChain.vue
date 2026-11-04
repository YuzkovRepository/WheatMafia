<template>
  <div class="flex flex-col min-h-0">
    <!-- шапка выбранного продукта -->
    <div v-if="rootInfo" class="shrink-0 rounded-xl bg-white border-2 border-stone-200 p-3">
      <div class="flex items-start gap-3">
        <div class="text-4xl leading-none">{{ productEmoji(root) }}</div>
        <div class="min-w-0 flex-1">
          <div class="font-semibold text-stone-800 leading-tight">{{ rootInfo.title }}</div>
          <div class="text-xs text-stone-500 mt-0.5">
            {{ regionStageLabel(rootInfo.region, rootInfo.stage) }}
            <template v-if="rootInfo.factory"> · 🏭 {{ rootInfo.factory }}</template>
          </div>
        </div>
        <button
          @click="copy"
          class="shrink-0 px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-stone-200 text-xs font-semibold text-stone-700"
          title="Скопировать цепочку текстом — удобно отправить другому игроку"
        >
          {{ copied ? '✓ Скопировано' : '📋 Копировать' }}
        </button>
      </div>

      <!-- сводка -->
      <div class="mt-2 grid gap-1.5 text-xs">
        <div v-if="summary.foreign.length">
          <span class="font-semibold text-amber-700">🌐 Нужно из других стран:</span>
          <span class="inline-flex flex-wrap gap-1 ml-1 align-middle">
            <span
              v-for="f in summary.foreign"
              :key="f.code"
              class="px-1.5 py-0.5 rounded-md bg-amber-50 border border-amber-200 text-amber-900"
            >
              {{ productEmoji(f.code) }} {{ f.title }} · {{ regionStageLabel(f.region, f.stage) }}
            </span>
          </span>
        </div>
        <div v-else class="text-lime-700 font-semibold">Всё можно сделать в своей стране 🎉</div>
        <div v-if="summary.locked.length" class="text-stone-600">
          <span class="font-semibold text-red-600">🔒 Ещё не изучено:</span>
          {{ summary.locked.map(x => x.title).join(', ') }}
        </div>
        <div v-else-if="summary.own > 0" class="text-lime-700 font-semibold">Все ваши исследования для цепочки изучены ✓</div>
      </div>
    </div>

    <!-- дерево -->
    <div v-if="rootInfo" class="mt-2 min-h-0 flex-1 overflow-y-auto rounded-xl bg-white border-2 border-stone-200 p-2">
      <div
        v-for="row in rows"
        :key="row.key"
        class="flex items-center gap-1.5 rounded-lg px-1.5 py-1 hover:bg-stone-50 cursor-pointer select-none"
        :style="{ paddingLeft: 6 + row.depth * 18 + 'px' }"
        @click="cd.onClick(row)"
        @dblclick="cd.onDbl(row)"
        :title="'Клик — перейти · двойной клик — в заметки'"
      >
        <button
          v-if="row.hasKids"
          class="w-5 h-5 shrink-0 rounded text-stone-500 hover:bg-stone-200 text-xs leading-none"
          @click.stop="toggle(row)"
          @dblclick.stop
        >
          {{ row.open ? '▾' : '▸' }}
        </button>
        <span v-else class="w-5 shrink-0 text-center text-stone-300 text-xs">•</span>

        <span class="text-xl leading-none shrink-0">{{ productEmoji(row.code) }}</span>
        <span class="font-semibold text-sm text-stone-800 truncate">{{ row.title }}</span>
        <span v-if="row.qty > 1 || row.depth > 0" class="text-xs text-stone-500 shrink-0">×{{ row.qty }}</span>

        <span
          class="shrink-0 px-1.5 py-0.5 rounded-md text-[11px] font-semibold border"
          :class="row.foreign
            ? 'bg-amber-50 border-amber-300 text-amber-800'
            : 'bg-stone-50 border-stone-200 text-stone-600'"
        >
          {{ regionStageLabel(row.region, row.stage) }}
        </span>

        <span
          class="shrink-0 px-1.5 py-0.5 rounded-md text-[11px] font-semibold"
          :class="statusClass(row.status)"
        >
          {{ statusLabel(row.status) }}
        </span>

        <span v-if="row.stock > 0" class="shrink-0 text-[11px] text-lime-700 font-semibold">📦 {{ row.stock }}</span>
        <span v-if="row.factory" class="ml-auto pl-2 shrink-0 text-[11px] text-stone-400 truncate max-w-[9rem]">
          🏭 {{ row.factory }}
        </span>
        <span v-if="row.cycle" class="shrink-0 text-[11px] text-red-500">↻ цикл</span>
      </div>
    </div>

    <p v-if="!rootInfo" class="text-stone-500 text-center py-8 text-sm">Выберите продукт слева — построю цепочку производства.</p>

    <p v-else class="mt-1.5 text-[11px] text-stone-400">
      Клик по строке — открыть в исследованиях (своя страна) или в справочнике (чужая). Двойной клик — добавить в заметки.
      📦 — сколько уже на складе.
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useCatalogStore } from '~/stores/catalog'
import { useResearchStore } from '~/stores/research'
import { useProductIndexStore } from '~/stores/productIndex'
import { productEmoji } from '~/utils/productLook'
import { regionStageLabel } from '~/utils/regions'
import { useClickDbl } from '~/utils/clickDbl'

const props = defineProps<{ root: string | null }>()
const emit = defineEmits<{
  (e: 'navigate', code: string): void
  (e: 'note', code: string): void
}>()

const catalog = useCatalogStore()
const research = useResearchStore()
const idx = useProductIndexStore()

type Status = 'done' | 'ready' | 'locked' | 'foreign' | 'unknown'

interface Row {
  key: string
  code: string
  title: string
  qty: number
  depth: number
  hasKids: boolean
  open: boolean
  region: string | null
  stage: number | null
  foreign: boolean
  status: Status
  stock: number
  factory: string | null
  cycle: boolean
}

const recipes = computed(() => (catalog.recipes ?? []) as any[])
const recipeOf = (code: string) => recipes.value.find(r => r.outputCode === code) ?? null
const titleOf = (code: string) => catalog.productByCode(code)?.title ?? code
const ownRegion = computed(() => research.region || null)

const regionOfProduct = (code: string): string | null => {
  const fromIdx = idx.of(code)?.region
  if (fromIdx) return fromIdx
  const r = recipeOf(code)
  return r ? ((catalog.byCode(r.factoryCode) as any)?.region ?? null) : null
}

// запасной расчёт этапа (если эндпоинт research-index недоступен)
const stageMemo = new Map<string, number>()
watch(() => recipes.value.length, () => stageMemo.clear())
const calcStage = (code: string, guard = new Set<string>()): number => {
  const r = recipeOf(code)
  if (!r) return 1
  if ((catalog.byCode(r.factoryCode) as any)?.kind === 'CROP') return 1
  if (stageMemo.has(code)) return stageMemo.get(code)!
  if (guard.has(code)) return 2
  guard.add(code)
  const reg = regionOfProduct(code)
  let st = 2
  for (const i of r.inputs ?? []) {
    if (regionOfProduct(i.code) === reg) st = Math.max(st, calcStage(i.code, guard) + 1)
  }
  guard.delete(code)
  stageMemo.set(code, st)
  return st
}
const stageOf = (code: string): number | null =>
  idx.of(code)?.stage ?? (recipeOf(code) ? calcStage(code) : null)

const researchNode = (code: string) =>
  (research.tree?.nodes ?? []).find(n => n.outputCode === code) ?? null

const statusOf = (code: string): Status => {
  const reg = regionOfProduct(code)
  if (!reg) return 'unknown'
  if (ownRegion.value && reg !== ownRegion.value) return 'foreign'
  const n = researchNode(code)
  if (!n) return 'unknown'
  return n.unlocked ? 'done' : n.available ? 'ready' : 'locked'
}

const statusLabel = (s: Status) =>
  s === 'done' ? '✓ Изучено'
    : s === 'ready' ? '✨ Можно исследовать'
      : s === 'locked' ? '🔒 Не изучено'
        : s === 'foreign' ? '🌐 Чужая страна' : ''

const statusClass = (s: Status) =>
  s === 'done' ? 'bg-lime-100 text-lime-700'
    : s === 'ready' ? 'bg-amber-100 text-amber-700'
      : s === 'locked' ? 'bg-red-50 text-red-600'
        : s === 'foreign' ? 'bg-sky-50 text-sky-700' : 'hidden'

const stockOf = (code: string) => research.tree?.storage?.[code] ?? 0

/* ---------- дерево ---------- */
const OPEN_DEPTH = 3 // по умолчанию раскрыто до этой глубины
const flipped = ref<Set<string>>(new Set())
watch(() => props.root, () => { flipped.value = new Set() })

interface Node { code: string; qty: number; depth: number; key: string; kids: Node[]; cycle: boolean }

const build = (code: string, qty: number, depth: number, key: string, path: string[]): Node => {
  const cycle = path.includes(code)
  const r = recipeOf(code)
  const isCrop = (catalog.byCode(r?.factoryCode) as any)?.kind === 'CROP'
  const kids: Node[] = []
  if (!cycle && r && !isCrop) {
    for (const i of r.inputs ?? []) {
      kids.push(build(i.code, i.qty, depth + 1, `${key}/${i.code}`, [...path, code]))
    }
  }
  return { code, qty, depth, key, kids, cycle }
}

const tree = computed<Node | null>(() => (props.root ? build(props.root, 1, 0, props.root, []) : null))

const rootInfo = computed(() => {
  if (!props.root || !recipeOf(props.root)) return null
  const reg = regionOfProduct(props.root)
  const f = catalog.byCode(recipeOf(props.root)?.factoryCode) as any
  return {
    title: titleOf(props.root),
    region: reg,
    stage: stageOf(props.root),
    factory: f && f.kind !== 'CROP' ? f.title : null
  }
})

const toRow = (n: Node, open: boolean): Row => {
  const reg = regionOfProduct(n.code)
  const f = catalog.byCode(recipeOf(n.code)?.factoryCode) as any
  return {
    key: n.key,
    code: n.code,
    title: titleOf(n.code),
    qty: n.qty,
    depth: n.depth,
    hasKids: n.kids.length > 0,
    open,
    region: reg,
    stage: stageOf(n.code),
    foreign: !!ownRegion.value && !!reg && reg !== ownRegion.value,
    status: statusOf(n.code),
    stock: stockOf(n.code),
    factory: f ? (f.kind === 'CROP' ? 'грядка' : f.title) : null,
    cycle: n.cycle
  }
}

const isOpen = (n: Node) => (n.depth < OPEN_DEPTH) !== flipped.value.has(n.key)

const rows = computed<Row[]>(() => {
  const out: Row[] = []
  const walk = (n: Node) => {
    const open = isOpen(n)
    out.push(toRow(n, open))
    if (open) n.kids.forEach(walk)
  }
  if (tree.value) walk(tree.value)
  return out
})

const toggle = (row: Row) => {
  const next = new Set(flipped.value)
  next.has(row.key) ? next.delete(row.key) : next.add(row.key)
  flipped.value = next
}

/* ---------- сводка по всей цепочке (независимо от свёрнутых веток) ---------- */
const summary = computed(() => {
  const foreign = new Map<string, { code: string; title: string; region: string | null; stage: number | null }>()
  const locked = new Map<string, { code: string; title: string }>()
  let own = 0
  const walk = (n: Node) => {
    const reg = regionOfProduct(n.code)
    const isForeign = !!ownRegion.value && !!reg && reg !== ownRegion.value
    if (isForeign) {
      if (!foreign.has(n.code)) foreign.set(n.code, { code: n.code, title: titleOf(n.code), region: reg, stage: stageOf(n.code) })
      return // дальше цепочка чужой страны — это уже забота того игрока
    }
    own++
    const st = statusOf(n.code)
    if ((st === 'locked' || st === 'ready') && !locked.has(n.code)) locked.set(n.code, { code: n.code, title: titleOf(n.code) })
    n.kids.forEach(walk)
  }
  if (tree.value) walk(tree.value)
  return {
    foreign: [...foreign.values()].sort((a, b) => (a.region ?? '').localeCompare(b.region ?? '') || (a.stage ?? 0) - (b.stage ?? 0)),
    locked: [...locked.values()],
    own
  }
})

/* ---------- клики ---------- */
const cd = useClickDbl<Row>(
  (row) => emit('navigate', row.code),
  (row) => emit('note', row.code)
)

/* ---------- копирование текстом ---------- */
const copied = ref(false)
const copy = async () => {
  if (!tree.value) return
  const lines: string[] = []
  const walk = (n: Node) => {
    const reg = regionOfProduct(n.code)
    const f = catalog.byCode(recipeOf(n.code)?.factoryCode) as any
    const where = f && f.kind !== 'CROP' ? `, 🏭 ${f.title}` : f ? ', 🌱 грядка' : ''
    lines.push(`${'  '.repeat(n.depth)}${n.depth ? '• ' : ''}${titleOf(n.code)}${n.depth ? ` ×${n.qty}` : ''} — ${regionStageLabel(reg, stageOf(n.code))}${where}`)
    n.kids.forEach(walk)
  }
  walk(tree.value)
  try {
    await navigator.clipboard.writeText(lines.join('\n'))
    copied.value = true
    setTimeout(() => (copied.value = false), 1800)
  } catch { /* буфер недоступен */ }
}
</script>