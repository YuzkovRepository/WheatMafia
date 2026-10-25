import { defineStore } from 'pinia'

export interface FactoryItem {
  id: number
  code: string
  title: string
  kind: 'CROP' | 'BUILDING'
  icon: string | null
  width: number
  height: number
  region?: string | null
}

export interface ProductItem {
  code: string
  title: string
  icon: string | null
  kind: 'CROP' | 'MATERIAL' | 'GOODS'
  productionTime: number
  score: number
  baseScore: number
  legality: 'LEGAL' | 'ILLEGAL'
}

export interface RecipeItem {
  factoryCode: string
  outputCode: string
  outputTitle: string
  outputQty: number
  productionTime: number
  inputs: { code: string; qty: number; title?: string; icon?: string | null }[]
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
    factories: [] as FactoryItem[],
    products: [] as ProductItem[],
    recipes: [] as RecipeItem[],
    loaded: false,
    isLoading: false,
    error: null as string | null
  }),

  getters: {
    crops: (s): FactoryItem[] => s.factories.filter(i => i.kind === 'CROP'),
    buildings: (s): FactoryItem[] => s.factories.filter(i => i.kind === 'BUILDING'),
    items: (s): FactoryItem[] => s.factories,

    byCode: (s) => (code: string): FactoryItem | null =>
      s.factories.find(i => i.code === code) ?? null,

    productByCode: (s) => (code: string): ProductItem | null =>
      s.products.find(p => p.code === code) ?? null,

    recipesFor: (s) => (factoryCode: string): RecipeItem[] =>
      s.recipes.filter(r => r.factoryCode === factoryCode),

    growSecondsFor: (s) => (cropCode: string): number => {
      const r = s.recipes.find(r => r.factoryCode === cropCode)
      return r?.productionTime ?? 60
    },

    /**
     * Культуры, доступные игроку в данном регионе.
     * Общие (region == null) + культуры его страны.
     * Если регион не задан — пустой список.
     */
    cropsForRegion: (s) => (region: string | null | undefined): FactoryItem[] => {
      if (!region) return []
      return s.factories.filter(
        f => f.kind === 'CROP' && (f.region == null || f.region === region)
      )
    },

    cropsForUi: (s): Array<FactoryItem & { productionTime: number; outputCode: string }> =>
      s.factories
        .filter(f => f.kind === 'CROP')
        .map(f => {
          const r = s.recipes.find(r => r.factoryCode === f.code)
          return {
            ...f,
            productionTime: r?.productionTime ?? 60,
            outputCode: r?.outputCode ?? f.code
          }
        }),

    buildingsForUi: (s): Array<FactoryItem & { recipes: RecipeItem[] }> =>
      s.factories
        .filter(f => f.kind === 'BUILDING')
        .map(f => ({
          ...f,
          recipes: s.recipes.filter(r => r.factoryCode === f.code)
        }))
  },

  actions: {
    async load() {
      if (this.loaded || this.isLoading) return
      this.isLoading = true
      this.error = null
      try {
        const [factories, products, recipes] = await Promise.all([
          $fetch<FactoryItem[]>('/api/v1/catalog/factories', { headers: authHeaders() }),
          $fetch<ProductItem[]>('/api/v1/catalog/products', { headers: authHeaders() }),
          $fetch<RecipeItem[]>('/api/v1/catalog/recipes', { headers: authHeaders() })
        ])
        this.factories = factories ?? []
        this.products = products ?? []
        this.recipes = recipes ?? []
        this.loaded = true
      } catch (e: any) {
        this.error = e?.data?.message || e?.message || 'Не удалось загрузить справочник'
      } finally {
        this.isLoading = false
      }
    }
  }
})