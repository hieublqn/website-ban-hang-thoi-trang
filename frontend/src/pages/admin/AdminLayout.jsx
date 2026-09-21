import { Link, Navigate, NavLink, Outlet, useNavigate } from 'react-router-dom'

export default function AdminLayout() {
  const nav = useNavigate()
  if (!localStorage.getItem('token')) return <Navigate to="/admin/login" replace />

  const logout = () => { localStorage.removeItem('token'); nav('/admin/login') }

  return (
    <div className="admin">
      <aside>
        <h3>Quản trị</h3>
        <NavLink to="/admin/san-pham">Sản phẩm</NavLink>
        <NavLink to="/admin/danh-muc">Danh mục</NavLink>
        <NavLink to="/admin/don-hang">Đơn hàng</NavLink>
        <NavLink to="/admin/khach-hang">Khách hàng</NavLink>
        <NavLink to="/admin/lien-he">Liên hệ</NavLink>
        <Link to="/">← Về cửa hàng</Link>
        <button className="btn danger" onClick={logout}>Đăng xuất</button>
      </aside>
      <section><Outlet /></section>
    </div>
  )
}
