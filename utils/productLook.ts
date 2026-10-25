// Эмодзи продуктов для UI и для значков над заводами на поле.
// Ключ — code продукта из БД (см. SeedData).
const PRODUCT_EMOJI: Record<string, string> = {
  // --- культуры Италии ---
  wheat: '🌾', tomato: '🍅', olive: '🫒', grape: '🍇', basil: '🌿', lemon: '🍋',
  // --- культуры Японии ---
  rice: '🍚', soybean: '🫘', tea_leaf: '🍃', seaweed: '🌊', ginger: '🫚', sesame: '⚪',
  // --- культуры Египта ---
  barley: '🌾', dates: '🌴', flax: '🌱', chickpea: '🫛', spice: '🌶️', papyrus: '📜',
  // --- культуры Бразилии ---
  coffee_berry: '🫐', sugarcane: '🎋', cocoa_bean: '🍫', corn: '🌽', cassava: '🥔', mango: '🥭', banana: '🍌',

  // --- материалы ---
  flour: '🥣', semolina: '🌾', bread: '🍞', dough: '🫓', grissini: '🥖',
  tomato_sauce: '🥫', dried_tomato: '🍅', olive_oil: '🫒', pesto: '🌿',
  grape_juice: '🧃', wine: '🍷', balsamic: '🫗', pasta: '🍝', risotto: '🍚',
  pickled_olives: '🫒', lemon_jam: '🍋', egg: '🥚', milk: '🥛', salt: '🧂',
  cheese: '🧀', sugar: '🍬', coffee: '☕', chocolate: '🍫', green_tea: '🍵',

  rice_flour: '🌾', sesame_oil: '🛢️', rice_vinegar: '🍶', sake: '🍶',
  pickled_ginger: '🫚', tofu: '⬜', soy_milk: '🥛', fried_tofu: '🟫',
  matcha: '🍵', ginger_tea: '🍵', dried_seaweed: '🌊', fish: '🐟',
  soy_sauce: '🍶', miso_paste: '🥣', dried_fish: '🐟', noodles: '🍜',
  mochi: '🍡', matcha_dessert: '🍵',

  date_syrup: '🍯', flax_oil: '🛢️', butter: '🧈', yogurt: '🥛',
  linen_cloth: '🧵', papyrus_paper: '📜', spice_mix: '🌶️', falafel: '🟤',
  flatbread: '🫓', date_cake: '🍰', hummus: '🥣',

  sugar_cane: '🎋', molasses: '🍯', cocoa_powder: '🍫',
  corn_flour: '🌽', cassava_flour: '🥔', tapioca: '⚪',
  mango_juice: '🧃', banana_chips: '🍌', mango_jam: '🍯',
  beef: '🥩', cachaca: '🍶', cornbread: '🍞', tapioca_crepe: '🫓',
  mango_sorbet: '🍨', coffee_bread: '🍞', pao_de_queijo: '🧀',

  // --- готовые товары ---
  pizza: '🍕', tomato_pizza: '🍕', caprese: '🥗', focaccia: '🫓',
  limoncello: '🍋', lemon_sorbet: '🍨', biscotti: '🍪',
  cheese_pasta: '🍝', seafood_pasta: '🍝', lasagna: '🍲', arancini: '🍙',
  festival_pizza: '🍕', seafood_pizza: '🍕', coffee_tiramisu: '🍰',
  chocolate_tart: '🍰', panna_cotta: '🍮', gelato: '🍨', matcha_gelato: '🍨',
  aperitivo: '🍹', grappa: '🥃',
  onigiri: '🍙', maki: '🍣', sushi: '🍣', miso_soup: '🍲',
  fried_rice: '🍚', teriyaki_fish: '🐟', ramen: '🍜', gyudon: '🍚',
  tempura: '🍤', curry_rice: '🍛', festival_soup: '🍲',
  california_roll: '🍣', tempura_roll: '🍣', chocolate_mochi: '🍫',
  dorayaki: '🥞', matcha_latte: '🍵', bootleg_sake: '🍶',
  shakshuka: '🍳', cheese_flatbread: '🫓', olive_flatbread: '🫓',
  date_pie: '🥧', baklava: '🍯', mango_yogurt: '🥛', date_arak: '🥃',
  spiced_rice: '🍚', koshari: '🍲', fish_tagine: '🐟', date_coffee: '☕',
  festival_pie: '🥧', chocolate_dates: '🍫',
  brigadeiro: '🍫', coffee_latte: '☕', churrasco: '🥩', beef_stew: '🍲',
  soy_feijoada: '🍲', caipirinha: '🍹', chocolate_cake: '🍰',
  coffee_dessert: '🍰', matcha_brigadeiro: '🍫', chocolate_gift_box: '🎁',
  tropical_flatbread: '🫓', moqueca: '🍲', rice_beef_bowl: '🍚',
  bolognese: '🍝',

  // --- экспортные наборы (этапы 5-6, на будущее) ---
  italian_feast: '🍽️', gourmet_basket: '🧺', aperitivo_set: '🍹',
  dessert_tray: '🍰', italy_grand_export: '🏆',
  sushi_platter: '🍣', tea_ceremony_set: '🍵', ramen_feast: '🍜',
  japan_export_box: '📦', japan_grand_export: '🏆',
  eastern_feast: '🍽️', egyptian_trade_bundle: '📦', oasis_banquet: '🍽️',
  papyrus_gift_set: '🎁', egypt_grand_export: '🏆',
  tropical_festival: '🎉', brazil_export_crate: '📦', churrasco_feast: '🥩',
  coffee_collection: '☕', brazil_grand_export: '🏆'
}


export const productEmoji = (code?: string | null): string =>
  (code && PRODUCT_EMOJI[code]) || '📦'

// 45 -> "45 с", 90 -> "1 мин 30 с", 120 -> "2 мин"
export const fmtDuration = (sec: number): string => {
  const s = Math.max(0, Math.round(sec))
  if (s < 60) return `${s} с`
  const m = Math.floor(s / 60)
  const r = s % 60
  return r ? `${m} мин ${r} с` : `${m} мин`
}

// ISO-строка или epoch (сек/мс) -> миллисекунды
export const toMs = (v?: string | number | null): number =>
  !v ? 0 : typeof v === 'number' ? (v < 1e12 ? v * 1000 : v) : new Date(v).getTime()