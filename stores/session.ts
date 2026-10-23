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

// экспортируем — используется в STOMP-обработчике лобби
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
      payload: { sessionCode: string | null; roundDurationSeconds?: number; score_max?: number }
    ) {
      this.isLoading = true
      this.error = null

      const token = process.client ? localStorage.getItem('token') : null

      try {
        const data = await $fetch<ConnectResponse>(`/api/v1/sessions/connect/${userId}`, {
          method: 'POST',
          body: {
            sessionCode: payload.sessionCode,
            roundDurationSeconds: payload.roundDurationSeconds ?? null,
            score_max: payload.score_max ?? null
          },
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {})
          }
        })

        this.applyResponse(data)
        return { success: true, code: data.sessionCode }
      } catch (e: any) {
        this.error = e?.data?.message || e?.message || 'Не удалось подключиться к комнате'
        return { success: false }
      } finally {
        this.isLoading = false
      }
    },

    async setReady(userId: number, code: string, ready: boolean) {
      const token = process.client ? localStorage.getItem('token') : null
      try {
        const data = await $fetch<ConnectResponse>(
          `/api/v1/sessions/${code.toUpperCase()}/ready/${userId}?ready=${ready}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              ...(token ? { Authorization: `Bearer ${token}` } : {})
            }
          }
        )
        this.applyResponse(data)
        return { success: true }
      } catch (e: any) {
        this.error = e?.data?.message || e?.message || 'Не удалось изменить готовность'
        return { success: false }
      }
    },

    async startGame(userId: number, code: string) {
      const token = process.client ? localStorage.getItem('token') : null
      try {
        const data = await $fetch<ConnectResponse>(
          `/api/v1/sessions/${code.toUpperCase()}/start/${userId}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              ...(token ? { Authorization: `Bearer ${token}` } : {})
            }
          }
        )
        this.applyResponse(data)
        return { success: true, status: data.status }
      } catch (e: any) {
        this.error = e?.data?.message || e?.message || 'Не удалось начать игру'
        return { success: false }
      }
    },

    /**
     * Применяет состояние лобби, пришедшее по STOMP (RabbitMQ).
     * Никаких HTTP-запросов — только мутация стора.
     */
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
        players: (data.players ?? []).map(p => ({
          userId: p.userId,
          userSessionId: p.userSessionId,
          nickName: p.nickName,
          isHost: p.isHost,
          isReady: p.isReady === true
        }))
      }
    },

    leave() {
      this.current = null
      this.error = null
    }
  }
})