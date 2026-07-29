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

// Lấy mã bookingId từ URL
const urlParams = new URLSearchParams(window.location.search);
const bookingId = urlParams.get('id');

const bookingDisplay = document.getElementById('bookingDisplay');
const btnStart = document.getElementById('btnStart');
const btnStop = document.getElementById('btnStop');
const statusText = document.getElementById('statusText');

// Khởi tạo bản đồ Leaflet
const map = L.map('map').setView([21.0285, 105.8542], 13);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Icon Tài xế (xe cứu hộ)
const driverIcon = L.divIcon({
    html: '<div style="font-size: 32px; text-shadow: 2px 2px 5px rgba(0,0,0,0.4); line-height: 1;">🚒</div>',
    className: 'custom-div-icon',
    iconSize: [32, 32],
    iconAnchor: [16, 16]
});

let watchId = null;
let driverMarker = null;
let routingControl = null;
let isFirstLocation = true;

// Lấy mã bookingId và tọa độ khách hàng từ URL
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
        .bindPopup('<b>Vị trí Khách hàng</b>').openPopup();
    map.setView([customerLat, customerLng], 14);
}

if (!bookingId) {
    bookingDisplay.innerText = "LỖI: KHÔNG CÓ MÃ CUỐC";
    btnStart.disabled = true;
    Swal.fire('Lỗi', 'Đường link không hợp lệ. Vui lòng mở lại từ Telegram.', 'error');
} else {
    bookingDisplay.innerText = "Mã: " + bookingId;
}

btnStart.addEventListener('click', () => {
    if (!navigator.geolocation) {
        Swal.fire('Lỗi', 'Thiết bị của bạn không hỗ trợ định vị GPS.', 'error');
        return;
    }

    if (!db) {
        Swal.fire('Chưa cấu hình', 'Hệ thống giả lập: Đã bật thu phát định vị (nhưng chưa lưu Firebase vì thiếu cấu hình).', 'info');
    }

    statusText.innerText = "Đang xin quyền vị trí...";
    
    // Bật watchPosition (cập nhật liên tục khi di chuyển)
    watchId = navigator.geolocation.watchPosition(
        (position) => {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            
            statusText.innerText = `Đang phát tín hiệu (Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)})`;
            
            // Giao diện
            btnStart.style.display = 'none';
            btnStop.style.display = 'block';
            
            // Cập nhật bản đồ
            const newPos = [lat, lng];
            if (!driverMarker) {
                driverMarker = L.marker(newPos, {icon: driverIcon}).addTo(map);
            } else {
                driverMarker.setLatLng(newPos);
            }
            
            // Vẽ đường đi nếu có tọa độ khách
            if (customerLat && customerLng) {
                if (!routingControl) {
                    routingControl = L.Routing.control({
                        waypoints: [
                            L.latLng(lat, lng),
                            L.latLng(customerLat, customerLng)
                        ],
                        createMarker: function() { return null; }, // Ẩn marker mặc định
                        addWaypoints: false,
                        routeWhileDragging: false,
                        show: false, // Ẩn bảng hướng dẫn chi tiết
                        lineOptions: {
                            styles: [{color: '#007bff', opacity: 0.8, weight: 5, dashArray: '10, 10'}]
                        }
                    }).addTo(map);
                } else {
                    routingControl.setWaypoints([
                        L.latLng(lat, lng),
                        L.latLng(customerLat, customerLng)
                    ]);
                }
            }

            // Chỉ tự động đưa map về giữa ở lần đầu tiên hoặc nếu khách k có tọa độ
            if (isFirstLocation) {
                if (customerLat && customerLng) {
                    // Fit map để thấy cả 2 điểm
                    const bounds = L.latLngBounds([newPos, [customerLat, customerLng]]);
                    map.fitBounds(bounds, {padding: [50, 50]});
                } else {
                    map.setView(newPos, 15);
                }
                isFirstLocation = false;
            }

            // Cập nhật Firebase
            if (db) {
                db.ref('trackings/' + bookingId).update({
                    lat: lat,
                    lng: lng,
                    timestamp: Date.now(),
                    status: 'moving'
                });
            }
        },
        (error) => {
            Swal.fire('Lỗi vị trí', 'Vui lòng cho phép trình duyệt truy cập vị trí (Always Allow) để tiếp tục.', 'error');
            statusText.innerText = "Bị từ chối quyền vị trí.";
        },
        {
            enableHighAccuracy: true,
            maximumAge: 0,
            timeout: 5000
        }
    );
});

btnStop.addEventListener('click', () => {
    Swal.fire({
        title: 'Hoàn thành cuốc?',
        text: "Bạn đã tới nơi và muốn tắt định vị?",
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Đúng, tắt định vị',
        cancelButtonText: 'Hủy'
    }).then((result) => {
        if (result.isConfirmed) {
            // Tắt theo dõi GPS
            if (watchId !== null) {
                navigator.geolocation.clearWatch(watchId);
            }
            
            // Cập nhật trạng thái Firebase
            if (db) {
                db.ref('trackings/' + bookingId).update({
                    status: 'arrived'
                });
            }
            
            statusText.innerText = "Đã hoàn thành cuốc xe.";
            btnStop.disabled = true;
            btnStop.innerText = "ĐÃ KẾT THÚC";
            
            Swal.fire('Thành công', 'Đã tắt chia sẻ định vị.', 'success');
        }
    });
});
