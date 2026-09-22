import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],
  // 127.0.0.1 thay vì "localhost" để tránh Node thử phân giải qua IPv6 (::1) rồi bị từ chối
  server: { proxy: { '/api': 'http://127.0.0.1:5000' } },
})
