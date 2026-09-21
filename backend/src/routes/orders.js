const router = require('express').Router();
const db = require('../db');
const { requireAdmin } = require('../auth');
const { qrUrl } = require('../vietqr');

// Khách đặt hàng. body: { customer:{HoTen,Email,SoDienThoai,DiaChi}, items:[{MaSP,SoLuong}], paymentMethod:'COD'|'QR', note }
router.post('/', async (req, res) => {
  const { customer, items, paymentMethod = 'COD', note } = req.body;
  if (!customer?.HoTen || !customer?.SoDienThoai || !customer?.DiaChi) {
    return res.status(400).json({ error: 'Vui lòng điền họ tên, số điện thoại, địa chỉ' });
  }
  if (!Array.isArray(items) || !items.length) return res.status(400).json({ error: 'Giỏ hàng trống' });
  if (!['COD', 'QR'].includes(paymentMethod)) return res.status(400).json({ error: 'Phương thức thanh toán không hợp lệ' });

  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    // Giá và tồn kho luôn lấy từ CSDL, không tin dữ liệu từ client
    let total = 0;
    const lines = [];
    for (const it of items) {
      const qty = parseInt(it.SoLuong, 10);
      if (!(qty > 0)) throw Object.assign(new Error('Số lượng không hợp lệ'), { status: 400 });
      const [[sp]] = await conn.query('SELECT MaSP, TenSP, Gia, SoLuongTon FROM SanPham WHERE MaSP = ? FOR UPDATE', [it.MaSP]);
      if (!sp) throw Object.assign(new Error('Sản phẩm không tồn tại'), { status: 400 });
      if (sp.SoLuongTon < qty) throw Object.assign(new Error(`"${sp.TenSP}" chỉ còn ${sp.SoLuongTon} sản phẩm`), { status: 400 });
      total += Number(sp.Gia) * qty;
      lines.push({ MaSP: sp.MaSP, qty, price: sp.Gia });
    }

    const [kh] = await conn.query('INSERT INTO KhachHang (HoTen, Email, SoDienThoai, DiaChi) VALUES (?,?,?,?)',
      [customer.HoTen, customer.Email || null, customer.SoDienThoai, customer.DiaChi]);
    const [hd] = await conn.query(
      'INSERT INTO HoaDon (MaKH, TongTien, PhuongThucThanhToan, GhiChu) VALUES (?,?,?,?)',
      [kh.insertId, total, paymentMethod, note || null]);
    const orderId = hd.insertId;
    const payCode = `DH${orderId}`;
    if (paymentMethod === 'QR') await conn.query('UPDATE HoaDon SET MaThanhToan = ? WHERE MaHD = ?', [payCode, orderId]);

    for (const l of lines) {
      await conn.query('INSERT INTO ChiTietHoaDon (MaHD, MaSP, SoLuong, DonGia) VALUES (?,?,?,?)', [orderId, l.MaSP, l.qty, l.price]);
      await conn.query('UPDATE SanPham SET SoLuongTon = SoLuongTon - ? WHERE MaSP = ?', [l.qty, l.MaSP]);
    }
    await conn.commit();

    res.status(201).json({
      MaHD: orderId, TongTien: total, paymentMethod,
      qrUrl: paymentMethod === 'QR' ? qrUrl(total, payCode) : null,
      MaThanhToan: paymentMethod === 'QR' ? payCode : null,
    });
  } catch (e) {
    await conn.rollback();
    res.status(e.status || 500).json({ error: e.status ? e.message : 'Lỗi máy chủ khi đặt hàng' });
    if (!e.status) console.error(e);
  } finally {
    conn.release();
  }
});

// Trang QR của khách gọi định kỳ để biết đơn đã được thanh toán chưa
router.get('/:id/status', async (req, res) => {
  const [rows] = await db.query('SELECT MaHD, TrangThaiThanhToan, TrangThaiDon FROM HoaDon WHERE MaHD = ?', [req.params.id]);
  if (!rows.length) return res.status(404).json({ error: 'Không tìm thấy đơn' });
  res.json(rows[0]);
});

// ===== Admin =====
router.get('/', requireAdmin, async (req, res) => {
  const [rows] = await db.query(
    `SELECT hd.*, kh.HoTen, kh.SoDienThoai, kh.DiaChi FROM HoaDon hd JOIN KhachHang kh ON kh.MaKH = hd.MaKH ORDER BY hd.MaHD DESC`);
  res.json(rows);
});

router.get('/:id', requireAdmin, async (req, res) => {
  const [[hd]] = await db.query(
    `SELECT hd.*, kh.HoTen, kh.Email, kh.SoDienThoai, kh.DiaChi FROM HoaDon hd JOIN KhachHang kh ON kh.MaKH = hd.MaKH WHERE hd.MaHD = ?`, [req.params.id]);
  if (!hd) return res.status(404).json({ error: 'Không tìm thấy đơn' });
  const [items] = await db.query(
    `SELECT ct.*, sp.TenSP FROM ChiTietHoaDon ct JOIN SanPham sp ON sp.MaSP = ct.MaSP WHERE ct.MaHD = ?`, [req.params.id]);
  res.json({ ...hd, items });
});

// Admin xác nhận thanh toán (Mức 1) / đổi trạng thái đơn
router.put('/:id', requireAdmin, async (req, res) => {
  const { TrangThaiDon, TrangThaiThanhToan } = req.body;
  const sets = [];
  const params = [];
  if (['moi', 'dang_giao', 'hoan_thanh', 'huy'].includes(TrangThaiDon)) { sets.push('TrangThaiDon = ?'); params.push(TrangThaiDon); }
  if (['chua_thanh_toan', 'da_thanh_toan'].includes(TrangThaiThanhToan)) { sets.push('TrangThaiThanhToan = ?'); params.push(TrangThaiThanhToan); }
  if (!sets.length) return res.status(400).json({ error: 'Không có gì để cập nhật' });
  await db.query(`UPDATE HoaDon SET ${sets.join(', ')} WHERE MaHD = ?`, [...params, req.params.id]);
  res.json({ ok: true });
});

router.delete('/:id', requireAdmin, async (req, res) => {
  await db.query('DELETE FROM HoaDon WHERE MaHD = ?', [req.params.id]); // ChiTietHoaDon xóa theo (CASCADE)
  res.json({ ok: true });
});

module.exports = router;
