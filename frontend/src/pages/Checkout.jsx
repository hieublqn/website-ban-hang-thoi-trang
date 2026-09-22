import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api, { errMsg, money } from '../api.js'
import { useCart } from '../cart.jsx'
import { saveRecentOrder } from '../orderStore.js'

export default function Checkout() {
  const { items, total, clear } = useCart()
  const nav = useNavigate()
  const [f, setF] = useState({ HoTen: '', Email: '', SoDienThoai: '', DiaChi: '' })
  const [method, setMethod] = useState('COD')
  const [note, setNote] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  if (!items.length) return <p>Giỏ hàng trống. <Link to="/san-pham">Đi mua sắm</Link></p>

  const set = (k) => (e) => setF({ ...f, [k]: e.target.value })

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    if (!/^0\d{9,10}$/.test(f.SoDienThoai)) return setError('Số điện thoại không hợp lệ (10–11 số, bắt đầu bằng 0)')
    setBusy(true)
    try {
      const { data } = await api.post('/orders', {
        customer: f, paymentMethod: method, note,
        items: items.map((i) => ({ MaSP: i.MaSP, SoLuong: i.SoLuong })),
      })
      clear()
      // Lưu tạm trên máy để nếu khách thoát trang QR giữa lúc thanh toán, mở lại link vẫn xem được
      saveRecentOrder({ MaHD: data.MaHD, SoDienThoai: f.SoDienThoai })
      nav(`/don-hang/${data.MaHD}`, { state: data })
    } catch (err) {
      setError(errMsg(err))
    } finally {
      setBusy(false)
    }
  }

  return (
    <>
      <h2>Đặt hàng</h2>
      <form className="form" onSubmit={submit}>
        <label>Họ tên * <input required value={f.HoTen} onChange={set('HoTen')} /></label>
        <label>Số điện thoại * <input required value={f.SoDienThoai} onChange={set('SoDienThoai')} /></label>
        <label>Email <input type="email" value={f.Email} onChange={set('Email')} /></label>
        <label>Địa chỉ giao hàng * <input required value={f.DiaChi} onChange={set('DiaChi')} /></label>
        <label>Ghi chú <textarea value={note} onChange={(e) => setNote(e.target.value)} /></label>
        <fieldset>
          <legend>Phương thức thanh toán</legend>
          <label className="inline"><input type="radio" checked={method === 'COD'} onChange={() => setMethod('COD')} /> Thanh toán khi nhận hàng (COD)</label>
          <label className="inline"><input type="radio" checked={method === 'QR'} onChange={() => setMethod('QR')} /> Chuyển khoản quét mã QR</label>
        </fieldset>
        <p className="total">Tổng thanh toán: <b>{money(total)}</b></p>
        {error && <p className="error">{error}</p>}
        <button className="btn" disabled={busy}>{busy ? 'Đang xử lý...' : 'Đặt hàng'}</button>
      </form>
    </>
  )
}
