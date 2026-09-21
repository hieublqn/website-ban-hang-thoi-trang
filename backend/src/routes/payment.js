const router = require('express').Router();
const db = require('../db');

// Mức 2: webhook SePay. Khai báo URL https://<domain>/api/payment/sepay-webhook trong SePay
// (dùng ngrok/cloudflared khi chạy local). SePay gửi header "Authorization: Apikey <WEBHOOK_API_KEY>".
router.post('/sepay-webhook', async (req, res) => {
  const key = process.env.WEBHOOK_API_KEY;
  if (key && req.headers.authorization !== `Apikey ${key}`) return res.status(401).json({ success: false });

  const { content = '', transferAmount, transferType } = req.body;
  if (transferType && transferType !== 'in') return res.json({ success: true });

  const m = /DH(\d+)/i.exec(content);
  if (!m) return res.json({ success: true, note: 'Không có mã đơn' });

  const [[hd]] = await db.query('SELECT MaHD, TongTien FROM HoaDon WHERE MaHD = ?', [m[1]]);
  if (hd && Number(transferAmount) >= Number(hd.TongTien)) {
    await db.query("UPDATE HoaDon SET TrangThaiThanhToan = 'da_thanh_toan' WHERE MaHD = ?", [hd.MaHD]);
  }
  res.json({ success: true });
});

module.exports = router;
