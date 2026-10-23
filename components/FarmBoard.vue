<template>
  <div v-if="board" ref="fitEl" class="farm-fit" :style="{ height: scaledH + 'px' }">
    <div
      ref="sceneEl"
      class="farm-scene"
      :class="{ pointer: hoverReady }"
      :style="{
        width: W + 'px',
        height: H + 'px',
        left: offsetX + 'px',
        transform: `scale(${scale})`
      }"
      @mousemove="onMove"
      @mouseleave="hover = null"
      @click="onClick"
    >
      <!-- Общие картинки для декора (один раз) -->
      <svg width="0" height="0" style="position: absolute" aria-hidden="true">
        <defs>
          <symbol id="fd-tree-a" viewBox="0 0 100 140">
            <ellipse cx="50" cy="132" rx="34" ry="7" fill="rgba(0,0,0,.25)" />
            <rect x="44" y="84" width="12" height="48" rx="3" fill="#7a4a24" />
            <rect x="51" y="84" width="5" height="48" rx="2" fill="#5e3818" />
            <circle cx="32" cy="68" r="26" fill="#3a8429" />
            <circle cx="68" cy="68" r="26" fill="#357a26" />
            <circle cx="50" cy="50" r="38" fill="#3f8f2e" />
            <circle cx="40" cy="38" r="15" fill="#6bbd4f" opacity=".55" />
          </symbol>
          <symbol id="fd-tree-b" viewBox="0 0 100 140">
            <ellipse cx="50" cy="132" rx="34" ry="7" fill="rgba(0,0,0,.25)" />
            <rect x="44" y="84" width="12" height="48" rx="3" fill="#7a4a24" />
            <rect x="51" y="84" width="5" height="48" rx="2" fill="#5e3818" />
            <circle cx="30" cy="70" r="25" fill="#5a9a2e" />
            <circle cx="70" cy="70" r="25" fill="#4f8f28" />
            <circle cx="50" cy="50" r="37" fill="#66a834" />
            <circle cx="40" cy="38" r="14" fill="#9be15d" opacity=".5" />
            <circle cx="36" cy="58" r="4" fill="#e5483d" />
            <circle cx="62" cy="48" r="4" fill="#e5483d" />
            <circle cx="54" cy="70" r="4" fill="#e5483d" />
          </symbol>
          <symbol id="fd-pine" viewBox="0 0 80 150">
            <ellipse cx="40" cy="143" rx="26" ry="6" fill="rgba(0,0,0,.25)" />
            <rect x="35" y="118" width="10" height="25" rx="2" fill="#6b4020" />
            <polygon points="40,58 78,120 2,120" fill="#245f2c" />
            <polygon points="40,30 74,86 6,86" fill="#2a6e33" />
            <polygon points="40,4 68,56 12,56" fill="#2f7a3a" />
          </symbol>
          <symbol id="fd-bush" viewBox="0 0 80 50">
            <ellipse cx="40" cy="45" rx="32" ry="5" fill="rgba(0,0,0,.22)" />
            <circle cx="26" cy="30" r="20" fill="#4c9a35" />
            <circle cx="54" cy="28" r="22" fill="#3f8a2d" />
            <circle cx="40" cy="22" r="18" fill="#5bb043" />
          </symbol>
          <symbol id="fd-rock" viewBox="0 0 60 40">
            <ellipse cx="30" cy="36" rx="26" ry="4" fill="rgba(0,0,0,.25)" />
            <polygon points="6,34 14,12 34,4 52,14 56,34" fill="#9ca3a8" stroke="#6b7378"
                     stroke-width="2" stroke-linejoin="round" />
            <polygon points="14,12 34,4 40,16 22,22" fill="#c4cacd" opacity=".8" />
          </symbol>
          <symbol id="fd-flower-a" viewBox="0 0 60 30">
            <g stroke="#3c7a2a" stroke-width="2">
              <line x1="10" y1="18" x2="10" y2="30" />
              <line x1="30" y1="10" x2="30" y2="30" />
              <line x1="48" y1="20" x2="48" y2="30" />
            </g>
            <g fill="#f472b6">
              <circle cx="10" cy="18" r="6" /><circle cx="30" cy="10" r="6" /><circle cx="48" cy="20" r="6" />
            </g>
            <g fill="#fde047">
              <circle cx="10" cy="18" r="2.5" /><circle cx="30" cy="10" r="2.5" /><circle cx="48" cy="20" r="2.5" />
            </g>
          </symbol>
          <symbol id="fd-flower-b" viewBox="0 0 60 30">
            <g stroke="#3c7a2a" stroke-width="2">
              <line x1="14" y1="16" x2="14" y2="30" />
              <line x1="36" y1="12" x2="36" y2="30" />
              <line x1="52" y1="22" x2="52" y2="30" />
            </g>
            <g fill="#ffffff">
              <circle cx="14" cy="16" r="6" /><circle cx="36" cy="12" r="6" /><circle cx="52" cy="22" r="6" />
            </g>
            <g fill="#f59e0b">
              <circle cx="14" cy="16" r="2.5" /><circle cx="36" cy="12" r="2.5" /><circle cx="52" cy="22" r="2.5" />
            </g>
          </symbol>
        </defs>
      </svg>

      <!-- Декор за полем (верхняя половина) -->
      <svg class="decor" :width="W" :height="H" :viewBox="`0 0 ${W} ${H}`">
        <g v-for="(d, i) in decorBack" :key="'b' + i"
           :transform="d.flip ? `translate(${d.x * 2} 0) scale(-1 1)` : undefined">
          <use :href="d.href" :x="d.x - d.w / 2" :y="d.y - d.h" :width="d.w" :height="d.h" />
        </g>
      </svg>

      <!-- Земляной «срез» и тень -->
      <svg class="slab" :width="W" :height="H" :viewBox="`0 0 ${W} ${H}`">
        <defs>
          <linearGradient id="fb-l" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stop-color="#8d5d34" />
            <stop offset="1" stop-color="#583820" />
          </linearGradient>
          <linearGradient id="fb-r" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stop-color="#744a28" />
            <stop offset="1" stop-color="#46301b" />
          </linearGradient>
          <filter id="fb-blur"><feGaussianBlur stdDeviation="9" /></filter>
        </defs>
        <ellipse :cx="cx" :cy="cy + hh + SLAB + 10" :rx="hw * 1.06" :ry="hh * 0.6"
                 fill="rgba(0,0,0,0.3)" filter="url(#fb-blur)" />
        <polygon :points="leftFace" fill="url(#fb-l)" />
        <polygon :points="rightFace" fill="url(#fb-r)" />
        <polyline :points="lip" fill="none" stroke="#4f7d2b" stroke-width="5" stroke-linejoin="round" />
      </svg>

      <!-- Плоскость поля (повёрнута в изометрию) -->
      <div class="plane" :style="planeStyle">
        <div class="grass" />

        <!-- грядки под культурами -->
        <div v-for="o in crops" :key="'soil' + o.id" class="soil"
             :class="{ ready: isReady(o) }"
             :style="rectStyle(o.col, o.row, o.width, o.height, 3)" />

        <!-- подсветка места размещения -->
        <div v-if="preview" class="preview" :class="{ bad: !preview.valid }"
             :style="rectStyle(preview.col, preview.row, plantWidth, plantHeight, 1)" />

        <div class="rim" />
      </div>

      <!-- Забор и декор перед полем -->
      <svg class="decor" :width="W" :height="H" :viewBox="`0 0 ${W} ${H}`">
        <polyline :points="fence.rail1" fill="none" stroke="#b98450" stroke-width="3"
                  stroke-linecap="round" stroke-linejoin="round" />
        <polyline :points="fence.rail2" fill="none" stroke="#b98450" stroke-width="3"
                  stroke-linecap="round" stroke-linejoin="round" />
        <line v-for="(p, i) in fence.posts" :key="'p' + i"
              :x1="p.x" :y1="p.y" :x2="p.x" :y2="p.y - 20"
              stroke="#7a4a24" stroke-width="5" stroke-linecap="round" />
        <g v-for="(d, i) in decorFront" :key="'f' + i"
           :transform="d.flip ? `translate(${d.x * 2} 0) scale(-1 1)` : undefined">
          <use :href="d.href" :x="d.x - d.w / 2" :y="d.y - d.h" :width="d.w" :height="d.h" />
        </g>
      </svg>

      <!-- Всё, что стоит на поле: картинки из /object (имя файла = icon из каталога) -->
      <div class="sprites">
        <div v-for="s in sprites" :key="s.id" class="sprite" :style="s.style">
          <div class="body" :class="{ ready: s.ready }" :style="{ transform: `scale(${s.grow})` }">
            <img v-if="s.src && !broken.has(s.src)" :src="s.src" alt="" draggable="false"
                 @error="broken.add(s.src)" />
            <!-- если файла нет — видно, какое имя ожидается -->
            <div v-else class="missing">{{ s.code }}<br />{{ s.src || 'нет icon в каталоге' }}</div>
          </div>
          <div v-if="s.ready" class="bubble">✓</div>
          <div v-else-if="s.isCrop" class="bar">
            <div class="fill" :style="{ width: s.pct * 100 + '%' }" />
          </div>
        </div>

        <!-- «призрак» выбранного объекта -->
        <div v-if="preview && previewSrc && !broken.has(previewSrc)"
             class="sprite ghost" :style="ghostStyle">
          <div class="body" :style="{ transform: `scale(${previewKind === 'CROP' ? 0.45 : 1})` }">
            <img :src="previewSrc" alt="" draggable="false" @error="broken.add(previewSrc!)" />
          </div>
        </div>
      </div>
    </div>
  </div>
  <div v-else class="text-stone-500 text-center py-12">Загрузка фермы…</div>
</template>

<script setup lang="ts">
import type { PlacedObject, Cell } from '~/stores/board'
import { useCatalogStore } from '~/stores/catalog'

const props = withDefaults(
  defineProps<{
    board: { size: number; objects: PlacedObject[]; cells?: Cell[] } | null
    cellPx?: number
    plantWidth?: number
    plantHeight?: number
    previewSrc?: string
    previewKind?: 'CROP' | 'BUILDING'
  }>(),
  { cellPx: 56, plantWidth: 2, plantHeight: 2, previewKind: 'CROP' }
)

const emit = defineEmits<{
  (e: 'object-click', obj: PlacedObject): void
  (e: 'cell-click', cell: Cell): void
}>()

const catalogStore = useCatalogStore()

/* ---------- настройки внешнего вида ---------- */
const PAD_X = 40
const PAD_TOP = 200      // место над полем для высоких построек
const PAD_BOTTOM = 40
const SLAB = 30          // толщина «земли» под полем
const CROP_K = 1         // ширина спрайта культуры относительно ромба клетки
const BUILDING_K = 1.1   // ширина спрайта постройки
const LIFT = 0.55        // насколько основание картинки заходит в ромб (0..1)

/* ---------- время ---------- */
const now = ref(Date.now())
let timer: ReturnType<typeof setInterval> | null = null
onMounted(() => { timer = setInterval(() => (now.value = Date.now()), 1000) })
onBeforeUnmount(() => { if (timer) clearInterval(timer) })

const toMs = (v?: string | number) =>
  !v ? 0 : typeof v === 'number' ? (v < 1e12 ? v * 1000 : v) : new Date(v).getTime()
const clamp = (v: number, a: number, b: number) => Math.min(Math.max(v, a), b)
const isReady = (o: PlacedObject) => o.kind === 'CROP' && now.value >= toMs(o.readyAt)
const progress = (o: PlacedObject) => {
  const start = toMs(o.plantedAt), end = toMs(o.readyAt)
  if (!end || end <= start) return isReady(o) ? 1 : 0
  return clamp((now.value - start) / (end - start), 0, 1)
}

/* ---------- геометрия изометрии ---------- */
const K = Math.SQRT1_2
const cell = computed(() => props.cellPx)
const size = computed(() => props.board?.size ?? 24)
const S = computed(() => size.value * cell.value)
const hw = computed(() => S.value * K)
const hh = computed(() => (S.value * K) / 2)
const W = computed(() => Math.round(2 * hw.value + 2 * PAD_X))
const H = computed(() => Math.round(2 * hh.value + PAD_TOP + PAD_BOTTOM + SLAB))
const cx = computed(() => W.value / 2)
const cy = computed(() => PAD_TOP + hh.value)

// координаты в клетках (дробные) -> пиксели сцены
const project = (col: number, row: number) => {
  const x = col * cell.value - S.value / 2
  const y = row * cell.value - S.value / 2
  return { x: cx.value + (x - y) * K, y: cy.value + (x + y) * K * 0.5 }
}
// пиксели сцены -> координаты в клетках
const unproject = (px: number, py: number) => {
  const dx = px - cx.value
  const dy = py - cy.value
  const x = (dx / K + (2 * dy) / K) / 2
  const y = ((2 * dy) / K - dx / K) / 2
  return { col: (x + S.value / 2) / cell.value, row: (y + S.value / 2) / cell.value }
}

const leftFace = computed(() => {
  const L = { x: cx.value - hw.value, y: cy.value }
  const B = { x: cx.value, y: cy.value + hh.value }
  return `${L.x},${L.y} ${B.x},${B.y} ${B.x},${B.y + SLAB} ${L.x},${L.y + SLAB}`
})
const rightFace = computed(() => {
  const R = { x: cx.value + hw.value, y: cy.value }
  const B = { x: cx.value, y: cy.value + hh.value }
  return `${B.x},${B.y} ${R.x},${R.y} ${R.x},${R.y + SLAB} ${B.x},${B.y + SLAB}`
})
const lip = computed(() => {
  const L = { x: cx.value - hw.value, y: cy.value }
  const B = { x: cx.value, y: cy.value + hh.value }
  const R = { x: cx.value + hw.value, y: cy.value }
  return `${L.x},${L.y} ${B.x},${B.y} ${R.x},${R.y}`
})

const planeStyle = computed(() => ({
  width: `${S.value}px`,
  height: `${S.value}px`,
  left: `${cx.value - S.value / 2}px`,
  top: `${cy.value - S.value / 2}px`,
  '--c': `${cell.value}px`
}))

const rectStyle = (col: number, row: number, w: number, h: number, inset: number) => ({
  left: `${col * cell.value + inset}px`,
  top: `${row * cell.value + inset}px`,
  width: `${w * cell.value - inset * 2}px`,
  height: `${h * cell.value - inset * 2}px`
})

/* ---------- автоподгонка под ширину контейнера ---------- */
const fitEl = ref<HTMLElement | null>(null)
const sceneEl = ref<HTMLElement | null>(null)
const avail = ref(0)
const scale = computed(() => (avail.value > 0 ? Math.min(1, avail.value / W.value) : 1))
const scaledH = computed(() => Math.round(H.value * scale.value))
const offsetX = computed(() => Math.max(0, Math.round((avail.value - W.value * scale.value) / 2)))

watch(
  fitEl,
  (el, _old, onCleanup) => {
    if (!el) return
    avail.value = el.clientWidth
    const ro = new ResizeObserver(() => (avail.value = el.clientWidth))
    ro.observe(el)
    onCleanup(() => ro.disconnect())
  },
  { flush: 'post' }
)

/* ---------- декор вокруг фермы ---------- */
type DecorKind = 'tree' | 'pine' | 'bush' | 'rock' | 'flower'
// w — ширина в клетках, ratio — высота/ширина символа
const DECOR_SPEC: Record<DecorKind, { w: number; ratio: number }> = {
  tree:   { w: 1.9, ratio: 1.4 },
  pine:   { w: 1.3, ratio: 1.875 },
  bush:   { w: 1.1, ratio: 0.625 },
  rock:   { w: 0.8, ratio: 0.667 },
  flower: { w: 0.9, ratio: 0.5 }
}

// детерминированный генератор: расстановка не «прыгает» при перерисовке
const mulberry32 = (a: number) => () => {
  a = (a + 0x6d2b79f5) | 0
  let t = Math.imul(a ^ (a >>> 15), 1 | a)
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296
}

const decor = computed(() => {
  const rnd = mulberry32(20261023)
  const out: { href: string; x: number; y: number; w: number; h: number; flip: boolean; front: boolean }[] = []
  const target = Math.round((W.value * H.value) / 11000)
  const cyEff = cy.value + SLAB / 2
  const hhEff = hh.value + SLAB / 2

  for (let tries = 0; out.length < target && tries < target * 30; tries++) {
    const x = 24 + rnd() * (W.value - 48)
    const y = 24 + rnd() * (H.value - 36)

    // не заходим на само поле (ромб) и на его земляной срез
    const d = Math.abs(x - cx.value) / hw.value + Math.abs(y - cyEff) / hhEff
    if (d < 1.1) continue

    const r = rnd()
    const kind: DecorKind =
      r < 0.32 ? 'tree' : r < 0.44 ? 'pine' : r < 0.66 ? 'bush' : r < 0.78 ? 'rock' : 'flower'
    const spec = DECOR_SPEC[kind]
    const w = spec.w * cell.value * (0.8 + rnd() * 0.4)
    const h = w * spec.ratio
    if (y - h < 4) continue // крона не должна вылезать за верх сцены
    if (out.some(o => Math.hypot(o.x - x, (o.y - y) * 1.7) < (o.w + w) * 0.3)) continue

    const alt = rnd() < 0.5
    const href =
      kind === 'tree' ? (alt ? '#fd-tree-a' : '#fd-tree-b')
      : kind === 'flower' ? (alt ? '#fd-flower-a' : '#fd-flower-b')
      : `#fd-${kind}`
    out.push({ href, x, y, w, h, flip: rnd() < 0.5, front: y > cy.value })
  }
  return out.sort((a, b) => a.y - b.y) // дальние рисуются раньше ближних
})
const decorBack = computed(() => decor.value.filter(d => !d.front))
const decorFront = computed(() => decor.value.filter(d => d.front))

// забор вдоль двух дальних сторон поля
const fence = computed(() => {
  const T = { x: cx.value, y: cy.value - hh.value }
  const L = { x: cx.value - hw.value, y: cy.value }
  const R = { x: cx.value + hw.value, y: cy.value }
  const n = Math.max(2, Math.round(size.value / 2))
  const posts: { x: number; y: number }[] = []
  for (let i = 0; i <= n; i++)
    posts.push({ x: L.x + ((T.x - L.x) * i) / n, y: L.y + ((T.y - L.y) * i) / n })
  for (let i = 1; i <= n; i++)
    posts.push({ x: T.x + ((R.x - T.x) * i) / n, y: T.y + ((R.y - T.y) * i) / n })
  const rail = (up: number) => posts.map(p => `${p.x},${p.y - up}`).join(' ')
  return { posts, rail1: rail(7), rail2: rail(15) }
})

/* ---------- объекты и спрайты ---------- */
const crops = computed(() => (props.board?.objects ?? []).filter(o => o.kind === 'CROP'))
const broken = reactive(new Set<string>())

// клетка -> объект, который её занимает
const owner = computed(() => {
  const m = new Map<number, PlacedObject>()
  const n = size.value
  for (const o of props.board?.objects ?? [])
    for (let r = o.row; r < o.row + o.height; r++)
      for (let c = o.col; c < o.col + o.width; c++) m.set(r * n + c, o)
  return m
})

// позиция спрайта: центр основания = низ ромба, который занимает объект
const spriteBox = (col: number, row: number, w: number, h: number, kind: string) => {
  const c = project(col + w / 2, row + h / 2)
  const halfW = ((w + h) * cell.value * K) / 2
  const width = halfW * 2 * (kind === 'BUILDING' ? BUILDING_K : CROP_K)
  return {
    left: `${c.x}px`,
    top: `${c.y + (halfW / 2) * LIFT}px`,
    width: `${width}px`
  }
}

const sprites = computed(() =>
  (props.board?.objects ?? []).map(o => {
    const isCrop = o.kind === 'CROP'
    const code = (isCrop ? o.crop : o.building) ?? ''
    const item = catalogStore.byCode(code) // имя файла берём из icon каталога
    const pct = isCrop ? progress(o) : 1
    return {
      id: o.id,
      code,
      src: objectSrc(item?.icon),
      isCrop,
      pct,
      ready: isReady(o),
      grow: isCrop ? 0.45 + 0.55 * pct : 1, // культура «растёт» визуально
      style: {
        ...spriteBox(o.col, o.row, o.width, o.height, o.kind),
        zIndex: Math.round((o.row + o.height + o.col + o.width) * 10) // дальше от зрителя — ниже
      }
    }
  })
)

/* ---------- наведение и клик ---------- */
const hover = ref<{ col: number; row: number } | null>(null)

const toCell = (e: MouseEvent) => {
  const r = sceneEl.value!.getBoundingClientRect()
  return unproject((e.clientX - r.left) / scale.value, (e.clientY - r.top) / scale.value)
}
const inside = (p: { col: number; row: number }) =>
  p.col >= 0 && p.row >= 0 && p.col < size.value && p.row < size.value

const onMove = (e: MouseEvent) => {
  if (!sceneEl.value) return
  const p = toCell(e)
  hover.value = inside(p) ? p : null
}

const preview = computed(() => {
  const h = hover.value
  if (!h || !props.board) return null
  const n = size.value, pw = props.plantWidth, ph = props.plantHeight
  const col = clamp(Math.round(h.col - pw / 2), 0, Math.max(0, n - pw))
  const row = clamp(Math.round(h.row - ph / 2), 0, Math.max(0, n - ph))
  let valid = pw <= n && ph <= n
  for (let r = row; r < row + ph && valid; r++)
    for (let c = col; c < col + pw; c++)
      if (owner.value.has(r * n + c)) { valid = false; break }
  return { col, row, valid }
})

const ghostStyle = computed(() =>
  preview.value
    ? {
        ...spriteBox(preview.value.col, preview.value.row, props.plantWidth, props.plantHeight, props.previewKind),
        zIndex: 9999
      }
    : {}
)

const hoverReady = computed(() => {
  const h = hover.value
  if (!h) return false
  const o = owner.value.get(Math.floor(h.row) * size.value + Math.floor(h.col))
  return !!o && isReady(o)
})

const onClick = (e: MouseEvent) => {
  if (!props.board || !sceneEl.value) return
  onMove(e) // на тач-экранах mousemove не было
  const h = hover.value
  if (!h) return

  // сначала проверяем объект под курсором (сбор урожая важнее посадки)
  const obj = owner.value.get(Math.floor(h.row) * size.value + Math.floor(h.col))
  if (obj) { emit('object-click', obj); return }

  const pv = preview.value
  if (pv?.valid) {
    const index = pv.row * size.value + pv.col
    emit('cell-click', props.board.cells?.[index] ?? ({ index, type: 'EMPTY' } as Cell))
  }
}
</script>

<style scoped>
.farm-fit {
  position: relative; width: 100%; overflow: hidden;
  /* луг вокруг фермы: пятна света, лёгкий узор, затемнение к краям */
  background:
    radial-gradient(circle at 12% 18%, rgba(190, 235, 120, 0.35), transparent 30%),
    radial-gradient(circle at 88% 82%, rgba(190, 235, 120, 0.25), transparent 30%),
    radial-gradient(ellipse at 50% 55%, transparent 40%, rgba(15, 50, 20, 0.45) 100%),
    radial-gradient(rgba(255, 255, 255, 0.07) 1.5px, transparent 2px) 0 0 / 22px 22px,
    #5f9d3a;
}
.farm-scene { position: absolute; top: 0; transform-origin: 0 0; user-select: none; cursor: crosshair; }
.farm-scene.pointer { cursor: pointer; }
.slab { position: absolute; left: 0; top: 0; pointer-events: none; }
.decor { position: absolute; left: 0; top: 0; pointer-events: none; }

/* поле: поворот 45° и сжатие по вертикали = изометрия */
.plane { position: absolute; transform-origin: 50% 50%; transform: scaleY(0.5) rotate(45deg); pointer-events: none; }
.grass {
  position: absolute; inset: 0;
  background-color: #78bd45;
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.07) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.07) 1px, transparent 1px),
    repeating-conic-gradient(rgba(0, 0, 0, 0.045) 0% 25%, transparent 0% 50%),
    radial-gradient(circle at 20% 30%, rgba(170, 230, 100, 0.55), transparent 28%),
    radial-gradient(circle at 75% 70%, rgba(40, 120, 50, 0.3), transparent 32%);
  background-size:
    var(--c) var(--c),
    var(--c) var(--c),
    calc(var(--c) * 2) calc(var(--c) * 2),
    100% 100%,
    100% 100%;
}
.rim { position: absolute; inset: 0; box-shadow: inset 0 0 0 3px rgba(60, 100, 30, 0.65); }

.soil {
  position: absolute; border-radius: 6px;
  background: repeating-linear-gradient(90deg, #8a5a32 0 10px, #7a4d2a 10px 20px);
  box-shadow: inset 0 0 0 2px #5e3b1f, inset 0 0 14px rgba(0, 0, 0, 0.35);
}
.soil.ready { box-shadow: inset 0 0 0 2px #facc15, 0 0 14px rgba(250, 204, 21, 0.8); }

.preview {
  position: absolute; border-radius: 4px;
  background: rgba(120, 255, 120, 0.35);
  box-shadow: inset 0 0 0 3px rgba(255, 255, 255, 0.9);
}
.preview.bad { background: rgba(255, 70, 70, 0.4); }

/* спрайты */
.sprites { position: absolute; inset: 0; pointer-events: none; }
.sprite { position: absolute; transform: translate(-50%, -100%); }
.sprite img {
  display: block; width: 100%; height: auto;
  filter: drop-shadow(0 6px 4px rgba(0, 0, 0, 0.28));
}
.body { transform-origin: 50% 100%; transition: transform 1s linear; }
.body.ready img {
  filter: drop-shadow(0 0 8px rgba(255, 214, 64, 0.95)) drop-shadow(0 6px 4px rgba(0, 0, 0, 0.28));
}
.ghost { opacity: 0.65; }

.missing {
  aspect-ratio: 1; display: flex; flex-direction: column; align-items: center; justify-content: center;
  border: 2px dashed rgba(255, 255, 255, 0.85); background: rgba(0, 0, 0, 0.3);
  color: #fff; font: 600 11px sans-serif; text-align: center; padding: 4px; word-break: break-all;
}

.bubble {
  position: absolute; left: 50%; top: -6px; width: 28px; height: 28px; border-radius: 50%;
  background: #facc15; color: #44300a; font-weight: 800;
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.4);
  animation: bob 1s ease-in-out infinite;
}
@keyframes bob {
  0%, 100% { transform: translate(-50%, 0); }
  50% { transform: translate(-50%, -6px); }
}

.bar {
  position: absolute; left: 50%; bottom: 6px; width: 46%; height: 7px;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.45); border-radius: 4px; overflow: hidden;
}
.fill { height: 100%; background: linear-gradient(#a3e635, #65a30d); transition: width 1s linear; }
</style>