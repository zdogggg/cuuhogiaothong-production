"""Đổi tên miền website ở mọi chỗ (canonical, Open Graph, JSON-LD, sitemap, robots, Worker, script sinh trang).

Cách dùng (ví dụ khi đã mua tên miền):
    python scripts/set_domain.py https://cuuhogiaothong123.vn

Sau đó chạy lại scripts/build_service_pages.py và scripts/build_sitemap.py.
Nhớ thêm tên miền mới vào ALLOWED_ORIGINS (worker/wrangler.toml) và Firebase Authorized domains.
"""
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
FILES = ["index.html", "robots.txt", "sitemap.xml", "worker/wrangler.toml",
         "scripts/build_service_pages.py", "scripts/build_sitemap.py"]


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
    print(f"{current} -> {new}")


if __name__ == "__main__":
    main()
