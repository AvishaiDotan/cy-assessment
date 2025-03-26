import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist', //'../phishing-attempts-management-server/dist/public',
    emptyOutDir: true,
  },
})
