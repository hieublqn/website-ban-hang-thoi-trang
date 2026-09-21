import { useState } from 'react'
import api, { errMsg } from '../api.js'

export default function Contact() {
  const [f, setF] = useState({ HoTen: '', Email: '', NoiDung: '' })
  const [msg, setMsg] = useState('')
  const [error, setError] = useState('')
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value })

  const submit = async (e) => {
    e.preventDefault()
    setError(''); setMsg('')
    try {
      await api.post('/contacts', f)
      setMsg('Đã gửi liên hệ. Chúng tôi sẽ phản hồi sớm nhất!')
      setF({ HoTen: '', Email: '', NoiDung: '' })
    } catch (err) { setError(errMsg(err)) }
  }

  return (
    <>
      <h2>Liên hệ</h2>
      <p>📍 12 Nguyễn Trãi, Hà Nội · ☎ 0900 000 000 · ✉ shop@example.com</p>
      <form className="form" onSubmit={submit}>
        <label>Họ tên * <input required value={f.HoTen} onChange={set('HoTen')} /></label>
        <label>Email * <input required type="email" value={f.Email} onChange={set('Email')} /></label>
        <label>Nội dung * <textarea required rows="5" value={f.NoiDung} onChange={set('NoiDung')} /></label>
        {msg && <p className="ok">{msg}</p>}
        {error && <p className="error">{error}</p>}
        <button className="btn">Gửi</button>
      </form>
    </>
  )
}
