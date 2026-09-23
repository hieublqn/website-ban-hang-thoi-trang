import { useEffect, useState } from 'react'
import { Link, NavLink, Outlet } from 'react-router-dom'
import api from '../api.js'
import { useCart } from '../cart.jsx'

// Icon trang trí đơn giản (không dùng logo thật của Facebook/Instagram/YouTube vì
// trang này chưa có các tài khoản đó - tránh gây hiểu lầm là đã liên kết mạng xã hội thật)
const SocialIcon = ({ label, children }) => (
  <span className="social-ic" title={label} aria-label={label}>{children}</span>
)

export default function Layout() {
  const { count, toast } = useCart()
  const [cats, setCats] = useState([])

  useEffect(() => { api.get('/categories').then((r) => setCats(r.data)).catch(() => {}) }, [])

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
        <div className="container footer-grid">
          <div className="footer-col">
            <div className="logo">StyleNest</div>
            <p>Thời trang cho mọi phong cách — trẻ trung, năng động, giá hợp lý.</p>
            <p>📍 12 Nguyễn Trãi, Hà Nội</p>
            <p>☎ 0900 000 000</p>
            <p>✉ shop@example.com</p>
          </div>

          <div className="footer-col">
            <h4>Điều hướng</h4>
            <Link to="/">Trang chủ</Link>
            <Link to="/san-pham">Sản phẩm</Link>
            <Link to="/lien-he">Liên hệ</Link>
            <Link to="/tra-cuu-don-hang">Tra cứu đơn hàng</Link>
          </div>

          <div className="footer-col">
            <h4>Danh mục</h4>
            {cats.map((c) => (
              <Link key={c.MaDM} to={`/san-pham?category=${c.MaDM}`}>{c.TenDM}</Link>
            ))}
          </div>

          <div className="footer-col">
            <h4>Kết nối với chúng tôi</h4>
            <div className="footer-social">
              <SocialIcon label="Facebook">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M13.5 21v-7h2.4l.4-3H13.5V9.2c0-.9.3-1.5 1.6-1.5H16V5.1C15.6 5 14.7 5 13.7 5c-2.1 0-3.5 1.3-3.5 3.7V11H8v3h2.2v7h3.3z" /></svg>
              </SocialIcon>
              <SocialIcon label="Instagram">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="4" y="4" width="16" height="16" rx="4" /><circle cx="12" cy="12" r="3.4" /><circle cx="16.3" cy="7.7" r=".6" fill="currentColor" stroke="none" /></svg>
              </SocialIcon>
              <SocialIcon label="YouTube">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M10 8.6 15.5 12 10 15.4z" /></svg>
              </SocialIcon>
            </div>
            <p className="footer-note">(Trang demo cho đồ án — chưa liên kết mạng xã hội thật)</p>
          </div>
        </div>

        <div className="footer-bottom">
          © 2026 StyleNest — Đồ án phần mềm Web · <Link to="/admin">Quản trị</Link>
        </div>
      </footer>

      {toast && <div className="toast">{toast}</div>}
    </>
  )
}
