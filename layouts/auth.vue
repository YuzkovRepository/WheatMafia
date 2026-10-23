<template>
  <div class="min-h-screen bg-gradient-to-br from-stone-900 via-stone-800 to-amber-950 relative overflow-hidden">
    <!-- Текстура «бумаги» -->
    <div
      class="absolute inset-0 opacity-[0.07] pointer-events-none"
      style="background-image: radial-gradient(#f5efe0 1px, transparent 1px); background-size: 18px 18px;"
    />
    <!-- Мягкое свечение -->
    <div class="absolute -top-40 -left-40 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
    <div class="absolute -bottom-40 -right-40 w-96 h-96 bg-amber-700/10 rounded-full blur-3xl pointer-events-none" />

    <div class="relative z-10">
      <slot />
    </div>
  </div>
</template>