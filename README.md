# Website bán hàng thời trang (Đồ án phần mềm Web — HUBT)

React (Vite) + Node.js/Express + MySQL. Thanh toán COD hoặc quét mã QR VietQR.

## Chạy project

1. Cài XAMPP, bật **MySQL** (và Apache nếu muốn dùng phpMyAdmin).
2. Nạp CSDL: vào `http://localhost/phpmyadmin` → tab **Import** → chọn `database/schema.sql`.
   (hoặc `mysql -u root < database/schema.sql`)
3. Backend:
   ```bash
   cd backend
   npm install
   npm run dev
   ```
   Sửa `backend/.env`: điền `BANK_ID`, `BANK_ACCOUNT_NO`, `BANK_ACCOUNT_NAME` là tài khoản nhận tiền của bạn.
   Kiểm tra: mở http://localhost:5000/api/test
4. Frontend (cửa sổ terminal khác):
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   Mở http://localhost:5173

Trang quản trị: http://localhost:5173/admin — tài khoản `admin` / `admin123` (nên đổi khi nộp/deploy).

## Cấu trúc

- `database/schema.sql` — 7 bảng + dữ liệu mẫu
- `backend/` — API Express (`server.js`, `src/routes/*`)
- `frontend/` — giao diện React
- `docs/phan-tich-thiet-ke.md` — Use Case, ERD, luồng QR, danh sách API
- `docs/bao-cao-dan-bai.md` — dàn ý báo cáo 3 chương
- `docs/deploy.md` — triển khai online miễn phí (Vercel + Render + TiDB Cloud), tùy chọn

## Thanh toán QR mức 2 (tự xác nhận)

Đăng ký SePay (có sandbox), khai báo webhook `https://<domain>/api/payment/sepay-webhook`
(chạy local thì dùng ngrok/cloudflared), đặt cùng một chuỗi vào `WEBHOOK_API_KEY` và trong SePay.

## Triển khai online (xem từ mọi thiết bị, mọi nơi)

Không bắt buộc theo đề bài. Xem hướng dẫn đầy đủ ở [docs/deploy.md](docs/deploy.md)
(Vercel cho frontend + Render cho backend + TiDB Cloud cho MySQL, tất cả đều free).
