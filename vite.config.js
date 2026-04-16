import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  server:{
    proxy: {
      // Development Proxy
      // "/api": "http://localhost:8080"
      
      // Production Proxy
      "/api": "https://shoppy-backend-flax.vercel.app/"
    }
  },
  plugins: [react()],
})
