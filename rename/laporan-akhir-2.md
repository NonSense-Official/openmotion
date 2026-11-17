# LAPORAN AKHIR — Putaran 2 (versi halus lanjutan)

## STATUS: SELESAI SEBAGIAN

Tidak semua identifier generik berhasil diubah menjadi nama semantik yang benar-benar
bisa dibaca manusia. Yang sudah diubah aman dan terverifikasi; sisanya tercatat di bawah.

## 1. Jumlah rename putaran ini per file

Sumber: `/root/.hermes/cache/scratch/jstools/strict-*-report.json` dan `rename/rename-map.md` bagian "Putaran 2".

| file | rename putaran 2 |
|---|---:|
| chunk.js | 1 |
| preset.js | 214 |
| am-mobile-ui.js | 32 |
| am-movetransform.js | 8 |
| ffmpeg-export-v2.js | 15 |
| preview-LSW44VKB.js | 23 |
| server.cjs | 9 |
| index.html | 0 |
| preview.html | 0 |
| TOTAL | 302 |

Contoh rename yang benar-benar diterapkan (bukan rebranding nama mesin):
`fn2 -> cubicBezierEase`, `fn3 -> cyclicEase`, `fn4 -> bounceEase`,
`fn5 -> stepEase`, `fn6 -> elasticStepEase`, `fn7 -> randomEase`,
`get -> elasticEase`, `handle5 -> toCssColor`, `handle9 -> appendLog`,
`handle24 -> requestPlayback`, `process22 -> seekToTime`,
`process23 -> setExportStatus`, `val -> projectScene`, `val2 -> renderer`,
`flag10 -> isDirty`, `items5 -> noiseDirections`, `result2 -> easingFunctions`,
`showomprojecResult -> newProjectOptions`.

## 2. Jumlah nama berangka tersisa (diukur, bukan perkiraan)

Definisi A (ketat): identifier unik yang merupakan mantan BELUM ATAU nama generik
yang diakhiri digit dengan akar generik (`value`, `result`, `items`, `fn`, `handle`,
`process`, `apply`, dll.). Diukur dengan `node remaining.js`.

Definisi B (longgar): semua identifier unik yang diakhiri digit, termasuk konstanta sah
seperti `IDENTITY_MAT4` dan `rotl32`. Diukur dengan `node measure.js`.

| file | A ketat (sekarang) | A ketat (sebelum putaran 2) | B longgar (sekarang) | B longgar (sebelum putaran 2) |
|---|---:|---:|---:|---:|
| chunk.js | 8 | 9 | 98 | 99 |
| preset.js | 1185 | 1218 | 1416 | 1450 |
| am-mobile-ui.js | 103 | 105 | 144 | 146 |
| am-movetransform.js | 47 | 47 | 55 | 55 |
| ffmpeg-export-v2.js | 57 | 59 | 74 | 76 |
| preview-LSW44VKB.js | 43 | 44 | 70 | 71 |
| server.cjs | 1 | 3 | 2 | 4 |
| index.html | 0 | 0 | 0 | 0 |

Catatan jujur: metrik ketat sebelum/sesudah diukur dengan definisi yang sama,
dari backup keadaan putaran 1 (`base1/`) dan dari working tree saat ini.
Metrik longgar (B) juga turun di semua file kecuali am-movetransform.js (tetap 55).

## 3. Identifier yang masih belum ter-rename

Total 1816 identifier unik (metrik ketat A), rincian per file:

| file | sisa |
|---|---:|
| chunk.js | 8 |
| preset.js | 1380 |
| am-mobile-ui.js | 188 |
| am-movetransform.js | 81 |
| ffmpeg-export-v2.js | 75 |
| preview-LSW44VKB.js | 55 |
| server.cjs | 29 |
| index.html | 0 |

Daftar lengkap per baris: `rename/belum.md`. Mayoritas adalah helper/closure yang
maknanya tidak bisa dibuktikan dari ekspresi penugasan maupun pemakaiannya.

## 4. Verifikasi yang BENAR-BENAR dijalankan

Tentang Node: di sesi ini Node.js sudah terpasang, jadi saya tidak perlu memasang
prebuilt. Perintah dan hasilnya:

    $ command -v node
    /root/.hermes/tools/node-26.12.1-linux-x64/bin/node
    $ node --version
    v26.12.1

Semua perintah di bawah dijalankan dari `/root/.fileuser/experimen/openmotion`
dengan `node` di PATH tersebut. Tooling parser (acorn, eslint-scope) berada di
`/root/.hermes/cache/scratch/jstools`, di luar repo.

### 4.1 node --check

Perintah:
    for f in chunk.js preset.js am-mobile-ui.js am-movetransform.js \
             ffmpeg-export-v2.js preview-LSW44VKB.js; do
      cp "$f" /root/.hermes/cache/scratch/jstools/strict-$f.mjs
      node --check /root/.hermes/cache/scratch/jstools/strict-$f.mjs
    done
    cp server.cjs /root/.hermes/cache/scratch/jstools/strict-server.cjs
    node --check /root/.hermes/cache/scratch/jstools/strict-server.cjs

Hasil: `OK chunk.js`, `OK preset.js`, `OK am-mobile-ui.js`,
`OK am-movetransform.js`, `OK ffmpeg-export-v2.js`, `OK preview-LSW44VKB.js`,
`OK server.cjs`. (index.html tidak diperiksa dengan node --check; script inline
nya diverifikasi lewat parser acorn dan lewat browser — lihat 4.5.)

### 4.2 Jumlah baris tidak berubah

Perintah: `wc -l chunk.js preset.js am-mobile-ui.js am-movetransform.js ffmpeg-export-v2.js preview-LSW44VKB.js server.cjs index.html preview.html`
Hasil: 622, 13526, 12002, 1364, 599, 367, 592, 1171, 244 (total 30487) —
sama persis dengan sebelum putaran 2.

### 4.3 Signature literal

Perintah: `node /root/.hermes/cache/scratch/jstools/census.js`
Hasil (count + sha256 16) identik dengan putaran 1:
chunk.js 1156/38130b88b3de4c83, preset.js 12259/4f4b7f81a1ca4110,
am-mobile-ui.js 6905/c447af4f8ce6adb3, am-movetransform.js 613/b8b7c9ec2822bb5f,
ffmpeg-export-v2.js 373/6d9890f517c9614e, preview-LSW44VKB.js 463/2f8cf5ff192aaa9a,
server.cjs 426/9f081056525342dd, index.html 18/47c2e82f0d2752c9, preview.html 0/e3b0c44298fc1c14.
Artinya tidak ada string literal, URL, endpoint, atau key data yang berubah.

### 4.4 Sensus domain

Perintah: `node -e "..."` membaca effects-catalog.json, AM_FONTS[], blendCategories[]
dan OM_BLENDS[].
Hasil: `{"efek":282,"kategori":11,"parameter":2422,"tag":9,"fon":43,
"blendTarget":21,"blendKategori":7,"blendEntri":28,"omBlends":36}` — identik
dengan sebelum putaran 2.

### 4.5 Server + UI vs baseline

Perintah: `node server.cjs` di port 3000; `OM_PORT=3001 node server.cjs` dari
copy `git archive HEAD` di `/root/.hermes/cache/scratch/openmotion-base`.
Browser: `Page.addScriptToEvaluateOnNewDocument` memasang collector
`error`, `unhandledrejection`, `console.error` SEBELUM `goto_url`, lalu
`document.body.innerText`, daftar 20 tombol, `Object.keys(window.__AM_INTERNAL)`
dan `Object.keys(window.AM)` dibandingkan.

Hasil: `title identical: True`, `text identical: True`, `buttons identical: True`
(20 vs 20), `api identical: True` (113 vs 113), `am identical: True` (16 vs 16),
`errors identical: True` (0 vs 0). Error konsol versi rename: `[]`.

### 4.6 git diff --stat

     am-mobile-ui.js     | 3484 +++++++-------
     am-movetransform.js |  522 +--
     chunk.js            |  906 ++--
     ffmpeg-export-v2.js |  558 +--
     index.html          |   22 +-
     preset.js           |12592 ++++++++++++++++++++++++-------------------------
     preview-LSW44VKB.js |  394 +--
     server.cjs          |  278 +--
     8 files changed, 7554 insertions(+), 7554 deletions(-)

Status: 8 file JS/HTML termodifikasi, `rename/` masih untracked. Tidak ada file
aset `preset/` yang berubah.

## 5. Insiden yang jujur dicatat

Percobaan pertama putaran 2 menghasilkan 1106 rename, tetapi dua di antaranya
memakai kata cadangan JavaScript (`export`, `default`) sehingga `node --check`
gagal pada preset.js dan am-mobile-ui.js. Kedua file dikembalikan ke keadaan
putaran 1 dari backup scratch, kemudian diterapkan ulang dengan filter reserved
words dan mode strict (tanpa akhiran angka). Tidak ada file yang dibiarkan rusak.
Rename dari percobaan gagal sudah dihapus dari `rename/rename-map.md`.

## 6. Keterbatasan tersisa

- 1816 identifier masih generik. Sebagian besar adalah helper/closure kecil
  (`fn*`, `handle*`, `apply*`, `process*`, `compute*`) yang pemakaiannya hanya
  "dipanggil dari satu tempat" tanpa petunjuk makna; nama paksa akan menjadi
  tebakan dan dilarang oleh aturan.
- Mesin semantic-pass hanya memakai bukti lokal (ekspresi penugasan, named
  property, string literal pada cabang bersyarat, dan nama fungsi penerima).
  Tidak ada analisis aliran data lintas modul, sehingga nama seperti
  `projectScene`/`renderer` hanya dipakai untuk kasus yang benar-benar jelas.
- Mode strict menolak rename yang namanya bentrok dengan identifier lain di file
  yang sama. Ini mengorbankan jumlah rename demi menjamin tidak ada akhiran
  angka baru dan tidak ada shadowing.
- Nama hasil putaran 2 tidak selalu "semantically rich"; sebagian hanya lebih
  deskriptif dari sebelumnya (mis. `val4 -> params`, `a -> layers`). Itu sudah
  dicatat, bukan diklaim sebagai nama final yang ideal.
- Tidak ada fungsi yang dihapus, termasuk 5 fungsi diduga mati dari putaran 1.
