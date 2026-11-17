# LAPORAN AKHIR — Putaran 5 (pembersihan sisa)

## STATUS: SELESAI

Daftar kerja putaran 5 (binding scope-aware yang mengandung angka di luar daftar putih,
kata umum+angka, dan nama hasil Putaran 4 dengan kata berulang berurutan) habis: 0 sisa
pada kedelapan file.

## 1. Tabel per file

"Berangka tersisa" diukur dengan perkakas scope-aware `worklist5.js`, yang membaca
binding asli dari AST (bukan grep mentah), dikurangi 49 nama daftar putih di
`rename/belum.md`, dan ditambah deteksi kata berulang berurutan.

| file | rename putaran 5 | binding berangka/kata-ulang tersisa di luar putih | baris sebelum | baris sesudah |
|---|---:|---:|---:|---:|
| chunk.js | 18 | 0 | 622 | 622 |
| preset.js | 566 | 0 | 13526 | 13526 |
| am-mobile-ui.js | 115 | 0 | 12002 | 12002 |
| am-movetransform.js | 27 | 0 | 1364 | 1364 |
| ffmpeg-export-v2.js | 28 | 0 | 599 | 599 |
| preview-LSW44VKB.js | 10 | 0 | 367 | 367 |
| server.cjs | 12 | 0 | 592 | 592 |
| index.html | 2 | 0 | 1171 | 1171 |
| TOTAL | 778 | 0 | 30487 | 30487 |

Rincian: 655 rename pada pemindaian utama (angka/kata-umum+angka) + 123 rename pada
pass 5b (nama hasil Putaran 4 yang mengandung frasa berulang seperti
`parseNumberListParseNumberList`, dipendekkan jadi `parseNumberListResult`).
Label: 448 PASTI, 330 STRUKTURAL — seluruhnya di `rename/rename-map.md` Putaran 5
dan Putaran 5b.

Contoh rename yang benar-benar diterapkan: `handle15Value → helperStartValue`,
`ref8Result → refElementRecord`, `obj5Items → keyframeList`,
`obj5Value → easingAttr`, `valueValue → localNodeResolved`,
`localValueValue → localNodePending`,
`parseNumberListList → parseNumberListResult`,
`resolveDefaultValueValueValue → resolveDefaultValueRaw`,
`simplexNoiseDSimplexNoiseDValue → simplexNoiseDValue`.

## 2. Daftar sisa

Tidak ada sisa. Perintah `node worklist5.js` pada keadaan akhir mencetak `TOTAL 0`
untuk kedelapan file. Detektor frasa berulang pasca-pass-5b juga mencetak
`repeated-phrase bindings after pass5b: 0`.

## 3. Keberatan terhadap daftar putih (tidak diubah, sesuai instruksi)

Saya menemukan 16 nama di `am-mobile-ui.js` yang menurut penilaian saya **generik**,
tetapi tetap saya biarkan karena termasuk daftar putih resmi di `rename/belum.md`:

- `drawSingleStrokeValue2` … `drawSingleStrokeValue9` (8 nama) — alasan di daftar
  putih ditulis "teknis: ws". Saya menilai alasan itu lemah: `ws` hanya cocok sebagai
  substring dari "dra**wS**ingle…", bukan istilah teknis yang membentuk nama.
- `hexToRgbaValue2` … `hexToRgbaValue4`, `parseHexToRgbaArValue2` … `Value4`,
  `rgbaToHexValue2` … `Value3` (8 nama) — alasan "teknis: rgba" memang menyangkut
  istilah warna, tetapi akhiran `Value2/3/4` tetap berpola generik+angka.

Saya tidak mengubahnya. Jika putaran berikutnya ingin membersihkan ini, daftar putih
perlu direvisi lebih dulu.

Delapan belas nama `preset.js` (`float32Array2`, `getUint16`, `omcolortorgbValue2`, …)
dan tujuh nama `ffmpeg-export-v2.js` (`uint8ArrayNumber2`, dll.) juga berpola mirip,
tetapi angkanya benar-benar bagian dari tipe data baku, jadi saya terima sebagai putih.

`rename/belum.md` tetap berisi 49 nama putih tersebut beserta alasannya.

## 4. Verifikasi yang benar-benar dijalankan

Node dipakai dari path lengkap
`/root/.hermes/tools/node-26.12.1-linux-x64/bin/node`.
Cadangan penuh dibuat lebih dulu:
`cp -a /root/.fileuser/experimen/openmotion /root/.hermes/cache/scratch/openmotion-backup-putaran-5`
(`BACKUP_OK`, 34M).

### 1. node --check — 7 file JS/CJS

    NODE=/root/.hermes/tools/node-26.12.1-linux-x64/bin/node
    for f in chunk.js preset.js am-mobile-ui.js am-movetransform.js \
             ffmpeg-export-v2.js preview-LSW44VKB.js; do
      cp /root/.fileuser/experimen/openmotion/$f /root/.hermes/cache/scratch/jstools/v5-$f.mjs
      $NODE --check /root/.hermes/cache/scratch/jstools/v5-$f.mjs
    done
    $NODE --check /root/.fileuser/experimen/openmotion/server.cjs

Hasil persis: `OK chunk.js`, `OK preset.js`, `OK am-mobile-ui.js`,
`OK am-movetransform.js`, `OK ffmpeg-export-v2.js`, `OK preview-LSW44VKB.js`,
`OK server.cjs`. Setiap file juga di-check segera setelah penerapan bloknya; tidak
ada CHECK_FAIL. Pemeriksaan ini dijalankan ulang pada keadaan akhir setelah pass 5b.

### 2. Script inline index.html

Perintah (dijalankan dari `/root/.hermes/cache/scratch/jstools` agar `acorn` tersedia):

    $NODE -e "const fs=require('fs'),acorn=require('acorn'); const s=fs.readFileSync('/root/.fileuser/experimen/openmotion/index.html','utf8'); let n=0; for(const m of s.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)){if(/\ssrc\s*=/.test(m[1]||''))continue; acorn.parse(m[2],{ecmaVersion:2024,sourceType:'script'}); n++;} console.log('inline scripts parsed OK:',n);"

Hasil: `inline scripts parsed OK: 5`.

### 3. Jumlah baris

Perintah: `wc -l chunk.js preset.js am-mobile-ui.js am-movetransform.js ffmpeg-export-v2.js preview-LSW44VKB.js server.cjs index.html preview.html`

Hasil akhir: 622, 13526, 12002, 1364, 599, 367, 592, 1171, 244 — total **30487**,
identik dengan sebelum putaran 5 (tabel bagian 1).

### 4. Signature literal vs git HEAD

Perintah: `$NODE /root/.hermes/cache/scratch/jstools/census.js`

Hasil (count/sha256-16), identik dengan baseline git HEAD di `rename/peta-file.md`:
chunk 1156/38130b88b3de4c83, preset 12259/4f4b7f81a1ca4110,
am-mobile-ui 6905/c447af4f8ce6adb3, am-movetransform 613/b8b7c9ec2822bb5f,
ffmpeg 373/6d9890f517c9614e, preview js 463/2f8cf5ff192aaa9a,
server 426/9f081056525342dd, index 18/47c2e82f0d2752c9, preview html 0/e3b0c44298fc1c14.

### 5. Sensus data

Hasil penghitungan ulang dari file akhir:
`{"efek":282,"kategori":11,"parameter":2422,"tag":9,"fon":43,"blend":21,"blendKategori":7,"blendEntri":28}`.
Sama persis dengan patokan.

### 6. Server + perbandingan UI

Perintah:

    cd /root/.fileuser/experimen/openmotion
    /root/.hermes/tools/node-26.12.1-linux-x64/bin/node server.cjs          # port 3000
    cd /root/.hermes/cache/scratch/openmotion-base
    OM_PORT=3001 /root/.hermes/tools/node-26.12.1-linux-x64/bin/node server.cjs

Collector `error` / `unhandledrejection` / `console.error` dipasang dengan
`Page.addScriptToEvaluateOnNewDocument` SEBELUM `goto_url` pada kedua port.

Hasil: `title identical: True` (13), `text identical: True` (97),
`buttons identical: True` (422 vs 422), `api identical: True` (113 key
`window.__AM_INTERNAL`), `am identical: True` (16 key `window.AM`),
`errors identical: True` (0 vs 0). Error konsol versi rename: `[]`.
Perbandingan ini dijalankan pada keadaan akhir setelah pass 5b.
Kedua server sudah dimatikan (pid 19475 dan 19511).

### 7. Grep/worklist akhir

    $NODE /root/.hermes/cache/scratch/jstools/worklist5.js

Hasil: `TOTAL 0` (per file semua 0). Tidak ada binding berangka di luar daftar putih,
tidak ada nama kata-umum+angka, tidak ada kata berulang berurutan.

### 8. git diff --stat

Hasil akhir: 8 file termodifikasi, `12642 insertions(+), 12642 deletions(-)`.
Tidak ada aset `preset/`, `shapes/`, `storage/`, atau file JSON data yang berubah.

## 5. Keterbatasan jujur

- Rename putaran 5 bersifat mekanis: sebagian besar nama diambil dari peran sintaktis
  (`…Result`, `…Value`, `…Arg`) dengan prefix fungsi. Keterbacaan alur data membaik,
  tetapi makna domain tidak selalu lebih kaya dari Putaran 4.
- 16 nama putih yang saya keberatkan di bagian 3 masih generik. Saya biarkan sesuai
  perintah; menyentuhnya tanpa revisi daftar putih akan melanggar aturan putaran ini.
- Verifikasi browser menyamakan UI awal dan API eksternal, bukan semua jalur interaktif.
  Klaim nol perubahan perilaku berbasis pada signature literal, node --check, dan
  kesetaraan UI/API — bukan pengujian fungsional menyeluruh.
- Fungsi diduga mati dari putaran 1 tidak dihapus, sesuai aturan.
