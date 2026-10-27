# Cài đặt Firebase cho trang quản trị (`admin.html`)

Trang quản trị dùng **Firebase Authentication** (email + mật khẩu). Quyền ghi thật sự do Firebase Rules kiểm tra:
chỉ tài khoản có UID nằm trong `/admins` mới sửa được bảng giá và logo/banner.

## Làm một lần (~10 phút) trên https://console.firebase.google.com → project `cuuhogiaothong123`

1. **Authentication → Sign-in method** → bật **Email/Password**.
2. **Authentication → Settings → User actions** → bỏ chọn **Enable create (sign-up)** để người lạ không tự tạo tài khoản.
3. **Authentication → Settings → Authorized domains** → thêm tên miền web (vd `zdogggg.github.io`, sau này là tên miền riêng). `localhost` có sẵn.
4. **Authentication → Users → Add user** → nhập email + mật khẩu mạnh cho admin. Copy cột **User UID**.
5. **Realtime Database → Data** → tại gốc bấm **+**, thêm:
   - Key: `admins` → bấm + bên trong → Key: *UID vừa copy*, Value: `true` (kiểu boolean).
6. **Realtime Database → Rules** → dán toàn bộ `database.rules.json` → **Publish**.
7. **Storage → Rules** → dán `storage.rules`, thay `ADMIN_UID` bằng UID ở bước 4 → **Publish**.

Muốn thêm người quản trị: lặp lại bước 4–5 (và thêm UID vào danh sách trong `storage.rules`).

## Kiểm tra

- Mở `/admin.html` → đăng nhập → thêm 1 dòng giá → mở trang chủ thấy bảng giá mới.
- Đăng nhập bằng tài khoản không có trong `/admins` → bị báo "chưa được cấp quyền".
- Chưa có dòng giá nào trong admin → trang chủ hiện bảng giá mặc định trong `index.html`.
