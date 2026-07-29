document.addEventListener('DOMContentLoaded', () => {
    // --- QUICK RESCUE FORM LOGIC ---
    const btnGetLocation = document.getElementById('btnGetLocation');
    const locationInput = document.getElementById('rescueLocation');
    const rescueForm = document.getElementById('rescueForm');
    const btnSubmitRescue = document.getElementById('btnSubmitRescue');

    let mapLink = '';

    if (btnGetLocation && locationInput) {
        btnGetLocation.addEventListener('click', () => {
            if (navigator.geolocation) {
                const icon = btnGetLocation.querySelector('i');
                icon.className = 'fas fa-spinner fa-spin';
                
                navigator.geolocation.getCurrentPosition((position) => {
                    const lat = position.coords.latitude;
                    const lng = position.coords.longitude;
                    mapLink = `https://maps.google.com/?q=${lat},${lng}`;
                    locationInput.value = `Đã lấy vị trí (Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)})`;
                    icon.className = 'fas fa-map-marker-alt';
                }, (error) => {
                    alert('Không thể lấy vị trí. Vui lòng cho phép truy cập vị trí hoặc nhập tay.');
                    icon.className = 'fas fa-map-marker-alt';
                });
            } else {
                alert('Trình duyệt của bạn không hỗ trợ định vị.');
            }
        });
    }

    if (rescueForm) {
        rescueForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const phone = document.getElementById('rescuePhone').value;
            const location = locationInput.value;
            const service = document.getElementById('rescueService').value;
            
            if (!phone || !location || !service) {
                alert('Vui lòng điền đầy đủ thông tin!');
                return;
            }

            // TODO: Thay thế bằng Token và Chat ID thật của bạn
            const TELEGRAM_BOT_TOKEN = '8801278671:AAEa3voVbtSHOXagGIlIXHNxdvbSAHsRdqg';
            const TELEGRAM_CHAT_ID = '5655272363';
            
            if (TELEGRAM_BOT_TOKEN === 'YOUR_TELEGRAM_BOT_TOKEN') {
                alert('Tính năng gửi Telegram chưa được cấu hình (Chưa có Token).');
                return;
            }

            const originalBtnText = btnSubmitRescue.innerHTML;
            btnSubmitRescue.innerHTML = '<i class="fas fa-spinner fa-spin"></i> ĐANG GỬI...';
            btnSubmitRescue.disabled = true;

            const finalLocation = mapLink ? `${location}\n📍 Bản đồ: ${mapLink}` : location;
            
            const now = new Date();
            const timeString = now.toLocaleString('vi-VN');

            const message = `🚨 **YÊU CẦU CỨU HỘ MỚI** 🚨\n\n`
                          + `⏰ Thời gian: ${timeString}\n`
                          + `📞 SĐT Khách: ${phone}\n`
                          + `🛠 Dịch vụ: ${service}\n`
                          + `📍 Vị trí: ${finalLocation}`;

            const telegramUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

            try {
                const response = await fetch(telegramUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        chat_id: TELEGRAM_CHAT_ID,
                        text: message,
                        parse_mode: 'Markdown'
                    })
                });

                const data = await response.json();
                
                if (data.ok) {
                    alert('Gửi yêu cầu thành công! Chúng tôi sẽ liên hệ lại ngay.');
                    rescueForm.reset();
                    mapLink = '';
                } else {
                    alert('Có lỗi xảy ra khi gửi yêu cầu qua Telegram: ' + data.description);
                }
            } catch (error) {
                alert('Lỗi kết nối. Không thể gửi yêu cầu lúc này.');
                console.error(error);
            } finally {
                btnSubmitRescue.innerHTML = originalBtnText;
                btnSubmitRescue.disabled = false;
            }
        });
    }
});
