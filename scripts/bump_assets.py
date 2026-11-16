"""Cập nhật số phiên bản ?v= của CSS/JS trong mọi file HTML theo nội dung file.

Chạy sau mỗi lần sửa css/ hoặc js/ (trước khi commit/deploy):
    python scripts/bump_assets.py

File nào đổi nội dung thì ?v= đổi theo, nên trình duyệt của khách luôn tải bản mới
mà không phải nhớ tăng số bằng tay. Lệnh này cũng sinh lại 6 trang dịch vụ và sitemap.
"""
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")  # cmd/PowerShell Windows in được tiếng Việt
sys.path.insert(0, str(ROOT / "scripts"))
import build_service_pages  # noqa: E402
import build_sitemap  # noqa: E402

PAGES = ["index.html", "admin.html", "driver.html", "track.html"]
ASSET = re.compile(r'((?:css|js)/[\w.-]+\.(?:css|js))\?v=[\w]+')


def main():
    for rel in PAGES:
        path = ROOT / rel
        text = path.read_text(encoding="utf-8")
        new = ASSET.sub(lambda m: f"{m.group(1)}?v={build_service_pages.asset_v(m.group(1))}", text)
        if new != text:
            path.write_text(new, encoding="utf-8", newline="\n")
            print("updated", rel)
    build_service_pages.main()
    build_sitemap.main()


if __name__ == "__main__":
    main()
