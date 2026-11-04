import { defineStore } from 'pinia'

export interface VisitActive {
  visitId: number
  targetNick: string
  region: string | null
  endsAtMs: number
}

export interface VisitHistoryRow {
  targetNick: string
  status: 'ACTIVE' | 'MISSED' | 'FOUND'
  bonusCoins: number
  startedAtMs: number
}

export interface VisitCandidate {
  userId: number
  nickName: string
  region: string | null
  /** сколько раз вы уже были на этой ферме */
  visits: number
}

export interface VisitState {
  serverNowMs: number
  max: number
  remaining: number
  cooldownUntilMs: number
  active: VisitActive | null
  history: VisitHistoryRow[]
  candidates: VisitCandidate[]
}

export interface VisitBuyer {
  summonedAtMs: number
  arrivesAtMs: number
  leavesAtMs: number
}

export interface VisitView {
  visitId: number
  targetNick: string
  region: string | null
  endsAtMs: number
  serverNowMs: number
  board: any
  buyer: VisitBuyer | null
}

export interface VisitReport {
  found: boolean
  message: string
  bonusCoins: number
  fine: number
  confiscatedUnits: number
  targetNick: string | null
  state: VisitState
}

/** Событие /topic/visits.{code}: кого-то разоблачили (видят все игроки партии). */
export interface VisitEvent {
  type: 'CAUGHT'
  visitorId: number
  visitorNick: string
  targetUserId: number
  targetNick: string
  fine: number
  confiscatedUnits: number
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

const base = (code: string, userId: number) =>
  `/api/v1/visits/by-session/${code.toUpperCase()}/user/${userId}`

export const useVisitsStore = defineStore('visits', {
  state: () => ({
    current: null as VisitState | null,
    view: null as VisitView | null,
    /** serverNow − Date.now() */
    offsetMs: 0,
    error: null as string | null,
    lastReport: null as VisitReport | null
  }),

  actions: {
    apply(s: VisitState) {
      this.current = s
      this.offsetMs = s.serverNowMs - Date.now()
    },

    async load(code: string, userId: number) {
      try {
        this.apply(await $fetch<VisitState>(base(code, userId), { headers: authHeaders() }))
      } catch (e: any) {
        this.error = errMsg(e, 'Не удалось загрузить визиты')
      }
    },

    async start(code: string, userId: number, targetUserId: number) {
      this.error = null
      try {
        this.apply(await $fetch<VisitState>(`${base(code, userId)}/start`, {
          method: 'POST', headers: authHeaders(), body: { targetUserId }
        }))
        return true
      } catch (e: any) {
        this.error = errMsg(e, 'Не удалось отправиться в гости')
        await this.load(code, userId)
        return false
      }
    },

    /** Чужая ферма: поле и скупщик. null — визита нет (закончился). */
    async loadView(code: string, userId: number) {
      try {
        const v = await $fetch<VisitView>(`${base(code, userId)}/view`, { headers: authHeaders() })
        this.view = v
        this.offsetMs = v.serverNowMs - Date.now()
        return v
      } catch {
        this.view = null
        return null
      }
    },

    async report(code: string, userId: number, visitId: number) {
      this.error = null
      try {
        const r = await $fetch<VisitReport>(`${base(code, userId)}/${visitId}/report`, {
          method: 'POST', headers: authHeaders()
        })
        this.apply(r.state)
        this.lastReport = r
        return r
      } catch (e: any) {
        this.error = errMsg(e, 'Не удалось сообщить о скупщике')
        await this.load(code, userId)
        return null
      }
    },

    async leave(code: string, userId: number, visitId: number) {
      try {
        this.apply(await $fetch<VisitState>(`${base(code, userId)}/${visitId}/leave`, {
          method: 'POST', headers: authHeaders()
        }))
      } catch (e: any) {
        this.error = errMsg(e, 'Не удалось уйти')
      }
      this.view = null
    }
  }
})