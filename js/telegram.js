// Địa chỉ Cloudflare Worker nhận form (xem worker/README.md). Token Telegram nằm ở Worker, không ở đây.
const RESCUE_API_URL = 'https://cuuho-rescue-form.cuuho123.workers.dev';
const HOTLINE = '0979032589';

document.addEventListener('DOMContentLoaded', () => {
    // --- QUICK RESCUE FORM LOGIC ---
    const btnGetLocation = document.getElementById('btnGetLocation');
    const locationInput = document.getElementById('rescueLocation');
    const rescueForm = document.getElementById('rescueForm');
    const btnSubmitRescue = document.getElementById('btnSubmitRescue');

    let customerLat = null;
    let customerLng = null;

    function notify(title, text, icon) {
        if (typeof Swal !== 'undefined') {
            Swal.fire(title, text, icon);
        } else {
            alert(text);
        }
    }

    if (btnGetLocation && locationInput) {
        btnGetLocation.addEventListener('click', () => {
            if (navigator.geolocation) {
                const icon = btnGetLocation.querySelector('i');
                icon.className = 'fas fa-spinner fa-spin';

                navigator.geolocation.getCurrentPosition((position) => {
                    customerLat = position.coords.latitude;
                    customerLng = position.coords.longitude;
                    locationInput.value = `Đã lấy vị trí (Lat: ${customerLat.toFixed(4)}, Lng: ${customerLng.toFixed(4)})`;
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
                }, () => {
                    notify('Lỗi lấy vị trí', 'Không thể lấy vị trí. Vui lòng cho phép truy cập vị trí hoặc nhập tay.', 'error');
                    icon.className = 'fas fa-map-marker-alt';
                });
            } else {
                notify('Lỗi', 'Trình duyệt của bạn không hỗ trợ định vị.', 'error');
            }
        });
    }

    if (rescueForm) {
        rescueForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const phone = document.getElementById('rescuePhone').value.replace(/[\s.\-()]/g, '');
            const location = locationInput.value.trim();
            const service = document.getElementById('rescueService').value;
            const honeypot = document.getElementById('rescueWebsite');

            // Validate input
            if (!phone || !location || !service) {
                notify('Thiếu thông tin', 'Vui lòng điền đầy đủ thông tin!', 'warning');
                return;
            }

            // Validate phone format (Vietnamese)
            if (!/^(0|\+?84)[35789]\d{8}$/.test(phone)) {
                notify('Sai định dạng', 'Vui lòng nhập đúng số điện thoại di động (10 số)!', 'error');
                return;
            }

            // Chặn bấm gửi liên tục trên cùng máy (máy chủ cũng giới hạn riêng theo IP)
            const lastSentTime = localStorage.getItem('lastRescueSentTime');
            if (lastSentTime) {
                const timeDiff = (Date.now() - parseInt(lastSentTime)) / 1000;
                if (timeDiff < 15) {
                    const timeLeft = Math.ceil(15 - timeDiff);
                    notify('Vui lòng đợi', `Bạn đã gửi yêu cầu quá nhiều lần. Vui lòng thử lại sau ${timeLeft} giây.`, 'warning');
                    return;
                }
            }

            if (!RESCUE_API_URL) {
                notify('Chưa sẵn sàng', `Form đang bảo trì. Vui lòng gọi hotline ${HOTLINE} để được hỗ trợ ngay.`, 'info');
                return;
            }

            const originalBtnText = btnSubmitRescue.innerHTML;
            btnSubmitRescue.innerHTML = '<i class="fas fa-spinner fa-spin"></i> ĐANG GỬI...';
            btnSubmitRescue.disabled = true;

            try {
                const response = await fetch(RESCUE_API_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        phone,
                        service,
                        location,
                        lat: customerLat,
                        lng: customerLng,
                        website: honeypot ? honeypot.value : ''
                    })
                });

                const data = await response.json();

                if (data.ok) {
                    localStorage.setItem('lastRescueSentTime', Date.now().toString());

                    // Tọa độ khách lưu trên máy khách để trang theo dõi vẽ đường, không đưa lên URL.
                    if (customerLat && customerLng) {
                        localStorage.setItem('booking_' + data.bookingId, JSON.stringify({ lat: customerLat, lng: customerLng }));
                    }
                    const trackUrl = `track.html?id=${encodeURIComponent(data.bookingId)}`;

                    if (typeof Swal !== 'undefined') {
                        Swal.fire({
                            title: 'Đã nhận yêu cầu!',
                            text: `Đội cứu hộ sẽ gọi lại cho bạn trong ít phút. Cần gấp hơn, hãy gọi ${HOTLINE}.`,
                            icon: 'success',
                            showConfirmButton: false,
                            timer: 2500
                        }).then(() => {
                            window.location.href = trackUrl;
                        });
                    } else {
                        alert(`Đã nhận yêu cầu! Đội cứu hộ sẽ gọi lại cho bạn trong ít phút. Cần gấp hơn, hãy gọi ${HOTLINE}.`);
                        window.location.href = trackUrl;
                    }
                } else if (data.error === 'rate_limited') {
                    notify('Vui lòng đợi', `Bạn gửi quá nhanh. Vui lòng thử lại sau 1 phút hoặc gọi ${HOTLINE}.`, 'warning');
                } else {
                    notify('Chưa gửi được', `Có lỗi khi gửi yêu cầu. Vui lòng gọi ngay ${HOTLINE}.`, 'error');
                }
            } catch (error) {
                notify('Lỗi kết nối', `Không thể gửi yêu cầu lúc này. Vui lòng gọi ngay ${HOTLINE}.`, 'error');
                console.error(error);
            } finally {
                btnSubmitRescue.innerHTML = originalBtnText;
                btnSubmitRescue.disabled = false;
            }
        });
    }
});
