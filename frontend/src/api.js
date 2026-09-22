import axios from 'axios'

// Khi chạy local (npm run dev), Vite tự proxy '/api' -> localhost:5000 (xem vite.config.js).
// Khi deploy lên Vercel, đặt biến môi trường VITE_API_URL = link backend thật, vd:
// https://ten-backend-cua-ban.onrender.com/api
const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || '/api' })

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export const errMsg = (e) => e.response?.data?.error || 'Không kết nối được máy chủ'
export const money = (n) => Number(n).toLocaleString('vi-VN') + '₫'

export default api
