// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  experimental: {
    typedPages: true,
  },
  build: {
    transpile: ['trpc-nuxt'],
  },
  typescript: {
    shim: false,
  },
});
