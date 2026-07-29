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

// Khởi tạo bản đồ Leaflet (Mặc định ở Hà Nội)
const map = L.map('map').setView([21.0285, 105.8542], 13);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Icon Xe Cứu Hộ (Dùng Emoji để chống lỗi không load được ảnh do bản quyền)
const towTruckIcon = L.divIcon({
    html: '<div style="font-size: 32px; text-shadow: 2px 2px 5px rgba(0,0,0,0.4); line-height: 1;">🚒</div>',
    className: 'custom-div-icon', // Không dùng class mặc định để loại bỏ viền trắng
    iconSize: [32, 32],
    iconAnchor: [16, 16]
});

let driverMarker = null;
let routingControl = null;
let isFirstLocation = true;

// Lấy mã bookingId và tọa độ khách hàng từ URL (?id=CH123456&lat=...&lng=...)
const urlParams = new URLSearchParams(window.location.search);
const bookingId = urlParams.get('id');
const customerLat = urlParams.get('lat');
const customerLng = urlParams.get('lng');

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
            
            if (data.status === 'arrived') {
                document.getElementById('statusTitle').innerText = 'ĐÃ HOÀN THÀNH CUỐC XE!';
                document.getElementById('statusTitle').style.color = '#1976d2'; // Xanh dương
                document.getElementById('statusDesc').innerText = 'Xe cứu hộ đã đến vị trí của bạn thành công.';
                document.getElementById('distanceText').innerText = 'Hoàn thành';
            } else {
                document.getElementById('statusTitle').innerText = 'Xe cứu hộ đang tới!';
                document.getElementById('statusTitle').style.color = '#2e7d32'; // Xanh lá
                document.getElementById('statusDesc').innerText = 'Tài xế đang trên đường đến vị trí của bạn.';
            }
            document.getElementById('driverInfo').style.display = 'flex';
            
            const newPos = [data.lat, data.lng];
            
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
                    
                    // Cập nhật text khoảng cách dựa trên routing event
                    routingControl.on('routesfound', function(e) {
                        const routes = e.routes;
                        const distance = routes[0].summary.totalDistance; // mét
                        if (data.status !== 'arrived') {
                            document.getElementById('distanceText').innerText = `Khoảng cách: ${(distance/1000).toFixed(1)} km`;
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
