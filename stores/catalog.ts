// stores/catalog.ts
import { defineStore } from 'pinia'

export interface CatalogItem {
  id: number
  code: string
  title: string
  kind: 'CROP' | 'BUILDING'
  icon: string
  width: number
  height: number
  productionTime: number
  score: number
}

const authHeaders = () => {
  const token = process.client ? localStorage.getItem('token') : null
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  }
}

export const useCatalogStore = defineStore('catalog', {
  state: () => ({
    items: [] as CatalogItem[],
    loaded: false,
    isLoading: false,
    error: null as string | null
  }),

  getters: {
    crops: (s) => s.items.filter(i => i.kind === 'CROP'),
    buildings: (s) => s.items.filter(i => i.kind === 'BUILDING'),
    byCode: (s) => (code: string) => s.items.find(i => i.code === code) ?? null
  },

  actions: {
    async load() {
      if (this.loaded || this.isLoading) return
      this.isLoading = true
      this.error = null
      try {
        this.items = await $fetch<CatalogItem[]>('/api/v1/catalog', {
          headers: authHeaders()
        })
        this.loaded = true
      } catch (e: any) {
        this.error = e?.data?.message || e?.message || 'Не удалось загрузить справочник'
      } finally {
        this.isLoading = false
      }
    }
  }
})