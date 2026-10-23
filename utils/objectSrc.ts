export const objectSrc = (icon?: string) => {
  if (!icon) return ''
  if (/\p{Extended_Pictographic}/u.test(icon)) return '' // эмодзи — файла нет
  if (/^(https?:)?\//.test(icon)) return icon
  return `/object/${/\.(png|webp|svg|jpe?g|gif)$/i.test(icon) ? icon : icon + '.png'}`
}