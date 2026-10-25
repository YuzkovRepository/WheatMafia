import { defineStore } from 'pinia'

export interface Lot {
  slotId: number
  sellerId: number
  sellerNick: string
  productCode: string
  productTitle: string
  productKind: 'CROP' | 'MATERIAL' | 'GOODS'
  quantity: number
  price: number // за одну штуку
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

const authHeaders = () => {
  const token = process.client ? localStorage.getItem('token') : null
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  }
}

const base = (code: string, userId: number) =>
  `/api/v1/market/by-session/${code.toUpperCase()}/user/${userId}`

// сообщения сервера -> понятный текст
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
  const hit = RU.find(([k]) => raw.includes(k))
  return hit ? hit[1] : raw || fallback
}

export const useMarketStore = defineStore('market', {
  state: () => ({
    lots: [] as Lot[],
    coins: 0,
    isLoading: false,
    error: null as string | null
  }),

  actions: {
    apply(o: Overview) {
      this.lots = o?.lots ?? []
      this.coins = Number(o?.coins ?? 0)
    },

    async load(code: string, userId: number) {
      this.isLoading = true
      try {
        const o = await $fetch<Overview>(base(code, userId), { headers: authHeaders() })
        this.apply(o)
      } catch (e: any) {
        this.error = humanize(e, 'Не удалось загрузить рынок')
      } finally {
        this.isLoading = false
      }
    },

    async post(code: string, userId: number, path: string, body?: unknown): Promise<boolean> {
      this.error = null
      try {
        const o = await $fetch<Overview>(`${base(code, userId)}${path}`, {
          method: 'POST',
          headers: authHeaders(),
          body: body as any
        })
        this.apply(o)
        return true
      } catch (e: any) {
        this.error = humanize(e, 'Операция не удалась')
        return false
      }
    },

    sell(code: string, userId: number, body: SellBody) {
      return this.post(code, userId, '/sell', body)
    },
    buy(code: string, userId: number, slotId: number) {
      return this.post(code, userId, `/buy/${slotId}`)
    },
    cancel(code: string, userId: number, slotId: number) {
      return this.post(code, userId, `/cancel/${slotId}`)
    }
  }
})