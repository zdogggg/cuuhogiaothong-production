"""Sinh sitemap.xml từ trang chủ + các trang dịch vụ trong build_service_pages.py.

    python scripts/build_sitemap.py
"""
import datetime
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "scripts"))
from build_service_pages import SERVICES, SITE_URL  # noqa: E402


def lastmod(rel):
    # Ngày commit gần nhất của file; chưa commit thì lấy ngày sửa file
    try:
        out = subprocess.run(["git", "log", "-1", "--format=%cs", "--", rel], cwd=ROOT,
                             capture_output=True, text=True, check=True).stdout.strip()
        if out:
            return out
    except (OSError, subprocess.CalledProcessError):
        pass
    return datetime.date.fromtimestamp((ROOT / rel).stat().st_mtime).isoformat()


def main():
    pages = [("", "index.html")] + [(f"{s['slug']}/", f"{s['slug']}/index.html") for s in SERVICES]
    urls = "\n".join(
        f"  <url>\n    <loc>{SITE_URL}/{path}</loc>\n    <lastmod>{lastmod(rel)}</lastmod>\n  </url>"
        for path, rel in pages
    )
    xml = f'<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n{urls}\n</urlset>\n'
    (ROOT / "sitemap.xml").write_text(xml, encoding="utf-8", newline="\n")
    print(f"sitemap.xml: {len(pages)} URL")


if __name__ == "__main__":
    main()
