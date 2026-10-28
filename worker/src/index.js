// Cloudflare Worker nhận form "Yêu cầu cứu hộ" từ website và chuyển tiếp sang Telegram.
// Token bot chỉ nằm ở đây (Worker secret), không bao giờ xuất hiện trong code trình duyệt.
//
// Biến cần cấu hình (xem worker/README.md):
//   TELEGRAM_BOT_TOKEN  (secret)
//   TELEGRAM_CHAT_ID    (secret)
//   SITE_URL            (var)  vd: https://cuuho123.vn  — dùng để tạo link nhận cuốc cho tài xế
//   ALLOWED_ORIGINS     (var)  danh sách origin cách nhau bởi dấu phẩy
//   RATE_LIMITER        (binding, tùy chọn) giới hạn số lần gửi theo IP
//   FIREBASE_PROJECT_ID       (var)     project Firestore chứa collection "trackings"
//   FIREBASE_SERVICE_ACCOUNT  (secret, tùy chọn) JSON service account; thiếu thì bỏ qua việc dọn dẹp

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
    },

    // Chạy theo lịch (wrangler.toml → [triggers]): xoá dữ liệu tracking cũ hơn 24 giờ
    async scheduled(event, env, ctx) {
        ctx.waitUntil(cleanupTrackings(env));
    }
};

const TRACKING_TTL_MS = 24 * 60 * 60 * 1000;

async function cleanupTrackings(env) {
    if (!env.FIREBASE_SERVICE_ACCOUNT || !env.FIREBASE_PROJECT_ID) {
        console.log('cleanup skipped: missing FIREBASE_SERVICE_ACCOUNT or FIREBASE_PROJECT_ID');
        return 0;
    }
    const token = await getGoogleAccessToken(JSON.parse(env.FIREBASE_SERVICE_ACCOUNT));
    const docsRoot = `projects/${env.FIREBASE_PROJECT_ID}/databases/(default)/documents`;
    const api = `https://firestore.googleapis.com/v1/${docsRoot}`;
    const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };
    const cutoff = new Date(Date.now() - TRACKING_TTL_MS).toISOString();

    // Tìm cuốc có timestamp (serverTimestamp của trang tài xế) cũ hơn 24 giờ
    const res = await fetch(`${api}:runQuery`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
            structuredQuery: {
                from: [{ collectionId: 'trackings' }],
                where: { fieldFilter: { field: { fieldPath: 'timestamp' }, op: 'LESS_THAN', value: { timestampValue: cutoff } } },
                select: { fields: [] },
                limit: 500
            }
        })
    });
    if (!res.ok) throw new Error(`query failed ${res.status}: ${await res.text()}`);
    const names = (await res.json()).map(r => r.document && r.document.name).filter(Boolean);
    if (names.length === 0) return 0;

    const del = await fetch(`${api}:commit`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ writes: names.map(name => ({ delete: name })) })
    });
    if (!del.ok) throw new Error(`delete failed ${del.status}: ${await del.text()}`);
    console.log(`cleanup: removed ${names.length} old trackings`);
    return names.length;
}

// Đổi service account lấy access token Google (OAuth2 JWT bearer), ký RS256 bằng WebCrypto
async function getGoogleAccessToken(sa) {
    const now = Math.floor(Date.now() / 1000);
    const header = b64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
    const claims = b64url(JSON.stringify({
        iss: sa.client_email,
        scope: 'https://www.googleapis.com/auth/datastore',
        aud: 'https://oauth2.googleapis.com/token',
        iat: now,
        exp: now + 3600
    }));
    const pem = sa.private_key.replace(/-----[^-]+-----/g, '').replace(/\s+/g, '');
    const der = Uint8Array.from(atob(pem), c => c.charCodeAt(0));
    const key = await crypto.subtle.importKey('pkcs8', der, { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' }, false, ['sign']);
    const signature = await crypto.subtle.sign('RSASSA-PKCS1-v1_5', key, new TextEncoder().encode(`${header}.${claims}`));
    const jwt = `${header}.${claims}.${b64url(signature)}`;

    const res = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer', assertion: jwt })
    });
    if (!res.ok) throw new Error(`token failed ${res.status}: ${await res.text()}`);
    return (await res.json()).access_token;
}

function b64url(input) {
    const bytes = typeof input === 'string' ? new TextEncoder().encode(input) : new Uint8Array(input);
    let bin = '';
    bytes.forEach(b => { bin += String.fromCharCode(b); });
    return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

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
