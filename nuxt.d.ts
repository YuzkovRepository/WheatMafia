// nuxt.d.ts
/// <reference types="@nuxt/types" />

export {}

declare module '#imports' {
  export * from 'nuxt/dist/core/index'
  export * from '@vueuse/nuxt'
  export * from 'pinia'
}