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

const errMsg = (e: any, fallback: string) =>
  e?.data?.message || e?.data?.error || e?.message || fallback

const chatPath = (code: string, userId: number) =>
  `/v1/chat/by-session/${code.toUpperCase()}/user/${userId}`

export const useChatStore = defineStore('chat', {
  state: () => ({
    partners: [] as ChatPartner[],
    totalUnread: 0,
    openId: null as number | null,
    openNick: '',
    messages: [] as ChatMessage[],
    isLoading: false,
    error: null as string | null,
    lastIncomingFrom: null as number | null
  }),

  actions: {
    async loadOverview(code: string, userId: number) {
      const { $api } = useNuxtApp()

      try {
        const response = await $api<{
          partners: ChatPartner[]
          totalUnread: number
        }>(chatPath(code, userId))

        this.partners = response.partners
        this.totalUnread = Number(response.totalUnread)
      } catch (e: any) {
        this.error = errMsg(e, 'Не удалось загрузить чат')
      }
    },

    async openWith(code: string, userId: number, partnerId: number) {
      const { $api } = useNuxtApp()

      this.openId = partnerId
      this.isLoading = true
      this.error = null

      try {
        const response = await $api<{
          partnerNick: string
          messages: ChatMessage[]
        }>(`${chatPath(code, userId)}/with/${partnerId}`)

        if (this.openId === partnerId) {
          this.openNick = response.partnerNick
          this.messages = response.messages
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
      const { $api } = useNuxtApp()

      const partnerId = this.openId

      if (partnerId == null) {
        return false
      }

      this.error = null

      try {
        const message = await $api<ChatMessage>(
          `${chatPath(code, userId)}/with/${partnerId}`,
          {
            method: 'POST',
            body: { text }
          }
        )

        if (this.openId === partnerId) {
          this.messages.push(message)
        }

        this.loadOverview(code, userId)

        return true
      } catch (e: any) {
        this.error = errMsg(e, 'Не удалось отправить')
        return false
      }
    },

    async onSignal(
      code: string,
      userId: number,
      fromId: number,
      chatVisible: boolean
    ) {
      if (this.openId === fromId && chatVisible) {
        await this.openWith(code, userId, fromId)
      } else {
        this.lastIncomingFrom = fromId
        await this.loadOverview(code, userId)
      }
    }
  }
})