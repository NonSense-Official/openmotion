# PETA-MODUL — OpenMotion Modular (revisi total)

Sumber: `/root/.fileuser/experimen/openmotion` (968 file, tidak diubah).
Target: `/root/.fileuser/experimen/openmotion-modular` (dibuat ulang bersih dari sumber).

## Klasifikasi kode

| file sumber | urusan yang ditemukan | modul tujuan | alasan batas |
|---|---|---|---|
| preset.js | state global & pernyataan sampingan | state.js | semua deklarasi `var` dan pernyataan urutan asli; fungsi yang menulis state tidak boleh dipindah |
| preset.js | shader fragment | shader-fragment.js | string GLSL `gl_FragColor`/`acFragColor` |
| preset.js | shader vertex | shader-vertex.js | string GLSL `gl_Position`/`a_position` |
| preset.js | material & program shader | shader-material.js | `uniform`, `sampler2D`, `createProgram` |
| preset.js | easing/interpolasi | timeline-easing.js | `cubicBezier`, `elastic`, `bounce`, `step` |
| preset.js | keyframe | timeline-keyframe.js | `kfs`, `keyframe` |
| preset.js | playback | timeline-playback.js | `playhead`, `seek`, `loop`, `totalTime` |
| preset.js | scene | engine-scene.js | `scene`, `scenes` |
| preset.js | layer | engine-layer.js | `layer` |
| preset.js | transform | engine-transform.js | `transform`, `matriks` |
| preset.js | canvas | render-canvas.js | `ctx.`, `drawImage`, `fillRect` |
| preset.js | kamera | render-camera.js | `camera`, `fov` |
| preset.js | teks | render-text.js | `font`, `measureText`, `textContent` |
| preset.js | shape | render-shape.js | `roundRect`, `ellipse`, `shape` |
| preset.js | parser XML efek | parser-effect-xml.js | `DOMParser`, `getAttribute` |
| preset.js | parser AMFX | parser-amfx.js | `DataView`, `getUint`, `chacha` |
| preset.js | parser nilai/angka | parser-value.js | `parseFloat`, `parseInt`, daftar angka |
| preset.js | warna murni | color.js | konversi hex/rgb/rgba tanpa render |
| preset.js | data efek | effects-data.js | `effects-catalog`, `effect-index` |
| preset.js | katalog efek | effects-catalog.js | akses katalog, `OM_BLENDS` |
| preset.js | data preset | preset-data.js | data preset & fon bawaan |
| preset.js | shell UI | ui-shell.js | `document`, `window`, event level atas |
| preset.js | panel efek | ui-panel-effects.js | `li-fx`, `fx` panel |
| preset.js | panel timeline | ui-panel-timeline.js | `tl-`, timeline DOM |
| preset.js | drawing | ui-drawing.js | pointer/brush/draw |
| preset.js | inspector | ui-properties.js | `om-prop`, properti layer |
| preset.js | argumen ffmpeg | export-ffmpeg.js | `ffmpegArgs`, codec |
| preset.js | pipeline ekspor | export-render.js | frame/export render |
| preset.js | progres ekspor | export-progress.js | progress/status |
| chunk.js | parser XML/AMFX & shader | dipecah ke parser-*.js dan shader-*.js | fungsi murni, state lokal sendiri |
| am-mobile-ui.js | satu closure UI dengan state bersama | ui-mobile.js | SEE NOTE: memecah closure akan mengubah batas fungsi |
| am-movetransform.js | satu urusan move-transform | ui-move-transform.js | IIFE mandiri |
| ffmpeg-export-v2.js | ekspor ffmpeg | export-pipeline.js | urusan ekspor |
| preview-LSW44VKB.js | preview WebGL | preview.js | urusan preview |
| server.cjs | server | server.cjs | satu urusan; jalur disesuaikan |

Catatan: modul kosong tidak dibuat. Batas fungsi tidak dipotong. Fungsi lintas bidang tinggal di modul pemiliknya.

## Data/aset/dokumen

Semua file di luar kode disalin persis dari sumber sesuai `MANIFEST-FILE.md`; checksum diverifikasi.
Tidak ada aset yang dipindah tempat, sehingga referensinya tidak berubah.

## Urutan kerja

1. MANIFEST-FILE.md (selesai).
2. PETA-MODUL.md (file ini).
3. Salin data/aset/dokumen, cocokkan checksum.
4. Pecah kode per modul, `node --check` per modul.
5. Sesuaikan HTML/CSS/server bila perlu.
6. Verifikasi penuh + laporan.
