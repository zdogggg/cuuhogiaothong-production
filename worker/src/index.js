// Cloudflare Worker nhận form "Yêu cầu cứu hộ" từ website và chuyển tiếp sang Telegram.
// Token bot chỉ nằm ở đây (Worker secret), không bao giờ xuất hiện trong code trình duyệt.
//
// Biến cần cấu hình (xem worker/README.md):
//   TELEGRAM_BOT_TOKEN  (secret)
//   TELEGRAM_CHAT_ID    (secret)
//   SITE_URL            (var)  vd: https://cuuho123.vn  — dùng để tạo link nhận cuốc cho tài xế
//   ALLOWED_ORIGINS     (var)  danh sách origin cách nhau bởi dấu phẩy
//   RATE_LIMITER        (binding, tùy chọn) giới hạn số lần gửi theo IP

const SERVICES = [
    'Kéo xe', 'Kích bình', 'Thay lốp', 'Tiếp nhiên liệu',
    'Sửa chữa lưu động', 'Cứu hộ xe tải', 'Khác'
];

export default {
    async fetch(request, env) {
        const origin = request.headers.get('Origin') || '';
        const allowed = (env.ALLOWED_ORIGINS || '').split(',').map(s => s.trim()).filter(Boolean);
        const originOk = allowed.includes(origin);
        const cors = {
            'Access-Control-Allow-Origin': originOk ? origin : (allowed[0] || ''),
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Vary': 'Origin'
        };

        if (request.method === 'OPTIONS') {
            return new Response(null, { status: 204, headers: cors });
        }
        if (request.method !== 'POST') {
            return json({ ok: false, error: 'method_not_allowed' }, 405, cors);
        }
        if (!originOk) {
            return json({ ok: false, error: 'forbidden_origin' }, 403, cors);
        }

        if (env.RATE_LIMITER) {
            const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
            const { success } = await env.RATE_LIMITER.limit({ key: ip });
            if (!success) return json({ ok: false, error: 'rate_limited' }, 429, cors);
        }

        let body;
        try {
            const raw = await request.text();
            if (raw.length > 4000) return json({ ok: false, error: 'too_large' }, 413, cors);
            body = JSON.parse(raw);
        } catch {
            return json({ ok: false, error: 'bad_json' }, 400, cors);
        }

        // Honeypot: ô ẩn mà người thật không điền. Bot điền vào thì giả vờ thành công.
        if (body.website) {
            return json({ ok: true, bookingId: makeBookingId() }, 200, cors);
        }

        const phone = normalizePhone(body.phone);
        const service = String(body.service || '');
        const location = clean(body.location, 300);
        const lat = toCoord(body.lat, 90);
        const lng = toCoord(body.lng, 180);

        if (!phone) return json({ ok: false, error: 'invalid_phone' }, 400, cors);
        if (!SERVICES.includes(service)) return json({ ok: false, error: 'invalid_service' }, 400, cors);
        if (!location) return json({ ok: false, error: 'invalid_location' }, 400, cors);

        const bookingId = makeBookingId();
        const time = new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' });
        const hasCoords = lat !== null && lng !== null;

        // Dữ liệu khách đặt sau dấu # để không bị gửi lên máy chủ web hay ghi vào log.
        const fragment = new URLSearchParams({ phone });
        if (hasCoords) { fragment.set('lat', lat); fragment.set('lng', lng); }
        const siteUrl = (env.SITE_URL || '').replace(/\/+$/, '');
        const driverLink = `${siteUrl}/driver.html?id=${bookingId}#${fragment}`;

        const lines = [
            '🚨 <b>YÊU CẦU CỨU HỘ MỚI</b> 🚨',
            '',
            `🔖 Mã cuốc: ${bookingId}`,
            `⏰ Thời gian: ${esc(time)}`,
            `📞 SĐT khách: ${esc(phone)}`,
            `🛠 Dịch vụ: ${esc(service)}`,
            `📍 Vị trí: ${esc(location)}`
        ];
        if (hasCoords) {
            lines.push(`🗺 Bản đồ: https://maps.google.com/?q=${lat},${lng}`);
        }
        lines.push('', `👉 <a href="${esc(driverLink)}">BẤM VÀO ĐÂY ĐỂ NHẬN CUỐC</a>`);

        const tg = await fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: env.TELEGRAM_CHAT_ID,
                text: lines.join('\n'),
                parse_mode: 'HTML',
                disable_web_page_preview: true
            })
        });

        if (!tg.ok) {
            // Không trả chi tiết lỗi Telegram về trình duyệt.
            console.error('Telegram error', tg.status, await tg.text());
            return json({ ok: false, error: 'send_failed' }, 502, cors);
        }

        return json({ ok: true, bookingId }, 200, cors);
    }
};

function json(data, status, headers) {
    return new Response(JSON.stringify(data), {
        status,
        headers: { ...headers, 'Content-Type': 'application/json; charset=utf-8' }
    });
}

// Số di động Việt Nam: 0xxxxxxxxx hoặc +84xxxxxxxxx, trả về dạng 0xxxxxxxxx.
function normalizePhone(value) {
    const digits = String(value || '').replace(/[\s.\-()]/g, '').replace(/^\+?84/, '0');
    return /^0[35789]\d{8}$/.test(digits) ? digits : null;
}

function toCoord(value, max) {
    if (value === null || value === undefined || value === '') return null;
    const n = Number(value);
    return Number.isFinite(n) && Math.abs(n) <= max ? n.toFixed(6) : null;
}

function clean(value, maxLen) {
    return String(value || '').replace(/\s+/g, ' ').trim().slice(0, maxLen);
}

function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// Mã cuốc ngẫu nhiên khó đoán, khớp rule Firebase: ^CH[A-Z0-9]{8}$
function makeBookingId() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    const bytes = crypto.getRandomValues(new Uint8Array(8));
    return 'CH' + Array.from(bytes, b => chars[b % chars.length]).join('');
}
