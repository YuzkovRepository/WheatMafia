import { defineStore } from 'pinia'

export interface ProductIndexItem {
  outputCode: string
  region: string
  stage: number
  researchCode: string
  factoryCode: string | null
}

export const useProductIndexStore = defineStore('productIndex', {
  state: () => ({
    items: {} as Record<string, ProductIndexItem>,
    loaded: false,
    loading: false
  }),

  getters: {
    of: (state) => (code?: string | null): ProductIndexItem | null => {
      return code ? state.items[code] ?? null : null
    }
  },

  actions: {
    async load() {
      if (this.loaded || this.loading) {
        return
      }

      const { $api } = useNuxtApp()

      this.loading = true

      try {
        const items = await $api<ProductIndexItem[]>(
          '/v1/catalog/research-index'
        )

        const index: Record<string, ProductIndexItem> = {}

        for (const item of items ?? []) {
          index[item.outputCode] = item
        }

        this.items = index
        this.loaded = true
      } catch (e: any) {
        console.error('LOAD PRODUCT INDEX ERROR:', e)
      } finally {
        this.loading = false
      }
    }
  }
})