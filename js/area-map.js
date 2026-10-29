// Bản đồ "Khu vực hoạt động": ghim các khu vực lấy từ nút .area-tag (data-lat/data-lng).
// Leaflet chỉ được tải khi người dùng cuộn tới gần bản đồ, để trang chủ vẫn nhẹ.
(function () {
    const mapEl = document.getElementById('areaMap');
    if (!mapEl) return;

    const BASE = { name: 'Cứu Hộ Giao Thông 123', address: 'Km92 ngõ An Trì, Hồng Bàng', lat: 20.871016, lng: 106.639246 };
    const LEAFLET = {
        css: ['https://unpkg.com/leaflet@1.9.4/dist/leaflet.css', 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY='],
        js: ['https://unpkg.com/leaflet@1.9.4/dist/leaflet.js', 'sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=']
    };

    const tags = [...document.querySelectorAll('.area-tag[data-lat]')];
    const markers = new Map(); // nút → marker
    let map = null;
    let loading = null;

    function loadLeaflet() {
        if (window.L) return Promise.resolve();
        if (loading) return loading;
        loading = new Promise((resolve, reject) => {
            const css = document.createElement('link');
            css.rel = 'stylesheet';
            [css.href, css.integrity] = LEAFLET.css;
            css.crossOrigin = '';
            document.head.appendChild(css);

            const js = document.createElement('script');
            [js.src, js.integrity] = LEAFLET.js;
            js.crossOrigin = '';
            js.onload = resolve;
            js.onerror = reject;
            document.head.appendChild(js);
        });
        return loading;
    }

    function pin(color, size) {
        return L.divIcon({
            className: 'area-pin',
            html: `<span style="background:${color};width:${size}px;height:${size}px"></span>`,
            iconSize: [size, size],
            iconAnchor: [size / 2, size / 2],
            popupAnchor: [0, -size / 2]
        });
    }

    function initMap() {
        const touch = window.matchMedia('(pointer: coarse)').matches;
        map = L.map(mapEl, {
            scrollWheelZoom: false,   // không "bắt" con lăn chuột khi cuộn trang
            dragging: !touch,         // điện thoại: vuốt để cuộn trang, phóng to bằng nút +/-
            tap: false
        });
        // Tile OpenStreetMap France vì một số nhà mạng Việt Nam chặn tile.openstreetmap.org
        L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors, tiles HOT / OpenStreetMap France',
            subdomains: 'abc',
            maxZoom: 18
        }).addTo(map);

        const bounds = [];
        tags.forEach(tag => {
            const lat = parseFloat(tag.dataset.lat);
            const lng = parseFloat(tag.dataset.lng);
            const near = tag.classList.contains('area-tag--near');
            const name = tag.textContent.trim();
            const marker = L.marker([lat, lng], { icon: pin(near ? '#f59e0b' : '#d32f2f', near ? 16 : 14), title: name })
                .addTo(map)
                .bindPopup(`<b>${name}</b><br>${near ? 'Tỉnh lân cận' : 'Hải Phòng'} — gọi <a href="tel:0979032589">0979 032 589</a>`);
            markers.set(tag, marker);
            bounds.push([lat, lng]);
        });

        L.marker([BASE.lat, BASE.lng], { icon: pin('#1565c0', 20), title: BASE.name, zIndexOffset: 1000 })
            .addTo(map)
            .bindPopup(`<b>${BASE.name}</b><br>${BASE.address}`);
        bounds.push([BASE.lat, BASE.lng]);

        map.fitBounds(bounds, { padding: [25, 25] });
    }

    function focusTag(tag) {
        tags.forEach(t => t.classList.toggle('is-active', t === tag));
        const marker = markers.get(tag);
        if (!marker) return;
        map.flyTo(marker.getLatLng(), tag.classList.contains('area-tag--near') ? 10 : 13, { duration: 0.8 });
        marker.openPopup();
    }

    tags.forEach(tag => {
        tag.addEventListener('click', () => {
            const ready = map ? Promise.resolve() : start();
            ready.then(() => focusTag(tag));
            mapEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        });
    });

    function start() {
        return loadLeaflet().then(() => { if (!map) initMap(); }).catch(() => {
            mapEl.innerHTML = '<p class="area-map-error">Không tải được bản đồ. Khu vực phục vụ được liệt kê bên dưới.</p>';
        });
    }

    if ('IntersectionObserver' in window) {
        const io = new IntersectionObserver(entries => {
            if (entries.some(e => e.isIntersecting)) {
                io.disconnect();
                start();
            }
        }, { rootMargin: '300px' });
        io.observe(mapEl);
    } else {
        start();
    }
})();
