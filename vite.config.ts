import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  define: {
    global: 'window' //for aws-amplify compatibility
  },
  server: {
    host: '0.0.0.0', // Allow external connections
    port: 5173
  }
})
