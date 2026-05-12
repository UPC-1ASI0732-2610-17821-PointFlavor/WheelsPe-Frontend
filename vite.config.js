import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig(async ({ command, mode }) => {
  // Only load the devtools plugin dynamically in development. Importing
  // the plugin at module scope can execute browser-only code (eg. access
  // localStorage) which breaks builds on Node (CI). Dynamic import here
  // ensures devtools code is evaluated only when explicitly needed.
  const plugins = [vue()]

  if (mode === 'development') {
    try {
      const mod = await import('vite-plugin-vue-devtools')
      const vueDevTools = mod.default || mod
      plugins.push(vueDevTools())
    } catch (e) {
      // If dynamic import fails (package not installed), fail silently
      // during development so it doesn't block local dev for contributors.
      // Log for visibility.
      // eslint-disable-next-line no-console
      console.warn('vite-plugin-vue-devtools could not be loaded:', e && e.message)
    }
  }

  return {
    plugins,
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      },
    },
  }
})
