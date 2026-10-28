# Hướng dẫn thiết lập Firebase (Firestore & Authentication) cho Cứu Hộ Giao Thông 123

Dự án hiện đã được chuyển đổi sang sử dụng **Cloud Firestore** và **Firebase Authentication (Email/Password)**.

- **Firebase Project ID**: `cuuhogiaothong123`
- **Firebase Web App ID**: `1:1069997605416:web:9e9a43fff4ecb65080eb1d`

---

## 1. Thiết lập Firebase Authentication (Email / Password)

1. Truy cập [Firebase Console](https://console.firebase.google.com/project/cuuhogiaothong123/authentication/providers).
2. Tại mục **Sign-in method**, bấm vào **Email/Password** và chọn **Enable** (Bật) rồi bấm **Save**.
3. (Khuyến nghị bảo mật) Vào tab **Settings** → **User actions**: Bỏ chọn **Enable create (sign-up)** để tránh người ngoài tự đăng ký tài khoản.
4. Tại tab **Users** → Bấm **Add user**:
   - Nhập email quản trị (ví dụ: `admin@cuuhogiaothong123.com`) và mật khẩu mạnh.
   - Sau khi tạo xong, copy chuỗi **User UID** của tài khoản này.

---

## 2. Thiết lập Cloud Firestore Database

1. Truy cập [Firestore Database Console](https://console.firebase.google.com/project/cuuhogiaothong123/firestore).
2. Nếu chưa tạo database:
   - Bấm **Create database**.
   - Chọn database ID: `(default)`.
   - Chọn vị trí (Location): `asia-southeast1` (Singapore) hoặc `asia-east1` (gần Việt Nam nhất).
   - Chọn chế độ bảo mật ban đầu (Start in production mode).
3. **Cấp quyền Admin cho tài khoản:**
   - Tại tab **Data**, bấm **Start collection**:
     - Collection ID: `admins`
     - Document ID: Dán **User UID** vừa copy ở bước 1 vào đây.
     - Field: Thêm field `role` = `admin` hoặc `active` = `true` (kiểu string hoặc boolean). Bấm **Save**.
4. **Cài đặt Security Rules:**
   - Tại tab **Rules**, dán nội dung từ file [firestore.rules](../firestore.rules) vào và bấm **Publish**.
   - Hoặc triển khai trực tiếp từ terminal:
     ```bash
     npx -y firebase-tools@latest deploy --only firestore:rules
     ```

---

## 3. Cấu hình Firebase Storage (Tải ảnh Logo / Banner)

1. Truy cập [Firebase Storage](https://console.firebase.google.com/project/cuuhogiaothong123/storage).
2. Vào tab **Rules**, dán nội dung file `firebase/storage.rules`, thay thế `ADMIN_UID` bằng User UID của bạn rồi bấm **Publish**.

---

## 4. Kiểm tra hoạt động

1. Mở trang quản trị: `http://localhost:8082/admin.html`
2. Nhập Email và Mật khẩu vừa tạo để đăng nhập.
3. Khi đăng nhập thành công:
   - Thêm / Sửa / Xóa dịch vụ tại tab **Bảng Giá** -> Bấm lưu -> Mở trang chủ `http://localhost:8082/index.html` để thấy bảng giá cập nhật tức thì từ Firestore.
   - Cập nhật Logo / Banner tại tab **Cấu Hình Web** -> Dữ liệu lưu vào document `settings/general` trong Firestore.
4. Trang tài xế (`driver.html?id=CH12345678`) và theo dõi lộ trình (`track.html?id=CH12345678`) sẽ phát và đồng bộ tọa độ GPS trực tiếp vào collection `trackings` trên Firestore.
