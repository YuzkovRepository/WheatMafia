import { defineStore } from 'pinia'

export type CouncilPhase =
  | 'NONE'
  | 'SCHEDULED'
  | 'VOTING'
  | 'RESULT'

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

const errMsg = (e: any, fallback: string) =>
  e?.data?.message ||
  e?.data?.error ||
  e?.message ||
  fallback

const councilPath = (sessionCode: string, userId: number) =>
  `/v1/council/by-session/${sessionCode.toUpperCase()}/user/${userId}`

export const useCouncilStore = defineStore('council', {
  state: () => ({
    current: null as CouncilState | null,
    offsetMs: 0,
    error: null as string | null
  }),

  actions: {
    apply(state: CouncilState) {
      this.current = state
      this.offsetMs = state.serverNow - Date.now()
    },

    async load(sessionCode: string, userId: number) {
      const { $api } = useNuxtApp()

      try {
        const state = await $api<CouncilState>(
          councilPath(sessionCode, userId)
        )

        this.apply(state)
      } catch (e: any) {
        console.error('LOAD COUNCIL ERROR:', e)
        this.error = errMsg(e, 'Не удалось загрузить совет')
      }
    },

    async vote(
      sessionCode: string,
      userId: number,
      targetUserId: number
    ) {
      const { $api } = useNuxtApp()

      this.error = null

      try {
        const state = await $api<CouncilState>(
          `${councilPath(sessionCode, userId)}/vote`,
          {
            method: 'POST',
            body: {
              targetUserId
            }
          }
        )

        this.apply(state)

        return { success: true }
      } catch (e: any) {
        console.error('COUNCIL VOTE ERROR:', e)
        this.error = errMsg(e, 'Не удалось проголосовать')

        await this.load(sessionCode, userId)

        return { success: false }
      }
    }
  }
})