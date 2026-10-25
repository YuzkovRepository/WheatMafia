<template>
  <div class="min-h-screen bg-gradient-to-br from-stone-900 via-stone-800 to-amber-950">
    <!-- Спрайт культур для иконок меню/шапки (без PNG). -->
    <svg width="0" height="0" style="position: absolute" aria-hidden="true">
      <defs>
        <symbol id="fc-sprout" viewBox="0 0 50 70">
          <ellipse cx="25" cy="66" rx="12" ry="3" fill="rgba(60,35,15,.45)" />
          <path d="M25 66 Q25 58 25 50" stroke="#5fae3f" stroke-width="2.4" stroke-linecap="round" fill="none" />
          <ellipse cx="18" cy="52" rx="8" ry="4" transform="rotate(-28 18 52)" fill="#6dc04a" />
          <ellipse cx="32" cy="49" rx="8" ry="4" transform="rotate(28 32 49)" fill="#59ad3c" />
        </symbol>

        <symbol id="fc-wheat" viewBox="0 0 50 70">
          <ellipse cx="25" cy="66" rx="20" ry="3.5" fill="rgba(60,35,15,.35)" />
          <g fill="none" stroke-width="2.2" stroke-linecap="round" style="stroke: var(--a, #d9aa33)">
            <path d="M25 66 Q24 40 12 22" />
            <path d="M25 66 Q24 36 19 12" />
            <path d="M25 66 L25 8" />
            <path d="M25 66 Q26 36 31 14" />
            <path d="M25 66 Q26 40 38 24" />
          </g>
          <g stroke="rgba(120,80,10,.35)" stroke-width=".8" style="fill: var(--b, #f4c84a)">
            <ellipse cx="12" cy="24" rx="3.3" ry="8" transform="rotate(-22 12 24)" />
            <ellipse cx="19" cy="14" rx="3.3" ry="8.5" transform="rotate(-8 19 14)" />
            <ellipse cx="25" cy="11" rx="3.4" ry="9" />
            <ellipse cx="31" cy="16" rx="3.3" ry="8.5" transform="rotate(8 31 16)" />
            <ellipse cx="38" cy="26" rx="3.3" ry="8" transform="rotate(22 38 26)" />
          </g>
        </symbol>

        <symbol id="fc-potato" viewBox="0 0 50 70">
          <ellipse cx="25" cy="65" rx="21" ry="5" fill="#6b4423" />
          <ellipse cx="25" cy="64" rx="17" ry="3.5" fill="#85592e" />
          <g style="opacity: var(--t, 0)">
            <ellipse cx="14" cy="64" rx="5" ry="3.4" fill="#c9a06b" />
            <ellipse cx="25" cy="66" rx="5.5" ry="3.6" fill="#d3ad78" />
            <ellipse cx="36" cy="64" rx="5" ry="3.4" fill="#c9a06b" />
          </g>
          <ellipse cx="14" cy="48" rx="10" ry="6" transform="rotate(-25 14 48)" fill="#3f8530" />
          <ellipse cx="36" cy="48" rx="10" ry="6" transform="rotate(25 36 48)" fill="#3f8530" />
          <ellipse cx="18" cy="36" rx="11" ry="6.5" transform="rotate(-35 18 36)" fill="#4f9a3a" />
          <ellipse cx="32" cy="36" rx="11" ry="6.5" transform="rotate(35 32 36)" fill="#4f9a3a" />
          <ellipse cx="25" cy="44" rx="9" ry="12" fill="#58a540" />
          <ellipse cx="25" cy="26" rx="9" ry="9" fill="#62b04a" />
          <g style="fill: var(--a, #fff)">
            <circle cx="21" cy="22" r="3.6" /><circle cx="30" cy="26" r="3.4" /><circle cx="26" cy="17" r="3.2" />
          </g>
          <g fill="#f6c945">
            <circle cx="21" cy="22" r="1.2" /><circle cx="30" cy="26" r="1.2" /><circle cx="26" cy="17" r="1.1" />
          </g>
        </symbol>

        <symbol id="fc-grape" viewBox="0 0 50 70">
          <ellipse cx="25" cy="66" rx="17" ry="3.5" fill="rgba(60,35,15,.4)" />
          <line x1="25" y1="66" x2="25" y2="10" stroke="#7a5a30" stroke-width="2.4" stroke-linecap="round" />
          <ellipse cx="15" cy="20" rx="10" ry="7" transform="rotate(-30 15 20)" fill="#3f8f35" />
          <ellipse cx="36" cy="18" rx="10" ry="7" transform="rotate(30 36 18)" fill="#4aa13e" />
          <ellipse cx="25" cy="12" rx="9" ry="7" fill="#5bb54a" />
          <ellipse cx="13" cy="36" rx="9" ry="6" transform="rotate(-20 13 36)" fill="#4aa13e" />
          <ellipse cx="38" cy="38" rx="9" ry="6" transform="rotate(20 38 38)" fill="#3f8f35" />
          <g stroke="rgba(0,0,0,.22)" stroke-width=".6" style="fill: var(--a, #6b2d92)">
            <circle cx="14" cy="36" r="3.4" /><circle cx="20" cy="36" r="3.4" />
            <circle cx="11" cy="41" r="3.4" /><circle cx="17" cy="41" r="3.4" /><circle cx="23" cy="41" r="3.4" />
            <circle cx="14" cy="46" r="3.4" /><circle cx="20" cy="46" r="3.4" />
            <circle cx="17" cy="51" r="3.4" />
            <circle cx="31" cy="40" r="3.4" /><circle cx="37" cy="40" r="3.4" />
            <circle cx="28" cy="45" r="3.4" /><circle cx="34" cy="45" r="3.4" /><circle cx="40" cy="45" r="3.4" />
            <circle cx="31" cy="50" r="3.4" /><circle cx="37" cy="50" r="3.4" />
            <circle cx="34" cy="55" r="3.4" />
          </g>
        </symbol>

        <symbol id="fc-tomato" viewBox="0 0 50 70">
          <ellipse cx="25" cy="66" rx="17" ry="3.5" fill="rgba(60,35,15,.4)" />
          <line x1="25" y1="66" x2="25" y2="6" stroke="#a67c3d" stroke-width="2" stroke-linecap="round" />
          <ellipse cx="14" cy="22" rx="10" ry="6" transform="rotate(-28 14 22)" fill="#3f8f35" />
          <ellipse cx="36" cy="18" rx="10" ry="6" transform="rotate(28 36 18)" fill="#4aa13e" />
          <ellipse cx="25" cy="10" rx="8" ry="6" fill="#5bb54a" />
          <ellipse cx="12" cy="40" rx="10" ry="6" transform="rotate(-20 12 40)" fill="#4aa13e" />
          <ellipse cx="38" cy="46" rx="10" ry="6" transform="rotate(20 38 46)" fill="#3f8f35" />
          <ellipse cx="14" cy="58" rx="9" ry="5" transform="rotate(-15 14 58)" fill="#3f8f35" />
          <g stroke="rgba(0,0,0,.2)" stroke-width=".6" style="fill: var(--a, #e43d30)">
            <circle cx="16" cy="44" r="4.8" /><circle cx="34" cy="38" r="4.8" />
            <circle cx="22" cy="54" r="4.8" /><circle cx="33" cy="57" r="4.8" />
            <circle cx="15" cy="30" r="4.4" /><circle cx="36" cy="27" r="4.4" />
          </g>
          <g fill="#3f8530">
            <circle cx="16" cy="39.6" r="1.7" /><circle cx="34" cy="33.6" r="1.7" />
            <circle cx="22" cy="49.6" r="1.7" /><circle cx="33" cy="52.6" r="1.7" />
            <circle cx="15" cy="25.9" r="1.6" /><circle cx="36" cy="22.9" r="1.6" />
          </g>
          <g fill="#fff" opacity=".45">
            <circle cx="14.4" cy="42.6" r="1.3" /><circle cx="32.4" cy="36.6" r="1.3" />
            <circle cx="20.4" cy="52.6" r="1.3" /><circle cx="31.4" cy="55.6" r="1.3" />
          </g>
        </symbol>

        <symbol id="fc-sunflower" viewBox="0 0 50 70">
          <ellipse cx="25" cy="66" rx="14" ry="3.2" fill="rgba(60,35,15,.4)" />
          <line x1="25" y1="66" x2="25" y2="28" stroke="#4a8a2a" stroke-width="3.6" stroke-linecap="round" />
          <ellipse cx="14" cy="50" rx="10" ry="5.5" transform="rotate(-30 14 50)" fill="#4a9a35" />
          <ellipse cx="36" cy="43" rx="10" ry="5.5" transform="rotate(30 36 43)" fill="#3f8a2d" />
          <g transform="translate(25 20)" style="fill: var(--a, #ffc61a)">
            <ellipse cx="0" cy="-11" rx="4.2" ry="8" transform="rotate(0)" />
            <ellipse cx="0" cy="-11" rx="4.2" ry="8" transform="rotate(30)" />
            <ellipse cx="0" cy="-11" rx="4.2" ry="8" transform="rotate(60)" />
            <ellipse cx="0" cy="-11" rx="4.2" ry="8" transform="rotate(90)" />
            <ellipse cx="0" cy="-11" rx="4.2" ry="8" transform="rotate(120)" />
            <ellipse cx="0" cy="-11" rx="4.2" ry="8" transform="rotate(150)" />
            <ellipse cx="0" cy="-11" rx="4.2" ry="8" transform="rotate(180)" />
            <ellipse cx="0" cy="-11" rx="4.2" ry="8" transform="rotate(210)" />
            <ellipse cx="0" cy="-11" rx="4.2" ry="8" transform="rotate(240)" />
            <ellipse cx="0" cy="-11" rx="4.2" ry="8" transform="rotate(270)" />
            <ellipse cx="0" cy="-11" rx="4.2" ry="8" transform="rotate(300)" />
            <ellipse cx="0" cy="-11" rx="4.2" ry="8" transform="rotate(330)" />
          </g>
          <circle cx="25" cy="20" r="8.5" stroke="rgba(0,0,0,.25)" stroke-width=".8" style="fill: var(--b, #5a3a1b)" />
          <g fill="rgba(255,255,255,.18)">
            <circle cx="22" cy="17" r="1" /><circle cx="27" cy="18" r="1" /><circle cx="24" cy="23" r="1" />
            <circle cx="29" cy="22" r="1" /><circle cx="21" cy="21" r="1" />
          </g>
        </symbol>
      </defs>
    </svg>

    <div class="max-w-[1800px] mx-auto px-2 sm:px-4 py-4">
      <div class="mb-4">
        <h1 class="text-2xl font-serif font-bold text-amber-50">
          Партия <span class="text-amber-400">{{ code }}</span>
        </h1>
        <p class="text-amber-200/60 text-sm">
          {{ authStore.user?.nickName }}
          <span class="ml-2 px-2 py-0.5 rounded-lg bg-stone-900/50 text-amber-300 text-xs font-semibold">
            🪙 {{ marketStore.coins }}
          </span>
          <span
            v-if="researchStore.region"
            class="ml-2 px-2 py-0.5 rounded-lg bg-amber-500/20 text-amber-300 text-xs font-semibold"
          >
            {{ regionLabel }}
          </span>
        </p>
      </div>

      <div v-if="catalogStore.error" class="mb-4 bg-amber-100 border border-amber-300 rounded-xl p-3">
        <p class="text-amber-800 text-sm">{{ catalogStore.error }}</p>
      </div>
      <div v-if="boardStore.error" class="mb-4 bg-red-100 border border-red-300 rounded-xl p-3">
        <p class="text-red-700 text-sm">{{ boardStore.error }}</p>
      </div>

      <!-- Блок фермы (правый клик отменяет режим строительства) -->
      <div
        class="relative rounded-2xl shadow-2xl overflow-hidden border border-amber-900/40"
        @contextmenu.prevent="cancelBuild"
      >
        <FarmBoard
          :board="boardStore.board"
          :cell-px="56"
          :plant-width="boardPreview.width"
          :plant-height="boardPreview.height"
          :preview-src="boardPreview.src"
          :preview-kind="boardPreview.kind"
          :preview-code="boardPreview.code"
          :ignore-id="moveId"
          :active="boardActive"
          @cell-click="onCellClick"
          @object-click="onObjectClick"
        />

        <!-- режим переноса склада -->
        <div
          v-if="moveObj"
          class="absolute top-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3 px-4 py-2 rounded-xl bg-amber-500 text-stone-900 shadow-xl border border-amber-300/60"
        >
          <span class="text-sm font-semibold">Выберите новое место для склада</span>
          <button @click="cancelMove" class="px-2 py-0.5 rounded-lg bg-stone-900/15 hover:bg-stone-900/25 text-sm font-semibold">
            Отмена
          </button>
        </div>

        <!-- левый верхний угол: что выбрано (только в режиме строительства) -->
        <div
          v-if="placing"
          class="absolute top-3 left-3 z-10 flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl bg-stone-900/75 backdrop-blur text-amber-50 border border-white/10 shadow-lg"
        >
          <!-- культура: SVG-символ, без PNG -->
          <svg
            v-if="iconView(selectedItem).cropKind"
            viewBox="0 0 50 70"
            class="w-8 h-8"
            aria-hidden="true"
          >
            <use :href="`#fc-${iconView(selectedItem).cropKind}`" x="0" y="0" width="50" height="70" />
          </svg>
          <!-- здание: PNG, если файл есть; иначе эмодзи -->
          <img
            v-else-if="iconView(selectedItem).src && !broken.has(iconView(selectedItem).src)"
            :src="iconView(selectedItem).src"
            class="w-8 h-8 object-contain"
            alt=""
            @error="broken.add(iconView(selectedItem).src)"
          />
          <span v-else class="text-2xl">{{ iconView(selectedItem).emoji }}</span>

          <div class="leading-tight">
            <div class="text-sm font-semibold">{{ selectedItem?.title }}</div>
            <div v-if="selectedItem" class="text-[11px] text-amber-200/70">
              {{ selectedItem.width }}×{{ selectedItem.height }}
              <template v-if="selectedItem.kind === 'CROP'">
                · ⏱ {{ fmtDuration(resolveGrowSeconds(selectedItem.code)) }}
                · ⭐ +{{ productOf(selectedItem.code)?.score ?? 0 }}
              </template>
            </div>
          </div>
        </div>

        <!-- скупщик: сбоку от фермы -->
        <button
          @click="openTrader"
          aria-label="Скупщик"
          class="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 z-10 group flex flex-col items-center"
        >
          <img
            v-if="traderSrc && !broken.has(traderSrc)"
            :src="traderSrc"
            class="w-24 sm:w-36 object-contain drop-shadow-xl group-hover:scale-105 transition"
            alt=""
            @error="broken.add(traderSrc)"
          />
          <span v-else class="text-6xl">🧑‍💼</span>
          <span class="mt-1 px-3 py-1 rounded-full bg-stone-900/75 text-amber-100 text-xs font-semibold border border-white/10">
            Скупщик
          </span>
        </button>

        <!-- левый нижний угол: подсказка -->
        <div class="hidden sm:block absolute bottom-3 left-3 z-10 px-3 py-1.5 rounded-xl bg-stone-900/60 backdrop-blur text-[11px] text-amber-100/80 border border-white/10">
          <template v-if="placing">Клик по лугу — поставить · Esc / правый клик / «Отмена» — выйти из режима</template>
          <template v-else>Клик по золотой грядке — собрать · клик по заводу — производство · клик по складу — содержимое · 🧪 — исследования · 🧑‍💼 — продать скупщику · 🏪 — маркетплейс · 🤝 — контракты · 🛠️ — строительство</template>
        </div>

        <!-- правый нижний угол: отмена строительства (сверху), исследования, маркетплейс, справочник, склад и инструменты -->
        <div class="absolute bottom-3 right-3 z-10 flex flex-col items-end gap-2">
          <button
            v-if="placing"
            @click="cancelBuild"
            class="flex items-center gap-2 px-4 py-2 rounded-2xl bg-red-500 hover:bg-red-400 active:scale-95 text-white text-sm font-semibold shadow-xl border border-red-300/60 transition"
          >
            ✕ Отмена: {{ selectedItem?.title }}
          </button>

          <div class="flex items-center gap-2">
            <!-- исследования -->
            <button
              @click="openResearch"
              aria-label="Исследования"
              title="Дерево исследований"
              class="relative w-14 h-14 rounded-2xl bg-amber-500 hover:bg-amber-400 active:scale-95 text-3xl shadow-xl border border-amber-300/60 transition flex items-center justify-center"
            >
              🧪
              <span
                v-if="researchStore.readyToOpen.length"
                class="absolute -top-1.5 -right-1.5 min-w-[20px] h-5 px-1 rounded-full bg-stone-900 text-amber-300 text-[11px] font-bold flex items-center justify-center border border-amber-300/60"
              >
                {{ researchStore.readyToOpen.length }}
              </span>
            </button>
            <!-- контракты (обмен товарами) и суперзаказы -->
            <button
              @click="openDeals"
              aria-label="Контракты и суперзаказы"
              title="Контракты и суперзаказы"
              class="relative w-14 h-14 rounded-2xl bg-amber-500 hover:bg-amber-400 active:scale-95 text-3xl shadow-xl border border-amber-300/60 transition flex items-center justify-center"
            >
              🤝
              <span
                v-if="dealsStore.contracts.length + dealsStore.orders.length"
                class="absolute -top-1.5 -right-1.5 min-w-[20px] h-5 px-1 rounded-full bg-stone-900 text-amber-300 text-[11px] font-bold flex items-center justify-center border border-amber-300/60"
              >
                {{ dealsStore.contracts.length + dealsStore.orders.length }}
              </span>
            </button>
            <!-- маркетплейс: торговля между игроками -->
            <button
              @click="openMarket"
              aria-label="Маркетплейс"
              title="Маркетплейс — торговля с другими игроками"
              class="relative w-14 h-14 rounded-2xl bg-amber-500 hover:bg-amber-400 active:scale-95 text-3xl shadow-xl border border-amber-300/60 transition flex items-center justify-center"
            >
              🏪
              <span
                v-if="marketStore.lots.length"
                class="absolute -top-1.5 -right-1.5 min-w-[20px] h-5 px-1 rounded-full bg-stone-900 text-amber-300 text-[11px] font-bold flex items-center justify-center border border-amber-300/60"
              >
                {{ marketStore.lots.length }}
              </span>
            </button>
            <button
              @click="catalogOpen = true"
              aria-label="Справочник"
              title="Справочник"
              class="w-14 h-14 rounded-2xl bg-amber-500 hover:bg-amber-400 active:scale-95 text-3xl shadow-xl border border-amber-300/60 transition flex items-center justify-center"
            >
              📖
            </button>
            <button
              @click="openWarehouse"
              :disabled="!warehouseObj"
              aria-label="Склад"
              title="Склад"
              class="w-14 h-14 rounded-2xl bg-amber-500 hover:bg-amber-400 active:scale-95 text-3xl shadow-xl border border-amber-300/60 transition flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed"
            >
              📦
            </button>
            <button
              @click="openBuilder"
              aria-label="Инструменты"
              title="Строительство"
              class="w-14 h-14 rounded-2xl bg-amber-500 hover:bg-amber-400 active:scale-95 text-3xl shadow-xl border border-amber-300/60 transition flex items-center justify-center"
            >
              🛠️
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Модалка выбора -->
    <div
      v-if="builderOpen"
      class="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
      @click.self="closeBuilder"
    >
      <div class="bg-stone-50 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[85vh] flex flex-col overflow-hidden">
        <div class="flex items-center justify-between px-5 py-4 border-b border-stone-200">
          <h2 class="text-2xl">🛠️</h2>
          <button @click="closeBuilder" class="text-stone-500 hover:text-stone-800 text-2xl leading-none">×</button>
        </div>

        <div class="flex gap-2 px-5 pt-3">
          <button
            v-for="tab in tabs"
            :key="tab.key"
            @click="activeTab = tab.key"
            class="px-4 py-2 rounded-xl font-semibold text-sm transition"
            :class="activeTab === tab.key
              ? 'bg-amber-500 text-stone-900'
              : 'bg-stone-200 text-stone-600 hover:bg-stone-300'"
          >
            {{ tab.label }}
          </button>
        </div>

        <div class="p-5 overflow-y-auto">
          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            <button
              v-for="item in itemsForTab"
              :key="item.code"
              @click="pickItem(item)"
              @mouseenter="hoverCode = item.code"
              @mouseleave="hoverCode = null"
              @focus="hoverCode = item.code"
              @blur="hoverCode = null"
              class="flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition"
              :class="placing && selectedCode === item.code
                ? 'border-amber-500 bg-amber-50'
                : 'border-stone-200 bg-white hover:border-amber-300'"
            >
              <!-- культура: SVG-символ -->
              <svg
                v-if="iconView(item).cropKind"
                viewBox="0 0 50 70"
                class="w-12 h-12"
                aria-hidden="true"
              >
                <use :href="`#fc-${iconView(item).cropKind}`" x="0" y="0" width="50" height="70" />
              </svg>
              <!-- здание: PNG или эмодзи -->
              <img
                v-else-if="iconView(item).src && !broken.has(iconView(item).src)"
                :src="iconView(item).src"
                class="w-12 h-12 object-contain"
                alt=""
                @error="broken.add(iconView(item).src)"
              />
              <span v-else class="text-4xl">{{ iconView(item).emoji }}</span>

              <span class="text-sm font-semibold text-stone-700 text-center">{{ item.title }}</span>
              <span class="text-xs text-stone-400">{{ item.width }}×{{ item.height }}</span>
            </button>
          </div>

          <p v-if="itemsForTab.length === 0" class="text-stone-500 text-center py-8">
            В этом разделе пока ничего нет.
          </p>
        </div>

        <!-- Панель сведений: наведённый (или выбранный) элемент -->
        <div class="border-t border-stone-200 bg-white px-5 py-3 min-h-[84px] max-h-40 overflow-y-auto">
          <template v-if="infoItem">
            <!-- культура -->
            <div v-if="infoItem.kind === 'CROP'" class="flex items-center gap-3">
              <div class="text-3xl">{{ productEmoji(infoItem.code) }}</div>
              <div class="text-sm">
                <div class="font-semibold text-stone-800">{{ infoItem.title }}</div>
                <div class="text-stone-600">
                  ⏱ Рост: <b>{{ fmtDuration(resolveGrowSeconds(infoItem.code)) }}</b>
                  · ⭐ Репутация: <b>+{{ productOf(infoItem.code)?.score ?? 0 }}</b> за единицу
                  <template v-if="(productOf(infoItem.code)?.baseScore ?? 0) > 0">
                    · 🌱 <b>+{{ productOf(infoItem.code)?.baseScore }}</b> за выращивание
                  </template>
                </div>
              </div>
            </div>

            <!-- завод: список рецептов -->
            <div v-else class="text-sm">
              <div class="font-semibold text-stone-800 mb-1">{{ infoItem.title }}</div>
              <ul class="space-y-0.5 text-stone-600">
                <li v-for="r in recipeRows(infoItem.code)" :key="r.code">
                  {{ r.emoji }} <b>{{ r.title }}</b>
                  — ⏱ {{ fmtDuration(r.time) }} · ⭐ +{{ r.score }}
                  <span v-if="r.inputs.length" class="text-stone-400">
                    · из {{ r.inputs.map(i => `${i.emoji} ${i.title} ×${i.qty}`).join(', ') }}
                  </span>
                </li>
                <li v-if="recipeRows(infoItem.code).length === 0" class="text-stone-400">
                  Рецептов пока нет.
                </li>
              </ul>
            </div>
          </template>
          <p v-else class="text-sm text-stone-400">
            Наведите на культуру или завод, чтобы увидеть время и репутацию.
          </p>
        </div>
      </div>
    </div>

    <!-- Модалка склада: всё, что лежит на складе -->
    <div
      v-if="activeWarehouse"
      class="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
      @click.self="closeWarehouse"
    >
      <div class="bg-stone-50 rounded-2xl shadow-2xl w-full max-w-xl max-h-[85vh] flex flex-col overflow-hidden">
        <div class="flex items-center justify-between px-5 py-4 border-b border-stone-200">
          <div>
            <h2 class="text-xl font-semibold text-stone-800">📦 Склад</h2>
            <p class="text-xs text-stone-500">
              Всего: {{ storageStore.total }}<template v-if="storageStore.capacity != null"> / {{ storageStore.capacity }}</template>
            </p>
          </div>
          <div class="flex items-center gap-2">
            <button
              @click="startMove"
              class="px-3 py-1.5 rounded-xl font-semibold text-sm bg-amber-500 hover:bg-amber-400 text-stone-900"
            >
              Переместить
            </button>
            <button @click="closeWarehouse" class="text-stone-500 hover:text-stone-800 text-2xl leading-none">×</button>
          </div>
        </div>

        <div class="p-5 overflow-y-auto space-y-4">
          <p v-if="storageStore.error" class="bg-red-100 border border-red-300 text-red-700 text-sm rounded-xl p-2">
            {{ storageStore.error }}
          </p>

          <div v-for="g in storageGroups" :key="g.kind">
            <h3 class="text-xs font-semibold uppercase tracking-wide text-stone-400 mb-2">{{ g.label }}</h3>
            <div class="grid grid-cols-2 sm:grid-cols-3 gap-2">
              <div
                v-for="i in g.items"
                :key="i.code"
                class="flex items-center gap-2 rounded-xl border-2 border-stone-200 bg-white px-3 py-2"
              >
                <span class="text-2xl">{{ i.emoji }}</span>
                <div class="min-w-0 leading-tight">
                  <div class="text-sm font-semibold text-stone-700 truncate">{{ i.title }}</div>
                  <div class="text-xs text-stone-500">×{{ i.qty }}</div>
                </div>
              </div>
            </div>
          </div>

          <p v-if="storageGroups.length === 0" class="text-stone-500 text-center py-8">
            {{ storageStore.isLoading ? 'Загрузка…' : 'Склад пуст. Соберите урожай или запустите производство.' }}
          </p>
        </div>
      </div>
    </div>

    <!-- Модалка завода: рецепты и производство -->
    <div
      v-if="activeFactory"
      class="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
      @click.self="closeFactory"
    >
      <div class="bg-stone-50 rounded-2xl shadow-2xl w-full max-w-xl max-h-[85vh] flex flex-col overflow-hidden">
        <div class="flex items-center justify-between px-5 py-4 border-b border-stone-200">
          <div class="flex items-center gap-3">
            <img
              v-if="iconView(activeFactoryItem).src && !broken.has(iconView(activeFactoryItem).src)"
              :src="iconView(activeFactoryItem).src"
              class="w-10 h-10 object-contain"
              alt=""
              @error="broken.add(iconView(activeFactoryItem).src)"
            />
            <span v-else class="text-3xl">{{ iconView(activeFactoryItem).emoji }}</span>
            <h2 class="text-xl font-semibold text-stone-800">
              {{ activeFactoryItem?.title ?? activeFactory.building }}
            </h2>
          </div>
          <button @click="closeFactory" class="text-stone-500 hover:text-stone-800 text-2xl leading-none">×</button>
        </div>

        <div class="p-5 overflow-y-auto space-y-3">
          <p v-if="boardStore.error" class="bg-red-100 border border-red-300 text-red-700 text-sm rounded-xl p-2">
            {{ boardStore.error }}
          </p>

          <!-- идёт производство -->
          <div v-if="factoryRunning" class="rounded-xl border-2 border-amber-400 bg-amber-50 p-3">
            <div class="flex items-center gap-3">
              <div class="text-4xl">{{ productEmoji(activeFactory.productionOutput) }}</div>
              <div class="flex-1 min-w-0">
                <div class="font-semibold text-stone-800">
                  {{ productOf(activeFactory.productionOutput)?.title ?? activeFactory.productionOutput }}
                  <span v-if="(activeFactory.productionOutputQty ?? 1) > 1">×{{ activeFactory.productionOutputQty }}</span>
                </div>
                <div class="text-xs text-stone-600">
                  <template v-if="factoryDone">Готово — можно забирать</template>
                  <template v-else>Осталось: {{ fmtDuration(factoryLeft) }}</template>
                </div>
                <div class="mt-2 h-2 rounded-full bg-stone-200 overflow-hidden">
                  <div
                    class="h-full bg-gradient-to-b from-lime-400 to-lime-600 transition-all duration-1000 ease-linear"
                    :style="{ width: factoryPct * 100 + '%' }"
                  />
                </div>
              </div>
              <button
                v-if="factoryDone"
                :disabled="busy"
                @click="onCollect"
                class="px-4 py-2 rounded-xl font-semibold text-sm bg-amber-500 hover:bg-amber-400 text-stone-900 disabled:opacity-50"
              >
                Забрать
              </button>
            </div>
          </div>

          <!-- рецепты -->
          <div
            v-for="r in activeRecipes"
            :key="r.code"
            class="rounded-xl border-2 border-stone-200 bg-white p-3 flex items-center gap-3"
            :class="{ 'opacity-60': factoryRunning || !r.canMake }"
          >
            <div class="text-4xl">{{ r.emoji }}</div>
            <div class="flex-1 min-w-0">
              <div class="font-semibold text-stone-800">
                {{ r.title }}
                <span v-if="r.qty > 1" class="text-stone-500">×{{ r.qty }}</span>
                <span v-if="r.illegal" class="ml-1 text-[11px] font-semibold text-red-600">🚫 нелегально</span>
              </div>
              <div class="text-xs mt-1">
                <div v-if="r.inputs.length" class="flex flex-wrap gap-1.5">
                  <span
                    v-for="i in r.inputs"
                    :key="i.code"
                    class="inline-flex items-center gap-1 rounded-lg border px-2 py-0.5"
                    :class="i.enough
                      ? 'border-lime-300 bg-lime-50 text-lime-800'
                      : 'border-red-300 bg-red-50 text-red-700'"
                  >
                    {{ i.emoji }} {{ i.title }}
                    <b>{{ i.have }}/{{ i.qty }}</b>
                    <span v-if="!i.enough">(не хватает {{ i.qty - i.have }})</span>
                  </span>
                </div>
                <span v-else class="text-stone-500">Ничего не требуется</span>
              </div>
              <div class="text-xs text-stone-600 mt-1">
                ⏱ {{ fmtDuration(r.time) }} · ⭐ +{{ r.score }}
              </div>
            </div>
            <button
              :disabled="factoryRunning || busy || !r.canMake"
              :title="!r.canMake ? 'Не хватает ингредиентов на складе' : ''"
              @click="onProduce(r.code)"
              class="px-3 py-2 rounded-xl font-semibold text-sm bg-amber-500 hover:bg-amber-400 text-stone-900 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Производить
            </button>
          </div>

          <p v-if="activeRecipes.length === 0" class="text-stone-500 text-center py-6">
            У этого завода пока нет рецептов.
          </p>
        </div>
      </div>
    </div>

    <!-- Скупщик (NPC), маркетплейс (игроки), контракты, справочник, исследования -->
    <TraderModal v-if="traderOpen" :code="code" @close="traderOpen = false" />
    <MarketModal v-if="marketOpen" :code="code" @close="marketOpen = false" />
    <DealsModal v-if="dealsOpen" :code="code" @close="dealsOpen = false" />
    <CatalogModal v-if="catalogOpen" @close="catalogOpen = false" />
    <ResearchModal v-if="researchOpen" :code="code" @close="researchOpen = false" />
  </div>
</template>

<script setup lang="ts">
import { Client } from '@stomp/stompjs'
import { useBoardStore } from '~/stores/board'
import { useAuthStore } from '~/stores/auth'
import { useCatalogStore, type FactoryItem } from '~/stores/catalog'
import type { PlacedObject, Cell, Board } from '~/stores/board'
import { objectSrc } from '~/utils/objectSrc'
import { cropKind } from '~/utils/cropLook'
import { useStorageStore } from '~/stores/storage'
import { useMarketStore } from '~/stores/market'
import { useDealsStore } from '~/stores/deals'
import { useResearchStore } from '~/stores/research'
import { productEmoji, fmtDuration, toMs } from '~/utils/productLook'

const route = useRoute()
const authStore = useAuthStore()
const boardStore = useBoardStore()
const catalogStore = useCatalogStore()
const storageStore = useStorageStore()
const marketStore = useMarketStore()
const dealsStore = useDealsStore()
const researchStore = useResearchStore()

const code = computed(() => String(route.params.code || '').toUpperCase())

const builderOpen = ref(false)
const activeTab = ref<'CROP' | 'BUILDING'>('CROP')
const selectedCode = ref<string | null>(null)
const hoverCode = ref<string | null>(null)

/* ---------- режим строительства ---------- */
const buildMode = ref(false)

const broken = reactive(new Set<string>())

const tabs = [
  { key: 'CROP' as const, label: '🌾 Культуры' },
  { key: 'BUILDING' as const, label: '🏭 Заводы' }
]

// секундный тик для таймеров производства
const now = ref(Date.now())
let tick: ReturnType<typeof setInterval> | null = null
onMounted(() => { tick = setInterval(() => (now.value = Date.now()), 1000) })
onBeforeUnmount(() => { if (tick) clearInterval(tick) })

const itemsForTab = computed<FactoryItem[]>(() => {
  if (activeTab.value === 'CROP') {
    // только культуры своего региона (общие с region == null — тоже)
    return catalogStore.cropsForRegion(researchStore.region) ?? []
  }
  return (catalogStore.buildingsForUi ?? []).filter(
    b => b.code !== 'warehouse' && b.code !== 'trader'
  )
})

const selectedItem = computed<FactoryItem | null>(() =>
  selectedCode.value ? catalogStore.byCode(selectedCode.value) : null
)

// режим размещения активен: что-то выбрано и режим включён
const placing = computed(() => buildMode.value && !!selectedItem.value)
// FarmBoard показывает превью и принимает клики по пустым клеткам
const boardActive = computed(() => placing.value || moveId.value != null)

const isEmoji = (s?: string | null) =>
  !!s && /\p{Extended_Pictographic}/u.test(s)

const iconSrc = (icon: string) =>
  /\.(svg|png|webp|jpe?g|gif)$/i.test(icon) ? `/icons/${icon}` : `/icons/${icon}.png`

/**
 * Иконка для UI:
 *  - CROP → SVG-символ #fc-{cropKind}, без PNG
 *  - BUILDING → PNG из /icons/{icon}.png; если icon нет/эмодзи → эмодзи-фолбэк
 */
const iconView = (
  item?: { icon?: string | null; code: string; kind?: 'CROP' | 'BUILDING' } | null
): { src: string; emoji: string; cropKind: string | null } => {
  if (!item) return { src: '', emoji: '—', cropKind: null }

  if (item.kind === 'CROP') {
    const kind = cropKind(item.code)
    return { src: '', emoji: '', cropKind: kind }
  }

  if (item.icon && !isEmoji(item.icon)) {
    return { src: iconSrc(item.icon), emoji: '', cropKind: null }
  }
  return { src: '', emoji: item.icon || '🏭', cropKind: null }
}

// превью-спрайт на поле: для культур всегда undefined (FarmBoard рисует кодом)
const previewSrc = computed(() => {
  const item = selectedItem.value
  if (!item) return undefined
  if (item.kind === 'CROP') return undefined
  return objectSrc(item.icon) || undefined
})

/**
 * Безопасно достаёт время роста культуры:
 * 1) через геттер стора (если он есть);
 * 2) иначе — ищет рецепт вручную по state.recipes;
 * 3) иначе — 60 секунд по умолчанию.
 */
const resolveGrowSeconds = (cropCode: string): number => {
  const store = catalogStore as any
  if (typeof store.growSecondsFor === 'function') {
    return store.growSecondsFor(cropCode)
  }
  const recipes = (catalogStore.recipes ?? []) as Array<{ factoryCode: string; productionTime: number }>
  const r = recipes.find(x => x.factoryCode === cropCode)
  return r?.productionTime ?? 60
}

/* ---------- сведения о продуктах и рецептах ---------- */
const productOf = (c?: string | null) => (c ? catalogStore.productByCode(c) : null)

// сколько продукта/культуры лежит на складе
const haveOf = (c: string): number =>
  storageStore.items.find(i => i.code === c)?.qty ?? 0

const recipeRows = (factoryCode?: string | null) => {
  if (!factoryCode) return []
  return catalogStore.recipesFor(factoryCode).map(r => {
    const p = productOf(r.outputCode)
    const inputs = (r.inputs ?? []).map(i => {
      const have = haveOf(i.code)
      return {
        code: i.code,
        qty: i.qty,
        have,
        enough: have >= i.qty,
        title: i.title || productOf(i.code)?.title || i.code,
        emoji: productEmoji(i.code)
      }
    })
    return {
      code: r.outputCode,
      title: r.outputTitle || p?.title || r.outputCode,
      emoji: productEmoji(r.outputCode),
      qty: r.outputQty ?? 1,
      time: r.productionTime,
      score: p?.score ?? 0,
      illegal: p?.legality === 'ILLEGAL',
      inputs,
      canMake: inputs.every(i => i.enough)
    }
  })
}

/* ---------- меню строительства: сведения при наведении ---------- */
const infoItem = computed<FactoryItem | null>(() =>
  hoverCode.value ? catalogStore.byCode(hoverCode.value) : (placing.value ? selectedItem.value : null)
)

const openBuilder = () => {
  hoverCode.value = null
  builderOpen.value = true
}
const closeBuilder = () => {
  hoverCode.value = null
  builderOpen.value = false
}

onMounted(async () => {
  await catalogStore.load()
})

function pickItem(item: { code: string }) {
  selectedCode.value = item.code
  buildMode.value = true
  closeBuilder()
}

const cancelBuild = () => {
  buildMode.value = false
  selectedCode.value = null
}

/* ---------- меню завода ---------- */
const factoryObjId = ref<number | null>(null)
const busy = ref(false)

// берём объект из актуального состояния доски — обновляется по STOMP
const activeFactory = computed<PlacedObject | null>(() => {
  if (factoryObjId.value == null) return null
  return boardStore.board?.objects.find(o => o.id === factoryObjId.value && o.kind === 'BUILDING') ?? null
})
const activeFactoryItem = computed<FactoryItem | null>(() =>
  activeFactory.value?.building ? catalogStore.byCode(activeFactory.value.building) : null
)
const activeRecipes = computed(() => recipeRows(activeFactory.value?.building))

const factoryRunning = computed(() => {
  const o = activeFactory.value
  return !!o && !!o.productionStartedAt && !!o.productionReadyAt
})
const factoryDone = computed(() => {
  const o = activeFactory.value
  return factoryRunning.value && !!o && now.value >= toMs(o.productionReadyAt)
})
const factoryLeft = computed(() => {
  const o = activeFactory.value
  if (!o || !factoryRunning.value) return 0
  return Math.max(0, Math.ceil((toMs(o.productionReadyAt) - now.value) / 1000))
})
const factoryPct = computed(() => {
  const o = activeFactory.value
  if (!o || !factoryRunning.value) return 0
  const start = toMs(o.productionStartedAt), end = toMs(o.productionReadyAt)
  if (!end || end <= start) return factoryDone.value ? 1 : 0
  return Math.min(Math.max((now.value - start) / (end - start), 0), 1)
})

const closeFactory = () => { factoryObjId.value = null }

const onProduce = async (outputCode: string) => {
  const userId = authStore.user?.id
  const obj = activeFactory.value
  if (!userId || !obj || busy.value) return
  busy.value = true
  try {
    await boardStore.startProduction(code.value, userId, obj.id, outputCode)
  } finally {
    busy.value = false
  }
}

const onCollect = async () => {
  const userId = authStore.user?.id
  const obj = activeFactory.value
  if (!userId || !obj || busy.value) return
  busy.value = true
  try {
    await boardStore.collectProduction(code.value, userId, obj.id)
  } finally {
    busy.value = false
  }
}

/* ---------- склад ---------- */
const WAREHOUSE = 'warehouse'
const warehouseOpen = ref(false)
const moveId = ref<number | null>(null)

const warehouseObj = computed<PlacedObject | null>(() =>
  boardStore.board?.objects.find(o => o.kind === 'BUILDING' && o.building === WAREHOUSE) ?? null
)
const activeWarehouse = computed(() => (warehouseOpen.value ? warehouseObj.value : null))
const moveObj = computed<PlacedObject | null>(() =>
  moveId.value == null ? null : boardStore.board?.objects.find(o => o.id === moveId.value) ?? null
)

const loadStorage = () => {
  const userId = authStore.user?.id
  if (userId) storageStore.load(code.value, userId)
}

const openWarehouse = () => {
  warehouseOpen.value = true
  loadStorage()
}
const closeWarehouse = () => { warehouseOpen.value = false }

/* ---------- скупщик (NPC), маркетплейс (игроки), контракты, справочник, исследования ---------- */
const traderOpen = ref(false)
const marketOpen = ref(false)
const dealsOpen = ref(false)
const catalogOpen = ref(false)
const researchOpen = ref(false)

const openTrader = () => {
  buildMode.value = false
  traderOpen.value = true
}
const openMarket = () => {
  buildMode.value = false
  marketOpen.value = true
}
const openDeals = () => {
  buildMode.value = false
  dealsOpen.value = true
}
const openResearch = () => {
  buildMode.value = false
  researchOpen.value = true
  const userId = authStore.user?.id
  if (userId) researchStore.load(code.value, userId)
}
// картинка скупщика (иконка берётся из каталога: code = trader)
const traderSrc = computed(() => objectSrc(catalogStore.byCode('trader')?.icon) || '')

// подпись региона в шапке
const regionLabel = computed(() => {
  const map: Record<string, string> = {
    ITALY: '🇮🇹 Италия',
    JAPAN: '🇯🇵 Япония',
    EGYPT: '🇪🇬 Египет',
    BRAZIL: '🇧🇷 Бразилия'
  }
  return map[researchStore.region] ?? researchStore.region ?? ''
})

// пока склад открыт, содержимое обновляется вместе с доской (сбор, производство)
watch(() => boardStore.board, () => {
  if (warehouseOpen.value || factoryObjId.value != null) loadStorage()
})

const storageGroups = computed(() => {
  const groups: { kind: string; label: string; items: { code: string; title: string; emoji: string; qty: number }[] }[] = [
    { kind: 'CROP', label: '🌾 Урожай', items: [] },
    { kind: 'MATERIAL', label: '🥣 Материалы', items: [] },
    { kind: 'GOODS', label: '🍷 Товары', items: [] }
  ]
  for (const it of storageStore.items) {
    const p = productOf(it.code)
    const g = groups.find(x => x.kind === (p?.kind ?? 'MATERIAL')) ?? groups[1]
    g.items.push({ code: it.code, title: p?.title ?? it.code, emoji: productEmoji(it.code), qty: it.qty })
  }
  return groups.filter(g => g.items.length)
})

/* перенос склада: «Переместить» → клик по свободному месту на поле */
const startMove = () => {
  if (!warehouseObj.value) return
  buildMode.value = false          // не смешиваем режимы
  moveId.value = warehouseObj.value.id
  closeWarehouse()
}
const cancelMove = () => { moveId.value = null }

// превью на поле: при переносе — склад, иначе выбранная культура/здание (только в режиме строительства)
const boardPreview = computed(() => {
  const m = moveObj.value
  if (m) {
    const item = catalogStore.byCode(m.building ?? '')
    return {
      width: m.width,
      height: m.height,
      kind: 'BUILDING' as const,
      src: objectSrc(item?.icon) || undefined,
      code: m.building
    }
  }
  const it = placing.value ? selectedItem.value : null
  return {
    width: it?.width ?? 2,
    height: it?.height ?? 2,
    kind: (it?.kind === 'BUILDING' ? 'BUILDING' : 'CROP') as 'BUILDING' | 'CROP',
    src: it ? previewSrc.value : undefined,
    code: it?.code
  }
})

const onKey = (e: KeyboardEvent) => {
  if (e.key !== 'Escape') return
  if (researchOpen.value) researchOpen.value = false
  else if (traderOpen.value) traderOpen.value = false
  else if (marketOpen.value) marketOpen.value = false
  else if (dealsOpen.value) dealsOpen.value = false
  else if (catalogOpen.value) catalogOpen.value = false
  else if (moveId.value != null) cancelMove()
  else if (buildMode.value) cancelBuild()
  else if (warehouseOpen.value) closeWarehouse()
}
onMounted(() => window.addEventListener('keydown', onKey))
onBeforeUnmount(() => window.removeEventListener('keydown', onKey))

let client: Client | null = null

onMounted(() => {
  const userId = authStore.user?.id
  if (!userId) return

  const proto = location.protocol === 'https:' ? 'wss' : 'ws'
  client = new Client({
    brokerURL: `${proto}://${location.host}/ws`,
    reconnectDelay: 3000,
    onConnect: async () => {
      client!.subscribe(`/topic/board.${code.value}.${userId}`, (msg) => {
        boardStore.applyBoardState(JSON.parse(msg.body) as Board)
        // склад мог измениться (сбор урожая/производство) — обновим дерево, если модалка открыта
        if (researchOpen.value) researchStore.load(code.value, userId)
      })
      // маркетплейс: баланс/журнал + обновление при любой сделке игроков в партии
      marketStore.load(code.value, userId)
      client!.subscribe(`/topic/market.${code.value}`, () => {
        marketStore.load(code.value, userId)
        loadStorage()
      })
      // контракты и суперзаказы: обновляем списки, склад и баланс при любом изменении в партии
      dealsStore.load(code.value, userId)
      client!.subscribe(`/topic/deals.${code.value}`, () => {
        dealsStore.load(code.value, userId)
        loadStorage()
      })
      if (!boardStore.board) {
        await boardStore.loadMyBoard(code.value, userId)
      }
      // дерево исследований: загрузить при старте, чтобы бейдж «готово к исследованию» был актуален
      await researchStore.load(code.value, userId)
    }
  })
  client.activate()
})

onUnmounted(() => {
  client?.deactivate()
  client = null
})

watch(
  () => authStore.user?.id,
  (id) => {
    if (id && !boardStore.board) boardStore.loadMyBoard(code.value, id)
  }
)

const onCellClick = async (cell: Cell) => {
  const userId = authStore.user?.id
  if (!userId || !boardStore.board) return
  const size = boardStore.board.size
  const row = Math.floor(cell.index / size)
  const col = cell.index % size

  // режим переноса склада
  if (moveId.value != null) {
    const res = await boardStore.moveObject(code.value, userId, moveId.value, row, col)
    if (res.success) moveId.value = null
    return
  }

  // вне режима строительства клики по пустым клеткам ничего не делают
  if (!placing.value) return
  const item = selectedItem.value
  if (!item) return

  if (item.kind === 'CROP') {
    const growSeconds = resolveGrowSeconds(item.code)
    await boardStore.plant(code.value, userId, {
      row, col,
      width: item.width,
      height: item.height,
      crop: item.code,
      growSeconds
    })
  } else {
    await boardStore.build(code.value, userId, {
      row, col,
      width: item.width,
      height: item.height,
      building: item.code,
      level: 1
    })
  }
}

const onObjectClick = async (obj: PlacedObject) => {
  const userId = authStore.user?.id
  if (!userId) return
  if (moveId.value != null) return // идёт перенос склада: клики по объектам не нужны

  // лаборатория → дерево исследований
  if (obj.kind === 'BUILDING' && obj.building === 'laboratory') {
    boardStore.error = null
    openResearch()
    return
  }

  if (obj.kind === 'BUILDING' && obj.building === WAREHOUSE) {
    boardStore.error = null
    openWarehouse()
    return
  }

  if (obj.kind === 'BUILDING') {
    boardStore.error = null
    factoryObjId.value = obj.id
    loadStorage() // нужен актуальный остаток ингредиентов
    return
  }

  if (obj.kind === 'CROP' && obj.readyAt && new Date(obj.readyAt) <= new Date()) {
    await boardStore.harvest(code.value, userId, obj.id)
  }
}
</script>