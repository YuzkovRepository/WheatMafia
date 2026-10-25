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

const authHeaders = () => {
  const token = process.client ? localStorage.getItem('token') : null
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  }
}

const errMsg = (e: any, fallback: string) =>
  e?.data?.message || e?.data?.error || e?.message || fallback

export const useResearchStore = defineStore('research', {
  state: () => ({
    tree: null as ResearchTree | null,
    isLoading: false,
    error: null as string | null
  }),

  getters: {
    region: (s): string => s.tree?.region ?? '',

    byStage: (s): Map<number, ResearchNode[]> => {
      const m = new Map<number, ResearchNode[]>()
      for (const n of s.tree?.nodes ?? []) {
        const arr = m.get(n.stage) ?? []
        arr.push(n)
        m.set(n.stage, arr)
      }
      return m
    },

    canAfford: (s) => (node: ResearchNode): boolean => {
      const storage = s.tree?.storage ?? {}
      return node.cost.every(c => (storage[c.code] ?? 0) >= c.qty)
    },

    missingFor: (s) => (node: ResearchNode): ResearchCost[] => {
      const storage = s.tree?.storage ?? {}
      return node.cost
        .map(c => ({ code: c.code, title: c.title, qty: Math.max(0, c.qty - (storage[c.code] ?? 0)) }))
        .filter(c => c.qty > 0)
    },

    readyToOpen(): ResearchNode[] {
      return (this.tree?.nodes ?? []).filter(
        n => n.available && !n.unlocked && this.canAfford(n)
      )
    },

    // какие research-коды открыты (для фильтра зданий)
    unlockedCodes(): Set<string> {
      return new Set((this.tree?.nodes ?? []).filter(n => n.unlocked).map(n => n.code))
    }
  },

  actions: {
    async load(sessionCode: string, userId: number) {
      this.isLoading = true
      this.error = null
      try {
        this.tree = await $fetch<ResearchTree>(
          `/api/v1/research/by-session/${sessionCode.toUpperCase()}/user/${userId}`,
          { headers: authHeaders() }
        )
      } catch (e: any) {
        this.error = errMsg(e, 'Не удалось загрузить дерево исследований')
      } finally {
        this.isLoading = false
      }
    },

    async open(sessionCode: string, userId: number, researchCode: string) {
      this.isLoading = true
      this.error = null
      try {
        this.tree = await $fetch<ResearchTree>(
          `/api/v1/research/by-session/${sessionCode.toUpperCase()}/user/${userId}/open/${researchCode}`,
          { method: 'POST', headers: authHeaders() }
        )
        return { success: true }
      } catch (e: any) {
        this.error = errMsg(e, 'Не удалось открыть исследование')
        return { success: false }
      } finally {
        this.isLoading = false
      }
    }
  }
})