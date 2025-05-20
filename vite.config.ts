import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    commonjsOptions: {
      include: [/node_modules/],
      transformMixedEsModules: true,
      strictRequires: true,
      // Add packages that need CommonJS transformation
      esmExternals: ['pexels']
    },
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['pexels', 'react', 'react-dom', 'react-router-dom', '@mui/material']
        }
      }
    },
    sourcemap: true
  },
  optimizeDeps: {
    include: ['pexels']
  },
  esbuild: {
    // Enable top level await
    supported: {
      'top-level-await': true
    }
  }
})
