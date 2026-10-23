<template>
  <div class="min-h-screen bg-gradient-to-br from-stone-900 via-stone-800 to-amber-950">
    <div class="max-w-[1800px] mx-auto px-2 sm:px-4 py-4">
      <div class="mb-4">
        <h1 class="text-2xl font-serif font-bold text-amber-50">
          Партия <span class="text-amber-400">{{ code }}</span>
        </h1>
        <p class="text-amber-200/60 text-sm">{{ authStore.user?.nickName }}</p>
      </div>

      <div v-if="catalogStore.error" class="mb-4 bg-amber-100 border border-amber-300 rounded-xl p-3">
        <p class="text-amber-800 text-sm">{{ catalogStore.error }}</p>
      </div>
      <div v-if="boardStore.error" class="mb-4 bg-red-100 border border-red-300 rounded-xl p-3">
        <p class="text-red-700 text-sm">{{ boardStore.error }}</p>
      </div>

      <!-- Блок фермы: всё игровое внутри, по углам -->
      <div class="relative rounded-2xl shadow-2xl overflow-hidden border border-amber-900/40">
        <FarmBoard
          :board="boardStore.board"
          :cell-px="56"
          :plant-width="selectedItem?.width ?? 2"
          :plant-height="selectedItem?.height ?? 2"
          :preview-src="selectedItem ? objectSrc(selectedItem.icon) : undefined"
          :preview-kind="selectedItem?.kind === 'BUILDING' ? 'BUILDING' : 'CROP'"
          @cell-click="onCellClick"
          @object-click="onObjectClick"
        />

        <!-- левый верхний угол: что выбрано -->
        <div class="absolute top-3 left-3 z-10 flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl bg-stone-900/75 backdrop-blur text-amber-50 border border-white/10 shadow-lg">
          <img
            v-if="selectedItem && !isEmoji(selectedItem.icon)"
            :src="iconSrc(selectedItem.icon)"
            class="w-8 h-8 object-contain"
            alt=""
          />
          <span v-else class="text-2xl">{{ selectedItem?.icon ?? '—' }}</span>
          <div class="leading-tight">
            <div class="text-sm font-semibold">{{ selectedItem?.title ?? 'Ничего не выбрано' }}</div>
            <div v-if="selectedItem" class="text-[11px] text-amber-200/70">
              {{ selectedItem.width }}×{{ selectedItem.height }}
            </div>
          </div>
        </div>

        <!-- левый нижний угол: подсказка -->
        <div class="hidden sm:block absolute bottom-3 left-3 z-10 px-3 py-1.5 rounded-xl bg-stone-900/60 backdrop-blur text-[11px] text-amber-100/80 border border-white/10">
          Клик по лугу — поставить · клик по золотой грядке — собрать
        </div>

        <!-- правый нижний угол: инструменты -->
        <button
          @click="builderOpen = true"
          aria-label="Инструменты"
          class="absolute bottom-3 right-3 z-10 w-14 h-14 rounded-2xl bg-amber-500 hover:bg-amber-400 active:scale-95 text-3xl shadow-xl border border-amber-300/60 transition flex items-center justify-center"
        >
          🛠️
        </button>
      </div>
    </div>

    <!-- Модалка выбора -->
    <div
      v-if="builderOpen"
      class="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
      @click.self="builderOpen = false"
    >
      <div class="bg-stone-50 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[85vh] flex flex-col overflow-hidden">
        <div class="flex items-center justify-between px-5 py-4 border-b border-stone-200">
          <h2 class="text-2xl">🛠️</h2>
          <button @click="builderOpen = false" class="text-stone-500 hover:text-stone-800 text-2xl leading-none">×</button>
        </div>

        <div class="flex gap-2 px-5 pt-3">
          <button
            v-for="tab in tabs"
            :key="tab.key"
            @click="activeTab = tab.key"
            class="px-4 py-2 rounded-xl font-semibold text-sm transition"
            :class="activeTab === tab.key
              ? 'bg-amber-500 text-stone-900'
              : 'bg-stone-200 text-stone-600 hover:bg-stone-300'"
          >
            {{ tab.label }}
          </button>
        </div>

        <div class="p-5 overflow-y-auto">
          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            <button
              v-for="item in itemsForTab"
              :key="item.code"
              @click="pickItem(item)"
              class="flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition"
              :class="selectedCode === item.code
                ? 'border-amber-500 bg-amber-50'
                : 'border-stone-200 bg-white hover:border-amber-300'"
            >
              <img
                v-if="!isEmoji(item.icon)"
                :src="iconSrc(item.icon)"
                class="w-12 h-12 object-contain"
                alt=""
              />
              <span v-else class="text-4xl">{{ item.icon }}</span>
              <span class="text-sm font-semibold text-stone-700 text-center">{{ item.title }}</span>
              <span class="text-xs text-stone-400">{{ item.width }}×{{ item.height }}</span>
            </button>
          </div>

          <p v-if="itemsForTab.length === 0" class="text-stone-500 text-center py-8">
            В этом разделе пока ничего нет.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Client } from '@stomp/stompjs'
import { useBoardStore } from '~/stores/board'
import { useAuthStore } from '~/stores/auth'
import { useCatalogStore } from '~/stores/catalog'
import type { PlacedObject, Cell, Board } from '~/stores/board'

const route = useRoute()
const authStore = useAuthStore()
const boardStore = useBoardStore()
const catalogStore = useCatalogStore()

const code = computed(() => String(route.params.code || '').toUpperCase())

const builderOpen = ref(false)
const activeTab = ref<'CROP' | 'BUILDING'>('CROP')
const selectedCode = ref<string | null>(null)

const tabs = [
  { key: 'CROP' as const, label: '🌾 Культуры' },
  { key: 'BUILDING' as const, label: '🏭 Заводы' }
]

const itemsForTab = computed(() =>
  activeTab.value === 'CROP' ? catalogStore.crops : catalogStore.buildings
)

const selectedItem = computed(() =>
  selectedCode.value ? catalogStore.byCode(selectedCode.value) : null
)

const isEmoji = (s?: string) =>
  !!s && /\p{Extended_Pictographic}/u.test(s)

// иконки для меню и шапки: /icons/{icon}
const iconSrc = (icon: string) =>
  /\.(svg|png|webp)$/i.test(icon) ? `/icons/${icon}` : `/icons/${icon}.png`

onMounted(async () => {
  await catalogStore.load()
  if (!selectedCode.value && catalogStore.crops.length) {
    selectedCode.value = catalogStore.crops[0].code
  }
})

function pickItem(item: { code: string }) {
  selectedCode.value = item.code
  builderOpen.value = false
}

let client: Client | null = null

onMounted(() => {
  const userId = authStore.user?.id
  if (!userId) return

  const proto = location.protocol === 'https:' ? 'wss' : 'ws'
  client = new Client({
    brokerURL: `${proto}://${location.host}/ws`,
    reconnectDelay: 3000,
    onConnect: async () => {
      client!.subscribe(`/topic/board.${code.value}.${userId}`, (msg) => {
        boardStore.applyBoardState(JSON.parse(msg.body) as Board)
      })
      if (!boardStore.board) {
        await boardStore.loadMyBoard(code.value, userId)
      }
    }
  })
  client.activate()
})

onUnmounted(() => {
  client?.deactivate()
  client = null
})

watch(
  () => authStore.user?.id,
  (id) => {
    if (id && !boardStore.board) boardStore.loadMyBoard(code.value, id)
  }
)

const onCellClick = async (cell: Cell) => {
  const userId = authStore.user?.id
  if (!userId || !boardStore.board) return
  const item = selectedItem.value
  if (!item) return

  const size = boardStore.board.size
  const row = Math.floor(cell.index / size)
  const col = cell.index % size

  if (item.kind === 'CROP') {
    await boardStore.plant(code.value, userId, {
      row, col,
      width: item.width,
      height: item.height,
      crop: item.code,
      growSeconds: item.productionTime
    })
  } else {
    await boardStore.build(code.value, userId, {
      row, col,
      width: item.width,
      height: item.height,
      building: item.code,
      level: 1
    })
  }
}

const onObjectClick = async (obj: PlacedObject) => {
  const userId = authStore.user?.id
  if (!userId) return
  if (obj.kind === 'CROP' && obj.readyAt && new Date(obj.readyAt) <= new Date()) {
    await boardStore.harvest(code.value, userId, obj.id)
  }
}
</script>