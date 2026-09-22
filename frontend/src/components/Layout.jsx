import { Link, NavLink, Outlet } from 'react-router-dom'
import { useCart } from '../cart.jsx'

export default function Layout() {
  const { count, toast } = useCart()
  return (
    <>
      <header className="header">
        <div className="container header-in">
          <Link to="/" className="logo">StyleNest</Link>
          <nav>
            <NavLink to="/" end>Trang chủ</NavLink>
            <NavLink to="/san-pham">Sản phẩm</NavLink>
            <NavLink to="/lien-he">Liên hệ</NavLink>
            <NavLink to="/tra-cuu-don-hang">Tra cứu đơn</NavLink>
            <NavLink to="/gio-hang" className="cart-link">
              🛍️ Giỏ hàng {count > 0 && <span className="badge" key={count}>{count}</span>}
            </NavLink>
          </nav>
        </div>
      </header>
      <main className="container"><Outlet /></main>
      <footer className="footer">
        <div className="container">
          © 2026 StyleNest — Đồ án phần mềm Web · <Link to="/admin">Quản trị</Link>
        </div>
      </footer>
      {toast && <div className="toast">{toast}</div>}
    </>
  )
}
