# PLAN.md — Website Cứu Hộ Giao Thông 123 (bản gọn)

> **Mục tiêu duy nhất:** Khách ở Hải Phòng đang gặp sự cố **tìm thấy mình trên Google/Google Maps** và **gọi được trong 1 chạm**.
>
> **Stack:** Giữ nguyên HTML + CSS + JS thuần, chạy bằng nginx (Docker). Không cần framework, không cần database.
>
> Bản kế hoạch chi tiết cũ (Nuxt + Laravel) được lưu ở `PLAN-ban-cu.md` để tham khảo.

---

## 0. Cần chủ website xác nhận trước (điền vào đây)

| Thông tin | Giá trị | Đã xác nhận |
|---|---|---|
| Hotline chính | 0979 032 589 | ☐ |
| Zalo | 0979 032 589 | ☐ |
| Tên doanh nghiệp hiển thị | Cứu Hộ Giao Thông 123 | ☐ |
| Địa chỉ (nếu công khai) | Km92 ngõ An Trì, Hồng Bàng, Hải Phòng | ☐ |
| Có trực 24/7 thật không? | NEED_CONFIRMATION | ☐ |
| Thời gian đến nơi trung bình (nếu muốn ghi) | NEED_CONFIRMATION | ☐ |
| Khu vực phục vụ thực tế | NEED_CONFIRMATION | ☐ |
| Dịch vụ thực sự làm | Kéo xe, kích bình, thay lốp, tiếp nhiên liệu, sửa chữa lưu động, cứu hộ xe tải | ☐ |
| Tên miền muốn dùng | NEED_CONFIRMATION | ☐ |
| Tài xế có đang dùng trang `driver.html` / `track.html` không? | NEED_CONFIRMATION | ☐ |
| Đánh giá khách hàng trên trang có phải khách thật không? | NEED_CONFIRMATION | ☐ |

**Quy tắc:** chưa xác nhận thì không ghi lên web. Hotline phải giống hệt nhau ở web, Google Maps, Zalo, Facebook (hiện README còn ghi `0989 123 123` → sửa).

---

## Giai đoạn 1 — Vá bảo mật (làm ngay, ~1 buổi)

Repo GitHub đang public nên mấy thứ dưới đây ai cũng đọc được.

- [ ] **Thu hồi token Telegram cũ** trong @BotFather (`/revoke`), tạo token mới. *(Chủ bot tự làm.)*
- [ ] Không để token trong code trình duyệt nữa → chuyển việc gửi Telegram sang **1 hàm serverless nhỏ** (Cloudflare Worker, miễn phí). Web chỉ gọi tới Worker; Worker giữ token và chặn spam.
- [ ] **Bỏ trang admin** (`admin.html`, `js/admin.js`) — mật khẩu `admin123` đang nằm trong code. Giá/tin tức sửa thẳng trong HTML (xem Giai đoạn 3).
- [ ] **Khoá Firebase Rules**: không để `read, write: if true`. Nếu còn dùng tracking thì chỉ cho ghi đúng nhánh `trackings/`; nếu bỏ tracking thì tắt hẳn Firebase.
- [ ] Không đưa số điện thoại khách và toạ độ lên URL (`track.html?phone=...&lat=...`). Dùng mã cuốc là đủ.
- [ ] Sửa README đúng hotline.

**Xong khi:** trong repo không còn token, mật khẩu; Firebase không ghi tự do được.

---

## Giai đoạn 2 — Được tìm thấy trên Google Maps (quan trọng nhất)

Phần lớn khách cứu hộ gọi thẳng từ Google Maps khi tìm "cứu hộ ô tô gần đây".

- [ ] Tạo/xác minh **Google Business Profile**.
  - Tên đúng tên thật (không nhồi từ khoá kiểu "Cứu hộ giá rẻ nhất HP").
  - Danh mục chính: *Dịch vụ kéo xe* / *Dịch vụ cứu hộ xe* (chọn danh mục sát nhất).
  - Khu vực phục vụ: các quận/huyện Hải Phòng thực sự đi.
  - Giờ mở cửa đúng thực tế.
  - Hotline + link website.
  - 10–20 ảnh thật: xe, đội, hiện trường (không dùng ảnh mạng).
- [ ] **Xin đánh giá thật**: sau mỗi cuốc, gửi khách link đánh giá qua Zalo. Đây là yếu tố mạnh nhất để lên top Maps.
- [ ] Trả lời mọi đánh giá lịch sự.
- [ ] Đăng 1 bài/tuần trên hồ sơ Google (ảnh cuốc mới, mẹo an toàn).
- [ ] Đồng bộ thông tin trên Facebook Page, Zalo OA, các danh bạ (Cốc Cốc Map, trang vàng…) — **cùng tên, cùng số**.

**Xong khi:** hồ sơ được xác minh, có ảnh, có link web, bắt đầu có review.

---

## Giai đoạn 3 — Làm lại trang chủ cho nhanh & chuẩn SEO

### 3.1. Tốc độ (khách đang đứng giữa đường dùng 4G)
- [ ] Nén ảnh: `logo.png` (1.7MB), `logovang.png` (1.8MB), `bannerngang.png` (2.7MB) → WebP, mục tiêu < 200KB mỗi ảnh. Ảnh gallery cũng chuyển WebP.
- [ ] Thêm `width`/`height` cho ảnh; `loading="lazy"` cho ảnh phía dưới (không lazy ảnh banner đầu trang).
- [ ] Bỏ thư viện không cần: Firebase (nếu bỏ tracking), SweetAlert (thay bằng thông báo đơn giản).
- [ ] Mục tiêu: PageSpeed Insights mobile ≥ 85.

### 3.2. Nội dung có trong HTML (để Google đọc được)
- [ ] Bảng giá và tin tức đang tải từ Firebase sau khi mở trang → **ghi thẳng vào HTML**. Đổi giá thì sửa file và deploy lại (vài phút).
- [ ] Bỏ phần "Tin tức" nếu không có ai viết đều; thay bằng 3–5 bài hướng dẫn cố định (Giai đoạn 4).

### 3.3. SEO cơ bản trên trang
- [ ] `<title>`: `Cứu Hộ Ô Tô Hải Phòng – Gọi 0979 032 589 | Cứu Hộ Giao Thông 123` (bỏ chữ "Vàng Đỏ").
- [ ] Meta description viết cho người đọc: dịch vụ gì, ở đâu, gọi số nào.
- [ ] Một `<h1>` duy nhất, có "cứu hộ ô tô Hải Phòng" một cách tự nhiên.
- [ ] Sửa toàn bộ `href="#"` (khoảng 15 chỗ) thành link thật hoặc bỏ.
- [ ] Alt text cho ảnh mô tả đúng ảnh.
- [ ] Thêm JSON-LD `LocalBusiness` (tên, số, khu vực, giờ — khớp Google Business Profile). **Không thêm rating giả.**
- [ ] Thêm `robots.txt`, `sitemap.xml`, favicon, thẻ Open Graph (để share Zalo/Facebook có ảnh đẹp).

### 3.4. Gọi & nhắn trong 1 chạm
- [ ] Thanh cố định đáy màn hình mobile: **[📞 Gọi ngay] [💬 Zalo]** — to, tương phản cao, không che nội dung.
- [ ] Hotline nằm trong màn hình đầu tiên (đã có — giữ).
- [ ] Form yêu cầu: chỉ hỏi **SĐT + vị trí (nút "Lấy vị trí của tôi") + loại sự cố**. Ghi rõ: "Cần gấp? Gọi ngay sẽ nhanh hơn".
- [ ] Sau khi gửi form: hiển thị "Đã nhận, sẽ gọi lại trong ít phút" — **không hứa "đã điều xe"**.

### 3.5. Nội dung trung thực
- [ ] Chỉ giữ "24/7", "đến trong X phút" nếu đã xác nhận ở mục 0.
- [ ] Mục "Khách hàng nói gì": chỉ giữ nếu là khách thật (tốt nhất là ảnh chụp review Google thật); không thì bỏ.

**Xong khi:** PageSpeed mobile ≥ 85, xem nguồn trang (Ctrl+U) thấy đủ giá/dịch vụ, không còn `href="#"`.

---

## Giai đoạn 4 — Thêm trang dịch vụ để lên Google theo từng nhu cầu

Mỗi trang là 1 file HTML tĩnh, dùng chung header/footer/thanh gọi. Chỉ làm dịch vụ có thật.

| Trang | URL | Từ khoá nhắm |
|---|---|---|
| Kéo xe ô tô | `/keo-xe-o-to-hai-phong/` | kéo xe ô tô Hải Phòng |
| Kích bình ắc quy | `/kich-binh-ac-quy-hai-phong/` | kích bình ô tô Hải Phòng, ô tô không đề được |
| Thay lốp / vá lốp lưu động | `/thay-lop-o-to-hai-phong/` | thay lốp ô tô lưu động Hải Phòng |
| Sửa chữa lưu động | `/sua-chua-o-to-luu-dong-hai-phong/` | sửa ô tô lưu động Hải Phòng |
| Cứu hộ xe tải | `/cuu-ho-xe-tai-hai-phong/` | cứu hộ xe tải Hải Phòng |
| Bảng giá | `/bang-gia/` | giá cứu hộ ô tô Hải Phòng |

Mỗi trang cần **nội dung riêng** (300–600 chữ): khi nào cần dịch vụ này, quy trình, giá tham khảo + điều kiện, ảnh thật, 3–4 câu hỏi thường gặp, nút gọi. Không copy rồi chỉ đổi tên.

Bài hướng dẫn (viết dần, không bắt buộc ngay):
- Ô tô chết máy giữa đường: làm gì cho an toàn?
- Gọi cứu hộ cần chuẩn bị thông tin gì?
- Dấu hiệu ắc quy yếu.

**Không** tạo hàng loạt trang "cứu hộ quận A, quận B…" giống nhau — Google coi là spam.

---

## Giai đoạn 5 — Tên miền & đưa lên Google

- [ ] Mua tên miền riêng (`.vn` hoặc `.com`), trỏ về hosting.
- [ ] Hosting: **Cloudflare Pages** hoặc **Netlify** (miễn phí, có HTTPS, nhanh, deploy tự động khi push GitHub). Hoặc giữ VPS + Docker nếu đã có sẵn.
- [ ] HTTPS, chọn 1 dạng duy nhất (có `www` hoặc không) và redirect dạng còn lại.
- [ ] Nếu bản GitHub Pages cũ đã có người vào: đặt redirect sang tên miền mới.
- [ ] Đăng ký **Google Search Console**, gửi `sitemap.xml`, dùng "Kiểm tra URL" cho trang chủ + trang dịch vụ.
- [ ] Gắn link web vào Google Business Profile, Facebook, Zalo OA.

---

## Giai đoạn 6 — Đo lường (đơn giản)

- [ ] Google Analytics 4 (hoặc Cloudflare Web Analytics — nhẹ, không cookie).
- [ ] Ghi sự kiện: `click_call`, `click_zalo`, `submit_form`. **Không** gửi số điện thoại/vị trí khách vào analytics.
- [ ] Mỗi tháng xem 1 lần: Search Console (từ khoá nào ra khách), Google Business Profile (lượt gọi, chỉ đường), số lượt bấm gọi.
- [ ] Hỏi khách khi gọi: "Anh/chị tìm thấy số ở đâu?" — ghi lại đơn giản.

---

## Tuỳ chọn (làm khi cần)

- **Google Ads "chỉ gọi"** khoanh vùng Hải Phòng: có khách ngay trong lúc chờ SEO (SEO thường mất 2–6 tháng). Bắt đầu ngân sách nhỏ, đo số cuộc gọi.
- **Tracking tài xế** (`driver.html`/`track.html`): chỉ giữ nếu tài xế dùng thật. Nếu giữ, khoá Firebase Rules, bỏ dữ liệu khách khỏi URL, chặn không cho Google index 2 trang này (`noindex`).
- **Trang quản trị**: chỉ làm lại khi đổi giá/nội dung nhiều lần mỗi tuần. Khi đó dùng CMS có sẵn (Decap CMS, Pages CMS) chứ không tự viết.

---

## Thứ tự & thời gian ước lượng (1 người làm)

| Giai đoạn | Thời gian |
|---|---|
| 1. Vá bảo mật | 0.5–1 ngày |
| 2. Google Business Profile | 1 buổi setup + duy trì đều |
| 3. Làm lại trang chủ | 2–3 ngày |
| 4. Trang dịch vụ | 3–5 ngày (phần lớn là viết nội dung) |
| 5. Tên miền & Search Console | 0.5 ngày |
| 6. Đo lường | 0.5 ngày |

**Chi phí dự kiến:** tên miền ~250–800k/năm; hosting 0đ (Cloudflare Pages/Netlify); Google Ads tuỳ chọn.

---

## Checklist trước khi công bố

- [ ] Bấm gọi trên điện thoại thật → gọi đúng số.
- [ ] Bấm Zalo → mở đúng tài khoản.
- [ ] Gửi form → Telegram nhận được tin; không có token trong code web.
- [ ] Không còn `admin123`, token, `href="#"`.
- [ ] Hotline giống nhau ở web, Google Maps, Facebook, Zalo.
- [ ] Không có claim chưa xác nhận (24/7, số phút, review giả).
- [ ] PageSpeed mobile ≥ 85.
- [ ] Search Console đã nhận sitemap.

## Định nghĩa thành công

Khách ở Hải Phòng gõ "cứu hộ ô tô Hải Phòng" → thấy mình trên Maps hoặc kết quả tìm kiếm → mở web trong < 3 giây → bấm gọi được ngay. Mọi thứ khác là phụ.
