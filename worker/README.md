# Worker nhận form cứu hộ → Telegram

Website gửi form tới Worker này; Worker kiểm tra dữ liệu, chặn spam rồi gửi tin vào Telegram.
Token bot chỉ nằm trong Cloudflare, không nằm trong code website.

## Triển khai (một lần, ~15 phút)

1. **Thu hồi token cũ**: Telegram → @BotFather → `/revoke` → chọn bot → nhận token mới.
2. Tạo tài khoản Cloudflare (miễn phí), cài Node.js, rồi trong thư mục `worker/`:

```bash
npx wrangler login
```

```bash
npx wrangler secret put TELEGRAM_BOT_TOKEN
```

```bash
npx wrangler secret put TELEGRAM_CHAT_ID
```

```bash
npx wrangler deploy
```

3. Lệnh `deploy` in ra địa chỉ dạng `https://cuuho-rescue-form.<ten>.workers.dev`.
   Dán địa chỉ đó vào `RESCUE_API_URL` ở đầu file `js/telegram.js`.
4. Khi có tên miền riêng: sửa `SITE_URL` và `ALLOWED_ORIGINS` trong `wrangler.toml`, chạy lại `npx wrangler deploy`.

## Chạy thử ở máy (với Docker cổng 8082)

Tạo file `worker/.dev.vars` (đã nằm trong `.gitignore`, không commit):

```
TELEGRAM_BOT_TOKEN=token_moi
TELEGRAM_CHAT_ID=chat_id
SITE_URL=http://localhost:8082
```

Chạy `npx wrangler dev` trong thư mục `worker/` (mặc định ở `http://localhost:8787`), rồi tạm đặt
`RESCUE_API_URL = 'http://localhost:8787'` trong `js/telegram.js` và build lại Docker. Nhớ đổi lại địa chỉ thật trước khi push.

## Kiểm tra

Mở website → gửi form với số điện thoại thật của mình → Telegram phải nhận được tin, bấm link "nhận cuốc" mở đúng `driver.html`.
