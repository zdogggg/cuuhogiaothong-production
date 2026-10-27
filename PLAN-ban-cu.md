# PLAN.md — Xây dựng mới website Cứu Hộ Giao Thông 123

> **Mục tiêu:** Xây dựng một website cứu hộ giao thông mới hoàn toàn về codebase, kiến trúc và giao diện, tập trung khách hàng tại Hải Phòng; ưu tiên cuộc gọi, SEO Google Search/Google Maps, tốc độ tải, độ tin cậy và khả năng quản trị lâu dài.
>
> **Stack đề xuất:** Nuxt 3 + Vue 3 + TypeScript + Tailwind CSS + Laravel REST API + MySQL 8.
>
> **Nguyên tắc quan trọng:** Xây mới hệ thống nhưng giữ nguyên chiến lược SEO đã thống nhất. Không bỏ qua URL, nội dung, dữ liệu và tín hiệu SEO có giá trị từ website cũ. “Mới hoàn toàn” nghĩa là codebase, kiến trúc, UI và quy trình triển khai mới; không phải xóa bỏ lịch sử SEO.

---

## 0. Cách sử dụng tài liệu

- Dùng tài liệu này làm kế hoạch triển khai chính cho dự án.
- Làm theo từng phase; không bỏ qua audit, kiểm thử, SEO migration và checklist trước production.
- Đánh dấu checkbox khi hoàn tất từng đầu việc.
- Các thông tin chưa xác minh phải ghi `TODO` hoặc `NEED_CONFIRMATION`; không tự đặt dữ liệu thật.
- Hotline, domain, giờ hoạt động, cam kết 24/7, thời gian đến nơi, giá, khu vực phục vụ, địa chỉ và số liệu kinh doanh phải được chủ website xác nhận.
- Trước khi chuyển domain, phải có bản sao lưu, URL inventory, redirect map, phương án rollback và checklist go-live.
- Phiên bản framework/package phải được xác minh tại thời điểm bắt đầu triển khai; tài liệu này không cố định version cụ thể khi chưa kiểm tra compatibility.

## 1. Tầm nhìn và mục tiêu dự án

### 1.1. Sản phẩm

Website cung cấp thông tin cứu hộ giao thông, tập trung chính tại Hải Phòng. Hệ thống gồm:

1. **Website công khai:** giúp khách hiểu dịch vụ, phạm vi hoạt động, cách tính giá và gọi điện nhanh.
2. **Trang quản trị:** cập nhật dịch vụ, giá, khu vực, bài viết, FAQ, hình ảnh và yêu cầu gửi qua form.
3. **Lớp đo lường:** ghi nhận lượt bấm gọi, form gửi thành công và dữ liệu hiệu quả SEO ở mức phù hợp quyền riêng tư.

### 1.2. Mục tiêu kinh doanh

- Tăng số cuộc gọi có chất lượng từ khách hàng tại Hải Phòng.
- Giảm số thao tác cần thiết để khách gọi cứu hộ.
- Làm rõ dịch vụ, phạm vi phục vụ, giá tham khảo và cách liên hệ.
- Cho phép quản trị nội dung mà không cần sửa code mỗi lần.
- Đo được trang nào mang lại traffic và chuyển đổi tốt.
- Tạo nền tảng có thể mở rộng thêm dịch vụ/khu vực nếu hoạt động thực tế hỗ trợ.

### 1.3. Mục tiêu kỹ thuật

- Dùng SSR/SSG của Nuxt phù hợp với các trang public cần SEO.
- Tách frontend và backend qua REST API.
- Dùng Laravel cho validation, authorization, nghiệp vụ và quản trị dữ liệu.
- Dùng MySQL làm nguồn dữ liệu chính.
- Mobile-first, dễ sử dụng trên kết nối di động.
- Nội dung SEO quan trọng phải có trong HTML server-rendered, không phụ thuộc hoàn toàn vào client-side fetch.
- Có kiểm thử, logging, backup, deploy và rollback.

### 1.4. Ngoài phạm vi MVP

Chỉ làm khi có nhu cầu được xác nhận:

- Ứng dụng di động native.
- GPS tracking xe/nhân viên thời gian thực.
- Bản đồ điều phối xe cứu hộ.
- Thanh toán online.
- Tính giá tự động theo bản đồ/khoảng cách.
- Chatbot AI.
- WebSocket/live chat.
- CRM/ERP đầy đủ.
- Đa ngôn ngữ.
- Đặt lịch phức tạp.

**Lý do:** ưu tiên khả năng gọi cứu hộ, SEO, thông tin đáng tin cậy và CMS trước; tránh làm dự án quá lớn mà không tạo thêm giá trị thực tế.

## 2. Phạm vi chức năng

### 2.1. Website công khai

- [ ] Trang chủ.
- [ ] Danh sách dịch vụ.
- [ ] Chi tiết dịch vụ.
- [ ] Bảng giá.
- [ ] Danh sách khu vực phục vụ.
- [ ] Chi tiết khu vực có nội dung riêng hữu ích.
- [ ] Giới thiệu.
- [ ] Liên hệ.
- [ ] Danh sách bài viết.
- [ ] Chi tiết bài viết.
- [ ] FAQ.
- [ ] Chính sách quyền riêng tư.
- [ ] Điều khoản sử dụng nếu cần.
- [ ] Trang gửi yêu cầu thành công.
- [ ] Trang 404 thực sự trả HTTP 404.
- [ ] Hotline `tel:` nổi bật, đặc biệt trên mobile.

### 2.2. Trang quản trị

- [ ] Đăng nhập/đăng xuất.
- [ ] Dashboard.
- [ ] CRUD dịch vụ.
- [ ] CRUD bảng giá.
- [ ] CRUD khu vực.
- [ ] CRUD bài viết và danh mục.
- [ ] CRUD FAQ.
- [ ] Quản lý media.
- [ ] Quản lý yêu cầu cứu hộ gửi qua form.
- [ ] Cập nhật thông tin doanh nghiệp/hotline.
- [ ] Quản lý SEO metadata và slug.
- [ ] Quản lý tài khoản/role theo nhu cầu.
- [ ] Audit log cho hành động quan trọng.
- [ ] Trạng thái draft/published/archived.

### 2.3. Chuyển đổi

**Primary conversion:** khách bấm gọi hotline.

**Secondary conversion:**
- Gửi form yêu cầu cứu hộ.
- Bấm mở chỉ đường.
- Xem bảng giá/dịch vụ liên quan.
- Bấm liên kết Google Business Profile.

Không được đánh đồng một lượt bấm nút gọi với cuộc gọi đã kết nối hoặc một đơn cứu hộ hoàn tất. Nếu cần đo cuộc gọi thực sự, phải dùng nguồn dữ liệu call tracking/điện thoại phù hợp và thông báo quyền riêng tư đúng mức.

## 3. UX và hành trình khách hàng

### 3.1. Tình huống sử dụng

Khách có thể đang đứng cạnh xe hỏng, vội, căng thẳng hoặc chỉ dùng một tay trên điện thoại. Vì vậy:

- Hotline phải dễ nhìn ngay trong màn hình đầu tiên.
- Không bắt khách tạo tài khoản.
- Form ngắn, chỉ hỏi dữ liệu cần thiết.
- Không để popup che CTA.
- Không dùng animation nặng hoặc video nền tự chạy làm chậm trang.
- Không yêu cầu thông tin nhạy cảm không cần thiết.
- Thông tin quan trọng phải dễ đọc, dễ chạm và dễ tìm.

### 3.2. Hành trình khách hàng

1. Khách tìm “cứu hộ ô tô Hải Phòng” hoặc truy vấn liên quan.
2. Khách vào trang chủ, trang dịch vụ hoặc trang khu vực phù hợp.
3. Khách thấy hotline, dịch vụ và phạm vi hỗ trợ.
4. Khách gọi trực tiếp hoặc gửi form nếu chưa thể gọi.
5. Nhân viên tiếp nhận thông tin và liên hệ lại theo quy trình thực tế.
6. Hệ thống ghi nhận form và nguồn truy cập ở mức phù hợp.
7. Đội ngũ xem dữ liệu tổng hợp để cải thiện nội dung/chuyển đổi.

### 3.3. Nguyên tắc thiết kế

- Mobile-first.
- Tương phản tốt; kích thước vùng chạm phù hợp.
- Semantic HTML, heading có thứ bậc.
- Không để nội dung quan trọng phụ thuộc vào hiệu ứng.
- Dùng ảnh thật có quyền sử dụng.
- Không bịa đánh giá, số liệu, đối tác, chứng nhận hoặc cam kết dịch vụ.
- Không tạo địa chỉ giả hay trang khu vực giả để SEO.
- Có focus state và hỗ trợ bàn phím.
- Tôn trọng `prefers-reduced-motion`.

## 4. Công nghệ đề xuất

| Lớp | Công nghệ | Vai trò |
|---|---|---|
| Frontend | Nuxt 3 / Vue 3 | SSR/SSG, routing, trang SEO |
| Ngôn ngữ frontend | TypeScript | Giảm lỗi kiểu dữ liệu |
| Styling | Tailwind CSS | Responsive UI, design system |
| State | Pinia khi cần | Trạng thái chia sẻ giữa component |
| Backend | Laravel REST API | Nghiệp vụ, auth, quản trị, form |
| Backend language | PHP theo phiên bản Laravel hỗ trợ | API/business logic |
| Database | MySQL 8.x hoặc phiên bản tương thích VPS | Dữ liệu chính |
| API | REST + JSON | Giao tiếp frontend/backend |
| Backend tests | PHPUnit/Pest | Unit/feature tests |
| Frontend tests | Vitest và công cụ E2E phù hợp | Component và luồng chính |
| Version control | Git + GitHub | Lịch sử code, review |
| Web server | Nginx | HTTPS, reverse proxy, static assets |
| Runtime | Node cho Nuxt; PHP-FPM cho Laravel | Chạy ứng dụng |
| SEO | Google Search Console | Index/query/click |
| Analytics | GA4 hoặc giải pháp tương đương | Hành vi và chuyển đổi |
| Local SEO | Google Business Profile | Hiện diện Google Maps |

### 4.1. Vì sao chọn Nuxt thay vì Vue SPA thuần?

- Nuxt hỗ trợ SSR/SSG, metadata theo trang và routing rõ ràng.
- Trang dịch vụ/bài viết có thể render nội dung ngay trong HTML.
- Có thể tổ chức sitemap, canonical và trang động theo slug.
- Tận dụng hệ sinh thái Vue.
- Nuxt không tự động giúp SEO tốt chỉ vì dùng framework: nội dung, cấu trúc URL, tốc độ, internal links và khả năng crawl vẫn rất quan trọng.

### 4.2. Vì sao dùng Laravel API?

- Có cấu trúc cho validation, middleware, authorization, migration và queue khi cần.
- Dễ xây dựng CMS/API CRUD.
- Tách frontend khỏi backend để bảo trì độc lập.
- Phù hợp MySQL và môi trường VPS PHP.
- Có thể mở rộng tích hợp mà không phải viết lại toàn bộ frontend.

### 4.3. Kiến trúc tổng quan

```text
Khách truy cập / Googlebot
          |
          v
       Nginx + HTTPS
          |
          +------------------------------+
          |                              |
          v                              v
     Nuxt 3 frontend               Laravel REST API
     SSR/SSG pages                 /api/v1/*
          |                              |
          |                              v
          |                        Validation/Auth
          |                        Business Logic
          |                              |
          |                              v
          |                           MySQL 8
          |
          +---- Nội dung SEO render phía server
          +---- Gọi API cho dữ liệu động cần thiết

Admin browser -> Nuxt admin -> Laravel API -> RBAC/Audit -> MySQL
```

### 4.4. Quy tắc kiến trúc

- Frontend không kết nối MySQL trực tiếp.
- Không để credentials trong frontend.
- Laravel là nguồn dữ liệu có thẩm quyền.
- Kiểm tra quyền ở backend; ẩn nút UI không phải biện pháp bảo mật.
- Public API chỉ trả trường cần hiển thị.
- Dùng API Resource/DTO để định dạng dữ liệu.
- Thay đổi dữ liệu quan trọng phải validate và ghi log phù hợp.
- Admin không được index bởi Google.

## 5. Cấu trúc repository

Đề xuất monorepo để quản lý frontend/backend cùng dự án:

```text
cuu-ho-giao-thong/
├── README.md
├── PLAN.md
├── .gitignore
├── .editorconfig
├── docs/
│   ├── architecture.md
│   ├── database.md
│   ├── api-spec.md
│   ├── seo-migration.md
│   ├── deployment.md
│   ├── security-checklist.md
│   ├── content-guidelines.md
│   ├── decision-log.md
│   └── runbook.md
├── frontend/
│   ├── app.vue
│   ├── nuxt.config.ts
│   ├── package.json
│   ├── tsconfig.json
│   ├── assets/
│   │   ├── css/main.css
│   │   ├── css/tokens.css
│   │   ├── images/
│   │   └── fonts/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── SiteHeader.vue
│   │   │   ├── SiteFooter.vue
│   │   │   ├── MainNavigation.vue
│   │   │   ├── MobileCallBar.vue
│   │   │   └── Breadcrumbs.vue
│   │   ├── home/
│   │   │   ├── HeroSection.vue
│   │   │   ├── ServiceGrid.vue
│   │   │   ├── TrustSection.vue
│   │   │   ├── ProcessSection.vue
│   │   │   ├── CoverageSection.vue
│   │   │   ├── PricePreview.vue
│   │   │   ├── FAQSection.vue
│   │   │   └── ContactCTA.vue
│   │   ├── services/
│   │   │   ├── ServiceCard.vue
│   │   │   ├── ServiceDetails.vue
│   │   │   └── RelatedServices.vue
│   │   ├── content/
│   │   │   ├── ArticleCard.vue
│   │   │   ├── ArticleContent.vue
│   │   │   └── RelatedArticles.vue
│   │   ├── forms/
│   │   │   ├── RescueRequestForm.vue
│   │   │   └── FormField.vue
│   │   └── ui/
│   │       ├── BaseButton.vue
│   │       ├── BaseInput.vue
│   │       ├── BaseTextarea.vue
│   │       ├── BaseSelect.vue
│   │       ├── BaseAlert.vue
│   │       ├── BaseSkeleton.vue
│   │       └── BasePagination.vue
│   ├── composables/
│   │   ├── useApi.ts
│   │   ├── useBusinessInfo.ts
│   │   ├── useSeo.ts
│   │   ├── useCallTracking.ts
│   │   └── usePagination.ts
│   ├── layouts/
│   │   ├── default.vue
│   │   └── admin.vue
│   ├── middleware/admin-auth.ts
│   ├── pages/
│   │   ├── index.vue
│   │   ├── gioi-thieu.vue
│   │   ├── lien-he.vue
│   │   ├── bang-gia.vue
│   │   ├── cau-hoi-thuong-gap.vue
│   │   ├── chinh-sach-quyen-rieng-tu.vue
│   │   ├── dieu-khoan.vue
│   │   ├── gui-yeu-cau-thanh-cong.vue
│   │   ├── dich-vu/index.vue
│   │   ├── dich-vu/[slug].vue
│   │   ├── khu-vuc/index.vue
│   │   ├── khu-vuc/[slug].vue
│   │   ├── tin-tuc/index.vue
│   │   ├── tin-tuc/[slug].vue
│   │   └── admin/...
│   ├── types/
│   │   ├── api.ts
│   │   ├── service.ts
│   │   ├── article.ts
│   │   └── business.ts
│   ├── utils/
│   │   ├── formatDate.ts
│   │   ├── normalizePhone.ts
│   │   └── seo.ts
│   └── public/
│       ├── favicon.ico
│       ├── robots.txt
│       └── images/
└── backend/
    ├── artisan
    ├── composer.json
    ├── app/
    │   ├── Http/Controllers/Api/V1/
    │   ├── Http/Middleware/
    │   ├── Http/Requests/
    │   ├── Http/Resources/
    │   ├── Models/
    │   ├── Policies/
    │   ├── Services/
    │   ├── Actions/
    │   ├── Notifications/
    │   └── Support/
    ├── database/migrations/
    ├── database/seeders/
    ├── database/factories/
    ├── routes/api.php
    ├── tests/Feature/
    └── tests/Unit/
```

### 5.1. Quy ước code

- Component phụ trách một phần giao diện rõ ràng.
- Tránh đưa toàn bộ trang chủ vào một file lớn.
- Business logic ở service/action, không nhồi vào controller.
- Dùng Form Request để validate.
- Dùng API Resource để định dạng response.
- Dùng Policy/Gate cho quyền.
- Không commit `.env`, token, mật khẩu, private key hay thông tin production.
- Tạo `.env.example` chỉ có tên biến và giá trị mẫu an toàn.
- Component PascalCase; slug lowercase và dùng dấu gạch ngang.
- Không tạo abstraction quá sớm khi chưa có nhu cầu thực tế.

## 6. Design system và UI

### 6.1. Định hướng

Phong cách: rõ ràng, tin cậy, phản ứng nhanh, thiên về hành động.

- Giữ tinh thần nhận diện hiện tại nếu phù hợp; chốt mã màu sau khi kiểm tra logo/tài sản thương hiệu.
- Một màu tương phản riêng cho CTA gọi điện.
- Font dễ đọc trên mobile; hạn chế nhiều font family/weight.
- Bố cục rõ ràng, card đơn giản.
- Ảnh thực tế có quyền sử dụng.
- Không dùng video nền tự chạy nếu gây chậm hoặc che CTA.
- Tôn trọng `prefers-reduced-motion`.

### 6.2. Component dùng chung

- Header desktop.
- Navigation mobile.
- Logo.
- Nút gọi hotline.
- Thanh gọi cố định đáy mobile.
- Breadcrumb.
- CTA cuối nội dung.
- Service card.
- Article card.
- FAQ accordion.
- Form field.
- Alert trạng thái form.
- Pagination.
- Loading/skeleton.
- Footer với thông tin doanh nghiệp.
- SEO metadata helper.
- API error state.

### 6.3. Header

- Logo.
- Link tới Dịch vụ, Bảng giá, Khu vực, Tin tức, Liên hệ.
- Hotline nổi bật.
- Mobile có menu gọn và nút gọi dễ chạm.
- Hotline lấy từ cấu hình doanh nghiệp/API hoặc một nguồn cấu hình thống nhất, tránh hardcode nhiều nơi.

### 6.4. Hero trang chủ

Hero phải trả lời nhanh:

1. Website cung cấp dịch vụ gì?
2. Phục vụ khu vực nào?
3. Khách cần làm gì tiếp theo?

Thành phần:
- H1 mô tả tự nhiên dịch vụ cứu hộ giao thông tại Hải Phòng.
- Đoạn ngắn nêu nhóm dịch vụ chính.
- CTA chính: Gọi cứu hộ.
- CTA phụ: Xem dịch vụ/Xem bảng giá.
- Phạm vi phục vụ chính.
- Hình ảnh đã tối ưu dung lượng.

Không đưa tuyên bố “có mặt sau X phút”, “24/7”, “giá rẻ nhất”, “số 1” nếu chưa xác minh và không thể duy trì.

### 6.5. Mobile call bar

- Dùng `tel:` với hotline đã xác nhận.
- Tương phản cao, tên nút dễ hiểu.
- Không che form, cookie notice hoặc nội dung cuối trang.
- Có safe-area padding.
- Theo dõi click-call nhưng gọi đúng là lượt bấm.
- Không hiển thị trong admin nếu không có lý do.

### 6.6. Responsive và accessibility

Kiểm tra điện thoại nhỏ, điện thoại phổ biến, tablet dọc/ngang, laptop và desktop. Đảm bảo:

- Heading theo thứ bậc.
- Form có label thật, không chỉ placeholder.
- Nút có accessible name.
- Focus state rõ.
- Không dùng màu làm dấu hiệu duy nhất cho lỗi/thành công.
- Alt text đúng với ảnh nội dung; ảnh trang trí có alt rỗng.
- Không có horizontal overflow.

## 7. Cấu trúc trang và URL

> Các URL dưới đây là đề xuất. Phải đối chiếu URL thật hiện có trước khi triển khai. Nếu URL cũ đang có traffic, backlink hoặc được index, ưu tiên giữ nguyên thay vì đổi chỉ để đồng bộ cấu trúc.

| Trang | URL đề xuất | Mục tiêu |
|---|---|---|
| Trang chủ | `/` | Tổng quan và CTA gọi |
| Danh sách dịch vụ | `/dich-vu/` | Tổng hợp dịch vụ |
| Chi tiết dịch vụ | `/dich-vu/{slug}/` | Nhu cầu cụ thể |
| Bảng giá | `/bang-gia/` | Minh bạch cách tính phí |
| Khu vực | `/khu-vuc/` | Phạm vi thực tế |
| Chi tiết khu vực | `/khu-vuc/{slug}/` | Nội dung địa phương hữu ích |
| Giới thiệu | `/gioi-thieu/` | Thông tin doanh nghiệp thật |
| Liên hệ | `/lien-he/` | Hotline, chỉ đường, form |
| FAQ | `/cau-hoi-thuong-gap/` | Giải đáp nhanh |
| Danh sách bài viết | `/tin-tuc/` | Nội dung hướng dẫn |
| Chi tiết bài viết | `/tin-tuc/{slug}/` | Nội dung chuyên sâu |
| Chính sách | `/chinh-sach-quyen-rieng-tu/` | Minh bạch dữ liệu |
| Điều khoản | `/dieu-khoan/` | Nếu cần |

### 7.1. Dịch vụ có thể triển khai

Chỉ xuất bản dịch vụ mà đơn vị thực sự cung cấp:

- Cứu hộ ô tô chết máy/không khởi động được.
- Kéo xe ô tô.
- Cứu hộ ắc quy/kích bình.
- Thay lốp hoặc hỗ trợ sự cố lốp.
- Cứu hộ xe gặp sự cố trên đường.
- Vận chuyển xe về garage.
- Dịch vụ khác đã được xác nhận.

Mỗi trang cần nội dung riêng hữu ích; không chỉ thay tên dịch vụ trong cùng một template.

### 7.2. Trang khu vực

- Ưu tiên Hải Phòng là khu vực chính.
- Chỉ tạo trang cho khu vực đơn vị thực sự phục vụ và có thông tin hữu ích riêng.
- Không tạo hàng loạt trang gần giống nhau chỉ thay tên địa bàn.
- Khu vực ngoài Hải Phòng chỉ được nêu nổi bật nếu có hoạt động thực tế.
- Không tạo địa chỉ giả để lấy thứ hạng Google Maps.

### 7.3. Quy tắc slug và redirect

- Slug lowercase, dấu gạch ngang, ổn định.
- Slug phải unique.
- Không đổi slug đã index nếu không có lý do.
- Khi slug đổi, tạo redirect 301 từ URL cũ sang URL mới tương ứng.
- Không redirect mọi URL cũ về homepage.
- Không dùng `href="#"` cho link không có đích thật.

## 8. Nội dung trang chủ

Cấu trúc đề xuất:

1. Header + hotline.
2. Hero: dịch vụ chính, khu vực chính, CTA gọi.
3. Khối dịch vụ chính.
4. Khối “Khi nào nên gọi cứu hộ?”.
5. Quy trình tiếp nhận và xử lý yêu cầu.
6. Khu vực phục vụ.
7. Bảng giá tham khảo/cách tính phí.
8. Thông tin tạo niềm tin có thể kiểm chứng.
9. Câu hỏi thường gặp.
10. Bài viết hữu ích mới nhất.
11. CTA cuối trang.
12. Footer với hotline, thông tin doanh nghiệp và link quan trọng.

### 8.1. Nội dung tạo niềm tin

Có thể dùng ảnh thật, thông tin liên hệ nhất quán, phạm vi dịch vụ thật, quy trình rõ, cách báo giá minh bạch, chứng nhận thật nếu có và đánh giá khách hàng thật được sử dụng phù hợp.

Không tự bịa số lượng khách, số năm kinh nghiệm, thời gian đến nơi trung bình, đánh giá, logo đối tác, chứng nhận hoặc cam kết 24/7.

## 9. SEO — giữ chiến lược hiện tại

### 9.1. Nguyên tắc SEO migration

Mục tiêu không phải reset SEO mà là chuyển sang kiến trúc tốt hơn nhưng bảo toàn tín hiệu hiện có.

Trước khi code:

- [ ] Thu thập URL cũ từ sitemap, crawl, Search Console và website.
- [ ] Ghi lại title, H1, meta description, canonical, status code.
- [ ] Ghi lại click/impression/backlink nếu có dữ liệu.
- [ ] Xác định URL giữ nguyên.
- [ ] Xác định URL bắt buộc đổi.
- [ ] Lập redirect map 301 từng URL cũ sang URL mới tương ứng.
- [ ] Sao lưu nội dung, ảnh, bảng giá, bài viết và dữ liệu.
- [ ] Lưu baseline Search Console/analytics trước migration.

Không redirect mọi URL về homepage. Redirect tới nội dung tương đương; nếu không có nội dung thay thế hợp lý, cân nhắc 404/410.

### 9.2. Keyword clusters

**Nhóm chính:**
- cứu hộ ô tô Hải Phòng
- cứu hộ giao thông Hải Phòng
- gọi cứu hộ ô tô Hải Phòng
- cứu hộ ô tô 24/7 Hải Phòng — chỉ dùng nếu thực sự trực 24/7

**Nhóm theo nhu cầu:**
- kéo xe ô tô Hải Phòng
- kích bình ô tô Hải Phòng
- ô tô không đề được Hải Phòng
- cứu hộ lốp ô tô Hải Phòng
- vận chuyển xe ô tô khi gặp sự cố

**Nhóm khu vực:** truy vấn theo địa bàn cụ thể trong Hải Phòng, chỉ khi có dịch vụ thật và nội dung địa phương hữu ích.

Không nhồi nhét từ khóa. Mỗi trang có mục đích tìm kiếm chính nhưng nội dung phải tự nhiên và hữu ích.

### 9.3. Metadata

Mỗi trang indexable cần:

- Title duy nhất, mô tả đúng nội dung.
- Meta description có ích.
- H1 chính rõ ràng.
- Canonical URL tuyệt đối, đúng trang.
- Open Graph phù hợp.
- Robots meta phù hợp trạng thái index.
- Nội dung chính render được ở HTML server-side.
- Internal links tới trang liên quan.

Title trang chủ gợi ý, sau khi xác nhận thương hiệu/khu vực:

`Cứu Hộ Ô Tô Hải Phòng | Cứu Hộ Giao Thông 123`

Chỉ thêm “24/7” nếu dịch vụ trực 24/7 thật. Meta description viết cho người dùng, không nhồi từ khóa.

### 9.4. Semantic HTML

- Một H1 chính rõ ràng mỗi trang.
- H2/H3 theo thứ bậc.
- Dùng `main`, `nav`, `header`, `footer`, `article` khi phù hợp.
- Điều hướng dùng `<a>`; hành động dùng `<button>`.
- Không dùng `href="#"` giả làm link.
- Anchor text mô tả đích đến.
- Tránh nhiều H1 chỉ để tạo chữ lớn.

### 9.5. Structured data

Cân nhắc JSON-LD phù hợp dữ liệu thật:

- `LocalBusiness` hoặc subtype phù hợp nếu đủ điều kiện.
- `Organization` nếu phù hợp.
- `WebSite`.
- `BreadcrumbList`.
- `Article`/`BlogPosting` cho bài viết.
- `Service` khi có giá trị ngữ nghĩa.

Quy tắc:
- Schema phải khớp nội dung hiển thị.
- Không thêm rating/review giả.
- Không thêm địa chỉ/giá không đúng.
- Schema không bảo đảm rich result hoặc thứ hạng.
- Kiểm tra bằng Rich Results Test/Schema Markup Validator.

### 9.6. Sitemap và robots

- Tạo `sitemap.xml` tự động từ các trang public đã xuất bản và được phép index.
- Không đưa admin, login, trang form thành công, draft hoặc trang noindex vào sitemap.
- Cập nhật `lastmod` khi nội dung thực sự thay đổi.
- Khai báo sitemap trong `robots.txt`.
- Không dùng robots.txt thay cho noindex đối với URL cần loại khỏi kết quả.
- Không chặn CSS/JS quan trọng cho render.
- Submit sitemap trong Search Console.

### 9.7. Internal linking

- Trang chủ liên kết tới dịch vụ chính, bảng giá, khu vực, liên hệ.
- Trang dịch vụ liên kết dịch vụ liên quan, khu vực và bài hướng dẫn khi hữu ích.
- Bài viết liên kết tới dịch vụ phù hợp tự nhiên.
- Breadcrumb cho trang sâu.
- Tránh link sitewide nhồi từ khóa và trang orphan không có internal link.

### 9.8. Nội dung blog

Chủ đề gợi ý, cần được biên tập/kiểm tra nghiệp vụ:

- Cần làm gì khi ô tô chết máy giữa đường?
- Dấu hiệu ắc quy yếu và khi nào cần hỗ trợ?
- Cần chuẩn bị thông tin gì khi gọi cứu hộ?
- Những thông tin nên hỏi trước khi đồng ý kéo xe?
- Cách đảm bảo an toàn khi xe gặp sự cố trên đường.

Không đăng hàng loạt bài mỏng chỉ để có từ khóa. Với nội dung an toàn, không khuyến khích thao tác nguy hiểm nếu người đọc không có điều kiện phù hợp.

### 9.9. Local SEO / Google Maps

- Xác minh Google Business Profile.
- Tên doanh nghiệp nhất quán, không nhồi từ khóa trái quy định.
- Danh mục doanh nghiệp chính xác.
- Khu vực phục vụ đúng thực tế.
- Hotline, website, giờ hoạt động và thông tin doanh nghiệp nhất quán.
- Dùng ảnh thật và cập nhật định kỳ.
- Xin đánh giá từ khách thật tự nhiên; không mua hoặc tạo review giả.
- Trả lời review lịch sự, không tiết lộ dữ liệu riêng tư.
- Không tạo nhiều hồ sơ cho cùng doanh nghiệp/địa điểm nếu không đáp ứng điều kiện.
- Không tạo địa chỉ giả hoặc địa chỉ không đủ điều kiện.
- Theo dõi cuộc gọi/lượt chỉ đường/website nếu dữ liệu khả dụng.

### 9.10. Core Web Vitals và tốc độ

- Tối ưu ảnh sang WebP/AVIF khi phù hợp.
- Dùng ảnh responsive.
- Khai báo width/height hoặc aspect ratio tránh layout shift.
- Lazy-load ảnh dưới fold; không lazy-load ảnh LCP chính một cách máy móc.
- Giảm JavaScript client không cần thiết.
- Bỏ script bên thứ ba không dùng.
- Cache HTML/API phù hợp.
- Chỉ tải font/weight cần thiết.
- Tránh slider/video nặng ở hero.
- Kiểm tra LCP, INP, CLS bằng dữ liệu lab và field khi có.
- Chạy Lighthouse/PageSpeed Insights trước và sau release.

### 9.11. SSR/SSG và nội dung

- Nội dung SEO quan trọng phải có trong HTML render từ Nuxt SSR/SSG.
- Không chờ client fetch mới hiện tiêu đề, nội dung chính và liên kết.
- Khi SSR lấy dữ liệu API, xử lý lỗi/trạng thái trống.
- Lỗi API không được làm toàn bộ trang trắng nếu có thể hiển thị fallback phù hợp.
- Admin có thể client-heavy hơn nhưng API vẫn phải được bảo vệ server-side.

### 9.12. Checklist indexability

- [ ] Trang public cần index trả 200.
- [ ] Không có `noindex` ngoài ý muốn.
- [ ] Canonical trỏ đúng URL.
- [ ] Không có canonical chéo sai.
- [ ] Robots không chặn trang quan trọng.
- [ ] Sitemap chỉ chứa URL canonical.
- [ ] Redirect không loop/chain dài.
- [ ] 404 trả status 404 thật.
- [ ] URL không tồn tại không trả trang chủ với status 200 (soft 404).
- [ ] Trang nháp không public.
- [ ] Admin/login không index.
- [ ] Kiểm tra URL Inspection sau phát hành.

## 10. Database schema dự kiến

> Đây là schema nền tảng. Chỉ thêm bảng khi có nhu cầu nghiệp vụ; tránh thiết kế thừa.

### 10.1. `users`

| Cột | Kiểu gợi ý | Ghi chú |
|---|---|---|
| id | BIGINT | Primary key |
| name | VARCHAR | Tên hiển thị |
| email | VARCHAR UNIQUE | Email đăng nhập |
| password | VARCHAR | Hash, không lưu mật khẩu thô |
| role | VARCHAR/ENUM | `super_admin`, `admin`, `editor`, `operator` nếu cần |
| is_active | BOOLEAN | Khóa/mở tài khoản |
| email_verified_at | TIMESTAMP nullable | Nếu xác minh email |
| last_login_at | TIMESTAMP nullable | Theo dõi đăng nhập |
| created_at/updated_at | TIMESTAMP | Laravel timestamps |

Có thể dùng package role/permission khi cần quyền chi tiết. Dù chỉ có một admin, vẫn phải kiểm tra quyền server-side.

### 10.2. `business_settings`

- `id`
- `business_name`
- `primary_phone`
- `secondary_phone` nullable
- `email` nullable
- `address` nullable — chỉ khi có địa chỉ hợp lệ công khai
- `service_area_summary`
- `business_hours`
- `is_24_7` boolean, chỉ bật khi xác minh
- `map_url` nullable
- `google_business_profile_url` nullable
- `logo_media_id` nullable
- timestamps

Chỉ admin có quyền phù hợp được cập nhật bảng này.

### 10.3. `services`

- `id`
- `name`
- `slug` unique
- `short_description`
- `content`
- `featured_image_id` nullable
- `icon_key` nullable
- `status`: draft/published/archived
- `sort_order`
- `meta_title` nullable
- `meta_description` nullable
- `canonical_url` nullable
- `published_at` nullable
- timestamps

Rich text phải được xử lý/sanitize phù hợp; không cho phép HTML tùy ý không kiểm soát.

### 10.4. `price_items`

- `id`
- `name`
- `description` nullable
- `price_type`: fixed/from/range/quote
- `price_amount` nullable
- `price_min` nullable
- `price_max` nullable
- `unit` nullable
- `conditions` nullable
- `is_active`
- `sort_order`
- timestamps

Không hiển thị giá chính xác nếu giá phụ thuộc quãng đường, loại xe, thời gian hoặc tình trạng sự cố. Ghi rõ điều kiện và phí có thể phát sinh.

### 10.5. `service_areas`

- `id`
- `name`
- `slug` unique
- `parent_id` nullable
- `description`
- `coverage_details`
- `is_active`
- `has_unique_public_page` boolean
- `meta_title` nullable
- `meta_description` nullable
- timestamps

Không sinh hàng loạt trang địa phương mỏng. Chỉ index trang có nội dung riêng, hữu ích và được duyệt.

### 10.6. `posts`

- `id`
- `title`
- `slug` unique
- `excerpt`
- `content`
- `featured_image_id` nullable
- `author_id` nullable
- `category_id` nullable
- `status`: draft/published/archived
- `meta_title` nullable
- `meta_description` nullable
- `canonical_url` nullable
- `published_at` nullable
- timestamps

### 10.7. `post_categories`

- `id`
- `name`
- `slug` unique
- `description` nullable
- timestamps

### 10.8. `faqs`

- `id`
- `question`
- `answer`
- `category` nullable
- `sort_order`
- `is_published`
- timestamps

### 10.9. `media`

- `id`
- `disk`
- `path`
- `original_name`
- `mime_type`
- `size_bytes`
- `width` nullable
- `height` nullable
- `alt_text` nullable
- `caption` nullable
- `uploaded_by` nullable
- timestamps

Kiểm tra MIME, dung lượng, kích thước, quyền upload và nội dung file. Không tin phần mở rộng do client gửi.

### 10.10. `rescue_requests`

- `id`
- `reference_code` unique
- `customer_name` nullable
- `customer_phone`
- `vehicle_type` nullable
- `issue_type` nullable
- `location_text`
- `details` nullable
- `status`: new/contacted/in_progress/completed/cancelled
- `source` nullable
- `consent_at` nullable nếu cần
- `handled_by` nullable
- `handled_at` nullable
- timestamps

Quy tắc:
- Chỉ lưu dữ liệu cần để phản hồi khách.
- Không thu thập GPS chính xác nếu không cần và không thông báo phù hợp.
- Định nghĩa thời hạn lưu và quy trình xóa/ẩn danh.
- Không gửi điện thoại/vị trí khách vào URL, analytics hoặc log công khai.

### 10.11. `redirects`

- `id`
- `source_path` unique
- `destination_path`
- `status_code` — thường 301 cho thay đổi vĩnh viễn
- `is_active`
- timestamps

Kiểm tra loop/chain. Danh sách nhỏ có thể cấu hình ở Nginx; dùng database/admin khi cần chỉnh sửa thường xuyên.

### 10.12. `audit_logs`

- `id`
- `user_id` nullable
- `action`
- `entity_type` nullable
- `entity_id` nullable
- `ip_hash` hoặc IP theo chính sách
- `user_agent` rút gọn nếu cần
- `metadata` JSON không chứa bí mật
- `created_at`

Không lưu mật khẩu, token, secret hoặc dữ liệu nhạy cảm không cần thiết.

### 10.13. Quan hệ và index

- `posts.author_id` → `users.id`.
- `posts.category_id` → `post_categories.id`.
- `media.uploaded_by` → `users.id`.
- `rescue_requests.handled_by` → `users.id`.
- `service_areas.parent_id` → `service_areas.id`.
- `services.featured_image_id`/`posts.featured_image_id` → `media.id`.
- Unique index cho slug, email, reference code.
- Index status + published_at cho bảng content.
- Index status + created_at cho rescue requests.
- Dùng foreign key và chọn `ON DELETE` có chủ đích.
- Nội dung đã public thường nên archive/soft delete thay vì xóa cứng không kiểm soát.
- Tạo migration cho thay đổi schema; không sửa production thủ công không lưu lịch sử.

## 11. REST API specification

Base path: `/api/v1`

### 11.1. Response convention

Thành công:

```json
{
  "data": {},
  "meta": {}
}
```

Lỗi validation:

```json
{
  "message": "Dữ liệu gửi lên chưa hợp lệ.",
  "errors": {
    "phone": ["Vui lòng kiểm tra số điện thoại."]
  }
}
```

- HTTP status đúng ngữ nghĩa.
- Không trả stack trace trong production.
- Không lộ SQL/credentials.
- Response nhất quán.
- Danh sách dài có pagination.
- Giới hạn `per_page`.

### 11.2. Public API

| Method | Endpoint | Chức năng |
|---|---|---|
| GET | `/business-info` | Thông tin doanh nghiệp public |
| GET | `/services` | Dịch vụ đã xuất bản |
| GET | `/services/{slug}` | Chi tiết dịch vụ |
| GET | `/prices` | Bảng giá public |
| GET | `/service-areas` | Khu vực đang phục vụ |
| GET | `/service-areas/{slug}` | Chi tiết khu vực public |
| GET | `/posts` | Danh sách bài viết |
| GET | `/posts/{slug}` | Chi tiết bài viết |
| GET | `/post-categories` | Danh mục bài viết |
| GET | `/faqs` | FAQ |
| POST | `/rescue-requests` | Gửi yêu cầu cứu hộ |
| GET | `/sitemap-data` | Dữ liệu URL public nếu cần |

Public API chỉ trả dữ liệu published. Không được trả draft chỉ vì người dùng biết ID/slug.

### 11.3. Admin API

| Method | Endpoint | Chức năng |
|---|---|---|
| POST | `/auth/login` | Đăng nhập |
| POST | `/auth/logout` | Đăng xuất |
| GET | `/auth/me` | Tài khoản hiện tại |
| GET/POST | `/admin/services` | Danh sách/tạo dịch vụ |
| GET/PATCH/DELETE | `/admin/services/{id}` | Xem/sửa/archive dịch vụ |
| GET/POST | `/admin/prices` | Danh sách/tạo giá |
| PATCH/DELETE | `/admin/prices/{id}` | Sửa/ẩn giá |
| GET/POST | `/admin/areas` | Quản lý khu vực |
| GET/PATCH/DELETE | `/admin/areas/{id}` | Xem/sửa/archive khu vực |
| GET/POST | `/admin/posts` | Quản lý bài viết |
| GET/PATCH/DELETE | `/admin/posts/{id}` | Xem/sửa/archive bài viết |
| GET/POST | `/admin/faqs` | Quản lý FAQ |
| GET/POST | `/admin/media` | Upload/list media |
| GET | `/admin/rescue-requests` | Danh sách yêu cầu |
| GET | `/admin/rescue-requests/{id}` | Chi tiết yêu cầu |
| PATCH | `/admin/rescue-requests/{id}` | Cập nhật trạng thái |
| GET/PATCH | `/admin/settings/business` | Cấu hình doanh nghiệp |
| GET | `/admin/audit-logs` | Audit log theo quyền |

Endpoint/quyền cuối cùng phải được chốt trong `docs/api-spec.md`. Không cần xây endpoint không có nhu cầu, nhưng mọi endpoint phải theo chuẩn nhất quán.

### 11.4. Pagination và filtering

- Query params: `page`, `per_page`, `search`; `status` chỉ trong admin.
- Giới hạn `per_page`, ví dụ tối đa 100.
- Whitelist trường sort; không nối input thẳng vào SQL.
- Public filter chỉ thêm khi có ích.
- Không để filter tạo vô hạn URL crawl được.
- Trả meta pagination khi phù hợp.

### 11.5. Form và idempotency

- Chống spam/rate limit.
- Hạn chế bản ghi trùng do bấm gửi nhiều lần.
- Dùng idempotency key nếu luồng cần, không bắt buộc MVP.
- Trả reference code không tiết lộ ID tuần tự nếu không cần.
- Trang success không được hiển thị dữ liệu khách khác.

## 12. Xác thực và phân quyền

### 12.1. Authentication

- Nếu frontend/API cùng site hoặc subdomain được cấu hình phù hợp, ưu tiên cookie `HttpOnly`, `Secure`, `SameSite` và CSRF protection phù hợp.
- Nếu cần token-based auth, đánh giá cách lưu token; tránh token dài hạn trong `localStorage` nếu có phương án an toàn hơn.
- Dùng cơ chế hash mật khẩu của Laravel.
- Rate limit login.
- Không tiết lộ email có tồn tại hay không qua thông báo lỗi.
- Có quy trình reset mật khẩu an toàn nếu triển khai.

### 12.2. Vai trò gợi ý

| Vai trò | Quyền |
|---|---|
| `super_admin` | Tài khoản, cấu hình, toàn bộ nội dung |
| `admin` | Quản lý nội dung, giá, yêu cầu |
| `editor` | Bài viết, dịch vụ, FAQ |
| `operator` | Xem/cập nhật yêu cầu, không sửa cấu hình |

Có thể giảm số role cho MVP nhưng không bỏ qua authorization phía backend.

### 12.3. Bảo vệ admin

- Frontend middleware chỉ cải thiện UX, không phải lớp bảo vệ duy nhất.
- Laravel middleware + Policy kiểm tra mọi endpoint.
- Trả 401/403 đúng trường hợp.
- Không tin role gửi từ client.
- Ghi audit log cho hành động quan trọng.

## 13. Bảo mật và quyền riêng tư

### 13.1. Security checklist

- [ ] HTTPS toàn bộ.
- [ ] Secrets chỉ nằm trong environment/server secret store.
- [ ] Validation server-side cho mọi input.
- [ ] Dùng ORM/query binding, tránh SQL injection.
- [ ] Escape output/sanitize rich text, tránh XSS.
- [ ] CSRF protection nếu dùng session/cookie.
- [ ] CORS chỉ cho origin cần thiết.
- [ ] Rate limit login, form, upload và endpoint dễ bị lạm dụng.
- [ ] Upload kiểm tra MIME, dung lượng, loại file, tên file.
- [ ] Không cho upload file thực thi.
- [ ] Tắt debug mode và stack trace ở production.
- [ ] Cập nhật dependencies định kỳ.
- [ ] Phân quyền file/folder VPS đúng.
- [ ] Không commit `.env`.
- [ ] Backup và kiểm tra khôi phục.
- [ ] Log không chứa token/password/secret.
- [ ] Rà soát dependency vulnerabilities trước release.

### 13.2. Form cứu hộ

Trường tối thiểu đề xuất:

- Số điện thoại (bắt buộc).
- Khu vực/vị trí mô tả (bắt buộc nếu cần phản hồi).
- Loại sự cố (tùy chọn/chọn nhanh).
- Loại xe (tùy chọn).
- Mô tả thêm (tùy chọn).
- Tên khách (tùy chọn nếu không cần).

Thông báo form không thay thế cuộc gọi trong tình huống khẩn cấp. Hotline vẫn phải luôn hiển thị. Không hứa đã điều xe nếu hệ thống chỉ mới ghi nhận form.

### 13.3. Quyền riêng tư

- Công bố loại dữ liệu, mục đích, thời gian lưu và cách liên hệ.
- Chỉ người có quyền mới xem yêu cầu.
- Định nghĩa thời hạn lưu và quy trình xóa/ẩn danh.
- Không gửi điện thoại, mô tả sự cố hay địa chỉ chính xác sang analytics.
- Nếu dùng analytics/cookie không thiết yếu, xem xét nghĩa vụ thông báo/đồng ý theo quy định áp dụng.
- Tài liệu này không thay thế tư vấn pháp lý.

## 14. Form yêu cầu cứu hộ

### 14.1. Luồng xử lý

1. Người dùng mở form.
2. Nhập số điện thoại và vị trí.
3. Chọn loại sự cố nếu muốn.
4. Frontend validate cơ bản.
5. Gửi HTTPS request đến Laravel.
6. Backend validate lại toàn bộ dữ liệu.
7. Áp dụng rate limit và kiểm tra spam.
8. Lưu yêu cầu.
9. Trả reference code.
10. Hiển thị xác nhận và hướng dẫn gọi hotline nếu cần xử lý ngay.

### 14.2. Validation

- Chuẩn hóa khoảng trắng.
- Kiểm tra độ dài/định dạng điện thoại hợp lý, không giả định một regex duy nhất bao quát mọi số hợp lệ.
- Giới hạn độ dài mô tả.
- Không nhận HTML/script tùy ý.
- Giới hạn request body.
- Validate loại sự cố theo danh sách cho phép.
- Không nhận status/handled_by/created_at từ public client.

### 14.3. Chống spam

- Rate limiting theo IP/tín hiệu request phù hợp.
- Honeypot có thể cân nhắc.
- Chỉ dùng CAPTCHA nếu cần vì có thể cản trở khách đang gặp sự cố.
- Theo dõi spam để điều chỉnh.
- Không khóa khách thật chỉ dựa trên một tín hiệu đơn lẻ.

### 14.4. Admin xử lý

- Danh sách mới nhất trước.
- Lọc theo trạng thái/ngày.
- Xem điện thoại/vị trí trong vùng được phân quyền.
- Trạng thái: mới, đã liên hệ, đang xử lý, hoàn tất, hủy.
- Lưu người xử lý và thời điểm cập nhật.
- Không coi `completed` là doanh thu nếu không có hệ thống ghi nhận doanh thu.

## 15. CMS quản trị nội dung

### 15.1. Dịch vụ

- Tạo/sửa/ẩn/xuất bản.
- Slug tự đề xuất nhưng cho phép chỉnh.
- Cảnh báo slug trùng.
- Trường SEO riêng.
- Preview trước khi xuất bản nếu khả thi.
- Không xóa cứng nội dung đã public mà chưa xem xét redirect.

### 15.2. Bảng giá

- Giá cố định, khoảng giá, giá từ hoặc báo giá.
- Ghi đơn vị và điều kiện áp dụng.
- Trạng thái hiển thị/thứ tự.
- Cảnh báo giá không hợp lệ.
- Không để trường rỗng bị chuyển thành giá 0.

### 15.3. Bài viết

- Tiêu đề, slug, excerpt, nội dung, ảnh đại diện, danh mục, tác giả, ngày xuất bản.
- Meta title/description.
- Draft/published/archived.
- Preview và cảnh báo thiếu trường.
- Quy trình sửa nội dung đã index.
- Cập nhật `lastmod` khi nội dung thực sự thay đổi.

### 15.4. Media library

- Xem ảnh, tìm kiếm theo tên/alt.
- Đổi alt text.
- Hiển thị dung lượng/kích thước.
- Hạn chế xóa ảnh đang dùng.
- Sinh thumbnail/responsive variants nếu cần.
- Tối ưu ảnh trước/trong pipeline upload.
- Không tải ảnh gốc nhiều MB vào mọi vị trí.

### 15.5. Dashboard

- Số yêu cầu mới.
- Yêu cầu theo trạng thái.
- Bài viết/dịch vụ đang xuất bản.
- Lối tắt tạo nội dung.
- Thông báo lỗi hệ thống ở mức phù hợp.

Không tự tạo số liệu doanh thu/cuộc gọi/khách đã phục vụ nếu hệ thống không thu thập đáng tin cậy.

## 16. Theo dõi chuyển đổi và analytics

### 16.1. Event gợi ý

- `click_call_header`
- `click_call_mobile_bar`
- `click_call_contact`
- `submit_rescue_request`
- `rescue_request_success`
- `click_directions`
- `view_service`
- `view_price`

Chuẩn hóa event theo nền tảng analytics được chọn.

### 16.2. Quy tắc

- Click-call chỉ là lượt bấm.
- Không gửi số điện thoại, mô tả sự cố, địa chỉ chính xác hoặc PII vào analytics.
- Không coi page view trang thành công là một cuộc cứu hộ hoàn tất.
- Muốn biết cuộc gọi kết nối cần dữ liệu call tracking/điện thoại phù hợp.
- UTM không được chứa dữ liệu cá nhân.
- So sánh hiệu quả theo landing page, source/medium, device và khu vực ở mức tổng hợp.

### 16.3. KPI

**SEO:** organic clicks/impressions, CTR theo query/page, số trang index hợp lệ, truy vấn dịch vụ/khu vực, landing page tạo click-call/form.

**Google Business Profile:** lượt xem hồ sơ, lượt gọi/chỉ đường/website nếu có, review thật và thông tin nhất quán.

**Conversion:** click-call, form thành công, cuộc gọi kết nối nếu có dữ liệu thực, yêu cầu được tiếp nhận/xử lý, tỷ lệ spam.

Không đặt mục tiêu tuyệt đối khi chưa có baseline. Thu thập dữ liệu nền trước rồi đặt mục tiêu theo tháng/quý.

## 17. Hình ảnh và tài sản

- Kiểm kê logo, banner, ảnh dịch vụ, hoạt động và bài viết.
- Xác minh quyền sử dụng.
- Ưu tiên ảnh thật của đơn vị.
- Tạo WebP/AVIF khi phù hợp.
- Tạo nhiều kích thước cho desktop/mobile.
- Nén ảnh nhưng giữ chất lượng cần thiết.
- Đặt tên file mô tả tự nhiên, không nhồi từ khóa.
- Alt text mô tả đúng nội dung; ảnh trang trí dùng alt rỗng.
- Không dùng ảnh stock giả làm xe/đội ngũ/địa điểm thật.
- Logo có bản SVG nếu phù hợp; SVG upload từ admin cần kiểm soát bảo mật.
- Favicon đủ định dạng/kích thước và kiểm tra trên nền sáng/tối.

## 18. Testing strategy

### 18.1. Frontend

- Render component.
- Loading/error/empty states.
- Form validation.
- Nút gọi có `tel:` đúng.
- Mobile navigation.
- Metadata từng trang.
- Slug không tồn tại.
- API lỗi.
- Accessibility cơ bản.

### 18.2. Backend

- Public API chỉ trả dữ liệu published.
- Admin API yêu cầu xác thực.
- Authorization theo role.
- Validation đúng.
- Slug unique.
- Upload hợp lệ/không hợp lệ.
- Rate limit form/login.
- Tạo rescue request thành công.
- Public request không nhận trường nội bộ.
- Không lộ yêu cầu của khách khác.
- Redirect không tạo loop nếu có kiểm tra tự động.
- Database constraints.

### 18.3. E2E bắt buộc

1. Vào trang chủ trên mobile.
2. Bấm hotline và kiểm tra `tel:`.
3. Mở trang dịch vụ.
4. Mở bài viết.
5. Gửi form hợp lệ.
6. Gửi form không hợp lệ.
7. Đăng nhập admin.
8. Tạo bài draft.
9. Xuất bản bài.
10. Kiểm tra bài xuất hiện public.
11. Sửa slug và xác nhận redirect.
12. Đăng xuất và thử gọi admin API.

### 18.4. Performance và SEO tests

- Lighthouse trang chủ, dịch vụ, bài viết, bảng giá.
- Kiểm tra mobile profile.
- Kiểm tra kích thước JS/CSS, ảnh LCP, layout shift.
- Crawl site staging.
- Kiểm tra status code, title/H1/canonical, link gãy, sitemap, robots, redirect, schema và `noindex` staging.
- Kiểm tra trang 404 trả đúng HTTP status.

## 19. Environments và cấu hình

### 19.1. Môi trường

- `local`: phát triển máy cá nhân.
- `staging`: kiểm thử gần production.
- `production`: website thật.

Không dùng database production để phát triển local.

### 19.2. Frontend `.env.example`

```env
NUXT_PUBLIC_SITE_URL=https://example.com
NUXT_PUBLIC_API_BASE=https://api.example.com/api/v1
NUXT_PUBLIC_ANALYTICS_ID=
```

### 19.3. Backend `.env.example`

```env
APP_NAME="Cuu Ho Giao Thong"
APP_ENV=local
APP_DEBUG=true
APP_URL=http://localhost

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=cuuho_dev
DB_USERNAME=
DB_PASSWORD=

FRONTEND_URL=http://localhost:3000
SESSION_SECURE_COOKIE=false
```

Đây là biến mẫu; tên biến cuối cùng phải khớp cấu hình Nuxt/Laravel. Production secrets phải đặt trên server, không commit vào Git.

### 19.4. Domain/CORS

Chốt trước deploy:

- Domain frontend production.
- API domain hoặc path reverse proxy.
- Cookie domain nếu dùng session.
- CORS origins chính xác.
- HTTPS cho mọi endpoint.
- Quy tắc www/non-www.
- HTTP → HTTPS.
- Canonical host duy nhất.
- Không mở CORS mọi origin nếu không cần.

## 20. Deploy VPS

### 20.1. Mô hình

Có thể chạy Nuxt bằng Node process được quản lý qua systemd/PM2 và Laravel qua PHP-FPM; Nginx làm reverse proxy. Hoặc dùng prerender/static cho phần public nếu phù hợp. Chọn phương án sau khi xác minh thông số VPS, domain, PHP/Node và nhu cầu dữ liệu.

### 20.2. Checklist server

- [ ] Ubuntu/packages cập nhật.
- [ ] Tài khoản deploy không dùng root cho công việc thường ngày.
- [ ] SSH được bảo vệ.
- [ ] Firewall chỉ mở port cần thiết.
- [ ] Nginx host/redirect đúng.
- [ ] SSL hợp lệ và tự gia hạn.
- [ ] PHP-FPM và Node runtime đúng phiên bản.
- [ ] Process frontend tự khởi động lại.
- [ ] Scheduler/queue chỉ bật nếu cần.
- [ ] File permission phù hợp.
- [ ] `.env` production có quyền truy cập hạn chế.
- [ ] `APP_DEBUG=false`.
- [ ] Không public `.env`, logs, backups hoặc source map nhạy cảm.
- [ ] MySQL không mở port public nếu không cần.
- [ ] Backup database và media.
- [ ] Log rotation.
- [ ] Theo dõi disk/RAM/CPU.
- [ ] Có hướng dẫn rollback.

### 20.3. CI/CD

Giai đoạn đầu có thể deploy thủ công có kiểm soát; sau đó thêm GitHub Actions:

1. Checkout code.
2. Cài dependencies theo lockfile.
3. Lint/typecheck.
4. Chạy tests.
5. Build frontend.
6. Deploy staging.
7. Smoke tests.
8. Phê duyệt production deploy.
9. Backup và deploy production.
10. Chạy migration đã review.
11. Health check.
12. Rollback nếu lỗi nghiêm trọng.

Không chạy migration phá hủy dữ liệu mà không backup và review.

### 20.4. Rollback

- Lưu artifact/release trước đó.
- Backup database trước migration quan trọng.
- Tách deploy code khỏi thao tác dữ liệu phá hủy.
- Ưu tiên migration backward-compatible.
- Có hướng dẫn chuyển traffic về bản cũ.
- Kiểm tra URL, API, hotline và form sau rollback.
- Không xóa dữ liệu mới trước khi đánh giá tác động.

## 21. Migration từ website cũ

### 21.1. Trước migration

- [ ] Chốt domain production.
- [ ] Crawl website cũ.
- [ ] Lưu URL/status/title/meta/H1/canonical.
- [ ] Xuất nội dung và media.
- [ ] Lưu dữ liệu Search Console/analytics.
- [ ] Xác nhận hotline, giờ hoạt động và khu vực.
- [ ] Chốt URL giữ nguyên/đổi.
- [ ] Tạo redirect map.
- [ ] Chuẩn bị staging được chặn index.
- [ ] Kiểm tra dữ liệu test không chứa thông tin nhạy cảm.

### 21.2. Redirect map

Tạo `docs/seo-migration.md`:

| URL cũ | URL mới | Lý do | Redirect | Đã test |
|---|---|---|---|---|
| `/duong-dan-cu/` | `/duong-dan-moi/` | Nội dung tương đương | 301 | ☐ |

- Redirect 301 từng URL đổi.
- Tránh A → B → C; ưu tiên A → C.
- Tránh loop.
- Không redirect trang không liên quan về homepage.
- Giữ URL cũ nếu vẫn dùng tốt.
- Cập nhật internal links sang URL canonical mới.

### 21.3. Staging

- Bảo vệ bằng auth/IP allowlist nếu phù hợp.
- `noindex` là lớp bổ sung, không thay thế bảo vệ staging khi cần.
- Không đưa staging vào sitemap production.
- Không để canonical trỏ staging URL.
- Không gửi email/tin nhắn thật ngoài ý muốn.
- Dùng dữ liệu test khi có thể.

### 21.4. Go-live

1. Đóng băng thay đổi nội dung trên website cũ trong khoảng chuyển đổi.
2. Backup code, database và media.
3. Deploy bản mới.
4. Chạy migration đã kiểm tra.
5. Bật redirect map.
6. Chốt canonical host và HTTPS.
7. Kiểm tra trang chủ, dịch vụ, giá, form và hotline.
8. Kiểm tra robots/sitemap/noindex.
9. Submit sitemap trong Search Console.
10. Kiểm tra URL Inspection cho trang quan trọng.
11. Theo dõi 404, 5xx, form lỗi, redirect loop và tốc độ.
12. Giữ bản cũ có thể khôi phục trong thời gian phù hợp.

### 21.5. Sau go-live

Theo dõi hằng ngày trong tuần đầu, sau đó hằng tuần:

- 404/5xx.
- Redirect.
- Indexing.
- Organic clicks/impressions.
- Click-call/form.
- Lỗi frontend/API.
- SSL.
- Tốc độ.
- Phản hồi khách hàng.

Không kết luận migration thành công/thất bại chỉ sau một ngày; phân biệt biến động ngắn hạn với lỗi kỹ thuật rõ ràng.

## 22. Git và coding standards

### 22.1. Branching

- `main`: code ổn định.
- `develop`: tích hợp nếu cần.
- `feature/...`: tính năng.
- `fix/...`: sửa lỗi.
- `hotfix/...`: lỗi production khẩn cấp.

Với một người phát triển, có thể đơn giản hóa branching nhưng nên commit nhỏ và rõ.

### 22.2. Commit message

- `feat(frontend): add service detail page`
- `feat(api): add rescue request endpoint`
- `fix(seo): correct canonical URL generation`
- `perf(images): optimize homepage assets`
- `test(api): cover public service endpoints`

### 22.3. Code quality

- Chạy formatter/linter trước commit.
- Không để warning quan trọng tích tụ.
- Dùng TypeScript cho dữ liệu frontend.
- Thêm PHP static analysis khi phù hợp.
- Tránh `any` nếu có thể định nghĩa type.
- Không copy-paste business logic.
- Có loading/error/empty state.
- Không log secrets.
- Endpoint admin phải có test quyền.
- README phải hướng dẫn setup từ máy mới.

## 23. Roadmap theo phase

Thời lượng phụ thuộc số trang, dữ liệu, kinh nghiệm và hạ tầng; đây là thứ tự triển khai, không phải cam kết deadline.

### Phase 0 — Discovery & audit

- [ ] Xác nhận domain production.
- [ ] Xác nhận hotline.
- [ ] Xác nhận khu vực thực sự phục vụ.
- [ ] Xác nhận giờ hoạt động/24-7.
- [ ] Kiểm kê dịch vụ, bảng giá, bài viết, hình ảnh.
- [ ] Crawl URL cũ.
- [ ] Xác định landing pages SEO đang có.
- [ ] Xác định nội dung lỗi thời.
- [ ] Chốt sitemap trang mới.
- [ ] Chốt MVP và cách đo lường.

**Deliverables:** `docs/architecture.md`, URL inventory, content inventory, decision log.

**Done khi:** dữ liệu chưa xác minh được đánh dấu; phạm vi MVP được chốt.

### Phase 1 — Project foundation

- [ ] Tạo repository.
- [ ] Khởi tạo Nuxt.
- [ ] Khởi tạo Laravel.
- [ ] Tạo MySQL local.
- [ ] Thiết lập `.env.example`.
- [ ] Thiết lập lint/format/typecheck.
- [ ] Cấu hình API base.
- [ ] Chuẩn hóa response/error format.
- [ ] Tạo README setup.
- [ ] Thiết lập test runner.
- [ ] Tạo health endpoint.

**Done khi:** clone repository, cài dependencies, chạy frontend/backend và tests được theo README.

### Phase 2 — Design system & shell

- [ ] Chốt logo/màu/font.
- [ ] Dựng header/footer.
- [ ] Dựng navigation mobile.
- [ ] Dựng CTA/mobile call bar.
- [ ] Dựng button/input/card/alert.
- [ ] Dựng breadcrumbs.
- [ ] Dựng layout public/admin.
- [ ] Kiểm tra accessibility/responsive.

**Done khi:** component dùng chung ổn định ở viewport chính.

### Phase 3 — Public landing pages

- [ ] Trang chủ.
- [ ] Danh sách/chi tiết dịch vụ.
- [ ] Bảng giá.
- [ ] Khu vực và chi tiết khu vực có nội dung thật.
- [ ] Giới thiệu/liên hệ.
- [ ] FAQ.
- [ ] Trang 404.
- [ ] Loading/error/empty states.
- [ ] Metadata từng trang.
- [ ] Structured data phù hợp.

**Done khi:** trang public render đúng, link hoạt động, hotline đúng, nội dung SEO không phụ thuộc hoàn toàn vào client fetch.

### Phase 4 — Database & public API

- [ ] Migrations.
- [ ] Models/relations.
- [ ] Seed dữ liệu mẫu không nhạy cảm.
- [ ] Public services/prices/areas/posts/FAQ/business API.
- [ ] API resources.
- [ ] Validation.
- [ ] Pagination.
- [ ] Tests public API.

**Done khi:** frontend lấy dữ liệu API; API không lộ draft/private fields; tests đạt.

### Phase 5 — Admin CMS

- [ ] Authentication.
- [ ] Role/permission.
- [ ] Dashboard.
- [ ] CRUD dịch vụ.
- [ ] CRUD bảng giá.
- [ ] CRUD khu vực.
- [ ] CRUD bài viết.
- [ ] CRUD FAQ.
- [ ] Media upload.
- [ ] Business settings.
- [ ] Audit logs.
- [ ] Preview/slug conflict handling.
- [ ] Tests quyền admin.

**Done khi:** người được phân quyền cập nhật nội dung không cần sửa code; API được bảo vệ backend.

### Phase 6 — Rescue request form

- [ ] Form ngắn.
- [ ] Validation client/server.
- [ ] Rate limit.
- [ ] Chống spam.
- [ ] Reference code.
- [ ] Admin list/detail.
- [ ] Status updates.
- [ ] Privacy notice.
- [ ] Analytics không chứa PII.
- [ ] E2E tests.

**Done khi:** form tạo bản ghi chính xác, chống lạm dụng cơ bản, không lộ dữ liệu và vẫn có CTA gọi.

### Phase 7 — SEO migration & content

- [ ] Nhập nội dung cần giữ.
- [ ] Giữ URL cũ khi có thể.
- [ ] Hoàn tất redirect map.
- [ ] Metadata/canonical.
- [ ] Sitemap/robots.
- [ ] Breadcrumbs/internal links.
- [ ] Schema.
- [ ] Kiểm tra 404/soft 404.
- [ ] Kiểm tra title/H1.
- [ ] Kiểm tra duplicate content.
- [ ] Kiểm tra link gãy.

**Done khi:** URL cũ quan trọng có phương án; trang mới indexable đúng; staging không bị index.

### Phase 8 — Performance & quality

- [ ] Tối ưu ảnh.
- [ ] Giảm JS không cần thiết.
- [ ] Kiểm tra font.
- [ ] Kiểm tra LCP/INP/CLS.
- [ ] Lighthouse mobile.
- [ ] Accessibility review.
- [ ] Security review.
- [ ] E2E smoke tests.
- [ ] Cross-browser.
- [ ] Error logging.

**Done khi:** không có blocker; vấn đề hiệu năng lớn đã được xử lý hoặc có quyết định rõ.

### Phase 9 — Deployment & launch

- [ ] Chuẩn bị VPS.
- [ ] Nginx/SSL.
- [ ] Cấu hình PHP/Node/MySQL.
- [ ] Environment production.
- [ ] Backup.
- [ ] Deploy staging.
- [ ] UAT.
- [ ] Deploy production.
- [ ] Kiểm tra hotline/form.
- [ ] Submit sitemap.
- [ ] Theo dõi logs/Search Console.
- [ ] Kiểm tra rollback.

**Done khi:** site chạy domain thật, HTTPS hợp lệ, form/hotline đúng, sitemap/redirect hoạt động và có rollback.

### Phase 10 — Improve after launch

- [ ] Đánh giá Search Console.
- [ ] Xem landing page tạo chuyển đổi.
- [ ] Cải thiện trang có impression nhưng CTR thấp.
- [ ] Sửa trang có traffic nhưng ít chuyển đổi.
- [ ] Cập nhật FAQ từ câu hỏi khách thật.
- [ ] Kiểm tra ảnh/nội dung lỗi thời.
- [ ] Rà soát bảo mật/dependencies.
- [ ] Kiểm tra backup restore định kỳ.
- [ ] Chỉ thêm tính năng dựa trên nhu cầu thực.

## 24. Acceptance criteria tổng thể

### Website công khai

- [ ] Trang chính hiển thị tốt trên mobile.
- [ ] Hotline chính xác và hoạt động qua `tel:`.
- [ ] Dịch vụ, giá, khu vực và thông tin doanh nghiệp đã xác minh.
- [ ] Không có link `href="#"` giả làm điều hướng.
- [ ] Trang không tồn tại trả 404.
- [ ] Form có loading/success/error state.
- [ ] Nội dung SEO quan trọng có trong HTML server-rendered.
- [ ] Title/H1/description/canonical đúng.
- [ ] Sitemap/robots hợp lệ.
- [ ] Không có dữ liệu demo/placeholder trên production.
- [ ] Không có claim không xác minh.

### Admin

- [ ] Chỉ user xác thực mới gọi được admin endpoint.
- [ ] Authorization ở backend.
- [ ] CRUD có validation.
- [ ] Draft không xuất hiện public.
- [ ] Upload được kiểm tra.
- [ ] Hành động quan trọng có audit log.
- [ ] Không lộ secret trong frontend/log.

### SEO migration

- [ ] URL cũ quan trọng đã kiểm kê.
- [ ] Redirect map đã test.
- [ ] Không redirect loop.
- [ ] Internal links dùng canonical URL.
- [ ] Không vô tình noindex production.
- [ ] Staging không bị index.
- [ ] Sitemap chỉ chứa URL public canonical.
- [ ] Search Console xác minh và sitemap đã gửi sau launch.

### Production

- [ ] HTTPS.
- [ ] Backup và kiểm tra khôi phục.
- [ ] Logging/health check.
- [ ] Secrets an toàn.
- [ ] Có hướng dẫn deploy/rollback.
- [ ] Form/API hoạt động sau deploy.
- [ ] Có người chịu trách nhiệm theo dõi sau launch.

## 25. Rủi ro và cách giảm thiểu

| Rủi ro | Tác động | Biện pháp |
|---|---|---|
| Đổi URL không kiểm soát | Mất traffic/tín hiệu SEO | URL inventory, giữ URL, redirect đúng |
| Nội dung khu vực trùng lặp | SEO kém | Chỉ tạo trang có giá trị địa phương riêng |
| Client-fetch toàn bộ nội dung | UX/SEO chậm | SSR/SSG nội dung chính |
| Hotline không nhất quán | Mất khách/giảm tin cậy | Một nguồn cấu hình và kiểm tra NAP |
| Claim 24/7/ETA không thật | Mất uy tín/khiếu nại | Xác minh trước khi công bố |
| Form spam | Tốn công xử lý | Rate limit, validation, chống spam |
| Lộ dữ liệu khách | Rủi ro riêng tư | RBAC, log tối thiểu, retention policy |
| Upload file nguy hiểm | Rủi ro bảo mật | MIME/size validation, storage an toàn |
| VPS thiếu tài nguyên | Site chậm/gián đoạn | Đo tải, cache, giám sát, tối ưu ảnh |
| Không test backup restore | Không khôi phục được | Kiểm tra restore định kỳ |
| Analytics thu thập PII | Rủi ro riêng tư | Event tổng hợp, không gửi phone/location |
| Quá nhiều tính năng MVP | Chậm ra mắt | Ưu tiên hotline, SEO, CMS, form |
| Xóa nội dung cũ có giá trị | Mất traffic | Content inventory và mapping |

## 26. Quyết định cần chốt trước khi launch

Có thể bắt đầu scaffold trước khi trả lời hết, nhưng cần xác minh trước production:

1. Domain production chính xác và canonical host.
2. Hotline chính thức.
3. Có trực 24/7 thật không.
4. Khu vực thực sự phục vụ; Hải Phòng là trọng tâm, các địa phương khác có nhận thường xuyên không.
5. Danh sách dịch vụ chính xác.
6. Bảng giá: cố định, giá từ hay báo theo tình huống.
7. Địa chỉ doanh nghiệp có đủ điều kiện công khai/Google Business Profile không.
8. Số người quản trị và nhu cầu phân quyền.
9. Có cần form cứu hộ hay chỉ ưu tiên gọi điện.
10. Có cần thông báo yêu cầu qua email/SMS/Telegram không; chỉ thêm sau khi chốt kênh, quyền và chi phí.
11. Cấu hình VPS, OS, domain, Nginx, PHP/Node/MySQL.
12. GA4/Search Console/Google Business Profile hiện có hay cần thiết lập.
13. Nội dung cũ nào giữ, sửa hoặc bỏ.
14. Có giữ nhận diện “Cứu Hộ Giao Thông 123” và logo hiện tại không.

Ghi quyết định trong `docs/decision-log.md` để tránh thay đổi ngầm giữa dự án.

## 27. Checklist khởi động

### Phiên đầu tiên

- [ ] Tạo repository mới.
- [ ] Thêm `PLAN.md` và `README.md`.
- [ ] Tạo `.gitignore` cho Node/Nuxt, Laravel, IDE và environment.
- [ ] Tạo thư mục `docs/`.
- [ ] Ghi domain/hotline vào danh sách cần xác minh; không hardcode vào component.
- [ ] Khởi tạo `frontend/` bằng Nuxt.
- [ ] Khởi tạo `backend/` bằng Laravel.
- [ ] Tạo database local.
- [ ] Cấu hình `.env.example`.
- [ ] Chạy frontend/backend tối thiểu ở local.
- [ ] Commit nền tảng đầu tiên.

### Trước khi làm giao diện chi tiết

- [ ] Hoàn thành sitemap trang.
- [ ] Hoàn thành content inventory.
- [ ] Xác định CTA và thông tin liên hệ.
- [ ] Chốt design tokens.
- [ ] Tạo header/footer/mobile call bar.
- [ ] Xác định cách render dữ liệu SEO.

### Trước khi public dữ liệu API

- [ ] Migration đã review.
- [ ] API Resource đã định nghĩa.
- [ ] Public API chỉ trả dữ liệu published.
- [ ] Validation và tests cơ bản có.
- [ ] Không lộ dữ liệu admin.
- [ ] Có xử lý trạng thái lỗi API.

### Trước production

- [ ] Không còn dữ liệu demo.
- [ ] Hotline/domain/khu vực/giờ hoạt động đã xác minh.
- [ ] SEO migration map hoàn chỉnh.
- [ ] Redirect/sitemap/robots/canonical đã test.
- [ ] Security checklist hoàn thành.
- [ ] Backup/rollback có thể thực hiện.
- [ ] Form và nút gọi đã kiểm tra trên điện thoại thật.

## 28. Định nghĩa thành công

Dự án sẵn sàng khi:

1. Khách tại Hải Phòng vào website trên điện thoại, hiểu nhanh dịch vụ và gọi hotline thuận tiện.
2. Dịch vụ, giá, khu vực và bài viết được quản lý qua admin.
3. Kiến trúc Nuxt + Laravel REST API + MySQL rõ ràng, dễ bảo trì.
4. Trang public render tốt cho người dùng và công cụ tìm kiếm.
5. SEO migration giữ URL khi có thể và redirect đúng khi cần.
6. Không có dữ liệu giả, claim không xác minh hoặc thông tin liên hệ không nhất quán.
7. Có kiểm thử, logging, backup, deploy và rollback.
8. Đo lường được click-call, form và organic performance mà không thu thập dữ liệu cá nhân không cần thiết.

**Ưu tiên cuối cùng:** xây dựng một website đáng tin, nhanh, dễ gọi và dễ quản trị. Chỉ mở rộng tính năng khi có nhu cầu thực tế; không hy sinh tốc độ, khả năng sử dụng và SEO để chạy theo công nghệ mới.
