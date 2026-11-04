import { defineStore } from 'pinia'

export interface Note {
  id: string
  product: string
  text: string
  done: boolean
}

let flashTimer: ReturnType<typeof setTimeout> | null = null

/**
 * Личные заметки игрока. Бэкенд не участвует: всё в localStorage (отдельно для партии и игрока).
 * Общий стор нужен, чтобы продукт можно было добавить двойным кликом из справочника и дерева исследований.
 */
export const useNotesStore = defineStore('notes', {
  state: () => ({
    notes: [] as Note[],
    open: false,
    key: '',
    loaded: false,
    /** короткое сообщение «добавлено в заметки» (показывает farm-page) */
    flash: ''
  }),
  getters: {
    pending: (s) => s.notes.filter(n => !n.done).length
  },
  actions: {
    init(key: string) {
      if (this.loaded && this.key === key) return
      this.key = key
      try {
        const raw = localStorage.getItem(`farm-notes:${key}`)
        const parsed = raw ? JSON.parse(raw) : null
        this.notes = Array.isArray(parsed?.notes) ? parsed.notes : []
        this.open = !!parsed?.open
      } catch {
        this.notes = []
      }
      this.loaded = true
    },
    save() {
      if (!this.loaded) return
      try {
        localStorage.setItem(`farm-notes:${this.key}`, JSON.stringify({ notes: this.notes, open: this.open }))
      } catch { /* приватный режим — заметки просто не сохранятся */ }
    },
    say(msg: string) {
      this.flash = msg
      if (flashTimer) clearTimeout(flashTimer)
      flashTimer = setTimeout(() => { this.flash = '' }, 2200)
    },
    add(product: string, text: string) {
      this.notes.unshift({
        id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
        product,
        text: text.trim(),
        done: false
      })
      this.save()
    },
    /** Двойной клик по продукту: добавить в заметки (если там уже есть невыполненная — не дублируем). */
    addProduct(code: string, title: string) {
      if (!this.loaded) {
        this.say('Заметки ещё не загрузились')
        return false
      }
      if (this.notes.some(n => n.product === code && !n.done)) {
        this.say(`«${title}» уже в заметках`)
        return false
      }
      this.add(code, '')
      this.say(`📝 «${title}» добавлен в заметки`)
      return true
    },
    toggle(id: string) {
      const n = this.notes.find(x => x.id === id)
      if (n) n.done = !n.done
      this.save()
    },
    remove(id: string) {
      this.notes = this.notes.filter(n => n.id !== id)
      this.save()
    },
    clearDone() {
      this.notes = this.notes.filter(n => !n.done)
      this.save()
    },
    setOpen(v: boolean) {
      this.open = v
      this.save()
    }
  }
})