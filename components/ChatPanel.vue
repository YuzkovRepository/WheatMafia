<template>
  <div class="select-none" @click.stop @contextmenu.stop>
    <button
      @click="toggle"
      class="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-stone-900/75 backdrop-blur text-amber-50 border border-white/10 shadow-lg hover:bg-stone-900/90 text-sm font-semibold"
      title="Личные сообщения игрокам (читаете только вы двое)"
    >
      <span>💬</span>
      <span>Чат</span>
      <span
        v-if="store.totalUnread > 0"
        class="min-w-[20px] h-5 px-1 rounded-full bg-red-500 text-white text-[11px] font-bold flex items-center justify-center"
      >
        {{ store.totalUnread }}
      </span>
    </button>

    <div
      v-if="open"
      class="mt-2 w-80 max-w-[88vw] rounded-xl bg-stone-900/90 backdrop-blur text-amber-50 border border-white/10 shadow-2xl overflow-hidden"
    >
      <!-- список собеседников -->
      <template v-if="store.openId == null">
        <div class="px-3 py-2 border-b border-white/10 text-sm font-semibold flex items-center justify-between">
          <span>💬 Личные сообщения</span>
          <button @click="open = false" class="text-amber-100/70 hover:text-white text-xl leading-none">×</button>
        </div>
        <div class="max-h-72 overflow-y-auto p-2 space-y-1.5">
          <p v-if="!store.partners.length" class="text-xs text-amber-100/60 text-center py-4">
            В партии пока нет других игроков.
          </p>
          <button
            v-for="p in store.partners"
            :key="p.userId"
            @click="pick(p.userId)"
            class="w-full flex items-center gap-2 rounded-lg bg-white/5 hover:bg-white/15 border border-white/10 px-2 py-1.5 text-left"
          >
            <span class="text-xl leading-none">{{ regionFlag(p.region) }}</span>
            <span class="min-w-0 flex-1">
              <span class="block text-sm font-semibold truncate">{{ p.nickName }}</span>
              <span class="block text-[11px] text-amber-100/60 truncate">
                <template v-if="p.lastText">{{ p.lastMine ? 'Вы: ' : '' }}{{ p.lastText }}</template>
                <template v-else>Написать…</template>
              </span>
            </span>
            <span
              v-if="p.unread > 0"
              class="min-w-[20px] h-5 px-1 rounded-full bg-red-500 text-white text-[11px] font-bold flex items-center justify-center"
            >
              {{ p.unread }}
            </span>
          </button>
        </div>
        <p class="px-3 py-1.5 text-[10px] text-amber-100/40 border-t border-white/10">
          Переписку видите только вы и собеседник.
        </p>
      </template>

      <!-- переписка -->
      <template v-else>
        <div class="px-3 py-2 border-b border-white/10 flex items-center gap-2">
          <button @click="back" class="text-amber-100/80 hover:text-white text-lg leading-none" title="К списку">←</button>
          <div class="flex-1 min-w-0 text-sm font-semibold truncate">{{ store.openNick || '…' }}</div>
          <button @click="open = false" class="text-amber-100/70 hover:text-white text-xl leading-none">×</button>
        </div>

        <div ref="listEl" class="h-64 overflow-y-auto p-2 space-y-1.5">
          <p v-if="!store.messages.length && !store.isLoading" class="text-xs text-amber-100/50 text-center py-6">
            Сообщений пока нет. Напишите первым.
          </p>
          <div
            v-for="m in store.messages"
            :key="m.id"
            class="flex"
            :class="m.mine ? 'justify-end' : 'justify-start'"
          >
            <div
              class="max-w-[80%] rounded-xl px-2.5 py-1.5 text-sm break-words whitespace-pre-wrap"
              :class="m.mine ? 'bg-amber-500 text-stone-900' : 'bg-white/10 text-amber-50'"
            >
              {{ m.text }}
              <div class="text-[10px] mt-0.5" :class="m.mine ? 'text-stone-700/70' : 'text-amber-100/40'">
                {{ time(m.createdAtMs) }}
              </div>
            </div>
          </div>
        </div>

        <p v-if="store.error" class="px-3 py-1 text-[11px] text-red-300 border-t border-white/10">{{ store.error }}</p>

        <form @submit.prevent="send" class="p-2 border-t border-white/10 flex gap-1.5">
          <input
            v-model="draft"
            type="text"
            maxlength="500"
            placeholder="Сообщение…"
            class="flex-1 min-w-0 rounded-lg bg-stone-800 border border-white/10 text-sm px-2 py-1.5 text-amber-50 placeholder-amber-100/40 focus:outline-none focus:border-amber-400"
          />
          <button
            type="submit"
            :disabled="!draft.trim() || sending"
            class="px-3 rounded-lg bg-amber-500 hover:bg-amber-400 text-stone-900 text-sm font-semibold disabled:opacity-40"
          >
            ➤
          </button>
        </form>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { nextTick, onMounted, ref, watch } from 'vue'
import { useChatStore } from '~/stores/chat'
import { regionFlag } from '~/utils/deputyLook'

const props = defineProps<{ code: string; userId: number }>()
const emit = defineEmits<{ (e: 'visible', v: boolean): void }>()

const store = useChatStore()
const open = ref(false)
const draft = ref('')
const sending = ref(false)
const listEl = ref<HTMLElement | null>(null)

watch(open, (v) => emit('visible', v))

onMounted(() => store.loadOverview(props.code, props.userId))

const toggle = async () => {
  open.value = !open.value
  if (open.value) await store.loadOverview(props.code, props.userId)
}
const pick = (id: number) => store.openWith(props.code, props.userId, id)
const back = () => {
  store.closeConversation()
  store.loadOverview(props.code, props.userId)
}

const send = async () => {
  const text = draft.value.trim()
  if (!text || sending.value) return
  sending.value = true
  try {
    if (await store.send(props.code, props.userId, text)) draft.value = ''
  } finally {
    sending.value = false
  }
}

const time = (ms: number) =>
  new Date(ms).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })

// прокрутка вниз при новых сообщениях
watch(
  () => store.messages.length,
  async () => {
    await nextTick()
    if (listEl.value) listEl.value.scrollTop = listEl.value.scrollHeight
  }
)
</script>