import { defineStore } from 'pinia'
import { useMarketStore } from '~/stores/market'

export interface DealItem {
  code: string
  qty: number
}

export interface Contract {
  id: number
  creatorId: number
  creatorNick: string
  offer: DealItem[]
  request: DealItem[]
  description: string | null
  createdAt: string
}

export interface BuyOrder {
  id: number
  buyerId: number
  buyerNick: string
  productCode: string
  productTitle: string
  quantity: number   // заказано всего
  remaining: number  // осталось купить
  price: number      // за одну штуку
  description: string | null
  createdAt: string
}

interface Overview {
  coins: number
  contracts: Contract[]
  orders: BuyOrder[]
}

const authHeaders = () => {
  const token = process.client ? localStorage.getItem('token') : null
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  }
}

const base = (code: string, userId: number) =>
  `/api/v1/deals/by-session/${code.toUpperCase()}/user/${userId}`

const RU: Array<[string, string]> = [
  ['Not enough items in storage', 'На складе не хватает товара'],
  ['Not enough coins', 'Не хватает монет'],
  ['Storage full', 'Склад переполнен'],
  ['Creator storage is full', 'У автора контракта переполнен склад'],
  ['Buyer storage is full', 'У заказчика переполнен склад'],
  ['Contract is no longer available', 'Контракт уже недоступен'],
  ['Order is no longer available', 'Заказ уже недоступен'],
  ['Cannot accept own contract', 'Нельзя принять свой контракт'],
  ['Cannot fulfill own order', 'Нельзя выполнить свой заказ'],
  ['Only the creator can cancel', 'Отменить может только автор'],
  ['Only the buyer can cancel', 'Отменить может только заказчик'],
  ['Offer and request must differ', 'Нельзя менять товар на такой же'],
  ['Too many active contracts', 'Слишком много активных контрактов (максимум 10)'],
  ['Too many active orders', 'Слишком много активных заказов (максимум 10)'],
  ['Too many item types', 'Не больше 5 видов товара с каждой стороны'],
  ['Duplicate product', 'Товар повторяется в списке'],
  ['Invalid items', 'Добавьте товары с обеих сторон'],
  ['Invalid quantity', 'Количество: от 1 до 100'],
  ['Invalid price', 'Некорректная цена'],
  ['Product not found', 'Продукт не найден']
]
const humanize = (e: any, fallback: string): string => {
  const raw: string = e?.data?.message || e?.message || ''
  const hit = RU.find(([k]) => raw.includes(k))
  return hit ? hit[1] : raw || fallback
}

export const useDealsStore = defineStore('deals', {
  state: () => ({
    contracts: [] as Contract[],
    orders: [] as BuyOrder[],
    isLoading: false,
    error: null as string | null
  }),

  actions: {
    apply(o: Overview) {
      this.contracts = o?.contracts ?? []
      this.orders = o?.orders ?? []
      // баланс общий с маркетплейсом и скупщиком
      useMarketStore().coins = Number(o?.coins ?? 0)
    },

    async load(code: string, userId: number) {
      this.isLoading = true
      try {
        this.apply(await $fetch<Overview>(base(code, userId), { headers: authHeaders() }))
      } catch (e: any) {
        this.error = humanize(e, 'Не удалось загрузить контракты и заказы')
      } finally {
        this.isLoading = false
      }
    },

    async post(code: string, userId: number, path: string, body?: unknown): Promise<boolean> {
      this.error = null
      try {
        this.apply(
          await $fetch<Overview>(`${base(code, userId)}${path}`, {
            method: 'POST',
            headers: authHeaders(),
            body: body as any
          })
        )
        return true
      } catch (e: any) {
        this.error = humanize(e, 'Операция не удалась')
        return false
      }
    },

    createContract(code: string, userId: number, body: { offer: DealItem[]; request: DealItem[]; description: string | null }) {
      return this.post(code, userId, '/contracts', body)
    },
    acceptContract(code: string, userId: number, id: number) {
      return this.post(code, userId, `/contracts/${id}/accept`)
    },
    cancelContract(code: string, userId: number, id: number) {
      return this.post(code, userId, `/contracts/${id}/cancel`)
    },

    createOrder(code: string, userId: number, body: { productCode: string; quantity: number; price: number; description: string | null }) {
      return this.post(code, userId, '/orders', body)
    },
    fulfillOrder(code: string, userId: number, id: number, quantity: number) {
      return this.post(code, userId, `/orders/${id}/fulfill`, { quantity })
    },
    cancelOrder(code: string, userId: number, id: number) {
      return this.post(code, userId, `/orders/${id}/cancel`)
    }
  }
})