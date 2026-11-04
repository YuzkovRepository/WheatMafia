import { defineStore } from 'pinia'

export interface DeputyStep {
  slot: string
  stage: number
  grand: boolean
  done: boolean
  productCode: string | null
  productTitle: string | null
  examples: string[]
}

export interface DeputyPlayer {
  userId: number
  nickName: string
  region: string | null
  grandCode: string | null
  steps: DeputyStep[]
  delivered: number
  total: number
  finished: boolean
}

export interface DeputyWinner {
  userId: number
  nickName: string
  region: string | null
}

export interface DeputyState {
  sessionCode: string
  status: string
  players: DeputyPlayer[]
  winner: DeputyWinner | null
  dishStage: Record<string, number>
}

export interface DeputyEvent {
  type: 'FED' | 'WON'
  userId: number
  nickName: string
  productCode: string
  productTitle: string
  slot: string
  state: DeputyState
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

export const useDeputyStore = defineStore('deputy', {
  state: () => ({
    current: null as DeputyState | null,
    isLoading: false,
    error: null as string | null
  }),

  getters: {
    winner: (s): DeputyWinner | null => s.current?.winner ?? null,

    leaderboard: (s): DeputyPlayer[] =>
      [...(s.current?.players ?? [])].sort(
        (a, b) => b.delivered - a.delivered || a.nickName.localeCompare(b.nickName)
      )
  },

  actions: {
    async load(sessionCode: string) {
      this.isLoading = true
      this.error = null
      try {
        this.current = await $fetch<DeputyState>(
          `/api/v1/deputy/by-session/${sessionCode.toUpperCase()}`,
          { headers: authHeaders() }
        )
      } catch (e: any) {
        this.error = errMsg(e, 'Не удалось загрузить данные депутата')
      } finally {
        this.isLoading = false
      }
    },

    async feed(sessionCode: string, userId: number, productCode: string) {
      this.error = null
      try {
        this.current = await $fetch<DeputyState>(
          `/api/v1/deputy/by-session/${sessionCode.toUpperCase()}/user/${userId}/feed`,
          { method: 'POST', body: { productCode }, headers: authHeaders() }
        )
        return { success: true }
      } catch (e: any) {
        this.error = errMsg(e, 'Депутат не принял блюдо')
        return { success: false }
      }
    },

    applyEvent(ev: DeputyEvent) {
      if (ev?.state) this.current = ev.state
    }
  }
})