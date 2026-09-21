import axios from 'axios'

const api = axios.create({ baseURL: '/api' })

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export const errMsg = (e) => e.response?.data?.error || 'Không kết nối được máy chủ'
export const money = (n) => Number(n).toLocaleString('vi-VN') + '₫'

export default api
