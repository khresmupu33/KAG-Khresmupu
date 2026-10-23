# Arsitektur

## Pemuatan
Halaman game hanya memasang `app/js/boot.js`. Ia memuat modul sebagai `<script>` klasik berurutan,
sehingga semua `let/const/function` global dipakai lintas modul (tanpa bundler, aman dibuka lewat `file://`).

## Modul
| Folder | Isi |
|---|---|
| `core/` | konfigurasi & konstanta, state global, utilitas, overlay landscape |
| `entities/` | pemain, item, killer, Gadfly, Archer, Lord Vindex, meteor |
| `systems/` | Time Stop, partikel, cerita, HUD |
| `modes/hard/` | adegan pembuka, serangan Vindex, urutan poin 25 |
| `render/` | panggung, latar, efek kanvas, **renderer sprite CSS** |
| `game/` | setup, loop 60 FPS tetap, alur permainan, input |

## Rendering tiga lapis
`#arena` (800×600, diskalakan CSS):
1. `#gameCanvas` — latar
2. `#spriteLayer` — karakter CSS (`render/sprites.js` memindahkan elemen DOM tiap frame)
3. `#fxCanvas` — partikel, gelombang Time Stop, laser, teks cerita

Logika tidak menyentuh DOM karakter; renderer hanya membaca state.

## Mode
Satu engine untuk semua level, dipilih lewat `<body data-level="easy|normal|hard" data-phase="continuation">`.
