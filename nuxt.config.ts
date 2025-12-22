// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  modules: [
    // '@nuxt/content',
    '@nuxt/eslint',
    '@nuxt/hints',
    '@nuxt/fonts',
    '@nuxt/image',
    '@nuxt/scripts',
    '@nuxtjs/color-mode',
    '@pinia/nuxt',
    '@nuxt/ui',
  ],

  css: ['~/assets/css/main.css'],
})