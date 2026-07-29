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
                    
                    if (typeof Swal !== 'undefined') {
                        Swal.fire({
                            toast: true,
                            position: 'top-end',
                            icon: 'success',
                            title: 'Lấy vị trí thành công!',
                            showConfirmButton: false,
                            timer: 2000
                        });
                    }
                }, (error) => {
                    if (typeof Swal !== 'undefined') {
                        Swal.fire({
                            icon: 'error',
                            title: 'Lỗi lấy vị trí',
                            text: 'Không thể lấy vị trí. Vui lòng cho phép truy cập vị trí hoặc nhập tay.'
                        });
                    } else {
                        alert('Không thể lấy vị trí. Vui lòng cho phép truy cập vị trí hoặc nhập tay.');
                    }
                    icon.className = 'fas fa-map-marker-alt';
                });
            } else {
                if (typeof Swal !== 'undefined') {
                    Swal.fire('Lỗi', 'Trình duyệt của bạn không hỗ trợ định vị.', 'error');
                } else {
                    alert('Trình duyệt của bạn không hỗ trợ định vị.');
                }
            }
        });
    }

    if (rescueForm) {
        rescueForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const phone = document.getElementById('rescuePhone').value;
            const location = locationInput.value;
            const service = document.getElementById('rescueService').value;
            
            
            // Validate input
            if (!phone || !location || !service) {
                if (typeof Swal !== 'undefined') {
                    Swal.fire('Thiếu thông tin', 'Vui lòng điền đầy đủ thông tin!', 'warning');
                } else {
                    alert('Vui lòng điền đầy đủ thông tin!');
                }
                return;
            }

            // Validate phone format (Vietnamese)
            const phoneRegex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;
            if (!phoneRegex.test(phone)) {
                if (typeof Swal !== 'undefined') {
                    Swal.fire('Sai định dạng', 'Vui lòng nhập đúng số điện thoại di động (10 số)!', 'error');
                } else {
                    alert('Vui lòng nhập đúng số điện thoại di động (10 số)!');
                }
                return;
            }

            // Anti-Spam Rate Limiting (60 seconds)
            const lastSentTime = localStorage.getItem('lastRescueSentTime');
            if (lastSentTime) {
                const timeDiff = (Date.now() - parseInt(lastSentTime)) / 1000;
                if (timeDiff < 60) {
                    const timeLeft = Math.ceil(60 - timeDiff);
                    if (typeof Swal !== 'undefined') {
                        Swal.fire('Vui lòng đợi', `Bạn đã gửi yêu cầu quá nhiều lần. Vui lòng thử lại sau ${timeLeft} giây.`, 'warning');
                    } else {
                        alert(`Vui lòng đợi ${timeLeft} giây trước khi gửi yêu cầu tiếp theo.`);
                    }
                    return;
                }
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

            // Format phone to international (+84) so Telegram makes it clickable
            const callablePhone = phone.startsWith('0') ? '+84' + phone.slice(1) : phone;

            const finalLocation = mapLink ? `${location}\n📍 Bản đồ: ${mapLink}` : location;
            
            const now = new Date();
            const timeString = now.toLocaleString('vi-VN');

            const message = `🚨 **YÊU CẦU CỨU HỘ MỚI** 🚨\n\n`
                          + `⏰ Thời gian: ${timeString}\n`
                          + `📞 SĐT Khách: ${callablePhone}\n`
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
                    localStorage.setItem('lastRescueSentTime', Date.now().toString());
                    
                    if (typeof Swal !== 'undefined') {
                        Swal.fire(
                            'Gửi thành công!',
                            'Đội cứu hộ đã nhận được yêu cầu và sẽ liên hệ lại ngay.',
                            'success'
                        );
                    } else {
                        alert('Gửi yêu cầu thành công! Chúng tôi sẽ liên hệ lại ngay.');
                    }
                    rescueForm.reset();
                    mapLink = '';
                } else {
                    if (typeof Swal !== 'undefined') {
                        Swal.fire('Lỗi', 'Có lỗi xảy ra khi gửi yêu cầu: ' + data.description, 'error');
                    } else {
                        alert('Có lỗi xảy ra khi gửi yêu cầu qua Telegram: ' + data.description);
                    }
                }
            } catch (error) {
                if (typeof Swal !== 'undefined') {
                    Swal.fire('Lỗi kết nối', 'Không thể kết nối đến máy chủ. Vui lòng thử lại.', 'error');
                } else {
                    alert('Lỗi kết nối. Không thể gửi yêu cầu lúc này.');
                }
                console.error(error);
            } finally {
                btnSubmitRescue.innerHTML = originalBtnText;
                btnSubmitRescue.disabled = false;
            }
        });
    }
});
