// TODO: Dán cấu hình Firebase của bạn vào đây (Lấy từ Firebase Console)
const firebaseConfig = {
    apiKey: "YOUR_API_KEY_HERE",
    authDomain: "YOUR_PROJECT.firebaseapp.com",
    databaseURL: "https://YOUR_PROJECT-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT.appspot.com",
    messagingSenderId: "YOUR_MESSAGING_ID",
    appId: "YOUR_APP_ID"
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
const radar = document.getElementById('radar');

let watchId = null;

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
            radar.style.display = 'flex';
            
            // Cập nhật Firebase
            if (db) {
                db.ref('trackings/' + bookingId).set({
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
            radar.style.display = 'none';
            btnStop.disabled = true;
            btnStop.innerText = "ĐÃ KẾT THÚC";
            
            Swal.fire('Thành công', 'Đã tắt chia sẻ định vị.', 'success');
        }
    });
});
