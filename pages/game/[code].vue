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
          :buyer="buyerView"
          @cell-click="onCellClick"
          @object-click="onObjectClick"
          @buyer-click="openBlack"
        />

        <!-- режим переноса (склад или завод) -->
        <div
          v-if="moveObj"
          class="absolute top-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3 px-4 py-2 rounded-xl bg-amber-500 text-stone-900 shadow-xl border border-amber-300/60"
        >
          <span class="text-sm font-semibold">Выберите новое место: {{ moveTitle }}</span>
          <button @click="cancelMove" class="px-2 py-0.5 rounded-lg bg-stone-900/15 hover:bg-stone-900/25 text-sm font-semibold">
            Отмена
          </button>
        </div>

        <!-- совет семей: голосование за случайное событие каждые 5 минут -->
        <div
          v-if="authStore.user?.id"
          class="absolute left-1/2 -translate-x-1/2 z-20 pointer-events-none"
          :class="moveObj ? 'top-16' : 'top-3'"
        >
          <CouncilPanel :code="code" :user-id="authStore.user.id" />
        </div>

        <!-- левый верхний угол: личные заметки (только в браузере, без бэкенда) -->
        <div
          class="absolute left-3 z-10 flex flex-col items-start gap-2"
          :class="placing ? 'top-16' : 'top-3'"
        >
          <FarmNotes :storage-key="`${code}:${authStore.user?.id ?? 0}`" />
          <!-- личные сообщения между игроками -->
          <ChatPanel
            v-if="authStore.user?.id"
            :code="code"
            :user-id="authStore.user.id"
            @visible="chatVisible = $event"
          />
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

        <!-- правый верхний угол: гонка депутатов (кто сколько сдал) -->
        <div
          v-if="deputyStore.current"
          class="hidden sm:block absolute top-3 right-3 z-10 w-60 px-3 py-2 rounded-xl bg-stone-900/70 backdrop-blur text-amber-50 border border-white/10 shadow-lg cursor-pointer"
          @click="openDeputy"
        >
          <div class="text-[11px] font-semibold uppercase tracking-wide text-amber-200/70 mb-1.5">
            🏛️ Гонка депутатов
          </div>
          <div v-for="p in deputyStore.leaderboard" :key="p.userId" class="mb-1.5 last:mb-0">
            <div class="flex items-center justify-between gap-2 text-xs">
              <span class="truncate">
                {{ regionFlag(p.region) }} {{ p.nickName }}<span v-if="p.userId === authStore.user?.id" class="text-amber-300"> (вы)</span>
              </span>
              <b>{{ p.delivered }}/{{ p.total }}</b>
            </div>
            <div class="h-1.5 rounded-full bg-white/15 overflow-hidden">
              <div
                class="h-full bg-gradient-to-r from-lime-400 to-lime-500 transition-all"
                :style="{ width: (p.total ? (p.delivered / p.total) * 100 : 0) + '%' }"
              />
            </div>
          </div>
        </div>

        <!-- депутат: слева от фермы -->
        <button
          @click="openDeputy"
          aria-label="Депутат"
          class="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 z-10 group flex flex-col items-center"
        >
          <img
            v-if="deputySrc && !broken.has(deputySrc)"
            :src="deputySrc"
            class="w-24 sm:w-36 object-contain drop-shadow-xl group-hover:scale-105 transition"
            alt=""
            @error="broken.add(deputySrc)"
          />
          <span v-else class="text-6xl">🏛️</span>
          <span class="mt-1 px-3 py-1 rounded-full bg-stone-900/75 text-amber-100 text-xs font-semibold border border-white/10">
            Депутат<template v-if="myDeputy"> · {{ myDeputy.delivered }}/{{ myDeputy.total }}</template>
          </span>
        </button>

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
          <template v-else>Клик по золотой грядке — собрать (она вырастет заново) · клик по растущей культуре — переместить или убрать · клик по заводу — производство · клик по складу — содержимое · 🏛️ — накормить депутата · 🧪 — исследования · 🧑‍💼 — продать скупщику · 🛵 — теневой скупщик (нелегал) · 🏪 — маркетплейс · 🤝 — контракты · 🛠️ — строительство</template>
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
            <!-- визит на чужую ферму -->
            <button
              @click="onVisit"
              :disabled="visitDisabled"
              aria-label="Наведаться на чужую ферму"
              :title="visitTitle"
              class="relative w-14 h-14 rounded-2xl bg-amber-500 hover:bg-amber-400 active:scale-95 text-3xl shadow-xl border border-amber-300/60 transition flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              🕵️
              <span
                v-if="visitsStore.current"
                class="absolute -top-1.5 -right-1.5 min-w-[20px] h-5 px-1 rounded-full bg-stone-900 text-amber-300 text-[11px] font-bold flex items-center justify-center border border-amber-300/60"
              >
                {{ visitsStore.current.active ? '●' : visitsStore.current.remaining }}
              </span>
            </button>
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
            <!-- теневой скупщик: нелегальный товар -->
            <button
              @click="openBlack"
              aria-label="Теневой скупщик"
              title="Теневой скупщик — нелегальный товар"
              class="relative w-14 h-14 rounded-2xl bg-amber-500 hover:bg-amber-400 active:scale-95 text-3xl shadow-xl border border-amber-300/60 transition flex items-center justify-center"
            >
              🛵
              <span
                v-if="blackBadge"
                class="absolute -top-1.5 -right-1.5 min-w-[20px] h-5 px-1 rounded-full bg-stone-900 text-amber-300 text-[11px] font-bold flex items-center justify-center border border-amber-300/60"
              >
                {{ blackBadge }}
              </span>
            </button>
            <button
              @click="openCatalog(null)"
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

    <!-- Всплывающее уведомление: кто что сдал депутату / замечен скупщик -->
    <div
      v-if="toastText"
      class="fixed top-4 left-1/2 -translate-x-1/2 z-[70] max-w-[90vw] px-4 py-2 rounded-xl bg-stone-900/90 text-amber-50 text-sm font-semibold shadow-2xl border border-amber-400/40"
    >
      {{ toastText }}
    </div>

    <!-- «добавлено в заметки» (двойной клик в справочнике / исследованиях) -->
    <div
      v-if="notesStore.flash"
      class="fixed top-16 left-1/2 -translate-x-1/2 z-[80] max-w-[90vw] px-4 py-2 rounded-xl bg-stone-900/90 text-amber-50 text-sm font-semibold shadow-2xl border border-amber-400/40"
    >
      {{ notesStore.flash }}
    </div>

    <!-- Победитель: видят все игроки -->
    <div
      v-if="deputyStore.winner && !winnerDismissed"
      class="fixed inset-0 z-[60] bg-black/70 flex items-center justify-center p-4"
    >
      <div class="bg-stone-50 rounded-2xl shadow-2xl w-full max-w-md p-6 text-center">
        <div class="text-6xl">🏆</div>
        <h2 class="mt-2 text-2xl font-serif font-bold text-stone-800">Игра окончена!</h2>
        <p class="mt-3 text-stone-700">
          <b>{{ deputyStore.winner.nickName }}</b>
          <span class="text-stone-500"> ({{ regionName(deputyStore.winner.region) }})</span>
          первым накормил депутата всеми блюдами и золотым экспортом.
        </p>
        <p v-if="iAmWinner" class="mt-2 text-lime-700 font-semibold">Это вы — поздравляем! 🎉</p>
        <div class="mt-5 flex justify-center gap-2">
          <button
            @click="winnerDismissed = true; openDeputy()"
            class="px-4 py-2 rounded-xl font-semibold text-sm bg-amber-500 hover:bg-amber-400 text-stone-900"
          >
            Таблица результатов
          </button>
          <button
            @click="winnerDismissed = true"
            class="px-4 py-2 rounded-xl font-semibold text-sm bg-stone-200 hover:bg-stone-300 text-stone-700"
          >
            Закрыть
          </button>
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

          <!-- подсказка про скрытые здания -->
          <p
            v-if="activeTab === 'BUILDING' && hiddenBuildingsCount > 0"
            class="mt-3 text-xs text-stone-500 text-center"
          >
            Ещё {{ hiddenBuildingsCount }} {{ plural(hiddenBuildingsCount, 'здание', 'здания', 'зданий') }}
            откроются по мере исследований 🧪
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

    <!-- Модалка культуры: переместить или убрать с поля -->
    <div
      v-if="activeCrop"
      class="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
      @click.self="closeCrop"
    >
      <div class="bg-stone-50 rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
        <div class="flex items-center justify-between px-5 py-4 border-b border-stone-200">
          <div class="flex items-center gap-3">
            <ProductIcon :code="activeCrop.crop" :size="44" />
            <div>
              <h2 class="text-xl font-semibold text-stone-800">{{ cropTitle }}</h2>
              <p class="text-xs text-stone-500">{{ activeCrop.width }}×{{ activeCrop.height }}</p>
            </div>
          </div>
          <button @click="closeCrop" class="text-stone-500 hover:text-stone-800 text-2xl leading-none">×</button>
        </div>

        <div class="p-5 space-y-4">
          <p v-if="boardStore.error" class="bg-red-100 border border-red-300 text-red-700 text-sm rounded-xl p-2">
            {{ boardStore.error }}
          </p>

          <div>
            <div class="text-xs text-stone-600">
              <template v-if="cropLeft > 0">Растёт — осталось {{ fmtDuration(cropLeft) }}</template>
              <template v-else>Созрела — закройте окно и кликните по грядке, чтобы собрать</template>
            </div>
            <div class="mt-2 h-2 rounded-full bg-stone-200 overflow-hidden">
              <div
                class="h-full bg-gradient-to-b from-lime-400 to-lime-600 transition-all duration-1000 ease-linear"
                :style="{ width: cropPct * 100 + '%' }"
              />
            </div>
          </div>

          <div class="flex gap-2">
            <button
              @click="startMoveCrop"
              class="flex-1 px-3 py-2 rounded-xl font-semibold text-sm bg-amber-500 hover:bg-amber-400 text-stone-900"
            >
              Переместить
            </button>
            <button
              :disabled="busy"
              @click="onRemoveCrop"
              class="flex-1 px-3 py-2 rounded-xl font-semibold text-sm bg-stone-200 hover:bg-red-100 hover:text-red-700 text-stone-700 disabled:opacity-50"
            >
              Убрать с поля
            </button>
          </div>
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
          <div class="flex items-center gap-2">
            <button
              @click="startMoveFactory"
              class="px-3 py-1.5 rounded-xl font-semibold text-sm bg-amber-500 hover:bg-amber-400 text-stone-900"
            >
              Переместить
            </button>
            <button @click="closeFactory" class="text-stone-500 hover:text-stone-800 text-2xl leading-none">×</button>
          </div>
        </div>

        <div class="p-5 overflow-y-auto space-y-3">
          <p v-if="boardStore.error" class="bg-red-100 border border-red-300 text-red-700 text-sm rounded-xl p-2">
            {{ boardStore.error }}
          </p>

          <p
            v-if="factoryBlockedLeft > 0"
            class="rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm font-semibold p-2.5"
          >
            ✊ Забастовка: здание не работает ещё {{ fmtDuration(factoryBlockedLeft) }}. Новое производство начать нельзя.
          </p>

          <!-- ячейки производства: продукты делаются по очереди, готовый можно забрать сразу -->
          <div class="rounded-xl border-2 border-stone-200 bg-white p-3">
            <div class="flex items-center justify-between text-xs font-semibold text-stone-500">
              <span>Производство</span>
              <span>{{ factorySlots.filter(x => x.job).length }}/{{ MAX_QUEUE }}</span>
            </div>
            <div class="mt-2 space-y-2">
              <template v-for="(sl, i) in factorySlots" :key="i">
                <div
                  v-if="sl.job"
                  class="rounded-xl border-2 p-2.5"
                  :class="sl.done ? 'border-amber-400 bg-amber-50' : 'border-stone-200 bg-stone-50'"
                >
                  <div class="flex items-center gap-2">
                    <span class="text-3xl">{{ sl.emoji }}</span>
                    <div class="flex-1 min-w-0">
                      <div class="font-semibold text-sm text-stone-800 truncate">
                        {{ sl.title }} <span v-if="sl.qty > 1" class="text-stone-400">×{{ sl.qty }}</span>
                      </div>
                      <div class="text-xs text-stone-600">
                        <template v-if="sl.done">Готово — можно забирать</template>
                        <template v-else-if="sl.waiting">В очереди · начнётся через {{ fmtDuration(sl.startsIn) }}</template>
                        <template v-else>Осталось: {{ fmtDuration(sl.left) }}</template>
                      </div>
                    </div>
                    <button
                      v-if="sl.done"
                      :disabled="busy"
                      @click="onCollect(i)"
                      class="px-3 py-1.5 rounded-xl font-semibold text-sm bg-amber-500 hover:bg-amber-400 text-stone-900 disabled:opacity-50"
                    >
                      Забрать
                    </button>
                    <button
                      v-else-if="sl.waiting"
                      :disabled="busy"
                      @click="onCancelQueued(i)"
                      title="Убрать из очереди (ингредиенты вернутся на склад)"
                      class="w-7 h-7 rounded-lg bg-stone-200 hover:bg-red-100 text-stone-600 leading-none disabled:opacity-50"
                    >
                      ×
                    </button>
                  </div>
                  <div v-if="!sl.done && !sl.waiting" class="mt-2 h-2 rounded-full bg-stone-200 overflow-hidden">
                    <div
                      class="h-full bg-gradient-to-b from-lime-400 to-lime-600 transition-all duration-1000 ease-linear"
                      :style="{ width: sl.pct * 100 + '%' }"
                    />
                  </div>
                </div>
                <div
                  v-else
                  class="rounded-xl border-2 border-dashed border-stone-200 px-3 py-3 text-xs text-stone-400 text-center"
                >
                  Свободная ячейка
                </div>
              </template>
            </div>
          </div>

          <!-- рецепты -->
          <div
            v-for="r in activeRecipes"
            :key="r.code"
            class="rounded-xl border-2 border-stone-200 bg-white p-3 flex items-center gap-3"
            :class="{ 'opacity-60': !r.canMake }"
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
              :disabled="queueFull || busy || !r.canMake || factoryBlockedLeft > 0"
              :title="!r.canMake ? 'Не хватает ингредиентов на складе' : queueFull ? 'Все ячейки заняты' : ''"
              @click="onProduce(r.code)"
              class="px-3 py-2 rounded-xl font-semibold text-sm bg-amber-500 hover:bg-amber-400 text-stone-900 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {{ factoryJobs.length ? 'В очередь' : 'Производить' }}
            </button>
          </div>

          <p v-if="activeRecipes.length === 0" class="text-stone-500 text-center py-6">
            У этого завода пока нет рецептов.
          </p>
        </div>
      </div>
    </div>

    <!-- Скупщик (NPC), маркетплейс (игроки), контракты, справочник, исследования, депутат, теневой скупщик -->
    <TraderModal v-if="traderOpen" :code="code" @close="traderOpen = false" />
    <MarketModal v-if="marketOpen" :code="code" @close="marketOpen = false" />
    <DealsModal v-if="dealsOpen" :code="code" @close="dealsOpen = false" />
    <ResearchModal
      v-if="researchOpen"
      :code="code"
      :highlight="researchHighlight"
      :highlight-stage="researchHighlightStage"
      @close="closeResearch"
      @open-catalog="openCatalog"
    />

    <VisitPickModal
      v-if="visitPickOpen && visitsStore.current"
      :candidates="visitsStore.current.candidates"
      :remaining="visitsStore.current.remaining"
      :max="visitsStore.current.max"
      :disabled="visitBusy || visitsStore.current.remaining <= 0 || visitCooldownSec > 0"
      :hint="visitHint"
      @close="visitPickOpen = false"
      @pick="onVisitPick"
    />

    <VisitFarmModal
      v-if="visitOpen && authStore.user?.id"
      :code="code"
      :user-id="authStore.user.id"
      @close="visitOpen = false"
    />

    <!-- справочник идёт после исследований, чтобы открываться поверх них -->
    <CatalogModal v-if="catalogOpen" :focus="catalogFocus" @close="closeCatalog" />

    <DeputyModal
      v-if="deputyOpen"
      :code="code"
      @close="deputyOpen = false"
      @open-research="onOpenResearchFromDeputy"
    />

    <BlackMarketModal v-if="blackOpen" :code="code" @close="blackOpen = false" />
  </div>
</template>

<script setup lang="ts">
import { Client } from '@stomp/stompjs'
import { useBoardStore, jobsOf } from '~/stores/board'
import { useCouncilStore } from '~/stores/council'
import { useNotesStore } from '~/stores/notes'
import { useChatStore } from '~/stores/chat'
import { useVisitsStore, type VisitEvent } from '~/stores/visits'
import { useAuthStore } from '~/stores/auth'
import { useCatalogStore, type FactoryItem } from '~/stores/catalog'
import type { PlacedObject, Cell, Board, QueuedJob } from '~/stores/board'
import { objectSrc } from '~/utils/objectSrc'
import { cropKind } from '~/utils/cropLook'
import { useStorageStore } from '~/stores/storage'
import { useMarketStore } from '~/stores/market'
import { useDealsStore } from '~/stores/deals'
import { useResearchStore } from '~/stores/research'
import { useDeputyStore, type DeputyEvent } from '~/stores/deputy'
import { useBlackMarketStore, type BmEvent } from '~/stores/blackMarket'
import { productEmoji, fmtDuration, toMs } from '~/utils/productLook'
import { deputyImgSrc, regionFlag, regionName } from '~/utils/deputyLook'

const route = useRoute()
const authStore = useAuthStore()
const councilStore = useCouncilStore()
const notesStore = useNotesStore()
const visitsStore = useVisitsStore()
const chatStore = useChatStore()
const chatVisible = ref(false)

/* ---------- визиты на чужие фермы ---------- */
const visitOpen = ref(false)
const visitPickOpen = ref(false)
const visitBusy = ref(false)
const visitCooldownSec = computed(() => {
  const s = visitsStore.current
  if (!s) return 0
  return Math.max(0, Math.ceil((s.cooldownUntilMs - (now.value + visitsStore.offsetMs)) / 1000))
})
const visitTitle = computed(() => {
  const s = visitsStore.current
  if (!s) return 'Наведаться на чужую ферму'
  if (s.active) return 'Вернуться к визиту'
  if (s.remaining <= 0) return 'Визиты закончились'
  if (visitCooldownSec.value > 0) return `Следующий визит через ${visitCooldownSec.value} с`
  return `Наведаться на чужую ферму (осталось ${s.remaining} из ${s.max})`
})
const visitDisabled = computed(() => {
  const s = visitsStore.current
  if (!s || visitBusy.value) return true
  if (s.active) return false
  return s.remaining <= 0 || visitCooldownSec.value > 0
})
const visitHint = computed(() => {
  const s = visitsStore.current
  if (!s) return ''
  if (visitCooldownSec.value > 0) return `Следующий визит через ${visitCooldownSec.value} с`
  return visitsStore.error ?? ''
})

/** Кнопка 🕵️: идёт визит — вернуться к нему, иначе выбрать, чью ферму навестить. */
const onVisit = async () => {
  const userId = authStore.user?.id
  const s = visitsStore.current
  if (!userId || !s || visitBusy.value) return
  buildMode.value = false
  visitsStore.error = null
  if (s.active) {
    visitOpen.value = true
    return
  }
  await visitsStore.load(code.value, userId) // свежий список игроков
  visitPickOpen.value = true
}

const onVisitPick = async (targetId: number) => {
  const userId = authStore.user?.id
  if (!userId || visitBusy.value) return
  visitBusy.value = true
  try {
    const ok = await visitsStore.start(code.value, userId, targetId)
    if (!ok) return // причина показана в окне выбора
    visitPickOpen.value = false
    visitOpen.value = true
  } finally {
    visitBusy.value = false
  }
}
const onVisitEvent = (ev: VisitEvent) => {
  const me = authStore.user?.id
  if (ev.type !== 'CAUGHT') return
  if (ev.targetUserId === me) {
    showToast(`🚨 ${ev.visitorNick} заметил вашего скупщика! Штраф ${ev.fine} 🪙` +
      (ev.confiscatedUnits ? `, конфисковано ${ev.confiscatedUnits} ед. нелегала` : ''))
    if (me) { blackStore.load(code.value, me); loadStorage() }
  } else if (ev.visitorId !== me) {
    showToast(`🕵️ ${ev.visitorNick} разоблачил скупщика у ${ev.targetNick}`)
  }
  if (me) marketStore.load(code.value, me)
}
const boardStore = useBoardStore()
const catalogStore = useCatalogStore()
const storageStore = useStorageStore()
const marketStore = useMarketStore()
const dealsStore = useDealsStore()
const researchStore = useResearchStore()
const deputyStore = useDeputyStore()
const blackStore = useBlackMarketStore()

const code = computed(() => String(route.params.code || '').toUpperCase())

// русское склонение: 1 здание, 2 здания, 5 зданий
const plural = (n: number, one: string, few: string, many: string): string => {
  const m10 = n % 10
  const m100 = n % 100
  if (m10 === 1 && m100 !== 11) return one
  if (m10 >= 2 && m10 <= 4 && (m100 < 10 || m100 >= 20)) return few
  return many
}

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
    return catalogStore.cropsForRegion(researchStore.region) ?? []
  }
  return catalogStore.buildingsAvailableFor(
    researchStore.unlockedCodes,
    researchStore.region
  )
})

const hiddenBuildingsCount = computed(() => {
  const all = catalogStore.buildingsForUi ?? []
  const unlocked = researchStore.unlockedCodes
  return all.filter(b => b.requiredResearch && !unlocked.has(b.requiredResearch)).length
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

/* ячейки производства: до MAX_QUEUE продуктов (лимит проверяет и сервер) */
const MAX_QUEUE = 3
const factoryJobs = computed(() => (activeFactory.value ? jobsOf(activeFactory.value) : []))
const queueFull = computed(() => factoryJobs.value.length >= MAX_QUEUE)
const factoryBlockedLeft = computed(() => {
  const o = activeFactory.value
  return o?.blockedUntil ? Math.max(0, Math.ceil((toMs(o.blockedUntil) - now.value) / 1000)) : 0
})
const factorySlots = computed(() => {
  const jobs = factoryJobs.value
  return Array.from({ length: MAX_QUEUE }, (_, i) => {
    const job = jobs[i]
    if (!job) return { job: null as QueuedJob | null, emoji: '', title: '', qty: 1, done: false, waiting: false, left: 0, startsIn: 0, pct: 0 }
    const start = toMs(job.startedAt), end = toMs(job.readyAt)
    const done = now.value >= end
    const waiting = !done && now.value < start
    const pct = !end || end <= start ? (done ? 1 : 0) : Math.min(Math.max((now.value - start) / (end - start), 0), 1)
    return {
      job,
      emoji: productEmoji(job.output),
      title: productOf(job.output)?.title ?? job.output,
      qty: job.outputQty ?? 1,
      done,
      waiting,
      left: Math.max(0, Math.ceil((end - now.value) / 1000)),
      startsIn: Math.max(0, Math.ceil((start - now.value) / 1000)),
      pct
    }
  })
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

const onCancelQueued = async (index: number) => {
  const userId = authStore.user?.id
  const obj = activeFactory.value
  if (!userId || !obj || busy.value) return
  busy.value = true
  try {
    await boardStore.cancelQueued(code.value, userId, obj.id, index)
  } finally {
    busy.value = false
  }
}

const onCollect = async (index: number) => {
  const userId = authStore.user?.id
  const obj = activeFactory.value
  if (!userId || !obj || busy.value) return
  busy.value = true
  try {
    await boardStore.collectProduction(code.value, userId, obj.id, index)
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
const catalogFocus = ref<string | null>(null)
const openCatalog = (focus: string | null = null) => {
  catalogFocus.value = focus
  catalogOpen.value = true
}
const closeCatalog = () => {
  catalogOpen.value = false
  catalogFocus.value = null
}
const researchOpen = ref(false)

/* подсветка нужного исследования после перехода из депутата */
const researchHighlight = ref<string | null>(null)
const researchHighlightStage = ref<number | null>(null)

const closeResearch = () => {
  researchOpen.value = false
  researchHighlight.value = null
  researchHighlightStage.value = null
}

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
  // обычное открытие — без подсветки
  researchHighlight.value = null
  researchHighlightStage.value = null
  researchOpen.value = true
  const userId = authStore.user?.id
  if (userId) researchStore.load(code.value, userId)
}
// картинка скупщика (иконка берётся из каталога: code = trader)
const traderSrc = computed(() => objectSrc(catalogStore.byCode('trader')?.icon) || '')

/* ---------- теневой скупщик (нелегальный товар) ---------- */
const blackOpen = ref(false)

const openBlack = () => {
  buildMode.value = false
  blackOpen.value = true
}

// бейдж на кнопке 🛵: 💰 — скупщик на вашей ферме, 🛵 — едет, число — чужие активные скупщики
const blackBadge = computed(() => {
  const t = now.value + blackStore.offsetMs
  const mine = blackStore.current?.mine
  if (mine && t < mine.leavesAtMs) return t < mine.arrivesAtMs ? '🛵' : '💰'
  const others = blackStore.active.filter(a => a.userId !== authStore.user?.id && t < a.leavesAtMs)
  return others.length ? String(others.length) : ''
})

// визит скупщика для сцены фермы: дорогу и самого скупщика рисует FarmBoard, он сам следит за фазами по времени
const buyerView = computed(() => {
  const v = blackStore.current?.mine
  if (!v) return null
  return {
    summonedAtMs: v.summonedAtMs,
    arrivesAtMs: v.arrivesAtMs,
    leavesAtMs: v.leavesAtMs,
    offsetMs: blackStore.offsetMs
  }
})

// событие из STOMP: кто-то вызвал или отпустил скупщика
const onBlackEvent = (ev: BmEvent) => {
  blackStore.applyEvent(ev)
  if (ev.userId === authStore.user?.id) return
  if (ev.type === 'SUMMONED') {
    showToast(`🕵️ Замечен нелегальный скупщик у игрока ${ev.nickName}`)
  }
}

/* ---------- депутат: цель игры ---------- */
const deputyOpen = ref(false)
const winnerDismissed = ref(false)
const toastText = ref('')
let toastTimer: ReturnType<typeof setTimeout> | null = null
onBeforeUnmount(() => { if (toastTimer) clearTimeout(toastTimer) })

const myDeputy = computed(() =>
  deputyStore.current?.players.find(p => p.userId === authStore.user?.id) ?? null
)
// картинка депутата своей страны из public/object
const deputySrc = computed(() => deputyImgSrc(myDeputy.value?.region ?? researchStore.region))
const iAmWinner = computed(() => deputyStore.winner?.userId === authStore.user?.id)

const openDeputy = () => {
  buildMode.value = false
  deputyOpen.value = true
}

/**
 * Переход из карточки заказа депутата в дерево исследований:
 * закрываем депутата, открываем исследования на нужном этапе с подсветкой конкретного узла.
 */
const onOpenResearchFromDeputy = (payload: { code: string | null; stage: number }) => {
  deputyOpen.value = false
  researchHighlight.value = payload.code
  researchHighlightStage.value = payload.stage
  researchOpen.value = true
  const userId = authStore.user?.id
  if (userId) researchStore.load(code.value, userId)
}

const showToast = (text: string) => {
  toastText.value = text
  if (toastTimer) clearTimeout(toastTimer)
  toastTimer = setTimeout(() => (toastText.value = ''), 5000)
}

// событие из STOMP: кто-то накормил депутата или выиграл
const onDeputyEvent = (ev: DeputyEvent) => {
  deputyStore.applyEvent(ev)
  if (ev.type === 'WON') {
    winnerDismissed.value = false
    showToast(`🏆 ${ev.nickName} победил(а)!`)
    return
  }
  const p = ev.state?.players.find(x => x.userId === ev.userId)
  showToast(
    `🏛️ ${ev.nickName} накормил(а) депутата: ${ev.productTitle}` +
    (p ? ` (${p.delivered}/${p.total})` : '')
  )
}

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
// перенос завода: «Переместить» в окне производства (идущее производство сохраняется)
const startMoveFactory = () => {
  const o = activeFactory.value
  if (!o) return
  buildMode.value = false
  moveId.value = o.id
  closeFactory()
}
// название переносимого объекта для плашки
const moveTitle = computed(() => {
  const m = moveObj.value
  if (!m) return ''
  const c = m.kind === 'CROP' ? m.crop : m.building
  return catalogStore.byCode(c ?? '')?.title ?? c ?? ''
})
const cancelMove = () => { moveId.value = null }

/* ---------- культура на поле: переместить / убрать ---------- */
const cropObjId = ref<number | null>(null)

const activeCrop = computed<PlacedObject | null>(() => {
  if (cropObjId.value == null) return null
  return boardStore.board?.objects.find(o => o.id === cropObjId.value && o.kind === 'CROP') ?? null
})
const cropTitle = computed(() => {
  const c = activeCrop.value?.crop ?? ''
  return catalogStore.byCode(c)?.title ?? c
})
const cropLeft = computed(() => {
  const o = activeCrop.value
  return o ? Math.max(0, Math.ceil((toMs(o.readyAt) - now.value) / 1000)) : 0
})
const cropPct = computed(() => {
  const o = activeCrop.value
  if (!o) return 0
  const start = toMs(o.plantedAt), end = toMs(o.readyAt)
  if (!end || end <= start) return 1
  return Math.min(Math.max((now.value - start) / (end - start), 0), 1)
})
const closeCrop = () => {
  cropObjId.value = null
}
const startMoveCrop = () => {
  const o = activeCrop.value
  if (!o) return
  buildMode.value = false
  moveId.value = o.id
  closeCrop()
}
const onRemoveCrop = async () => {
  const userId = authStore.user?.id
  const o = activeCrop.value
  if (!userId || !o || busy.value) return
  busy.value = true
  try {
    const res = await boardStore.removeObject(code.value, userId, o.id)
    if (res.success) closeCrop()
  } finally {
    busy.value = false
  }
}

// превью на поле: при переносе — склад, иначе выбранная культура/здание (только в режиме строительства)
const boardPreview = computed(() => {
  const m = moveObj.value
  if (m && m.kind === 'CROP') {
    // переносим культуру: призрак рисует FarmBoard кодом, PNG не нужен
    return { width: m.width, height: m.height, kind: 'CROP' as const, src: undefined, code: m.crop }
  }
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
  if (blackOpen.value) blackOpen.value = false
  else if (deputyOpen.value) deputyOpen.value = false
  else if (catalogOpen.value) closeCatalog()
  else if (researchOpen.value) closeResearch()
  else if (traderOpen.value) traderOpen.value = false
  else if (marketOpen.value) marketOpen.value = false
  else if (dealsOpen.value) dealsOpen.value = false
  else if (cropObjId.value != null) closeCrop()
  else if (moveId.value != null) cancelMove()
  else if (buildMode.value) cancelBuild()
  else if (warehouseOpen.value) closeWarehouse()
}
onMounted(() => window.addEventListener('keydown', onKey))
onBeforeUnmount(() => window.removeEventListener('keydown', onKey))

let client: Client | null = null

onMounted(async () => {
  const userId = authStore.user?.id

  if (!userId) {
    return
  }

  // Поле и каталог должны грузиться независимо от WebSocket.
  await Promise.all([
    boardStore.loadMyBoard(code.value, userId),
    catalogStore.load(),
    researchStore.load(code.value, userId)
  ])

  client = new Client({
    brokerURL: config.public.wsBase,
    reconnectDelay: 3000,

    onConnect: () => {
      client?.subscribe(
        `/topic/board.${code.value}.${userId}`,
        message => {
          boardStore.applyBoardState(
            JSON.parse(message.body) as Board
          )
        }
      )

      client?.subscribe(
        `/topic/market.${code.value}`,
        () => {
          marketStore.load(code.value, userId)
          loadStorage()
        }
      )

      client?.subscribe(
        `/topic/deals.${code.value}`,
        () => {
          dealsStore.load(code.value, userId)
          loadStorage()
        }
      )

      client?.subscribe(
        `/topic/deputy.${code.value}`,
        message => {
          onDeputyEvent(
            JSON.parse(message.body) as DeputyEvent
          )
        }
      )

      client?.subscribe(
        `/topic/chat.${code.value}.${userId}`,
        message => {
          const signal = JSON.parse(message.body) as {
            fromId: number
          }

          chatStore.onSignal(
            code.value,
            userId,
            signal.fromId,
            chatVisible.value
          )

          if (!chatVisible.value) {
            showToast('Новое сообщение')
            visitsStore.load(code.value, userId)
          }
        }
      )

      client?.subscribe(
        `/topic/visits.${code.value}`,
        message => {
          onVisitEvent(
            JSON.parse(message.body) as VisitEvent
          )
        }
      )

      client?.subscribe(
        `/topic/blackmarket.${code.value}`,
        message => {
          onBlackEvent(
            JSON.parse(message.body) as BmEvent
          )
        }
      )

      client?.subscribe(
        `/topic/council.${code.value}`,
        () => {
          councilStore.load(code.value, userId)
        }
      )
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
  if (moveId.value != null) return // идёт перенос: клики по объектам не нужны

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
  }

  if (obj.kind === 'CROP') {
    if (obj.readyAt && toMs(obj.readyAt) <= Date.now()) {
      // созрела: забираем урожай, культура остаётся и растёт заново
      await boardStore.harvest(code.value, userId, obj.id)
    } else {
      // ещё растёт: меню «Переместить / Убрать с поля»
      boardStore.error = null
      cropObjId.value = obj.id
    }
  }
}
</script>