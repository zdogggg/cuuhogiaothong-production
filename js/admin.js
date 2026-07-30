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
const db = firebase.database();
const storage = firebase.storage();

// --- LOGIN LOGIC ---
const ADMIN_PASS = "admin123";

document.addEventListener('DOMContentLoaded', () => {
    // Check session
    if(sessionStorage.getItem('isAdmin') === 'true') {
        document.getElementById('loginOverlay').style.display = 'none';
        loadPricingData();
        loadNewsData();
        loadSettingsData();
    }
});

function checkLogin() {
    const pass = document.getElementById('adminPassword').value;
    if(pass === ADMIN_PASS) {
        sessionStorage.setItem('isAdmin', 'true');
        document.getElementById('loginOverlay').style.display = 'none';
        Swal.fire({
            toast: true, position: 'top-end', icon: 'success', title: 'Đăng nhập thành công', showConfirmButton: false, timer: 1500
        });
        loadPricingData();
        loadNewsData();
        loadSettingsData();
    } else {
        Swal.fire('Lỗi', 'Mật khẩu không chính xác!', 'error');
    }
}

function logout() {
    sessionStorage.removeItem('isAdmin');
    location.reload();
}

// --- TABS LOGIC ---
function switchTab(tabId) {
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.panel').forEach(panel => panel.classList.remove('active'));
    
    if(tabId === 'pricing') {
        document.getElementById('btnTabPricing').classList.add('active');
        document.getElementById('pricingPanel').classList.add('active');
    } else if(tabId === 'news') {
        document.getElementById('btnTabNews').classList.add('active');
        document.getElementById('newsPanel').classList.add('active');
    } else if(tabId === 'settings') {
        document.getElementById('btnTabSettings').classList.add('active');
        document.getElementById('settingsPanel').classList.add('active');
    }
}

// --- FILE UPLOAD LOGIC ---
function uploadFile(inputId, urlInputId, previewId) {
    const fileInput = document.getElementById(inputId);
    const file = fileInput.files[0];
    if (!file) return Swal.fire('Lỗi', 'Vui lòng chọn 1 file ảnh trước', 'error');

    Swal.fire({ title: 'Đang tải lên...', allowOutsideClick: false, didOpen: () => { Swal.showLoading(); } });

    const storageRef = storage.ref('uploads/' + Date.now() + '_' + file.name);
    storageRef.put(file).then(snapshot => {
        return snapshot.ref.getDownloadURL();
    }).then(url => {
        document.getElementById(urlInputId).value = url;
        if(previewId && document.getElementById(previewId)) document.getElementById(previewId).src = url;
        Swal.close();
        Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: 'Tải ảnh thành công', showConfirmButton: false, timer: 1500 });
    }).catch(error => {
        Swal.close();
        Swal.fire('Lỗi', 'Tải ảnh thất bại. Hãy chắc chắn Firebase Storage đã được cấp quyền (Rules: allow read, write: if true).', 'error');
        console.error(error);
    });
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
        logoUrl: document.getElementById('setMainLogoUrl').value,
        footerLogoUrl: document.getElementById('setFooterLogoUrl').value,
        bannerUrl: document.getElementById('setBannerUrl').value
    };
    db.ref('settings').set(data).then(() => {
        Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: 'Đã lưu cấu hình', showConfirmButton: false, timer: 1500 });
    });
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
            tbody.innerHTML = '<tr><td colspan="3" style="text-align: center;">Chưa có dịch vụ nào.</td></tr>';
            return;
        }
        
        keys.forEach(key => {
            const item = data[key];
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><strong>${item.group || 'Chưa phân nhóm'}</strong></td>
                <td>${item.vehicle || '-'}</td>
                <td style="color: #d32f2f; font-weight: 600;">${item.basePrice || '-'}</td>
                <td style="color: #f57c00; font-weight: 600;">${item.extraPrice || '-'}</td>
                <td>
                    <button class="action-btn edit" onclick="openPricingModal('${key}')" title="Sửa"><i class="fas fa-edit"></i></button>
                    <button class="action-btn" onclick="deletePricing('${key}')" title="Xóa"><i class="fas fa-trash-alt"></i></button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    });
}

function openPricingModal(id = null) {
    const isEdit = id !== null;
    const item = isEdit ? currentPricingData[id] : { group: 'Dịch vụ Xử lý tại chỗ', vehicle: '', basePrice: '', extraPrice: '', description: '', order: 0 };
    
    Swal.fire({
        title: isEdit ? 'Sửa Giá Dịch Vụ' : 'Thêm Dịch Vụ Mới',
        width: 600,
        html: `
            <div class="form-group">
                <label>Nhóm Dịch Vụ (Nhập tay hoặc chọn nhanh)</label>
                <input id="p_group" class="swal2-input" placeholder="VD: Dịch vụ Xử lý tại chỗ" value="${item.group.replace(/"/g, '&quot;')}" style="margin:0; width:100%;">
                <div style="margin-top: 8px; display: flex; flex-wrap: wrap; gap: 6px;">
                    <span style="background: #f0f0f0; padding: 4px 10px; border-radius: 15px; font-size: 0.8rem; cursor: pointer; color: #555;" onclick="document.getElementById('p_group').value = this.innerText">Dịch vụ Xử lý tại chỗ</span>
                    <span style="background: #f0f0f0; padding: 4px 10px; border-radius: 15px; font-size: 0.8rem; cursor: pointer; color: #555;" onclick="document.getElementById('p_group').value = this.innerText">Dịch vụ Cẩu kéo</span>
                    <span style="background: #f0f0f0; padding: 4px 10px; border-radius: 15px; font-size: 0.8rem; cursor: pointer; color: #555;" onclick="document.getElementById('p_group').value = this.innerText">Kéo xe</span>
                    <span style="background: #f0f0f0; padding: 4px 10px; border-radius: 15px; font-size: 0.8rem; cursor: pointer; color: #555;" onclick="document.getElementById('p_group').value = this.innerText">Kích bình</span>
                    <span style="background: #f0f0f0; padding: 4px 10px; border-radius: 15px; font-size: 0.8rem; cursor: pointer; color: #555;" onclick="document.getElementById('p_group').value = this.innerText">Thay lốp</span>
                    <span style="background: #f0f0f0; padding: 4px 10px; border-radius: 15px; font-size: 0.8rem; cursor: pointer; color: #555;" onclick="document.getElementById('p_group').value = this.innerText">Tiếp nhiên liệu</span>
                    <span style="background: #f0f0f0; padding: 4px 10px; border-radius: 15px; font-size: 0.8rem; cursor: pointer; color: #555;" onclick="document.getElementById('p_group').value = this.innerText">Cứu hộ xe tải</span>
                </div>
            </div>
            <div class="form-group">
                <label>Loại Xe Cần Cứu Hộ</label>
                <input id="p_vehicle" class="swal2-input" placeholder="VD: Xe con / Xe tải" value="${item.vehicle}" style="margin:0; width:100%;">
            </div>
            <div style="display: flex; gap: 10px;">
                <div class="form-group" style="flex:1;">
                    <label>Chi Phí Cơ Bản</label>
                    <input id="p_basePrice" class="swal2-input" placeholder="VD: 300.000 đến 500.000 VNĐ" value="${item.basePrice}" style="margin:0; width:100%;">
                </div>
                <div class="form-group" style="flex:1;">
                    <label>Cước Phí Vượt (km)</label>
                    <input id="p_extraPrice" class="swal2-input" placeholder="VD: 35.000 VNĐ/km" value="${item.extraPrice}" style="margin:0; width:100%;">
                </div>
            </div>
            <div class="form-group">
                <label>Chi tiết loại xe (Xuống dòng cho mỗi ý)</label>
                <textarea id="p_description" class="swal2-textarea" placeholder="VD: - Xe ô tô chở người từ 16 chỗ ngồi trở xuống" style="margin:0; width:100%; min-height: 80px;">${item.description}</textarea>
            </div>
            <div class="form-group">
                <label>Thứ tự hiển thị (Số nhỏ xếp trên)</label>
                <input type="number" id="p_order" class="swal2-input" value="${item.order}" style="margin:0; width:100%;">
            </div>
        `,
        showCancelButton: true,
        confirmButtonColor: '#d32f2f',
        confirmButtonText: 'Lưu Dữ Liệu',
        cancelButtonText: 'Hủy',
        preConfirm: () => {
            return {
                group: document.getElementById('p_group').value,
                vehicle: document.getElementById('p_vehicle').value,
                basePrice: document.getElementById('p_basePrice').value,
                extraPrice: document.getElementById('p_extraPrice').value,
                description: document.getElementById('p_description').value,
                order: parseInt(document.getElementById('p_order').value) || 0
            }
        }
    }).then((result) => {
        if (result.isConfirmed) {
            const dataToSave = result.value;
            if(!dataToSave.vehicle) return Swal.fire('Lỗi', 'Loại xe không được để trống', 'error');
            
            const refId = isEdit ? id : 'svc_' + Date.now();
            db.ref('pricing/' + refId).set(dataToSave).then(() => {
                Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: 'Lưu thành công!', showConfirmButton: false, timer: 1500 });
            });
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

// --- NEWS CRUD ---
let currentNewsData = {};

function loadNewsData() {
    db.ref('news').on('value', (snapshot) => {
        const data = snapshot.val() || {};
        currentNewsData = data;
        
        const tbody = document.getElementById('newsTableBody');
        tbody.innerHTML = '';
        
        // Sort by timestamp descending (newest first)
        const keys = Object.keys(data).sort((a,b) => (data[b].timestamp || 0) - (data[a].timestamp || 0));
        
        if(keys.length === 0) {
            tbody.innerHTML = '<tr><td colspan="4" style="text-align: center;">Chưa có tin tức nào.</td></tr>';
            return;
        }
        
        keys.forEach(key => {
            const item = data[key];
            const imgHtml = item.image_url ? `<img src="${item.image_url}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 8px;">` : '<div style="width: 50px; height: 50px; background: #eee; border-radius: 8px; display: flex; align-items: center; justify-content: center;"><i class="fas fa-image" style="color: #aaa;"></i></div>';
            
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${imgHtml}</td>
                <td><strong>${item.title}</strong><br><small style="color:#777; display:block; max-width: 300px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${item.summary || ''}</small></td>
                <td>${item.date}</td>
                <td>
                    <button class="action-btn edit" onclick="openNewsModal('${key}')" title="Sửa"><i class="fas fa-edit"></i></button>
                    <button class="action-btn" onclick="deleteNews('${key}')" title="Xóa"><i class="fas fa-trash-alt"></i></button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    });
}

function openNewsModal(id = null) {
    const isEdit = id !== null;
    
    // Default data
    const today = new Date().toLocaleDateString('vi-VN');
    const item = isEdit ? currentNewsData[id] : { title: '', summary: '', image_url: '', date: today };
    
    Swal.fire({
        title: isEdit ? 'Sửa Tin Tức' : 'Đăng Tin Tức Mới',
        width: 600,
        html: `
            <div class="form-group">
                <label>Tiêu đề bài viết</label>
                <input id="n_title" class="swal2-input" placeholder="Nhập tiêu đề..." value="${item.title.replace(/"/g, '&quot;')}" style="margin:0; width:100%;">
            </div>
            <div class="form-group">
                <label>Ngày đăng (Có thể sửa lại)</label>
                <input id="n_date" class="swal2-input" value="${item.date}" style="margin:0; width:100%;">
            </div>
            <div class="form-group">
                <label>Ảnh Bìa Tin Tức</label>
                <div class="upload-wrapper" style="margin-top: 5px;">
                    <input type="text" id="n_img" class="swal2-input" placeholder="Link ảnh hoặc tải lên" value="${item.image_url}" style="margin:0; flex:2;">
                    <input type="file" id="fileNewsImg" accept="image/*" style="flex:1; padding: 12px; margin-left: 10px; border: 1px solid #ccc; border-radius: 4px;">
                    <button type="button" class="btn" onclick="uploadFile('fileNewsImg', 'n_img', null)" style="margin-left: 10px;"><i class="fas fa-upload"></i></button>
                </div>
            </div>
            <div class="form-group">
                <label>Nội dung tóm tắt / Chi tiết</label>
                <textarea id="n_summary" class="swal2-textarea" placeholder="Nhập nội dung..." style="margin:0; width:100%; min-height: 120px;">${item.summary}</textarea>
            </div>
        `,
        showCancelButton: true,
        confirmButtonColor: '#d32f2f',
        confirmButtonText: 'Lưu Bài Viết',
        cancelButtonText: 'Hủy',
        preConfirm: () => {
            return {
                title: document.getElementById('n_title').value,
                date: document.getElementById('n_date').value,
                image_url: document.getElementById('n_img').value,
                summary: document.getElementById('n_summary').value,
                timestamp: isEdit ? (item.timestamp || Date.now()) : Date.now()
            }
        }
    }).then((result) => {
        if (result.isConfirmed) {
            const dataToSave = result.value;
            if(!dataToSave.title) return Swal.fire('Lỗi', 'Tiêu đề không được để trống', 'error');
            
            const refId = isEdit ? id : 'news_' + Date.now();
            db.ref('news/' + refId).set(dataToSave).then(() => {
                Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: 'Lưu thành công!', showConfirmButton: false, timer: 1500 });
            });
        }
    });
}

function deleteNews(id) {
    Swal.fire({
        title: 'Xóa bài viết này?',
        text: "Bạn không thể hoàn tác hành động này!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Xóa ngay!',
        cancelButtonText: 'Hủy'
    }).then((result) => {
        if (result.isConfirmed) {
            db.ref('news/' + id).remove().then(() => {
                Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: 'Đã xóa!', showConfirmButton: false, timer: 1500 });
            });
        }
    });
}
