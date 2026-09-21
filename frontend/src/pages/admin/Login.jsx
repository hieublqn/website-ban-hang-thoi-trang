import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api, { errMsg } from '../../api.js'

export default function Login() {
  const nav = useNavigate()
  const [f, setF] = useState({ username: '', password: '' })
  const [error, setError] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    try {
      const { data } = await api.post('/auth/login', f)
      localStorage.setItem('token', data.token)
      nav('/admin')
    } catch (err) { setError(errMsg(err)) }
  }

  return (
    <div className="container login">
      <h2>Đăng nhập quản trị</h2>
      <form className="form" onSubmit={submit}>
        <label>Tên đăng nhập <input required value={f.username} onChange={(e) => setF({ ...f, username: e.target.value })} /></label>
        <label>Mật khẩu <input required type="password" value={f.password} onChange={(e) => setF({ ...f, password: e.target.value })} /></label>
        {error && <p className="error">{error}</p>}
        <button className="btn">Đăng nhập</button>
      </form>
    </div>
  )
}
