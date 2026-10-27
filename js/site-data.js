// Lấy bảng giá và logo/banner do admin cập nhật (Firebase Realtime Database, đọc qua REST — không cần tải SDK).
// Không có dữ liệu hoặc lỗi mạng thì giữ nguyên nội dung sẵn có trong HTML.
const SITE_DB_URL = 'https://cuuhogiaothong123-default-rtdb.asia-southeast1.firebasedatabase.app';

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

    async function getJson(path) {
        try {
            const res = await fetch(`${SITE_DB_URL}/${path}.json`);
            return res.ok ? await res.json() : null;
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
        const [pricing, settings] = await Promise.all([getJson('pricing'), getJson('settings')]);
        renderPricing(pricing);
        applySettings(settings);
    });
})();
