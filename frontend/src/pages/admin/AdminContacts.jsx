import api from '../../api.js'
import useAdminApi from './useAdminApi.js'

export default function AdminContacts() {
  const { rows, error, run } = useAdminApi('/contacts')
  const del = (c) => confirm('Xóa liên hệ này?') && run(() => api.delete(`/contacts/${c.MaLH}`))

  return (
    <>
      <h2>Liên hệ từ khách</h2>
      {error && <p className="error">{error}</p>}
      <table>
        <thead><tr><th>Ngày</th><th>Họ tên</th><th>Email</th><th>Nội dung</th><th>Đã xử lý</th><th></th></tr></thead>
        <tbody>{rows.map((c) => (
          <tr key={c.MaLH}>
            <td>{new Date(c.NgayGui).toLocaleString('vi-VN')}</td><td>{c.HoTen}</td><td>{c.Email}</td><td>{c.NoiDung}</td>
            <td><input type="checkbox" checked={!!c.DaXuLy} onChange={(e) => run(() => api.put(`/contacts/${c.MaLH}`, { DaXuLy: e.target.checked }))} /></td>
            <td><button className="btn danger" onClick={() => del(c)}>Xóa</button></td>
          </tr>))}
        </tbody>
      </table>
    </>
  )
}
