const firebaseConfig = {
    apiKey: "AIzaSyAalGOZ_esnaZpnbRTTX45GSOtlK5Ee-Xs",
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
    db = firebase.firestore();
}

// Lấy mã bookingId từ URL
const urlParams = new URLSearchParams(window.location.search);
const bookingId = urlParams.get('id');
const BOOKING_ID_RE = /^CH[A-Z0-9]{8}$/; // khớp rule Firestore

// Khoảng cách giữa 2 toạ độ (mét)
function distanceM(a, b) {
    const toRad = d => d * Math.PI / 180;
    const dLat = toRad(b[0] - a[0]);
    const dLng = toRad(b[1] - a[1]);
    const h = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(a[0])) * Math.cos(toRad(b[0])) * Math.sin(dLng / 2) ** 2;
    return 2 * 6371000 * Math.asin(Math.sqrt(h));
}

// Ghi vị trí lên Firestore; lỗi quyền (link sai, rules chặn) thì báo cho tài xế thay vì im lặng
let writeErrorShown = false;
function saveTracking(data) {
    if (!db) return;
    db.collection('trackings').doc(bookingId).set(data, { merge: true }).catch(err => {
        console.error('Lỗi lưu vị trí:', err);
        statusText.innerText = 'KHÔNG GỬI ĐƯỢC VỊ TRÍ cho khách. Gọi điện báo khách.';
        if (!writeErrorShown) {
            writeErrorShown = true;
            Swal.fire('Không gửi được vị trí', 'Khách sẽ không thấy xe trên bản đồ. Hãy gọi điện báo khách và báo quản trị.', 'error');
        }
    });
}

const bookingDisplay = document.getElementById('bookingDisplay');
const btnStart = document.getElementById('btnStart');
const btnStop = document.getElementById('btnStop');
const statusText = document.getElementById('statusText');

// Khởi tạo bản đồ Leaflet
const map = L.map('map').setView([20.8449, 106.6881], 13);
// Dùng tile OpenStreetMap France vì một số nhà mạng Việt Nam chặn tile.openstreetmap.org
L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors, tiles HOT / OpenStreetMap France',
    subdomains: 'abc',
    maxZoom: 19
}).addTo(map);

// Icon Tài xế (xe cứu hộ)
const driverIcon = L.divIcon({
    html: '<div style="font-size: 32px; text-shadow: 2px 2px 5px rgba(0,0,0,0.4); line-height: 1;">🚒</div>',
    className: 'custom-div-icon',
    iconSize: [32, 32],
    iconAnchor: [16, 16]
});

let watchId = null;
let lastSentAt = 0;
let lastSentPos = null;
let lastPos = null; // vị trí GPS mới nhất
let lastRoutedAt = 0;
let lastRoutedPos = null;
let isFinished = false;
let hiddenAt = null;
let driverMarker = null;
let routingControl = null;
let isFirstLocation = true;

// Thông tin khách nằm sau dấu # (không gửi lên máy chủ web); vẫn đọc ?lat=... cho link cũ
const hashParams = new URLSearchParams(window.location.hash.slice(1));
const customerLat = hashParams.get('lat') || urlParams.get('lat');
const customerLng = hashParams.get('lng') || urlParams.get('lng');
const rawPhone = hashParams.get('phone') || urlParams.get('phone') || '';
const customerPhone = /^\+?\d{9,12}$/.test(rawPhone) ? rawPhone : null;

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

    // Mở Google Maps để dẫn đường tới khách
    const navBtn = document.getElementById('navigateBtn');
    navBtn.href = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(customerLat + ',' + customerLng)}&travelmode=driving`;
    navBtn.style.display = 'flex';
}

if (!bookingId || !BOOKING_ID_RE.test(bookingId)) {
    bookingDisplay.innerText = "LỖI: MÃ CUỐC KHÔNG HỢP LỆ";
    btnStart.disabled = true;
    Swal.fire('Lỗi', 'Đường link không hợp lệ. Vui lòng mở lại từ Telegram.', 'error');
} else {
    bookingDisplay.innerText = "Mã: " + bookingId;
    
    if (customerPhone) {
        document.getElementById('customerPhoneDisplay').style.display = 'block';
        const callBtn = document.getElementById('callCustomerBtn');
        callBtn.href = 'tel:' + customerPhone;
        callBtn.querySelector('span').innerText = customerPhone;
    }
}

// Wake Lock API để giữ sáng màn hình
let wakeLock = null;
async function requestWakeLock() {
    if ('wakeLock' in navigator) {
        try {
            wakeLock = await navigator.wakeLock.request('screen');
            console.log('Wake Lock is active');
            wakeLock.addEventListener('release', () => {
                console.log('Wake Lock was released');
            });
        } catch (err) {
            console.error(`${err.name}, ${err.message}`);
        }
    }
}
function releaseWakeLock() {
    if (wakeLock !== null) {
        wakeLock.release().then(() => { wakeLock = null; });
    }
}
// Trang bị ẩn (chuyển app, tắt màn hình) thì trình duyệt ngừng gửi GPS.
// Báo trạng thái "tạm dừng" cho khách, và nhắc tài xế khi quay lại trang.
document.addEventListener('visibilitychange', () => {
    const isTracking = watchId !== null && !isFinished;

    if (document.visibilityState === 'hidden') {
        if (isTracking) {
            hiddenAt = Date.now();
            saveTracking({
                status: 'paused',
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
            });
        }
        return;
    }

    if (wakeLock !== null) {
        requestWakeLock();
    }
    if (isTracking && hiddenAt) {
        const seconds = Math.round((Date.now() - hiddenAt) / 1000);
        hiddenAt = null;
        lastSentAt = 0; // gửi vị trí mới ngay ở lần GPS kế tiếp
        if (seconds >= 5) {
            Swal.fire({
                icon: 'warning',
                title: 'Đã tạm dừng gửi vị trí',
                html: `Trong ${seconds} giây trang bị ẩn, khách <b>không thấy xe di chuyển</b>.<br>Khi chạy, hãy giữ trang này mở và màn hình sáng.`,
                confirmButtonColor: '#d32f2f',
                confirmButtonText: 'Đã hiểu'
            });
        }
    }
});

btnStart.addEventListener('click', async () => {
    if (!navigator.geolocation) {
        Swal.fire('Lỗi', 'Thiết bị của bạn không hỗ trợ định vị GPS.', 'error');
        return;
    }

    if (!db) {
        Swal.fire('Chưa cấu hình', 'Hệ thống giả lập: Đã bật thu phát định vị (nhưng chưa lưu Firebase vì thiếu cấu hình).', 'info');
    }

    statusText.innerText = "Đang xin quyền vị trí...";
    
    // Xin quyền Wake Lock
    await requestWakeLock();
    
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
            lastPos = newPos;
            if (!driverMarker) {
                driverMarker = L.marker(newPos, {icon: driverIcon}).addTo(map);
            } else {
                driverMarker.setLatLng(newPos);
            }
            
            // Vẽ đường đi nếu có tọa độ khách
            // Tính lại đường đi khi xe đã đi thêm 150 m hoặc sau 60 giây: máy chủ tính đường (OSRM)
            // miễn phí chỉ cho ~1 yêu cầu/giây, gọi theo từng lần GPS cập nhật dễ bị chặn
            const needReroute = !lastRoutedPos || distanceM(lastRoutedPos, newPos) > 150 || Date.now() - lastRoutedAt > 60000;
            if (customerLat && customerLng && needReroute) {
                lastRoutedPos = newPos;
                lastRoutedAt = Date.now();
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

            // Gửi vị trí: tối đa 3 giây/lần khi xe chạy (đã đi ≥ 10 m); xe đứng yên thì 20 giây/lần
            // để khách vẫn thấy "đang cập nhật" mà không tốn lượt ghi Firestore (gói miễn phí 20.000/ngày)
            const sinceLast = Date.now() - lastSentAt;
            const moved = !lastSentPos || distanceM(lastSentPos, newPos) >= 10;
            if (db && (sinceLast >= 20000 || (sinceLast >= 3000 && moved))) {
                lastSentAt = Date.now();
                lastSentPos = newPos;
                saveTracking({
                    lat: lat,
                    lng: lng,
                    timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                    status: 'moving'
                });
            }
        },
        (error) => {
            // Mất sóng GPS tạm thời (timeout) thì chờ lần cập nhật sau, chỉ báo lỗi khi bị từ chối quyền
            if (error.code === error.PERMISSION_DENIED) {
                Swal.fire('Lỗi vị trí', 'Vui lòng cho phép trình duyệt truy cập vị trí (Always Allow) để tiếp tục.', 'error');
                statusText.innerText = "Bị từ chối quyền vị trí.";
            } else {
                statusText.innerText = "Đang chờ tín hiệu GPS...";
            }
        },
        {
            enableHighAccuracy: true,
            maximumAge: 0,
            timeout: 15000
        }
    );
});

// Nhiều điện thoại không báo GPS khi xe đứng yên (chờ đèn đỏ, kẹt xe). Vẫn gửi lại vị trí cũ
// mỗi 20 giây để trang khách không báo nhầm "mất sóng" sau 1 phút.
setInterval(() => {
    if (watchId === null || isFinished || !lastPos || document.visibilityState !== 'visible') return;
    if (Date.now() - lastSentAt < 20000) return;
    lastSentAt = Date.now();
    lastSentPos = lastPos;
    saveTracking({
        lat: lastPos[0],
        lng: lastPos[1],
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        status: 'moving'
    });
}, 5000);

btnStop.addEventListener('click', () => {
    Swal.fire({
        title: 'Hoàn thành cuốc?',
        text: "Bạn đã tới nơi và muốn tắt định vị?",
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#d32f2f',
        confirmButtonText: 'Đúng, tắt định vị',
        cancelButtonText: 'Hủy'
    }).then((result) => {
        if (result.isConfirmed) {
            // Giải phóng Wake Lock
            releaseWakeLock();
            
            // Tắt theo dõi GPS
            if (watchId !== null) {
                navigator.geolocation.clearWatch(watchId);
            }
            
            isFinished = true;

            // Cập nhật trạng thái và xoá toạ độ xe — xong cuốc thì không cần lưu vị trí nữa
            saveTracking({
                status: 'arrived',
                lat: null,
                lng: null,
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
            });
            
            statusText.innerText = "Đã hoàn thành cuốc xe.";
            btnStop.disabled = true;
            btnStop.innerText = "ĐÃ KẾT THÚC";
            
            Swal.fire({
                title: 'Thành công',
                text: 'Đã tắt chia sẻ định vị.',
                icon: 'success',
                confirmButtonColor: '#d32f2f'
            });
        }
    });
});
