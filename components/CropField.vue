<template>
  <div class="crop-field" :class="{ ready: stage >= 4 }">
    <svg :width="box.width" :height="box.height" :viewBox="`0 0 ${box.width} ${box.height}`" :style="vars">
      <use v-for="p in plants" :key="p.key" :href="p.href"
           :x="p.x" :y="p.y" :width="p.w" :height="p.h" />
    </svg>
  </div>
</template>

<script setup lang="ts">
import { CROP_LOOK, fieldBox, cropRandom } from '~/utils/cropLook'
import type { CropKind } from '~/utils/cropLook'

const props = defineProps<{
  kind: CropKind
  w: number
  h: number
  cell: number
  stage: number
  seed?: number
}>()

// цвета неспелой и спелой культуры (читаются внутри символов через var(--a), var(--b), var(--t))
const PALETTE: Record<CropKind, { unripe: Record<string, string>; ripe: Record<string, string> }> = {
  // ===== Италия =====
  wheat:        { unripe: { '--a': '#7fb64a', '--b': '#a9cf5e' }, ripe: { '--a': '#d9aa33', '--b': '#f4c84a' } },
  tomato:       { unripe: { '--a': '#8cc152' },                    ripe: { '--a': '#e43d30' } },
  olive:        { unripe: { '--a': '#7ea83a' },                    ripe: { '--a': '#2f4d12' } },
  grape:        { unripe: { '--a': '#8cc152' },                    ripe: { '--a': '#6b2d92' } },
  basil:        { unripe: { '--a': '#7fb64a', '--b': '#a9cf5e' },  ripe: { '--a': '#3d8a2e', '--b': '#4aa13e' } },
  lemon:        { unripe: { '--a': '#c9d96a' },                    ripe: { '--a': '#fcd34d' } },

  // ===== Япония =====
  rice:         { unripe: { '--a': '#7ea83a', '--b': '#a5c24a' },  ripe: { '--a': '#b89238', '--b': '#e4c264' } },
  soybean:      { unripe: { '--a': '#c9d9a0' },                    ripe: { '--a': '#d9d28a' } },
  tea_leaf:     { unripe: { '--a': '#7fb64a', '--b': '#a9cf5e' },  ripe: { '--a': '#3d8a2e', '--b': '#5bb54a' } },
  seaweed:      { unripe: { '--a': '#4a7a5a', '--b': '#5a8a6a' },  ripe: { '--a': '#1f4a2e', '--b': '#2e6b3a' } },
  ginger:       { unripe: { '--a': '#e0cd9a', '--b': '#a9cf5e' },  ripe: { '--a': '#d9b87a', '--b': '#6ab54a' } },
  sesame:       { unripe: { '--a': '#d9d2b0' },                    ripe: { '--a': '#efe8d0' } },

  // ===== Египет =====
  barley:       { unripe: { '--a': '#7ea83a', '--b': '#a5c24a' },  ripe: { '--a': '#b89238', '--b': '#e4c264' } },
  dates:        { unripe: { '--a': '#d9a05a' },                    ripe: { '--a': '#c97a2a' } },
  flax:         { unripe: { '--a': '#a9c9e0', '--b': '#d9d2b0' },  ripe: { '--a': '#7ea8d9', '--b': '#d9c65a' } },
  chickpea:     { unripe: { '--a': '#e0cd9a' },                    ripe: { '--a': '#d9b87a' } },
  spice:        { unripe: { '--a': '#a9cf5e', '--b': '#d9a05a' },  ripe: { '--a': '#d63b2f', '--b': '#f59e0b' } },
  papyrus:      { unripe: { '--a': '#7ea83a', '--b': '#6a9a3a' },  ripe: { '--a': '#8fb54a', '--b': '#6a9a3a' } },

  // ===== Бразилия =====
  coffee_berry: { unripe: { '--a': '#7ea83a' },                    ripe: { '--a': '#b83a2a' } },
  sugarcane:    { unripe: { '--a': '#a9c95e', '--b': '#7ea83a' },  ripe: { '--a': '#d9c65a', '--b': '#6ab54a' } },
  cocoa_bean:   { unripe: { '--a': '#a9cf5e' },                    ripe: { '--a': '#b85a2a' } },
  corn:         { unripe: { '--a': '#a9cf5e', '--b': '#7ea83a' },  ripe: { '--a': '#f4c84a', '--b': '#6ab54a' } },
  cassava:      { unripe: { '--a': '#7ea83a', '--b': '#d9c9a0' },  ripe: { '--a': '#4a8a3a', '--b': '#d9c9a0' } },
  mango:        { unripe: { '--a': '#a9cf5e' },                    ripe: { '--a': '#f5b93b' } },
  banana:       { unripe: { '--a': '#c9d96a' },                    ripe: { '--a': '#f5d33b' } },

  // ===== Старые =====
  potato:       { unripe: { '--a': '#cfe8b0', '--t': '0' },        ripe: { '--a': '#ffffff', '--t': '1' } },
  sunflower:    { unripe: { '--a': '#9fc04a', '--b': '#5f8a2a' },  ripe: { '--a': '#ffc61a', '--b': '#5a3a1b' } }
}

// масштаб растения по стадиям
const SCALE = [0.8, 0.5, 0.7, 0.88, 1]

const box = computed(() => fieldBox(props.w, props.h, props.cell))
const vars = computed(() => PALETTE[props.kind][props.stage >= 4 ? 'ripe' : 'unripe'])

const plants = computed(() => {
  const look = CROP_LOOK[props.kind]
  const per = look.perCell
  const nx = Math.round(props.w * per)
  const ny = Math.round(props.h * per)
  const { x0, padTop } = box.value
  const K = Math.SQRT1_2
  const rnd = cropRandom((props.seed ?? 1) * 7919)
  const href = props.stage === 0 ? '#fc-sprout' : `#fc-${props.kind}`
  const base = look.size * props.cell

  const out: { key: string; href: string; depth: number; x: number; y: number; w: number; h: number }[] = []
  for (let j = 0; j < ny; j++) {
    for (let i = 0; i < nx; i++) {
      const u = (i + 0.5) / per + (rnd() - 0.5) * (0.3 / per)
      const v = (j + 0.5) / per + (rnd() - 0.5) * (0.3 / per)
      const sx = x0 + (u - v) * props.cell * K
      const sy = padTop + (u + v) * props.cell * K * 0.5
      const s = SCALE[props.stage] * (0.92 + rnd() * 0.16)
      const pw = base * s
      const ph = pw * 1.4
      out.push({ key: `${i}-${j}`, href, depth: u + v, x: sx - pw / 2, y: sy - (ph * 66) / 70, w: pw, h: ph })
    }
  }
  return out.sort((a, b) => a.depth - b.depth)
})
</script>

<style scoped>
.crop-field { position: absolute; }
.crop-field.ready svg { filter: drop-shadow(0 0 7px rgba(255, 214, 64, 0.85)); }
</style>