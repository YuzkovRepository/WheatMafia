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

const errMsg = (e: any, fallback: string) =>
  e?.data?.message ||
  e?.data?.error ||
  e?.message ||
  fallback

const deputyPath = (sessionCode: string) =>
  `/v1/deputy/by-session/${sessionCode.toUpperCase()}`

export const useDeputyStore = defineStore('deputy', {
  state: () => ({
    current: null as DeputyState | null,
    isLoading: false,
    error: null as string | null
  }),

  getters: {
    winner: (state): DeputyWinner | null =>
      state.current?.winner ?? null,

    leaderboard: (state): DeputyPlayer[] =>
      [...(state.current?.players ?? [])].sort(
        (a, b) =>
          b.delivered - a.delivered ||
          a.nickName.localeCompare(b.nickName)
      )
  },

  actions: {
    async load(sessionCode: string) {
      const { $api } = useNuxtApp()

      this.isLoading = true
      this.error = null

      try {
        this.current = await $api<DeputyState>(
          deputyPath(sessionCode)
        )
      } catch (e: any) {
        console.error('LOAD DEPUTY ERROR:', e)
        this.error = errMsg(
          e,
          'Не удалось загрузить данные депутата'
        )
      } finally {
        this.isLoading = false
      }
    },

    async feed(
      sessionCode: string,
      userId: number,
      productCode: string
    ) {
      const { $api } = useNuxtApp()

      this.error = null

      try {
        this.current = await $api<DeputyState>(
          `${deputyPath(sessionCode)}/user/${userId}/feed`,
          {
            method: 'POST',
            body: {
              productCode
            }
          }
        )

        return { success: true }
      } catch (e: any) {
        console.error('FEED DEPUTY ERROR:', e)
        this.error = errMsg(e, 'Депутат не принял блюдо')

        return { success: false }
      }
    },

    applyEvent(event: DeputyEvent) {
      if (event?.state) {
        this.current = event.state
      }
    }
  }
})