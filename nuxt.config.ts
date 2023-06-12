// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  runtimeConfig: {
    UPWORK_USERNAME: process.env.UPWORK_USERNAME,
    UPWORK_PASSWORD: process.env.UPWORK_PASSWORD,
  },
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
