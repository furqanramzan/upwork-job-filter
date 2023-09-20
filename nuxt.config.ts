import { resolve } from 'node:path';

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  runtimeConfig: {
    DRIZZLE_DIRECTORY: resolve('./server/drizzle/'),
    APP_NAME: process.env.APP_NAME,
    CRON_TIMEOUT: process.env.CRON_TIMEOUT,
    UPWORK_USERNAME: process.env.UPWORK_USERNAME,
    UPWORK_PASSWORD: process.env.UPWORK_PASSWORD,
    VAPID_PRIVATE_KEY: process.env.VAPID_PRIVATE_KEY,
    VAPID_PUBLIC_KEY: process.env.VAPID_PUBLIC_KEY,
    VAPID_EMAIL_ADDRESS: process.env.VAPID_EMAIL_ADDRESS,
    CHROME_EXECUTABLE_PATH: process.env.CHROME_EXECUTABLE_PATH,
    public: {
      COPY_FOR_PROPOSAL_TEXT: process.env.COPY_FOR_PROPOSAL_TEXT,
    },
  },
  experimental: {
    typedPages: true,
  },
  modules: [
    '@element-plus/nuxt',
    'nuxt-scheduler',
    '@nuxtjs/tailwindcss',
    '@vueuse/nuxt',
    '@vite-pwa/nuxt',
  ],
  pwa: {
    scope: '/',
    srcDir: './service-worker',
    filename: 'sw.ts',
    strategies: 'injectManifest',
    includeManifestIcons: false,
    injectManifest: {
      injectionPoint: undefined,
    },
    manifest: false,
    devOptions: {
      enabled: true,
      type: 'module',
    },
  },
  build: {
    transpile: ['trpc-nuxt'],
  },
  typescript: {
    shim: false,
  },
});
