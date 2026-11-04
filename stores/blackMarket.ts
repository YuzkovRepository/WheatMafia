import { defineStore } from 'pinia'
import { useMarketStore } from '~/stores/market'

export type BmPhase = 'ARRIVING' | 'PRESENT' | 'LEFT'

export interface BmVisit {
  id: number
  summonedAtMs: number
  arrivesAtMs: number
  leavesAtMs: number
  pricePct: number
  earned: number
  soldUnits: number
  phase: BmPhase
}

export interface BmQuoteLine {
  code: string
  title: string
  qty: number
  unitPrice: number
  total: number
}

export interface BmPublicVisit {
  userId: number
  nickName: string
  region: string | null
  arrivesAtMs: number
  leavesAtMs: number
  phase: BmPhase
}

export interface BmState {
  serverNowMs: number
  mine: BmVisit | null
  cooldownUntilMs: number
  quote: BmQuoteLine[]
  quoteTotal: number
  active: BmPublicVisit[]
}

export interface BmEvent {
  type: 'SUMMONED' | 'LEFT'
  userId: number
  nickName: string
  active: BmPublicVisit[]
  serverNowMs: number
}

interface SellResult {
  coins: number
  earned: number
  units: number
  state: BmState
}

const errMsg = (e: any, fallback: string) =>
  e?.data?.message ||
  e?.data?.error ||
  e?.message ||
  fallback

const blackMarketPath = (sessionCode: string, userId: number) =>
  `/v1/blackmarket/by-session/${sessionCode.toUpperCase()}/user/${userId}`

export const useBlackMarketStore = defineStore('blackMarket', {
  state: () => ({
    current: null as BmState | null,
    active: [] as BmPublicVisit[],
    offsetMs: 0,
    isLoading: false,
    error: null as string | null,
    lastSale: null as {
      earned: number
      units: number
    } | null
  }),

  actions: {
    apply(state: BmState) {
      this.current = state
      this.active = state.active ?? []
      this.offsetMs = state.serverNowMs - Date.now()
    },

    async load(sessionCode: string, userId: number) {
      const { $api } = useNuxtApp()

      this.isLoading = true

      try {
        const state = await $api<BmState>(
          blackMarketPath(sessionCode, userId)
        )

        this.apply(state)
      } catch (e: any) {
        console.error('LOAD BLACK MARKET ERROR:', e)
        this.error = errMsg(
          e,
          'Не удалось загрузить данные скупщика'
        )
      } finally {
        this.isLoading = false
      }
    },

    async summon(sessionCode: string, userId: number) {
      const { $api } = useNuxtApp()

      this.error = null

      try {
        const state = await $api<BmState>(
          `${blackMarketPath(sessionCode, userId)}/summon`,
          {
            method: 'POST'
          }
        )

        this.apply(state)

        return true
      } catch (e: any) {
        console.error('SUMMON BLACK MARKET ERROR:', e)
        this.error = errMsg(e, 'Скупщик не приехал')

        return false
      }
    },

    async dismiss(sessionCode: string, userId: number) {
      const { $api } = useNuxtApp()

      this.error = null

      try {
        const state = await $api<BmState>(
          `${blackMarketPath(sessionCode, userId)}/dismiss`,
          {
            method: 'POST'
          }
        )

        this.apply(state)
      } catch (e: any) {
        console.error('DISMISS BLACK MARKET ERROR:', e)
        this.error = errMsg(
          e,
          'Не удалось отпустить скупщика'
        )
      }
    },

    async sell(
      sessionCode: string,
      userId: number,
      productCode: string | null,
      quantity: number | null
    ) {
      const { $api } = useNuxtApp()
      const marketStore = useMarketStore()

      this.error = null

      try {
        const result = await $api<SellResult>(
          `${blackMarketPath(sessionCode, userId)}/sell`,
          {
            method: 'POST',
            body: {
              productCode,
              quantity
            }
          }
        )

        this.apply(result.state)
        marketStore.coins = Number(result.coins)

        this.lastSale = {
          earned: Number(result.earned),
          units: Number(result.units)
        }

        return Number(result.earned)
      } catch (e: any) {
        console.error('BLACK MARKET SELL ERROR:', e)
        this.error = errMsg(e, 'Не удалось продать')

        return null
      }
    },

    applyEvent(event: BmEvent) {
      this.active = event.active ?? []
    }
  }
})