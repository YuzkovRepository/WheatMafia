import { defineStore } from 'pinia'

export type CouncilPhase = 'NONE' | 'SCHEDULED' | 'VOTING' | 'RESULT'

export interface CouncilEvent {
  type: string
  emoji: string
  title: string
  description: string
  good: boolean
}

export interface CouncilCandidate {
  userId: number
  nickName: string
}

export interface CouncilTallyRow {
  userId: number
  nickName: string
  votes: number
}

export interface CouncilResult {
  targetUserId: number | null
  targetNick: string | null
  text: string
  skipped: boolean
  event: CouncilEvent
  tally: CouncilTallyRow[]
}

export interface CouncilState {
  phase: CouncilPhase
  roundNo: number
  serverNow: number
  startsAt: number | null
  endsAt: number | null
  event: CouncilEvent | null
  candidates: CouncilCandidate[]
  myVote: number | null
  result: CouncilResult | null
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

export const useCouncilStore = defineStore('council', {
  state: () => ({
    current: null as CouncilState | null,
    /** serverNow - Date.now(): поправка часов клиента */
    offsetMs: 0,
    error: null as string | null
  }),

  actions: {
    apply(s: CouncilState) {
      this.current = s
      this.offsetMs = s.serverNow - Date.now()
    },

    async load(sessionCode: string, userId: number) {
      try {
        const s = await $fetch<CouncilState>(
          `/api/v1/council/by-session/${sessionCode.toUpperCase()}/user/${userId}`,
          { headers: authHeaders() }
        )
        this.apply(s)
      } catch (e: any) {
        this.error = errMsg(e, 'Не удалось загрузить совет')
      }
    },

    async vote(sessionCode: string, userId: number, targetUserId: number) {
      this.error = null
      try {
        const s = await $fetch<CouncilState>(
          `/api/v1/council/by-session/${sessionCode.toUpperCase()}/user/${userId}/vote`,
          { method: 'POST', headers: authHeaders(), body: { targetUserId } }
        )
        this.apply(s)
        return { success: true }
      } catch (e: any) {
        this.error = errMsg(e, 'Не удалось проголосовать')
        // голосование могло закрыться — подтянем актуальное состояние
        await this.load(sessionCode, userId)
        return { success: false }
      }
    }
  }
})