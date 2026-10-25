<template>
  <!-- культура: SVG-символ из спрайта #fc-* (он объявлен на странице фермы) -->
  <svg
    v-if="crop"
    viewBox="0 0 50 70"
    :style="{ width: size + 'px', height: size + 'px' }"
    class="shrink-0"
    aria-hidden="true"
  >
    <use :href="`#fc-${crop}`" x="0" y="0" width="50" height="70" />
  </svg>
  <!-- остальные продукты: эмодзи -->
  <span
    v-else
    class="shrink-0 text-center leading-none"
    :style="{ width: size + 'px', fontSize: size * 0.8 + 'px' }"
  >{{ productEmoji(code) }}</span>
</template>

<script setup lang="ts">
import { useCatalogStore } from '~/stores/catalog'
import { cropKind } from '~/utils/cropLook'
import { productEmoji } from '~/utils/productLook'

const props = withDefaults(defineProps<{ code?: string | null; size?: number }>(), { size: 40 })

const catalog = useCatalogStore()

// SVG только для настоящих культур: cropKind('tomato_can') тоже даёт 'tomato'
const crop = computed(() =>
  props.code && catalog.productByCode(props.code)?.kind === 'CROP' ? cropKind(props.code) : null
)
</script>