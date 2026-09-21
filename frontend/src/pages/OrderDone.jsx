import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import api, { money } from '../api.js'

export default function OrderDone() {
  const order = useLocation().state
  const [paid, setPaid] = useState(false)

  // Với đơn QR: hỏi server mỗi 5 giây xem đã được xác nhận thanh toán chưa
  useEffect(() => {
    if (!order?.qrUrl) return
    const t = setInterval(async () => {
      try {
        const { data } = await api.get(`/orders/${order.MaHD}/status`)
        if (data.TrangThaiThanhToan === 'da_thanh_toan') { setPaid(true); clearInterval(t) }
      } catch { /* bỏ qua, thử lại lần sau */ }
    }, 5000)
    return () => clearInterval(t)
  }, [order])

  if (!order) return <p>Không có thông tin đơn hàng. <Link to="/">Về trang chủ</Link></p>

  return (
    <div className="done">
      <h2>Đặt hàng thành công 🎉</h2>
      <p>Mã đơn: <b>#{order.MaHD}</b> — Tổng tiền: <b>{money(order.TongTien)}</b></p>
      {order.qrUrl ? (
        paid ? <p className="ok">✅ Đã nhận thanh toán. Cảm ơn bạn!</p> : (
          <>
            <p>Quét mã bằng app ngân hàng bất kỳ để chuyển khoản. <b>Giữ nguyên nội dung: {order.MaThanhToan}</b></p>
            <img className="qr" src={order.qrUrl} alt="Mã QR thanh toán" />
            <p><small>Cửa hàng sẽ xác nhận sau khi nhận được tiền.</small></p>
          </>
        )
      ) : <p>Bạn sẽ thanh toán khi nhận hàng.</p>}
      <Link className="btn" to="/">Tiếp tục mua sắm</Link>
    </div>
  )
}
