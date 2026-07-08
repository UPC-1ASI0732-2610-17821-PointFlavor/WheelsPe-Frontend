import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  test: {
    environment: 'jsdom',
    css: true,
    reporters: 'verbose',
    // Solo nuestras pruebas unit y functional (evita recoger *.test.* de node_modules)
    include: ['tests/unit/**/*.{test,spec}.js', 'tests/functional/**/*.{test,spec}.js'],
    exclude: ['**/node_modules/**', 'tests/e2e/**']
  }
})
