import { defineStore } from 'pinia'

export interface Lot {
  slotId: number
  sellerId: number
  sellerNick: string
  productCode: string
  productTitle: string
  productKind: 'CROP' | 'MATERIAL' | 'GOODS'
  quantity: number
  price: number
  description: string | null
  createdAt: string
}

interface Overview {
  coins: number
  lots: Lot[]
}

export interface SellBody {
  productCode: string
  quantity: number
  price: number
  description: string | null
}

const RU: Array<[string, string]> = [
  ['Not enough coins', 'Не хватает монет'],
  ['Storage full', 'Склад переполнен'],
  ['Lot is no longer available', 'Лот уже недоступен'],
  ['Cannot buy own lot', 'Нельзя купить свой лот'],
  ['Only the seller can cancel', 'Снять лот может только продавец'],
  ['Not enough items in storage', 'На складе не хватает товара'],
  ['Too many active lots', 'Слишком много активных лотов (максимум 10)'],
  ['Invalid quantity', 'Количество: от 1 до 100'],
  ['Invalid price', 'Некорректная цена'],
  ['Product not found', 'Продукт не найден']
]

const humanize = (e: any, fallback: string): string => {
  const raw: string = e?.data?.message || e?.message || ''
  const translation = RU.find(([english]) => raw.includes(english))

  return translation ? translation[1] : raw || fallback
}

const marketPath = (code: string, userId: number) =>
  `/v1/market/by-session/${code.toUpperCase()}/user/${userId}`

export const useMarketStore = defineStore('market', {
  state: () => ({
    lots: [] as Lot[],
    coins: 0,
    isLoading: false,
    error: null as string | null
  }),

  actions: {
    apply(overview: Overview) {
      this.lots = overview?.lots ?? []
      this.coins = Number(overview?.coins ?? 0)
    },

    async load(code: string, userId: number) {
      const { $api } = useNuxtApp()

      this.isLoading = true

      try {
        const overview = await $api<Overview>(
          marketPath(code, userId)
        )

        this.apply(overview)
      } catch (e: any) {
        console.error('LOAD MARKET ERROR:', e)
        this.error = humanize(e, 'Не удалось загрузить рынок')
      } finally {
        this.isLoading = false
      }
    },

    async post(
      code: string,
      userId: number,
      path: string,
      body?: unknown
    ): Promise<boolean> {
      const { $api } = useNuxtApp()

      this.error = null

      try {
        const overview = await $api<Overview>(
          `${marketPath(code, userId)}${path}`,
          {
            method: 'POST',
            body: body as any
          }
        )

        this.apply(overview)

        return true
      } catch (e: any) {
        console.error('MARKET OPERATION ERROR:', e)
        this.error = humanize(e, 'Операция не удалась')

        return false
      }
    },

    sell(
      code: string,
      userId: number,
      body: SellBody
    ) {
      return this.post(code, userId, '/sell', body)
    },

    buy(
      code: string,
      userId: number,
      slotId: number
    ) {
      return this.post(code, userId, `/buy/${slotId}`)
    },

    cancel(
      code: string,
      userId: number,
      slotId: number
    ) {
      return this.post(code, userId, `/cancel/${slotId}`)
    }
  }
})