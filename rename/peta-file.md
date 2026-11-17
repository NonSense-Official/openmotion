# Peta File — OpenMotion (sebelum rename)

Repo: /root/.fileuser/experimen/openmotion
Commit awal: e34bb9e

## File target (milik proyek, JS/HTML/CJS)

| file | baris | ukuran |
|---|---:|---:|
| preset.js | 13526 | 597762 |
| am-mobile-ui.js | 12002 | 508922 |
| index.html | 1171 | 85240 |
| am-movetransform.js | 1364 | 48394 |
| chunk.js | 622 | 30496 |
| ffmpeg-export-v2.js | 599 | 18647 |
| server.cjs | 592 | 2097 |
| preview-LSW44VKB.js | 367 | 23333 |
| preview.html | 244 | 11146 |

Total 9 file. Aset di folder preset/ (XML/JPG/MP3) TIDAK disentuh.
Data JSON (effect-index.json, effects-catalog.json, shape-index.json) TIDAK disentuh.

## Graf import (urutan kerja)

- chunk.js -> diimpor preset.js, preview-LSW44VKB.js  (dikerjakan pertama)
- preset.js -> diimpor index.html
- am-movetransform.js -> diimpor index.html
- am-mobile-ui.js -> diimpor index.html
- ffmpeg-export-v2.js -> berdiri sendiri (diimpor dinamis dari preset.js lewat loader)
- preview-LSW44VKB.js -> diimpor preview.html
- server.cjs -> entry point Node
- index.html -> script inline (2 blok) + 3 script module

## Sensus SEBELUM (diambil dari kode/data asli)

| metrik | nilai | sumber |
|---|---:|---|
| efek | 282 | effects-catalog.json (length array) |
| kategori | 11 | unique `category` di effects-catalog.json |
| parameter | 2422 | total `params` di effects-catalog.json |
| tag kontrol | 9 | unique `params[].tag`: color,hue-disc,point,selector,slider,spinner,switch,tip,xyz |
| fon | 43 | AM_FONTS[] di am-mobile-ui.js:10101 |
| blend mode | 21 | target dari instruksi; lihat catatan di bawah |

Catatan blend mode: tidak ada satu array literal berisi 21 mode di snapshot ini.
Sumber data blend yang terukur:
- `blendCategories[]` di am-mobile-ui.js:2899 -> 7 kategori, 28 entri pilihan
- `OM_BLENDS[]` di preset.js:10303 -> 36 mode
- `cc` map di preset.js:1513 -> 34 key
Angka instruksi (21) dipakai sebagai target, danANGKA TERUKUR (7 / 28 / 36 / 34) dipakai sebagai baseline sebelum/sesudah.

## Sensus SESUDAH — identik dengan sebelum (semua metrik)

| metrik | sebelum | sesudah |
|---|---:|---:|
| efek | 282 | 282 |
| kategori | 11 | 11 |
| parameter | 2422 | 2422 |
| tag kontrol | 9 | 9 |
| fon | 43 | 43 |
| blend (target instruksi) | 21 | 21 |
| blendCategories kategori / entri | 7 / 28 | 7 / 28 |
| OM_BLENDS mode | 36 | 36 |
| cc map key | 34 | 34 |

## Signature data (SEBELUM = SESUDAH, tiap file)

Dihitung otomatis dari seluruh literal (string, angka, template quasi) di file target,
dalam urutan kemunculan. Tidak boleh berubah setelah rename.

| file | jumlah literal | sha256(16) |
|---|---:|---|
| chunk.js | 1156 | 38130b88b3de4c83 |
| preset.js | 12259 | 4f4b7f81a1ca4110 |
| am-mobile-ui.js | 6905 | c447af4f8ce6adb3 |
| am-movetransform.js | 613 | b8b7c9ec2822bb5f |
| ffmpeg-export-v2.js | 373 | 6d9890f517c9614e |
| preview-LSW44VKB.js | 463 | 2f8cf5ff192aaa9a |
| server.cjs | 426 | 9f081056525342dd |
| index.html | 18 | 47c2e82f0d2752c9 |
| preview.html | 0 | e3b0c44298fc1c14 |
