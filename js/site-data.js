// Lấy bảng giá và logo/banner do admin cập nhật từ Cloud Firestore qua REST API (không cần tải SDK lớn trên trang chủ).
// Không có dữ liệu hoặc lỗi mạng thì giữ nguyên nội dung sẵn có trong HTML.
const FIRESTORE_API_BASE = 'https://firestore.googleapis.com/v1/projects/cuuhogiaothong123/databases/(default)/documents';

(function () {
    function esc(value) {
        return String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
    }

    function formatPrice(val) {
        if (!val) return '-';
        let str = val.toString().replace(/\d[\d.]*\d|\d/g, m => parseInt(m.replace(/\./g, ''), 10).toLocaleString('vi-VN'));
        // Chưa ghi đơn vị tiền (VNĐ, đồng, 500k đ...) thì thêm "VNĐ" sau con số cuối: "15.000/km" → "15.000 VNĐ/km"
        if (/\d/.test(str) && !/vn[dđ]|đồng|\d\s?(?:đ|k)(?!\p{L})/iu.test(str)) str = str.replace(/(\d[\d.]*)(?!.*\d)/, '$1 VNĐ');
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
            if (!res.ok) return null;
            const doc = await res.json();
            return parseFirestoreDoc(doc);
        } catch (e) {
            return null;
        }
    }

    async function getFirestorePricing() {
        try {
            const res = await fetch(`${FIRESTORE_API_BASE}/pricing`);
            if (!res.ok) return null;
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
            return null;
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
                        <td class="vehicle-name">${esc(item.vehicle)}</td>
                        <td class="price-val" style="color: #d32f2f;">${esc(formatPrice(item.basePrice))}</td>
                        <td class="price-val">${esc(formatPrice(item.extraPrice))}</td>
                        <td style="text-align: center;"><a href="tel:0979032589" class="btn-call-now">Gọi ngay</a></td>
                        <td>${detailsHTML}</td>
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

    document.addEventListener('DOMContentLoaded', async () => {
        const [pricing, settings] = await Promise.all([getFirestorePricing(), getFirestoreSettings()]);
        renderPricing(pricing);
        applySettings(settings);
    });
})();
