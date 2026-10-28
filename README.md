# Cứu Hộ Giao Thông 123

Landing page dịch vụ cứu hộ ô tô tại Hải Phòng. HTML/CSS/JS thuần, chạy bằng nginx (Docker).

Kế hoạch phát triển: xem [PLAN.md](PLAN.md).

## Cấu trúc

| Đường dẫn | Nội dung |
|---|---|
| `index.html` | Trang chủ (nội dung, bảng giá, SEO, JSON-LD) |
| `driver.html`, `js/driver.js` | Trang tài xế phát vị trí GPS (mở từ link Telegram) |
| `track.html`, `js/track.js` | Trang khách theo dõi xe sau khi gửi form |
| `admin.html`, `js/admin.js` | Trang quản trị: bảng giá, logo/banner (đăng nhập Firebase Auth) |
| `js/site-data.js` | Trang chủ lấy bảng giá, logo/banner từ Firestore qua REST (giữ bảng mặc định nếu chưa có) |
| `js/telegram.js` | Form yêu cầu cứu hộ → gửi tới Cloudflare Worker |
| `worker/` | Cloudflare Worker giữ token Telegram (xem `worker/README.md`) |
| `firestore.rules`, `firebase.json` | Rules Cloud Firestore (deploy bằng `firebase deploy --only firestore:rules`) |
| `firebase/` | Rules Storage + hướng dẫn tạo tài khoản admin (`firebase/README.md`) |
| `<dich-vu>/index.html` | 6 trang dịch vụ cho SEO — **sinh bằng** `scripts/build_service_pages.py`, đừng sửa tay |
| `scripts/` | Sinh trang dịch vụ, sitemap; đổi tên miền (`set_domain.py`) |
| `images/` | Ảnh WebP đã nén; ảnh gốc ở `images/goc/` (không đưa lên web) |
| `nginx.conf` | Cấu hình nginx: gzip, cache, header bảo mật, trang 404 |

## Chạy ở máy

```bash
docker compose up -d --build
```

Mở http://localhost:8082. Sửa code xong chạy lại lệnh trên.

Khi sửa CSS/JS, tăng số `?v=` trong thẻ `<link>`/`<script>` của file HTML để trình duyệt khách tải bản mới.

## Sửa nội dung thường gặp

- **Giá, logo, banner:** vào `/admin.html` (cài đặt lần đầu: `firebase/README.md`). Bảng giá mặc định khi chưa nhập giá nằm trong `index.html`.
- **Hotline/Zalo:** tìm `0979032589` và `0979 032 589` trong toàn bộ thư mục, đổi đồng loạt (kể cả `js/telegram.js`, `track.html`, `404.html`, JSON-LD).
- **Nội dung trang dịch vụ:** sửa trong `scripts/build_service_pages.py` rồi chạy `python scripts/build_service_pages.py` và `python scripts/build_sitemap.py`.
- **Tên miền:** chạy `python scripts/set_domain.py https://ten-mien-moi.vn`, rồi chạy lại 2 script trên.

## Liên hệ

- Hotline / Zalo: 0979 032 589
- Địa chỉ: Km92 ngõ An Trì, Hồng Bàng, Hải Phòng
