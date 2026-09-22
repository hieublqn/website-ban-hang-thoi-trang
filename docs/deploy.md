# Triển khai online miễn phí (tùy chọn, không bắt buộc theo đề bài)

Đề bài chỉ yêu cầu nộp link GitHub + link phân tích thiết kế + link báo cáo, **không** yêu cầu web phải online công khai.
Làm phần này nếu bạn muốn web xem được từ mọi thiết bị, mọi nơi, không cần mở máy mình.

```
Người dùng ──> Vercel (frontend, React tĩnh)
                    │  gọi API qua VITE_API_URL
                    ▼
               Render (backend, Express)
                    │  kết nối SSL
                    ▼
             TiDB Cloud Starter (MySQL, free)
```

Cả 3 dịch vụ đều free vĩnh viễn, không cần thẻ. Bạn tự tạo tài khoản (đăng nhập bằng GitHub cho nhanh) — mình chỉ hướng dẫn từng ô cần điền.

## Bước 1 — Tạo CSDL trên TiDB Cloud

1. Vào **https://tidbcloud.com** → Sign up (dùng GitHub).
2. Tạo cluster loại **Starter/Serverless (Free)**. Đặt tên tùy ý, region chọn Singapore (gần VN).
3. Vào cluster vừa tạo → mục **Connect**. Ghi lại 4 thông tin:
   - Host (dạng `gateway01.xxx.prod.aws.tidbcloud.com`)
   - Port: `4000`
   - User (dạng `xxxxxxx.root`)
   - Password (bấm "Generate Password" nếu chưa có)
4. Nạp cấu trúc bảng: trong cluster, mở tab **Chat2Query / SQL Editor** (SQL editor chạy ngay trên web, không cần cài gì) → mở file `database/schema.sql` ở máy bạn, copy toàn bộ nội dung, dán vào ô SQL Editor → **Run**.
   - Nếu editor báo không cho `DROP DATABASE`/`CREATE DATABASE`, xóa 3 dòng đầu (`DROP DATABASE...`, `CREATE DATABASE...`, `USE...`) rồi chạy lại — TiDB Cloud đã tự tạo sẵn 1 database, bạn dùng database mặc định đó, chỉ cần chạy phần `CREATE TABLE` + `INSERT` trở xuống.
5. Kiểm tra: xem có 7 bảng hiện ra ở khung bên trái không.

## Bước 2 — Deploy backend lên Render

1. Vào **https://render.com** → Sign up bằng GitHub → **Authorize** cho Render đọc repo.
2. **New +** → **Web Service** → chọn repo `website-ban-hang-thoi-trang`.
3. Điền:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: **Free**
4. Kéo xuống **Environment Variables**, thêm từng dòng (lấy giá trị từ Bước 1 và từ `backend/.env` của bạn):

   | Key | Value |
   |---|---|
   | `DB_HOST` | host TiDB ở bước 1 |
   | `DB_PORT` | `4000` |
   | `DB_USER` | user TiDB |
   | `DB_PASSWORD` | password TiDB |
   | `DB_NAME` | tên database TiDB (mặc định là `test`) |
   | `DB_SSL` | `true` |
   | `JWT_SECRET` | 1 chuỗi bất kỳ bạn tự đặt |
   | `BANK_ID` | `MB` (hoặc mã ngân hàng của bạn) |
   | `BANK_ACCOUNT_NO` | số tài khoản thật của bạn |
   | `BANK_ACCOUNT_NAME` | tên chủ tài khoản (không dấu, IN HOA) |

5. Bấm **Create Web Service**, đợi build xong (2–5 phút). Copy link dạng `https://website-ban-hang-thoi-trang.onrender.com`.
6. Kiểm tra: mở `<link-đó>/api/test` trên trình duyệt, phải thấy `{"message":"Backend đang chạy ngon lành!"}`.

## Bước 3 — Deploy frontend lên Vercel

1. Vào **https://vercel.com** → Sign up bằng GitHub.
2. **Add New** → **Project** → chọn repo `website-ban-hang-thoi-trang`.
3. Ở màn hình cấu hình:
   - **Root Directory**: bấm Edit, chọn `frontend`
   - Framework Preset: Vercel tự nhận diện **Vite**, giữ mặc định
4. Mở mục **Environment Variables**, thêm:

   | Key | Value |
   |---|---|
   | `VITE_API_URL` | `https://website-ban-hang-thoi-trang.onrender.com/api` (link Render ở Bước 2, nhớ thêm `/api` ở cuối) |

5. Bấm **Deploy**. Xong sẽ có link dạng `https://website-ban-hang-thoi-trang.vercel.app` — **đây là link public**, gửi cho ai cũng xem được, từ 4G hay wifi khác đều được.

## Bước 4 — Kiểm tra lần cuối

- Mở link Vercel bằng **mạng 4G điện thoại** (tắt wifi) để chắc chắn không phải chỉ chạy được trong mạng nhà bạn.
- Lần gọi API đầu tiên có thể **chậm 30–60 giây** — do Render free tier "ngủ" sau 15 phút không ai dùng, cần thời gian "thức dậy". Từ lần thứ 2 sẽ nhanh.
- Test đủ luồng: xem sản phẩm, đặt hàng, xem QR, đăng nhập `/admin`.

## Sau khi deploy

- Mỗi khi bạn sửa code và `git push`, Render và Vercel **tự động build lại** — không cần làm lại các bước trên.
- Muốn đổi biến môi trường (đổi mật khẩu, đổi tài khoản QR...), vào lại dashboard Render/Vercel, mục Environment Variables, sửa rồi bấm "Redeploy" — không cần đụng code.
