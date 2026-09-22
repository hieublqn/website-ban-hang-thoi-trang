import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api, { errMsg } from '../api.js'
import { getRecentOrders, saveRecentOrder } from '../orderStore.js'

export default function OrderLookup() {
  const nav = useNavigate()
  const [f, setF] = useState({ MaHD: '', SoDienThoai: '' })
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const recent = getRecentOrders()

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setBusy(true)
    try {
      await api.post('/orders/lookup', f)
      saveRecentOrder(f)
      nav(`/don-hang/${f.MaHD}`)
    } catch (err) {
      setError(errMsg(err))
    } finally {
      setBusy(false)
    }
  }

  return (
    <>
      <h2>Tra cứu đơn hàng</h2>
      <p>Nhập mã đơn và số điện thoại lúc đặt hàng để xem trạng thái, hoặc xem lại mã QR chưa thanh toán.</p>
      <form className="form" onSubmit={submit}>
        <label>Mã đơn (vd: 12) *
          <input required value={f.MaHD} onChange={(e) => setF({ ...f, MaHD: e.target.value })} />
        </label>
        <label>Số điện thoại lúc đặt hàng *
          <input required value={f.SoDienThoai} onChange={(e) => setF({ ...f, SoDienThoai: e.target.value })} />
        </label>
        {error && <p className="error">{error}</p>}
        <button className="btn" disabled={busy}>{busy ? 'Đang tìm...' : 'Xem đơn hàng'}</button>
      </form>

      {!!recent.length && (
        <div className="panel">
          <h3>Đơn gần đây trên thiết bị này</h3>
          <div className="row">
            {recent.map((o) => (
              <Link key={o.MaHD} className="btn alt" to={`/don-hang/${o.MaHD}`}>Đơn #{o.MaHD}</Link>
            ))}
          </div>
        </div>
      )}
    </>
  )
}
