import { useEffect, useState } from 'react'
import api, { money } from '../../api.js'
import useAdminApi from './useAdminApi.js'

const empty = { MaDM: '', TenSP: '', MoTa: '', Gia: '', SoLuongTon: '', HinhAnh: '' }

export default function AdminProducts() {
  const { rows, error, run } = useAdminApi('/products')
  const [cats, setCats] = useState([])
  const [form, setForm] = useState(null) // null = đóng, object = đang thêm/sửa
  useEffect(() => { api.get('/categories').then((r) => setCats(r.data)) }, [])

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  const save = async (e) => {
    e.preventDefault()
    const ok = await run(() => form.MaSP ? api.put(`/products/${form.MaSP}`, form) : api.post('/products', form))
    if (ok) setForm(null)
  }
  const del = (p) => confirm(`Xóa "${p.TenSP}"?`) && run(() => api.delete(`/products/${p.MaSP}`))

  return (
    <>
      <h2>Sản phẩm <button className="btn" onClick={() => setForm({ ...empty, MaDM: cats[0]?.MaDM || '' })}>+ Thêm</button></h2>
      {error && <p className="error">{error}</p>}
      {form && (
        <form className="form panel" onSubmit={save}>
          <label>Tên * <input required value={form.TenSP} onChange={set('TenSP')} /></label>
          <label>Danh mục * <select required value={form.MaDM} onChange={set('MaDM')}>
            {cats.map((c) => <option key={c.MaDM} value={c.MaDM}>{c.TenDM}</option>)}
          </select></label>
          <label>Giá (₫) * <input required type="number" min="0" value={form.Gia} onChange={set('Gia')} /></label>
          <label>Tồn kho * <input required type="number" min="0" value={form.SoLuongTon} onChange={set('SoLuongTon')} /></label>
          <label>Link hình ảnh <input value={form.HinhAnh || ''} onChange={set('HinhAnh')} /></label>
          <label>Mô tả <textarea value={form.MoTa || ''} onChange={set('MoTa')} /></label>
          <div className="row"><button className="btn">Lưu</button><button type="button" className="btn alt" onClick={() => setForm(null)}>Hủy</button></div>
        </form>
      )}
      <table>
        <thead><tr><th>Mã</th><th>Tên</th><th>Danh mục</th><th>Giá</th><th>Tồn</th><th></th></tr></thead>
        <tbody>{rows.map((p) => (
          <tr key={p.MaSP}>
            <td>{p.MaSP}</td><td>{p.TenSP}</td><td>{p.TenDM}</td><td>{money(p.Gia)}</td><td>{p.SoLuongTon}</td>
            <td><button className="btn alt" onClick={() => setForm(p)}>Sửa</button> <button className="btn danger" onClick={() => del(p)}>Xóa</button></td>
          </tr>))}
        </tbody>
      </table>
    </>
  )
}
