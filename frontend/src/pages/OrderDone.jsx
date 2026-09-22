import { useEffect, useState } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import api, { errMsg, money } from '../api.js'
import { findRecentOrder, saveRecentOrder } from '../orderStore.js'

export default function OrderDone() {
  const { id } = useParams()
  const stateOrder = useLocation().state
  const [order, setOrder] = useState(stateOrder || null)
  const [paid, setPaid] = useState(false)
  const [phone, setPhone] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const lookup = async (sdt, silent) => {
    if (!silent) { setBusy(true); setError('') }
    try {
      const { data } = await api.post('/orders/lookup', { MaHD: id, SoDienThoai: sdt })
      setOrder(data)
      setPaid(data.TrangThaiThanhToan === 'da_thanh_toan')
      saveRecentOrder({ MaHD: id, SoDienThoai: sdt })
    } catch (e) {
      if (!silent) setError(errMsg(e))
    } finally {
      setBusy(false)
    }
  }

  // Mất state điều hướng (F5, mở lại link cũ...) -> thử tự tra cứu bằng SĐT đã lưu trên máy này
  useEffect(() => {
    if (stateOrder) return
    const remembered = findRecentOrder(id)
    if (remembered) lookup(remembered.SoDienThoai, true)
  }, [id]) // eslint-disable-line react-hooks/exhaustive-deps

  // Đơn QR chưa thanh toán: hỏi lại server mỗi 5 giây
  useEffect(() => {
    if (!order?.qrUrl || paid) return
    const t = setInterval(async () => {
      try {
        const { data } = await api.get(`/orders/${id}/status`)
        if (data.TrangThaiThanhToan === 'da_thanh_toan') { setPaid(true); clearInterval(t) }
      } catch { /* bỏ qua, thử lại lần sau */ }
    }, 5000)
    return () => clearInterval(t)
  }, [order, paid, id])

  if (!order) {
    return (
      <div className="done">
        <h2>Xem lại đơn hàng #{id}</h2>
        <p>Trang này đã mất thông tin tạm (do tải lại trang hoặc mở link sau một thời gian).<br />
          Nhập số điện thoại lúc đặt hàng để xem lại trạng thái và mã QR.</p>
        <form className="form form-center" onSubmit={(e) => { e.preventDefault(); lookup(phone) }}>
          <label>Số điện thoại <input required value={phone} onChange={(e) => setPhone(e.target.value)} /></label>
          {error && <p className="error">{error}</p>}
          <button className="btn" disabled={busy}>{busy ? 'Đang tìm...' : 'Xem đơn hàng'}</button>
        </form>
      </div>
    )
  }

  return (
    <div className="done">
      <h2>Đặt hàng thành công 🎉</h2>
      <p>Mã đơn: <b>#{order.MaHD}</b> — Tổng tiền: <b>{money(order.TongTien)}</b></p>
      {order.qrUrl ? (
        paid ? <p className="ok">✅ Đã nhận thanh toán. Cảm ơn bạn!</p> : (
          <>
            <p>Quét mã bằng app ngân hàng bất kỳ để chuyển khoản. <b>Giữ nguyên nội dung: {order.MaThanhToan}</b></p>
            <img className="qr" src={order.qrUrl} alt="Mã QR thanh toán" />
            <p><small>Cửa hàng sẽ xác nhận sau khi nhận được tiền. Yên tâm tắt trang này — quay lại bằng link cũ
              hoặc trang "Tra cứu đơn hàng" để xem lại QR bất cứ lúc nào.</small></p>
          </>
        )
      ) : <p>Bạn sẽ thanh toán khi nhận hàng.</p>}
      <Link className="btn" to="/">Tiếp tục mua sắm</Link>
    </div>
  )
}
