<template>
  <div class="select-none" @click.stop @contextmenu.stop>
    <!-- свёрнуто: маленькая кнопка -->
    <button
      v-if="!store.open"
      @click="store.setOpen(true)"
      class="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-stone-900/75 backdrop-blur text-amber-50 border border-white/10 shadow-lg hover:bg-stone-900/90 text-sm font-semibold"
      title="Заметки для себя (хранятся только в этом браузере)"
    >
      <span>📝</span>
      <span>Заметки</span>
      <span
        v-if="store.pending > 0"
        class="min-w-[20px] h-5 px-1 rounded-full bg-amber-400 text-stone-900 text-[11px] font-bold flex items-center justify-center"
      >
        {{ store.pending }}
      </span>
    </button>

    <!-- развёрнуто -->
    <div
      v-else
      class="w-72 max-w-[85vw] rounded-xl bg-stone-900/85 backdrop-blur text-amber-50 border border-white/10 shadow-2xl overflow-hidden"
    >
      <div class="flex items-center justify-between px-3 py-2 border-b border-white/10">
        <div class="text-sm font-semibold">📝 Заметки</div>
        <button @click="store.setOpen(false)" class="text-amber-100/70 hover:text-white text-xl leading-none" title="Свернуть">
          ×
        </button>
      </div>

      <!-- список -->
      <div class="max-h-64 overflow-y-auto px-2 py-2 space-y-1.5">
        <div v-if="!store.notes.length" class="px-1 py-3 text-xs text-amber-100/60 text-center">
          Пока пусто. Выберите продукт, напишите комментарий и нажмите «+». Продукт можно добавить и двойным кликом в справочнике или дереве исследований.
        </div>

        <div
          v-for="n in store.notes"
          :key="n.id"
          class="group flex items-start gap-2 rounded-lg bg-white/5 border border-white/10 px-2 py-1.5"
        >
          <input
            type="checkbox"
            :checked="n.done"
            @change="store.toggle(n.id)"
            class="mt-1 accent-amber-400 cursor-pointer"
            title="Выполнено"
          />
          <div class="flex-1 min-w-0" :class="n.done ? 'opacity-50' : ''">
            <div v-if="n.product" class="flex items-center gap-1 text-xs font-semibold text-amber-300">
              <span class="text-base leading-none">{{ emojiOf(n.product) }}</span>
              <span class="truncate">{{ titleOf(n.product) }}</span>
            </div>
            <div class="text-sm break-words whitespace-pre-wrap" :class="n.done ? 'line-through' : ''">
              {{ n.text }}
            </div>
          </div>
          <button
            @click="store.remove(n.id)"
            class="text-amber-100/40 hover:text-red-400 leading-none text-lg opacity-0 group-hover:opacity-100 focus:opacity-100"
            title="Удалить"
          >
            ×
          </button>
        </div>
      </div>

      <!-- новая заметка -->
      <form @submit.prevent="add" class="px-2 pb-2 pt-1 space-y-1.5 border-t border-white/10">
        <select
          v-model="draftProduct"
          class="w-full rounded-lg bg-stone-800 border border-white/10 text-sm px-2 py-1.5 text-amber-50 focus:outline-none focus:border-amber-400"
        >
          <option value="">— без продукта —</option>
          <option v-for="p in productOptions" :key="p.code" :value="p.code">
            {{ emojiOf(p.code) }} {{ p.title }}
          </option>
        </select>
        <div class="flex gap-1.5">
          <input
            v-model="draftText"
            type="text"
            maxlength="200"
            placeholder="Комментарий…"
            class="flex-1 min-w-0 rounded-lg bg-stone-800 border border-white/10 text-sm px-2 py-1.5 text-amber-50 placeholder-amber-100/40 focus:outline-none focus:border-amber-400"
          />
          <button
            type="submit"
            :disabled="!canAdd"
            class="px-3 rounded-lg bg-amber-500 hover:bg-amber-400 text-stone-900 text-sm font-semibold disabled:opacity-40"
          >
            +
          </button>
        </div>
        <button
          v-if="store.notes.some(n => n.done)"
          type="button"
          @click="store.clearDone()"
          class="text-[11px] text-amber-100/60 hover:text-amber-200 underline"
        >
          Убрать выполненные
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useCatalogStore } from '~/stores/catalog'
import { useNotesStore } from '~/stores/notes'
import { productEmoji } from '~/utils/productLook'

/**
 * Личные заметки игрока. Бэкенд не участвует: всё лежит в localStorage браузера
 * (отдельно для каждой партии и игрока), поэтому на другом устройстве их не будет.
 * Данные в общем сторе notes — туда же добавляет двойной клик из справочника и исследований.
 */
const props = defineProps<{ storageKey: string }>()

const catalog = useCatalogStore()
const store = useNotesStore()

const draftProduct = ref('')
const draftText = ref('')

const productOptions = computed(() =>
  [...(catalog.products ?? [])].sort((a: any, b: any) => String(a.title).localeCompare(String(b.title), 'ru'))
)
const titleOf = (c: string) => catalog.productByCode(c)?.title ?? c
const emojiOf = (c: string) => productEmoji(c)

const canAdd = computed(() => draftText.value.trim().length > 0 || draftProduct.value !== '')

onMounted(() => store.init(props.storageKey))
watch(() => props.storageKey, (k) => { store.loaded = false; store.init(k) })

const add = () => {
  if (!canAdd.value) return
  store.add(draftProduct.value, draftText.value)
  draftText.value = ''
}
</script>