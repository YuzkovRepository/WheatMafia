const IMG: Record<string, string> = {
  ITALY: 'italian_deputy',
  JAPAN: 'japanese_deputy',
  EGYPT: 'egyptian_deputy',
  BRAZIL: 'brazilian_deputy'
}

const TITLE: Record<string, string> = {
  ITALY: 'Итальянский депутат',
  JAPAN: 'Японский депутат',
  EGYPT: 'Египетский депутат',
  BRAZIL: 'Бразильский депутат'
}

const FLAG: Record<string, string> = {
  ITALY: '🇮🇹',
  JAPAN: '🇯🇵',
  EGYPT: '🇪🇬',
  BRAZIL: '🇧🇷'
}

const NAME: Record<string, string> = {
  ITALY: 'Италия',
  JAPAN: 'Япония',
  EGYPT: 'Египет',
  BRAZIL: 'Бразилия'
}

/** Картинка депутата из public/object */
export const deputyImgSrc = (region?: string | null): string =>
  region && IMG[region] ? `/object/${IMG[region]}.png` : ''

export const deputyTitle = (region?: string | null): string =>
  (region && TITLE[region]) || 'Депутат'

export const regionFlag = (region?: string | null): string =>
  (region && FLAG[region]) || '🏳️'

export const regionName = (region?: string | null): string =>
  region && NAME[region] ? `${FLAG[region]} ${NAME[region]}` : ''