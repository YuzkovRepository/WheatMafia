import { defineStore } from 'pinia'

export interface ResearchCost {
  code: string
  title?: string
  qty: number
}

export interface RecipeIngredient {
  code: string
  title: string
  qty: number
}

export interface RecipePreview {
  factoryCode: string
  factoryTitle: string
  outputCode: string
  outputTitle: string
  outputQty: number
  productionTime: number
  inputs: RecipeIngredient[]
}

export interface ResearchNode {
  code: string
  title: string
  stage: number
  factoryCode: string | null
  factoryTitle: string | null
  outputCode: string | null
  outputTitle: string | null
  cost: ResearchCost[]
  requires: string[]
  unlocked: boolean
  available: boolean
  unlocksRecipes: RecipePreview[]
}

export interface ResearchTree {
  region: string
  nodes: ResearchNode[]
  storage: Record<string, number>
}

const errMsg = (e: any, fallback: string) =>
  e?.data?.message ||
  e?.data?.error ||
  e?.message ||
  fallback

const researchPath = (sessionCode: string, userId: number) =>
  `/v1/research/by-session/${sessionCode.toUpperCase()}/user/${userId}`

export const useResearchStore = defineStore('research', {
  state: () => ({
    tree: null as ResearchTree | null,
    isLoading: false,
    error: null as string | null
  }),

  getters: {
    region: (state): string => state.tree?.region ?? '',

    byStage: (state): Map<number, ResearchNode[]> => {
      const grouped = new Map<number, ResearchNode[]>()

      for (const node of state.tree?.nodes ?? []) {
        const nodes = grouped.get(node.stage) ?? []
        nodes.push(node)
        grouped.set(node.stage, nodes)
      }

      return grouped
    },

    canAfford: (state) => (node: ResearchNode): boolean => {
      const storage = state.tree?.storage ?? {}

      return node.cost.every(
        cost => (storage[cost.code] ?? 0) >= cost.qty
      )
    },

    missingFor: (state) => (node: ResearchNode): ResearchCost[] => {
      const storage = state.tree?.storage ?? {}

      return node.cost
        .map(cost => ({
          code: cost.code,
          title: cost.title,
          qty: Math.max(
            0,
            cost.qty - (storage[cost.code] ?? 0)
          )
        }))
        .filter(cost => cost.qty > 0)
    },

    readyToOpen(): ResearchNode[] {
      return (this.tree?.nodes ?? []).filter(
        node =>
          node.available &&
          !node.unlocked &&
          this.canAfford(node)
      )
    },

    unlockedCodes(): Set<string> {
      return new Set(
        (this.tree?.nodes ?? [])
          .filter(node => node.unlocked)
          .map(node => node.code)
      )
    }
  },

  actions: {
    async load(sessionCode: string, userId: number) {
      const { $api } = useNuxtApp()

      this.isLoading = true
      this.error = null

      try {
        this.tree = await $api<ResearchTree>(
          researchPath(sessionCode, userId)
        )
      } catch (e: any) {
        console.error('LOAD RESEARCH ERROR:', e)
        this.error = errMsg(
          e,
          'Не удалось загрузить дерево исследований'
        )
      } finally {
        this.isLoading = false
      }
    },

    async open(
      sessionCode: string,
      userId: number,
      researchCode: string
    ) {
      const { $api } = useNuxtApp()

      this.isLoading = true
      this.error = null

      try {
        this.tree = await $api<ResearchTree>(
          `${researchPath(sessionCode, userId)}/open/${researchCode}`,
          {
            method: 'POST'
          }
        )

        return { success: true }
      } catch (e: any) {
        console.error('OPEN RESEARCH ERROR:', e)
        this.error = errMsg(
          e,
          'Не удалось открыть исследование'
        )

        return { success: false }
      } finally {
        this.isLoading = false
      }
    }
  }
})