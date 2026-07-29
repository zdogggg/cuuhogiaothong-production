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

// Icon Xe Cứu Hộ
const towTruckIcon = L.icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/3093/3093370.png', // Thay bằng icon xe cứu hộ đẹp hơn nếu có
    iconSize: [40, 40],
    iconAnchor: [20, 20]
});

let driverMarker = null;

// Lấy mã bookingId từ URL (?id=CH123456)
const urlParams = new URLSearchParams(window.location.search);
const bookingId = urlParams.get('id');

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
            document.getElementById('statusTitle').innerText = 'Xe cứu hộ đang tới!';
            document.getElementById('statusTitle').style.color = '#2e7d32'; // Xanh lá
            document.getElementById('statusDesc').innerText = 'Tài xế đang trên đường đến vị trí của bạn.';
            document.getElementById('driverInfo').style.display = 'flex';
            
            const newPos = [data.lat, data.lng];
            
            // Vẽ/Cập nhật Marker trên bản đồ
            if (!driverMarker) {
                driverMarker = L.marker(newPos, {icon: towTruckIcon}).addTo(map);
                map.setView(newPos, 15);
            } else {
                driverMarker.setLatLng(newPos);
                map.panTo(newPos);
            }
        }
    });
} else {
    console.log("Firebase chưa được cấu hình. Hệ thống giả lập (Chờ kết nối).");
}
