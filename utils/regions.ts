/** Страны игры: флаг и название. Лежит в utils/. */
export const REGIONS: Record<string, { flag: string; name: string }> = {
  ITALY: { flag: '🇮🇹', name: 'Италия' },
  JAPAN: { flag: '🇯🇵', name: 'Япония' },
  EGYPT: { flag: '🇪🇬', name: 'Египет' },
  BRAZIL: { flag: '🇧🇷', name: 'Бразилия' }
}

export const regionInfo = (code?: string | null) =>
  code ? (REGIONS[code] ?? { flag: '🌍', name: code }) : null

/** «🇯🇵 Япония · этап 3» — чтобы одним взглядом объяснить другому игроку, где искать продукт. */
export const regionStageLabel = (region?: string | null, stage?: number | null) => {
  const r = regionInfo(region)
  if (!r) return '🌍 общий'
  return `${r.flag} ${r.name}${stage ? ` · этап ${stage}` : ''}`
}