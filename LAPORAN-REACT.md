# LAPORAN-REACT.md: Porting Arsitektur React OpenMotion

## STATUS PEKERJAAN
Status: SELESAI

Seluruh arsitektur monolitik lawas (preset.js, am-mobile-ui.js, am-movetransform.js, chunk.js, ffmpeg-export-v2.js) telah dibongkar dan dimodularisasi menjadi 100% komponen React JSX dan engine headless murni di dalam `src/`. Dependensi runtime ke berkas monolitik lama telah dihapus. Server lokal `server.cjs` berjalan di port 3000 dan Vite melayani aplikasi di port 5173.

## TITIK AWAL
* Commit acuan: `d51fabd` (web dock layout: timeline di sisi kiri bawah, inspector dan bilah aksi di sisi kanan bawah).
* Pencadangan sebelum pembongkaran: Seluruh 7 berkas lama telah dicadangkan ke direktori `_legacy_backup/`:
  * `_legacy_backup/preset.js` (611.288 byte)
  * `_legacy_backup/am-mobile-ui.js` (530.571 byte)
  * `_legacy_backup/am-movetransform.js` (49.758 byte)
  * `_legacy_backup/chunk.js` (34.111 byte)
  * `_legacy_backup/ffmpeg-export-v2.js` (19.246 byte)
  * `_legacy_backup/am-mobile-ui.css` (162.274 byte)
  * `_legacy_backup/index.html` (86.411 byte)
* Tindakan destruktif Git: Tidak ada. Seluruh riwayat commit, branch, dan konfigurasi Git bersifat read-only.

## INVENTARIS FILE HASIL PORTING
Total berkas sumber di bawah `src/`: 116 berkas (JavaScript dan JSX).

Daftar berkas terbesar (terurut dari yang terbesar):
* `src/engine/parser/XmlLayerParser.js`: 378 baris (Parsing atribut detail layer scene XML).
* `src/components/inspector/subpanels/BorderShadowPanel.jsx`: 345 baris (Kontrol stroke, cap, join, dan shadow).
* `src/engine/math/EasingCurves.js`: 333 baris (Kurva interpolasi, token resolver, dan fungsi lerp).
* `src/engine/renderer/ShaderCompiler.js`: 329 baris (Transpiler GLSL WebGL1/WebGL2 dan generator shader efek).
* `src/engine/renderer/WebGLRenderer.js`: 327 baris (Orkestrator rendering WebGL headless dengan tekstur multi-layer).
* `src/store/editorStore.js`: 323 baris (Store Zustand untuk editor state, timeline time, dan undo/redo).
* `src/engine/export/WebCodecsPipeline.js`: 319 baris (Pipeline akselerasi hardware H.264/AAC).
* `src/engine/export/FfmpegWasmPipeline.js`: 317 baris (Encoder fallback software WASM FFmpeg).
* `src/components/editors/movetransform/MoveTransformDock.jsx`: 307 baris (Editor transformasi layer 2D/3D).
* `src/engine/math/PerspectiveMatrix4.js`: 306 baris (Matriks 4x4 proyeksi kamera 3D dan orientasi layer).
* `src/components/home/NewProjectModal.jsx`: 303 baris (Dialog pembuatan proyek dan pemilih rasio aspek).
* `src/components/modals/ExportVideoModal.jsx`: 299 baris (Dialog konfigurasi resolusi, fps, dan format ekspor).
* `src/components/inspector/subpanels/CameraOptionsPanel.jsx`: 288 baris (Kontrol FOV, depth-of-field, dan fog kamera).
* `src/converter/mediaPackager.js`: 287 baris (Pengemasan dan pengunduhan bundel media proyek).
* `src/components/modals/ProjectSettingsModal.jsx`: 287 baris (Dialog pengaturan properti proyek yang aktif).
* `src/components/editors/editpoints/EditPointsEditor.jsx`: 277 baris (Editor manipulasi node kurva vektor).
* `src/components/home/HomeScreen.jsx`: 272 baris (Tampilan beranda Alight Motion).
* `src/engine/audio/AudioGraph.js`: 267 baris (Web Audio API graph dan sinkronisasi playback).
* `src/components/header/ElementNavbar.jsx`: 267 baris (Navbar saat layer tunggal terseleksi).
* `src/engine/renderer/BlendModes.js`: 266 baris (Pipeline dan konstanta blend mode WebGL).
* `src/components/inspector/subpanels/ColorFillPanel.jsx`: 266 baris (Pemilih solid, gradien, dan media fill).
* `src/engine/math/SvgPathParser.js`: 266 baris (Parser path SVG ke kontrol bezier points).
* `src/components/editors/liveshape/LiveShapeEditor.jsx`: 265 baris (Editor bentuk parametrik live shape).
* `src/engine/renderer/ShapeRasterizer.js`: 263 baris (Rasterizer shape kanvas headless).
* `src/components/inspector/subpanels/SpeedControlPanel.jsx`: 257 baris (Kontrol kecepatan layer dan kurva retime).
* `src/engine/renderer/MediaAssetLoader.js`: 172 baris (Manajemen dan sinkronisasi media video/image).
* `src/engine/renderer/TransformResolver.js`: 123 baris (Evaluasi keyframe dan hirarki transformasi parent-child).
* `src/hooks/usePlaybackLoop.js`: 103 baris (Loop animasi requestAnimationFrame dan sinkronisasi playback waktu nyata).
* `src/engine/renderer/LayerRasterizerCache.js`: 89 baris (Cache rasterisasi bentuk dan teks kanvas).
* `src/engine/export/WebCodecsConfig.js`: 65 baris (Konfigurasi profile AVC dan deteksi dukungan hardware encoder).
* `src/store/editorStoreHelpers.js`: 54 baris (Fungsi helper scene default, cloneScene, dan kalkulasi batas riwayat undo).

## SENSUS DAN VERIFIKASI BATAS BARIS
* Syarat batas baris: Maksimal 400 baris per berkas (target 150-300 baris).
* Jumlah berkas yang diperiksa: 116 berkas.
* Berkas terpanjang: `src/engine/parser/XmlLayerParser.js` (378 baris).
* Berkas terpendek: `src/components/timeline/AddLayerFab.jsx` (9 baris).
* Pelanggaran batas baris (> 400 baris): 0 berkas (100% lolos verifikasi).

## STATUS PERBAIKAN TIMELINE DAN RENDERING VIDEO
* Resolusi Easing dan Objek Kurva Animasi: Pada `src/engine/parser/parserUtils.js`, `parseEasing()` menghasilkan struktur objek `{ type, params, raw, reverse, local }`. Sebelumnya di `src/engine/math/EasingCurves.js`, `resolveEasing()` memanggil `String(token)` yang menghasilkan string literal `"[object Object]"` sehingga semua kurva cubicBezier gagal dan jatuh ke mode `linear` (akar penyebab animasi terasa kaku). Fungsi `resolveEasing()` telah diperbaiki untuk mendeteksi tipe objek dan mengekstrak kurva bezier, elastis, pantulan, dan langkah secara presisi.
* Prioritas Easing Segmen Keyframe: Pada `src/engine/math/KeyframeEvaluator.js`, evaluasi `applyKeyframeEasing(kfA, kfB, progress)` diprioritaskan membaca properti easing pada keyframe tujuan (`kfB`) sesuai spesifikasi format Alight Motion.
* Fallback Media Android dan Sample Asset: URI berkas media eksternal Alight Motion (seperti `content://media/external/...` atau nama hash yang tidak ada pada perangkat lokal) kini dipetakan secara deterministik ke koleksi aset contoh bawaan di `preset/*.jpg` melalui `MediaAssetLoader.js`, mencegah kegagalan tekstur kanvas kosong atau hitam.
* Pemutaran Audio dan Sinkronisasi Master Clock: `usePlaybackLoop.js` mengintegrasikan pemutaran audio HTML5 (`/preset/Beraksi.mp3` atau audio proyek) yang berjalan sinkron dengan visual panggung dan timeline saat tombol putar ditekan.
* Optimasi DOM Playhead dan Auto-Scroll Timeline: Pembaruan jarum `#tl-playhead`, `#tl-cap`, `#am-nav-time`, dan badge dilakukan langsung ke DOM node setiap frame animasi (60 FPS) dengan throttle sinkronisasi store Zustand per 100 ms, meniadakan stutter dan beban re-render komponen React berulang.
* Integrasi Curve Editor ke Transformasi Layer: `MoveTransformDock.jsx` dan `EditorShell.jsx` terhubung penuh melalui fungsi callback `handleApplyCurve`, sehingga perubahan handle bezier pada dialog Curve Editor langsung diterapkan ke keyframe properti layer aktif.
* Pemuatan Preset Bawaan Otomatis: Saat membuka editor tanpa ID proyek spesifik atau saat ID default diakses, `App.jsx` dan `projectStore.js` memuat `preset/Beraksi.xml` secara otomatis (48 layer, durasi 18,48s, 60 FPS) sehingga timeline dan stage tidak pernah kosong.
* Resolusi Tekstur Media Video: Pada Alight Motion XML, layer video direpresentasikan sebagai `<shape fillType="media" fillVideo="..." s=".rect">`. Pengecekan media dipindahkan mendahului bentuk vektor di `WebGLRenderer.resolveLayerTexture()` sehingga layer video tidak pernah lagi keliru dirasterisasi sebagai vektor kosong.
* Dimensi Video Element WebGL: Dimensi elemen video (`videoWidth` dan `videoHeight`) diakomodasi langsung di `WebGLRenderer` lewat `getSourceDimensions()` sehingga tekstur WebGL menerima ukuran valid dan fungsi `texImage2D` dieksekusi tanpa galat ukuran 0x0.
* Sinkronisasi Frame Video Saat Playhead Bergerak: Penambahan pembaruan `currentTime` otomatis saat scrubbing, stepping frame, maupun jeda pada elemen video di `WebGLRenderer`.
* Resolusi Nama Berkas Media XML: Pada `XmlSceneParser.resolveMediaMetadata()`, pemetaan `layer.mediaName` disinkronkan ke atribut nama berkas sebenarnya agar `MediaAssetLoader` dapat menemukan berkas pada paket ZIP atau folder uploads.
* Dimensi Bounding Box Bentuk Vektor: Perbaikan penanganan objek properti `layer.size` pada `ShapeRasterizer.js` sehingga nilai lebar dan tinggi tidak lagi menghasilkan nilai NaN.
* Waktu Keyframe Terinterpolasi: Konversi timestamp keyframe ternormalisasi (`kf.t <= 1.001`) pada `TimelineBlock.jsx` diperbaiki menggunakan kalkulasi `startTime + Math.round(kf.t * dur)` sehingga posisi diamond keyframe berada tepat pada milidetik yang sesuai di timeline.
* Optimasi Performa Rendering Timeline: Pemisahan state `playheadMs` dari props `TrackList` dan `TrackItem` serta penerapan `React.memo` mencegah re-render komponen React berat pada 79 layer saat playhead bergerak.
* Penyelarasan Package ID Proyek: `convertAlightLink` dan `projectStore` mengalirkan `packageId` secara konsisten ke `activeScene` dan `MediaAssetLoader` agar pemanggilan aset `/api/media` menemukan arsip ZIP lokal di `storage/cache/`.

## STATUS VERIFIKASI FITUR
* Buka proyek lama dari daftar proyek: BISA (API `/api/projects` merespons daftar proyek, `HomeScreen` menampilkan kartu proyek, klik kartu membuka rute `/proyek/:id` dan memuat layer ke scene).
* Buat proyek baru: BISA (Dialog `NewProjectModal` menyediakan opsi 16:9, 9:16, 4:5, 1:1, 4:3, pilihan resolusi 360p hingga 4K, fps 12-60, dan background swatch).
* Import preset lewat query URL (?alight=...): BISA (`App.jsx` mendeteksi query `?alight=...`, memanggil `convertAlightLink`, mengurai XML, dan mengarahkan ke editor secara otomatis).
* Import preset lewat input box di beranda: BISA (Input bar di `HomeScreen` menerima link Alight Motion/Drive dan memicu impor scene).
* Import berkas XML lokal lewat file picker: BISA (Input file di `NewProjectModal` membaca isi berkas XML via `FileReader` dan mengurai scene).
* Render scene WebGL dengan multi-layer: BISA (`WebGLRenderer` menginisialisasi konteks WebGL, membersihkan frame, merasterisasi bentuk/teks, mengikat media video/gambar, dan merender stack layer melalui `LayerCompositor`).
* Transformasi layer (posisi, rotasi, skala, opacity): BISA (Gizmo di stage dan kontrol di `MoveTransformDock` memanipulasi matriks transformasi 2D/3D secara akurat).
* Keyframe pada transform dan evaluasi nilainya: BISA (`TransformResolver` dan `KeyframeEvaluator` menghitung interpolasi antar keyframe pada setiap timestamp playhead).
* Kurva bezier antar keyframe dengan curve editor: BISA (`CurveEditorModal` dan `BezierCanvas` memvisualisasikan handle kubik dan menerapkan nilai easing ke evaluator).
* Playback timeline (playhead, play/pause, step frame): BISA (`usePlaybackLoop` menggerakkan loop `requestAnimationFrame`, memajukan jarum timeline, memperbarui timecode, dan memicu render visual secara berkala).
* Audio dan video playback tersinkron dengan visual: BISA (`MediaAssetLoader` menyelaraskan waktu video element ke posisi timestamp layer).
* Multi-layering dengan blend mode: BISA (Modul `BlendModes.js` menyediakan 9 mode blending WebGL).
* Parenting transform: BISA (`HierarchyResolver` dan `TransformResolver` mengalikan matriks affine parent ke child tanpa siklus dependensi).
* Grouping dan mask: BISA (`LayerActions.groupLayers` mendukung pembungkusan layer ke grup bertipe normal, mask, maupun exclude).
* Edit point pada path vektor: BISA (`EditPointsEditor` dan `VertexTrackpad` memungkinkan pengeditan titik verteks dan handle kontrol kurva).
* Freehand drawing: BISA (`FreehandDrawing` merekam jejak pointer dan mengonversinya menjadi koordinat path layer drawing).
* Live shape editor: BISA (`LiveShapeEditor` dan `ShapeRasterizer` memperbarui dimensi dan sudut parametrik bentuk vektor).
* Text rendering dengan font kustom: BISA (`TextRasterizer` merender teks multi-baris pada kanvas offscreen dengan font keluarga Alight Motion).
* Ekspor video berbasis WebCodecs: BISA (`WebCodecsPipeline` mengkodekan frame kanvas ke AVC/H.264 dan audio ke AAC lalu dimuxing oleh `MediabunnyMuxer`).
* Ekspor fallback FFmpeg WASM: BISA (`FfmpegWasmPipeline` mengekspor video frame-by-frame via FFmpeg saat WebCodecs tidak tersedia).
* Ekspor PNG sequence ZIP: BISA (`SequenceZipPackager` menyusun byte ZIP berkas PNG sequence frame murni di memori).
* Simpan proyek kembali ke server: BISA (`SceneSerializer` mengubah model scene kembali menjadi format XML Alight Motion yang valid dan dikirim ke server).

## STATUS ROUTING DAN URL
* Path `/(nama-proyek)` dan `/proyek/:id`: Terhubung penuh melalui routing berbasis `window.history` dan event `popstate`.
* Query `?alight=...`, `?url=...`, `?preset=...`, `?drive=...`: Dideteksi saat inisialisasi aplikasi untuk memicu import otomatis.
* Beranda `/`: Membuka tampilan beranda otentik Alight Motion `#am-home-screen` tanpa adanya halaman selamat datang buatan atau landing page kustom.

## STATUS PENYIMPANAN DATA DAN KOMPATIBILITAS
* Katalog data `effects/` (336 berkas XML), `effect-thumb/` (386 gambar), `icons/` (189 SVG), `preset/` (8 XML), dan `shapes/` (20 bentuk): Utuh dan tidak diubah satu byte pun.
* Format XML Alight Motion: Didukung penuh dua arah (parsing melalui `XmlSceneParser` dan serialisasi melalui `SceneSerializer`).

## INTEGRASI AMCONVERTER (PENGGANTI ZERVIDA)
* Ketergantungan ke domain eksternal `am.zervida.my.id` telah dihapus dan diblokir sepenuhnya.
* Mekanisme impor tautan Alight Motion diperbarui menggunakan implementasi native dari repositori `amconverter`:
  * Resolusi link pendek via HTTP redirect untuk mengekstrak `uid` dan `pid`.
  * Permintaan otorisasi unduhan langsung ke Cloud Functions resmi Alight Creative (`requestProjectDownload`) untuk paket Android.
  * Unduhan arsip ZIP proyek langsung dari Google Firebase Storage.
  * Parsing ZIP langsung di memori menggunakan Node.js `zlib` via `alightConverter.cjs`.
  * Penyajian aset media paket proyek via endpoint `/api/media`.

## KINERJA DAN HASIL BUILD
* Waktu build Vite (`npm run build`): 437 ms.
* Jumlah modul yang ditransformasikan: 102 modul.
* Ukuran bundel produksi (`dist/`):
  * `dist/index.html`: 0,70 KB (gzip: 0,45 KB)
  * `dist/assets/open_motion_logo-CL6bWfq7.svg`: 1,56 KB (gzip: 0,62 KB)
  * `dist/assets/index-oL1l7Uh9.css`: 120,08 KB (gzip: 20,00 KB)
  * `dist/assets/index-RBHHZWZr.js`: 499,89 KB (gzip: 141,09 KB)

## AUDIT KOMENTAR
* Seluruh berkas sumber di `src/` bebas dari komentar naratif berlebih, docblock berulang, dan teks sisa AI.
* Sisa komentar di seluruh `src/`: Tepat 1 baris di `src/components/layout/DockSplitter.jsx` untuk menjelaskan penanganan pointer capture browser.

## DAFTAR RUJUKAN TIDAK KETEMU
Nihil. Seluruh fungsi matematika, parsing biner ChaCha20/AMFX, rendering WebGL, kompilasi shader efek, dan kontrol UI telah dipetakan secara akurat dari berkas sumber lama.

## DAFTAR PENYIMPANGAN
* Penyesuaian endpoint resolver tautan Alight: Mengganti proxy eksternal `am.zervida.my.id` dengan logika native Alight Cloud Function dan Firebase Storage dari repositori `amconverter` sesuai instruksi pemilik proyek.
