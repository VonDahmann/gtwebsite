import { defineConfig } from 'vite'

export default defineConfig({
  base: '/gtwebsite/', // Ensure this matches your repository name
  build: {
    outDir: '../docs',
    emptyOutDir: true
  }
})
