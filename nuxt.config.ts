// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  runtimeConfig: {
    UPWORK_USERNAME: process.env.UPWORK_USERNAME,
    UPWORK_PASSWORD: process.env.UPWORK_PASSWORD,
    CHROME_EXECUTABLE_PATH: process.env.CHROME_EXECUTABLE_PATH,
  },
  experimental: {
    typedPages: true,
  },
  modules: [
    '@element-plus/nuxt',
    'nuxt-scheduler',
    '@nuxtjs/tailwindcss',
    '@vueuse/nuxt',
  ],
  build: {
    transpile: ['trpc-nuxt'],
  },
  typescript: {
    shim: false,
  },
});
