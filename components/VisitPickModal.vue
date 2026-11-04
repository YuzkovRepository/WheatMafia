<template>
  <div class="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" @click.self="emit('close')">
    <div class="bg-stone-50 rounded-2xl shadow-2xl w-full max-w-md max-h-[85vh] flex flex-col overflow-hidden">
      <div class="shrink-0 px-5 py-4 border-b border-stone-200 flex items-start justify-between gap-3">
        <div>
          <h2 class="text-xl font-semibold text-stone-800">🕵️ Наведаться в гости</h2>
          <p class="text-xs text-stone-500 mt-0.5">
            Выберите, чью ферму осмотреть. У вас {{ remaining }} из {{ max }} визитов на партию —
            тратить их стоит с умом.
          </p>
        </div>
        <button @click="emit('close')" class="text-stone-500 hover:text-stone-800 text-2xl leading-none">×</button>
      </div>

      <div class="p-4 overflow-y-auto min-h-0 space-y-2">
        <p v-if="!candidates.length" class="text-sm text-stone-500 text-center py-6">В партии пока нет других игроков.</p>

        <button
          v-for="c in candidates"
          :key="c.userId"
          :disabled="disabled"
          @click="emit('pick', c.userId)"
          class="w-full flex items-center gap-3 rounded-xl border-2 border-stone-200 bg-white px-3 py-2.5 text-left transition hover:border-amber-400 hover:bg-amber-50 disabled:opacity-50 disabled:hover:border-stone-200 disabled:hover:bg-white"
        >
          <span class="text-3xl leading-none">{{ regionFlag(c.region) }}</span>
          <span class="min-w-0 flex-1">
            <span class="block font-semibold text-stone-800 truncate">{{ c.nickName }}</span>
            <span class="block text-xs text-stone-500">
              {{ regionName(c.region) }}
              <template v-if="c.visits > 0"> · вы были здесь: {{ c.visits }}</template>
            </span>
          </span>
          <span class="text-sm font-semibold text-amber-700">Пойти →</span>
        </button>
      </div>

      <p v-if="hint" class="shrink-0 px-5 py-2 text-xs bg-amber-50 text-amber-800 border-t border-amber-100">{{ hint }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { VisitCandidate } from '~/stores/visits'
import { regionFlag, regionName } from '~/utils/deputyLook'

defineProps<{
  candidates: VisitCandidate[]
  remaining: number
  max: number
  disabled?: boolean
  hint?: string
}>()
const emit = defineEmits<{ (e: 'close'): void; (e: 'pick', userId: number): void }>()
</script>