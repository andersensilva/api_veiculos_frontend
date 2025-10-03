import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill'

export default defineConfig({
  plugins: [
    tailwindcss(),
    react()
  ],
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: 'globalThis'
      },
      plugins: [
        NodeGlobalsPolyfillPlugin({
          buffer: true
        })
      ]
    }
  },
  server: {
    proxy: {
      "/api/cars_by_brand": {
        target: "https://wswork.com.br/cars_by_brand.json",
        changeOrigin: true,
        rewrite: () => "" 
      },
      "/api/cars": {
        target: "https://wswork.com.br/cars.json",
        changeOrigin: true,
        rewrite: () => "" 
      }
    }
  }
})
