import { Link, NavLink, Outlet } from 'react-router-dom'
import { useCart } from '../cart.jsx'

export default function Layout() {
  const { count } = useCart()
  return (
    <>
      <header className="header">
        <div className="container header-in">
          <Link to="/" className="logo">WebShop</Link>
          <nav>
            <NavLink to="/" end>Trang chủ</NavLink>
            <NavLink to="/san-pham">Sản phẩm</NavLink>
            <NavLink to="/lien-he">Liên hệ</NavLink>
            <NavLink to="/gio-hang">Giỏ hàng ({count})</NavLink>
          </nav>
        </div>
      </header>
      <main className="container"><Outlet /></main>
      <footer className="footer">
        <div className="container">
          © 2026 WebShop — Đồ án phần mềm Web · <Link to="/admin">Quản trị</Link>
        </div>
      </footer>
    </>
  )
}
