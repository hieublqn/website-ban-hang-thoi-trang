import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api, { errMsg } from '../../api.js'

// Tải danh sách + hàm chạy thao tác (tự báo lỗi, tự về trang đăng nhập khi hết phiên)
export default function useAdminApi(path) {
  const nav = useNavigate()
  const [rows, setRows] = useState([])
  const [error, setError] = useState('')

  const fail = useCallback((e) => {
    if (e.response?.status === 401) { localStorage.removeItem('token'); nav('/admin/login') }
    else setError(errMsg(e))
  }, [nav])

  const reload = useCallback(
    () => api.get(path).then((r) => setRows(r.data)).catch(fail),
    [path, fail])

  useEffect(() => { reload() }, [reload])

  const run = async (fn) => {
    setError('')
    try { await fn(); await reload(); return true } catch (e) { fail(e); return false }
  }

  return { rows, error, run, reload }
}
