import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api, { errMsg } from '../../api.js'

export default function AdminPassword() {
  const nav = useNavigate()
  const [f, setF] = useState({ oldPassword: '', newPassword: '', confirm: '' })
  const [msg, setMsg] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value })

  const submit = async (e) => {
    e.preventDefault()
    setError(''); setMsg('')
    if (f.newPassword.length < 8) return setError('Mật khẩu mới phải có ít nhất 8 ký tự')
    if (f.newPassword !== f.confirm) return setError('Nhập lại mật khẩu mới chưa khớp')
    setBusy(true)
    try {
      await api.put('/auth/password', { oldPassword: f.oldPassword, newPassword: f.newPassword })
      setMsg('Đã đổi mật khẩu. Lần đăng nhập sau hãy dùng mật khẩu mới.')
      setF({ oldPassword: '', newPassword: '', confirm: '' })
    } catch (err) {
      if (err.response?.status === 401) { localStorage.removeItem('token'); nav('/admin/login') }
      else setError(errMsg(err))
    } finally {
      setBusy(false)
    }
  }

  return (
    <>
      <h2>Đổi mật khẩu</h2>
      <form className="form panel" onSubmit={submit}>
        <label>Mật khẩu hiện tại * <input required type="password" autoComplete="current-password" value={f.oldPassword} onChange={set('oldPassword')} /></label>
        <label>Mật khẩu mới * (ít nhất 8 ký tự) <input required type="password" autoComplete="new-password" value={f.newPassword} onChange={set('newPassword')} /></label>
        <label>Nhập lại mật khẩu mới * <input required type="password" autoComplete="new-password" value={f.confirm} onChange={set('confirm')} /></label>
        {msg && <p className="ok">{msg}</p>}
        {error && <p className="error">{error}</p>}
        <button className="btn" disabled={busy}>{busy ? 'Đang lưu...' : 'Đổi mật khẩu'}</button>
      </form>
    </>
  )
}
