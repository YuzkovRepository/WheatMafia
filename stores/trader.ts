import { defineStore } from 'pinia'
import { useMarketStore } from '~/stores/market'

interface SellResult {
  coins: number
  earned: number
}

interface TraderPrice {
  code: string
  price: number
}

const RU: Array<[string, string]> = [
  ['Not enough items in storage', 'На складе не хватает товара'],
  ['Trader does not buy this', 'Скупщик не берёт этот товар'],
  ['Invalid quantity', 'Некорректное количество'],
  ['Product not found', 'Продукт не найден']
]

const humanize = (e: any, fallback: string): string => {
  const raw: string = e?.data?.message || e?.message || ''
  const translation = RU.find(([english]) => raw.includes(english))

  return translation ? translation[1] : raw || fallback
}

export const useTraderStore = defineStore('trader', {
  state: () => ({
    prices: {} as Record<string, number>,
    isLoading: false,
    error: null as string | null
  }),

  actions: {
    async loadPrices() {
      const { $api } = useNuxtApp()

      this.isLoading = true

      try {
        const prices = await $api<TraderPrice[]>('/v1/trader/prices')

        this.prices = Object.fromEntries(
          (prices ?? []).map(price => [price.code, price.price])
        )
      } catch (e: any) {
        console.error('LOAD TRADER PRICES ERROR:', e)
        this.error = humanize(e, 'Не удалось загрузить цены')
      } finally {
        this.isLoading = false
      }
    },

    async sell(
      sessionCode: string,
      userId: number,
      productCode: string,
      quantity: number
    ): Promise<number | null> {
      const { $api } = useNuxtApp()
      const marketStore = useMarketStore()

      this.error = null

      try {
        const result = await $api<SellResult>(
          `/v1/trader/by-session/${sessionCode.toUpperCase()}/user/${userId}/sell`,
          {
            method: 'POST',
            body: {
              productCode,
              quantity
            }
          }
        )

        marketStore.coins = Number(result.coins)

        return Number(result.earned)
      } catch (e: any) {
        console.error('SELL ERROR:', e)
        this.error = humanize(e, 'Не удалось продать')

        return null
      }
    }
  }
})