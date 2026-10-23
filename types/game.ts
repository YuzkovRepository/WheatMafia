// types/game.ts
export interface Cell {
  index: number
  type: 'EMPTY' | 'OCCUPIED'
  objectId: number | null
}

export type PlacedKind = 'CROP' | 'BUILDING'

export interface PlacedObject {
  id: number
  kind: PlacedKind
  row: number
  col: number
  width: number
  height: number
  // crop
  crop?: string
  growSeconds?: number
  plantedAt?: string
  readyAt?: string
  // building
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

export interface CatalogItem {
  id: number
  code: string
  title: string
  kind: 'CROP' | 'BUILDING'
  icon: string
  width: number
  height: number
  productionTime: number
  score: number
}