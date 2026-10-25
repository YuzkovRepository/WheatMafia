import { defineStore } from 'pinia'
import { useCatalogStore } from '~/stores/catalog'

export interface StorageItem {
  code: string
  qty: number
}

const authHeaders = () => {
  const token = process.client ? localStorage.getItem('token') : null
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  }
}

const parseItems = (raw: any): StorageItem[] => {
  const src = raw?.items ?? raw?.contents ?? raw?.stock ?? raw?.products
  if (Array.isArray(src)) {
    return src
      .map((i: any) => ({
        code: String(i.code ?? i.productCode ?? ''),
        qty: Number(i.qty ?? i.quantity ?? i.amount ?? i.count ?? 0)
      }))
      .filter(i => i.code && i.qty > 0)
  }
  const map = src && typeof src === 'object' ? src : raw
  if (map && typeof map === 'object') {
    const catalog = useCatalogStore()
    return Object.entries(map)
      // голый объект {code: qty}: берём только известные продукты, без служебных полей
      .filter(([k, v]) => typeof v === 'number' && (src ? true : !!catalog.productByCode(k)))
      .map(([code, qty]) => ({ code, qty: qty as number }))
      .filter(i => i.qty > 0)
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
    total: (s): number => s.items.reduce((sum, i) => sum + i.qty, 0)
  },

  actions: {
    async load(sessionCode: string, userId: number) {
      this.isLoading = true
      this.error = null
      try {
        const raw = await $fetch<any>(
          `/api/v1/boards/by-session/${sessionCode.toUpperCase()}/user/${userId}/storage`,
          { headers: authHeaders() }
        )
        this.items = parseItems(raw)
        const cap = raw?.capacity ?? raw?.maxCapacity ?? raw?.limit ?? null
        this.capacity = typeof cap === 'number' ? cap : null
      } catch (e: any) {
        this.error = e?.data?.message || e?.message || 'Не удалось загрузить склад'
      } finally {
        this.isLoading = false
      }
    }
  }
})