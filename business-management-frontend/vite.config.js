import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: '0.0.0.0',
    allowedHosts: [
      '5173-idlqbrp5c0ay8xpim0rcr-1c49febc.manusvm.computer',
      '5174-idlqbrp5c0ay8xpim0rcr-1c49febc.manusvm.computer'
    ],
    proxy: {
      '/api': {
        target: 'https://5001-idlqbrp5c0ay8xpim0rcr-1c49febc.manusvm.computer',
        changeOrigin: true,
        secure: false
      }
    }
  }
})
