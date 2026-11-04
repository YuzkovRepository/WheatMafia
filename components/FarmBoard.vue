<template>
  <div v-if="board" ref="fitEl" class="farm-fit" :style="{ height: scaledH + 'px' }">
    <div
      ref="sceneEl"
      class="farm-scene"
      :class="{ pointer: hoverReady, placing: active }"
      :style="{
        width: W + 'px',
        height: H + 'px',
        left: offsetX + 'px',
        transform: `scale(${scale})`
      }"
      @mousemove="onMove"
      @mouseleave="hover = null"
      @click="onClick"
    >
      <!-- Общие картинки для декора и культур (один раз) -->
      <svg width="0" height="0" style="position: absolute" aria-hidden="true">
        <defs>
          <!-- ===== декор ===== -->
          <symbol id="fd-tree-a" viewBox="0 0 100 140">
            <ellipse cx="50" cy="132" rx="34" ry="7" fill="rgba(0,0,0,.25)" />
            <rect x="44" y="84" width="12" height="48" rx="3" fill="#7a4a24" />
            <rect x="51" y="84" width="5" height="48" rx="2" fill="#5e3818" />
            <circle cx="32" cy="68" r="26" fill="#3a8429" />
            <circle cx="68" cy="68" r="26" fill="#357a26" />
            <circle cx="50" cy="50" r="38" fill="#3f8f2e" />
            <circle cx="40" cy="38" r="15" fill="#6bbd4f" opacity=".55" />
          </symbol>
          <symbol id="fd-tree-b" viewBox="0 0 100 140">
            <ellipse cx="50" cy="132" rx="34" ry="7" fill="rgba(0,0,0,.25)" />
            <rect x="44" y="84" width="12" height="48" rx="3" fill="#7a4a24" />
            <rect x="51" y="84" width="5" height="48" rx="2" fill="#5e3818" />
            <circle cx="30" cy="70" r="25" fill="#5a9a2e" />
            <circle cx="70" cy="70" r="25" fill="#4f8f28" />
            <circle cx="50" cy="50" r="37" fill="#66a834" />
            <circle cx="40" cy="38" r="14" fill="#9be15d" opacity=".5" />
            <circle cx="36" cy="58" r="4" fill="#e5483d" />
            <circle cx="62" cy="48" r="4" fill="#e5483d" />
            <circle cx="54" cy="70" r="4" fill="#e5483d" />
          </symbol>
          <symbol id="fd-pine" viewBox="0 0 80 150">
            <ellipse cx="40" cy="143" rx="26" ry="6" fill="rgba(0,0,0,.25)" />
            <rect x="35" y="118" width="10" height="25" rx="2" fill="#6b4020" />
            <polygon points="40,58 78,120 2,120" fill="#245f2c" />
            <polygon points="40,30 74,86 6,86" fill="#2a6e33" />
            <polygon points="40,4 68,56 12,56" fill="#2f7a3a" />
          </symbol>
          <symbol id="fd-bush" viewBox="0 0 80 50">
            <ellipse cx="40" cy="45" rx="32" ry="5" fill="rgba(0,0,0,.22)" />
            <circle cx="26" cy="30" r="20" fill="#4c9a35" />
            <circle cx="54" cy="28" r="22" fill="#3f8a2d" />
            <circle cx="40" cy="22" r="18" fill="#5bb043" />
          </symbol>
          <symbol id="fd-rock" viewBox="0 0 60 40">
            <ellipse cx="30" cy="36" rx="26" ry="4" fill="rgba(0,0,0,.25)" />
            <polygon points="6,34 14,12 34,4 52,14 56,34" fill="#9ca3a8" stroke="#6b7378"
                     stroke-width="2" stroke-linejoin="round" />
            <polygon points="14,12 34,4 40,16 22,22" fill="#c4cacd" opacity=".8" />
          </symbol>
          <symbol id="fd-flower-a" viewBox="0 0 60 30">
            <g stroke="#3c7a2a" stroke-width="2">
              <line x1="10" y1="18" x2="10" y2="30" />
              <line x1="30" y1="10" x2="30" y2="30" />
              <line x1="48" y1="20" x2="48" y2="30" />
            </g>
            <g fill="#f472b6">
              <circle cx="10" cy="18" r="6" /><circle cx="30" cy="10" r="6" /><circle cx="48" cy="20" r="6" />
            </g>
            <g fill="#fde047">
              <circle cx="10" cy="18" r="2.5" /><circle cx="30" cy="10" r="2.5" /><circle cx="48" cy="20" r="2.5" />
            </g>
          </symbol>
          <symbol id="fd-flower-b" viewBox="0 0 60 30">
            <g stroke="#3c7a2a" stroke-width="2">
              <line x1="14" y1="16" x2="14" y2="30" />
              <line x1="36" y1="12" x2="36" y2="30" />
              <line x1="52" y1="22" x2="52" y2="30" />
            </g>
            <g fill="#ffffff">
              <circle cx="14" cy="16" r="6" /><circle cx="36" cy="12" r="6" /><circle cx="52" cy="22" r="6" />
            </g>
            <g fill="#f59e0b">
              <circle cx="14" cy="16" r="2.5" /><circle cx="36" cy="12" r="2.5" /><circle cx="52" cy="22" r="2.5" />
            </g>
          </symbol>

          <!-- ===== культуры (viewBox 50×70, основание в точке 25,66) ===== -->
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

          <!-- ==================== ИТАЛИЯ ==================== -->
          <symbol id="fc-olive" viewBox="0 0 50 70">
            <ellipse cx="25" cy="66" rx="17" ry="3.5" fill="rgba(60,35,15,.4)" />
            <line x1="25" y1="66" x2="25" y2="14" stroke="#7a5a30" stroke-width="2.4" stroke-linecap="round" />
            <ellipse cx="16" cy="22" rx="9" ry="6" transform="rotate(-30 16 22)" fill="#4a8a3a" />
            <ellipse cx="34" cy="20" rx="9" ry="6" transform="rotate(30 34 20)" fill="#3f7f32" />
            <ellipse cx="25" cy="12" rx="8" ry="6" fill="#5ba54a" />
            <ellipse cx="14" cy="44" rx="9" ry="5.5" transform="rotate(-20 14 44)" fill="#4a8a3a" />
            <ellipse cx="36" cy="46" rx="9" ry="5.5" transform="rotate(20 36 46)" fill="#3f7f32" />
            <g stroke="rgba(0,0,0,.25)" stroke-width=".6" style="fill: var(--a, #2f4d12)">
              <ellipse cx="16" cy="40" rx="3" ry="4.4" />
              <ellipse cx="32" cy="42" rx="3" ry="4.4" />
              <ellipse cx="20" cy="52" rx="3" ry="4.4" />
              <ellipse cx="34" cy="54" rx="3" ry="4.4" />
              <ellipse cx="26" cy="47" rx="3" ry="4.4" />
            </g>
            <g fill="#fff" opacity=".35">
              <ellipse cx="15" cy="38.4" rx=".8" ry="1.3" />
              <ellipse cx="31" cy="40.4" rx=".8" ry="1.3" />
              <ellipse cx="19" cy="50.4" rx=".8" ry="1.3" />
            </g>
          </symbol>

          <symbol id="fc-basil" viewBox="0 0 50 70">
            <ellipse cx="25" cy="66" rx="14" ry="3.2" fill="rgba(60,35,15,.4)" />
            <line x1="25" y1="66" x2="25" y2="24" stroke="#3f7a2a" stroke-width="2.6" stroke-linecap="round" />
            <ellipse cx="14" cy="34" rx="11" ry="6.5" transform="rotate(-35 14 34)" style="fill: var(--a, #4aa13e)" />
            <ellipse cx="36" cy="30" rx="11" ry="6.5" transform="rotate(35 36 30)" style="fill: var(--a, #4aa13e)" />
            <ellipse cx="16" cy="48" rx="11" ry="6.5" transform="rotate(-35 16 48)" fill="#3f8f32" />
            <ellipse cx="34" cy="44" rx="11" ry="6.5" transform="rotate(35 34 44)" fill="#3f8f32" />
            <ellipse cx="25" cy="22" rx="9" ry="7" style="fill: var(--b, #62b04a)" />
            <g stroke="rgba(0,0,0,.15)" stroke-width=".6" fill="none">
              <line x1="14" y1="34" x2="24" y2="34" />
              <line x1="16" y1="48" x2="25" y2="48" />
            </g>
          </symbol>

          <symbol id="fc-lemon" viewBox="0 0 50 70">
            <ellipse cx="25" cy="66" rx="16" ry="3.4" fill="rgba(60,35,15,.4)" />
            <rect x="23" y="34" width="4" height="32" rx="1.5" fill="#7a5a30" />
            <circle cx="22" cy="20" r="12" fill="#3f8f35" />
            <circle cx="34" cy="28" r="10" fill="#4aa13e" />
            <circle cx="14" cy="30" r="10" fill="#3a802e" />
            <g style="fill: var(--a, #fcd34d)">
              <ellipse cx="18" cy="42" rx="5.5" ry="6.5" transform="rotate(-15 18 42)" />
              <ellipse cx="34" cy="46" rx="5.5" ry="6.5" transform="rotate(20 34 46)" />
              <ellipse cx="24" cy="56" rx="5.5" ry="6.5" transform="rotate(5 24 56)" />
            </g>
            <g fill="#fff" opacity=".45">
              <ellipse cx="16.5" cy="40" rx="1.4" ry="1.8" />
              <ellipse cx="32.5" cy="44" rx="1.4" ry="1.8" />
              <ellipse cx="22.5" cy="54" rx="1.4" ry="1.8" />
            </g>
          </symbol>

          <!-- ==================== ЯПОНИЯ ==================== -->
          <symbol id="fc-rice" viewBox="0 0 50 70">
            <ellipse cx="25" cy="66" rx="20" ry="4" fill="rgba(60,35,15,.4)" />
            <rect x="8" y="60" width="34" height="4" rx="1.5" fill="#8a5a34" />
            <rect x="10" y="58" width="30" height="2" fill="#a07855" opacity=".6" />
            <g fill="none" stroke-width="1.6" stroke-linecap="round" style="stroke: var(--a, #7ea83a)">
              <path d="M15 60 Q16 40 12 24" />
              <path d="M22 60 Q22 36 20 16" />
              <path d="M28 60 Q28 36 30 16" />
              <path d="M35 60 Q34 40 38 24" />
            </g>
            <g style="fill: var(--b, #d9c65a)">
              <ellipse cx="12" cy="26" rx="2.4" ry="4" transform="rotate(-18 12 26)" />
              <ellipse cx="19" cy="16" rx="2.4" ry="4.2" transform="rotate(-6 19 16)" />
              <ellipse cx="25" cy="10" rx="2.4" ry="4.4" />
              <ellipse cx="31" cy="16" rx="2.4" ry="4.2" transform="rotate(6 31 16)" />
              <ellipse cx="38" cy="26" rx="2.4" ry="4" transform="rotate(18 38 26)" />
            </g>
          </symbol>

          <symbol id="fc-soybean" viewBox="0 0 50 70">
            <ellipse cx="25" cy="66" rx="18" ry="3.5" fill="rgba(60,35,15,.4)" />
            <line x1="25" y1="66" x2="25" y2="26" stroke="#5a7a30" stroke-width="2.6" stroke-linecap="round" />
            <ellipse cx="16" cy="34" rx="10" ry="6" transform="rotate(-30 16 34)" fill="#4a8a3a" />
            <ellipse cx="34" cy="32" rx="10" ry="6" transform="rotate(30 34 32)" fill="#3f7f32" />
            <ellipse cx="18" cy="48" rx="10" ry="6" transform="rotate(-25 18 48)" fill="#4a8a3a" />
            <ellipse cx="32" cy="46" rx="10" ry="6" transform="rotate(25 32 46)" fill="#3f7f32" />
            <g style="fill: var(--a, #d9d28a)">
              <ellipse cx="14" cy="42" rx="3" ry="3.6" />
              <ellipse cx="22" cy="58" rx="3" ry="3.6" />
              <ellipse cx="30" cy="56" rx="3" ry="3.6" />
              <ellipse cx="38" cy="44" rx="3" ry="3.6" />
            </g>
          </symbol>

          <symbol id="fc-tea_leaf" viewBox="0 0 50 70">
            <ellipse cx="25" cy="66" rx="15" ry="3.2" fill="rgba(60,35,15,.4)" />
            <rect x="23.5" y="34" width="3" height="32" rx="1" fill="#5a7a30" />
            <path d="M18 46 Q22 38 26 34 Q30 38 34 46 Q30 52 26 54 Q22 52 18 46Z"
                  style="fill: var(--a, #4aa13e)" stroke="rgba(0,0,0,.2)" stroke-width=".5" />
            <path d="M14 38 Q18 30 22 26 Q26 30 30 38 Q26 44 22 46 Q18 44 14 38Z"
                  style="fill: var(--a, #4aa13e)" stroke="rgba(0,0,0,.2)" stroke-width=".5" />
            <path d="M20 52 Q24 46 28 42 Q32 46 34 52 Q30 58 28 58 Q24 58 20 52Z"
                  style="fill: var(--b, #5bb54a)" stroke="rgba(0,0,0,.2)" stroke-width=".5" />
            <g stroke="rgba(0,0,0,.15)" stroke-width=".4" fill="none">
              <path d="M22 30 Q26 40 26 52" />
              <path d="M26 30 Q26 40 26 52" />
            </g>
          </symbol>

          <symbol id="fc-seaweed" viewBox="0 0 50 70">
            <ellipse cx="25" cy="66" rx="17" ry="3.5" fill="rgba(60,35,15,.4)" />
            <path d="M10 66 Q14 52 12 38 Q10 24 16 14 Q18 22 16 32 Q14 42 20 52 Q22 60 20 66Z"
                  style="fill: var(--a, #2e6b4a)" stroke="rgba(0,0,0,.2)" stroke-width=".5" />
            <path d="M22 66 Q26 50 24 36 Q22 22 28 10 Q30 20 28 32 Q26 44 32 54 Q34 60 32 66Z"
                  style="fill: var(--b, #3a8a5e)" stroke="rgba(0,0,0,.2)" stroke-width=".5" />
            <path d="M34 66 Q38 54 36 40 Q34 28 40 18 Q42 26 40 36 Q38 46 44 56 Q46 62 44 66Z"
                  style="fill: var(--a, #2e6b4a)" stroke="rgba(0,0,0,.2)" stroke-width=".5" />
            <g fill="rgba(255,255,255,.25)">
              <circle cx="14" cy="30" r="1.2" /><circle cx="26" cy="26" r="1.2" /><circle cx="38" cy="32" r="1.2" />
            </g>
          </symbol>

          <symbol id="fc-ginger" viewBox="0 0 50 70">
            <ellipse cx="25" cy="66" rx="18" ry="4" fill="rgba(60,35,15,.4)" />
            <g style="fill: var(--a, #d9b87a)" stroke="rgba(80,50,20,.35)" stroke-width=".7">
              <ellipse cx="20" cy="58" rx="8" ry="6" transform="rotate(-15 20 58)" />
              <ellipse cx="31" cy="56" rx="7" ry="5" transform="rotate(20 31 56)" />
              <ellipse cx="25" cy="48" rx="6.5" ry="5" transform="rotate(-5 25 48)" />
            </g>
            <line x1="24" y1="44" x2="24" y2="26" stroke="#5a8a35" stroke-width="2.2" stroke-linecap="round" />
            <path d="M14 30 Q20 22 26 26 Q28 30 22 32 Q16 32 14 30Z" style="fill: var(--b, #6ab54a)" />
            <path d="M24 22 Q30 14 36 18 Q38 22 32 24 Q26 24 24 22Z" style="fill: var(--b, #6ab54a)" />
          </symbol>

          <symbol id="fc-sesame" viewBox="0 0 50 70">
            <ellipse cx="25" cy="66" rx="16" ry="3.4" fill="rgba(60,35,15,.4)" />
            <line x1="25" y1="66" x2="25" y2="20" stroke="#4f7a2a" stroke-width="2.6" stroke-linecap="round" />
            <ellipse cx="14" cy="34" rx="9" ry="5.5" transform="rotate(-30 14 34)" fill="#4a8a3a" />
            <ellipse cx="36" cy="32" rx="9" ry="5.5" transform="rotate(30 36 32)" fill="#3f7f32" />
            <ellipse cx="16" cy="50" rx="9" ry="5.5" transform="rotate(-25 16 50)" fill="#4a8a3a" />
            <ellipse cx="34" cy="48" rx="9" ry="5.5" transform="rotate(25 34 48)" fill="#3f7f32" />
            <g style="fill: var(--a, #efe8d0)">
              <ellipse cx="18" cy="40" rx="1.6" ry="3" transform="rotate(-20 18 40)" />
              <ellipse cx="23" cy="36" rx="1.6" ry="3" transform="rotate(-8 23 36)" />
              <ellipse cx="28" cy="36" rx="1.6" ry="3" transform="rotate(8 28 36)" />
              <ellipse cx="33" cy="40" rx="1.6" ry="3" transform="rotate(20 33 40)" />
              <ellipse cx="22" cy="58" rx="1.6" ry="3" transform="rotate(-10 22 58)" />
              <ellipse cx="29" cy="58" rx="1.6" ry="3" transform="rotate(10 29 58)" />
            </g>
          </symbol>

          <!-- ==================== ЕГИПЕТ ==================== -->
          <symbol id="fc-barley" viewBox="0 0 50 70">
            <ellipse cx="25" cy="66" rx="19" ry="3.6" fill="rgba(60,35,15,.35)" />
            <g fill="none" stroke-width="2" stroke-linecap="round" style="stroke: var(--a, #b89238)">
              <path d="M25 66 Q24 42 18 24" />
              <path d="M25 66 L25 16" />
              <path d="M25 66 Q26 42 32 24" />
            </g>
            <g style="fill: var(--b, #e4c264)" stroke="rgba(120,80,10,.3)" stroke-width=".6">
              <ellipse cx="18" cy="26" rx="2.6" ry="6" transform="rotate(-14 18 26)" />
              <ellipse cx="24" cy="18" rx="2.8" ry="6.5" />
              <ellipse cx="26" cy="18" rx="2.8" ry="6.5" />
              <ellipse cx="32" cy="26" rx="2.6" ry="6" transform="rotate(14 32 26)" />
              <ellipse cx="25" cy="10" rx="2.8" ry="6" />
            </g>
            <g style="stroke: var(--a, #b89238); stroke-width: 1.4; fill: none" stroke-linecap="round">
              <path d="M18 40 Q22 36 28 36 Q34 36 34 40" />
            </g>
          </symbol>

          <symbol id="fc-dates" viewBox="0 0 50 70">
            <ellipse cx="25" cy="66" rx="16" ry="3.4" fill="rgba(60,35,15,.4)" />
            <rect x="23" y="22" width="4" height="44" rx="1.5" fill="#7a5a30" />
            <g stroke="#5a8a35" stroke-width="1.6" fill="none" stroke-linecap="round">
              <path d="M25 22 Q14 16 8 22" />
              <path d="M25 22 Q36 16 42 22" />
              <path d="M25 22 Q20 10 14 8" />
              <path d="M25 22 Q30 10 36 8" />
            </g>
            <g style="fill: var(--a, #c97a2a)" stroke="rgba(80,40,10,.3)" stroke-width=".6">
              <ellipse cx="16" cy="38" rx="3" ry="5" />
              <ellipse cx="20" cy="46" rx="3" ry="5" />
              <ellipse cx="30" cy="40" rx="3" ry="5" />
              <ellipse cx="34" cy="48" rx="3" ry="5" />
              <ellipse cx="25" cy="52" rx="3" ry="5" />
            </g>
            <g fill="#fff" opacity=".25">
              <ellipse cx="15" cy="36" rx=".8" ry="1.2" />
              <ellipse cx="29" cy="38" rx=".8" ry="1.2" />
            </g>
          </symbol>

          <symbol id="fc-flax" viewBox="0 0 50 70">
            <ellipse cx="25" cy="66" rx="16" ry="3.4" fill="rgba(60,35,15,.4)" />
            <g fill="none" stroke="#5a8a35" stroke-width="2" stroke-linecap="round">
              <path d="M18 66 Q18 42 14 20" />
              <path d="M25 66 L25 14" />
              <path d="M32 66 Q32 42 36 20" />
            </g>
            <g style="fill: var(--a, #7ea8d9)">
              <circle cx="14" cy="22" r="3" />
              <circle cx="25" cy="16" r="3" />
              <circle cx="36" cy="22" r="3" />
              <circle cx="18" cy="40" r="2.4" />
              <circle cx="32" cy="40" r="2.4" />
            </g>
            <g fill="#fde047">
              <circle cx="14" cy="22" r=".9" /><circle cx="25" cy="16" r=".9" /><circle cx="36" cy="22" r=".9" />
            </g>
            <g style="fill: var(--b, #d9c65a)" opacity=".8">
              <ellipse cx="20" cy="50" rx="1.6" ry="2.6" transform="rotate(-20 20 50)" />
              <ellipse cx="30" cy="52" rx="1.6" ry="2.6" transform="rotate(20 30 52)" />
            </g>
          </symbol>

          <symbol id="fc-chickpea" viewBox="0 0 50 70">
            <ellipse cx="25" cy="66" rx="17" ry="3.5" fill="rgba(60,35,15,.4)" />
            <line x1="25" y1="66" x2="25" y2="24" stroke="#5a7a30" stroke-width="2.4" stroke-linecap="round" />
            <ellipse cx="16" cy="32" rx="10" ry="6" transform="rotate(-30 16 32)" fill="#4a8a3a" />
            <ellipse cx="34" cy="30" rx="10" ry="6" transform="rotate(30 34 30)" fill="#3f7f32" />
            <ellipse cx="18" cy="46" rx="9" ry="5.5" transform="rotate(-25 18 46)" fill="#4a8a3a" />
            <ellipse cx="32" cy="44" rx="9" ry="5.5" transform="rotate(25 32 44)" fill="#3f7f32" />
            <g style="fill: var(--a, #d9b87a)">
              <ellipse cx="16" cy="46" rx="2.6" ry="3.2" />
              <ellipse cx="22" cy="56" rx="2.6" ry="3.2" />
              <ellipse cx="30" cy="56" rx="2.6" ry="3.2" />
              <ellipse cx="36" cy="48" rx="2.6" ry="3.2" />
            </g>
          </symbol>

          <symbol id="fc-spice" viewBox="0 0 50 70">
            <ellipse cx="25" cy="66" rx="16" ry="3.4" fill="rgba(60,35,15,.4)" />
            <g stroke="#5a8a35" stroke-width="2" fill="none" stroke-linecap="round">
              <path d="M20 66 Q22 40 18 22" />
              <path d="M25 66 L25 16" />
              <path d="M30 66 Q28 40 32 22" />
            </g>
            <g style="fill: var(--a, #d63b2f)" stroke="rgba(80,20,10,.3)" stroke-width=".5">
              <path d="M18 24 Q22 20 26 24 Q24 30 18 28 Q16 26 18 24Z" />
              <path d="M22 34 Q26 30 30 34 Q28 40 22 38 Q20 36 22 34Z" />
              <path d="M18 42 Q22 38 26 42 Q24 48 18 46 Q16 44 18 42Z" />
              <path d="M28 48 Q32 44 36 48 Q34 54 28 52 Q26 50 28 48Z" />
            </g>
            <g style="fill: var(--b, #f59e0b)">
              <circle cx="22" cy="26" r="1" /><circle cx="26" cy="36" r="1" /><circle cx="22" cy="44" r="1" /><circle cx="32" cy="50" r="1" />
            </g>
          </symbol>

          <symbol id="fc-papyrus" viewBox="0 0 50 70">
            <ellipse cx="25" cy="66" rx="16" ry="3.4" fill="rgba(60,35,15,.4)" />
            <g fill="none" stroke="#7a8a35" stroke-width="2" stroke-linecap="round">
              <path d="M18 66 Q18 40 16 12" />
              <path d="M25 66 L25 8" />
              <path d="M32 66 Q32 40 34 12" />
            </g>
            <g style="fill: var(--a, #8fb54a)">
              <ellipse cx="16" cy="14" rx="3.4" ry="5.5" />
              <ellipse cx="25" cy="10" rx="3.6" ry="6" />
              <ellipse cx="34" cy="14" rx="3.4" ry="5.5" />
              <ellipse cx="18" cy="28" rx="2.6" ry="4.4" />
              <ellipse cx="32" cy="28" rx="2.6" ry="4.4" />
            </g>
            <g style="stroke: var(--b, #6a9a3a); stroke-width: 1.2; fill: none" stroke-linecap="round">
              <path d="M16 12 L16 20" />
              <path d="M25 8 L25 18" />
              <path d="M34 12 L34 20" />
            </g>
          </symbol>

          <!-- ==================== БРАЗИЛИЯ ==================== -->
          <symbol id="fc-coffee_berry" viewBox="0 0 50 70">
            <ellipse cx="25" cy="66" rx="16" ry="3.4" fill="rgba(60,35,15,.4)" />
            <line x1="25" y1="66" x2="25" y2="14" stroke="#7a5a30" stroke-width="2.4" stroke-linecap="round" />
            <ellipse cx="15" cy="22" rx="10" ry="6" transform="rotate(-30 15 22)" fill="#3f8f35" />
            <ellipse cx="36" cy="20" rx="10" ry="6" transform="rotate(30 36 20)" fill="#4aa13e" />
            <ellipse cx="25" cy="12" rx="9" ry="7" fill="#5bb54a" />
            <g stroke="rgba(80,20,10,.35)" stroke-width=".6" style="fill: var(--a, #b83a2a)">
              <ellipse cx="16" cy="42" rx="3.4" ry="4.4" />
              <ellipse cx="22" cy="52" rx="3.4" ry="4.4" />
              <ellipse cx="34" cy="42" rx="3.4" ry="4.4" />
              <ellipse cx="30" cy="54" rx="3.4" ry="4.4" />
              <ellipse cx="25" cy="44" rx="3.4" ry="4.4" />
            </g>
            <g fill="#fff" opacity=".3">
              <ellipse cx="15" cy="40" rx=".8" ry="1.2" />
              <ellipse cx="33" cy="40" rx=".8" ry="1.2" />
              <ellipse cx="24" cy="42" rx=".8" ry="1.2" />
            </g>
          </symbol>

          <symbol id="fc-sugarcane" viewBox="0 0 50 70">
            <ellipse cx="25" cy="66" rx="16" ry="3.4" fill="rgba(60,35,15,.4)" />
            <g style="fill: var(--a, #a9c95e)">
              <rect x="18" y="20" width="4" height="46" rx="1.2" />
              <rect x="24" y="14" width="4" height="52" rx="1.2" />
              <rect x="30" y="22" width="4" height="44" rx="1.2" />
            </g>
            <g stroke="rgba(80,60,10,.35)" stroke-width=".7">
              <line x1="18" y1="30" x2="22" y2="30" />
              <line x1="24" y1="26" x2="28" y2="26" />
              <line x1="30" y1="34" x2="34" y2="34" />
              <line x1="18" y1="44" x2="22" y2="44" />
              <line x1="24" y1="40" x2="28" y2="40" />
              <line x1="30" y1="48" x2="34" y2="48" />
            </g>
            <g style="fill: var(--b, #6ab54a)">
              <path d="M20 20 Q12 14 8 20 Q14 22 20 20Z" />
              <path d="M26 14 Q34 6 40 12 Q34 16 26 14Z" />
              <path d="M32 22 Q40 18 42 24 Q36 26 32 22Z" />
            </g>
          </symbol>

          <symbol id="fc-cocoa_bean" viewBox="0 0 50 70">
            <ellipse cx="25" cy="66" rx="16" ry="3.4" fill="rgba(60,35,15,.4)" />
            <rect x="23" y="20" width="4" height="46" rx="1.5" fill="#7a5a30" />
            <ellipse cx="16" cy="24" rx="9" ry="6" transform="rotate(-30 16 24)" fill="#4a8a3a" />
            <ellipse cx="34" cy="22" rx="9" ry="6" transform="rotate(30 34 22)" fill="#3f7f32" />
            <ellipse cx="25" cy="14" rx="8" ry="6" fill="#5ba54a" />
            <g style="fill: var(--a, #b85a2a)" stroke="rgba(60,20,10,.35)" stroke-width=".6">
              <ellipse cx="16" cy="40" rx="3.4" ry="5" transform="rotate(-15 16 40)" />
              <ellipse cx="34" cy="42" rx="3.4" ry="5" transform="rotate(15 34 42)" />
              <ellipse cx="20" cy="54" rx="3.4" ry="5" transform="rotate(-10 20 54)" />
              <ellipse cx="30" cy="56" rx="3.4" ry="5" transform="rotate(10 30 56)" />
            </g>
            <g stroke="rgba(0,0,0,.25)" stroke-width=".5" fill="none">
              <line x1="14" y1="40" x2="18" y2="40" />
              <line x1="32" y1="42" x2="36" y2="42" />
            </g>
          </symbol>

          <symbol id="fc-corn" viewBox="0 0 50 70">
            <ellipse cx="25" cy="66" rx="16" ry="3.4" fill="rgba(60,35,15,.4)" />
            <rect x="23" y="20" width="4" height="46" rx="1.5" fill="#7a8a35" />
            <g style="fill: var(--a, #f4c84a)" stroke="rgba(120,80,10,.3)" stroke-width=".6">
              <ellipse cx="25" cy="34" rx="7" ry="16" />
            </g>
            <g stroke="rgba(120,80,10,.5)" stroke-width=".6">
              <line x1="19" y1="24" x2="31" y2="24" />
              <line x1="19" y1="30" x2="31" y2="30" />
              <line x1="19" y1="36" x2="31" y2="36" />
              <line x1="19" y1="42" x2="31" y2="42" />
              <line x1="19" y1="48" x2="31" y2="48" />
            </g>
            <g style="fill: var(--b, #6ab54a)">
              <path d="M25 20 Q16 18 12 26 Q18 30 25 26Z" />
              <path d="M25 20 Q34 18 38 26 Q32 30 25 26Z" />
              <path d="M25 24 Q18 22 14 32 Q20 34 25 28Z" />
              <path d="M25 24 Q32 22 36 32 Q30 34 25 28Z" />
            </g>
          </symbol>

          <symbol id="fc-cassava" viewBox="0 0 50 70">
            <ellipse cx="25" cy="66" rx="16" ry="3.4" fill="rgba(60,35,15,.4)" />
            <line x1="25" y1="66" x2="25" y2="24" stroke="#5a7a30" stroke-width="2.4" stroke-linecap="round" />
            <g style="fill: var(--a, #7ea83a)" stroke="rgba(40,80,20,.35)" stroke-width=".6">
              <path d="M25 24 Q14 18 8 30 Q16 34 25 30Z" />
              <path d="M25 30 Q36 22 42 32 Q34 38 25 36Z" />
              <path d="M25 36 Q14 32 10 44 Q18 46 25 42Z" />
              <path d="M25 42 Q36 38 40 48 Q32 52 25 48Z" />
            </g>
            <g style="fill: var(--b, #d9c9a0)" stroke="rgba(80,60,20,.35)" stroke-width=".6">
              <ellipse cx="20" cy="56" rx="4" ry="6" transform="rotate(-15 20 56)" />
              <ellipse cx="30" cy="58" rx="4" ry="6" transform="rotate(15 30 58)" />
            </g>
          </symbol>

          <symbol id="fc-mango" viewBox="0 0 50 70">
            <ellipse cx="25" cy="66" rx="16" ry="3.4" fill="rgba(60,35,15,.4)" />
            <rect x="23" y="24" width="4" height="42" rx="1.5" fill="#7a5a30" />
            <circle cx="18" cy="22" r="11" fill="#3f8f35" />
            <circle cx="34" cy="24" r="11" fill="#4aa13e" />
            <circle cx="26" cy="14" r="9" fill="#5ba54a" />
            <g style="fill: var(--a, #f5b93b)" stroke="rgba(120,60,10,.35)" stroke-width=".6">
              <ellipse cx="18" cy="40" rx="5.4" ry="7" transform="rotate(-15 18 40)" />
              <ellipse cx="33" cy="44" rx="5.4" ry="7" transform="rotate(15 33 44)" />
              <ellipse cx="24" cy="54" rx="5.4" ry="7" />
            </g>
            <g fill="#fff" opacity=".35">
              <ellipse cx="16.5" cy="38" rx="1.2" ry="1.6" />
              <ellipse cx="31.5" cy="42" rx="1.2" ry="1.6" />
            </g>
          </symbol>

          <symbol id="fc-banana" viewBox="0 0 50 70">
            <ellipse cx="25" cy="66" rx="16" ry="3.4" fill="rgba(60,35,15,.4)" />
            <rect x="24" y="14" width="3.4" height="52" rx="1.5" fill="#7a5a30" />
            <g style="fill: var(--a, #f5d33b)" stroke="rgba(120,80,10,.4)" stroke-width=".7">
              <path d="M12 22 Q10 40 20 52 Q24 56 26 52 Q20 40 22 22Z" />
              <path d="M22 20 Q22 40 32 52 Q36 56 38 52 Q32 40 32 20Z" />
              <path d="M32 26 Q36 42 42 50 Q46 52 46 48 Q40 38 40 24Z" />
            </g>
            <g fill="#5a3a1b">
              <circle cx="12" cy="22" r="1.2" />
              <circle cx="22" cy="20" r="1.2" />
              <circle cx="32" cy="26" r="1.2" />
            </g>
          </symbol>
        </defs>
      </svg>

      <!-- Декор за полем (верхняя половина) -->
      <svg class="decor" :width="W" :height="H" :viewBox="`0 0 ${W} ${H}`">
        <g v-for="(d, i) in decorBack" :key="'b' + i"
           :transform="d.flip ? `translate(${d.x * 2} 0) scale(-1 1)` : undefined">
          <use :href="d.href" :x="d.x - d.w / 2" :y="d.y - d.h" :width="d.w" :height="d.h" />
        </g>
      </svg>

      <!-- Земляной «срез» и тень -->
      <svg class="slab" :width="W" :height="H" :viewBox="`0 0 ${W} ${H}`">
        <defs>
          <linearGradient id="fb-l" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stop-color="#8d5d34" />
            <stop offset="1" stop-color="#583820" />
          </linearGradient>
          <linearGradient id="fb-r" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stop-color="#744a28" />
            <stop offset="1" stop-color="#46301b" />
          </linearGradient>
          <filter id="fb-blur"><feGaussianBlur stdDeviation="9" /></filter>
        </defs>
        <ellipse :cx="cx" :cy="cy + hh + SLAB + 10" :rx="hw * 1.06" :ry="hh * 0.6"
                 fill="rgba(0,0,0,0.3)" filter="url(#fb-blur)" />
        <polygon :points="leftFace" fill="url(#fb-l)" />
        <polygon :points="rightFace" fill="url(#fb-r)" />
        <polyline :points="lip" fill="none" stroke="#4f7d2b" stroke-width="5" stroke-linejoin="round" />
      </svg>

      <!-- Просёлочная дорога вдоль переднего края поля: по ней приезжает теневой скупщик -->
      <svg class="road" :width="W" :height="H" :viewBox="`0 0 ${W} ${H}`">
        <polyline :points="road.line" class="r-edge" />
        <polyline :points="road.line" class="r-bed" />
        <polyline :points="road.trackA" class="r-track" />
        <polyline :points="road.trackB" class="r-track" />
        <polyline :points="road.line" class="r-dash" />
        <!-- место остановки -->
        <line class="r-stop" :x1="road.px" :y1="road.py - 17" :x2="road.px" :y2="road.py + 17" />
        <ellipse v-if="buyerSprite?.waiting" class="r-pad" :cx="road.px" :cy="road.py + 4" rx="62" ry="17" />
      </svg>

      <!-- Плоскость поля (повёрнута в изометрию) -->
      <div class="plane" :style="planeStyle">
        <div class="grass" />

        <div v-for="o in crops" :key="'soil' + o.id" class="soil"
             :class="{ ready: isReady(o), moving: o.id === ignoreId }"
             :style="rectStyle(o.col, o.row, o.width, o.height, 3)" />

        <div v-if="preview" class="preview" :class="{ bad: !preview.valid }"
             :style="rectStyle(preview.col, preview.row, plantWidth, plantHeight, 1)" />

        <div class="rim" />
      </div>

      <!-- Забор и декор перед полем -->
      <svg class="decor" :width="W" :height="H" :viewBox="`0 0 ${W} ${H}`">
        <polyline :points="fence.rail1" fill="none" stroke="#b98450" stroke-width="3"
                  stroke-linecap="round" stroke-linejoin="round" />
        <polyline :points="fence.rail2" fill="none" stroke="#b98450" stroke-width="3"
                  stroke-linecap="round" stroke-linejoin="round" />
        <line v-for="(p, i) in fence.posts" :key="'p' + i"
              :x1="p.x" :y1="p.y" :x2="p.x" :y2="p.y - 20"
              stroke="#7a4a24" stroke-width="5" stroke-linecap="round" />
        <g v-for="(d, i) in decorFront" :key="'f' + i"
           :transform="d.flip ? `translate(${d.x * 2} 0) scale(-1 1)` : undefined">
          <use :href="d.href" :x="d.x - d.w / 2" :y="d.y - d.h" :width="d.w" :height="d.h" />
        </g>
      </svg>

      <!-- Всё, что стоит на поле -->
      <div class="sprites">
        <template v-for="s in sprites" :key="s.id">
          <!-- КУЛЬТУРЫ: всегда рисуем кодом (CropField), PNG не используем -->
          <template v-if="s.field">
            <CropField :kind="s.field" :w="s.w" :h="s.h" :cell="cell"
                       :stage="s.stage" :seed="s.id" :style="s.fieldStyle"
                       :class="{ 'field-moving': s.moving }" />
            <div v-show="!s.moving" class="fl" :style="s.labelStyle">
              <div v-if="s.ready" class="bubble">✓</div>
              <div v-else class="bar"><div class="fill" :style="{ width: s.pct * 100 + '%' }" /></div>
            </div>
          </template>

          <!-- ЗДАНИЯ: PNG из /object, с фолбэком на «missing» -->
          <template v-else>
            <div class="sprite" :class="{ moving: s.moving }" :style="s.style">
              <div class="body" :class="{ ready: s.ready }" :style="{ transform: `scale(${s.grow})` }">
                <img v-if="s.src && !broken.has(s.src)" :src="s.src" alt="" draggable="false"
                     @error="broken.add(s.src)" />
                <div v-else class="missing">{{ s.code }}<br />{{ s.src || 'нет icon в каталоге' }}</div>
              </div>
              <div v-if="s.ready" class="bubble">✓</div>
            </div>

            <!-- что производится + трекер загрузки -->
            <div v-if="s.prod" class="prodtag" :class="{ done: s.prod.done }" :style="s.prodStyle">
              <span class="pico">{{ s.prod.emoji }}</span>
              <span v-if="s.prod.blocked" class="pdone">Забастовка</span>
              <span v-else-if="s.prod.done" class="pdone">Готово</span>
              <div v-else class="pbar"><div class="fill" :style="{ width: s.prod.pct * 100 + '%' }" /></div>
              <span v-if="s.prod.queued" class="pq">+{{ s.prod.queued }}</span>
            </div>
          </template>
        </template>

        <!-- теневой скупщик: едет по дороге, встаёт у фермы, после сделки уезжает -->
        <div v-if="buyerSprite" class="sprite buyer" :style="buyerSprite.style" @click.stop="emit('buyer-click')">
          <div v-if="buyerSprite.label" class="blabel" :class="{ ready: buyerSprite.waiting }">{{ buyerSprite.label }}</div>
          <img v-if="!broken.has(BUYER_SRC)" :src="BUYER_SRC" alt="" draggable="false"
               :class="{ flip: buyerSprite.flip }" @error="broken.add(BUYER_SRC)" />
          <div v-else class="buyer-missing" :class="{ flip: buyerSprite.flip }">🛵</div>
        </div>

        <!-- «призрак» выбранной культуры -->
        <CropField v-if="ghostField" class="ghost-field" :kind="ghostField.kind"
                   :w="plantWidth" :h="plantHeight" :cell="cell"
                   :stage="3" :seed="1" :style="ghostField.style" />

        <!-- «призрак» выбранного здания с картинкой -->
        <div v-if="preview && previewSrc && !broken.has(previewSrc)"
             class="sprite ghost" :style="ghostStyle">
          <div class="body">
            <img :src="previewSrc" alt="" draggable="false" @error="broken.add(previewSrc!)" />
          </div>
        </div>
      </div>
    </div>
  </div>
  <div v-else class="text-stone-500 text-center py-12">Загрузка фермы…</div>
</template>

<script setup lang="ts">
import { jobsOf } from '~/stores/board'
import type { PlacedObject, Cell, QueuedJob } from '~/stores/board'
import { useCatalogStore } from '~/stores/catalog'
import { objectSrc } from '~/utils/objectSrc'
import { cropKind, fieldBox } from '~/utils/cropLook'
import { productEmoji, toMs } from '~/utils/productLook'

const props = withDefaults(
  defineProps<{
    board: { size: number; objects: PlacedObject[]; cells?: Cell[] } | null
    cellPx?: number
    plantWidth?: number
    plantHeight?: number
    previewSrc?: string
    previewKind?: 'CROP' | 'BUILDING'
    previewCode?: string
    /** объект, который сейчас переносят: он не занимает клетки и не кликабелен */
    ignoreId?: number | null
    /** режим размещения: показывает превью-призрак и разрешает клики по пустым клеткам */
    active?: boolean
    /** визит теневого скупщика (время в мс сервера; offsetMs = серверные − локальные часы); null — скупщика нет */
    buyer?: { summonedAtMs: number; arrivesAtMs: number; leavesAtMs: number; offsetMs: number } | null
  }>(),
  { cellPx: 56, plantWidth: 2, plantHeight: 2, previewKind: 'CROP', ignoreId: null, active: false, buyer: null }
)

const emit = defineEmits<{
  (e: 'object-click', obj: PlacedObject): void
  (e: 'cell-click', cell: Cell): void
  (e: 'buyer-click'): void
}>()

const catalogStore = useCatalogStore()

/* ---------- настройки внешнего вида ---------- */
const PAD_X = 40
const PAD_TOP = 200
const PAD_BOTTOM = 80 // внизу место под дорогу скупщика
const SLAB = 30
const CROP_K = 1
const BUILDING_K = 1.1
const LIFT = 0.55

/* ---------- время ---------- */
const now = ref(Date.now())
let timer: ReturnType<typeof setInterval> | null = null
onMounted(() => { timer = setInterval(() => (now.value = Date.now()), 1000) })
onBeforeUnmount(() => { if (timer) clearInterval(timer) })

const clamp = (v: number, a: number, b: number) => Math.min(Math.max(v, a), b)
const isReady = (o: PlacedObject) => o.kind === 'CROP' && now.value >= toMs(o.readyAt)
const progress = (o: PlacedObject) => {
  const start = toMs(o.plantedAt), end = toMs(o.readyAt)
  if (!end || end <= start) return isReady(o) ? 1 : 0
  return clamp((now.value - start) / (end - start), 0, 1)
}
const stageOf = (pct: number, ready: boolean) =>
  ready ? 4 : pct < 0.2 ? 0 : pct < 0.45 ? 1 : pct < 0.7 ? 2 : 3

/* ---------- производство на заводах ---------- */
const jobDone = (j: QueuedJob) => now.value >= toMs(j.readyAt)
const isProducing = (o: PlacedObject) => o.kind === 'BUILDING' && jobsOf(o).length > 0
/** Есть хотя бы один готовый к выдаче продукт. */
const prodDone = (o: PlacedObject) => isProducing(o) && jobsOf(o).some(jobDone)
/** Показываем готовый продукт, а если готовых нет — тот, что делается сейчас. */
const prodJob = (o: PlacedObject) => {
  const jobs = jobsOf(o)
  return jobs.find(jobDone) ?? jobs[0]
}
const prodProgress = (o: PlacedObject) => {
  const j = prodJob(o)
  if (!j) return 0
  const start = toMs(j.startedAt), end = toMs(j.readyAt)
  if (!end || end <= start) return jobDone(j) ? 1 : 0
  return clamp((now.value - start) / (end - start), 0, 1)
}

/* ---------- геометрия изометрии ---------- */
const K = Math.SQRT1_2
const cell = computed(() => props.cellPx)
const size = computed(() => props.board?.size ?? 24)
const S = computed(() => size.value * cell.value)
const hw = computed(() => S.value * K)
const hh = computed(() => (S.value * K) / 2)
const W = computed(() => Math.round(2 * hw.value + 2 * PAD_X))
const H = computed(() => Math.round(2 * hh.value + PAD_TOP + PAD_BOTTOM + SLAB))
const cx = computed(() => W.value / 2)
const cy = computed(() => PAD_TOP + hh.value)

const project = (col: number, row: number) => {
  const x = col * cell.value - S.value / 2
  const y = row * cell.value - S.value / 2
  return { x: cx.value + (x - y) * K, y: cy.value + (x + y) * K * 0.5 }
}
const unproject = (px: number, py: number) => {
  const dx = px - cx.value
  const dy = py - cy.value
  const x = (dx / K + (2 * dy) / K) / 2
  const y = ((2 * dy) / K - dx / K) / 2
  return { col: (x + S.value / 2) / cell.value, row: (y + S.value / 2) / cell.value }
}

const leftFace = computed(() => {
  const L = { x: cx.value - hw.value, y: cy.value }
  const B = { x: cx.value, y: cy.value + hh.value }
  return `${L.x},${L.y} ${B.x},${B.y} ${B.x},${B.y + SLAB} ${L.x},${L.y + SLAB}`
})
const rightFace = computed(() => {
  const R = { x: cx.value + hw.value, y: cy.value }
  const B = { x: cx.value, y: cy.value + hh.value }
  return `${B.x},${B.y} ${R.x},${R.y} ${R.x},${R.y + SLAB} ${B.x},${B.y + SLAB}`
})
const lip = computed(() => {
  const L = { x: cx.value - hw.value, y: cy.value }
  const B = { x: cx.value, y: cy.value + hh.value }
  const R = { x: cx.value + hw.value, y: cy.value }
  return `${L.x},${L.y} ${B.x},${B.y} ${R.x},${R.y}`
})

const planeStyle = computed(() => ({
  width: `${S.value}px`,
  height: `${S.value}px`,
  left: `${cx.value - S.value / 2}px`,
  top: `${cy.value - S.value / 2}px`,
  '--c': `${cell.value}px`
}))

const rectStyle = (col: number, row: number, w: number, h: number, inset: number) => ({
  left: `${col * cell.value + inset}px`,
  top: `${row * cell.value + inset}px`,
  width: `${w * cell.value - inset * 2}px`,
  height: `${h * cell.value - inset * 2}px`
})

/* ---------- автоподгонка ---------- */
const fitEl = ref<HTMLElement | null>(null)
const sceneEl = ref<HTMLElement | null>(null)
const avail = ref(0)
const scale = computed(() => (avail.value > 0 ? Math.min(1, avail.value / W.value) : 1))
const scaledH = computed(() => Math.round(H.value * scale.value))
const offsetX = computed(() => Math.max(0, Math.round((avail.value - W.value * scale.value) / 2)))

watch(
  fitEl,
  (el, _old, onCleanup) => {
    if (!el) return
    avail.value = el.clientWidth
    const ro = new ResizeObserver(() => (avail.value = el.clientWidth))
    ro.observe(el)
    onCleanup(() => ro.disconnect())
  },
  { flush: 'post' }
)

/* ---------- дорога и теневой скупщик ---------- */
const BUYER_SRC = '/object/illegal_buyer.png'
const DEPART_MS = 6000        // столько скупщик уезжает (как в окне скупщика)
const ROAD_W = 34
const ROAD_OFF = SLAB + 34    // дорога идёт параллельно левому переднему краю, чуть ниже земляного среза
const BUYER_START_X = -170    // откуда он выезжает (за левым краем сцены)

// y центра дороги в точке x: передний край ромба имеет уклон 1:2
const roadY = (x: number) => cy.value + hh.value + ROAD_OFF - Math.abs(x - cx.value) * 0.5
const roadEndX = computed(() => cx.value - hw.value * 0.12) // дорога заканчивается тупиком у фермы
const parkX = computed(() => cx.value - hw.value * 0.3)     // где скупщик встаёт

const road = computed(() => {
  const x0 = BUYER_START_X - 240
  const x1 = roadEndX.value
  const pts = (dy: number) => `${x0},${roadY(x0) + dy} ${x1},${roadY(x1) + dy}`
  const px = parkX.value
  return { line: pts(0), trackA: pts(-7), trackB: pts(7), px, py: roadY(px) }
})

const buyerNow = ref(Date.now())
const leaveGhost = ref<{ startedAt: number; q0: number } | null>(null)
let lastFrac = 0
let buyerTimer: ReturnType<typeof setInterval> | null = null
onMounted(() => {
  buyerTimer = setInterval(() => {
    const g = leaveGhost.value
    if (g && Date.now() - g.startedAt >= DEPART_MS) leaveGhost.value = null
    if (props.buyer || leaveGhost.value) {
      buyerNow.value = Date.now()
      if (buyerSprite.value && !leaveGhost.value) lastFrac = buyerSprite.value.frac
    }
  }, 100)
})
onBeforeUnmount(() => { if (buyerTimer) clearInterval(buyerTimer) })

type BuyerPhase = 'NONE' | 'ARRIVING' | 'PRESENT' | 'LEAVING'
const buyerPhase = computed<BuyerPhase>(() => {
  const b = props.buyer
  if (!b) return 'NONE'
  const t = buyerNow.value + b.offsetMs
  if (t >= b.leavesAtMs) return 'NONE'
  if (t < b.arrivesAtMs) return 'ARRIVING'
  if (t < b.leavesAtMs - DEPART_MS) return 'PRESENT'
  return 'LEAVING'
})

// скупщика отпустили/продали раньше срока — он разворачивается и уезжает по дороге
watch(buyerPhase, (ph, old) => {
  if (ph === 'NONE' && (old === 'ARRIVING' || old === 'PRESENT') && lastFrac > 0.02) {
    leaveGhost.value = { startedAt: Date.now(), q0: lastFrac }
  } else if (ph !== 'NONE') {
    leaveGhost.value = null
  }
})

const mmss = (sec: number) => `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, '0')}`

const buyerSprite = computed(() => {
  const T = buyerNow.value
  // f: 0 — за левым краем, 1 — на месте остановки
  const place = (f: number) => {
    const x = BUYER_START_X + (parkX.value - BUYER_START_X) * f
    return { left: `${x}px`, top: `${roadY(x) + 8}px`, width: `${cell.value * 2}px`, zIndex: 3000 }
  }

  const g = leaveGhost.value
  if (g) {
    const f = g.q0 * (1 - clamp((T - g.startedAt) / DEPART_MS, 0, 1))
    return { style: place(f), flip: true, waiting: false, label: '', frac: f }
  }

  const b = props.buyer
  const ph = buyerPhase.value
  if (!b || ph === 'NONE') return null
  const t = T + b.offsetMs

  if (ph === 'ARRIVING') {
    const f = clamp((t - b.summonedAtMs) / Math.max(1, b.arrivesAtMs - b.summonedAtMs), 0, 1)
    const left = Math.max(0, Math.ceil((b.arrivesAtMs - t) / 1000))
    return { style: place(f), flip: false, waiting: false, label: `🛵 едет… ${left}с`, frac: f }
  }
  if (ph === 'PRESENT') {
    const left = Math.max(0, Math.ceil((b.leavesAtMs - DEPART_MS - t) / 1000))
    return { style: place(1), flip: false, waiting: true, label: `💰 Продаём? ${mmss(left)}`, frac: 1 }
  }
  // последние секунды визита: разворот и отъезд
  const f = clamp((b.leavesAtMs - t) / DEPART_MS, 0, 1)
  return { style: place(f), flip: true, waiting: false, label: '', frac: f }
})

/* ---------- декор ---------- */
type DecorKind = 'tree' | 'pine' | 'bush' | 'rock' | 'flower'
const DECOR_SPEC: Record<DecorKind, { w: number; ratio: number }> = {
  tree:   { w: 1.9, ratio: 1.4 },
  pine:   { w: 1.3, ratio: 1.875 },
  bush:   { w: 1.1, ratio: 0.625 },
  rock:   { w: 0.8, ratio: 0.667 },
  flower: { w: 0.9, ratio: 0.5 }
}

const mulberry32 = (a: number) => () => {
  a = (a + 0x6d2b79f5) | 0
  let t = Math.imul(a ^ (a >>> 15), 1 | a)
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296
}

const decor = computed(() => {
  const rnd = mulberry32(20261023)
  const out: { href: string; x: number; y: number; w: number; h: number; flip: boolean; front: boolean }[] = []
  const target = Math.round((W.value * H.value) / 11000)
  const cyEff = cy.value + SLAB / 2
  const hhEff = hh.value + SLAB / 2

  for (let tries = 0; out.length < target && tries < target * 30; tries++) {
    const x = 24 + rnd() * (W.value - 48)
    const y = 24 + rnd() * (H.value - 36)
    const d = Math.abs(x - cx.value) / hw.value + Math.abs(y - cyEff) / hhEff
    if (d < 1.1) continue

    const r = rnd()
    const kind: DecorKind =
      r < 0.32 ? 'tree' : r < 0.44 ? 'pine' : r < 0.66 ? 'bush' : r < 0.78 ? 'rock' : 'flower'
    const spec = DECOR_SPEC[kind]
    const w = spec.w * cell.value * (0.8 + rnd() * 0.4)
    const h = w * spec.ratio
    if (y - h < 4) continue
    // не сажаем деревья и камни на дорогу скупщика
    if (x < roadEndX.value + 80) {
      const ry = roadY(x)
      if (y >= ry - ROAD_W / 2 - 12 && y - h <= ry + ROAD_W / 2 + 8) continue
    }
    if (out.some(o => Math.hypot(o.x - x, (o.y - y) * 1.7) < (o.w + w) * 0.3)) continue

    const alt = rnd() < 0.5
    const href =
      kind === 'tree' ? (alt ? '#fd-tree-a' : '#fd-tree-b')
      : kind === 'flower' ? (alt ? '#fd-flower-a' : '#fd-flower-b')
      : `#fd-${kind}`
    out.push({ href, x, y, w, h, flip: rnd() < 0.5, front: y > cy.value })
  }
  return out.sort((a, b) => a.y - b.y)
})
const decorBack = computed(() => decor.value.filter(d => !d.front))
const decorFront = computed(() => decor.value.filter(d => d.front))

const fence = computed(() => {
  const T = { x: cx.value, y: cy.value - hh.value }
  const L = { x: cx.value - hw.value, y: cy.value }
  const R = { x: cx.value + hw.value, y: cy.value }
  const n = Math.max(2, Math.round(size.value / 2))
  const posts: { x: number; y: number }[] = []
  for (let i = 0; i <= n; i++)
    posts.push({ x: L.x + ((T.x - L.x) * i) / n, y: L.y + ((T.y - L.y) * i) / n })
  for (let i = 1; i <= n; i++)
    posts.push({ x: T.x + ((R.x - T.x) * i) / n, y: T.y + ((R.y - T.y) * i) / n })
  const rail = (up: number) => posts.map(p => `${p.x},${p.y - up}`).join(' ')
  return { posts, rail1: rail(7), rail2: rail(15) }
})

/* ---------- объекты и спрайты ---------- */
const crops = computed(() => (props.board?.objects ?? []).filter(o => o.kind === 'CROP'))
const broken = reactive(new Set<string>())

const owner = computed(() => {
  const m = new Map<number, PlacedObject>()
  const n = size.value
  for (const o of props.board?.objects ?? []) {
    if (props.ignoreId != null && o.id === props.ignoreId) continue
    for (let r = o.row; r < o.row + o.height; r++)
      for (let c = o.col; c < o.col + o.width; c++) m.set(r * n + c, o)
  }
  return m
})

const spriteBox = (col: number, row: number, w: number, h: number, kind: string) => {
  const c = project(col + w / 2, row + h / 2)
  const halfW = ((w + h) * cell.value * K) / 2
  const width = halfW * 2 * (kind === 'BUILDING' ? BUILDING_K : CROP_K)
  return {
    left: `${c.x}px`,
    top: `${c.y + (halfW / 2) * LIFT}px`,
    width: `${width}px`
  }
}

const fieldPos = (col: number, row: number, w: number, h: number) => {
  const b = fieldBox(w, h, cell.value)
  const t = project(col, row)
  return { left: `${t.x - b.x0}px`, top: `${t.y - b.padTop}px` }
}

const sprites = computed(() =>
  (props.board?.objects ?? []).map(o => {
    const isCrop = o.kind === 'CROP'
    const code = (isCrop ? o.crop : o.building) ?? ''
    const item = catalogStore.byCode(code)
    const src = objectSrc(item?.icon)
    // КУЛЬТУРЫ ВСЕГДА рисуем кодом (SVG #fc-*), PNG для них не используем
    const field = isCrop ? cropKind(code) : null
    const pct = isCrop ? progress(o) : 1
    const ready = isCrop ? isReady(o) : prodDone(o)
    const z = Math.round((o.row + o.height + o.col + o.width) * 10)
    const c = project(o.col + o.width / 2, o.row + o.height / 2)

    const halfW = ((o.width + o.height) * cell.value * K) / 2
    const blocked = o.kind === 'BUILDING' && !!o.blockedUntil && now.value < toMs(o.blockedUntil)
    const prod = isProducing(o) || blocked
      ? {
          blocked,
          emoji: blocked ? '✊' : productEmoji(prodJob(o)?.output),
          pct: prodProgress(o),
          done: prodDone(o),
          queued: Math.max(0, jobsOf(o).length - 1)
        }
      : null

    return {
      id: o.id,
      code,
      src,
      field,
      isCrop,
      pct,
      ready,
      prod,
      moving: props.ignoreId != null && o.id === props.ignoreId,
      w: o.width,
      h: o.height,
      stage: stageOf(pct, ready),
      grow: isCrop ? 0.45 + 0.55 * pct : 1,
      style: { ...spriteBox(o.col, o.row, o.width, o.height, o.kind), zIndex: z },
      fieldStyle: field ? { ...fieldPos(o.col, o.row, o.width, o.height), zIndex: z } : {},
      labelStyle: {
        left: `${c.x}px`,
        top: `${ready ? c.y - cell.value * 1.15 : c.y}px`,
        zIndex: z + 1
      },
      prodStyle: {
        left: `${c.x}px`,
        top: `${c.y + (halfW / 2) * LIFT + 4}px`,
        zIndex: z + 2
      }
    }
  })
)

/* ---------- наведение и клик ---------- */
const hover = ref<{ col: number; row: number } | null>(null)

const toCell = (e: MouseEvent) => {
  const r = sceneEl.value!.getBoundingClientRect()
  return unproject((e.clientX - r.left) / scale.value, (e.clientY - r.top) / scale.value)
}
const inside = (p: { col: number; row: number }) =>
  p.col >= 0 && p.row >= 0 && p.col < size.value && p.row < size.value

const onMove = (e: MouseEvent) => {
  if (!sceneEl.value) return
  const p = toCell(e)
  hover.value = inside(p) ? p : null
}

// превью (призрак + подсветка клеток) — только в режиме размещения
const preview = computed(() => {
  if (!props.active) return null
  const h = hover.value
  if (!h || !props.board) return null
  const n = size.value, pw = props.plantWidth, ph = props.plantHeight
  const col = clamp(Math.round(h.col - pw / 2), 0, Math.max(0, n - pw))
  const row = clamp(Math.round(h.row - ph / 2), 0, Math.max(0, n - ph))
  let valid = pw <= n && ph <= n
  for (let r = row; r < row + ph && valid; r++)
    for (let c = col; c < col + pw; c++)
      if (owner.value.has(r * n + c)) { valid = false; break }
  return { col, row, valid }
})

const ghostStyle = computed(() =>
  preview.value
    ? {
        ...spriteBox(preview.value.col, preview.value.row, props.plantWidth, props.plantHeight, props.previewKind),
        zIndex: 9999
      }
    : {}
)

const ghostField = computed(() => {
  const pv = preview.value
  if (!pv || props.previewKind !== 'CROP' || props.previewSrc) return null
  const kind = cropKind(props.previewCode)
  if (!kind) return null
  return {
    kind,
    style: { ...fieldPos(pv.col, pv.row, props.plantWidth, props.plantHeight), zIndex: 9999 }
  }
})

// курсор-«рука»: над любым заводом и над созревшей культурой
const hoverReady = computed(() => {
  const h = hover.value
  if (!h) return false
  const o = owner.value.get(Math.floor(h.row) * size.value + Math.floor(h.col))
  return !!o // на любой объект можно кликнуть: завод, склад, культура (созрела — собрать, иначе — меню)
})

const onClick = (e: MouseEvent) => {
  if (!props.board || !sceneEl.value) return
  onMove(e)
  const h = hover.value
  if (!h) return

  // клик по объекту работает всегда (склад, завод, сбор урожая)
  const obj = owner.value.get(Math.floor(h.row) * size.value + Math.floor(h.col))
  if (obj) { emit('object-click', obj); return }

  // по пустой клетке — только в режиме размещения
  if (!props.active) return
  const pv = preview.value
  if (pv?.valid) {
    const index = pv.row * size.value + pv.col
    emit('cell-click', props.board.cells?.[index] ?? ({ index, type: 'EMPTY' } as Cell))
  }
}
</script>

<style scoped>
.farm-fit {
  position: relative; width: 100%; overflow: hidden;
  background:
    radial-gradient(circle at 12% 18%, rgba(190, 235, 120, 0.35), transparent 30%),
    radial-gradient(circle at 88% 82%, rgba(190, 235, 120, 0.25), transparent 30%),
    radial-gradient(ellipse at 50% 55%, transparent 40%, rgba(15, 50, 20, 0.45) 100%),
    radial-gradient(rgba(255, 255, 255, 0.07) 1.5px, transparent 2px) 0 0 / 22px 22px,
    #5f9d3a;
}
.farm-scene { position: absolute; top: 0; transform-origin: 0 0; user-select: none; cursor: default; }
.farm-scene.placing { cursor: crosshair; }
.farm-scene.pointer { cursor: pointer; }
.slab { position: absolute; left: 0; top: 0; pointer-events: none; }
.decor { position: absolute; left: 0; top: 0; pointer-events: none; }

/* дорога скупщика */
.road { position: absolute; left: 0; top: 0; pointer-events: none; overflow: visible; }
.r-edge { fill: none; stroke: #6a4a2a; stroke-width: 42; stroke-linecap: round; opacity: 0.9; }
.r-bed { fill: none; stroke: #bf9560; stroke-width: 34; stroke-linecap: round; }
.r-track { fill: none; stroke: rgba(80, 50, 20, 0.28); stroke-width: 4; stroke-linecap: round; }
.r-dash { fill: none; stroke: rgba(255, 245, 210, 0.6); stroke-width: 2; stroke-dasharray: 16 14; }
.r-stop { stroke: rgba(250, 204, 21, 0.55); stroke-width: 4; stroke-linecap: round; }
.r-pad {
  fill: rgba(250, 204, 21, 0.2); stroke: #facc15; stroke-width: 3; stroke-dasharray: 8 6;
  animation: pad 1.2s ease-in-out infinite;
}
@keyframes pad { 0%, 100% { opacity: 0.55; } 50% { opacity: 1; } }

.plane { position: absolute; transform-origin: 50% 50%; transform: scaleY(0.5) rotate(45deg); pointer-events: none; }
.grass {
  position: absolute; inset: 0;
  background-color: #78bd45;
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.07) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.07) 1px, transparent 1px),
    repeating-conic-gradient(rgba(0, 0, 0, 0.045) 0% 25%, transparent 0% 50%),
    radial-gradient(circle at 20% 30%, rgba(170, 230, 100, 0.55), transparent 28%),
    radial-gradient(circle at 75% 70%, rgba(40, 120, 50, 0.3), transparent 32%);
  background-size:
    var(--c) var(--c),
    var(--c) var(--c),
    calc(var(--c) * 2) calc(var(--c) * 2),
    100% 100%, 100% 100%;
}
.rim { position: absolute; inset: 0; box-shadow: inset 0 0 0 3px rgba(60, 100, 30, 0.65); }

.soil {
  position: absolute; border-radius: 6px;
  background: repeating-linear-gradient(90deg, #8a5a32 0 10px, #7a4d2a 10px 20px);
  box-shadow: inset 0 0 0 2px #5e3b1f, inset 0 0 14px rgba(0, 0, 0, 0.35);
}
.soil.moving, .field-moving { opacity: 0.35; }
.soil.ready { box-shadow: inset 0 0 0 2px #facc15, 0 0 14px rgba(250, 204, 21, 0.8); }

.preview {
  position: absolute; border-radius: 4px;
  background: rgba(120, 255, 120, 0.35);
  box-shadow: inset 0 0 0 3px rgba(255, 255, 255, 0.9);
}
.preview.bad { background: rgba(255, 70, 70, 0.4); }

.sprites { position: absolute; inset: 0; pointer-events: none; }
.sprite { position: absolute; transform: translate(-50%, -100%); }
.sprite img {
  display: block; width: 100%; height: auto;
  filter: drop-shadow(0 6px 4px rgba(0, 0, 0, 0.28));
}
.body { transform-origin: 50% 100%; transition: transform 1s linear; }
.body.ready img {
  filter: drop-shadow(0 0 8px rgba(255, 214, 64, 0.95)) drop-shadow(0 6px 4px rgba(0, 0, 0, 0.28));
}
.sprite.moving { opacity: 0.4; }
.sprite.buyer { pointer-events: auto; cursor: pointer; transition: left 0.1s linear, top 0.1s linear; }
.buyer img.flip, .buyer-missing.flip { transform: scaleX(-1); }
.buyer-missing { font-size: 64px; line-height: 1; text-align: center; }
.blabel {
  position: absolute; left: 50%; bottom: 100%; transform: translateX(-50%); margin-bottom: 2px;
  padding: 2px 9px; border-radius: 9px; white-space: nowrap;
  font: 700 11px sans-serif; color: #fde68a; background: rgba(28, 20, 12, 0.88);
  border: 1px solid rgba(255, 255, 255, 0.2); box-shadow: 0 2px 6px rgba(0, 0, 0, 0.4);
}
.blabel.ready { background: #fbbf24; color: #1c1917; border-color: #fff3c4; animation: bob 1s ease-in-out infinite; }
.ghost { opacity: 0.65; }
.ghost-field { opacity: 0.7; }

.missing {
  aspect-ratio: 1; display: flex; flex-direction: column; align-items: center; justify-content: center;
  border: 2px dashed rgba(255, 255, 255, 0.85); background: rgba(0, 0, 0, 0.3);
  color: #fff; font: 600 11px sans-serif; text-align: center; padding: 4px; word-break: break-all;
}

.bubble {
  position: absolute; left: 50%; top: -6px; width: 28px; height: 28px; border-radius: 50%;
  background: #facc15; color: #44300a; font-weight: 800;
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.4);
  animation: bob 1s ease-in-out infinite;
}
@keyframes bob {
  0%, 100% { transform: translate(-50%, 0); }
  50% { transform: translate(-50%, -6px); }
}

.bar {
  position: absolute; left: 50%; bottom: 6px; width: 46%; height: 7px;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.45); border-radius: 4px; overflow: hidden;
}
.fill { height: 100%; background: linear-gradient(#a3e635, #65a30d); transition: width 1s linear; }

.fl { position: absolute; width: 0; height: 0; }
.fl .bar { left: -24px; width: 48px; bottom: auto; top: 0; transform: none; }

.prodtag {
  position: absolute; transform: translate(-50%, 0);
  display: flex; align-items: center; gap: 5px;
  padding: 2px 8px 2px 5px; border-radius: 999px;
  background: rgba(28, 20, 12, 0.85);
  border: 1px solid rgba(255, 255, 255, 0.22);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.4);
  white-space: nowrap;
}
.prodtag.done { border-color: #facc15; box-shadow: 0 0 10px rgba(250, 204, 21, 0.85); }
.pico { font-size: 17px; line-height: 1; }
.pbar { width: 46px; height: 6px; border-radius: 3px; overflow: hidden; background: rgba(255, 255, 255, 0.2); }
.pq { font: 700 10px sans-serif; color: #fde68a; background: rgba(255, 255, 255, 0.16); padding: 0 5px; border-radius: 8px; }
.pdone { font: 700 11px sans-serif; color: #fde68a; }
</style>