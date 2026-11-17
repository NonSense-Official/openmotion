# LAPORAN AKHIR — Putaran 4 (tuntas)

## STATUS: SELESAI

Definisi selesai terpenuhi: daftar kerja gabungan habis (0 identifier generik tersisa),
seluruh rename terverifikasi nol perubahan perilaku, dan sisa yang tercatat hanya nama
berangka yang masuk daftar putih beserta alasannya.

## 1. Tabel per file

| file | rename putaran 4 | angka unik grep sebelum | angka unik grep sesudah | baris sebelum | baris sesudah |
|---|---:|---:|---:|---:|---:|
| chunk.js | 100 | 143 | 55 | 622 | 622 |
| preset.js | 3466 | 1548 | 398 | 13526 | 13526 |
| am-mobile-ui.js | 654 | 358 | 236 | 12002 | 12002 |
| am-movetransform.js | 133 | 82 | 28 | 1364 | 1364 |
| ffmpeg-export-v2.js | 138 | 93 | 30 | 599 | 599 |
| preview-LSW44VKB.js | 139 | 96 | 28 | 367 | 367 |
| server.cjs | 63 | 12 | 10 | 592 | 592 |
| index.html | 6 | 100 | 100 | 1171 | 1171 |
| preview.html | 0 | 0 | 0 | 244 | 244 |
| TOTAL | 4699 | 2432 | 885 | 30487 | 30487 |

Perintah pengukuran angka unik (dijalankan sebelum dan sesudah):

    grep -oE '[a-zA-Z_$][a-zA-Z0-9_$]*[0-9]+' <file> | sort -u | wc -l

Angka sesudah mencakup token di dalam string literal/CSS (mis. `mp4`, `sha256`,
`utf8`, `index2` pada selector CSS), yang memang tidak boleh disentuh.

- Total rename putaran ini: 4699.
- Kumulatif putaran 1 + 2 + 3 + 4: 2619 + 302 + 52 + 4699 = 7672 rename.
- Label PASTI: 2776. Label STRUKTURAL: 1923. Semua tercatat di `rename/rename-map.md`
  bagian "Putaran 4".

## 2. Sisa yang tidak ter-rename

Tidak ada sisa identifier generik. `rename/daftar-kerja-sisa.md` (dihasilkan ulang
dari gabungan tiga sumber) berisi 0 entri untuk kedelapan file.

Yang tercatat di `rename/belum.md` hanyalah 49 nama berangka yang dipertahankan
karena masuk daftar putih — daftar lengkap dengan alasan per nama di bagian 3.

## 3. Daftar putih final beserta alasan

Alasan umum: angka pada nama-nama ini adalah bagian dari istilah teknis baku,
konstanta format, atau nama fungsi baku; bukan akhiran generik hasil deobfuskasi.

| file | nama | alasan |
|---|---|---|
| chunk.js | `IDENTITY_MAT4` | matriks identitas 4×4, istilah `mat4` |
| chunk.js | `NOISE_GRAD3` | tiga komponen gradien noise, istilah `grad3` |
| chunk.js | `readF64` | baca float 64-bit (`f64`) |
| chunk.js | `readNullableF64` | baca float 64-bit nullable (`f64`) |
| chunk.js | `readU16` | baca unsigned 16-bit (`u16`) |
| chunk.js | `readU8` | baca unsigned 8-bit (`u8`) |
| chunk.js | `rotl32` | rotate-left 32-bit, istilah baku `rotl32` |
| preset.js | 18 nama | tipe data baku (`uint8`, `int16`, `int32`, `float32`, `float64`, `f64`, `u8`, `u16`, `u32`) |
| am-mobile-ui.js | 16 nama | tipe data/WebGL baku (`vec2`, `vec3`, `vec4`, `mat3`, `mat4`, `rgba`, `hsl`, dll.) |
| am-movetransform.js | 0 | — |
| ffmpeg-export-v2.js | 7 nama | codec/format baku (`h264`, `h265`, `mp3`, `mp4`, `wav`, `webp`) |
| preview-LSW44VKB.js | 1 nama | tipe WebGL baku (`mat4`/`vec`) |
| server.cjs | 0 | — |

Rincian per nama dengan baris dan istilah yang cocok ada di `rename/belum.md`.

## 4. Verifikasi yang benar-benar dijalankan

Semua perintah memakai Node dari path lengkap
`/root/.hermes/tools/node-26.12.1-linux-x64/bin/node`. Cadangan penuh dibuat lebih
dulu di `/root/.hermes/cache/scratch/openmotion-backup-putaran-4` (`cp -a`).

### 1. node --check — 7 file JS/CJS

    NODE=/root/.hermes/tools/node-26.12.1-linux-x64/bin/node
    for f in chunk.js preset.js am-mobile-ui.js am-movetransform.js \
             ffmpeg-export-v2.js preview-LSW44VKB.js; do
      cp "$f" /root/.hermes/cache/scratch/jstools/finalchk-$f.mjs
      $NODE --check /root/.hermes/cache/scratch/jstools/finalchk-$f.mjs
    done
    $NODE --check server.cjs

Hasil: `OK chunk.js`, `OK preset.js`, `OK am-mobile-ui.js`,
`OK am-movetransform.js`, `OK ffmpeg-export-v2.js`, `OK preview-LSW44VKB.js`,
`OK server.cjs`. Nol error.

### 2. Script inline index.html

Perintah (dijalankan dari folder scratch agar modul `acorn` tersedia):

    $NODE -e "const fs=require('fs'),acorn=require('acorn'); const s=fs.readFileSync('/root/.fileuser/experimen/openmotion/index.html','utf8'); let n=0; for(const m of s.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)){if(/\ssrc\s*=/.test(m[1]||''))continue; acorn.parse(m[2],{ecmaVersion:2024,sourceType:'script'}); n++;} console.log('inline scripts parsed OK:',n);"

Hasil: `inline scripts parsed OK: 5`.

### 3. Jumlah baris

Perintah: `wc -l chunk.js preset.js am-mobile-ui.js am-movetransform.js ffmpeg-export-v2.js preview-LSW44VKB.js server.cjs index.html preview.html`

Hasil akhir: 622, 13526, 12002, 1364, 599, 367, 592, 1171, 244; total 30487 —
identik dengan pengukuran awal (tabel bagian 1).

### 4. Signature literal vs git HEAD

Perintah: `$NODE /root/.hermes/cache/scratch/jstools/census.js`

Hasil akhir (count + sha256 16), identik dengan nilai baseline di `rename/peta-file.md`
dan dengan git HEAD: chunk.js 1156/38130b88b3de4c83,
preset.js 12259/4f4b7f81a1ca4110, am-mobile-ui.js 6905/c447af4f8ce6adb3,
am-movetransform.js 613/b8b7c9ec2822bb5f, ffmpeg-export-v2.js 373/6d9890f517c9614e,
preview-LSW44VKB.js 463/2f8cf5ff192aaa9a, server.cjs 426/9f081056525342dd,
index.html 18/47c2e82f0d2752c9, preview.html 0/e3b0c44298fc1c14.

### 5. Sensus data

Hasil penghitungan ulang dari file akhir:
`{"efek":282,"kategori":11,"parameter":2422,"tag":9,"fon":43,"blend":21,"blendKategori":7,"blendEntri":28,"omBlends":36}`.
Sama persis dengan patokan.

### 6. Server + UI vs baseline

Perintah:

    cd /root/.fileuser/experimen/openmotion
    /root/.hermes/tools/node-26.12.1-linux-x64/bin/node server.cjs          # port 3000
    cd /root/.hermes/cache/scratch/openmotion-base
    OM_PORT=3001 /root/.hermes/tools/node-26.12.1-linux-x64/bin/node server.cjs

Browser: collector `error`, `unhandledrejection`, `console.error` dipasang lewat
`Page.addScriptToEvaluateOnNewDocument` SEBELUM `goto_url` pada kedua port.

Hasil: `title identical: True` (13), `text identical: True` (97),
`buttons identical: True` (422 vs 422 tombol, seluruhnya),
`api identical: True` (113 key `window.__AM_INTERNAL`),
`am identical: True` (16 key `window.AM`),
`errors identical: True` (0 vs 0). Error konsol versi rename: `[]`.
Kedua server sudah dimatikan (pid 17212 dan 17247).

### 7. Grep akhir dan sisa daftar kerja

Perintah grep akhir ada di bagian 1 (tabel sebelum/sesudah).
Perintah sisa: `$NODE /root/.hermes/cache/scratch/jstools/worklist4-final.js`
Hasil: `TOTAL WORK 0` untuk kedelapan file.

### 8. git diff --stat (tambahan)

    am-mobile-ui.js     | 4994 +++++++--------
    am-movetransform.js |  692 +--
    chunk.js            |  906 +--
    ffmpeg-export-v2.js |  748 +--
    index.html          |   28 +-
    preset.js           |16878 +++++++++++++++++++++++++-------------------------
    preview-LSW44VKB.js |  484 +--
    server.cjs          |  468 +--
    8 files changed, 12599 insertions(+), 12599 deletions(-)

Tidak ada file aset `preset/`, `shapes/`, `storage/`, atau JSON data yang berubah.

## 5. Keterbatasan yang jujur

- Nama hasil generator massal memang bebas dari pola generik berangka, tetapi
  sebagian bersifat STRUKTURAL dan kurang kaya makna domain: misalnya
  `parseAmfxBinaryValueValue`, `buildFragmentShaderSourceRecord`, atau
  `initAmMobileUiValue`. Pembaca paham alur data dan asal nama, tapi tidak selalu
  paham makna bisnis dari variabel itu tanpa membaca badan fungsi.
- Pendekatan scope-aware memakai satu set nama unik per file. Konflik diselesaikan
  dengan akhiran bermakna (`ById`, `El`, `List`, `Map`, `Raw`, `Parsed`, `Index`,
  `Count`, dan kosakata serupa), bukan angka baru — ini menjaga aturan, tetapi
  kadang menghasilkan nama panjang.
- Tiga rename terakhir (`res5`, `a2`, `res2` di beberapa scope) memakai label
  STRUKTURAL murni karena tidak ada bukti makna domain; nama yang dipilih hanya
  menyebut peran syntaktisnya.
- Fungsi yang diduga mati dari putaran 1 tidak dihapus, sesuai aturan.
- Verifikasi browser membuktikan UI awal dan API eksternal identik; ia tidak
  menguji setiap jalur kode interaktif (misalnya ekspor video penuh), jadi klaim
  "nol perubahan perilaku" didasarkan pada signature literal + kesetaraan UI/API
  + node --check, bukan pada pengujian fungsional menyeluruh.
