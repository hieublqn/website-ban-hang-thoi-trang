import { useState } from 'react'
import api from '../../api.js'
import useAdminApi from './useAdminApi.js'

export default function AdminCustomers() {
  const { rows, error, run } = useAdminApi('/customers')
  const [form, setForm] = useState(null)
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  const save = async (e) => {
    e.preventDefault()
    if (await run(() => api.put(`/customers/${form.MaKH}`, form))) setForm(null)
  }
  const del = (c) => confirm(`Xóa khách hàng "${c.HoTen}"?`) && run(() => api.delete(`/customers/${c.MaKH}`))

  return (
    <>
      <h2>Khách hàng</h2>
      {error && <p className="error">{error}</p>}
      {form && (
        <form className="form panel" onSubmit={save}>
          <label>Họ tên * <input required value={form.HoTen} onChange={set('HoTen')} /></label>
          <label>SĐT * <input required value={form.SoDienThoai} onChange={set('SoDienThoai')} /></label>
          <label>Email <input value={form.Email || ''} onChange={set('Email')} /></label>
          <label>Địa chỉ * <input required value={form.DiaChi} onChange={set('DiaChi')} /></label>
          <div className="row"><button className="btn">Lưu</button><button type="button" className="btn alt" onClick={() => setForm(null)}>Hủy</button></div>
        </form>
      )}
      <table>
        <thead><tr><th>Mã</th><th>Họ tên</th><th>SĐT</th><th>Email</th><th>Địa chỉ</th><th></th></tr></thead>
        <tbody>{rows.map((c) => (
          <tr key={c.MaKH}><td>{c.MaKH}</td><td>{c.HoTen}</td><td>{c.SoDienThoai}</td><td>{c.Email}</td><td>{c.DiaChi}</td>
            <td><button className="btn alt" onClick={() => setForm(c)}>Sửa</button> <button className="btn danger" onClick={() => del(c)}>Xóa</button></td></tr>))}
        </tbody>
      </table>
    </>
  )
}
