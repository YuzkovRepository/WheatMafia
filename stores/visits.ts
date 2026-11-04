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

export interface VisitEvent {
  type: 'CAUGHT'
  visitorId: number
  visitorNick: string
  targetUserId: number
  targetNick: string
  fine: number
  confiscatedUnits: number
}

const errMsg = (e: any, fallback: string) =>
  e?.data?.message ||
  e?.data?.error ||
  e?.message ||
  fallback

const visitsPath = (code: string, userId: number) =>
  `/v1/visits/by-session/${code.toUpperCase()}/user/${userId}`

export const useVisitsStore = defineStore('visits', {
  state: () => ({
    current: null as VisitState | null,
    view: null as VisitView | null,
    offsetMs: 0,
    error: null as string | null,
    lastReport: null as VisitReport | null
  }),

  actions: {
    apply(state: VisitState) {
      this.current = state
      this.offsetMs = state.serverNowMs - Date.now()
    },

    async load(code: string, userId: number) {
      const { $api } = useNuxtApp()

      try {
        const state = await $api<VisitState>(visitsPath(code, userId))

        this.apply(state)
      } catch (e: any) {
        console.error('LOAD VISITS ERROR:', e)
        this.error = errMsg(e, 'Не удалось загрузить визиты')
      }
    },

    async start(
      code: string,
      userId: number,
      targetUserId: number
    ) {
      const { $api } = useNuxtApp()

      this.error = null

      try {
        const state = await $api<VisitState>(
          `${visitsPath(code, userId)}/start`,
          {
            method: 'POST',
            body: {
              targetUserId
            }
          }
        )

        this.apply(state)

        return true
      } catch (e: any) {
        console.error('START VISIT ERROR:', e)
        this.error = errMsg(e, 'Не удалось отправиться в гости')

        await this.load(code, userId)

        return false
      }
    },

    async loadView(code: string, userId: number) {
      const { $api } = useNuxtApp()

      try {
        const view = await $api<VisitView>(
          `${visitsPath(code, userId)}/view`
        )

        this.view = view
        this.offsetMs = view.serverNowMs - Date.now()

        return view
      } catch (e: any) {
        console.error('LOAD VISIT VIEW ERROR:', e)
        this.view = null

        return null
      }
    },

    async report(code: string, userId: number, visitId: number) {
      const { $api } = useNuxtApp()

      this.error = null

      try {
        const report = await $api<VisitReport>(
          `${visitsPath(code, userId)}/${visitId}/report`,
          {
            method: 'POST'
          }
        )

        this.apply(report.state)
        this.lastReport = report

        return report
      } catch (e: any) {
        console.error('VISIT REPORT ERROR:', e)
        this.error = errMsg(e, 'Не удалось сообщить о скупщике')

        await this.load(code, userId)

        return null
      }
    },

    async leave(code: string, userId: number, visitId: number) {
      const { $api } = useNuxtApp()

      try {
        const state = await $api<VisitState>(
          `${visitsPath(code, userId)}/${visitId}/leave`,
          {
            method: 'POST'
          }
        )

        this.apply(state)
      } catch (e: any) {
        console.error('LEAVE VISIT ERROR:', e)
        this.error = errMsg(e, 'Не удалось уйти')
      } finally {
        this.view = null
      }
    }
  }
})