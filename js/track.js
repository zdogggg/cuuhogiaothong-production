const firebaseConfig = {
    apiKey: "AIzaSyAalG0Z_esnaZpnbRTTX45GSOtlK5Ee-Xs",
    authDomain: "cuuhogiaothong123.firebaseapp.com",
    databaseURL: "https://cuuhogiaothong123-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "cuuhogiaothong123",
    storageBucket: "cuuhogiaothong123.firebasestorage.app",
    messagingSenderId: "1069997605416",
    appId: "1:1069997605416:web:9e9a43fff4ecb65080eb1d",
    measurementId: "G-167S4JD9YL"
};

// Khởi tạo Firebase
let db;
if (firebaseConfig.apiKey !== "YOUR_API_KEY_HERE") {
    firebase.initializeApp(firebaseConfig);
    db = firebase.database();
}

// Khởi tạo bản đồ Leaflet (mặc định ở trung tâm Hải Phòng)
// Dùng tile OpenStreetMap France vì một số nhà mạng Việt Nam chặn tile.openstreetmap.org
const map = L.map('map').setView([20.8449, 106.6881], 13);
L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors, tiles HOT / OpenStreetMap France',
    subdomains: 'abc',
    maxZoom: 19
}).addTo(map);

let latestStatus = null;
let lastDriverPos = null;
let straightLine = null;

// Khoảng cách đường thẳng (km) — dùng khi không tính được đường đi
function haversineKm(a, b) {
    const R = 6371;
    const toRad = d => d * Math.PI / 180;
    const dLat = toRad(b[0] - a[0]);
    const dLng = toRad(b[1] - a[1]);
    const h = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(a[0])) * Math.cos(toRad(b[0])) * Math.sin(dLng / 2) ** 2;
    return 2 * R * Math.asin(Math.sqrt(h));
}

function showStraightLine() {
    if (!lastDriverPos || !customerLat || !customerLng) return;
    const target = [Number(customerLat), Number(customerLng)];
    if (!straightLine) {
        straightLine = L.polyline([lastDriverPos, target], {color: '#d32f2f', opacity: 0.6, weight: 4, dashArray: '6, 8'}).addTo(map);
    } else {
        straightLine.setLatLngs([lastDriverPos, target]);
    }
    if (latestStatus !== 'arrived') {
        document.getElementById('distanceText').innerText = `Cách bạn khoảng ${haversineKm(lastDriverPos, target).toFixed(1)} km (đường thẳng)`;
    }
}

// Icon Xe Cứu Hộ (Dùng Emoji để chống lỗi không load được ảnh do bản quyền)
const towTruckIcon = L.divIcon({
    html: '<div style="font-size: 32px; text-shadow: 2px 2px 5px rgba(0,0,0,0.4); line-height: 1;">🚒</div>',
    className: 'custom-div-icon animated-marker', // Thêm animated-marker
    iconSize: [32, 32],
    iconAnchor: [16, 16]
});

let driverMarker = null;
let routingControl = null;
let isFirstLocation = true;

// Lấy mã cuốc từ URL (?id=CH...); tọa độ khách được lưu trên máy khách lúc gửi form, không nằm trên URL
const urlParams = new URLSearchParams(window.location.search);
const bookingId = urlParams.get('id');
let customerLat = null;
let customerLng = null;
try {
    const saved = JSON.parse(localStorage.getItem('booking_' + bookingId) || 'null');
    if (saved) {
        customerLat = saved.lat;
        customerLng = saved.lng;
    }
} catch (e) {
    // Không đọc được localStorage thì chỉ hiện vị trí xe, không vẽ đường
}

// Icon Khách hàng
const customerIcon = L.divIcon({
    html: '<div style="font-size: 32px; text-shadow: 2px 2px 5px rgba(0,0,0,0.4); line-height: 1;">📍</div>',
    className: 'custom-div-icon',
    iconSize: [32, 32],
    iconAnchor: [16, 32]
});

if (customerLat && customerLng) {
    L.marker([customerLat, customerLng], {icon: customerIcon}).addTo(map)
        .bindPopup('<b>Vị trí khách hàng</b>').openPopup();
    map.setView([customerLat, customerLng], 14);
}

if (!bookingId) {
    alert("Không tìm thấy mã chuyến xe!");
} else if (db) {
    // Lắng nghe dữ liệu vị trí tài xế từ Firebase
    const trackingRef = db.ref('trackings/' + bookingId);
    
    trackingRef.on('value', (snapshot) => {
        const data = snapshot.val();
        
        if (data && data.lat && data.lng) {
            // Cập nhật giao diện khi có tín hiệu
            document.getElementById('loader').style.display = 'none';
            document.getElementById('progressBlock').style.display = 'block';
            
            if (data.status === 'arrived') {
                document.getElementById('statusTitle').innerText = 'ĐÃ HOÀN THÀNH CUỐC XE!';
                document.getElementById('statusTitle').style.color = '#1976d2'; // Xanh dương
                document.getElementById('statusDesc').innerText = 'Xe cứu hộ đã đến vị trí của bạn thành công.';
                document.getElementById('distanceText').innerText = 'Hoàn thành';
                
                document.getElementById('progressFill').style.width = 'calc(100% - 30px)';
                document.getElementById('progressFill').style.background = '#43a047';
                document.getElementById('step1').className = 'step done';
                document.getElementById('step2').className = 'step done';
                document.getElementById('step3').className = 'step done';
            } else {
                document.getElementById('statusTitle').innerText = 'Xe cứu hộ đang tới!';
                document.getElementById('statusTitle').style.color = '#2e7d32'; // Xanh lá
                document.getElementById('statusDesc').innerText = 'Tài xế đang di chuyển đến vị trí của bạn.';
                
                document.getElementById('progressFill').style.width = 'calc(50% - 15px)';
                document.getElementById('progressFill').style.background = '#ffb300';
                document.getElementById('step1').className = 'step done';
                document.getElementById('step2').className = 'step active';
                document.getElementById('step3').className = 'step';
            }
            document.getElementById('driverInfo').style.display = 'flex';
            
            const newPos = [data.lat, data.lng];
            latestStatus = data.status;
            lastDriverPos = newPos;

            // Vẽ/Cập nhật Marker trên bản đồ
            if (!driverMarker) {
                driverMarker = L.marker(newPos, {icon: towTruckIcon}).addTo(map);
            } else {
                driverMarker.setLatLng(newPos);
            }
            
            // Vẽ đường đi
            if (customerLat && customerLng) {
                if (!routingControl) {
                    routingControl = L.Routing.control({
                        waypoints: [
                            L.latLng(data.lat, data.lng),
                            L.latLng(customerLat, customerLng)
                        ],
                        createMarker: function() { return null; },
                        addWaypoints: false,
                        routeWhileDragging: false,
                        show: false,
                        lineOptions: {
                            styles: [{color: '#d32f2f', opacity: 0.8, weight: 5, dashArray: '10, 10'}]
                        }
                    }).addTo(map);
                    
                    // Không gọi được máy chủ tính đường thì vẽ đường thẳng + khoảng cách ước lượng
                    routingControl.on('routingerror', showStraightLine);

                    // Cập nhật text khoảng cách và ETA
                    routingControl.on('routesfound', function(e) {
                        if (straightLine) {
                            map.removeLayer(straightLine);
                            straightLine = null;
                        }
                        const routes = e.routes;
                        const distance = routes[0].summary.totalDistance; // mét
                        const time = routes[0].summary.totalTime; // giây
                        if (latestStatus !== 'arrived') {
                            const minutes = Math.ceil(time / 60);
                            document.getElementById('distanceText').innerHTML = `Khoảng cách: ${(distance/1000).toFixed(1)} km<br><span style="color:#d32f2f; font-weight:700;">Dự kiến: ${minutes} phút</span>`;
                        }
                    });
                } else {
                    routingControl.setWaypoints([
                        L.latLng(data.lat, data.lng),
                        L.latLng(customerLat, customerLng)
                    ]);
                }
            }

            // Chỉ đưa map về giữa ở lần đầu tiên hoặc nếu khách k có tọa độ
            if (isFirstLocation) {
                if (customerLat && customerLng) {
                    const bounds = L.latLngBounds([newPos, [customerLat, customerLng]]);
                    map.fitBounds(bounds, {padding: [50, 50]});
                } else {
                    map.setView(newPos, 15);
                }
                isFirstLocation = false;
            }
        }
    });
} else {
    console.log("Firebase chưa được cấu hình. Hệ thống giả lập (Chờ kết nối).");
}
