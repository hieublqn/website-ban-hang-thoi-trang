import { Link } from 'react-router-dom'
import { money } from '../api.js'
import { useCart } from '../cart.jsx'

export default function Cart() {
  const { items, setQty, remove, total } = useCart()

  if (!items.length) return <><h2>Giỏ hàng</h2><p>Giỏ hàng trống. <Link to="/san-pham">Đi mua sắm</Link></p></>

  return (
    <>
      <h2>Giỏ hàng</h2>
      <table>
        <thead><tr><th>Sản phẩm</th><th>Đơn giá</th><th>Số lượng</th><th>Thành tiền</th><th></th></tr></thead>
        <tbody>
          {items.map((i) => (
            <tr key={i.MaSP}>
              <td><img className="thumb" src={i.HinhAnh} alt="" /> {i.TenSP}</td>
              <td>{money(i.Gia)}</td>
              <td><input type="number" min="1" max={i.SoLuongTon} value={i.SoLuong}
                onChange={(e) => setQty(i.MaSP, Number(e.target.value) || 1)} /></td>
              <td>{money(i.Gia * i.SoLuong)}</td>
              <td><button className="btn danger" onClick={() => remove(i.MaSP)}>Xóa</button></td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="total">Tổng cộng: <b>{money(total)}</b></p>
      <Link className="btn" to="/thanh-toan">Tiến hành đặt hàng</Link>
    </>
  )
}
