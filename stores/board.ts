import { defineStore } from 'pinia'

export interface Cell {
  index: number
  type: 'EMPTY' | 'OCCUPIED' | 'LOCKED' | 'BLOCKED'
  objectId?: number | null
}

export interface PlacedObject {
  id: number
  kind: 'CROP' | 'BUILDING'
  row: number
  col: number
  width: number
  height: number
  crop?: string
  plantedAt?: string
  readyAt?: string
  growSeconds?: number
  building?: string
  level?: number
  builtAt?: string
}

export interface Board {
  size: number
  cells: Cell[]
  objects: PlacedObject[]
  nextObjectId: number
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

export const useBoardStore = defineStore('board', {
  state: () => ({
    board: null as Board | null,
    isLoading: false,
    error: null as string | null
  }),

  actions: {
    async loadMyBoard(sessionCode: string, userId: number) {
      this.isLoading = true
      this.error = null
      try {
        this.board = await $fetch<Board>(
          `/api/v1/boards/by-session/${sessionCode.toUpperCase()}/user/${userId}`,
          { headers: authHeaders() }
        )
        return { success: true }
      } catch (e: any) {
        this.error = errMsg(e, 'Не удалось загрузить ферму')
        return { success: false }
      } finally {
        this.isLoading = false
      }
    },

    /** Обновление состояния, пришедшего по STOMP (без HTTP-запроса). */
    applyBoardState(board: Board) {
      this.board = board
    },

    async plant(
      sessionCode: string,
      userId: number,
      payload: {
        row: number; col: number; width: number; height: number
        crop: string; growSeconds: number
      }
    ) {
      this.error = null
      try {
        await $fetch(
          `/api/v1/boards/by-session/${sessionCode.toUpperCase()}/user/${userId}/plant`,
          { method: 'POST', body: payload, headers: authHeaders() }
        )
        return { success: true }
      } catch (e: any) {
        this.error = errMsg(e, 'Не удалось посадить')
        return { success: false }
      }
    },

    async build(
      sessionCode: string,
      userId: number,
      payload: {
        row: number; col: number; width: number; height: number
        building: string; level: number
      }
    ) {
      this.error = null
      try {
        await $fetch(
          `/api/v1/boards/by-session/${sessionCode.toUpperCase()}/user/${userId}/build`,
          { method: 'POST', body: payload, headers: authHeaders() }
        )
        return { success: true }
      } catch (e: any) {
        this.error = errMsg(e, 'Не удалось построить')
        return { success: false }
      }
    },

    async harvest(sessionCode: string, userId: number, objectId: number) {
      this.error = null
      try {
        await $fetch(
          `/api/v1/boards/by-session/${sessionCode.toUpperCase()}/user/${userId}/harvest/${objectId}`,
          { method: 'POST', headers: authHeaders() }
        )
        return { success: true }
      } catch (e: any) {
        this.error = errMsg(e, 'Не удалось собрать')
        return { success: false }
      }
    }
  }
})