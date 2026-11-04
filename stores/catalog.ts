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
  inputs: {
    code: string
    title: string
    qty: number
  }[]
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

interface CatalogResponse {
  factories: FactoryItem[]
  products: ProductItem[]
  recipes: RecipeItem[]
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
    byCode: (state) => (code?: string | null): FactoryItem | null => {
      return code
        ? state.factories.find(
            factory => factory.code === code
          ) ?? null
        : null
    },

    productByCode: (state) => (code?: string | null): ProductItem | null => {
      return code
        ? state.products.find(
            product => product.code === code
          ) ?? null
        : null
    },

    buildingsForUi(): FactoryItem[] {
      return this.factories.filter(
        factory =>
          factory.kind === 'BUILDING' &&
          factory.code !== 'warehouse' &&
          factory.code !== 'trader'
      )
    },

    buildingsAvailableFor():
      (unlocked: Set<string>, region?: string | null) => FactoryItem[] {
      return (unlocked, region) =>
        this.factories.filter(factory => {
          if (factory.kind !== 'BUILDING') {
            return false
          }

          if (
            factory.code === 'warehouse' ||
            factory.code === 'trader'
          ) {
            return false
          }

          if (
            factory.region &&
            region &&
            factory.region !== region
          ) {
            return false
          }

          if (!factory.requiredResearch) {
            return true
          }

          return unlocked.has(factory.requiredResearch)
        })
    },

    cropsForRegion():
      (region?: string | null) => FactoryItem[] {
      return region =>
        this.factories.filter(factory => {
          if (factory.kind !== 'CROP') {
            return false
          }

          if (
            factory.region &&
            region &&
            factory.region !== region
          ) {
            return false
          }

          if (factory.region && !region) {
            return false
          }

          return true
        })
    },

    recipesFor: (state) => (
      factoryCode?: string | null
    ): RecipeItem[] => {
      return factoryCode
        ? state.recipes.filter(
            recipe => recipe.factoryCode === factoryCode
          )
        : []
    },

    growSecondsFor: (state) => (cropCode: string): number => {
      const recipe = state.recipes.find(
        item =>
          item.factoryCode === cropCode &&
          item.outputCode === cropCode
      )

      return recipe?.productionTime ?? 60
    }
  },

  actions: {
    async load() {
      if (this.factories.length && this.products.length) {
        return
      }

      const { $api } = useNuxtApp()

      this.isLoading = true
      this.error = null

      try {
        const data = await $api<CatalogResponse>('/v1/catalog')

        this.factories = data.factories ?? []
        this.products = data.products ?? []
        this.recipes = data.recipes ?? []
      } catch (e: any) {
        console.error('LOAD CATALOG ERROR:', e)
        this.error =
          e?.data?.message ||
          e?.message ||
          'Не удалось загрузить каталог'
      } finally {
        this.isLoading = false
      }
    }
  }
})