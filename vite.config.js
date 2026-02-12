import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/api/cctv': {
        // 👇 AMBIL DARI SCREENSHOT LU (Bagian depan sebelum nama file)
        target: 'https://atcs.tasikmalayakota.go.id/camera', 
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/cctv/, ''),
        secure: false, // Penting karena targetnya https
      },
    },
  },
})
