import { useState } from 'react'
import api from '../../api.js'
import useAdminApi from './useAdminApi.js'

export default function AdminCategories() {
  const { rows, error, run } = useAdminApi('/categories')
  const [form, setForm] = useState(null)

  const save = async (e) => {
    e.preventDefault()
    const ok = await run(() => form.MaDM ? api.put(`/categories/${form.MaDM}`, form) : api.post('/categories', form))
    if (ok) setForm(null)
  }
  const del = (c) => confirm(`Xóa danh mục "${c.TenDM}"?`) && run(() => api.delete(`/categories/${c.MaDM}`))

  return (
    <>
      <h2>Danh mục <button className="btn" onClick={() => setForm({ TenDM: '', MoTa: '' })}>+ Thêm</button></h2>
      {error && <p className="error">{error}</p>}
      {form && (
        <form className="form panel" onSubmit={save}>
          <label>Tên * <input required value={form.TenDM} onChange={(e) => setForm({ ...form, TenDM: e.target.value })} /></label>
          <label>Mô tả <input value={form.MoTa || ''} onChange={(e) => setForm({ ...form, MoTa: e.target.value })} /></label>
          <div className="row"><button className="btn">Lưu</button><button type="button" className="btn alt" onClick={() => setForm(null)}>Hủy</button></div>
        </form>
      )}
      <table>
        <thead><tr><th>Mã</th><th>Tên</th><th>Mô tả</th><th></th></tr></thead>
        <tbody>{rows.map((c) => (
          <tr key={c.MaDM}><td>{c.MaDM}</td><td>{c.TenDM}</td><td>{c.MoTa}</td>
            <td><button className="btn alt" onClick={() => setForm(c)}>Sửa</button> <button className="btn danger" onClick={() => del(c)}>Xóa</button></td></tr>))}
        </tbody>
      </table>
    </>
  )
}
