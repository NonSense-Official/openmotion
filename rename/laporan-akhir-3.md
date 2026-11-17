# LAPORAN AKHIR — Putaran 3 (per blok, prioritas referensi)

## STATUS: SELESAI SEBAGIAN

Strategi diganti sesuai instruksi: identifier sisa diurutkan menurut jumlah referensi,
lalu dikerjakan per fungsi/blok dengan membaca konteks lokal. Hasilnya aman dan
terverifikasi, tetapi dari 1770 sisa hanya 52 yang berhasil dinamai ulang.

## 1. Jumlah rename putaran ini per file

Sumber: `/root/.hermes/cache/scratch/jstools/r3-apply-*.json`,
`rename/rename-map.md` bagian "Putaran 3", dan `r3-confidence.tsv`.

| file | rename | PASTI | STRUKTURAL |
|---|---:|---:|---:|
| chunk.js | 3 | 1 | 2 |
| preset.js | 42 | 39 | 3 |
| am-mobile-ui.js | 3 | 3 | 0 |
| am-movetransform.js | 0 | 0 | 0 |
| ffmpeg-export-v2.js | 1 | 1 | 0 |
| preview-LSW44VKB.js | 0 | 0 | 0 |
| server.cjs | 3 | 2 | 1 |
| index.html | 0 | 0 | 0 |
| TOTAL | 52 | 46 | 6 |

Contoh hasil (label di peta):
- PASTI, state global preset.js: `number7 -> playheadMs` (133 ref; dipakai
  `renderer.renderAt(number7)`, `number7/1000`, `volume.currentTime`),
  `flag2 -> isPlaying` (31 ref; `requestPlayback`, `volume.pause()`),
  `number9 -> targetFps`, `number15 -> playbackRate`, `flag11 -> loopPlayback`
  (`number7 % totalTime` saat loop), `flag12 -> audioLoadFailed`
  (diset saat `audio.error` dan log "timeline jalan tanpa suara"),
  `flag13 -> isScrubbing` (pointerdown/pointerup/cancel pada seekEl),
  `flag14 -> isExporting`, `flag15 -> exportCancelled`,
  `Ve -> exportBlobUrl` (`URL.revokeObjectURL(Ve), Ve = null`),
  `number14 -> audioDriftMs` (dicetak sebagai `"drift " + number14 + 'ms'`).
- PASTI, blok canvas preset.js: `ltValue109 -> layerSize`,
  `val3 -> layerWidthPx`, `val4 -> layerHeightPx`,
  `ltValue110 -> shapeType`, `je2 -> shapeSize`,
  `ltValue111 -> scaledCornerRadius`, `ltValue112 -> isNonRectShape`,
  `ltValue117 -> fillColor`, `ltValue118 -> heightScale`.
- PASTI, blok ikon kamera: `ltValue122 -> cameraFovDegrees` (`a.fov || 60`),
  `ltNumber16 -> cameraBodyHalfWidth` (26; `roundRect(-w,-h,w*2,h*2)`),
  `ltNumber17 -> cameraBodyHalfHeight` (18; pasangan lebar-tinggi yang diminta).
- PASTI, parser path SVG `ref2`: `ref2Items2 -> pathTokens`,
  `ref2Number2/3 -> currentX/currentY`, `ref2Number4/5 -> subpathStartX/Y`,
  `ref2Number6/7 -> previousControlX/Y` (dipakai untuk refleksi kontrol S/T),
  `ref2Items3 -> commandArgs`.
- STRUKTURAL: `flag8 -> hasMediaItems`, `number5 -> videoBuildVersion`,
  `ref2Number8 -> argIndex`, `index4/index3 -> scanIndex`,
  `index2 -> roundIndex`, `index5 -> permIndex`.
- File lain: `p -> paramDef` (am-mobile-ui.js), `t -> transformState`,
  `I -> amInternal`, `fx -> effect`, `val5 -> ffmpegModule`,
  `res -> response`, `req -> request`, `data -> projectData`.

Tujuh entri dari peta preset.js dan tiga entri dari peta chunk.js tidak diterapkan
karena nama yang dipilih sudah dipakai identifier lain di file yang sama; mode strict
menolak bentrok daripada menambahkan akhiran angka.

## 2. Jumlah nama berangka unik per file (diukur dengan grep)

Perintah yang dijalankan (dari `/root/.fileuser/experimen/openmotion`):

    PAT='\b[A-Za-z_$][A-Za-z_$]*[0-9]+\b'
    grep -oE "$PAT" <file> | sort -u | wc -l

"Sebelum" diukur dari salinan keadaan putaran 2
(`/root/.hermes/cache/scratch/jstools/strict-<file>.mjs`). Untuk `index.html`
tidak ada salinan terpisah; file itu tidak diubah di putaran 3, jadi sebelum=sesudah.

| file | sebelum | sesudah | selisih |
|---|---:|---:|---:|
| chunk.js | 123 | 120 | -3 |
| preset.js | 1102 | 1071 | -31 |
| am-mobile-ui.js | 237 | 237 | 0 |
| am-movetransform.js | 65 | 65 | 0 |
| ffmpeg-export-v2.js | 68 | 68 | 0 |
| preview-LSW44VKB.js | 75 | 75 | 0 |
| server.cjs | 11 | 11 | 0 |
| index.html | 26 | 26 | 0 |

Catatan: ini metrik leksikal sesuai permintaan (grep), jadi token di dalam string
literal seperti `mp3`, `mp4`, `sha256`, `utf8`, `Win64` ikut terhitung. Itu tidak
berubah karena literal tidak disentuh.

## 3. Identifier yang masih belum ter-rename

1770 identifier unik tersisa (dari 1816 sebelum putaran 3).

| file | sisa |
|---|---:|
| chunk.js | 5 |
| preset.js | 1338 |
| am-mobile-ui.js | 188 |
| am-movetransform.js | 81 |
| ffmpeg-export-v2.js | 75 |
| preview-LSW44VKB.js | 55 |
| server.cjs | 28 |
| index.html | 0 |

Daftar lengkap per baris ada di `rename/belum.md` (ditulis ulang putaran ini).

## 4. Verifikasi yang benar-benar dijalankan

Node dipanggil dengan path lengkap sesuai instruksi:

    /root/.hermes/tools/node-26.12.1-linux-x64/bin/node --version
    v26.12.1

(Catatan jujur: di sesi ini `command -v node` juga mengembalikan path yang sama,
jadi Node sebenarnya ada di PATH; saya tetap memakai path lengkap di semua perintah.)

### 4.1 node --check

    NODE=/root/.hermes/tools/node-26.12.1-linux-x64/bin/node
    for f in chunk.js preset.js am-mobile-ui.js am-movetransform.js \
             ffmpeg-export-v2.js preview-LSW44VKB.js; do
      cp "$f" /root/.hermes/cache/scratch/jstools/r3chk-$f.mjs
      $NODE --check /root/.hermes/cache/scratch/jstools/r3chk-$f.mjs
    done
    cp server.cjs /root/.hermes/cache/scratch/jstools/r3chk-server.cjs
    $NODE --check /root/.hermes/cache/scratch/jstools/r3chk-server.cjs

Hasil persis: `OK chunk.js`, `OK preset.js`, `OK am-mobile-ui.js`,
`OK am-movetransform.js`, `OK ffmpeg-export-v2.js`, `OK preview-LSW44VKB.js`,
`OK server.cjs`. Tidak ada error. `index.html` tidak di-check dengan node --check
(karena HTML); script inline-nya tidak diubah di putaran 3 dan divalidasi lewat parser
pada putaran sebelumnya.

### 4.2 Jumlah baris

    wc -l chunk.js preset.js am-mobile-ui.js am-movetransform.js \
           ffmpeg-export-v2.js preview-LSW44VKB.js server.cjs index.html preview.html

Hasil: 622, 13526, 12002, 1364, 599, 367, 592, 1171, 244; total 30487.
Sama persis dengan sebelum putaran 3.

### 4.3 Signature literal

    $NODE /root/.hermes/cache/scratch/jstools/census.js

Hasil identik dengan putaran 2 (count + sha256 16): chunk.js 1156/38130b88b3de4c83,
preset.js 12259/4f4b7f81a1ca4110, am-mobile-ui.js 6905/c447af4f8ce6adb3,
am-movetransform.js 613/b8b7c9ec2822bb5f, ffmpeg-export-v2.js 373/6d9890f517c9614e,
preview-LSW44VKB.js 463/2f8cf5ff192aaa9a, server.cjs 426/9f081056525342dd,
index.html 18/47c2e82f0d2752c9, preview.html 0/e3b0c44298fc1c14.

### 4.4 Sensus domain

Tidak dijalankan ulang di putaran 3 dengan perintah terpisah; tetapi signature literal
(4.3) identik, yang mencakup semua data efek/font/blend, jadi nilai
282 / 11 / 2422 / 9 / 43 / 21 tidak mungkin berubah. Pernyataan ini saya batasi
pada bukti tersebut, bukan pada eksekusi sensus domain baru.

### 4.5 Server + perbandingan UI

Perintah yang dijalankan:

    cd /root/.fileuser/experimen/openmotion
    /root/.hermes/tools/node-26.12.1-linux-x64/bin/node server.cjs        # port 3000
    cd /root/.hermes/cache/scratch/openmotion-base
    OM_PORT=3001 /root/.hermes/tools/node-26.12.1-linux-x64/bin/node server.cjs

Browser: collector `error`, `unhandledrejection`, `console.error` dipasang lewat
`Page.addScriptToEvaluateOnNewDocument` SEBELUM `goto_url`, pada kedua port.

Hasil persis: `title identical: True` (13 vs 13), `text identical: True`
(97 vs 97), `buttons identical: True` (20 vs 20), `api identical: True`
(113 vs 113), `am identical: True` (16 vs 16), `errors identical: True`
(0 vs 0). Error konsol versi rename: `[]`.

Kedua server sudah dimatikan setelah verifikasi.

### 4.6 git diff --stat

    am-mobile-ui.js     | 2610 ++++++-------
    am-movetransform.js |  486 +--
    chunk.js            |  906 ++---
    ffmpeg-export-v2.js |  484 +--
    index.html          |   22 +-
    preset.js           |10294 +++++++++++++++++++++++++-------------------------
    preview-LSW44VKB.js |  310 +-
    server.cjs          |  272 +-
    8 files changed, 7692 insertions(+), 7692 deletions(-)

Status: 8 file termodifikasi, `rename/` masih untracked. Tidak ada file aset
`preset/` yang berubah.

## 5. Keterbatasan tersisa

- Cara ini tetap tidak menuntaskan preset.js: 1338 identifier masih generik.
  Dari 1380 yang masuk daftar awal putaran ini, hanya 42 yang dinamai ulang.
- Banyak nama berada di scope kecil dengan satu pemakaian tanpa petunjuk makna
  (`fn*`, `handle*`, `apply*`, `process*`, `compute*`); memberi nama paksa akan
  melanggar larangan mengarang nama.
- Nama yang bentrok dengan identifier lain di file yang sama dilewati. Ini
  mencegah akhiran angka baru, tetapi mengurangi jumlah rename.
- Label STRUKTURAL dipakai untuk 6 nama yang hanya mendeskripsikan peran
  (`hasMediaItems`, `videoBuildVersion`, `argIndex` di preset.js;
  `roundIndex`, `permIndex` di chunk.js; `projectData` di server.cjs), bukan
  makna domain yang terbukti.
- Tidak ada fungsi yang dihapus, termasuk 5 fungsi diduga mati dari putaran 1.
