import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.js'],
    // scripts/ holds the Node-side curriculum validator and the Playwright
    // smoke run. Both need a real Pyodide or a real browser, so they stay out
    // of the unit suite and keep their own npm scripts.
    exclude: ['node_modules/**', 'dist/**', 'scripts/**'],
  },
})
