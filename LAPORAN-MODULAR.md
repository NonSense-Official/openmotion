# LAPORAN MODULAR — OpenMotion

## STATUS: SELESAI

Target `/root/.fileuser/experimen/openmotion-modular` dibuat ulang bersih dari sumber.
Sumber (`openmotion`) dan backup Masha (`openmotion-bersih`) tidak diubah.

- Manifest: **968/968 file** sumber terklasifikasi, 0 tidak terklasifikasi.
- Modul kode mono baru: **30 modul** (belum termasuk shim `chunk.js`/`chunk-impl.js`),
  memenuhi syarat lebih dari 20. Tidak ada modul `utils`, `helpers`, `common`, `shared`, atau `misc`.
- Aplikasi dari struktur baru terverifikasi identik dengan baseline git HEAD.

## 1. Ringkasan manifest (MANIFEST-FILE.md)

| kelas | jumlah |
|---|---:|
| kode yang dipecah | 7 |
| kode yang tetap | 0 |
| data yang dipindah hati-hati | 8 |
| data yang disalin persis | 364 |
| aset yang disalin persis | 575 |
| dokumen yang disalin | 13 |
| file runtime yang tidak diutak-atik | 1 |
| file dikecualikan | 0 |
| TOTAL | 968 |

Target berisi 1001 file: 968 file sumber + 30 modul baru + 3 dokumen baru
(`MANIFEST-FILE.md`, `PETA-MODUL.md`, `LAPORAN-MODULAR.md`). Tidak ada file sumber yang hilang.

## 2. Daftar modul mono hasil pecahan

Asal `preset.js` (state & fungsi level-atas; badan fungsi tidak diubah):

| modul | urusan | baris |
|---|---|---:|
| state.js | deklarasi state & pernyataan sampingan urutan asli | 7728 |
| engine-core.js | inti engine tanpa pengelompokan lebih sempit | 883 |
| ui-shell.js | shell UI, event, panel umum | 1011 |
| export-ffmpeg.js | jalur argumen/ekspor ffmpeg | 786 |
| engine-layer.js | layer | 579 |
| parser-value.js | parser nilai & daftar angka | 539 |
| parser-effect-xml.js | parser XML efek | 472 |
| timeline-playback.js | playback, playhead | 330 |
| shader-source.js | sumber shader dari chunk.js | 311 |
| render-text.js | render teks & logger panel | 181 |
| timeline-keyframe.js | keyframe | 172 |
| amfx-crypto.js | ChaCha/AMFX crypto | 168 |
| engine-scene.js | scene | 137 |
| ui-properties.js | inspector/properti | 126 |
| engine-transform.js | transform | 113 |
| timeline-easing.js | easing/interpolasi | 108 |
| parser-amfx.js | parser biner AMFX | 94 |
| export-render.js | pipeline render ekspor | 84 |
| noise.js | noise (dari chunk.js) | 55 |
| value-map.js | peta nilai/teks (dari chunk.js) | 53 |
| color.js | konversi warna murni | 41 |
| effect-xml.js | XML efek & angka (dari chunk.js) | 38 |
| export-progress.js | progres/status ekspor | 31 |
| render-camera.js | kamera | 29 |
| preset-data.js | data preset/fon | 21 |
| render-shape.js | shape | 5 |
| amfx-binary.js | kegagalan parser AMFX | 4 |
| param-name-map.js | cache nama parameter | 2 |

Asal `chunk.js` lain: `chunk-impl.js` (7 baris, re-export) dan `chunk.js` (12 baris, shim
alias export agar import lama tetap berfungsi).

Entry: `preset.js` (23 baris) hanya berisi import lama + import efek samping ke semua modul.

## 3. File yang tidak dipecah beserta alasan

| file | alasan |
|---|---|
| am-mobile-ui.js (12002) | satu IIFE dengan state leksikal bersama; memecahnya mengharuskan perubahan batas fungsi/closure, yang dilarang oleh aturan nol-perubahan |
| am-movetransform.js (1364) | satu IIFE mandiri, satu urusan move-transform |
| ffmpeg-export-v2.js (599) | satu urusan runtime ffmpeg, state internal bersama |
| preview-LSW44VKB.js (367) | satu urusan preview WebGL |
| server.cjs (592) | satu urusan server; tidak ada jalur file baru yang perlu ditambah karena server melayani seluruh root |
| index.html, preview.html | tetap file masuk; semua referensi relatif masih valid karena struktur aset tidak dipindah |
| am-mobile-ui.css (149437 byte) | dipertahankan: selector/id/class saling bergantung pada cascade; memecah CSS berisiko mengubah urutan aturan |
| JSON, effects/, effect-thumb/, icons/, preset/, shapes/, storage/, rename/, README, ROADMAP | data/aset/dokumen/runtime, disalin persis |

## 4. Checksum aset/data yang disalin persis

Perintah: skrip Python `hashlib.sha256` untuk setiap file yang kelasnya termasuk
`data yang disalin persis`, `aset yang disalin persis`, `dokumen yang disalin`,
`file runtime yang tidak diutak-atik`, dan `data yang dipindah hati-hati`.

Hasil: **961 file diperiksa, 0 mismatch**. Termasuk:
- effects: 336 file (XML/BIN) — persis
- effect-thumb: 386 file webp — persis
- icons: 189 file (svg/webp) — persis
- preset: 8 file — persis
- shapes: 20 file — persis
- 6 file jpg/mp3 — persis
- 11 dokumen rename/ + README.md + ROADMAP.md — persis
- 5 file JSON — persis

## 5. Verifikasi yang benar-benar dijalankan

Node: `/root/.hermes/tools/node-26.12.1-linux-x64/bin/node` (path lengkap).

### 1. node --check semua JS/CJS

    NODE=/root/.hermes/tools/node-26.12.1-linux-x64/bin/node
    cd /root/.fileuser/experimen/openmotion-modular
    for f in $(find . -path ./.git -prune -o -type f \( -name '*.js' -o -name '*.cjs' \) -print | sort); do
      cp "$f" /root/.hermes/cache/scratch/jstools/chk-final-$n.mjs
      $NODE --check /root/.hermes/cache/scratch/jstools/chk-final-$n.mjs
    done

Hasil: **37 file JS/CJS lolos**, 0 FAIL.

### 2. Parser script inline HTML

    $NODE -e "const fs=require('fs'),acorn=require('acorn'); ... acorn.parse(m[2],{ecmaVersion:2024,sourceType:'script'}) ..."

Hasil: `inline scripts parsed OK: 6`.

### 3. JSON.parse semua JSON

    $NODE -e "const fs=require('fs'),path=require('path'); ... JSON.parse(fs.readFileSync(p,'utf8')) ..."

Hasil: `JSON parsed OK: 5`.

### 4. Jumlah file manifest

Hasil: sumber 968 file (manifest), target 1001 file — 968 + 30 modul + 3 dokumen;
`missing 0`, `unclassified 0`.

### 5. Signature literal gabungan

Perintah: `/root/.hermes/cache/scratch/jstools/combined-sig.js`
(mengabaikan pernyataan ImportDeclaration dan ExportNamedDeclaration).

Hasil:
- SOURCE `{"count":22211,"hash":"b68c10718d0bd1b9","sorted":"37eed0860ed7989c"}`
- TARGET `{"count":22211,"hash":"1b1eab55b03c51fc","sorted":"37eed0860ed7989c"}`

Jumlah literal identik dan **hash multiset terurut identik** (`37eed0860ed7989c`):
tidak ada literal yang ditambah, dihapus, atau diubah. Hash berurutan berbeda karena
pernyataan dikelompokkan ulang per modul (bukan karena perubahan isi literal).

### 6. Sensus data

Hasil: `{"efek":282,"kategori":11,"parameter":2422,"tag":9,"fon":43,"blend":21,
"blendKategori":7,"blendEntri":28}` — identik dengan patokan.

### 7. Perbandingan aplikasi

    cd /root/.fileuser/experimen/openmotion-modular
    $NODE server.cjs                       # port 3000
    cd /root/.fileuser/experimen/openmotion
    OM_PORT=3001 $NODE server.cjs          # baseline git HEAD, port 3001

Collector `error`/`unhandledrejection`/`console.error` dipasang lewat
`Page.addScriptToEvaluateOnNewDocument` SEBELUM `goto_url` pada kedua port.

Hasil: `title identical: True` (13), `text identical: True` (97),
`buttons identical: True` (422 vs 422), `api identical: True` (113 key
`window.__AM_INTERNAL`), `am identical: True` (16 key `window.AM`),
`errors identical: True` (0 vs 0), `imgs identical: True` (150 gambar, semua termuat).
Kedua server sudah dimatikan.

## 6. Selisih jumlah baris

| keadaan | total baris kode+HTML |
|---|---:|
| sumber | 30487 |
| target | 30656 |
| selisih | **+169** |

Selisih +169 berasal dari: 131 baris `import` yang ditambahkan oleh penyambung modul,
28 baris daftar `export` di tiap modul, 12 baris shim `chunk.js`, 7 baris `chunk-impl.js`,
dan 1 baris akhir entry `preset.js`. Tidak ada baris fungsi yang dihapus atau dipotong.

## 7. Keterbatasan jujur

- `am-mobile-ui.js` tetap satu file besar. Alasan teknis: IIFE tunggal dengan state
  leksikal bersama; memecahnya akan mengubah batas closure dan berpotensi mengubah
  perilaku, yang dilarang.
- Beberapa modul mono kecil (2–5 baris) memang hanya berisi satu deklarasi/blok data;
  sengaja dibuat terpisah karena urusannya nyata, bukan untuk mengejar angka.
- Dua objek JavaScript di state.js (`window.__AM_INTERNAL`, `window.AM`) tetap menjadi
  titik akses bersama; nama kunci di dalamnya tidak diubah.
- Signature literal berurutan berbeda karena penyusunan ulang modul; ini adalah
  konsekuensi langsung dari pemecahan dan sudah dibuktikan tidak mengubah isi literal
  lewat hash multiset yang identik.
- Verifikasi browser mencakup UI awal, tombol, API eksternal, dan status gambar; tidak
  mencakup pengujian interaktif penuh seperti ekspor video.
