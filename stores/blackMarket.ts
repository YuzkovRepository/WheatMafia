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

const authHeaders = () => {
  const token = process.client ? localStorage.getItem('token') : null
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  }
}

const errMsg = (e: any, fallback: string) =>
  e?.data?.message || e?.data?.error || e?.message || fallback

export const useBlackMarketStore = defineStore('blackMarket', {
  state: () => ({
    current: null as BmState | null,
    /** активные визиты всех игроков партии (приходит и по STOMP) */
    active: [] as BmPublicVisit[],
    /** разница серверных и локальных часов, мс */
    offsetMs: 0,
    isLoading: false,
    error: null as string | null,
    lastSale: null as { earned: number; units: number } | null
  }),

  actions: {
    apply(state: BmState) {
      this.current = state
      this.active = state.active ?? []
      this.offsetMs = state.serverNowMs - Date.now()
    },

    async load(sessionCode: string, userId: number) {
      this.isLoading = true
      try {
        this.apply(await $fetch<BmState>(
          `/api/v1/blackmarket/by-session/${sessionCode.toUpperCase()}/user/${userId}`,
          { headers: authHeaders() }
        ))
      } catch (e: any) {
        this.error = errMsg(e, 'Не удалось загрузить данные скупщика')
      } finally {
        this.isLoading = false
      }
    },

    async summon(sessionCode: string, userId: number) {
      this.error = null
      try {
        this.apply(await $fetch<BmState>(
          `/api/v1/blackmarket/by-session/${sessionCode.toUpperCase()}/user/${userId}/summon`,
          { method: 'POST', headers: authHeaders() }
        ))
        return true
      } catch (e: any) {
        this.error = errMsg(e, 'Скупщик не приехал')
        return false
      }
    },

    async dismiss(sessionCode: string, userId: number) {
      this.error = null
      try {
        this.apply(await $fetch<BmState>(
          `/api/v1/blackmarket/by-session/${sessionCode.toUpperCase()}/user/${userId}/dismiss`,
          { method: 'POST', headers: authHeaders() }
        ))
      } catch (e: any) {
        this.error = errMsg(e, 'Не удалось отпустить скупщика')
      }
    },

    /** productCode = null — продать весь нелегал. Возвращает заработок или null при ошибке. */
    async sell(sessionCode: string, userId: number, productCode: string | null, quantity: number | null) {
      this.error = null
      try {
        const res = await $fetch<SellResult>(
          `/api/v1/blackmarket/by-session/${sessionCode.toUpperCase()}/user/${userId}/sell`,
          { method: 'POST', headers: authHeaders(), body: { productCode, quantity } }
        )
        this.apply(res.state)
        // баланс общий с маркетплейсом и обычным скупщиком
        useMarketStore().coins = Number(res.coins)
        this.lastSale = { earned: Number(res.earned), units: Number(res.units) }
        return Number(res.earned)
      } catch (e: any) {
        this.error = errMsg(e, 'Не удалось продать')
        return null
      }
    },

    /** Событие из STOMP (/topic/blackmarket.{code}): кто-то вызвал или отпустил скупщика. */
    applyEvent(ev: BmEvent) {
      this.active = ev.active ?? []
    }
  }
})