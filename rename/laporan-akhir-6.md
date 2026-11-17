# LAPORAN AKHIR — Putaran 6 (terakhir)

## STATUS: SELESAI

Keberatan putaran 5 diterima. 16 nama yang dicabut dari daftar putih sudah di-rename
dengan nama yang membedakan varian berdasarkan bukti badan dan pemanggilnya. Sisa
daftar putih 33 nama teknis tidak disentuh.

## 1. Daftar 16 rename beserta label keyakinan

Bukti penamaan:

- Keluarga `drawSingleStroke` berada di cabang `pointsArg.tool === "brush"`, dalam dua
  loop berlawanan arah yang membangun outline goresan. Loop pertama (maju) menghitung
  tangent dan offset tepi kiri; loop kedua (mundur) menghitung tangent dan offset tepi
  kanan. Itu membedakan keempat pasangan nilai, bukan sekadar urutan angka.
- `hexToRgba` memotong string hex menjadi 4 pasangan: `[0,2]=R`, `[2,4]=G`, `[4,6]=B`,
  `[6,8]=A`. Nama lama `hexToRgbaValue` (tanpa angka) sudah dipakai untuk R, sehingga
`Value2/3/4` berturut-turut adalah G, B, A.
- `parseHexToRgbaArr` melakukan pemotongan yang sama dengan fallback `|| 0/255`, jadi
  nama baru diberi awalan `parsed` untuk membedakan jalur ini dari `hexToRgba`.
- `rgbaToHex(r, g, b, a)` di baris 3213 menerima `colorToHexStrParseColor.r/.g/.b/.a`;
  parameter ke-2 dan ke-3 adalah green dan blue.

| file | lama | baru | label |
|---|---|---|---|
| am-mobile-ui.js | `drawSingleStrokeValue2` | `forwardTangentX` | PASTI |
| am-mobile-ui.js | `drawSingleStrokeValue3` | `forwardTangentY` | PASTI |
| am-mobile-ui.js | `drawSingleStrokeValue4` | `forwardEdgeOffsetX` | PASTI |
| am-mobile-ui.js | `drawSingleStrokeValue5` | `forwardEdgeOffsetY` | PASTI |
| am-mobile-ui.js | `drawSingleStrokeValue6` | `reverseTangentX` | PASTI |
| am-mobile-ui.js | `drawSingleStrokeValue7` | `reverseTangentY` | PASTI |
| am-mobile-ui.js | `drawSingleStrokeValue8` | `reverseEdgeOffsetX` | PASTI |
| am-mobile-ui.js | `drawSingleStrokeValue9` | `reverseEdgeOffsetY` | PASTI |
| am-mobile-ui.js | `hexToRgbaValue2` | `greenChannel` | PASTI |
| am-mobile-ui.js | `hexToRgbaValue3` | `blueChannel` | PASTI |
| am-mobile-ui.js | `hexToRgbaValue4` | `alphaChannel` | PASTI |
| am-mobile-ui.js | `parseHexToRgbaArValue2` | `parsedGreenChannel` | PASTI |
| am-mobile-ui.js | `parseHexToRgbaArValue3` | `parsedBlueChannel` | PASTI |
| am-mobile-ui.js | `parseHexToRgbaArValue4` | `parsedAlphaChannel` | PASTI |
| am-mobile-ui.js | `rgbaToHexValue2` | `greenByte` | PASTI |
| am-mobile-ui.js | `rgbaToHexValue3` | `blueByte` | PASTI |

Jumlah rename putaran ini: **16**, seluruhnya PASTI. Tidak ada konflik nama; tidak ada
akhiran angka baru; tidak ada kata cadangan JavaScript.

## 2. Daftar putih final

`rename/belum.md` sekarang berisi **33** nama: chunk.js 7, preset.js 18,
ffmpeg-export-v2.js 7, preview-LSW44VKB.js 1, dan 0 pada file lain. Ke-16 nama yang
dicabut sudah dihapus dari daftar itu. Nama teknis lain (`float32Array2`, `getUint16`,
`uint8ArrayNumber2`, dll.) tidak disentuh.

## 3. Verifikasi yang benar-benar dijalankan

Node dipanggil dari path lengkap
`/root/.hermes/tools/node-26.12.1-linux-x64/bin/node`. Cadangan dibuat lebih dulu:
`cp -a /root/.fileuser/experimen/openmotion /root/.hermes/cache/scratch/openmotion-backup-putaran-6` → `BACKUP_OK`, 34M.

### Rename + check langsung

    $NODE /root/.hermes/cache/scratch/jstools/rename.js am-mobile-ui.js \
      /root/.hermes/cache/scratch/jstools/r6-map.json apply \
      /root/.hermes/cache/scratch/jstools/r6-apply.json
    cp am-mobile-ui.js /root/.hermes/cache/scratch/jstools/r6chk.mjs
    $NODE --check /root/.hermes/cache/scratch/jstools/r6chk.mjs

Hasil: `{"file":"am-mobile-ui.js","renameCount":16,"unnamedCount":0}` dan `CHECK_OK`.

### 1. node --check — 7 file JS/CJS

    for f in chunk.js preset.js am-mobile-ui.js am-movetransform.js \
             ffmpeg-export-v2.js preview-LSW44VKB.js; do
      cp /root/.fileuser/experimen/openmotion/$f /root/.hermes/cache/scratch/jstools/v6-$f.mjs
      $NODE --check /root/.hermes/cache/scratch/jstools/v6-$f.mjs
    done
    $NODE --check /root/.fileuser/experimen/openmotion/server.cjs

Hasil: `OK chunk.js`, `OK preset.js`, `OK am-mobile-ui.js`, `OK am-movetransform.js`,
`OK ffmpeg-export-v2.js`, `OK preview-LSW44VKB.js`, `OK server.cjs`. Nol error.

### 2. Script inline index.html

Dijalankan dari `/root/.hermes/cache/scratch/jstools` agar `acorn` tersedia:

    $NODE -e "const fs=require('fs'),acorn=require('acorn'); const s=fs.readFileSync('/root/.fileuser/experimen/openmotion/index.html','utf8'); let n=0; for(const m of s.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)){if(/\ssrc\s*=/.test(m[1]||''))continue; acorn.parse(m[2],{ecmaVersion:2024,sourceType:'script'}); n++;} console.log('inline scripts parsed OK:',n);"

Hasil: `inline scripts parsed OK: 5`.

### 3. Jumlah baris

Perintah: `wc -l chunk.js preset.js am-mobile-ui.js am-movetransform.js ffmpeg-export-v2.js preview-LSW44VKB.js server.cjs index.html preview.html`

Hasil: 622, 13526, 12002, 1364, 599, 367, 592, 1171, 244 — total **30487**, identik
dengan keadaan awal putaran ini maupun putaran sebelumnya.

### 4. Signature literal vs git HEAD

Perintah: `$NODE /root/.hermes/cache/scratch/jstools/census.js`

Hasil identik dengan baseline git HEAD di `rename/peta-file.md`: chunk 1156/38130b88b3de4c83,
preset 12259/4f4b7f81a1ca4110, am-mobile-ui 6905/c447af4f8ce6adb3,
am-movetransform 613/b8b7c9ec2822bb5f, ffmpeg 373/6d9890f517c9614e,
preview js 463/2f8cf5ff192aaa9a, server 426/9f081056525342dd,
index 18/47c2e82f0d2752c9, preview html 0/e3b0c44298fc1c14.

### 5. Sensus data

Hasil: `{"efek":282,"kategori":11,"parameter":2422,"tag":9,"fon":43,"blend":21,"blendKategori":7,"blendEntri":28}` — identik dengan patokan.

### 6. Server + perbandingan UI

    cd /root/.fileuser/experimen/openmotion
    $NODE server.cjs                      # port 3000
    cd /root/.hermes/cache/scratch/openmotion-base
    OM_PORT=3001 $NODE server.cjs         # port 3001

Collector `error`, `unhandledrejection`, `console.error` dipasang lewat
`Page.addScriptToEvaluateOnNewDocument` SEBELUM `goto_url` pada kedua port.

Hasil: `title identical: True` (13), `text identical: True` (97),
`buttons identical: True` (422 vs 422), `api identical: True` (113 key
`window.__AM_INTERNAL`), `am identical: True` (16 key `window.AM`),
`errors identical: True` (0 vs 0). Error konsol versi rename: `[]`.
Kedua server sudah dimatikan (pid 20546 dan 20582).

### 7. Worklist akhir

Perintah: `$NODE /root/.hermes/cache/scratch/jstools/worklist5.js`
Hasil: `TOTAL 0` untuk kedelapan file.

### 8. git diff --stat

8 file termodifikasi, `12642 insertions(+), 12642 deletions(-)`. Tidak ada aset
`preset/`, `shapes/`, `storage/`, atau JSON data yang berubah.

## 4. Keterbatasan jujur

- Enam belas nama baru menggantikan pola generik+angka dengan nama yang menjelaskan
  peran geometris (tangent/edge offset) atau kanal warna. Label PASTI dipakai karena
  bukti pemotongan string dan arah loop terlihat langsung di kode.
- Tidak ada verifikasi fungsional interaktif menyeluruh (misalnya ekspor video penuh);
  klaim nol perubahan perilaku berbasis pada node --check, signature literal, dan
  kesetaraan UI/API terhadap baseline git HEAD.
- 33 nama putih tersisa mengandung angka teknis dan sengaja tidak disentuh sesuai
  keputusan putaran ini.
- Fungsi diduga mati dari putaran 1 tetap ada, sesuai aturan.
