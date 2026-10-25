import { defineStore } from 'pinia'
import { useMarketStore } from '~/stores/market'

interface SellResult {
  coins: number
  earned: number
}

const authHeaders = () => {
  const token = process.client ? localStorage.getItem('token') : null
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  }
}

const RU: Array<[string, string]> = [
  ['Not enough items in storage', 'На складе не хватает товара'],
  ['Trader does not buy this', 'Скупщик не берёт этот товар'],
  ['Invalid quantity', 'Некорректное количество'],
  ['Product not found', 'Продукт не найден']
]
const humanize = (e: any, fallback: string): string => {
  const raw: string = e?.data?.message || e?.message || ''
  const hit = RU.find(([k]) => raw.includes(k))
  return hit ? hit[1] : raw || fallback
}

export const useTraderStore = defineStore('trader', {
  state: () => ({
    /** code продукта -> цена скупки за 1 шт. Нет в таблице — скупщик не берёт. */
    prices: {} as Record<string, number>,
    isLoading: false,
    error: null as string | null
  }),

  actions: {
    async loadPrices() {
      this.isLoading = true
      try {
        const list = await $fetch<Array<{ code: string; price: number }>>('/api/v1/trader/prices', {
          headers: authHeaders()
        })
        this.prices = Object.fromEntries((list ?? []).map(p => [p.code, p.price]))
      } catch (e: any) {
        this.error = humanize(e, 'Не удалось загрузить цены')
      } finally {
        this.isLoading = false
      }
    },

    /** Продать скупщику. Возвращает заработанные монеты или null при ошибке. */
    async sell(sessionCode: string, userId: number, productCode: string, quantity: number): Promise<number | null> {
      this.error = null
      try {
        const res = await $fetch<SellResult>(
          `/api/v1/trader/by-session/${sessionCode.toUpperCase()}/user/${userId}/sell`,
          { method: 'POST', headers: authHeaders(), body: { productCode, quantity } }
        )
        // баланс общий с маркетплейсом
        useMarketStore().coins = Number(res.coins)
        return Number(res.earned)
      } catch (e: any) {
        this.error = humanize(e, 'Не удалось продать')
        return null
      }
    }
  }
})