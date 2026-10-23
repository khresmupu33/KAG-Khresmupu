# Killer & Gadfly

Game web arena 800×600 — bertahan hidup, kumpulkan target, hindari Gadfly, Killer, Archer, meteor, dan (mode Sulit) Lord Vindex.
Static site tanpa build: cukup buka `index.html` atau taruh folder ini di hosting statis.

## Struktur folder

```
index.html                      landing page
google395259613be6fb9e.html     verifikasi Search Console (harus tetap di akar)
app/
  pages/                        menu, cara-main, mudah, normal, sulit, sulit-lanjutan
  js/                           seluruh logika game (lihat docs/ARSITEKTUR.md)
    boot.js                     pemuat modul (urutan di sini penting)
    core/  entities/  systems/  render/  modes/hard/  game/
assets/
  css/
    characters/                 desain tiap karakter dengan CSS murni
    game/                       gaya halaman game (HUD, overlay, layar akhir, kontrol)
    pages/                      landing, menu, cara main
    themes/hard.css            tema ungu mode Sulit
  js/                           skrip situs (galeri karakter, fullscreen)
docs/                           dokumentasi
tests/smoke.py                  tes asap Playwright
```

## Karakter CSS

Pemain, target, item (nyawa / Power Kill / Time Stop), Gadfly, Killer, Archer + panah, Lord Vindex, dan meteor
digambar dengan CSS di `assets/css/characters/*.css`. Markup tiap karakter ada satu tempat:
`app/js/render/sprite-templates.js`. Gameplay, landing page, dan halaman cara main memakai karakter yang sama.

Menambah karakter baru: tambah `xxx.css`, daftarkan di `characters.css`, tambah markup di `sprite-templates.js`,
lalu buat fungsi update di `render/sprites.js`.

## Menjalankan tes

```
pip install playwright && playwright install chromium
python tests/smoke.py
```

## Perubahan penting

- `mudah.html` sebelumnya memakai level *normal* (salinan normal.html). Kini benar-benar level *easy*.
- Tiga engine (`game.js`, `sulit.js`, `sulit_lanjutan.js`) digabung menjadi satu engine modular.
  `sulit.js` adalah versi lama dari `sulit_lanjutan.js`; kedua halaman Sulit kini memakai logika laser Vindex terbaru.
- Logika Mudah/Normal/Sulit diverifikasi identik dengan versi lama lewat tes banding (RNG, jam, dan input yang sama).
- CSS dipecah per bagian; warna tema merah/ungu jadi variabel; CSS yang mati dibuang.
- Kode mati dibuang (`showRules`, `quitGame`, `endingSequence`, dll.).
