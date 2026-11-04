import { defineStore } from 'pinia'

export interface Note {
  id: string
  product: string
  text: string
  done: boolean
}

let flashTimer: ReturnType<typeof setTimeout> | null = null

export const useNotesStore = defineStore('notes', {
  state: () => ({
    notes: [] as Note[],
    open: false,
    key: '',
    loaded: false,
    flash: ''
  }),

  getters: {
    pending: (state): number =>
      state.notes.filter(note => !note.done).length
  },

  actions: {
    init(key: string) {
      if (this.loaded && this.key === key) {
        return
      }

      this.key = key

      try {
        const raw = localStorage.getItem(`farm-notes:${key}`)
        const parsed = raw ? JSON.parse(raw) : null

        this.notes = Array.isArray(parsed?.notes)
          ? parsed.notes
          : []

        this.open = Boolean(parsed?.open)
      } catch {
        this.notes = []
      }

      this.loaded = true
    },

    save() {
      if (!this.loaded) {
        return
      }

      try {
        localStorage.setItem(
          `farm-notes:${this.key}`,
          JSON.stringify({
            notes: this.notes,
            open: this.open
          })
        )
      } catch {
        // Приватный режим браузера: заметки не сохраняются.
      }
    },

    say(message: string) {
      this.flash = message

      if (flashTimer) {
        clearTimeout(flashTimer)
      }

      flashTimer = setTimeout(() => {
        this.flash = ''
      }, 2200)
    },

    add(product: string, text: string) {
      this.notes.unshift({
        id:
          Date.now().toString(36) +
          Math.random().toString(36).slice(2, 6),
        product,
        text: text.trim(),
        done: false
      })

      this.save()
    },

    addProduct(code: string, title: string) {
      if (!this.loaded) {
        this.say('Заметки ещё не загрузились')
        return false
      }

      const exists = this.notes.some(
        note => note.product === code && !note.done
      )

      if (exists) {
        this.say(`«${title}» уже в заметках`)
        return false
      }

      this.add(code, '')
      this.say(`📝 «${title}» добавлен в заметки`)

      return true
    },

    toggle(id: string) {
      const note = this.notes.find(item => item.id === id)

      if (note) {
        note.done = !note.done
      }

      this.save()
    },

    remove(id: string) {
      this.notes = this.notes.filter(note => note.id !== id)
      this.save()
    },

    clearDone() {
      this.notes = this.notes.filter(note => !note.done)
      this.save()
    },

    setOpen(value: boolean) {
      this.open = value
      this.save()
    }
  }
})