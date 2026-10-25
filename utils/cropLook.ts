export type CropKind =
  // Италия
  | 'wheat' | 'tomato' | 'olive' | 'grape' | 'basil' | 'lemon'
  // Япония
  | 'rice' | 'soybean' | 'tea_leaf' | 'seaweed' | 'ginger' | 'sesame'
  // Египет
  | 'barley' | 'dates' | 'flax' | 'chickpea' | 'spice' | 'papyrus'
  // Бразилия
  | 'coffee_berry' | 'sugarcane' | 'cocoa_bean' | 'corn' | 'cassava' | 'mango' | 'banana'
  // старые
  | 'potato' | 'sunflower'

const KNOWN: CropKind[] = [
  'wheat', 'tomato', 'olive', 'grape', 'basil', 'lemon',
  'rice', 'soybean', 'tea_leaf', 'seaweed', 'ginger', 'sesame',
  'barley', 'dates', 'flax', 'chickpea', 'spice', 'papyrus',
  'coffee_berry', 'sugarcane', 'cocoa_bean', 'corn', 'cassava', 'mango', 'banana',
  'potato', 'sunflower'
]

// код из БД -> тип культуры
export const cropKind = (code?: string | null): CropKind | null => {
  const c = (code ?? '').toLowerCase()
  return (KNOWN as string[]).includes(c) ? (c as CropKind) : null
}

const EMOJI: Record<CropKind, string> = {
  wheat: '🌾', tomato: '🍅', olive: '🫒', grape: '🍇', basil: '🌿', lemon: '🍋',
  rice: '🍚', soybean: '🫘', tea_leaf: '🍃', seaweed: '🌊', ginger: '🫚', sesame: '⚪',
  barley: '🌾', dates: '🌴', flax: '🌱', chickpea: '🫛', spice: '🌶️', papyrus: '📜',
  coffee_berry: '🫐', sugarcane: '🎋', cocoa_bean: '🍫', corn: '🌽', cassava: '🥔',
  mango: '🥭', banana: '🍌', potato: '🥔', sunflower: '🌻'
}
export const cropEmoji = (code?: string | null): string | null => {
  const k = cropKind(code)
  return k ? EMOJI[k] : null
}

// perCell — сколько растений на клетку по одной оси, size — ширина растения в клетках
export const CROP_LOOK: Record<CropKind, { perCell: number; size: number }> = {
  // Италия
  wheat:        { perCell: 3, size: 0.55 },
  tomato:       { perCell: 2, size: 0.9 },
  olive:        { perCell: 2, size: 0.9 },
  grape:        { perCell: 2, size: 1.0 },
  basil:        { perCell: 2, size: 0.85 },
  lemon:        { perCell: 2, size: 1.0 },
  // Япония
  rice:         { perCell: 3, size: 0.55 },
  soybean:      { perCell: 2, size: 0.8 },
  tea_leaf:     { perCell: 2, size: 0.9 },
  seaweed:      { perCell: 2, size: 0.9 },
  ginger:       { perCell: 2, size: 0.85 },
  sesame:       { perCell: 3, size: 0.6 },
  // Египет
  barley:       { perCell: 3, size: 0.55 },
  dates:        { perCell: 2, size: 0.9 },
  flax:         { perCell: 3, size: 0.6 },
  chickpea:     { perCell: 2, size: 0.8 },
  spice:        { perCell: 2, size: 0.85 },
  papyrus:      { perCell: 2, size: 1.0 },
  // Бразилия
  coffee_berry: { perCell: 2, size: 0.9 },
  sugarcane:    { perCell: 2, size: 1.0 },
  cocoa_bean:   { perCell: 2, size: 0.9 },
  corn:         { perCell: 2, size: 1.0 },
  cassava:      { perCell: 2, size: 0.9 },
  mango:        { perCell: 2, size: 1.0 },
  banana:       { perCell: 2, size: 1.0 },
  // старые
  potato:       { perCell: 2, size: 0.9 },
  sunflower:    { perCell: 2, size: 1.0 }
}

// размеры SVG-поля: ромб участка + запас сверху под высоту растений
export const fieldBox = (w: number, h: number, cell: number) => {
  const K = Math.SQRT1_2
  const padX = cell * 0.6
  const padTop = cell * 1.6
  const diamondW = (w + h) * cell * K
  return {
    x0: h * cell * K + padX,
    padTop,
    width: Math.round(diamondW + padX * 2),
    height: Math.round(diamondW / 2 + padTop + 8)
  }
}

// детерминированный генератор: поле выглядит одинаково при каждой перерисовке
export const cropRandom = (seed: number) => {
  let a = seed | 0
  return () => {
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}