"""Đổi tên miền website ở mọi chỗ (canonical, Open Graph, JSON-LD, sitemap, robots, trang 404, Worker, script sinh trang).

Cách dùng (ví dụ khi đã mua tên miền):
    python scripts/set_domain.py https://cuuhogiaothong123.vn

Lệnh này tự sinh lại 6 trang dịch vụ + sitemap và thêm tên miền mới vào ALLOWED_ORIGINS của Worker.
Việc còn phải làm tay sau đó:
  1. cd worker && npx wrangler deploy        (để Worker nhận tên miền mới và tạo đúng link tài xế)
  2. Firebase console → Authentication → Settings → Authorized domains → thêm tên miền (để đăng nhập admin)
"""
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")  # cmd/PowerShell Windows in được tiếng Việt
    sys.stderr.reconfigure(encoding="utf-8", errors="replace")
FILES = ["index.html", "404.html", "robots.txt", "sitemap.xml", "worker/wrangler.toml",
         "scripts/build_service_pages.py"]


def main():
    if len(sys.argv) != 2 or not re.match(r"^https://[a-z0-9.-]+(/[\w.-]+)*$", sys.argv[1]):
        sys.exit("Dùng: python scripts/set_domain.py https://ten-mien-cua-ban.vn")
    new = sys.argv[1].rstrip("/")

    current = re.search(r'SITE_URL = "([^"]+)"', (ROOT / "scripts/build_service_pages.py").read_text(encoding="utf-8")).group(1)
    if current == new:
        sys.exit("Tên miền đã là " + new)

    for rel in FILES:
        path = ROOT / rel
        text = path.read_text(encoding="utf-8")
        if current in text:
            path.write_text(text.replace(current, new), encoding="utf-8", newline="\n")
            print("updated", rel)

    # Worker chỉ nhận form từ các origin trong ALLOWED_ORIGINS: thêm origin của tên miền mới (giữ origin cũ)
    origin = re.match(r"^https://[^/]+", new).group(0)
    wrangler = ROOT / "worker/wrangler.toml"
    text = wrangler.read_text(encoding="utf-8")
    m = re.search(r'ALLOWED_ORIGINS = "([^"]*)"', text)
    if m and origin not in m.group(1).split(","):
        text = text.replace(m.group(0), f'ALLOWED_ORIGINS = "{origin},{m.group(1)}"')
        wrangler.write_text(text, encoding="utf-8", newline="\n")
        print("added", origin, "to ALLOWED_ORIGINS")

    # Sinh lại trang dịch vụ + sitemap theo tên miền mới (import sau khi đã ghi SITE_URL mới)
    sys.path.insert(0, str(ROOT / "scripts"))
    import bump_assets
    bump_assets.main()

    print(f"\n{current} -> {new}")
    print("Còn phải làm tay: (1) cd worker && npx wrangler deploy  (2) thêm tên miền vào Firebase Authorized domains")


if __name__ == "__main__":
    main()
