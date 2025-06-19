import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import vercel from 'vite-plugin-vercel'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vercel(), react(), tailwindcss()],
  server: {
    port: process.env.PORT as unknown as number,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
