import { defineStore } from 'pinia'
import { useCatalogStore } from '~/stores/catalog'

export interface StorageItem {
  code: string
  qty: number
}

const parseItems = (raw: any): StorageItem[] => {
  const source =
    raw?.items ??
    raw?.contents ??
    raw?.stock ??
    raw?.products

  if (Array.isArray(source)) {
    return source
      .map((item: any) => ({
        code: String(
          item.code ??
          item.productCode ??
          ''
        ),
        qty: Number(
          item.qty ??
          item.quantity ??
          item.amount ??
          item.count ??
          0
        )
      }))
      .filter(item => item.code && item.qty > 0)
  }

  const map =
    source && typeof source === 'object'
      ? source
      : raw

  if (map && typeof map === 'object') {
    const catalog = useCatalogStore()

    return Object.entries(map)
      .filter(([code, value]) => {
        return (
          typeof value === 'number' &&
          (source ? true : !!catalog.productByCode(code))
        )
      })
      .map(([code, qty]) => ({
        code,
        qty: qty as number
      }))
      .filter(item => item.qty > 0)
  }

  return []
}

export const useStorageStore = defineStore('storage', {
  state: () => ({
    items: [] as StorageItem[],
    capacity: null as number | null,
    isLoading: false,
    error: null as string | null
  }),

  getters: {
    total: (state): number =>
      state.items.reduce((sum, item) => sum + item.qty, 0)
  },

  actions: {
    async load(sessionCode: string, userId: number) {
      const { $api } = useNuxtApp()

      this.isLoading = true
      this.error = null

      try {
        const raw = await $api<any>(
          `/v1/boards/by-session/${sessionCode.toUpperCase()}/user/${userId}/storage`
        )

        this.items = parseItems(raw)

        const capacity =
          raw?.capacity ??
          raw?.maxCapacity ??
          raw?.limit ??
          null

        this.capacity =
          typeof capacity === 'number' ? capacity : null
      } catch (e: any) {
        console.error('LOAD STORAGE ERROR:', e)
        this.error =
          e?.data?.message ||
          e?.message ||
          'Не удалось загрузить склад'
      } finally {
        this.isLoading = false
      }
    }
  }
})