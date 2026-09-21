import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import api, { errMsg, money } from '../api.js'
import { useCart } from '../cart.jsx'

export default function ProductDetail() {
  const { id } = useParams()
  const nav = useNavigate()
  const { add } = useCart()
  const [p, setP] = useState(null)
  const [qty, setQty] = useState(1)
  const [error, setError] = useState('')

  useEffect(() => { api.get(`/products/${id}`).then((r) => setP(r.data)).catch((e) => setError(errMsg(e))) }, [id])

  if (error) return <p className="error">{error}</p>
  if (!p) return <p>Đang tải...</p>

  return (
    <div className="detail">
      <img src={p.HinhAnh} alt={p.TenSP} />
      <div>
        <small>{p.TenDM}</small>
        <h2>{p.TenSP}</h2>
        <div className="price big">{money(p.Gia)}</div>
        <p>{p.MoTa}</p>
        <p>Còn lại: <b>{p.SoLuongTon}</b></p>
        {p.SoLuongTon > 0 && (
          <div className="row">
            <input type="number" min="1" max={p.SoLuongTon} value={qty}
              onChange={(e) => setQty(Math.max(1, Math.min(Number(e.target.value) || 1, p.SoLuongTon)))} />
            <button className="btn" onClick={() => add(p, qty)}>Thêm vào giỏ</button>
            <button className="btn alt" onClick={() => { add(p, qty); nav('/gio-hang') }}>Mua ngay</button>
          </div>
        )}
      </div>
    </div>
  )
}
