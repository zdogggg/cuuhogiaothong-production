document.addEventListener('DOMContentLoaded', () => {
    // Header shadow on scroll
    const header = document.querySelector('.header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 10) {
            header.style.boxShadow = '0 4px 15px rgba(0,0,0,0.1)';
        } else {
            header.style.boxShadow = '0 2px 10px rgba(0,0,0,0.05)';
        }
    });

    // Mobile hamburger menu toggle
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            const icon = menuToggle.querySelector('i');
            if (navMenu.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });

        // Close menu when a link is clicked
        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                const icon = menuToggle.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            });
        });
    }

    // Smooth scrolling for navigation links
    document.querySelectorAll('.nav-menu a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            // Remove active class from all
            document.querySelectorAll('.nav-menu a').forEach(a => a.classList.remove('active'));
            // Add to clicked
            this.classList.add('active');

            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerHeight - 20;
  
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Simple Testimonial Slider logic (optional, for the buttons)
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const grid = document.querySelector('.testi-grid');
    
    if (prevBtn && nextBtn && grid) {
        // Just a dummy click effect for now as CSS grid handles the layout
        prevBtn.addEventListener('click', () => {
            grid.scrollBy({ left: -300, behavior: 'smooth' });
        });
        nextBtn.addEventListener('click', () => {
            grid.scrollBy({ left: 300, behavior: 'smooth' });
        });
    }

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
            const TELEGRAM_BOT_TOKEN = 'YOUR_TELEGRAM_BOT_TOKEN';
            const TELEGRAM_CHAT_ID = 'YOUR_TELEGRAM_CHAT_ID';
            
            if (TELEGRAM_BOT_TOKEN === 'YOUR_TELEGRAM_BOT_TOKEN') {
                alert('Tính năng gửi Telegram chưa được cấu hình (Chưa có Token).');
                return;
            }

            const originalBtnText = btnSubmitRescue.innerHTML;
            btnSubmitRescue.innerHTML = '<i class="fas fa-spinner fa-spin"></i> ĐANG GỬI...';
            btnSubmitRescue.disabled = true;

            const finalLocation = mapLink ? `${location}\n📍 Bản đồ: ${mapLink}` : location;
            
            const message = `🚨 **YÊU CẦU CỨU HỘ MỚI** 🚨\n\n`
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
