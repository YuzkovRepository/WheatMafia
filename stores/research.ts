import { defineStore } from 'pinia'

export interface ResearchCost {
  code: string
  qty: number
}

export interface ResearchNode {
  code: string
  title: string
  stage: number
  factoryCode: string
  outputCode: string
  cost: ResearchCost[]
  requires: string[]
  unlocked: boolean
  available: boolean
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

    // узлы, сгруппированные по этапам
    byStage: (s): Map<number, ResearchNode[]> => {
      const m = new Map<number, ResearchNode[]>()
      for (const n of s.tree?.nodes ?? []) {
        const arr = m.get(n.stage) ?? []
        arr.push(n)
        m.set(n.stage, arr)
      }
      return m
    },

    // можно ли позволить себе cost данного узла (по текущему складу из дерева)
    canAfford: (s) => (node: ResearchNode): boolean => {
      const storage = s.tree?.storage ?? {}
      return node.cost.every(c => (storage[c.code] ?? 0) >= c.qty)
    },

    // сколько чего не хватает для узла
    missingFor: (s) => (node: ResearchNode): ResearchCost[] => {
      const storage = s.tree?.storage ?? {}
      return node.cost
        .map(c => ({ code: c.code, qty: Math.max(0, c.qty - (storage[c.code] ?? 0)) }))
        .filter(c => c.qty > 0)
    },

    // узлы, которые прямо сейчас можно исследовать (available + хватает ресурсов)
    readyToOpen(): ResearchNode[] {
      return (this.tree?.nodes ?? []).filter(
        n => n.available && !n.unlocked && this.canAfford(n)
      )
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