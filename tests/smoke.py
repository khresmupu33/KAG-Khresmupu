"""
Tes asap (smoke test): semua halaman terbuka tanpa error dan gameplay berjalan.

Jalankan dari akar proyek:
    pip install playwright && playwright install chromium
    python tests/smoke.py
"""
from pathlib import Path
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parent.parent
PAGES = ["index.html", "app/pages/menu.html", "app/pages/cara-main.html"]
GAMES = {"mudah": "easy", "normal": "normal", "sulit": "hard", "sulit-lanjutan": "hard"}


def main():
    failures = []
    with sync_playwright() as p:
        browser = p.chromium.launch()

        def open_page(rel):
            page = browser.new_page(viewport={"width": 1100, "height": 760})
            errors = []
            page.on("pageerror", lambda e: errors.append(str(e)))
            page.on("console", lambda m: errors.append(m.text) if m.type == "error" else None)
            page.goto((ROOT / rel).as_uri())
            page.wait_for_timeout(600)
            return page, errors

        for rel in PAGES:
            page, errors = open_page(rel)
            sprites = page.evaluate("document.querySelectorAll('.kg').length")
            print(f"{rel:34} sprite={sprites:<3} error={errors}")
            if errors:
                failures.append(rel)

        for name, level in GAMES.items():
            rel = f"app/pages/{name}.html"
            page, errors = open_page(rel)
            page.keyboard.press("ArrowRight")
            page.wait_for_timeout(300)
            page.keyboard.press(" ")
            page.keyboard.down("ArrowLeft")
            page.wait_for_timeout(1500)
            page.keyboard.up("ArrowLeft")
            state, lv, sprites = page.evaluate("[gameState, level, document.querySelectorAll('#spriteLayer .kg').length]")
            ok = lv == level and sprites > 0 and not errors
            print(f"{rel:34} state={state:<10} level={lv:<7} sprite={sprites:<3} {'OK' if ok else 'GAGAL'} {errors}")
            if not ok:
                failures.append(rel)
        browser.close()

    if failures:
        raise SystemExit("GAGAL: " + ", ".join(failures))
    print("Semua halaman OK")


if __name__ == "__main__":
    main()
