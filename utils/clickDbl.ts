/**
 * Одиночный и двойной клик на одном элементе: одиночный срабатывает с небольшой задержкой
 * и отменяется, если следом пришёл двойной. Лежит в utils/.
 */
export function useClickDbl<T>(single: (arg: T) => void, dbl: (arg: T) => void, delay = 260) {
  let timer: ReturnType<typeof setTimeout> | null = null
  return {
    onClick(arg: T) {
      if (timer) clearTimeout(timer)
      timer = setTimeout(() => { timer = null; single(arg) }, delay)
    },
    onDbl(arg: T) {
      if (timer) { clearTimeout(timer); timer = null }
      try { window.getSelection()?.removeAllRanges() } catch { /* ignore */ }
      dbl(arg)
    }
  }
}