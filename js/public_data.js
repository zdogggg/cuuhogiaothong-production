const firebaseConfigPublic = {
    apiKey: "AIzaSyAalG0Z_esnaZpnbRTTX45GSOtlK5Ee-Xs",
    authDomain: "cuuhogiaothong123.firebaseapp.com",
    databaseURL: "https://cuuhogiaothong123-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "cuuhogiaothong123",
    storageBucket: "cuuhogiaothong123.firebasestorage.app",
    messagingSenderId: "1069997605416",
    appId: "1:1069997605416:web:9e9a43fff4ecb65080eb1d",
    measurementId: "G-167S4JD9YL"
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfigPublic);
} else {
    firebase.app(); // if already initialized, use that one
}

const publicDb = firebase.database();

document.addEventListener('DOMContentLoaded', () => {
    // 1. Load Pricing
    const pricingList = document.getElementById('publicPricingList');
    if(pricingList) {
        publicDb.ref('pricing').on('value', (snapshot) => {
            const data = snapshot.val() || {};
            pricingList.innerHTML = '';
            
            const keys = Object.keys(data).sort((a,b) => (data[a].order || 0) - (data[b].order || 0));
            
            if(keys.length === 0) {
                pricingList.innerHTML = '<div style="text-align: center; grid-column: 1 / -1;">Đang cập nhật bảng giá...</div>';
                return;
            }
            
            keys.forEach(key => {
                const item = data[key];
                const card = document.createElement('div');
                card.style.cssText = 'background: #fff; padding: 20px; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.05); text-align: center; border: 1px solid #f0f0f0; transition: transform 0.3s;';
                card.innerHTML = `
                    <h3 style="color: #333; font-size: 1.2rem; margin-bottom: 10px;">${item.service}</h3>
                    <div style="color: #d32f2f; font-size: 1.5rem; font-weight: 800;">${item.price}</div>
                `;
                card.onmouseover = () => card.style.transform = 'translateY(-5px)';
                card.onmouseout = () => card.style.transform = 'translateY(0)';
                pricingList.appendChild(card);
            });
        });
    }

    // 2. Load News
    const newsList = document.getElementById('publicNewsList');
    if(newsList) {
        publicDb.ref('news').on('value', (snapshot) => {
            const data = snapshot.val() || {};
            newsList.innerHTML = '';
            
            const keys = Object.keys(data).sort((a,b) => (data[b].timestamp || 0) - (data[a].timestamp || 0));
            
            if(keys.length === 0) {
                newsList.innerHTML = '<div style="text-align: center; grid-column: 1 / -1;">Đang cập nhật tin tức...</div>';
                return;
            }
            
            keys.forEach(key => {
                const item = data[key];
                const card = document.createElement('div');
                card.style.cssText = 'background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05); border: 1px solid #f0f0f0; transition: transform 0.3s;';
                
                const imgSection = item.image_url ? `<img src="${item.image_url}" alt="${item.title}" style="width: 100%; height: 200px; object-fit: cover;">` : `<div style="width: 100%; height: 200px; background: #e0e0e0; display: flex; align-items: center; justify-content: center;"><i class="fas fa-image" style="font-size: 3rem; color: #bbb;"></i></div>`;
                
                card.innerHTML = `
                    ${imgSection}
                    <div style="padding: 20px;">
                        <span style="font-size: 0.85rem; color: #888; margin-bottom: 8px; display: block;"><i class="far fa-calendar-alt"></i> ${item.date}</span>
                        <h3 style="font-size: 1.2rem; color: #333; margin-bottom: 10px; line-height: 1.4;">${item.title}</h3>
                        <p style="font-size: 0.95rem; color: #666; line-height: 1.6; margin-bottom: 15px;">${item.summary ? item.summary.replace(/\\n/g, '<br>') : ''}</p>
                        <a href="tel:0989123123" style="color: #d32f2f; font-weight: 600; text-decoration: none; display: inline-flex; align-items: center; gap: 5px;">Gọi ngay <i class="fas fa-arrow-right"></i></a>
                    </div>
                `;
                card.onmouseover = () => card.style.transform = 'translateY(-5px)';
                card.onmouseout = () => card.style.transform = 'translateY(0)';
                newsList.appendChild(card);
            });
        });
    }
});
