import { defineStore } from 'pinia'

export interface Cell {
  index: number
  type: 'EMPTY' | 'OCCUPIED' | 'LOCKED' | 'BLOCKED'
  objectId?: number | null
}

export interface QueuedJob {
  recipeCode: string
  output: string
  outputQty?: number
  time: number
  inputs: Record<string, number>
  startedAt?: string
  readyAt?: string
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

  productionStartedAt?: string
  productionReadyAt?: string
  productionInput?: string
  productionInputQty?: number
  productionOutput?: string
  productionOutputQty?: number
  productionTime?: number
  recipeCode?: string
  blockedUntil?: string

  queue?: QueuedJob[]
}

export interface Board {
  size: number
  cells: Cell[]
  objects: PlacedObject[]
  nextObjectId: number
}

const errMsg = (e: any, fallback: string) =>
  e?.data?.message ||
  e?.data?.error ||
  e?.message ||
  fallback

const boardPath = (sessionCode: string, userId: number) =>
  `/v1/boards/by-session/${sessionCode.toUpperCase()}/user/${userId}`

export const useBoardStore = defineStore('board', {
  state: () => ({
    board: null as Board | null,
    isLoading: false,
    error: null as string | null
  }),

  actions: {
    async loadMyBoard(sessionCode: string, userId: number) {
      const { $api } = useNuxtApp()

      this.isLoading = true
      this.error = null

      try {
        this.board = await $api<Board>(
          boardPath(sessionCode, userId)
        )

        return { success: true }
      } catch (e: any) {
        console.error('LOAD BOARD ERROR:', e)
        this.error = errMsg(e, 'Не удалось загрузить ферму')

        return { success: false }
      } finally {
        this.isLoading = false
      }
    },

    applyBoardState(board: Board) {
      this.board = board
    },

    async plant(
      sessionCode: string,
      userId: number,
      payload: {
        row: number
        col: number
        width: number
        height: number
        crop: string
        growSeconds: number
      }
    ) {
      const { $api } = useNuxtApp()

      this.error = null

      try {
        await $api(
          `${boardPath(sessionCode, userId)}/plant`,
          {
            method: 'POST',
            body: payload
          }
        )

        return { success: true }
      } catch (e: any) {
        console.error('PLANT ERROR:', e)
        this.error = errMsg(e, 'Не удалось посадить')

        return { success: false }
      }
    },

    async build(
      sessionCode: string,
      userId: number,
      payload: {
        row: number
        col: number
        width: number
        height: number
        building: string
        level: number
      }
    ) {
      const { $api } = useNuxtApp()

      this.error = null

      try {
        await $api(
          `${boardPath(sessionCode, userId)}/build`,
          {
            method: 'POST',
            body: payload
          }
        )

        return { success: true }
      } catch (e: any) {
        console.error('BUILD ERROR:', e)
        this.error = errMsg(e, 'Не удалось построить')

        return { success: false }
      }
    },

    async harvest(
      sessionCode: string,
      userId: number,
      objectId: number
    ) {
      const { $api } = useNuxtApp()

      this.error = null

      try {
        await $api(
          `${boardPath(sessionCode, userId)}/harvest/${objectId}`,
          {
            method: 'POST'
          }
        )

        return { success: true }
      } catch (e: any) {
        console.error('HARVEST ERROR:', e)
        this.error = errMsg(e, 'Не удалось собрать')

        return { success: false }
      }
    },

    async moveObject(
      sessionCode: string,
      userId: number,
      objectId: number,
      row: number,
      col: number
    ) {
      const { $api } = useNuxtApp()

      this.error = null

      try {
        await $api(
          `${boardPath(sessionCode, userId)}/move/${objectId}`,
          {
            method: 'POST',
            body: { row, col }
          }
        )

        return { success: true }
      } catch (e: any) {
        console.error('MOVE OBJECT ERROR:', e)
        this.error = errMsg(e, 'Не удалось переместить')

        return { success: false }
      }
    },

    async removeObject(
      sessionCode: string,
      userId: number,
      objectId: number
    ) {
      const { $api } = useNuxtApp()

      this.error = null

      try {
        await $api(
          `${boardPath(sessionCode, userId)}/remove/${objectId}`,
          {
            method: 'POST'
          }
        )

        return { success: true }
      } catch (e: any) {
        console.error('REMOVE OBJECT ERROR:', e)
        this.error = errMsg(e, 'Не удалось убрать')

        return { success: false }
      }
    },

    async cancelQueued(
      sessionCode: string,
      userId: number,
      objectId: number,
      index: number
    ) {
      const { $api } = useNuxtApp()

      this.error = null

      try {
        await $api(
          `${boardPath(sessionCode, userId)}/produce/${objectId}/queue/${index}/cancel`,
          {
            method: 'POST'
          }
        )

        return { success: true }
      } catch (e: any) {
        console.error('CANCEL QUEUED ERROR:', e)
        this.error = errMsg(e, 'Не удалось убрать из очереди')

        return { success: false }
      }
    },

    async startProduction(
      sessionCode: string,
      userId: number,
      objectId: number,
      outputCode: string
    ) {
      const { $api } = useNuxtApp()

      this.error = null

      try {
        await $api(
          `${boardPath(sessionCode, userId)}/produce/${objectId}/start`,
          {
            method: 'POST',
            body: { outputCode }
          }
        )

        return { success: true }
      } catch (e: any) {
        console.error('START PRODUCTION ERROR:', e)
        this.error = errMsg(
          e,
          'Не удалось запустить производство'
        )

        return { success: false }
      }
    },

    async collectProduction(
      sessionCode: string,
      userId: number,
      objectId: number,
      index = -1
    ) {
      const { $api } = useNuxtApp()

      this.error = null

      try {
        await $api(
          `${boardPath(sessionCode, userId)}/produce/${objectId}/collect?index=${index}`,
          {
            method: 'POST'
          }
        )

        return { success: true }
      } catch (e: any) {
        console.error('COLLECT PRODUCTION ERROR:', e)
        this.error = errMsg(
          e,
          'Не удалось забрать продукцию'
        )

        return { success: false }
      }
    }
  }
})

export function jobsOf(object: PlacedObject): QueuedJob[] {
  const jobs = [...(object.queue ?? [])]

  if (object.productionReadyAt && object.productionOutput) {
    jobs.unshift({
      recipeCode: object.recipeCode ?? '',
      output: object.productionOutput,
      outputQty: object.productionOutputQty,
      time: object.productionTime ?? 0,
      inputs: {},
      startedAt: object.productionStartedAt,
      readyAt: object.productionReadyAt
    })
  }

  return jobs
}