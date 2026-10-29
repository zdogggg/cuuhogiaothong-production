"""Sinh các trang dịch vụ tĩnh (mỗi dịch vụ một thư mục /<slug>/index.html) cho SEO.

Sửa nội dung trong SERVICES rồi chạy lại:
    python scripts/build_service_pages.py

Đổi tên miền: sửa SITE_URL (hoặc chạy scripts/set_domain.py để đổi đồng loạt mọi file).
"""
import html
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SITE_URL = "https://zdogggg.github.io/cuuhogiaothong-production"
PHONE = "0979032589"
PHONE_DISPLAY = "0979 032 589"
BRAND = "Cứu Hộ Giao Thông 123"
ASSET_V = "6"  # tăng khi sửa css/style.css hoặc js/main.js

AREAS = "Hồng Bàng, Lê Chân, Ngô Quyền, Hải An, Kiến An, Dương Kinh, Đồ Sơn, An Dương, Thủy Nguyên, Hải Dương và các tỉnh lân cận như Quảng Ninh, Thái Bình"

SERVICES = [
    {
        "slug": "keo-xe-o-to-hai-phong",
        "name": "Kéo xe ô tô",
        "h1": "Kéo xe ô tô Hải Phòng 24/7",
        "title": "Kéo Xe Ô Tô Hải Phòng 24/7 – Xe Sàn Trượt | Gọi 0979 032 589",
        "description": "Dịch vụ kéo xe ô tô tại Hải Phòng bằng xe sàn trượt, trực 24/7. Chở xe hỏng về gara, hãng hoặc địa điểm bạn chọn. Gọi 0979 032 589 để được báo giá.",
        "icon": "fa-truck-pickup",
        "image": "xe-cuu-ho2.webp",
        "image_alt": "Xe cứu hộ sàn trượt chở ô tô SUV màu trắng tại Hải Phòng",
        "intro": "Xe chết máy, tai nạn, ngập nước hay hỏng hộp số không thể tự di chuyển? Cứu Hộ Giao Thông 123 nhận kéo xe ô tô tại Hải Phòng bằng <strong>xe sàn trượt</strong>: ô tô được đưa hẳn lên sàn xe, không kéo lê bánh, hạn chế hư hỏng hộp số và gầm xe.",
        "when": [
            "Xe không nổ máy, đã thử kích bình nhưng không được",
            "Xe gặp va chạm, hỏng hệ thống lái, phanh hoặc không đủ an toàn để chạy tiếp",
            "Xe bị ngập nước, chết máy giữa đường ngập",
            "Hỏng hộp số, gãy láp, xe không vào số được",
            "Cần chuyển xe về gara, đại lý hãng hoặc về nhà",
        ],
        "steps": [
            "Gọi <a href=\"tel:0979032589\">0979 032 589</a> hoặc nhắn Zalo, cho biết vị trí, loại xe và tình trạng.",
            "Nhân viên báo giá và thời gian dự kiến đến nơi trước khi xe xuất phát.",
            "Xe sàn trượt tới, cố định ô tô lên sàn bằng dây chằng chuyên dụng.",
            "Chở xe tới gara hoặc địa điểm bạn chọn, bàn giao và thanh toán.",
        ],
        "price_factors": "quãng đường từ vị trí xe tới nơi giao, loại xe (xe con, SUV, bán tải), thời điểm (ban đêm, ngày lễ) và tình trạng xe (xe bị lật, sa lầy cần cẩu kéo).",
        "faqs": [
            ("Kéo xe ô tô ở Hải Phòng hết bao nhiêu tiền?", "Giá phụ thuộc quãng đường, loại xe và tình trạng xe. Bạn gọi 0979 032 589, nhân viên sẽ báo giá cụ thể trước khi xe xuất phát để bạn quyết định."),
            ("Xe sàn trượt có làm hỏng xe số tự động không?", "Không. Xe sàn trượt chở toàn bộ ô tô trên sàn, các bánh không lăn trên đường nên không ảnh hưởng hộp số tự động như cách kéo treo đầu."),
            ("Có kéo xe đi tỉnh khác không?", "Có nhận kéo xe từ Hải Phòng đi các tỉnh lân cận. Gọi để được báo giá theo quãng đường."),
            ("Tôi có cần đi cùng xe không?", "Nên có người bàn giao xe lúc nhận. Nếu không đi cùng được, hãy báo trước để thống nhất cách bàn giao tại nơi đến."),
        ],
    },
    {
        "slug": "kich-binh-ac-quy-hai-phong",
        "name": "Kích bình ắc quy",
        "h1": "Kích bình ắc quy ô tô tại Hải Phòng",
        "title": "Kích Bình Ắc Quy Ô Tô Hải Phòng – Xe Không Đề Được | Gọi 0979 032 589",
        "description": "Ô tô không đề được, ắc quy yếu ở Hải Phòng? Cứu Hộ Giao Thông 123 đến tận nơi kích bình, kiểm tra ắc quy, trực 24/7. Gọi 0979 032 589.",
        "icon": "fa-car-battery",
        "image": "xe-cuu-ho4.webp",
        "image_alt": "Xe cứu hộ bật đèn làm việc ban đêm tại Hải Phòng",
        "intro": "Vặn chìa khóa hoặc bấm nút khởi động mà xe chỉ kêu tạch tạch, đèn táp-lô mờ? Nhiều khả năng ắc quy đã yếu. Cứu Hộ Giao Thông 123 đến tận nơi <strong>kích bình ắc quy</strong> để xe nổ máy lại, đồng thời kiểm tra sơ bộ để bạn biết có cần thay ắc quy hay không.",
        "when": [
            "Xe không đề được, đề máy kêu yếu hoặc kêu tạch tạch",
            "Quên tắt đèn, bật điều hòa lâu khi không nổ máy",
            "Xe để lâu không chạy, ắc quy tự xả hết điện",
            "Trời lạnh, ắc quy cũ yếu đi rõ rệt",
        ],
        "steps": [
            "Gọi <a href=\"tel:0979032589\">0979 032 589</a>, cho biết vị trí và dòng xe.",
            "Nhân viên báo giá và thời gian đến.",
            "Kỹ thuật viên đấu bình kích đúng cực, khởi động xe.",
            "Kiểm tra sơ bộ ắc quy, tư vấn có cần thay hay sạc lại.",
        ],
        "price_factors": "khoảng cách tới vị trí xe và thời điểm gọi. Nếu ắc quy hỏng hẳn cần thay mới, tiền ắc quy được báo riêng trước khi làm.",
        "faqs": [
            ("Làm sao biết xe không đề được là do ắc quy?", "Dấu hiệu thường gặp: đề kêu yếu hoặc kêu tạch tạch, đèn táp-lô mờ hoặc chập chờn. Nếu đề vẫn quay khỏe mà không nổ, nguyên nhân có thể ở hệ thống nhiên liệu hoặc đánh lửa — hãy mô tả khi gọi để được tư vấn."),
            ("Kích bình xong có đi tiếp được không?", "Thường đi tiếp được. Nên để xe chạy một lúc để máy phát sạc lại ắc quy và kiểm tra ắc quy sớm nếu đã cũ."),
            ("Có thay ắc quy tại chỗ không?", "Có thể hỗ trợ tùy dòng xe. Hãy báo dòng xe khi gọi để chuẩn bị ắc quy phù hợp và báo giá trước."),
        ],
    },
    {
        "slug": "thay-lop-o-to-hai-phong",
        "name": "Thay lốp ô tô lưu động",
        "h1": "Thay lốp ô tô lưu động tại Hải Phòng",
        "title": "Thay Lốp Ô Tô Lưu Động Hải Phòng – Thủng, Nổ Lốp | Gọi 0979 032 589",
        "description": "Thủng lốp, nổ lốp giữa đường ở Hải Phòng? Đội cứu hộ đến tận nơi thay lốp dự phòng, hỗ trợ sự cố lốp 24/7. Gọi 0979 032 589.",
        "icon": "fa-dharmachakra",
        "image": "xe-cuu-ho5.webp",
        "image_alt": "Ô tô màu trắng trên sàn xe cứu hộ",
        "intro": "Lốp bị thủng, xẹp hoặc nổ khi đang đi đường là sự cố hay gặp nhưng tự thay lại không dễ, nhất là trên cao tốc hay vào ban đêm. Cứu Hộ Giao Thông 123 đến tận nơi <strong>thay lốp dự phòng</strong> và hỗ trợ xử lý sự cố lốp để bạn đi tiếp an toàn.",
        "when": [
            "Lốp bị đinh, thủng, xẹp hơi không thể chạy tiếp",
            "Nổ lốp khi đang di chuyển",
            "Không có dụng cụ hoặc không tháo được ốc bánh",
            "Xe không có lốp dự phòng — cần chở xe về gara",
        ],
        "steps": [
            "Đưa xe vào lề an toàn, bật đèn khẩn cấp, đặt biển cảnh báo nếu có.",
            "Gọi <a href=\"tel:0979032589\">0979 032 589</a>, báo vị trí, dòng xe và xe có lốp dự phòng hay không.",
            "Kỹ thuật viên đến thay lốp dự phòng hoặc hỗ trợ xử lý tại chỗ.",
            "Trường hợp không xử lý tại chỗ được, chở xe về gara gần nhất.",
        ],
        "price_factors": "khoảng cách tới vị trí xe và thời điểm gọi. Tiền lốp mới (nếu cần) chưa gồm trong phí cứu hộ và được báo trước.",
        "faqs": [
            ("Xe không có lốp dự phòng thì sao?", "Bạn báo khi gọi để được tư vấn: hỗ trợ tại chỗ nếu có thể, hoặc chở xe bằng xe sàn trượt về gara gần nhất."),
            ("Lốp dự phòng loại nhỏ (lốp tạm) đi được bao xa?", "Lốp tạm chỉ dùng để đi chậm tới gara gần nhất. Không nên chạy nhanh hay đi đường dài bằng lốp tạm."),
            ("Bị thủng lốp trên cao tốc phải làm gì?", "Bật đèn khẩn cấp, đưa xe vào làn dừng khẩn cấp, mọi người ra khỏi xe đứng sau rào chắn, đặt biển cảnh báo phía sau xe rồi gọi cứu hộ."),
        ],
    },
    {
        "slug": "tiep-nhien-lieu-hai-phong",
        "name": "Tiếp nhiên liệu tận nơi",
        "h1": "Hết xăng giữa đường – tiếp nhiên liệu tận nơi tại Hải Phòng",
        "title": "Hết Xăng Giữa Đường Hải Phòng – Tiếp Nhiên Liệu Tận Nơi | Gọi 0979 032 589",
        "description": "Ô tô hết xăng, hết dầu giữa đường ở Hải Phòng? Cứu Hộ Giao Thông 123 mang nhiên liệu tới tận nơi, trực 24/7. Gọi 0979 032 589.",
        "icon": "fa-gas-pump",
        "image": "xe-cuu-ho1.webp",
        "image_alt": "Xe cứu hộ sàn trượt làm việc ban đêm",
        "intro": "Kim xăng về vạch đỏ mà chưa kịp tới cây xăng, xe đã chết máy giữa đường? Đừng cố đẩy xe hay đi bộ xa tìm cây xăng. Cứu Hộ Giao Thông 123 <strong>mang nhiên liệu tới tận nơi</strong> để xe đủ chạy tới trạm xăng gần nhất.",
        "when": [
            "Xe hết xăng hoặc hết dầu, chết máy giữa đường",
            "Xe dừng ở cao tốc, cầu, đường vắng xa cây xăng",
            "Ban đêm, cây xăng gần đó đã đóng cửa",
        ],
        "steps": [
            "Gọi <a href=\"tel:0979032589\">0979 032 589</a>, báo vị trí và loại nhiên liệu (xăng hay dầu diesel).",
            "Nhân viên báo giá và thời gian đến.",
            "Mang nhiên liệu tới, đổ vào xe và hỗ trợ khởi động lại.",
        ],
        "price_factors": "khoảng cách tới vị trí xe và thời điểm gọi. Tiền nhiên liệu tính riêng theo lượng đổ.",
        "faqs": [
            ("Hết dầu diesel có khởi động lại ngay được không?", "Một số xe máy dầu cần xả gió hệ thống nhiên liệu sau khi cạn dầu. Báo loại xe khi gọi để kỹ thuật viên chuẩn bị."),
            ("Đổ nhầm nhiên liệu thì có hỗ trợ không?", "Đổ nhầm xăng/dầu thì không nên nổ máy. Hãy gọi để được tư vấn — thường cần chở xe về gara để xử lý."),
        ],
    },
    {
        "slug": "sua-chua-o-to-luu-dong-hai-phong",
        "name": "Sửa chữa ô tô lưu động",
        "h1": "Sửa chữa ô tô lưu động tại Hải Phòng",
        "title": "Sửa Chữa Ô Tô Lưu Động Hải Phòng – Xử Lý Sự Cố Tại Chỗ | Gọi 0979 032 589",
        "description": "Xe hỏng giữa đường ở Hải Phòng? Kỹ thuật viên đến tận nơi kiểm tra, xử lý các lỗi nhẹ để xe đi tiếp; không sửa được thì chở về gara. Gọi 0979 032 589.",
        "icon": "fa-tools",
        "image": "xe-cuu-ho6.webp",
        "image_alt": "Xe cứu hộ chở ô tô màu đen về xưởng",
        "intro": "Không phải lúc nào xe hỏng cũng cần kéo về gara. Với các lỗi nhẹ, kỹ thuật viên của Cứu Hộ Giao Thông 123 có thể <strong>kiểm tra và xử lý ngay tại chỗ</strong> để xe đi tiếp. Nếu lỗi nặng, chúng tôi chở xe về gara bằng xe sàn trượt.",
        "when": [
            "Xe báo lỗi, rung giật, mất ga hoặc tự tắt máy",
            "Tuột hoặc đứt dây curoa, rò rỉ nước làm mát, xe báo nóng máy",
            "Lỗi điện cơ bản: cầu chì, đầu cọc bình lỏng, đèn không sáng",
            "Cần kiểm tra để biết xe có đi tiếp an toàn được không",
        ],
        "steps": [
            "Gọi <a href=\"tel:0979032589\">0979 032 589</a>, mô tả triệu chứng, đèn báo lỗi và dòng xe.",
            "Nhân viên tư vấn sơ bộ và báo giá kiểm tra trước khi đến.",
            "Kỹ thuật viên kiểm tra, xử lý tại chỗ nếu là lỗi nhẹ.",
            "Lỗi cần thiết bị chuyên dụng: chở xe về gara bạn chọn.",
        ],
        "price_factors": "khoảng cách, thời điểm và mức độ lỗi. Phụ tùng thay thế (nếu có) được báo giá riêng trước khi làm.",
        "faqs": [
            ("Xe báo nóng máy có nên chạy tiếp không?", "Không nên. Dừng xe ở chỗ an toàn, tắt máy, không mở nắp két nước khi máy còn nóng và gọi cứu hộ để kiểm tra."),
            ("Sửa tại chỗ không được thì sao?", "Chúng tôi chở xe bằng xe sàn trượt về gara hoặc đại lý bạn chọn."),
        ],
    },
    {
        "slug": "cuu-ho-xe-tai-hai-phong",
        "name": "Cứu hộ xe tải",
        "h1": "Cứu hộ xe tải, xe khách tại Hải Phòng",
        "title": "Cứu Hộ Xe Tải Hải Phòng 24/7 – Kéo Xe Tải, Xe Khách | Gọi 0979 032 589",
        "description": "Cứu hộ xe tải, xe khách gặp sự cố trên đường tại Hải Phòng, trực 24/7. Báo tải trọng xe khi gọi để điều đúng loại xe cứu hộ. Gọi 0979 032 589.",
        "icon": "fa-truck",
        "image": "xe-cuu-ho3.webp",
        "image_alt": "Hai xe cứu hộ sàn trượt đỗ tại bãi",
        "intro": "Xe tải, xe khách gặp sự cố trên đường cần được xử lý nhanh để tránh ách tắc và mất an toàn. Cứu Hộ Giao Thông 123 nhận <strong>cứu hộ xe tải, xe khách</strong> tại Hải Phòng và khu vực lân cận. Hãy báo loại xe và tải trọng khi gọi để chúng tôi điều đúng loại xe cứu hộ.",
        "when": [
            "Xe tải, xe khách chết máy, hỏng hộp số, hỏng phanh",
            "Xe gặp va chạm cần di dời khỏi hiện trường",
            "Xe sa lầy, trượt bánh khỏi mặt đường",
        ],
        "steps": [
            "Gọi <a href=\"tel:0979032589\">0979 032 589</a>, báo vị trí, loại xe, tải trọng và hàng hóa đang chở.",
            "Nhân viên xác nhận loại xe cứu hộ phù hợp và báo giá.",
            "Xe cứu hộ tới hiện trường, cố định và di chuyển xe.",
            "Đưa xe về gara hoặc bãi theo yêu cầu.",
        ],
        "price_factors": "tải trọng và kích thước xe, hàng hóa trên xe, quãng đường và điều kiện hiện trường.",
        "faqs": [
            ("Xe đang chở hàng có cứu hộ được không?", "Tùy tải trọng và loại hàng. Hãy báo rõ khi gọi để được tư vấn phương án phù hợp."),
            ("Cần chuẩn bị gì khi gọi cứu hộ xe tải?", "Vị trí chính xác, loại xe, tải trọng, tình trạng xe và số điện thoại người ở hiện trường."),
        ],
    },
]


def esc(s):
    return html.escape(s, quote=True)


def page(svc):
    url = f"{SITE_URL}/{svc['slug']}/"
    others = [s for s in SERVICES if s["slug"] != svc["slug"]]

    service_ld = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "Service",
                "name": svc["name"],
                "serviceType": svc["name"],
                "description": svc["description"],
                "url": url,
                "areaServed": ["Hải Phòng", "Quảng Ninh", "Thái Bình"],
                "provider": {
                    "@type": "AutomotiveBusiness",
                    "@id": f"{SITE_URL}/#business",
                    "name": BRAND,
                    "telephone": "+84979032589",
                    "url": f"{SITE_URL}/",
                },
            },
            {
                "@type": "BreadcrumbList",
                "itemListElement": [
                    {"@type": "ListItem", "position": 1, "name": "Trang chủ", "item": f"{SITE_URL}/"},
                    {"@type": "ListItem", "position": 2, "name": svc["name"], "item": url},
                ],
            },
        ],
    }

    when = "\n".join(f"                    <li>{esc(x)}</li>" for x in svc["when"])
    steps = "\n".join(f"                    <li>{x}</li>" for x in svc["steps"])
    faqs = "\n".join(
        f"""                <details class="faq-item">
                    <summary>{esc(q)}</summary>
                    <p>{esc(a)}</p>
                </details>""" for q, a in svc["faqs"]
    )
    related = "\n".join(
        f'                    <li><a href="../{s["slug"]}/"><i class="fas {s["icon"]}" aria-hidden="true"></i> {esc(s["name"])} Hải Phòng</a></li>'
        for s in others
    )
    footer_links = "\n".join(
        f'                        <li><a href="../{s["slug"]}/">{esc(s["name"])}</a></li>' for s in SERVICES
    )

    return f"""<!DOCTYPE html>
<html lang="vi">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <!-- Trang sinh tự động bởi scripts/build_service_pages.py — sửa nội dung ở đó rồi chạy lại -->
    <title>{esc(svc['title'])}</title>
    <meta name="description" content="{esc(svc['description'])}">
    <link rel="canonical" href="{url}">
    <meta property="og:title" content="{esc(svc['title'])}">
    <meta property="og:description" content="{esc(svc['description'])}">
    <meta property="og:image" content="{SITE_URL}/images/og-image.jpg">
    <meta property="og:url" content="{url}">
    <meta property="og:type" content="website">
    <meta property="og:locale" content="vi_VN">
    <meta name="theme-color" content="#d32f2f">
    <link rel="icon" href="../favicon.ico" sizes="any">
    <link rel="apple-touch-icon" href="../images/apple-touch-icon.png">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800;900&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="stylesheet" href="../css/style.css?v={ASSET_V}">
    <script type="application/ld+json">
{json.dumps(service_ld, ensure_ascii=False, indent=4)}
    </script>
</head>

<body class="service-page">
    <header class="header">
        <div class="container header-container">
            <a href="../" class="logo">
                <img src="../images/logo.webp" alt="Logo Cứu Hộ Giao Thông 123" width="50" height="50" style="height: 50px; width: auto;">
                <div class="logo-text">
                    <span class="logo-title">CỨU HỘ GIAO THÔNG 123</span>
                    <span class="logo-slogan">24/7 - Nhanh chóng - An Toàn - Uy Tín</span>
                </div>
            </a>
            <button class="menu-toggle" id="menuToggle" aria-label="Mở menu" aria-expanded="false" aria-controls="navMenu">
                <i class="fas fa-bars" aria-hidden="true"></i>
            </button>
            <nav class="nav-menu" id="navMenu">
                <a href="../">TRANG CHỦ</a>
                <a href="../#services" class="active">DỊCH VỤ</a>
                <a href="../#pricing">BẢNG GIÁ</a>
                <a href="../#areas">KHU VỰC HOẠT ĐỘNG</a>
                <a href="#contact">LIÊN HỆ</a>
            </nav>
            <a href="tel:{PHONE}" class="header-hotline">
                <div class="hotline-icon-box"><i class="fas fa-phone" aria-hidden="true"></i></div>
                <div class="hotline-text">
                    <span>HOTLINE 24/7</span>
                    <strong>{PHONE_DISPLAY}</strong>
                    <small>Gọi ngay - Báo giá &amp; thời gian đến</small>
                </div>
            </a>
        </div>
    </header>

    <main>
        <div class="container">
            <nav class="breadcrumb" aria-label="Breadcrumb">
                <a href="../">Trang chủ</a> <span aria-hidden="true">›</span> <span aria-current="page">{esc(svc['name'])}</span>
            </nav>
        </div>

        <section class="svc-hero">
            <div class="container svc-hero-grid">
                <div>
                    <h1>{esc(svc['h1'])}</h1>
                    <p class="svc-intro">{svc['intro']}</p>
                    <div class="svc-cta">
                        <a href="tel:{PHONE}" class="btn btn-primary"><i class="fas fa-phone" aria-hidden="true"></i>
                            <div class="btn-text"><span>GỌI NGAY 24/7</span><strong>{PHONE_DISPLAY}</strong></div></a>
                        <a href="https://zalo.me/{PHONE}" target="_blank" rel="noopener" class="btn btn-outline">
                            <div class="btn-text"><span>NHẮN ZALO</span><strong>{PHONE_DISPLAY}</strong></div></a>
                    </div>
                </div>
                <img src="../images/{svc['image']}" width="800" height="600" alt="{esc(svc['image_alt'])}" class="svc-hero-img" fetchpriority="high">
            </div>
        </section>

        <section class="container svc-body">
            <div class="svc-content">
                <h2>Khi nào cần gọi dịch vụ {esc(svc['name'].lower())}?</h2>
                <ul class="svc-list">
{when}
                </ul>

                <h2>Quy trình {esc(svc['name'].lower())}</h2>
                <ol class="svc-steps">
{steps}
                </ol>

                <h2>Giá {esc(svc['name'].lower())} tại Hải Phòng</h2>
                <p>Chi phí được <strong>báo trước qua điện thoại</strong>, trước khi xe xuất phát. Giá phụ thuộc {esc(svc['price_factors'])}
                    Xem thêm <a href="../#pricing">bảng giá tham khảo</a>.</p>

                <h2>Khu vực phục vụ</h2>
                <p>Trực 24/7 tại Hải Phòng: {esc(AREAS)}. Gọi <a href="tel:{PHONE}">{PHONE_DISPLAY}</a> để kiểm tra khu vực của bạn.</p>

                <h2>Câu hỏi thường gặp</h2>
{faqs}
            </div>

            <aside class="svc-aside">
                <div class="svc-call-box">
                    <p>Cần hỗ trợ ngay?</p>
                    <a href="tel:{PHONE}" class="btn btn-primary"><i class="fas fa-phone" aria-hidden="true"></i> {PHONE_DISPLAY}</a>
                    <small>Trực 24/7, kể cả lễ Tết</small>
                </div>
                <h2 class="svc-aside-title">Dịch vụ khác</h2>
                <ul class="svc-related">
{related}
                </ul>
            </aside>
        </section>
    </main>

    <footer class="footer" id="contact">
        <div class="container">
            <div class="footer-grid">
                <div class="footer-col">
                    <h2 class="footer-heading footer-logo-text">CỨU HỘ GIAO THÔNG 123</h2>
                    <p class="footer-desc">Dịch vụ cứu hộ ô tô 24/7 tại Hải Phòng: kéo xe, kích bình, thay lốp,
                        tiếp nhiên liệu, sửa chữa lưu động và cứu hộ xe tải.</p>
                </div>
                <div class="footer-col">
                    <h2 class="footer-heading">DỊCH VỤ</h2>
                    <ul class="footer-links">
{footer_links}
                    </ul>
                </div>
                <div class="footer-col contact-col">
                    <h2 class="footer-heading">LIÊN HỆ</h2>
                    <ul class="footer-contact">
                        <li><i class="fas fa-phone-alt" aria-hidden="true"></i> <a href="tel:{PHONE}">{PHONE_DISPLAY}</a></li>
                        <li><i class="fas fa-envelope" aria-hidden="true"></i> <a href="mailto:cuuhogiaothong@gmail.com">cuuhogiaothong@gmail.com</a></li>
                        <li><i class="fas fa-map-marker-alt" aria-hidden="true"></i> Km92 ngõ An Trì, Hồng Bàng, Hải Phòng, Việt Nam</li>
                    </ul>
                </div>
            </div>
            <div class="footer-bottom">
                <p>&copy; 2026 {BRAND}. All Rights Reserved.</p>
            </div>
        </div>
    </footer>

    <div class="floating-contact">
        <a href="https://zalo.me/{PHONE}" target="_blank" rel="noopener" class="float-btn float-zalo" aria-label="Chat Zalo">
            <img src="https://upload.wikimedia.org/wikipedia/commons/9/91/Icon_of_Zalo.svg" alt="" width="35" height="35" style="width: 35px; height: 35px;">
        </a>
        <a href="tel:{PHONE}" class="float-btn float-phone" aria-label="Gọi {PHONE_DISPLAY}">
            <i class="fas fa-phone-alt" aria-hidden="true"></i>
        </a>
    </div>

    <div class="mobile-call-bar">
        <a href="tel:{PHONE}" class="mcb-call"><i class="fas fa-phone-alt" aria-hidden="true"></i> GỌI NGAY {PHONE_DISPLAY}</a>
        <a href="https://zalo.me/{PHONE}" target="_blank" rel="noopener" class="mcb-zalo">ZALO</a>
    </div>

    <script src="../js/main.js?v={ASSET_V}" defer></script>
</body>

</html>
"""


def main():
    for svc in SERVICES:
        out = ROOT / svc["slug"] / "index.html"
        out.parent.mkdir(exist_ok=True)
        out.write_text(page(svc), encoding="utf-8", newline="\n")
        print("wrote", out.relative_to(ROOT))


if __name__ == "__main__":
    main()
