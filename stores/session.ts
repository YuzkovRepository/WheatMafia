import { defineStore } from 'pinia'

export interface SessionPlayer {
  userId: number
  userSessionId: number
  nickName: string
  isHost: boolean
  isReady: boolean
}

export interface SessionState {
  sessionCode: string
  status: string
  quantityPlayers: number
  maxPlayers: number
  scoreMax: number
  roundDurationSeconds: number
  players: SessionPlayer[]
}

export interface PlayerDTO {
  userId: number
  userSessionId: number
  nickName: string
  isHost: boolean
  isReady: boolean
}

export interface ConnectResponse {
  quantity_players: number
  sessionCode: string
  status: string
  user: number
  score_max: number
  roundDurationSeconds: number
  players: PlayerDTO[]
}

export const useSessionStore = defineStore('session', {
  state: () => ({
    current: null as SessionState | null,
    isLoading: false,
    error: null as string | null
  }),

  actions: {
    async createSession(userId: number) {
      return this.connect(userId, { sessionCode: null })
    },

    async joinSession(userId: number, code: string) {
      return this.connect(userId, { sessionCode: code.toUpperCase() })
    },

    async connect(
      userId: number,
      payload: {
        sessionCode: string | null
        roundDurationSeconds?: number
        score_max?: number
      }
    ) {
      const { $api } = useNuxtApp()

      this.isLoading = true
      this.error = null

      try {
        const data = await $api<ConnectResponse>(
          `/v1/sessions/connect/${userId}`,
          {
            method: 'POST',
            body: {
              sessionCode: payload.sessionCode,
              roundDurationSeconds: payload.roundDurationSeconds ?? null,
              score_max: payload.score_max ?? null
            }
          }
        )

        this.applyResponse(data)

        return {
          success: true,
          code: data.sessionCode
        }
      } catch (e: any) {
        console.error('CONNECT SESSION ERROR:', e)
        this.error =
          e?.data?.message ||
          e?.message ||
          'Не удалось подключиться к комнате'

        return { success: false }
      } finally {
        this.isLoading = false
      }
    },

    async setReady(userId: number, code: string, ready: boolean) {
      const { $api } = useNuxtApp()

      try {
        const data = await $api<ConnectResponse>(
          `/v1/sessions/${code.toUpperCase()}/ready/${userId}?ready=${ready}`,
          {
            method: 'POST'
          }
        )

        this.applyResponse(data)

        return { success: true }
      } catch (e: any) {
        console.error('SET READY ERROR:', e)
        this.error =
          e?.data?.message ||
          e?.message ||
          'Не удалось изменить готовность'

        return { success: false }
      }
    },

    async startGame(userId: number, code: string) {
      const { $api } = useNuxtApp()

      try {
        const data = await $api<ConnectResponse>(
          `/v1/sessions/${code.toUpperCase()}/start/${userId}`,
          {
            method: 'POST'
          }
        )

        this.applyResponse(data)

        return {
          success: true,
          status: data.status
        }
      } catch (e: any) {
        console.error('START GAME ERROR:', e)
        this.error =
          e?.data?.message ||
          e?.message ||
          'Не удалось начать игру'

        return { success: false }
      }
    },

    applyLobbyState(data: ConnectResponse) {
      this.applyResponse(data)
    },

    applyResponse(data: ConnectResponse) {
      this.current = {
        sessionCode: data.sessionCode,
        status: data.status,
        quantityPlayers: data.quantity_players,
        maxPlayers: 6,
        scoreMax: data.score_max,
        roundDurationSeconds: data.roundDurationSeconds,
        players: (data.players ?? []).map(player => ({
          userId: player.userId,
          userSessionId: player.userSessionId,
          nickName: player.nickName,
          isHost: player.isHost,
          isReady: player.isReady === true
        }))
      }
    },

    leave() {
      this.current = null
      this.error = null
    }
  }
})