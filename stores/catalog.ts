import { defineStore } from 'pinia'

export interface FactoryItem {
  code: string
  title: string
  kind: 'CROP' | 'BUILDING'
  icon?: string | null
  width: number
  height: number
  region?: string | null
  requiredResearch?: string | null
}

export interface RecipeItem {
  factoryCode: string
  outputCode: string
  outputTitle: string
  outputQty: number
  productionTime: number
  inputs: { code: string; title: string; qty: number }[]
}

export interface ProductItem {
  code: string
  title: string
  kind: 'CROP' | 'MATERIAL' | 'GOODS'
  legality: 'LEGAL' | 'ILLEGAL'
  score: number
  baseScore: number
}

interface CatalogState {
  factories: FactoryItem[]
  products: ProductItem[]
  recipes: RecipeItem[]
  isLoading: boolean
  error: string | null
}

const authHeaders = () => {
  const token = process.client ? localStorage.getItem('token') : null
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  }
}

export const useCatalogStore = defineStore('catalog', {
  state: (): CatalogState => ({
    factories: [],
    products: [],
    recipes: [],
    isLoading: false,
    error: null
  }),

  getters: {
    byCode: (s) => (code?: string | null): FactoryItem | null =>
      code ? s.factories.find(f => f.code === code) ?? null : null,

    productByCode: (s) => (code?: string | null): ProductItem | null =>
      code ? s.products.find(p => p.code === code) ?? null : null,

    /** Здания для меню строительства: без склада/торговца, отфильтрованы по исследованиям */
    buildingsForUi(): FactoryItem[] {
      return this.factories.filter(
        f => f.kind === 'BUILDING' && f.code !== 'warehouse' && f.code !== 'trader'
      )
    },

    /** Доступные здания с учётом исследованного набора */
    buildingsAvailableFor(): (unlocked: Set<string>, region?: string | null) => FactoryItem[] {
      return (unlocked, region) =>
        this.factories.filter(f => {
          if (f.kind !== 'BUILDING') return false
          if (f.code === 'warehouse' || f.code === 'trader') return false
          if (f.region && region && f.region !== region) return false
          if (!f.requiredResearch) return true
          return unlocked.has(f.requiredResearch)
        })
    },

    cropsForRegion(): (region?: string | null) => FactoryItem[] {
      return (region) =>
        this.factories.filter(f => {
          if (f.kind !== 'CROP') return false
          if (f.region && region && f.region !== region) return false
          if (f.region && !region) return false
          return true
        })
    },

    recipesFor: (s) => (factoryCode?: string | null): RecipeItem[] =>
      factoryCode ? s.recipes.filter(r => r.factoryCode === factoryCode) : [],

    /** Время роста культуры по коду */
    growSecondsFor: (s) => (cropCode: string): number => {
      const r = s.recipes.find(x => x.factoryCode === cropCode && x.outputCode === cropCode)
      return r?.productionTime ?? 60
    }
  },

  actions: {
    async load() {
      if (this.factories.length && this.products.length) return
      this.isLoading = true
      this.error = null
      try {
        const data = await $fetch<{
          factories: FactoryItem[]
          products: ProductItem[]
          recipes: RecipeItem[]
        }>('/api/v1/catalog', { headers: authHeaders() })
        this.factories = data.factories ?? []
        this.products = data.products ?? []
        this.recipes = data.recipes ?? []
      } catch (e: any) {
        this.error = e?.data?.message || e?.message || 'Не удалось загрузить каталог'
      } finally {
        this.isLoading = false
      }
    }
  }
})