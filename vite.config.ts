import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve('.', './src'),
    },
  },
  server: {
    port: 3000,
    host: true,
    fs: {
      strict: false
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router'],
          'motion-gsap': ['framer-motion', 'gsap'],
          'lucide-icons': ['lucide-react'],
        },
      },
    },
  },
})
