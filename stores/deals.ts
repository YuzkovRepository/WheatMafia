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
  quantity: number
  remaining: number
  price: number
  description: string | null
  createdAt: string
}

interface Overview {
  coins: number
  contracts: Contract[]
  orders: BuyOrder[]
}

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
  const translation = RU.find(([english]) => raw.includes(english))

  return translation ? translation[1] : raw || fallback
}

const dealsPath = (code: string, userId: number) =>
  `/v1/deals/by-session/${code.toUpperCase()}/user/${userId}`

export const useDealsStore = defineStore('deals', {
  state: () => ({
    contracts: [] as Contract[],
    orders: [] as BuyOrder[],
    isLoading: false,
    error: null as string | null
  }),

  actions: {
    apply(overview: Overview) {
      this.contracts = overview?.contracts ?? []
      this.orders = overview?.orders ?? []

      const marketStore = useMarketStore()
      marketStore.coins = Number(overview?.coins ?? 0)
    },

    async load(code: string, userId: number) {
      const { $api } = useNuxtApp()

      this.isLoading = true

      try {
        const overview = await $api<Overview>(
          dealsPath(code, userId)
        )

        this.apply(overview)
      } catch (e: any) {
        console.error('LOAD DEALS ERROR:', e)
        this.error = humanize(
          e,
          'Не удалось загрузить контракты и заказы'
        )
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
          `${dealsPath(code, userId)}${path}`,
          {
            method: 'POST',
            body: body as any
          }
        )

        this.apply(overview)

        return true
      } catch (e: any) {
        console.error('DEALS OPERATION ERROR:', e)
        this.error = humanize(e, 'Операция не удалась')

        return false
      }
    },

    createContract(
      code: string,
      userId: number,
      body: {
        offer: DealItem[]
        request: DealItem[]
        description: string | null
      }
    ) {
      return this.post(code, userId, '/contracts', body)
    },

    acceptContract(
      code: string,
      userId: number,
      id: number
    ) {
      return this.post(
        code,
        userId,
        `/contracts/${id}/accept`
      )
    },

    cancelContract(
      code: string,
      userId: number,
      id: number
    ) {
      return this.post(
        code,
        userId,
        `/contracts/${id}/cancel`
      )
    },

    createOrder(
      code: string,
      userId: number,
      body: {
        productCode: string
        quantity: number
        price: number
        description: string | null
      }
    ) {
      return this.post(code, userId, '/orders', body)
    },

    fulfillOrder(
      code: string,
      userId: number,
      id: number,
      quantity: number
    ) {
      return this.post(
        code,
        userId,
        `/orders/${id}/fulfill`,
        { quantity }
      )
    },

    cancelOrder(
      code: string,
      userId: number,
      id: number
    ) {
      return this.post(
        code,
        userId,
        `/orders/${id}/cancel`
      )
    }
  }
})