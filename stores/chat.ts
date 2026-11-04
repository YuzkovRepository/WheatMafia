import { defineStore } from 'pinia'

export interface ChatPartner {
  userId: number
  nickName: string
  region: string | null
  lastText: string | null
  lastAtMs: number | null
  lastMine: boolean
  unread: number
}

export interface ChatMessage {
  id: number
  fromId: number
  toId: number
  text: string
  createdAtMs: number
  mine: boolean
}

const authHeaders = () => {
  const token = process.client ? localStorage.getItem('token') : null
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  }
}

const errMsg = (e: any, fallback: string) =>
  e?.data?.message || e?.data?.error || e?.message || fallback

const base = (code: string, userId: number) =>
  `/api/v1/chat/by-session/${code.toUpperCase()}/user/${userId}`

/**
 * Личные сообщения. Текст приходит только обычными запросами (для двух участников переписки);
 * по STOMP (/topic/chat.{code}.{userId}) прилетает лишь сигнал «есть новое».
 */
export const useChatStore = defineStore('chat', {
  state: () => ({
    partners: [] as ChatPartner[],
    totalUnread: 0,
    /** открытая переписка */
    openId: null as number | null,
    openNick: '',
    messages: [] as ChatMessage[],
    isLoading: false,
    error: null as string | null,
    /** кто последним написал, пока чат закрыт (для всплывающего уведомления) */
    lastIncomingFrom: null as number | null
  }),

  actions: {
    async loadOverview(code: string, userId: number) {
      try {
        const o = await $fetch<{ partners: ChatPartner[]; totalUnread: number }>(base(code, userId), {
          headers: authHeaders()
        })
        this.partners = o.partners
        this.totalUnread = Number(o.totalUnread)
      } catch (e: any) {
        this.error = errMsg(e, 'Не удалось загрузить чат')
      }
    },

    async openWith(code: string, userId: number, partnerId: number) {
      this.openId = partnerId
      this.isLoading = true
      this.error = null
      try {
        const c = await $fetch<{ partnerNick: string; messages: ChatMessage[] }>(
          `${base(code, userId)}/with/${partnerId}`, { headers: authHeaders() }
        )
        // за время запроса могли переключиться на другого собеседника
        if (this.openId === partnerId) {
          this.openNick = c.partnerNick
          this.messages = c.messages
        }
      } catch (e: any) {
        this.error = errMsg(e, 'Не удалось открыть переписку')
      } finally {
        this.isLoading = false
      }
      await this.loadOverview(code, userId)
    },

    closeConversation() {
      this.openId = null
      this.messages = []
    },

    async send(code: string, userId: number, text: string) {
      const partnerId = this.openId
      if (partnerId == null) return false
      this.error = null
      try {
        const m = await $fetch<ChatMessage>(`${base(code, userId)}/with/${partnerId}`, {
          method: 'POST', headers: authHeaders(), body: { text }
        })
        if (this.openId === partnerId) this.messages.push(m)
        this.loadOverview(code, userId)
        return true
      } catch (e: any) {
        this.error = errMsg(e, 'Не удалось отправить')
        return false
      }
    },

    /** Сигнал по STOMP: пришло сообщение от fromId. Если эта переписка открыта — подгружаем сразу. */
    async onSignal(code: string, userId: number, fromId: number, chatVisible: boolean) {
      if (this.openId === fromId && chatVisible) {
        await this.openWith(code, userId, fromId)
      } else {
        this.lastIncomingFrom = fromId
        await this.loadOverview(code, userId)
      }
    }
  }
})