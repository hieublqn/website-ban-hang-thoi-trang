const router = require('express').Router();
const db = require('../db');
const { requireAdmin } = require('../auth');

const DAY = 24 * 3600 * 1000;
const VN_OFFSET = 7 * 3600 * 1000;
// Ngày dạng yyyy-mm-dd theo giờ Việt Nam (máy chủ cloud chạy giờ UTC nên không dùng ngày UTC được)
const vnDay = (t) => new Date(new Date(t).getTime() + VN_OFFSET).toISOString().slice(0, 10);
const STATUSES = ['moi', 'dang_giao', 'hoan_thanh', 'huy'];

// Thống kê cho trang tổng quan của admin. "Doanh thu" = tổng tiền các đơn chưa bị hủy.
router.get('/', requireAdmin, async (req, res) => {
  const since = new Date(Date.now() - 8 * DAY); // lấy dư 1 ngày rồi lọc lại theo ngày VN bên dưới

  const [
    [[kh]], [[sp]], [[lh]],
    [statusRows],
    [[paid]],
    [recentRows],
    [topProducts],
    [lowStock],
    [recent],
  ] = await Promise.all([
    db.query('SELECT COUNT(*) AS n FROM KhachHang'),
    db.query('SELECT COUNT(*) AS n FROM SanPham'),
    db.query('SELECT COUNT(*) AS n FROM LienHe WHERE DaXuLy = 0'),
    db.query('SELECT TrangThaiDon AS st, COUNT(*) AS n, COALESCE(SUM(TongTien), 0) AS tong FROM HoaDon GROUP BY TrangThaiDon'),
    db.query("SELECT COALESCE(SUM(TongTien), 0) AS tong FROM HoaDon WHERE TrangThaiDon <> 'huy' AND TrangThaiThanhToan = 'da_thanh_toan'"),
    db.query("SELECT NgayLap, TongTien FROM HoaDon WHERE TrangThaiDon <> 'huy' AND NgayLap >= ?", [since]),
    db.query(
      `SELECT sp.MaSP, sp.TenSP, SUM(ct.SoLuong) AS daBan
       FROM ChiTietHoaDon ct JOIN HoaDon hd ON hd.MaHD = ct.MaHD JOIN SanPham sp ON sp.MaSP = ct.MaSP
       WHERE hd.TrangThaiDon <> 'huy' GROUP BY sp.MaSP, sp.TenSP ORDER BY daBan DESC, sp.MaSP LIMIT 5`),
    db.query('SELECT MaSP, TenSP, SoLuongTon FROM SanPham ORDER BY SoLuongTon ASC, MaSP LIMIT 5'),
    db.query(
      `SELECT hd.MaHD, hd.NgayLap, hd.TongTien, hd.TrangThaiDon, kh.HoTen
       FROM HoaDon hd JOIN KhachHang kh ON kh.MaKH = hd.MaKH ORDER BY hd.MaHD DESC LIMIT 5`),
  ]);

  const byStatus = STATUSES.map((st) => {
    const r = statusRows.find((x) => x.st === st);
    return { status: st, n: r ? Number(r.n) : 0, tong: r ? Number(r.tong) : 0 };
  });
  const active = byStatus.filter((s) => s.status !== 'huy');

  // 7 ngày gần nhất (kể cả ngày không có đơn để biểu đồ liền mạch)
  const days = Array.from({ length: 7 }, (_, i) => vnDay(Date.now() - (6 - i) * DAY));
  const daily = days.map((date) => ({ date, label: `${date.slice(8, 10)}/${date.slice(5, 7)}`, revenue: 0, orders: 0 }));
  for (const o of recentRows) {
    const d = daily.find((x) => x.date === vnDay(o.NgayLap));
    if (d) { d.revenue += Number(o.TongTien); d.orders += 1; }
  }

  res.json({
    totals: {
      orders: active.reduce((s, x) => s + x.n, 0),
      revenue: active.reduce((s, x) => s + x.tong, 0),
      paid: Number(paid.tong),
      customers: Number(kh.n),
      products: Number(sp.n),
      newContacts: Number(lh.n),
    },
    byStatus,
    daily,
    topProducts: topProducts.map((p) => ({ MaSP: p.MaSP, TenSP: p.TenSP, daBan: Number(p.daBan) })),
    lowStock,
    recent,
  });
});

module.exports = router;
