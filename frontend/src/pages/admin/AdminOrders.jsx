import { useState } from 'react'
import api, { money } from '../../api.js'
import useAdminApi from './useAdminApi.js'

const STATUS = { moi: 'Mới', dang_giao: 'Đang giao', hoan_thanh: 'Hoàn thành', huy: 'Đã hủy' }

export default function AdminOrders() {
  const { rows, error, run } = useAdminApi('/orders')
  const [detail, setDetail] = useState(null)

  const view = async (id) => { const { data } = await api.get(`/orders/${id}`); setDetail(data) }
  const del = (o) => confirm(`Xóa đơn #${o.MaHD}?`) && run(() => api.delete(`/orders/${o.MaHD}`))
  const update = (o, body) => run(() => api.put(`/orders/${o.MaHD}`, body))

  return (
    <>
      <h2>Đơn hàng</h2>
      {error && <p className="error">{error}</p>}
      {detail && (
        <div className="panel">
          <h3>Đơn #{detail.MaHD} — {detail.HoTen} ({detail.SoDienThoai})</h3>
          <p>Địa chỉ: {detail.DiaChi} {detail.GhiChu && <>· Ghi chú: {detail.GhiChu}</>}</p>
          <ul>{detail.items.map((i) => <li key={i.MaCT}>{i.TenSP} × {i.SoLuong} — {money(i.DonGia * i.SoLuong)}</li>)}</ul>
          <button className="btn alt" onClick={() => setDetail(null)}>Đóng</button>
        </div>
      )}
      <table>
        <thead><tr><th>Mã</th><th>Khách</th><th>Ngày</th><th>Tổng</th><th>Thanh toán</th><th>Trạng thái</th><th></th></tr></thead>
        <tbody>{rows.map((o) => (
          <tr key={o.MaHD}>
            <td>#{o.MaHD}</td><td>{o.HoTen}</td><td>{new Date(o.NgayLap).toLocaleString('vi-VN')}</td><td>{money(o.TongTien)}</td>
            <td>{o.PhuongThucThanhToan}{o.MaThanhToan && ` (${o.MaThanhToan})`}<br />
              {o.TrangThaiThanhToan === 'da_thanh_toan'
                ? <span className="ok">Đã thanh toán</span>
                : <button className="btn" onClick={() => update(o, { TrangThaiThanhToan: 'da_thanh_toan' })}>Xác nhận đã thanh toán</button>}
            </td>
            <td><select value={o.TrangThaiDon} onChange={(e) => update(o, { TrangThaiDon: e.target.value })}>
              {Object.entries(STATUS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select></td>
            <td><button className="btn alt" onClick={() => view(o.MaHD)}>Chi tiết</button> <button className="btn danger" onClick={() => del(o)}>Xóa</button></td>
          </tr>))}
        </tbody>
      </table>
    </>
  )
}
