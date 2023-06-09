// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  experimental: {
    typedPages: true,
  },
  modules: ['@element-plus/nuxt'],
  build: {
    transpile: ['trpc-nuxt'],
  },
  typescript: {
    shim: false,
  },
});
