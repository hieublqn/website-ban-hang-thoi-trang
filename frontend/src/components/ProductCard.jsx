import { Link } from 'react-router-dom'
import { money } from '../api.js'
import { useCart } from '../cart.jsx'

export default function ProductCard({ p }) {
  const { add } = useCart()
  return (
    <div className="card">
      <Link to={`/san-pham/${p.MaSP}`}>
        <div className="thumb-wrap"><img src={p.HinhAnh} alt={p.TenSP} loading="lazy" /></div>
        <h3>{p.TenSP}</h3>
      </Link>
      <div className="price">{money(p.Gia)}</div>
      <button className="btn" disabled={p.SoLuongTon <= 0} onClick={() => add(p)}>
        {p.SoLuongTon > 0 ? 'Thêm vào giỏ' : 'Hết hàng'}
      </button>
    </div>
  )
}
