// Lấy bảng giá và logo/banner do admin cập nhật từ Cloud Firestore qua REST API (không cần tải SDK lớn trên trang chủ).
// Không có dữ liệu hoặc lỗi mạng thì giữ nguyên nội dung sẵn có trong HTML.
const FIRESTORE_API_BASE = 'https://firestore.googleapis.com/v1/projects/cuuhogiaothong123/databases/(default)/documents';

(function () {
    function esc(value) {
        return String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
    }

    function formatPrice(val) {
        if (!val) return '-';
        // Chỉ định dạng lại số nguyên (15000) hoặc số đã chia nghìn đúng kiểu (15.000);
        // số thập phân như "1.5tr" hay "1,5 triệu" giữ nguyên (trước đây "1.5tr" bị thành "15tr")
        let str = String(val).replace(/\d+(?:[.,]\d+)*/g, m => {
            if (!/^\d+$/.test(m) && !/^\d{1,3}(?:\.\d{3})+$/.test(m)) return m;
            const n = parseInt(m.replace(/\./g, ''), 10);
            return n >= 1000 ? n.toLocaleString('vi-VN') : m;
        });
        // Chưa ghi đơn vị (VNĐ, đồng, triệu, 500k, 1tr...) thì thêm "VNĐ" sau con số cuối: "15.000/km" → "15.000 VNĐ/km"
        if (/\d/.test(str) && !/vn[dđ]|đồng|triệu|nghìn|ngàn|\d\s?(?:đ|k|tr)(?!\p{L})/iu.test(str)) {
            str = str.replace(/(\d+(?:[.,]\d+)*)(?!.*\d)/, '$1 VNĐ');
        }
        return str;
    }

    function isSafeUrl(url) {
        return typeof url === 'string' && url.startsWith('https://');
    }

    function parseFirestoreDoc(doc) {
        if (!doc || !doc.fields) return null;
        const res = {};
        for (const [k, v] of Object.entries(doc.fields)) {
            if ('stringValue' in v) res[k] = v.stringValue;
            else if ('integerValue' in v) res[k] = parseInt(v.integerValue, 10);
            else if ('doubleValue' in v) res[k] = parseFloat(v.doubleValue);
            else if ('booleanValue' in v) res[k] = v.booleanValue;
            else if ('nullValue' in v) res[k] = null;
            else res[k] = Object.values(v)[0];
        }
        return res;
    }

    async function getFirestoreSettings() {
        try {
            const res = await fetch(`${FIRESTORE_API_BASE}/settings/general`);
            if (res.status === 404) return null; // admin chưa lưu cấu hình
            if (!res.ok) return undefined;
            const doc = await res.json();
            return parseFirestoreDoc(doc);
        } catch (e) {
            return undefined; // lỗi mạng: không lưu tạm, lần sau thử lại
        }
    }

    async function getFirestorePricing() {
        try {
            // pageSize: mặc định API chỉ trả một phần nếu có nhiều dòng giá
            const res = await fetch(`${FIRESTORE_API_BASE}/pricing?pageSize=200`);
            if (!res.ok) return undefined;
            const json = await res.json();
            if (!json.documents || !Array.isArray(json.documents)) return null;
            const items = {};
            json.documents.forEach(doc => {
                const id = doc.name.split('/').pop();
                const parsed = parseFirestoreDoc(doc);
                if (parsed) items[id] = parsed;
            });
            return items;
        } catch (e) {
            return undefined; // lỗi mạng: không lưu tạm, lần sau thử lại
        }
    }

    function renderPricing(data) {
        const wrapper = document.getElementById('publicPricingList');
        if (!wrapper || !data) return;
        const items = Object.values(data).filter(i => i && i.vehicle).sort((a, b) => (a.order || 0) - (b.order || 0));
        if (items.length === 0) return;

        const groups = {};
        items.forEach(item => {
            const name = item.group || 'Dịch vụ khác';
            (groups[name] = groups[name] || []).push(item);
        });

        let rows = '';
        for (const [groupName, groupItems] of Object.entries(groups)) {
            rows += `<tr class="group-row"><td colspan="5">${esc(groupName)}</td></tr>`;
            groupItems.forEach(item => {
                const details = String(item.description || '').split(/\r?\n|\\n/).map(l => l.trim()).filter(Boolean);
                const detailsHTML = details.length ? `<ul class="details-list">${details.map(l => `<li>${esc(l)}</li>`).join('')}</ul>` : '';
                rows += `
                    <tr>
                        <td class="vehicle-name" data-label="Loại xe">${esc(item.vehicle)}</td>
                        <td class="price-val" data-label="Cơ bản (dưới 10km)" style="color: #d32f2f;">${esc(formatPrice(item.basePrice))}</td>
                        <td class="price-val" data-label="Vượt (từ 11km)">${esc(formatPrice(item.extraPrice))}</td>
                        <td data-label="" style="text-align: center;"><a href="tel:0979032589" class="btn-call-now">Gọi ngay</a></td>
                        <td data-label="Chi tiết" class="${detailsHTML ? '' : 'is-empty'}">${detailsHTML}</td>
                    </tr>`;
            });
        }

        wrapper.innerHTML = `
            <table class="pricing-table">
                <thead>
                    <tr>
                        <th style="width: 20%;">Loại xe cần cứu hộ</th>
                        <th style="width: 20%;">Chi phí cứu hộ cơ bản<br><small>(Dưới 10Km)</small></th>
                        <th style="width: 20%;">Cước phí vượt giới hạn<br><small>(Từ 11Km trở đi)</small></th>
                        <th style="width: 15%;">Liên hệ</th>
                        <th style="width: 25%;">Loại xe</th>
                    </tr>
                </thead>
                <tbody>${rows}</tbody>
            </table>`;
    }

    function applySettings(data) {
        if (!data) return;
        const mainLogo = document.getElementById('mainLogoImg');
        const footerLogo = document.getElementById('footerLogoImg');
        const heroBanner = document.getElementById('heroBannerImg');

        if (mainLogo && isSafeUrl(data.logoUrl)) mainLogo.src = data.logoUrl;
        if (footerLogo && isSafeUrl(data.footerLogoUrl)) footerLogo.src = data.footerLogoUrl;
        if (isSafeUrl(data.bannerUrl)) {
            if (heroBanner) heroBanner.src = data.bannerUrl;
            // Banner nền trên máy tính (CSS .hero::after đọc biến này)
            document.documentElement.style.setProperty('--hero-banner', `url("${data.bannerUrl.replace(/["\\\s]/g, '')}")`);
        }
    }

    // Lưu tạm 10 phút trên máy khách: khách xem lại trang không tốn thêm lượt đọc Firestore
    // (gói miễn phí 50.000 lượt/ngày dùng chung với trang theo dõi xe). Admin sửa giá thì
    // khách đang có bản lưu tạm sẽ thấy giá mới sau tối đa 10 phút.
    const CACHE_KEY = 'siteData_v1';
    const CACHE_TTL_MS = 10 * 60 * 1000;

    function readCache() {
        try {
            const cached = JSON.parse(localStorage.getItem(CACHE_KEY) || 'null');
            if (cached && Date.now() - cached.at < CACHE_TTL_MS) return cached;
        } catch (e) { /* localStorage bị chặn: bỏ qua */ }
        return null;
    }

    function writeCache(pricing, settings) {
        try {
            localStorage.setItem(CACHE_KEY, JSON.stringify({ at: Date.now(), pricing, settings }));
        } catch (e) { /* bỏ qua */ }
    }

    document.addEventListener('DOMContentLoaded', async () => {
        const cached = readCache();
        if (cached) {
            renderPricing(cached.pricing);
            applySettings(cached.settings);
            return;
        }
        const [pricing, settings] = await Promise.all([getFirestorePricing(), getFirestoreSettings()]);
        renderPricing(pricing);
        applySettings(settings);
        // null = chưa có dữ liệu (vẫn lưu tạm để khỏi hỏi lại), undefined = lỗi mạng (không lưu)
        if (pricing !== undefined && settings !== undefined) writeCache(pricing ?? null, settings ?? null);
    });
})();
