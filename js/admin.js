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
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.database();
const storage = firebase.storage();

// Chuỗi do người nhập → an toàn khi chèn vào HTML
function esc(value) {
    return String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

// --- LOGIN LOGIC ---
// Đăng nhập bằng Firebase Auth; quyền thật nằm ở Firebase Rules (chỉ UID có trong /admins mới được ghi)
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = document.getElementById('btnLogin');
    btn.disabled = true;
    try {
        await auth.signInWithEmailAndPassword(
            document.getElementById('adminEmail').value.trim(),
            document.getElementById('adminPassword').value
        );
    } catch (error) {
        let msg = 'Email hoặc mật khẩu không đúng.';
        if (error.code === 'auth/too-many-requests') {
            msg = 'Đăng nhập sai quá nhiều lần. Vui lòng thử lại sau ít phút.';
        } else if (error.code === 'auth/operation-not-allowed' || error.code === 'auth/configuration-not-found') {
            msg = 'Chưa bật đăng nhập Email/Password trong Firebase (xem firebase/README.md).';
        } else if (error.code === 'auth/network-request-failed') {
            msg = 'Lỗi mạng, vui lòng thử lại.';
        }
        Swal.fire('Lỗi', msg, 'error');
    } finally {
        btn.disabled = false;
    }
});

auth.onAuthStateChanged(async (user) => {
    if (!user) {
        document.getElementById('loginOverlay').style.display = 'flex';
        return;
    }

    let isAdmin = false;
    try {
        isAdmin = (await db.ref('admins/' + user.uid).get()).val() === true;
    } catch (error) {
        console.error(error);
    }

    if (!isAdmin) {
        await auth.signOut();
        Swal.fire('Không có quyền', 'Tài khoản này chưa được cấp quyền quản trị.', 'error');
        return;
    }

    document.getElementById('loginOverlay').style.display = 'none';
    document.getElementById('adminPassword').value = '';
    Swal.fire({
        toast: true, position: 'top-end', icon: 'success', title: 'Đăng nhập thành công', showConfirmButton: false, timer: 1500
    });
    loadPricingData();
    loadSettingsData();
});

function logout() {
    db.ref('pricing').off();
    db.ref('settings').off();
    auth.signOut().then(() => location.reload());
}

// --- TABS LOGIC ---
function switchTab(tabId) {
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.panel').forEach(panel => panel.classList.remove('active'));

    if(tabId === 'pricing') {
        document.getElementById('btnTabPricing').classList.add('active');
        document.getElementById('pricingPanel').classList.add('active');
    } else if(tabId === 'settings') {
        document.getElementById('btnTabSettings').classList.add('active');
        document.getElementById('settingsPanel').classList.add('active');
    }
}

// --- FILE UPLOAD LOGIC ---
// Thu nhỏ & nén ảnh ngay trên trình duyệt trước khi tải lên, để web không bị nặng lại
function compressImage(file, maxWidth) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
            const scale = Math.min(1, maxWidth / img.width);
            const canvas = document.createElement('canvas');
            canvas.width = Math.round(img.width * scale);
            canvas.height = Math.round(img.height * scale);
            canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
            URL.revokeObjectURL(img.src);
            canvas.toBlob(blob => {
                if (blob && blob.type === 'image/webp') return resolve(blob);
                // Trình duyệt không xuất được WebP thì dùng JPEG
                canvas.toBlob(jpg => jpg ? resolve(jpg) : reject(new Error('compress_failed')), 'image/jpeg', 0.85);
            }, 'image/webp', 0.82);
        };
        img.onerror = () => reject(new Error('not_an_image'));
        img.src = URL.createObjectURL(file);
    });
}

async function uploadFile(inputId, urlInputId, previewId, maxWidth = 1600) {
    const fileInput = document.getElementById(inputId);
    const file = fileInput.files[0];
    if (!file) return Swal.fire('Lỗi', 'Vui lòng chọn 1 file ảnh trước', 'error');
    if (!file.type.startsWith('image/')) return Swal.fire('Lỗi', 'Chỉ chấp nhận file ảnh.', 'error');

    Swal.fire({ title: 'Đang tải lên...', allowOutsideClick: false, didOpen: () => { Swal.showLoading(); } });

    try {
        const blob = await compressImage(file, maxWidth);
        const ext = blob.type === 'image/webp' ? 'webp' : 'jpg';
        const storageRef = storage.ref(`uploads/${Date.now()}.${ext}`);
        const snapshot = await storageRef.put(blob, { contentType: blob.type, cacheControl: 'public, max-age=2592000' });
        const url = await snapshot.ref.getDownloadURL();

        document.getElementById(urlInputId).value = url;
        if(previewId && document.getElementById(previewId)) document.getElementById(previewId).src = url;
        Swal.close();
        Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: `Tải ảnh thành công (${Math.round(blob.size / 1024)} KB). Nhớ bấm Lưu Cấu Hình.`, showConfirmButton: false, timer: 2500 });
    } catch (error) {
        Swal.close();
        Swal.fire('Lỗi', 'Tải ảnh thất bại. Kiểm tra lại file ảnh hoặc quyền Firebase Storage.', 'error');
        console.error(error);
    }
}

// --- SETTINGS CRUD ---
function loadSettingsData() {
    db.ref('settings').on('value', snapshot => {
        const data = snapshot.val() || {};

        if (data.logoUrl) {
            document.getElementById('setMainLogoUrl').value = data.logoUrl;
            document.getElementById('previewMainLogo').src = data.logoUrl;
        }
        if (data.footerLogoUrl) {
            document.getElementById('setFooterLogoUrl').value = data.footerLogoUrl;
            document.getElementById('previewFooterLogo').src = data.footerLogoUrl;
        }
        if (data.bannerUrl) {
            document.getElementById('setBannerUrl').value = data.bannerUrl;
            document.getElementById('previewBanner').src = data.bannerUrl;
        }
    });
}

function saveSettings() {
    const data = {
        logoUrl: document.getElementById('setMainLogoUrl').value.trim(),
        footerLogoUrl: document.getElementById('setFooterLogoUrl').value.trim(),
        bannerUrl: document.getElementById('setBannerUrl').value.trim()
    };
    // Để trống = dùng ảnh mặc định của website
    if (Object.values(data).some(url => url && !url.startsWith('https://'))) {
        return Swal.fire('Lỗi', 'Link ảnh phải bắt đầu bằng https://', 'error');
    }
    db.ref('settings').set(data).then(() => {
        Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: 'Đã lưu cấu hình', showConfirmButton: false, timer: 1500 });
    }).catch(() => Swal.fire('Lỗi', 'Không lưu được. Tài khoản có thể chưa được cấp quyền ghi.', 'error'));
}

// --- PRICING CRUD ---
let currentPricingData = {};

function loadPricingData() {
    db.ref('pricing').on('value', (snapshot) => {
        const data = snapshot.val() || {};
        currentPricingData = data;

        const tbody = document.getElementById('pricingTableBody');
        tbody.innerHTML = '';

        const keys = Object.keys(data).sort((a,b) => (data[a].order || 0) - (data[b].order || 0));

        if(keys.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" style="text-align: center;">Chưa có dịch vụ nào. Trang chủ đang hiện bảng giá mặc định.</td></tr>';
            return;
        }

        keys.forEach(key => {
            const item = data[key];
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><strong>${esc(item.group || 'Chưa phân nhóm')}</strong></td>
                <td>${esc(item.vehicle || '-')}</td>
                <td style="color: #d32f2f; font-weight: 600;">${esc(formatPriceDisplay(item.basePrice))}</td>
                <td style="color: #f57c00; font-weight: 600;">${esc(formatPriceDisplay(item.extraPrice))}</td>
                <td>
                    <button class="action-btn edit" data-edit="${esc(key)}" title="Sửa"><i class="fas fa-edit"></i></button>
                    <button class="action-btn" data-delete="${esc(key)}" title="Xóa"><i class="fas fa-trash-alt"></i></button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    });
}

document.getElementById('pricingTableBody').addEventListener('click', (e) => {
    const btn = e.target.closest('button');
    if (!btn) return;
    if (btn.dataset.edit) openPricingModal(btn.dataset.edit);
    if (btn.dataset.delete) deletePricing(btn.dataset.delete);
});

const GROUP_SUGGESTIONS = ['Dịch vụ Xử lý tại chỗ', 'Dịch vụ Cẩu kéo', 'Kéo xe', 'Kích bình', 'Thay lốp', 'Tiếp nhiên liệu', 'Cứu hộ xe tải'];

function openPricingModal(id = null) {
    const isEdit = id !== null;
    const item = isEdit ? currentPricingData[id] : { group: 'Dịch vụ Xử lý tại chỗ', vehicle: '', basePrice: '', extraPrice: '', description: '', order: 0 };
    const chips = GROUP_SUGGESTIONS.map(g =>
        `<span class="group-chip" style="background: #f0f0f0; padding: 4px 10px; border-radius: 15px; font-size: 0.8rem; cursor: pointer; color: #555;">${esc(g)}</span>`
    ).join('');

    Swal.fire({
        title: isEdit ? 'Sửa Giá Dịch Vụ' : 'Thêm Dịch Vụ Mới',
        width: 600,
        html: `
            <div class="form-group">
                <label>Nhóm Dịch Vụ (Nhập tay hoặc chọn nhanh)</label>
                <input id="p_group" class="swal2-input" placeholder="VD: Dịch vụ Xử lý tại chỗ" value="${esc(item.group)}" style="margin:0; width:100%;">
                <div style="margin-top: 8px; display: flex; flex-wrap: wrap; gap: 6px;">${chips}</div>
            </div>
            <div class="form-group">
                <label>Loại Xe Cần Cứu Hộ</label>
                <input id="p_vehicle" class="swal2-input" placeholder="VD: Xe con / Xe tải" value="${esc(item.vehicle)}" style="margin:0; width:100%;">
            </div>
            <div style="display: flex; gap: 10px;">
                <div class="form-group" style="flex:1;">
                    <label>Chi Phí Cơ Bản</label>
                    <input id="p_basePrice" class="swal2-input" placeholder="VD: 300.000 đến 500.000 VNĐ" value="${esc(item.basePrice)}" style="margin:0; width:100%;">
                </div>
                <div class="form-group" style="flex:1;">
                    <label>Cước Phí Vượt (km)</label>
                    <input id="p_extraPrice" class="swal2-input" placeholder="VD: 35.000 VNĐ/km" value="${esc(item.extraPrice)}" style="margin:0; width:100%;">
                </div>
            </div>
            <div class="form-group">
                <label>Chi tiết loại xe (Xuống dòng cho mỗi ý)</label>
                <textarea id="p_description" class="swal2-textarea" placeholder="VD: - Xe ô tô chở người từ 16 chỗ ngồi trở xuống" style="margin:0; width:100%; min-height: 80px;">${esc(item.description)}</textarea>
            </div>
            <div class="form-group">
                <label>Thứ tự hiển thị (Số nhỏ xếp trên)</label>
                <input type="number" id="p_order" class="swal2-input" value="${esc(item.order)}" style="margin:0; width:100%;">
            </div>
        `,
        didOpen: () => {
            document.querySelectorAll('.group-chip').forEach(chip => {
                chip.addEventListener('click', () => { document.getElementById('p_group').value = chip.innerText; });
            });
        },
        showCancelButton: true,
        confirmButtonColor: '#d32f2f',
        confirmButtonText: 'Lưu Dữ Liệu',
        cancelButtonText: 'Hủy',
        preConfirm: () => {
            const value = {
                group: document.getElementById('p_group').value.trim(),
                vehicle: document.getElementById('p_vehicle').value.trim(),
                basePrice: document.getElementById('p_basePrice').value.trim(),
                extraPrice: document.getElementById('p_extraPrice').value.trim(),
                description: document.getElementById('p_description').value.trim(),
                order: parseInt(document.getElementById('p_order').value) || 0
            };
            if (!value.vehicle) {
                Swal.showValidationMessage('Loại xe không được để trống');
                return false;
            }
            return value;
        }
    }).then((result) => {
        if (result.isConfirmed) {
            const refId = isEdit ? id : 'svc_' + Date.now();
            db.ref('pricing/' + refId).set(result.value).then(() => {
                Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: 'Lưu thành công!', showConfirmButton: false, timer: 1500 });
            }).catch(() => Swal.fire('Lỗi', 'Không lưu được. Tài khoản có thể chưa được cấp quyền ghi.', 'error'));
        }
    });
}

function deletePricing(id) {
    Swal.fire({
        title: 'Xóa dịch vụ này?',
        text: "Bạn không thể hoàn tác hành động này!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Xóa ngay!',
        cancelButtonText: 'Hủy'
    }).then((result) => {
        if (result.isConfirmed) {
            db.ref('pricing/' + id).remove().then(() => {
                Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: 'Đã xóa!', showConfirmButton: false, timer: 1500 });
            });
        }
    });
}

function formatPriceDisplay(val) {
    if (!val) return '-';
    // Gom cả số đã có dấu chấm (300.000) rồi định dạng lại, tránh biến "000" thành "0"
    let str = val.toString().replace(/\d[\d.]*\d|\d/g, function(m) {
        return parseInt(m.replace(/\./g, ''), 10).toLocaleString('vi-VN');
    });
    // Chưa ghi đơn vị tiền (VNĐ, đồng, 500k đ...) thì thêm "VNĐ" sau con số cuối: "15.000/km" → "15.000 VNĐ/km"
    if (/\d/.test(str) && !/vn[dđ]|đồng|\d\s?(?:đ|k)(?!\p{L})/iu.test(str)) str = str.replace(/(\d[\d.]*)(?!.*\d)/, '$1 VNĐ');
    return str;
}
