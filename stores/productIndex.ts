import { defineStore } from 'pinia'

export interface ProductIndexItem {
  outputCode: string
  region: string
  stage: number
  researchCode: string
  factoryCode: string | null
}

const authHeaders = () => {
  const token = process.client ? localStorage.getItem('token') : null
  return token ? { Authorization: `Bearer ${token}` } : {}
}

/**
 * Откуда продукт и на каком этапе исследуется (по всем странам).
 * Данные берутся с /api/v1/catalog/research-index; если эндпоинта нет — компоненты считают этап сами.
 */
export const useProductIndexStore = defineStore('productIndex', {
  state: () => ({
    items: {} as Record<string, ProductIndexItem>,
    loaded: false,
    loading: false
  }),
  getters: {
    of: (s) => (code?: string | null): ProductIndexItem | null => (code ? (s.items[code] ?? null) : null)
  },
  actions: {
    async load() {
      if (this.loaded || this.loading) return
      this.loading = true
      try {
        const list = await $fetch<ProductIndexItem[]>('/api/v1/catalog/research-index', { headers: authHeaders() })
        const m: Record<string, ProductIndexItem> = {}
        for (const it of list) m[it.outputCode] = it
        this.items = m
        this.loaded = true
      } catch {
        /* нет эндпоинта — работаем на расчётных значениях */
      } finally {
        this.loading = false
      }
    }
  }
})