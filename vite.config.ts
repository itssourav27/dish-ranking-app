import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: true,
    commonjsOptions: {
      include: [/node_modules/],
      transformMixedEsModules: true,
    },
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom', '@mui/material']
        }
      }
    }
  },
  server: {
    port: 5173,
    open: true
  },
  assetsInclude: ['**/*.jpg', '**/*.png', '**/*.jpeg'],
  resolve: {
    alias: {
      '@': '/src',
      '@assets': '/src/assets'
    }
  }
})
