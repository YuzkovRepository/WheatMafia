import type { Board, PlacedObject, CatalogItem } from '~/types/game'

export function useBoardApi() {
  const { $api } = useNuxtApp()

  async function getBoard(
    sessionCode: string,
    userId: number
  ): Promise<Board> {
    return await $api<Board>(
      `/v1/boards/by-session/${sessionCode}/user/${userId}`
    )
  }

  async function plant(
    sessionCode: string,
    userId: number,
    body: {
      row: number
      col: number
      width: number
      height: number
      crop: string
      growSeconds: number
    }
  ): Promise<PlacedObject> {
    return await $api<PlacedObject>(
      `/v1/boards/by-session/${sessionCode}/user/${userId}/plant`,
      {
        method: 'POST',
        body
      }
    )
  }

  async function build(
    sessionCode: string,
    userId: number,
    body: {
      row: number
      col: number
      width: number
      height: number
      building: string
      level: number
    }
  ): Promise<PlacedObject> {
    return await $api<PlacedObject>(
      `/v1/boards/by-session/${sessionCode}/user/${userId}/build`,
      {
        method: 'POST',
        body
      }
    )
  }

  async function harvest(
    sessionCode: string,
    userId: number,
    objectId: number
  ): Promise<PlacedObject> {
    return await $api<PlacedObject>(
      `/v1/boards/by-session/${sessionCode}/user/${userId}/harvest/${objectId}`,
      {
        method: 'POST'
      }
    )
  }

  async function getCatalog(): Promise<CatalogItem[]> {
    return await $api<CatalogItem[]>('/v1/catalog')
  }

  return {
    getBoard,
    plant,
    build,
    harvest,
    getCatalog
  }
}