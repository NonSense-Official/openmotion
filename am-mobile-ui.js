// =============================================================================
// Open Motion - Alight Motion Authentic Mobile UI Engine (1:1 APK Replication)
// =============================================================================

(function initAmMobileUi() {
  const I = new Proxy({}, {
    get(_, prop) {
      return (window.__AM_INTERNAL && window.__AM_INTERNAL[prop]) || (window.AM && window.AM[prop]);
    },
    set(_, prop, val) {
      if (window.__AM_INTERNAL) window.__AM_INTERNAL[prop] = val;
      return true;
    }
  });

  const _origGetElementById = document.getElementById.bind(document);
  document.getElementById = function(id) {
    if (id === "buttonEditCamera") return _origGetElementById("am-btn-camera");
    if (id === "addCameraObject") return _origGetElementById("addCameraObject") || _origGetElementById("am-add-camera-btn");
    return _origGetElementById(id);
  };

  let currentSelectedLayer = null;
  let isAddPopupOpen = false;

  function updateParentButtonState(layer) {
    const btnParent = document.getElementById("am-btn-elem-parent");
    if (!btnParent) return;
    const hasParent = !!(layer && layer.parentId);
    if (hasParent) {
      btnParent.classList.add("has-parent");
      const parentName = (layer.parentLayer && (layer.parentLayer.label || layer.parentLayer.id)) || layer.parentId;
      btnParent.setAttribute("title", "Parent: " + parentName);
    } else {
      btnParent.classList.remove("has-parent");
      btnParent.setAttribute("title", "Parenting Layer");
    }
  }

  function onReady(fn) {
    if (document.readyState !== "loading") fn();
    else document.addEventListener("DOMContentLoaded", fn);
  }

  onReady(() => {
    setupDom();
    setupHomeScreen();
    bindEvents();
    initTextEditorEvents();
    checkInitialRoute();
  });

  function setupDom() {
    const isProyek = /\/proyek\/([A-Za-z0-9_-]{8,64})/.test(location.pathname);
    let root = document.getElementById("am-mobile-root");
    if (!root) {
      root = document.createElement("div");
      root.id = "am-mobile-root";
      root.style.display = isProyek ? "flex" : "none";
      document.body.appendChild(root);
    } else {
      root.style.display = isProyek ? "flex" : "none";
    }

    root.innerHTML = `
      <!-- ── Top Header ── -->
      <header id="am-top-container">
        <!-- Default State: activity_edit_navbar.xml -->
        <div id="am-navbar-default">
          <button id="am-btn-exit" class="am-icon-btn" title="Keluar ke Proyek">
            <img src="./icons/ic_exitproject.svg" alt="Exit">
          </button>
          <button id="am-btn-group-up" class="am-icon-btn" style="display:none" title="Keluar dari Grup">
            <img src="./icons/ac_ic_back.svg" alt="Back">
          </button>
          <input type="text" id="am-project-title" class="am-project-title-input" value="Proyek Baru" placeholder="Nama Proyek">
          <div id="am-nav-timecode" class="am-nav-time-chip" title="Ketuk untuk tambah/hapus penanda (bookmark)">
            <span id="am-nav-time">00:00.00</span>
            <span id="am-nav-fps">30 FPS</span>
          </div>
          <button id="am-btn-settings" class="am-icon-btn" title="Setelan Proyek">
            <img src="./icons/ac_ic_settings.svg" alt="Settings">
          </button>
          <button id="am-btn-share" class="am-icon-btn" title="Ekspor Video">
            <img src="./icons/ac_ic_share.svg" alt="Share">
          </button>
        </div>

        <!-- Selected Element State: fragment_element_actionbar.xml -->
        <div id="am-navbar-element">
          <button id="am-btn-elem-back" class="am-icon-btn" title="Kembali">
            <img src="./icons/ac_ic_back.svg" alt="Back">
          </button>
          <input type="text" id="am-elem-title" class="am-project-title-input" value="Layer" placeholder="Nama Layer">
          <button id="am-btn-elem-parent" class="am-icon-btn" title="Parenting Layer">
            <img src="./icons/ic_layer_parent.svg" alt="Parent">
          </button>
          <button id="am-btn-elem-delete" class="am-icon-btn" title="Hapus Layer">
            <img src="./icons/ac_ic_delete.svg" alt="Delete">
          </button>
          <button id="am-btn-elem-overflow" class="am-icon-btn" title="Opsi Layer">
            <img src="./icons/ic_more_vert_white_24dp.svg" alt="More">
          </button>
        </div>

        <!-- Subpanel Setting Action Bar: fragment_setting_actionbar.xml -->
        <div id="am-navbar-setting" style="display:none;">
          <button id="am-btn-setting-back" class="am-icon-btn" title="Kembali">
            <img src="./icons/ac_ic_back.svg" alt="Back">
          </button>
          <span id="am-setting-title" class="am-actionbar-title">Pengaturan</span>
          <button id="am-btn-setting-overflow" class="am-icon-btn" title="Opsi" style="display:none;">
            <img src="./icons/ic_more_vert_white_24dp.svg" alt="More">
          </button>
        </div>

        <!-- Multi-Select State: activity_edit_selectbar.xml -->
        <div id="am-navbar-select">
          <!-- cancelSelectMode -->
          <button id="am-btn-sel-cancel" class="am-icon-btn am-sel-cancel-btn" title="Batal Multi-Pilih">
            <img src="./icons/ac_ic_cancel.svg" alt="Cancel">
          </button>

          <!-- normalMultiHolder -->
          <div id="am-sel-normal-holder">
            <span id="am-select-count">1 layer terpilih</span>
            <!-- buttonGroupSelected -->
            <button id="am-btn-sel-group" class="am-icon-btn" title="Gabungkan ke Grup">
              <img src="./icons/ac_ic_groupelements.svg" alt="Group">
            </button>
            <!-- buttonGroupAndMask -->
            <button id="am-btn-sel-mask" class="am-icon-btn" title="Grup + Masking">
              <img src="./icons/ic_masking_group_bl.svg" alt="Mask">
            </button>
            <!-- buttonGroupAndExclude -->
            <button id="am-btn-sel-exclude" class="am-icon-btn" title="Grup + Exclude">
              <img src="./icons/ic_exclude_group_bl.svg" alt="Exclude">
            </button>
            <!-- buttonDeleteSelected -->
            <button id="am-btn-sel-del" class="am-icon-btn" title="Hapus Terpilih">
              <img src="./icons/ac_ic_delete.svg" alt="Delete">
            </button>
            <!-- buttonRightCue: toggle ke screenAlignHolder -->
            <button id="am-btn-sel-align-toggle" class="am-icon-btn" title="Alignment Layar">
              <img src="./icons/ic_multiselect_cue.svg" alt="Align">
            </button>
          </div>

          <!-- screenAlignHolder (awalnya hidden, toggle via buttonRightCue) -->
          <div id="am-sel-screen-align-holder" style="display:none;">
            <!-- buttonLeftCue: kembali ke normalMultiHolder -->
            <button id="am-btn-sel-align-back" class="am-icon-btn am-sel-align-back" title="Kembali">
              <img src="./icons/ic_multiselect_cue.svg" alt="Back" style="transform:rotate(180deg);">
            </button>
            <button id="am-btn-align-left-screen" class="am-icon-btn" title="Rata Kiri Layar" data-align="left-screen">
              <img src="./icons/ic_align_left_screen_bl.svg" alt="Align Left">
            </button>
            <button id="am-btn-align-center-h-screen" class="am-icon-btn" title="Tengah Horizontal Layar" data-align="center-h-screen">
              <img src="./icons/ic_align_centerhorizontally_screen_bl.svg" alt="Center H">
            </button>
            <button id="am-btn-align-right-screen" class="am-icon-btn" title="Rata Kanan Layar" data-align="right-screen">
              <img src="./icons/ic_align_right_screen_bl.svg" alt="Align Right">
            </button>
            <button id="am-btn-align-top-screen" class="am-icon-btn" title="Rata Atas Layar" data-align="top-screen">
              <img src="./icons/ic_align_top_screen_bl.svg" alt="Align Top">
            </button>
            <button id="am-btn-align-center-v-screen" class="am-icon-btn" title="Tengah Vertikal Layar" data-align="center-v-screen">
              <img src="./icons/ic_align_centervertically_screen_bl.svg" alt="Center V">
            </button>
            <button id="am-btn-align-bottom-screen" class="am-icon-btn" title="Rata Bawah Layar" data-align="bottom-screen">
              <img src="./icons/ic_align_bottom_screen_bl.svg" alt="Align Bottom">
            </button>
            <button id="am-btn-align-distrib-v-screen" class="am-icon-btn" title="Distribusi Vertikal" data-align="distribute-v-screen">
              <img src="./icons/ic_align_distribute_vertically_screen_bl.svg" alt="Distribute V">
            </button>
            <button id="am-btn-align-distrib-h-screen" class="am-icon-btn" title="Distribusi Horizontal" data-align="distribute-h-screen">
              <img src="./icons/ic_align_distribute_horizontally_screen_bl.svg" alt="Distribute H">
            </button>
          </div>
        </div>

        <!-- Live Shape Action Bar: fragment_liveshape_actionbar.xml -->
        <div id="am-navbar-liveshape">
          <button id="am-btn-liveshape-back" class="am-icon-btn" title="Kembali">
            <img src="./icons/ac_ic_back.svg" alt="Back">
          </button>
          <span id="am-liveshape-title" class="am-actionbar-title">Edit Bentuk</span>
          <button id="am-btn-liveshape-aspect" class="am-icon-btn active" title="Kunci Rasio Aspek">
            <img id="am-img-liveshape-aspect" src="./icons/ic_shape_aspect_lock.svg" alt="Aspect Ratio">
          </button>
          <button id="am-btn-liveshape-center" class="am-icon-btn active" title="Ubah Ukuran dari Tengah">
            <img id="am-img-liveshape-center" src="./icons/ic_shape_size_from_center.svg" alt="From Center">
          </button>
        </div>

        <!-- Edit Points Action Bar: fragment_edit_points_actionbar.xml -->
        <div id="am-navbar-editpoints">
          <button id="am-btn-editpoints-back" class="am-icon-btn" title="Kembali / Selesai">
            <img src="./icons/ac_ic_back.svg" alt="Back">
          </button>
          <span id="am-editpoints-title" class="am-actionbar-title">Edit Poin</span>
          <button id="am-btn-editpoints-prev" class="am-icon-btn" title="Kontur Sebelumnya" style="display:none;">
            <img src="./icons/ic_prev_element.svg" alt="Prev">
          </button>
          <button id="am-btn-editpoints-next" class="am-icon-btn" title="Kontur Berikutnya" style="display:none;">
            <img src="./icons/ic_next_element.svg" alt="Next">
          </button>
          <div class="am-actionbar-segmented">
            <button id="am-btn-mode-keyframes" class="am-seg-btn" title="Animasi Titik">
              <img src="./icons/ic_keyframe_add_hollow.svg" alt="Keyframe Mode">
            </button>
            <button id="am-btn-mode-points" class="am-seg-btn active" title="Edit Titik">
              <img src="./icons/ic_point_add.svg" alt="Point Mode">
            </button>
          </div>
        </div>

        <!-- Drawing Action Bar: fragment_drawing_actionbar.xml -->
        <div id="am-navbar-drawing">
          <button id="am-btn-drawing-back" class="am-icon-btn" title="Kembali / Selesai">
            <img src="./icons/ac_ic_back.svg" alt="Back">
          </button>
          <span id="am-drawing-title" class="am-actionbar-title">Gambar Bebas</span>
          <div class="am-drawing-actionbar-tools">
            <button id="am-btn-draw-undo" class="am-icon-btn" title="Urungkan">
              <img src="./icons/ic_edit_undo.svg" alt="Undo">
            </button>
            <button id="am-btn-draw-redo" class="am-icon-btn" title="Ulangi">
              <img src="./icons/ic_edit_redo.svg" alt="Redo">
            </button>
            <button id="am-btn-draw-done" class="am-icon-btn active" title="Selesai">
              <img src="./icons/ic_selected_layer_checkmark.svg" alt="Done">
            </button>
          </div>
        </div>

        <!-- Text Edit Action Bar: edit_text_actionbar.xml -->
        <div id="am-navbar-textedit">
          <button id="am-btn-text-align" class="am-textstyle-btn am-textstyle-btn-icon" title="Perataan Teks">
            <img id="am-img-text-align" src="./icons/ac_ic_textalign_center.svg" alt="Align">
          </button>
          <button id="am-btn-text-font" class="am-textstyle-btn am-textstyle-btn-spinner" title="Pilihan Fon">
            <span id="am-text-font-label">Roboto</span>
            <img src="./icons/ac_dropdown_indicator_solid.svg" class="am-text-dropdown-arrow" alt="▼">
          </button>
          <button id="am-btn-text-size" class="am-textstyle-btn am-textstyle-btn-spinner am-textstyle-btn-size" title="Ukuran Fon">
            <span id="am-text-size-label">28 pt</span>
            <img src="./icons/ac_dropdown_indicator_solid.svg" class="am-text-dropdown-arrow" alt="▼">
          </button>
          <button id="am-btn-text-spacing" class="am-textstyle-btn am-textstyle-btn-icon" title="Spasi Huruf & Baris">
            <img src="./icons/ac_ic_text_spacing.svg" alt="Spacing">
          </button>
          <button id="am-btn-text-color" class="am-textstyle-btn am-textstyle-btn-color" title="Warna Teks">
            <span id="am-text-color-swatch" class="am-text-color-swatch-circle"></span>
          </button>
          <button id="am-btn-text-ok" class="am-icon-btn am-text-ok-btn" title="Selesai">
            <img src="./icons/ac_ic_ok_accept_checkmark.svg" alt="OK">
          </button>
        </div>
      </header>

      <!-- ── Preview Stage ── -->
      <main id="am-preview-stage">
        <div id="am-canvas-wrapper">
          <!-- Canvases will be reparented here -->
        </div>

        <div id="am-canvas-camera-pill" class="am-canvas-camera-pill" style="display:none;" title="Tampilan Kamera Aktif (Klik untuk ubah)">
          <img src="./icons/ic_camera_outline.svg" alt="Camera">
          <span>Kamera</span>
        </div>

        <!-- ViewMode Right Sidebar (viewmodeHolder: activity_edit.xml) -->
        <aside id="am-viewmode-bar" style="display:none;">
          <button id="am-btn-vm-pixel" class="am-viewmode-btn" title="Pratinjau Piksel">
            <img src="./icons/viewmode_pixel_selector.svg" alt="Pixel">
          </button>
          <button id="am-btn-vm-grid" class="am-viewmode-btn" title="Kisi / Grid">
            <img src="./icons/ic_preview_mode_grid_off.svg" alt="Grid">
          </button>
          <button id="am-btn-vm-camera" class="am-viewmode-btn" title="Tampilan Kamera Aktif">
            <img src="./icons/ic_preview_mode_camera_off.svg" alt="Camera View">
          </button>
          <div id="am-canvas-zoom-holder">
            <button id="am-btn-vm-zoom-in" class="am-vm-zoom-btn" title="Perbesar Kanvas">
              <img src="./icons/ic_viewmode_zoom_in.svg" alt="+">
            </button>
            <span id="am-vm-zoom-text">100%</span>
            <button id="am-btn-vm-zoom-out" class="am-vm-zoom-btn" title="Perkecil Kanvas">
              <img src="./icons/ic_viewmode_zoom_out.svg" alt="-">
            </button>
          </div>
        </aside>
      </main>

      <!-- ── Play Bar (activity_edit_playbar.xml) ── -->
      <nav id="am-playbar">
        <button id="am-btn-undo" class="am-playbar-btn" title="Urungkan">
          <img src="./icons/ic_edit_undo.svg" alt="Undo">
        </button>
        <button id="am-btn-redo" class="am-playbar-btn" title="Ulangi">
          <img src="./icons/ic_edit_redo.svg" alt="Redo">
        </button>
        <button id="am-btn-prevframe" class="am-playbar-btn" title="Lompat Keyframe / Bookmark Sebelumnya">
          <img src="./icons/ic_edit_prevframe.svg" alt="Prev Frame">
        </button>
        <button id="am-btn-play" class="am-playbar-btn" title="Putar">
          <img id="am-play-icon" src="./icons/ac_ic_play.svg" alt="Play">
        </button>
        <button id="am-btn-nextframe" class="am-playbar-btn" title="Lompat Keyframe / Bookmark Berikutnya">
          <img src="./icons/ic_edit_nextframe.svg" alt="Next Frame">
        </button>
        <button id="am-btn-copypaste" class="am-playbar-btn" title="Salin / Tempel Layer">
          <img src="./icons/ic_layer_copy_paste_menu.svg" alt="Copy Paste">
        </button>
        <button id="am-btn-bookmark" class="am-playbar-btn" title="Tandai Waktu (Bookmark)">
          <img src="./icons/ic_bookmark_add.svg" alt="Bookmark">
        </button>
        <button id="am-btn-previewmode" class="am-playbar-btn" title="Panel Tampilan Pratinjau (ViewMode)">
          <img id="am-previewmode-icon" src="./icons/ic_viewmode_panel_open.svg" alt="ViewMode">
        </button>

        <!-- Audio VU Level Meter (LevelMeterView: activity_edit_playbar.xml) -->
        <canvas id="am-level-meter-view" class="am-level-meter-canvas" width="600" height="4"></canvas>

        <!-- Scrubbing Time Info Overlay (activity_edit_infobar.xml) -->
        <div id="am-infobar-overlay">
          <div class="am-info-pill" id="am-infobar-time-pill" title="Ketuk waktu untuk tambah/hapus penanda (bookmark)">
            <img src="./icons/ic_keyframe_pos.svg" alt="Time">
            <span id="am-info-time">00:00.00</span>
          </div>
          <div class="am-info-pill">
            <img src="./icons/ic_offset_amount.svg" alt="Offset">
            <span id="am-info-offset">+0.00s</span>
          </div>
        </div>
      </nav>

      <!-- ── Bottom Work Area ── -->
      <section id="am-bottom-container">
        <!-- 1. Normal State: Mobile Timeline -->
        <div id="am-timeline-view">
          <!-- Timeline will be moved here -->
          <div id="am-timeline-mount" style="flex:1;min-height:0;position:relative;"></div>

          <!-- Bottom Left Overflow Menu -->
          <button id="am-timeline-overflow-btn" title="Menu Timeline">
            <img src="./icons/ic_more_vert_white_24dp.svg" alt="Menu">
          </button>

          <!-- Floating '+' Add Layer Button -->
          <button id="am-fab-add" title="Tambah Layer">
            <img src="./icons/add_layer_button.webp" alt="Add Layer">
          </button>

          <!-- Multi-Select Bottom Bar: activity_edit_select_bottomvar.xml -->
          <div id="am-select-bottom-bar" class="am-select-bottom-bar" style="display:none;">
            <div class="am-sel-bottom-left">
              <button id="am-btn-multi-trim-left" class="am-sel-bottom-btn" title="Potong Kiri (Multi)">
                <img src="./icons/ac_ic_trimleft.svg" alt="Trim Left">
              </button>
              <button id="am-btn-multi-split" class="am-sel-bottom-btn" title="Bagi di Playhead (Multi)">
                <img src="./icons/ac_ic_split.svg" alt="Split">
              </button>
              <button id="am-btn-multi-trim-right" class="am-sel-bottom-btn" title="Potong Kanan (Multi)">
                <img src="./icons/ac_ic_trimright.svg" alt="Trim Right">
              </button>
            </div>
            <div class="am-sel-bottom-right">
              <button id="am-btn-align-left-tl" class="am-sel-bottom-btn" title="Rata Kiri Timeline">
                <img src="./icons/ic_align_left_timeline.svg" alt="Align Left Timeline">
              </button>
              <button id="am-btn-align-distrib-tl" class="am-sel-bottom-btn" title="Distribusi Timeline">
                <img src="./icons/ic_align_distribute_timeline.svg" alt="Distribute Timeline">
              </button>
              <button id="am-btn-align-right-tl" class="am-sel-bottom-btn" title="Rata Kanan Timeline">
                <img src="./icons/ic_align_right_timeline.svg" alt="Align Right Timeline">
              </button>
            </div>
          </div>
        </div>

        <!-- 2. Selected State: fragment_element_edit.xml -->
        <div id="am-element-edit-panel">
          <!-- Row 1: Speed, Trim Left, Split, Trim Right, Audio -->
          <div class="am-panel-row1">
            <div id="am-btn-speed" class="am-pbtn-standalone" title="Kecepatan">
              <img src="./icons/ac_ic_speed.svg" alt="Speed">
            </div>
            <div class="am-pbtn-group">
              <button id="am-btn-trim-left" class="am-pbtn-sub" title="Potong Kiri">
                <img src="./icons/ac_ic_trimleft.svg" alt="Trim Left">
              </button>
              <button id="am-btn-split" class="am-pbtn-sub" title="Bagi di Playhead">
                <img src="./icons/ac_ic_split.svg" alt="Split">
              </button>
              <button id="am-btn-trim-right" class="am-pbtn-sub" title="Potong Kanan">
                <img src="./icons/ac_ic_trimright.svg" alt="Trim Right">
              </button>
            </div>
            <div id="am-btn-audio" class="am-pbtn-standalone" title="Audio">
              <img src="./icons/ac_ic_audio.svg" alt="Audio">
            </div>
          </div>

          <!-- Rows 2 & 3: Iconic Alight Motion Grid Buttons -->
          <div class="am-panel-grid">
            <button id="am-btn-colorfill" class="am-grid-btn">
              <img src="./icons/ac_ic_colorfill.svg" alt="Color & Fill">
              <span>Warna & Isi</span>
            </button>
            <button id="am-btn-bordershadow" class="am-grid-btn">
              <img src="./icons/ac_ic_bordersh.svg" alt="Border & Shadow">
              <span>Batas & Bayangan</span>
            </button>
            <button id="am-btn-blendopacity" class="am-grid-btn">
              <img src="./icons/ac_ic_blendop.svg" alt="Blending & Opacity">
              <span>Blending & Opasitas</span>
            </button>

            <button id="am-btn-movetransform" class="am-grid-btn">
              <img src="./icons/ac_ic_movetransform.svg" alt="Move & Transform">
              <span>Move & Transform</span>
            </button>
            <button id="am-btn-editcontext" class="am-grid-btn">
              <img id="am-context-icon" src="./icons/ac_add_shape.svg" alt="Edit">
              <span id="am-context-text">Edit Objek</span>
            </button>
            <button id="am-btn-camera" class="am-grid-btn" data-id="buttonEditCamera" style="display:none;" title="Opsi Kamera">
              <img src="./icons/ic_camera_options.svg" alt="Opsi Kamera">
              <span>Opsi Kamera</span>
            </button>
            <button id="am-btn-effects" class="am-grid-btn">
              <img src="./icons/ac_ic_effects.svg" alt="Effects">
              <span>Efek</span>
            </button>
          </div>
        </div>

        <div id="am-subpanel-container">
          <div id="am-subpanel-content" class="am-subpanel-body"></div>
        </div>

        <!-- Live Shape Panel: fragment_settings_base.xml + fragment_live_shape.xml -->
        <div id="am-liveshape-panel" class="am-ls-root">
          <div class="am-ls-sidebar-left">
            <button type="button" id="am-btn-liveshape-panel-back" class="am-ls-rail-btn" title="Kembali">
              <img src="./icons/ac_ic_back.svg" alt="Back">
            </button>
            <button type="button" id="am-btn-liveshape-kf" class="am-ls-rail-btn" title="Tambah / Hapus Keyframe">
              <img id="am-img-liveshape-kf" src="./icons/ac_ic_add_keyframe.svg" alt="Keyframe">
            </button>
            <button type="button" id="am-btn-liveshape-curve" class="am-ls-rail-btn" title="Kurva Animasi">
              <img src="./icons/ac_ic_anim_curve.svg" alt="Curve">
            </button>
            <button type="button" id="am-btn-liveshape-overflow" class="am-ls-rail-btn" title="Opsi">
              <img src="./icons/ac_ic_overflow_horiz.svg" alt="More">
            </button>
          </div>
          <div class="am-ls-center">
            <div id="am-liveshape-list" class="am-liveshape-settings-list"></div>
          </div>
        </div>

        <!-- Edit Points Panel: fragment_edit_points2.xml -->
        <div id="am-editpoints-panel">
          <!-- Toolbar Kiri -->
          <div class="am-ep-toolbar-left">
            <button id="am-ep-btn-back" class="am-ep-tool-btn" title="Kembali / Selesai">
              <img src="./icons/ac_ic_back.svg" alt="Back">
            </button>
            <button id="am-ep-btn-openclose" class="am-ep-tool-btn" title="Buka/Tutup Garis Kontur">
              <img id="am-ep-img-openclose" src="./icons/ac_ic_path_close.svg" alt="Open/Close">
            </button>
            <button id="am-ep-btn-curvetype" class="am-ep-tool-btn" title="Tipe Kelengkungan Titik">
              <img id="am-ep-img-curvetype" src="./icons/ac_ic_vertex_curved.svg" alt="Curve Type">
            </button>
            <button id="am-ep-btn-adddelpoint" class="am-ep-tool-btn" title="Hapus / Tambah Titik">
              <img id="am-ep-img-adddelpoint" src="./icons/ac_ic_delete_point_filled.svg" alt="Add/Del Point">
            </button>
            <button id="am-ep-btn-kf-toggle" class="am-ep-tool-btn" title="Tambah/Hapus Keyframe" style="display:none;">
              <img id="am-ep-img-kf" src="./icons/ac_ic_add_keyframe.svg" alt="Keyframe">
            </button>
            <button id="am-ep-btn-kf-curve" class="am-ep-tool-btn" title="Kurva Easing Animasi" style="display:none;">
              <img src="./icons/ac_ic_anim_curve.svg" alt="Easing">
            </button>
          </div>

          <!-- Center Trackpad -->
          <div class="am-ep-trackpad-col">
            <div id="am-ep-trackpad" class="am-ep-trackpad">
              <div class="am-trackpad-guide am-corner-nw"></div>
              <div class="am-trackpad-guide am-corner-ne"></div>
              <div class="am-trackpad-guide am-corner-sw"></div>
              <div class="am-trackpad-guide am-corner-se"></div>
              <div id="am-ep-trackpad-hint" class="am-ep-trackpad-hint">Geser di sini untuk memindahkan titik</div>
            </div>
            <!-- Bottom Contour Navigator -->
            <div class="am-ep-contour-nav">
              <button id="am-ep-btn-prev-contour" class="am-ep-contour-btn" title="Titik Sebelumnya">
                <img src="./icons/ic_prev_element.svg" alt="Prev">
              </button>
              <span id="am-ep-contour-info" class="am-ep-contour-info">Titik 1 / 4</span>
              <button id="am-ep-btn-next-contour" class="am-ep-contour-btn" title="Titik Berikutnya">
                <img src="./icons/ic_next_element.svg" alt="Next">
              </button>
            </div>
          </div>

          <!-- Scroller Kanan (OutlineScrollerView) -->
          <div class="am-ep-scroller-col">
            <div id="am-ep-outline-scroller" class="am-ep-scroller"></div>
          </div>
        </div>

        <!-- Drawing Panel: fragment_drawing.xml -->
        <div id="am-drawing-panel">
          <div class="am-drawing-body">
            <div class="am-drawing-controls">
              <div class="am-draw-row">
                <img src="./icons/ic_handdrawing_size.svg" class="am-draw-icon" alt="Size">
                <input type="range" id="am-draw-size-slider" min="0" max="41" value="11" class="am-draw-slider">
                <span id="am-draw-size-badge" class="am-draw-badge">12 px</span>
              </div>
              <div class="am-draw-row">
                <span class="am-draw-label">Kehalusan</span>
                <input type="range" id="am-draw-smooth-slider" min="0" max="100" value="35" class="am-draw-slider">
                <span id="am-draw-smooth-badge" class="am-draw-badge">35%</span>
              </div>
              <div class="am-draw-row am-draw-color-row">
                <div class="am-draw-swatches" id="am-draw-swatches"></div>
                <label class="am-draw-picker-label" title="Pilih Warna Kustom">
                  <input type="color" id="am-draw-color-picker" value="#00ffa8">
                  <div class="am-draw-picker-btn"></div>
                </label>
              </div>
            </div>
            <div class="am-drawing-divider"></div>
            <div class="am-drawing-tools-col">
              <button id="am-draw-tool-pen" class="am-draw-tool-btn active" title="Pena">
                <img src="./icons/ic_pen.svg" alt="Pen">
              </button>
              <button id="am-draw-tool-brush" class="am-draw-tool-btn" title="Kuas">
                <img src="./icons/ic_brush.svg" alt="Brush">
              </button>
              <button id="am-draw-tool-fill" class="am-draw-tool-btn" title="Isi">
                <img src="./icons/ic_fill.svg" alt="Fill">
              </button>
              <button id="am-draw-tool-eraser" class="am-draw-tool-btn" title="Penghapus">
                <img src="./icons/ic_eraser.svg" alt="Eraser">
              </button>
            </div>
          </div>
        </div>

        <!-- Animation Curve Panel: fragment_animation_curve.xml -->
        <div id="am-animcurve-panel">
          <div class="am-curve-rail-left">
            <button type="button" id="am-curve-btn-back" class="am-curve-rail-btn" title="Kembali">
              <img src="./icons/ac_ic_back.svg" alt="Back">
            </button>
            <button type="button" id="am-curve-btn-kf" class="am-curve-rail-btn" title="Tambah / Hapus Keyframe">
              <img id="am-curve-img-kf" src="./icons/ac_ic_add_keyframe.svg" alt="Keyframe">
            </button>
            <button type="button" id="am-curve-btn-reverse" class="am-curve-rail-btn" title="Balik Kurva">
              <img src="./icons/ic_reverse.svg" alt="Reverse">
            </button>
            <div class="am-curve-overflow-wrap">
              <button type="button" id="am-curve-btn-overflow" class="am-curve-rail-btn" title="Opsi Kurva">
                <img src="./icons/ac_ic_overflow_horiz.svg" alt="More">
              </button>
              <div id="am-curve-overflow-menu" class="am-curve-overflow-menu" style="display:none;">
                <button type="button" class="am-curve-menu-item" id="am-curve-menu-copy">Salin Kurva</button>
                <button type="button" class="am-curve-menu-item" id="am-curve-menu-paste">Tempel Kurva</button>
                <button type="button" class="am-curve-menu-item" id="am-curve-menu-paste-all">Tempel Kurva ke Semua Keyframe</button>
              </div>
            </div>
          </div>

          <div class="am-curve-center-area">
            <div class="am-curve-canvas-wrap">
              <canvas id="am-curve-canvas"></canvas>
              <div id="am-curve-warning" class="am-curve-warning" style="display:none;">
                <div class="am-curve-warning-text">Sebelum menyesuaikan kurva animasi, buat minimal dua keyframe terlebih dahulu.</div>
                <button type="button" id="am-curve-btn-add-kf-prompt" class="am-curve-prompt-btn">+ Tambah Keyframe</button>
              </div>
            </div>
            <div class="am-curve-nav-bar">
              <button type="button" id="am-curve-btn-prev" class="am-curve-nav-btn" title="Keyframe Sebelumnya">
                <img src="./icons/ic_prev_element.svg" alt="Prev">
              </button>
              <span id="am-curve-label" class="am-curve-label">LINEAR</span>
              <button type="button" id="am-curve-btn-next" class="am-curve-nav-btn" title="Keyframe Berikutnya">
                <img src="./icons/ic_next_element.svg" alt="Next">
              </button>
            </div>
          </div>

          <div class="am-curve-rail-options">
            <button type="button" class="am-curve-preset-btn active" data-idx="0" id="am-curve-preset-0" title="Linear">
              <img src="./icons/ic_easing_linear.svg" alt="Curve 0">
            </button>
            <button type="button" class="am-curve-preset-btn" data-idx="1" id="am-curve-preset-1" title="Ease In">
              <img src="./icons/ic_easing_bezier_easein.svg" alt="Curve 1">
            </button>
            <button type="button" class="am-curve-preset-btn" data-idx="2" id="am-curve-preset-2" title="Ease Out">
              <img src="./icons/ic_easing_bezier_easeout.svg" alt="Curve 2">
            </button>
            <button type="button" class="am-curve-preset-btn" data-idx="3" id="am-curve-preset-3" title="Ease In & Out">
              <img src="./icons/ic_easing_bezier_easeinout.svg" alt="Curve 3">
            </button>
          </div>

          <div class="am-curve-rail-categories">
            <div class="am-curve-tab-holder">
              <button type="button" class="am-curve-cat-btn active" data-cat="bezier" id="am-curve-cat-bezier" title="Bezier">
                <img src="./icons/ic_easing_bezier_easeinout.svg" alt="Bezier">
              </button>
              <div class="am-curve-cat-cue active"></div>
            </div>
            <div class="am-curve-tab-holder">
              <button type="button" class="am-curve-cat-btn" data-cat="bounce" id="am-curve-cat-bounce" title="Bounce">
                <img src="./icons/ic_easing_bouncein.svg" alt="Bounce">
              </button>
              <div class="am-curve-cat-cue"></div>
            </div>
            <div class="am-curve-tab-holder">
              <button type="button" class="am-curve-cat-btn" data-cat="steps" id="am-curve-cat-steps" title="Steps">
                <img src="./icons/ic_easing_stairstep.svg" alt="Steps">
              </button>
              <div class="am-curve-cat-cue"></div>
            </div>
            <div class="am-curve-tab-holder">
              <button type="button" class="am-curve-cat-btn" data-cat="custom" id="am-curve-cat-custom" title="Custom / Oscillate">
                <img src="./icons/ic_easing_oscillate.svg" alt="Custom">
              </button>
              <div class="am-curve-cat-cue"></div>
            </div>
          </div>
        </div>

        <!-- 3. Add Layer Popup: activity_edit_addpopup.xml -->
        <div id="am-add-popup">
          <div class="am-add-main">
            <div class="am-add-body">
              <!-- Top Horizontal Tabs -->
              <nav class="am-add-tabs">
                <button class="am-add-tab-item active" data-tab="shape">
                  <img src="./icons/ic_add_object.svg" alt="Shape">
                  <span>Bentuk</span>
                </button>
                <button class="am-add-tab-item" data-tab="media">
                  <img src="./icons/ic_add_imagevideo.svg" alt="Media">
                  <span>Media</span>
                </button>
                <button class="am-add-tab-item" data-tab="audio">
                  <img src="./icons/ic_add_audio.svg" alt="Audio">
                  <span>Audio</span>
                </button>
                <button class="am-add-tab-item" data-tab="object">
                  <img src="./icons/ic_add_object_element.svg" alt="Object">
                  <span>Objek</span>
                </button>
                <button class="am-add-tab-item" data-tab="templates">
                  <img src="./icons/ic_add_templates.svg" alt="Templates">
                  <span>Template</span>
                </button>
              </nav>

              <!-- Tab Contents -->
              <div id="am-add-content-area" class="am-add-content">
                <!-- Shape cards injected dynamically -->
              </div>
            </div>

            <!-- Right Quick Add Bar -->
            <aside class="am-add-quickbar">
              <button id="am-btn-quick-draw" class="am-quick-item" title="Gambar Bebas">
                <img src="./icons/ic_add_freehanddrawing.svg" alt="Drawing">
                <span>Gambar</span>
              </button>
              <button id="am-btn-quick-vector" class="am-quick-item" title="Gambar Vektor">
                <img src="./icons/ic_add_vectordrawing.svg" alt="Vector">
                <span>Vektor</span>
              </button>
              <button id="am-btn-quick-text" class="am-quick-item" title="Teks">
                <img src="./icons/ic_add_text.svg" alt="Text">
                <span>Teks</span>
              </button>
              <button id="am-btn-close-add" class="am-quick-close" title="Tutup">
                <img src="./icons/ic_button_close_add.svg" alt="Close">
              </button>
            </aside>
          </div>
        </div>

        <!-- Text Edit Popups Container (sizePopup, fontPopup, spacingPopup, colorPopup) -->
        <div id="am-text-popups-container">
          <div id="am-text-popup-backdrop" class="am-text-popup-backdrop" style="display:none"></div>

          <!-- Font Popup -->
          <div id="am-text-font-popup" class="am-text-popup">
            <div class="am-text-popup-connector" style="left:88px"></div>
            <div class="am-text-minifont-list" id="am-text-minifont-list"></div>
            <button type="button" id="am-btn-view-all-fonts" class="am-font-view-all-btn">
              <img src="./icons/ac_media_addpopup_view_all.svg" alt="All">
              <span>Lihat Semua Fon</span>
            </button>
          </div>

          <!-- Size Popup -->
          <div id="am-text-size-popup" class="am-text-popup">
            <div class="am-text-popup-connector" style="left:210px"></div>
            <div class="am-text-size-content">
              <div class="am-text-size-stepper">
                <button type="button" id="am-btn-size-minus" class="am-text-step-btn">−</button>
                <span id="am-text-size-stepper-val" class="am-text-size-val-display">28 pt</span>
                <button type="button" id="am-btn-size-plus" class="am-text-step-btn">+</button>
              </div>
              <input type="range" id="am-text-size-slider" class="am-text-range-slider" min="6" max="200" step="1" value="28">
            </div>
          </div>

          <!-- Spacing Popup -->
          <div id="am-text-spacing-popup" class="am-text-popup">
            <div class="am-text-popup-connector" style="left:265px"></div>
            <div class="am-text-spacing-content">
              <div class="am-text-spacing-row">
                <div class="am-text-spacing-header">
                  <span>Spasi Huruf (Tracking)</span>
                  <b id="am-letter-spacing-val">0.00 em</b>
                </div>
                <input type="range" id="am-letter-spacing-slider" class="am-text-range-slider" min="-0.5" max="1.0" step="0.01" value="0">
              </div>
              <div class="am-text-spacing-row">
                <div class="am-text-spacing-header">
                  <span>Spasi Baris (Leading)</span>
                  <b id="am-line-spacing-val">1.00×</b>
                </div>
                <input type="range" id="am-line-spacing-slider" class="am-text-range-slider" min="0.5" max="3.0" step="0.05" value="1">
              </div>
              <button type="button" id="am-btn-spacing-reset" class="am-text-spacing-reset-btn">Reset Spasi</button>
            </div>
          </div>

          <!-- Color Popup -->
          <div id="am-text-color-popup" class="am-text-popup">
            <div class="am-text-popup-connector" style="left:308px"></div>
            <div class="am-text-color-content">
              <div class="am-text-swatches-grid" id="am-text-swatches-grid"></div>
              <div class="am-text-custom-color-row">
                <button type="button" id="am-btn-text-eyedropper" class="am-text-eyedropper-btn" title="Ambil warna dari layar">
                  <span>Pipet</span>
                </button>
                <input type="color" id="am-text-native-picker" class="am-text-native-color-picker" value="#ffffff">
                <input type="text" id="am-text-hex-input" class="am-text-hex-input" value="#FFFFFF" maxlength="9">
              </div>
            </div>
          </div>
        </div>

        <!-- Bottom Live Text Input Bar (fragment_text_edit.xml) -->
        <div id="am-text-edit-bar">
          <div class="am-text-input-frame">
            <textarea id="am-text-input-box" rows="2" placeholder="Masukkan teks di sini..." spellcheck="false"></textarea>
          </div>
        </div>

        <!-- Full Font Browser Modal (activity_fontbrowser.xml) -->
        <div id="am-font-browser-modal">
          <div class="am-fb-topbar">
            <button type="button" id="am-btn-fb-back" class="am-fb-back-btn">
              <img src="./icons/ac_ic_back.svg" alt="Back">
            </button>
            <span class="am-fb-title">Semua Fon</span>
            <div class="am-fb-search-wrap">
              <img src="./icons/ic_search_white_24dp.svg" class="am-fb-search-icon" alt="Search">
              <input type="text" id="am-fb-search-input" class="am-fb-search-input" placeholder="Cari fon...">
            </div>
          </div>
          <div class="am-fb-toolbar">
            <input type="file" id="am-fb-file-input" accept=".ttf,.otf,.woff,.woff2" style="display:none">
            <button type="button" id="am-btn-fb-import" class="am-fb-import-btn">
              <span>+ Impor Fon (.ttf/.otf)</span>
            </button>
          </div>
          <div class="am-fb-grid" id="am-fb-grid"></div>
        </div>
      </section>
    `;

    // Reparent canvas elements into #am-canvas-wrapper
    const view = document.getElementById("view");
    const debugCanvas = document.getElementById("debugCanvas");
    const canvasWrap = document.getElementById("am-canvas-wrapper");
    if (view && canvasWrap) {
      canvasWrap.appendChild(view);
    }
    if (debugCanvas && canvasWrap) {
      canvasWrap.appendChild(debugCanvas);
    }

    // Reparent timeline into #am-timeline-mount
    const tlWrap = document.getElementById("timeline-wrap");
    const tlMount = document.getElementById("am-timeline-mount");
    if (tlWrap && tlMount) {
      tlMount.appendChild(tlWrap);
      tlWrap.style.height = "100%";
      tlWrap.style.borderRadius = "0";
      tlWrap.style.border = "0";

      const tlCap = document.getElementById("tl-cap");
      if (tlCap && !document.getElementById("tl-cap-badge")) {
        const badge = document.createElement("div");
        badge.id = "tl-cap-badge";
        badge.className = "tl-cap-badge";
        badge.textContent = "00:00.00";
        badge.title = "Ketuk untuk tambah/hapus penanda (bookmark)";
        badge.addEventListener("click", (e) => {
          e.stopPropagation();
          if (I && I.toggleBookmark) I.toggleBookmark();
          else if (I && I.addBookmark) I.addBookmark(I.H);
        });
        tlCap.appendChild(badge);
      }
    }

    if (I && I.fitCanvas) setTimeout(() => I.fitCanvas(), 50);
    if (typeof initAnimationCurveEditor === "function") initAnimationCurveEditor();
    window.addEventListener("resize", () => {
      if (I && I.fitCanvas) I.fitCanvas();
    });

    // Render Shape Tab Content by default
    renderAddShapes();

    setTimeout(() => {
      console.log("AM_DEBUG_LAYOUT:", JSON.stringify({
        innerWidth: window.innerWidth,
        rootWidth: root.offsetWidth,
        topWidth: document.getElementById("am-top-container")?.offsetWidth,
        navWidth: document.getElementById("am-navbar-default")?.offsetWidth,
        titleWidth: document.getElementById("am-project-title")?.offsetWidth,
        playbarWidth: document.getElementById("am-playbar")?.offsetWidth,
        bottomWidth: document.getElementById("am-bottom-container")?.offsetWidth
      }));
    }, 100);
  }

  function renderAddShapes() {
    const area = document.getElementById("am-add-content-area");
    if (!area) return;
    area.innerHTML = `
      <div class="am-shape-card" data-shape="circle" title="Lingkaran">
        <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/></svg>
      </div>
      <div class="am-shape-card" data-shape="rect" title="Persegi Panjang">
        <svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="16" rx="1"/></svg>
      </div>
      <div class="am-shape-card" data-shape="roundrect" title="Persegi Bulat">
        <svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="16" rx="4"/></svg>
      </div>
      <div class="am-shape-card" data-shape="star" title="Bintang">
        <svg viewBox="0 0 24 24"><polygon points="12,2 15,9 22,9 17,14 19,21 12,17 5,21 7,14 2,9 9,9"/></svg>
      </div>
      <div class="am-shape-card" data-shape="polygon" title="Segitiga">
        <svg viewBox="0 0 24 24"><polygon points="12,3 22,21 2,21"/></svg>
      </div>
      <div class="am-shape-card" data-shape="heart" title="Hati">
        <svg viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
      </div>
      <div class="am-shape-card" data-shape="custom_draw" title="Gambar Vektor">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 19l7-7 3 3-7 7-3-3z"/><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/><circle cx="11" cy="11" r="2"/></svg>
      </div>
    `;

    area.querySelectorAll(".am-shape-card").forEach(card => {
      card.addEventListener("click", () => {
        closeAddPopup();
        if (card.dataset.shape === "custom_draw") {
          openDrawingMode();
        } else {
          addShapeLayer(card.dataset.shape);
        }
      });
    });
  }

  function renderAddObjects() {
    const area = document.getElementById("am-add-content-area");
    if (!area) return;
    area.innerHTML = `
      <div class="am-objects-grid am-object-grid">
        <button type="button" class="am-object-card" id="addCameraObject" data-id="am-add-camera-btn" title="Kamera">
          <div class="am-object-card-icon">
            <img src="./icons/ic_camera_outline.svg" alt="Camera">
          </div>
          <span class="am-object-card-label">Kamera</span>
        </button>
        <button type="button" class="am-object-card" id="addNullObject" data-id="am-add-null-btn" title="Objek Null">
          <div class="am-object-card-icon">
            <img src="./icons/ic_null.svg" alt="Null">
          </div>
          <span class="am-object-card-label">Objek Null</span>
        </button>
        <button type="button" class="am-object-card" id="addEmptyGroup" data-id="am-add-group-btn" title="Grup Kosong">
          <div class="am-object-card-icon">
            <img src="./icons/ic_empty_group.svg" alt="Group">
          </div>
          <span class="am-object-card-label">Grup Kosong</span>
        </button>
        <button type="button" class="am-object-card" id="addElementsProjects" data-id="am-add-elements-btn" title="Elemen">
          <div class="am-object-card-icon">
            <img src="./icons/ic_add_elements.svg" alt="Elements">
          </div>
          <span class="am-object-card-label">Elemen</span>
        </button>
      </div>
    `;

    const btnNull = document.getElementById("addNullObject") || document.getElementById("am-add-null-btn");
    if (btnNull) {
      btnNull.addEventListener("click", async () => {
        closeAddPopup();
        const I = window.__AM_INTERNAL;
        if (I && I.omAddNull) {
          const l = await I.omAddNull();
          if (l && I.selectLayer) I.selectLayer(l);
        }
      });
    }

    const btnCamera = document.getElementById("addCameraObject") || document.getElementById("am-add-camera-btn");
    if (btnCamera) {
      btnCamera.addEventListener("click", async () => {
        closeAddPopup();
        const I = window.__AM_INTERNAL;
        if (I && I.omAddCamera) {
          const l = await I.omAddCamera();
          const target = l || (I.val && I.val.layers && I.val.layers[I.val.layers.length - 1]);
          if (target && I.selectLayer) I.selectLayer(target);
        }
      });
    }

    const btnGroup = document.getElementById("addEmptyGroup") || document.getElementById("am-add-group-btn");
    if (btnGroup) {
      btnGroup.addEventListener("click", async () => {
        closeAddPopup();
        const I = window.__AM_INTERNAL;
        if (I && I.omAddGroup) {
          const l = await I.omAddGroup();
          if (l && I.selectLayer) I.selectLayer(l);
        }
      });
    }

    const btnElements = document.getElementById("am-add-elements-btn");
    if (btnElements) {
      btnElements.addEventListener("click", () => {
        closeAddPopup();
        const I = window.__AM_INTERNAL;
        if (I && I.handle9) I.handle9("[ELEMEN] Pilih preset / elemen untuk ditambahkan");
      });
    }
  }

  function addShapeLayer(shapeType) {
    const I = window.__AM_INTERNAL;
    if (!I || !I.val) return;
    const snap = I.sceneSnapshot ? I.sceneSnapshot() : null;
    const shapeXml = shapeType === "circle" ? ".circle" : shapeType === "star" ? ".star" : ".rect";
    const newLayer = {
      id: "shape_" + Date.now().toString(36),
      tag: "shape",
      shapeType: shapeXml,
      label: "Bentuk " + (I.val.layers ? I.val.layers.length + 1 : 1),
      startTime: I.H || 0,
      endTime: (I.H || 0) + 3000,
      color: "#00ffa8",
      fillColor: "#00ffa8",
      fillType: "color",
      transform: {
        location: { value: [0, 0, 0], kfs: [] },
        scale: { value: [100, 100], kfs: [] },
        rotation: { value: [0], kfs: [] },
        opacity: { value: [1], kfs: [] }
      },
      effects: []
    };

    if (I.val.layers) {
      I.val.layers.push(newLayer);
      if (snap && I.pushUndo) I.pushUndo(snap);
      I.V = true;
      if (I.bind4) I.bind4();
      if (I.selectLayer) I.selectLayer(newLayer);
      if (I.val2) I.val2.renderAt(I.H);
    }
  }

  function addTextLayer() {
    const I = window.__AM_INTERNAL;
    if (!I || !I.val) return null;
    const snap = I.sceneSnapshot ? I.sceneSnapshot() : null;
    const newLayer = {
      id: "text_" + Date.now().toString(36),
      tag: "text",
      label: "Teks " + (I.val.layers ? I.val.layers.length + 1 : 1),
      textContent: "Teks Open Motion",
      startTime: I.H || 0,
      endTime: (I.H || 0) + 3000,
      fontSize: 28,
      font: "Roboto",
      align: "center",
      letterSpacing: 0,
      lineSpacing: 1,
      color: "#ffffff",
      fillColor: [1, 1, 1, 1],
      fillType: "color",
      transform: {
        location: { value: [0, 0, 0], kfs: [] },
        scale: { value: [100, 100], kfs: [] },
        rotation: { value: [0], kfs: [] },
        opacity: { value: [1], kfs: [] }
      },
      effects: []
    };

    if (I.val.layers) {
      I.val.layers.push(newLayer);
      if (snap && I.pushUndo) I.pushUndo(snap);
      I.V = true;
      if (I.bind4) I.bind4();
      if (I.selectLayer) I.selectLayer(newLayer);
      if (I.val2) I.val2.renderAt(I.H);
    }
    return newLayer;
  }

  let activePreviewAudio = null;
  let activePreviewCard = null;

  function stopAudioPreview() {
    if (activePreviewAudio) {
      try {
        activePreviewAudio.pause();
        activePreviewAudio.currentTime = 0;
      } catch (e) {}
      activePreviewAudio = null;
    }
    if (activePreviewCard) {
      activePreviewCard.classList.remove("is-playing");
      const icon = activePreviewCard.querySelector(".am-audio-preview-btn img");
      if (icon) icon.src = "./icons/ac_ic_play.svg";
      activePreviewCard = null;
    }
  }

  function createSynthesizedAudioBlob(type, durSec) {
    const sampleRate = 22050;
    const numFrames = Math.floor(sampleRate * durSec);
    const buffer = new Float32Array(numFrames);
    if (type === "synth_pulse") {
      for (let i = 0; i < numFrames; i++) {
        const t = i / sampleRate;
        const beat = (t % 0.5) / 0.5;
        const freq = (t % 2 < 1 ? 110 : 130.81);
        const env = Math.exp(-beat * 6);
        const osc = Math.sin(2 * Math.PI * freq * t) + 0.3 * Math.sin(2 * Math.PI * freq * 2 * t);
        buffer[i] = osc * env * 0.7;
      }
    } else if (type === "dramatic_hit") {
      for (let i = 0; i < numFrames; i++) {
        const t = i / sampleRate;
        const f = Math.max(35, 180 * Math.exp(-t * 2.5));
        const env = Math.exp(-t * 0.8);
        const noise = (Math.random() * 2 - 1) * Math.exp(-t * 8) * 0.4;
        buffer[i] = (Math.sin(2 * Math.PI * f * t) + noise) * env * 0.8;
      }
    } else {
      for (let i = 0; i < numFrames; i++) {
        const t = i / sampleRate;
        const notes = [261.63, 329.63, 392.00, 523.25];
        const freq = notes[Math.floor(t * 4) % notes.length];
        const beat = (t % 0.25) / 0.25;
        const env = Math.exp(-beat * 8);
        buffer[i] = (Math.sin(2 * Math.PI * freq * t) + 0.2 * Math.sin(2 * Math.PI * freq * 3 * t)) * env * 0.5;
      }
    }
    const wavBytes = new ArrayBuffer(44 + numFrames * 2);
    const view = new DataView(wavBytes);
    function writeString(offset, string) {
      for (let j = 0; j < string.length; j++) view.setUint8(offset + j, string.charCodeAt(j));
    }
    writeString(0, "RIFF");
    view.setUint32(4, 36 + numFrames * 2, true);
    writeString(8, "WAVE");
    writeString(12, "fmt ");
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, 1, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * 2, true);
    view.setUint16(32, 2, true);
    view.setUint16(34, 16, true);
    writeString(36, "data");
    view.setUint32(40, numFrames * 2, true);
    let offset = 44;
    for (let i = 0; i < numFrames; i++) {
      const s = Math.max(-1, Math.min(1, buffer[i]));
      view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
      offset += 2;
    }
    return new Blob([view], { type: "audio/wav" });
  }

  function addAudioLayer(file, optName, optDurMs) {
    if (!file) return;
    const I = window.__AM_INTERNAL;
    if (I && I.addAudioLayer) {
      I.addAudioLayer(file, optName, optDurMs);
      return;
    }
    if (!I || !I.val) return;
    const snap = I.sceneSnapshot ? I.sceneSnapshot() : null;
    const audioId = "audio_" + Date.now().toString(36);
    let audioUrl = "";
    let audioName = "";
    if (typeof file === "string") {
      audioUrl = file;
      audioName = optName || file.split("/").pop().replace(/\.[^/.]+$/, "") || "Audio";
    } else if (file && file.url) {
      audioUrl = file.url;
      audioName = file.name || optName || "Audio";
    } else if (file instanceof Blob || file instanceof File) {
      audioUrl = URL.createObjectURL(file);
      audioName = file.name || optName || "Audio";
    } else {
      return;
    }
    const tempAudio = new Audio(audioUrl);
    const commitLayer = (durMs) => {
      const newLayer = {
        id: audioId,
        tag: "audio",
        label: audioName.replace(/\.[^/.]+$/, "") || "Audio",
        src: audioUrl,
        startTime: I.H || 0,
        endTime: (I.H || 0) + (durMs || 5000),
        inTime: 0,
        outTime: durMs || 5000,
        speed: 1,
        gain: { value: [1], kfs: [] },
        transform: {
          location: { value: [0, 0, 0], kfs: [] },
          scale: { value: [1, 1], kfs: [] },
          rotation: { value: [0], kfs: [] },
          opacity: { value: [1], kfs: [] }
        },
        effects: []
      };
      if (I.val.layers) {
        I.val.layers.push(newLayer);
        if (snap && I.pushUndo) I.pushUndo(snap);
        I.V = true;
        if (I.val.totalTime < newLayer.endTime) {
          I.val.totalTime = newLayer.endTime;
        }
        if (I.bind4) I.bind4();
        if (I.selectLayer) I.selectLayer(newLayer);
        if (I.val2) I.val2.renderAt(I.H);
      }
    };
    if (optDurMs && optDurMs > 0) {
      commitLayer(optDurMs);
    } else {
      tempAudio.addEventListener("loadedmetadata", () => {
        const durSec = tempAudio.duration && !isNaN(tempAudio.duration) ? tempAudio.duration : 5;
        commitLayer(Math.round(durSec * 1000));
      });
      tempAudio.addEventListener("error", () => {
        commitLayer(5000);
      });
    }
  }

  function renderAddMedia(area) {
    const I = window.__AM_INTERNAL || {};
    const mediaList = (I.val && I.val.media) || [];

    area.innerHTML = `
      <div class="am-media-picker-container">
        <input type="file" id="am-input-media-upload" accept="image/*,video/*" multiple style="display:none">
        
        <div class="am-media-grid">
          <!-- Upload / Pick Media Card -->
          <div class="am-media-card am-media-upload-card" id="am-card-upload-media" title="Pilih foto atau video dari perangkat">
            <div class="am-media-card-thumb am-media-upload-thumb">
              <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="#00ffa8" stroke-width="2">
                <path d="M12 5v14M5 12h14"/>
              </svg>
            </div>
            <div class="am-media-card-name">Pilih File</div>
            <div class="am-media-card-sub">Foto / Video</div>
          </div>

          ${mediaList.map((m, idx) => {
            const isVid = (m.type && m.type.startsWith("video")) || (m.filename && m.filename.endsWith(".mp4"));
            const thumbUrl = (I.val2 && I.val2.images && I.val2.images.get(m.filename)) ? I.val2.images.get(m.filename).src : (m.url || "");
            return `
              <div class="am-media-card" data-idx="${idx}" data-filename="${escapeHtml(m.filename)}" title="${escapeHtml(m.title || m.filename)}">
                <div class="am-media-card-thumb">
                  ${thumbUrl ? `<img src="${thumbUrl}" alt="Media" style="width:100%;height:100%;object-fit:cover;">` : (isVid ? `<img src="./icons/ic_export_video.svg" style="width:32px;height:32px;opacity:0.7;">` : `<img src="./icons/ic_add_imagevideo.svg" style="width:32px;height:32px;opacity:0.7;">`)}
                </div>
                <div class="am-media-card-name" title="${escapeHtml(m.title || m.filename)}">${escapeHtml(m.title || m.filename)}</div>
                <div class="am-media-card-sub">${isVid ? 'Video' : 'Foto'}</div>
                <button class="am-media-card-add-btn" title="Tambahkan ke Timeline">
                  <img src="./icons/ac_ic_add_element.svg" alt="+">
                </button>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;

    const fileInput = area.querySelector("#am-input-media-upload");
    const uploadCard = area.querySelector("#am-card-upload-media");

    if (uploadCard && fileInput) {
      uploadCard.addEventListener("click", () => fileInput.click());
      fileInput.addEventListener("change", async (e) => {
        const files = Array.from(e.target.files || []);
        if (files.length > 0) {
          for (const file of files) {
            if (I.omAddMediaFile) {
              await I.omAddMediaFile(file);
            }
          }
          closeAddPopup();
        }
      });
    }

    area.querySelectorAll(".am-media-card:not(.am-media-upload-card)").forEach(card => {
      card.addEventListener("click", async () => {
        const fn = card.dataset.filename;
        const m = mediaList.find(x => x.filename === fn);
        if (m) {
          const meta = I.omMeta ? I.omMeta() : { w: 720, h: 1280, total: 5000 };
          const isVid = (m.type && m.type.startsWith("video")) || (m.filename && m.filename.endsWith(".mp4"));
          const uri = m.uri || ("am:user:" + Date.now());
          const s = Math.round(Math.min(meta.w, meta.h) * 0.7);
          const xml = '<shape id="' + generateOmId() + '" label="' + m.filename + '" startTime="' + (I.H || 0) + '" endTime="' + ((I.H || 0) + 3000) + '" fillType="media" fillImage="' + uri + '" mediaFillMode="' + (isVid ? "fit" : "fill") + '" s=".rect"><property name="size" type="vec2" value="' + s + ',' + s + '" /><transform><location value="' + Math.round(meta.w / 2) + ',' + Math.round(meta.h / 2) + ',0" /><scale value="1,1" /><rotation value="0" /></transform></shape>';
          if (I.omParseLayer && I.omAddLayer) {
            const layer = I.omParseLayer(xml);
            if (layer) await I.omAddLayer(layer, m.filename);
          }
          closeAddPopup();
        }
      });
    });
  }

  function renderAddAudio(area) {
    stopAudioPreview();
    const sampleTracks = [
      { id: "beraksi", name: "Beraksi", dur: "03:28", durMs: 208000, src: "./preset/Beraksi.mp3", art: "🎵" },
      { id: "cyber_pulse", name: "Cyber Pulse", dur: "00:15", durMs: 15000, synth: "synth_pulse", art: "⚡" },
      { id: "dramatic_hit", name: "Dramatic Hit", dur: "00:08", durMs: 8000, synth: "dramatic_hit", art: "💥" },
      { id: "upbeat_pop", name: "Upbeat Pop", dur: "00:20", durMs: 20000, synth: "upbeat_pop", art: "✨" }
    ];

    area.innerHTML = `
      <div class="am-audio-add-panel">
        <div class="am-audio-list-scroller" id="am-add-audio-list">
          <div class="am-audio-card am-audio-upload-card" id="am-card-upload-audio">
            <input type="file" id="am-input-audio-upload" accept="audio/*,.mp3,.wav,.m4a,.aac,.ogg" style="display:none;">
            <div class="am-audio-card-thumb upload">
              <img src="./icons/ic_add_audio.svg" alt="Upload">
            </div>
            <div class="am-audio-card-name">Pilih Audio</div>
            <div class="am-audio-card-dur">File Lokal</div>
            <button class="am-audio-card-add-btn" id="am-btn-choose-file" title="Pilih File Audio">
              <img src="./icons/ac_ic_add_element.svg" alt="+">
            </button>
          </div>

          ${sampleTracks.map(t => `
            <div class="am-audio-card" data-id="${t.id}" data-name="${t.name}" data-dur="${t.dur}" data-dur-ms="${t.durMs}" data-src="${t.src || ''}" data-synth="${t.synth || ''}">
              <div class="am-audio-card-thumb">
                <div class="am-audio-card-art">${t.art}</div>
              </div>
              <div class="am-audio-card-name" title="${t.name}">${t.name}</div>
              <div class="am-audio-card-dur">${t.dur}</div>
              <button class="am-audio-preview-btn" title="Dengarkan">
                <img src="./icons/ac_ic_play.svg" alt="Play">
              </button>
              <button class="am-audio-card-add-btn" title="Tambahkan ke Timeline">
                <img src="./icons/ac_ic_add_element.svg" alt="+">
              </button>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    const fileInput = area.querySelector("#am-input-audio-upload");
    const uploadCard = area.querySelector("#am-card-upload-audio");
    if (uploadCard && fileInput) {
      uploadCard.addEventListener("click", () => fileInput.click());
      fileInput.addEventListener("change", e => {
        const file = e.target.files && e.target.files[0];
        if (file) {
          stopAudioPreview();
          addAudioLayer(file);
          closeAddPopup();
        }
      });
    }

    area.querySelectorAll(".am-audio-card:not(.am-audio-upload-card)").forEach(card => {
      const previewBtn = card.querySelector(".am-audio-preview-btn");
      const addBtn = card.querySelector(".am-audio-card-add-btn");
      const trackName = card.dataset.name;
      const durMs = Number(card.dataset.durMs) || 5000;
      const srcUrl = card.dataset.src;
      const synthType = card.dataset.synth;

      async function getTrackBlobOrUrl() {
        if (srcUrl) return srcUrl;
        if (synthType) {
          return createSynthesizedAudioBlob(synthType, durMs / 1000);
        }
        return "./preset/Beraksi.mp3";
      }

      if (previewBtn) {
        previewBtn.addEventListener("click", async e => {
          e.stopPropagation();
          if (activePreviewCard === card) {
            stopAudioPreview();
            return;
          }
          stopAudioPreview();
          const target = await getTrackBlobOrUrl();
          const playUrl = typeof target === "string" ? target : URL.createObjectURL(target);
          const aud = new Audio(playUrl);
          activePreviewAudio = aud;
          activePreviewCard = card;
          card.classList.add("is-playing");
          const icon = previewBtn.querySelector("img");
          if (icon) icon.src = "./icons/ac_cue_collapse.svg";

          aud.addEventListener("ended", () => stopAudioPreview());
          aud.addEventListener("error", () => stopAudioPreview());
          aud.play().catch(() => stopAudioPreview());
        });
      }

      if (addBtn) {
        addBtn.addEventListener("click", async e => {
          e.stopPropagation();
          stopAudioPreview();
          const target = await getTrackBlobOrUrl();
          if (typeof target === "string") {
            addAudioLayer({ name: trackName + ".mp3", url: target }, trackName, durMs);
          } else {
            const f = new File([target], trackName + ".wav", { type: "audio/wav" });
            addAudioLayer(f, trackName, durMs);
          }
          closeAddPopup();
        });
      }
    });
  }

  function openAddPopup() {
    const pop = document.getElementById("am-add-popup");
    const fab = document.getElementById("am-fab-add");
    if (pop) pop.style.display = "flex";
    if (fab) fab.style.display = "none";
    isAddPopupOpen = true;
  }

  function closeAddPopup() {
    stopAudioPreview();
    const pop = document.getElementById("am-add-popup");
    const fab = document.getElementById("am-fab-add");
    if (pop) pop.style.display = "none";
    if (fab) fab.style.display = "block";
    isAddPopupOpen = false;
  }

  function bindEvents() {
    const I = window.__AM_INTERNAL || {};

    // Play/Pause button
    const btnPlay = document.getElementById("am-btn-play");
    const playIcon = document.getElementById("am-play-icon");
    if (btnPlay) {
      btnPlay.addEventListener("click", () => {
        if (I.togglePlay) I.togglePlay();
        updatePlayState();
      });
    }

    function updatePlayState(playing) {
      const isPlaying = playing !== undefined ? playing : I.isPlaying;
      if (playIcon) {
        playIcon.src = isPlaying ? "./icons/ac_ic_pause.svg" : "./icons/ac_ic_play.svg";
      }
    }
    window.omOnPlayStateChanged = updatePlayState;

    // Audio VU Level Meter (LevelMeterView.smali: com.alightcreative.widget.LevelMeterView)
    function initLevelMeterView() {
      const canvas = document.getElementById("am-level-meter-view");
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      let smoothedLevel = 0;
      let peakLevel = 0;

      function renderMeter() {
        const rect = canvas.getBoundingClientRect();
        const targetW = Math.max(10, Math.round(rect.width || 400));
        const targetH = Math.max(2, Math.round(rect.height || 2));
        if (canvas.width !== targetW || canvas.height !== targetH) {
          canvas.width = targetW;
          canvas.height = targetH;
        }
        const w = canvas.width;
        const h = canvas.height;
        ctx.clearRect(0, 0, w, h);

        const isPlaying = !!(I && I.isPlaying);
        let targetLevel = 0;

        if (isPlaying) {
          const layers = (I.val && I.val.layers) || [];
          const hasAudio = layers.some(l => l.tag === "audio" || l.tag === "video" || l.src || l.gain);
          if (hasAudio) {
            const t = Date.now() / 120;
            targetLevel = 0.35 + 0.35 * Math.abs(Math.sin(t * 1.7) * Math.cos(t * 2.3)) + 0.2 * (Math.random() - 0.5);
            targetLevel = Math.max(0.1, Math.min(1.0, targetLevel));
          }
        }

        if (targetLevel > smoothedLevel) {
          smoothedLevel += (targetLevel - smoothedLevel) * 0.4;
        } else {
          smoothedLevel += (targetLevel - smoothedLevel) * 0.1;
        }
        if (smoothedLevel > peakLevel) peakLevel = smoothedLevel;
        else peakLevel = Math.max(0, peakLevel - 0.01);

        if (smoothedLevel > 0.01) {
          const half = w / 2;
          const span = half * smoothedLevel;
          const left = half - span;
          const right = half + span;

          // Symmetric linear gradient matching LevelMeterView.smali:
          // 0.0: #FF0000, 0.2: #F3C507, 0.4: #00FF36, 0.6: #00FF36, 0.8: #F3C507, 1.0: #FF0000
          const grad = ctx.createLinearGradient(0, 0, w, 0);
          grad.addColorStop(0.0, "#FF0000");
          grad.addColorStop(0.2, "#F3C507");
          grad.addColorStop(0.4, "#00FF36");
          grad.addColorStop(0.6, "#00FF36");
          grad.addColorStop(0.8, "#F3C507");
          grad.addColorStop(1.0, "#FF0000");

          // Background track (alpha 0x4d approx 0.25)
          ctx.globalAlpha = 0.25;
          ctx.fillStyle = grad;
          ctx.fillRect(0, 0, w, h);

          // Active level expanding bilaterally outward from center
          ctx.globalAlpha = 1.0;
          ctx.fillStyle = grad;
          ctx.fillRect(left, 0, right - left, h);
        }

        requestAnimationFrame(renderMeter);
      }

      renderMeter();
    }
    initLevelMeterView();

    // Jump keyframe / bookmark (click) or step 1 frame (shift/alt click)
    const btnPrev = document.getElementById("am-btn-prevframe");
    const btnNext = document.getElementById("am-btn-nextframe");
    if (btnPrev) {
      btnPrev.addEventListener("click", (e) => {
        if (e.shiftKey || e.altKey) {
          I.stepFrame && I.stepFrame(-1);
        } else if (I.jumpPrevKeyframeOrBookmark) {
          I.jumpPrevKeyframeOrBookmark(currentSelectedLayer);
        } else if (I.stepFrame) {
          I.stepFrame(-1);
        }
      });
    }
    if (btnNext) {
      btnNext.addEventListener("click", (e) => {
        if (e.shiftKey || e.altKey) {
          I.stepFrame && I.stepFrame(1);
        } else if (I.jumpNextKeyframeOrBookmark) {
          I.jumpNextKeyframeOrBookmark(currentSelectedLayer);
        } else if (I.stepFrame) {
          I.stepFrame(1);
        }
      });
    }

    // Undo / Redo
    const btnUndo = document.getElementById("am-btn-undo");
    const btnRedo = document.getElementById("am-btn-redo");
    if (btnUndo) btnUndo.addEventListener("click", () => I.undoScene && I.undoScene());
    if (btnRedo) btnRedo.addEventListener("click", () => I.redoScene && I.redoScene());

    // Bookmark toggling via timecode or bookmark button
    function toggleBookmarkAtPlayhead() {
      if (I.toggleBookmark) {
        I.toggleBookmark();
      } else if (I.addBookmark) {
        I.addBookmark(I.H);
      }
    }
    const btnBm = document.getElementById("am-btn-bookmark");
    if (btnBm) btnBm.addEventListener("click", toggleBookmarkAtPlayhead);

    // ── Copy / Paste Menu Popup (activity_edit_playbar.xml / layer_copy_paste_menu_popup.xml) ──
    const btnCopyPaste = document.getElementById("am-btn-copypaste");
    let activeCopyPastePopup = null;

    function closeCopyPastePopup() {
      if (activeCopyPastePopup) {
        activeCopyPastePopup.remove();
        activeCopyPastePopup = null;
      }
      document.removeEventListener("pointerdown", handleOutsideCopyPaste);
    }

    function handleOutsideCopyPaste(e) {
      if (!activeCopyPastePopup) return;
      if (activeCopyPastePopup.contains(e.target) || (btnCopyPaste && btnCopyPaste.contains(e.target))) return;
      closeCopyPastePopup();
    }

    function openCopyPastePopup() {
      if (activeCopyPastePopup) {
        closeCopyPastePopup();
        return;
      }

      const curLayer = currentSelectedLayer || (I.omLayerCur && I.omLayerCur()) || (I.val2 && I.val2.debugSelectedLayerId && I.val && I.val.layers && I.val.layers.find(x => x.id === I.val2.debugSelectedLayerId));
      const allLayers = (I.val && I.val.layers) || [];
      const multiIds = (I.omMulti && I.omMulti.size) ? I.omMultiIds() : [];
      const selectedCount = multiIds.length || (curLayer ? 1 : 0);
      const allSelected = allLayers.length > 0 && selectedCount >= allLayers.length;
      const hasClipboardLayers = !!(window.__omClipboardLayers && window.__omClipboardLayers.length);
      const hasClipboardStyle = !!window.__omClipboardStyle;
      const hasSelected = selectedCount > 0;

      const popup = document.createElement("div");
      popup.id = "am-copypaste-popup";
      popup.className = "am-copypaste-popup";

      popup.innerHTML = `
        <div id="am-copypaste-menu-view" class="am-copypaste-view">
          <div class="am-copypaste-list" id="am-copypaste-items">
            <!-- 1. Select / Deselect All -->
            <button type="button" class="am-copypaste-item" id="am-cp-selectall">
              <span class="am-copypaste-item-icon">
                <img src="${allSelected ? './icons/ic_layer_clearselection.svg' : './icons/ic_layer_allmultiselect.svg'}" alt="Select">
              </span>
              <span class="am-copypaste-item-label">${allSelected ? 'Batal Memilih Semua' : 'Pilih Semua Lapisan'}</span>
            </button>

            <!-- 2. Duplicate Layer -->
            <button type="button" class="am-copypaste-item ${!hasSelected ? 'disabled' : ''}" id="am-cp-duplicate">
              <span class="am-copypaste-item-icon">
                <img src="./icons/ic_copy_layer.svg" alt="Duplicate">
              </span>
              <span class="am-copypaste-item-label">${selectedCount > 1 ? `Duplikat ${selectedCount} Lapisan` : 'Duplikat 1 Lapisan'}</span>
            </button>

            <!-- 3. Copy Layer Style -->
            <button type="button" class="am-copypaste-item ${!hasSelected ? 'disabled' : ''}" id="am-cp-copystyle">
              <span class="am-copypaste-item-icon">
                <img src="./icons/ic_copy_style_layer.svg" alt="Copy Style">
              </span>
              <span class="am-copypaste-item-label">Salin Gaya Lapisan</span>
            </button>

            <!-- 4. Copy Layer -->
            <button type="button" class="am-copypaste-item ${!hasSelected ? 'disabled' : ''}" id="am-cp-copylayer">
              <span class="am-copypaste-item-icon">
                <img src="./icons/ic_copy_layer.svg" alt="Copy Layer">
              </span>
              <span class="am-copypaste-item-label">${selectedCount > 1 ? `Salin ${selectedCount} Lapisan` : 'Salin 1 Lapisan'}</span>
            </button>

            <!-- 5. Paste Layer -->
            <button type="button" class="am-copypaste-item ${!hasClipboardLayers ? 'disabled' : ''}" id="am-cp-pastelayer">
              <span class="am-copypaste-item-icon">
                <img src="./icons/ic_paste_layer.svg" alt="Paste Layer">
              </span>
              <span class="am-copypaste-item-label">${(window.__omClipboardLayers && window.__omClipboardLayers.length > 1) ? `Tempel ${window.__omClipboardLayers.length} Lapisan` : 'Tempel 1 Lapisan'}</span>
            </button>

            <!-- 6. Paste Style (with Submenu) -->
            <button type="button" class="am-copypaste-item ${(!hasClipboardStyle || !hasSelected) ? 'disabled' : ''}" id="am-cp-pastestyle">
              <span class="am-copypaste-item-icon">
                <img src="./icons/ic_paste_style.svg" alt="Paste Style">
              </span>
              <span class="am-copypaste-item-label">Tempel Gaya</span>
              <span class="am-copypaste-item-arrow">›</span>
            </button>
          </div>
        </div>

        <div id="am-copypaste-subview" class="am-copypaste-view" style="display:none;">
          <div class="am-pastestyle-header">
            <button type="button" class="am-pastestyle-back" id="am-pastestyle-back" title="Kembali">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
            </button>
            <span class="am-pastestyle-title" id="am-pastestyle-title">Tempel Gaya</span>
          </div>
          <div class="am-pastestyle-grid">
            <div class="am-pastestyle-row">
              <button type="button" class="am-pastestyle-btn active" id="am-ps-btn-color" data-prop="colorFill" title="Warna & Isi">
                <img src="./icons/ac_ic_colorfill.svg" alt="Color & Fill">
                <span>Warna &amp; Isi</span>
              </button>
              <button type="button" class="am-pastestyle-btn active" id="am-ps-btn-border" data-prop="borderShadow" title="Batas & Bayangan">
                <img src="./icons/ac_ic_bordersh.svg" alt="Border & Shadow">
                <span>Batas &amp; Bayangan</span>
              </button>
              <button type="button" class="am-pastestyle-btn active" id="am-ps-btn-blend" data-prop="blendingOpacity" title="Blending & Opasitas">
                <img src="./icons/ac_ic_blendop.svg" alt="Blending & Opacity">
                <span>Blending &amp; Opasitas</span>
              </button>
            </div>
            <div class="am-pastestyle-row">
              <button type="button" class="am-pastestyle-btn active" id="am-ps-btn-transform" data-prop="moveTransform" title="Move & Transform">
                <img src="./icons/ac_ic_movetransform.svg" alt="Move & Transform">
                <span>Move &amp; Transform</span>
              </button>
              <button type="button" class="am-pastestyle-btn active" id="am-ps-btn-text" data-prop="text" title="Edit Teks">
                <img src="./icons/ac_edit_text.svg" alt="Edit Text">
                <span>Teks</span>
              </button>
              <button type="button" class="am-pastestyle-btn active" id="am-ps-btn-effects" data-prop="effects" title="Efek">
                <img src="./icons/ac_ic_effects.svg" alt="Effects">
                <span>Efek</span>
              </button>
              <button type="button" class="am-pastestyle-btn active" id="am-ps-btn-speed" data-prop="speed" title="Kecepatan">
                <img src="./icons/ac_ic_speed.svg" alt="Speed">
                <span>Kecepatan</span>
              </button>
            </div>
          </div>
          <div class="am-pastestyle-footer">
            <button type="button" class="am-pastestyle-btn-cancel" id="am-ps-btn-cancel">Batal</button>
            <button type="button" class="am-pastestyle-btn-paste" id="am-ps-btn-paste">Tempel</button>
          </div>
        </div>
      `;

      document.body.appendChild(popup);
      activeCopyPastePopup = popup;

      const rect = btnCopyPaste.getBoundingClientRect();
      popup.style.left = Math.max(8, Math.min(window.innerWidth - 270, rect.left + rect.width / 2 - 130)) + "px";
      if (rect.bottom + 270 < window.innerHeight) {
        popup.style.top = (rect.bottom + 6) + "px";
        popup.style.bottom = "auto";
      } else {
        popup.style.bottom = (window.innerHeight - rect.top + 6) + "px";
        popup.style.top = "auto";
      }

      const menuView = popup.querySelector("#am-copypaste-menu-view");
      const subView = popup.querySelector("#am-copypaste-subview");
      const titleEl = popup.querySelector("#am-pastestyle-title");

      const btnSelAll = popup.querySelector("#am-cp-selectall");
      if (btnSelAll) {
        btnSelAll.addEventListener("click", () => {
          if (allSelected) {
            I.omMultiClear && I.omMultiClear();
          } else {
            I.omMultiSelectAll && I.omMultiSelectAll();
          }
          closeCopyPastePopup();
        });
      }

      const btnDup = popup.querySelector("#am-cp-duplicate");
      if (btnDup && hasSelected) {
        btnDup.addEventListener("click", () => {
          I.duplicateLayer && I.duplicateLayer(curLayer);
          closeCopyPastePopup();
        });
      }

      const btnCopySt = popup.querySelector("#am-cp-copystyle");
      if (btnCopySt && hasSelected) {
        btnCopySt.addEventListener("click", () => {
          I.omCopyStyle && I.omCopyStyle(curLayer);
          closeCopyPastePopup();
        });
      }

      const btnCopyL = popup.querySelector("#am-cp-copylayer");
      if (btnCopyL && hasSelected) {
        btnCopyL.addEventListener("click", () => {
          I.omCopyLayers && I.omCopyLayers();
          closeCopyPastePopup();
        });
      }

      const btnPasteL = popup.querySelector("#am-cp-pastelayer");
      if (btnPasteL && hasClipboardLayers) {
        btnPasteL.addEventListener("click", () => {
          I.omPasteLayers && I.omPasteLayers();
          closeCopyPastePopup();
        });
      }

      const btnPasteSt = popup.querySelector("#am-cp-pastestyle");
      if (btnPasteSt && hasClipboardStyle && hasSelected) {
        btnPasteSt.addEventListener("click", () => {
          menuView.style.display = "none";
          subView.style.display = "block";
        });
      }

      const btnBack = popup.querySelector("#am-pastestyle-back");
      if (btnBack) {
        btnBack.addEventListener("click", () => {
          subView.style.display = "none";
          menuView.style.display = "block";
        });
      }

      const styleOptions = {
        colorFill: true,
        borderShadow: true,
        blendingOpacity: true,
        moveTransform: true,
        text: true,
        effects: true,
        speed: true
      };

      const optionNames = {
        colorFill: "Warna & Isi",
        borderShadow: "Batas & Bayangan",
        blendingOpacity: "Blending & Opasitas",
        moveTransform: "Move & Transform",
        text: "Teks",
        effects: "Efek",
        speed: "Kecepatan"
      };

      popup.querySelectorAll(".am-pastestyle-btn").forEach(btn => {
        const prop = btn.dataset.prop;
        btn.addEventListener("click", () => {
          styleOptions[prop] = !styleOptions[prop];
          btn.classList.toggle("active", styleOptions[prop]);
          if (titleEl) {
            titleEl.textContent = `${optionNames[prop] || 'Opsi'} ${styleOptions[prop] ? 'Diaktifkan' : 'Dinonaktifkan'}`;
            titleEl.style.color = styleOptions[prop] ? '#00ffa8' : '#a4acba';
            setTimeout(() => {
              if (titleEl) {
                titleEl.textContent = "Tempel Gaya";
                titleEl.style.color = "#ffffff";
              }
            }, 1000);
          }
        });
      });

      const btnCancel = popup.querySelector("#am-ps-btn-cancel");
      if (btnCancel) btnCancel.addEventListener("click", closeCopyPastePopup);

      const btnConfirmPaste = popup.querySelector("#am-ps-btn-paste");
      if (btnConfirmPaste) {
        btnConfirmPaste.addEventListener("click", () => {
          I.omPasteStyle && I.omPasteStyle(styleOptions);
          closeCopyPastePopup();
        });
      }

      setTimeout(() => {
        document.addEventListener("pointerdown", handleOutsideCopyPaste);
      }, 20);
    }

    if (btnCopyPaste) {
      btnCopyPaste.addEventListener("click", (e) => {
        e.stopPropagation();
        openCopyPastePopup();
      });
    }

    const navTimecode = document.getElementById("am-nav-timecode");
    if (navTimecode) navTimecode.addEventListener("click", toggleBookmarkAtPlayhead);

    const infobarTimePill = document.getElementById("am-infobar-time-pill");
    if (infobarTimePill) infobarTimePill.addEventListener("click", toggleBookmarkAtPlayhead);

    // ── ViewMode Toolbar & Camera View Toggle (activity_edit.xml / viewmodeHolder) ──
    const btnPreviewMode = document.getElementById("am-btn-previewmode");
    const previewModeIcon = document.getElementById("am-previewmode-icon");
    const viewmodeBar = document.getElementById("am-viewmode-bar");
    const btnVmCamera = document.getElementById("am-btn-vm-camera");
    const btnVmGrid = document.getElementById("am-btn-vm-grid");
    const btnVmPixel = document.getElementById("am-btn-vm-pixel");
    const btnVmZoomIn = document.getElementById("am-btn-vm-zoom-in");
    const btnVmZoomOut = document.getElementById("am-btn-vm-zoom-out");
    const vmZoomText = document.getElementById("am-vm-zoom-text");

    let isViewModeBarOpen = false;
    let isCameraViewActive = true;
    let isGridActive = false;
    let isPixelPreviewActive = false;
    let canvasZoomPercent = 100;

    function hasCameraLayerInScene() {
      const layers = (I.val && I.val.layers) || [];
      return layers.some(l => l.tag === "camera");
    }

    const camPill = document.getElementById("am-canvas-camera-pill");

    function updateCameraViewModeButton() {
      const hasCam = hasCameraLayerInScene();
      if (btnVmCamera) {
        btnVmCamera.disabled = !hasCam;
        const camImg = btnVmCamera.querySelector("img");
        if (isCameraViewActive && hasCam) {
          btnVmCamera.classList.add("active");
          if (camImg) camImg.src = "./icons/ic_preview_mode_camera_on.svg";
        } else {
          btnVmCamera.classList.remove("active");
          if (camImg) camImg.src = "./icons/ic_preview_mode_camera_off.svg";
        }
      }
      if (camPill) {
        camPill.style.display = (isCameraViewActive && hasCam) ? "flex" : "none";
      }
    }

    function toggleCameraView() {
      if (!hasCameraLayerInScene()) return;
      isCameraViewActive = !isCameraViewActive;
      if (I.setCameraViewEnabled) {
        I.setCameraViewEnabled(isCameraViewActive);
      } else if (I.val2) {
        I.val2.cameraViewEnabled = isCameraViewActive;
        if (I.val2.renderAt) I.val2.renderAt(I.H);
      }
      updateCameraViewModeButton();
    }

    if (camPill) {
      camPill.addEventListener("click", toggleCameraView);
    }

    if (btnPreviewMode) {
      btnPreviewMode.addEventListener("click", () => {
        isViewModeBarOpen = !isViewModeBarOpen;
        if (viewmodeBar) {
          viewmodeBar.style.display = isViewModeBarOpen ? "flex" : "none";
        }
        if (previewModeIcon) {
          previewModeIcon.src = isViewModeBarOpen
            ? "./icons/ic_viewmode_panel_close.svg"
            : "./icons/ic_viewmode_panel_open.svg";
        }
        updateCameraViewModeButton();
      });
    }

    if (btnVmCamera) {
      btnVmCamera.addEventListener("click", toggleCameraView);
    }

    if (btnVmGrid) {
      btnVmGrid.addEventListener("click", () => {
        isGridActive = !isGridActive;
        btnVmGrid.classList.toggle("active", isGridActive);
        const gridImg = btnVmGrid.querySelector("img");
        if (gridImg) {
          gridImg.src = isGridActive
            ? "./icons/ic_preview_mode_grid_on.svg"
            : "./icons/ic_preview_mode_grid_off.svg";
        }
        const stage = document.getElementById("am-canvas-wrapper");
        if (stage) {
          if (isGridActive) {
            stage.style.backgroundImage = "linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)";
            stage.style.backgroundSize = "20px 20px";
          } else {
            stage.style.backgroundImage = "";
            stage.style.backgroundSize = "";
          }
        }
      });
    }

    if (btnVmPixel) {
      btnVmPixel.addEventListener("click", () => {
        isPixelPreviewActive = !isPixelPreviewActive;
        btnVmPixel.classList.toggle("active", isPixelPreviewActive);
        const canvas = document.querySelector("#am-canvas-wrapper canvas");
        if (canvas) {
          canvas.style.imageRendering = isPixelPreviewActive ? "pixelated" : "auto";
        }
      });
    }

    if (btnVmZoomIn) {
      btnVmZoomIn.addEventListener("click", () => {
        canvasZoomPercent = Math.min(400, canvasZoomPercent + 25);
        if (vmZoomText) vmZoomText.textContent = `${canvasZoomPercent}%`;
        applyCanvasZoom();
      });
    }

    if (btnVmZoomOut) {
      btnVmZoomOut.addEventListener("click", () => {
        canvasZoomPercent = Math.max(25, canvasZoomPercent - 25);
        if (vmZoomText) vmZoomText.textContent = `${canvasZoomPercent}%`;
        applyCanvasZoom();
      });
    }

    function applyCanvasZoom() {
      const wrapper = document.getElementById("am-canvas-wrapper");
      if (wrapper) {
        wrapper.style.transform = `scale(${canvasZoomPercent / 100})`;
        wrapper.style.transformOrigin = "center center";
      }
    }

    window.omUpdateCameraStatus = updateCameraViewModeButton;

    // Authentic Alight Motion Timecode & FPS Sync
    function formatAmTime(ms, fps = 30) {
      if (isNaN(ms) || ms < 0) ms = 0;
      const totalSec = ms / 1000;
      const m = Math.floor(totalSec / 60);
      const s = Math.floor(totalSec % 60);
      const hundredths = Math.floor((totalSec % 1) * 100);
      return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}.${String(hundredths).padStart(2, "0")}`;
    }

    window.omOnTimeUpdate = (currentTime, totalTime, fps) => {
      const curStr = formatAmTime(currentTime, fps);
      const navTime = document.getElementById("am-nav-time");
      const navFps = document.getElementById("am-nav-fps");
      const infoTime = document.getElementById("am-info-time");
      const capBadge = document.getElementById("tl-cap-badge");

      if (navTime) navTime.textContent = curStr;
      if (navFps) navFps.textContent = `${fps || 30} FPS`;
      if (infoTime) infoTime.textContent = curStr;
      if (capBadge) capBadge.textContent = curStr;
    };

    window.omOnPlayheadBookmarkState = (hasNear) => {
      const navTimeChip = document.getElementById("am-nav-timecode");
      const btnBm = document.getElementById("am-btn-bookmark");
      const capBadge = document.getElementById("tl-cap-badge");
      if (navTimeChip) navTimeChip.classList.toggle("bookmark-active", hasNear);
      if (btnBm) btnBm.classList.toggle("active", hasNear);
      if (capBadge) capBadge.classList.toggle("bookmark-active", hasNear);
    };

    let scrubStartMs = 0;
    let infobarTimer = null;
    window.omOnScrubStateChanged = (isScrubbing, currentMs, startMs) => {
      const overlay = document.getElementById("am-infobar-overlay");
      const infoOffset = document.getElementById("am-info-offset");
      if (!overlay) return;
      if (isScrubbing) {
        clearTimeout(infobarTimer);
        overlay.classList.add("on");
        if (startMs != null) scrubStartMs = startMs;
        const offsetSec = ((currentMs || 0) - (scrubStartMs || 0)) / 1000;
        const sign = offsetSec >= 0 ? "+" : "";
        if (infoOffset) infoOffset.textContent = `${sign}${offsetSec.toFixed(2)}s`;
      } else {
        clearTimeout(infobarTimer);
        infobarTimer = setTimeout(() => {
          overlay.classList.remove("on");
        }, 400);
      }
    };

    // Multi-Select Top Bar (activity_edit_selectbar.xml) & Bottom Bar (activity_edit_select_bottomvar.xml)
    const btnSelCancel = document.getElementById("am-btn-sel-cancel");
    const btnSelGroup = document.getElementById("am-btn-sel-group");
    const btnSelMask = document.getElementById("am-btn-sel-mask");
    const btnSelExclude = document.getElementById("am-btn-sel-exclude");
    const btnSelDel = document.getElementById("am-btn-sel-del");
    const selCount = document.getElementById("am-select-count");
    const navDefault = document.getElementById("am-navbar-default");
    const navElem = document.getElementById("am-navbar-element");
    const navSelect = document.getElementById("am-navbar-select");
    const selNormalHolder = document.getElementById("am-sel-normal-holder");
    const selAlignHolder = document.getElementById("am-sel-screen-align-holder");
    const btnSelAlignToggle = document.getElementById("am-btn-sel-align-toggle");
    const btnSelAlignBack = document.getElementById("am-btn-sel-align-back");

    if (btnSelCancel) btnSelCancel.addEventListener("click", () => I.omMultiClear && I.omMultiClear());
    if (btnSelGroup) btnSelGroup.addEventListener("click", () => I.omMultiGroup && I.omMultiGroup("normal"));
    if (btnSelMask) btnSelMask.addEventListener("click", () => I.omMultiGroup && I.omMultiGroup("mask"));
    if (btnSelExclude) btnSelExclude.addEventListener("click", () => I.omMultiGroup && I.omMultiGroup("exclude"));
    if (btnSelDel) btnSelDel.addEventListener("click", () => I.omMultiDelete && I.omMultiDelete());

    if (btnSelAlignToggle) {
      btnSelAlignToggle.addEventListener("click", () => {
        if (selNormalHolder) selNormalHolder.style.display = "none";
        if (selAlignHolder) selAlignHolder.style.display = "flex";
      });
    }
    if (btnSelAlignBack) {
      btnSelAlignBack.addEventListener("click", () => {
        if (selAlignHolder) selAlignHolder.style.display = "none";
        if (selNormalHolder) selNormalHolder.style.display = "flex";
      });
    }

    // Alignment Screen Buttons
    const btnAlignLeft = document.getElementById("am-btn-align-left-screen");
    const btnAlignCenterH = document.getElementById("am-btn-align-center-h-screen");
    const btnAlignRight = document.getElementById("am-btn-align-right-screen");
    const btnAlignTop = document.getElementById("am-btn-align-top-screen");
    const btnAlignCenterV = document.getElementById("am-btn-align-center-v-screen");
    const btnAlignBottom = document.getElementById("am-btn-align-bottom-screen");
    const btnAlignDistribV = document.getElementById("am-btn-align-distrib-v-screen");
    const btnAlignDistribH = document.getElementById("am-btn-align-distrib-h-screen");

    if (btnAlignLeft) btnAlignLeft.addEventListener("click", () => I.omMultiAlignScreen && I.omMultiAlignScreen("left"));
    if (btnAlignCenterH) btnAlignCenterH.addEventListener("click", () => I.omMultiAlignScreen && I.omMultiAlignScreen("center-h"));
    if (btnAlignRight) btnAlignRight.addEventListener("click", () => I.omMultiAlignScreen && I.omMultiAlignScreen("right"));
    if (btnAlignTop) btnAlignTop.addEventListener("click", () => I.omMultiAlignScreen && I.omMultiAlignScreen("top"));
    if (btnAlignCenterV) btnAlignCenterV.addEventListener("click", () => I.omMultiAlignScreen && I.omMultiAlignScreen("center-v"));
    if (btnAlignBottom) btnAlignBottom.addEventListener("click", () => I.omMultiAlignScreen && I.omMultiAlignScreen("bottom"));
    if (btnAlignDistribV) btnAlignDistribV.addEventListener("click", () => I.omMultiAlignScreen && I.omMultiAlignScreen("distribute-v"));
    if (btnAlignDistribH) btnAlignDistribH.addEventListener("click", () => I.omMultiAlignScreen && I.omMultiAlignScreen("distribute-h"));

    // Multi-Select Bottom Bar Buttons (activity_edit_select_bottomvar.xml)
    const btnMultiTrimLeft = document.getElementById("am-btn-multi-trim-left");
    const btnMultiSplit = document.getElementById("am-btn-multi-split");
    const btnMultiTrimRight = document.getElementById("am-btn-multi-trim-right");
    const btnAlignLeftTl = document.getElementById("am-btn-align-left-tl");
    const btnAlignDistribTl = document.getElementById("am-btn-align-distrib-tl");
    const btnAlignRightTl = document.getElementById("am-btn-align-right-tl");

    if (btnMultiTrimLeft) btnMultiTrimLeft.addEventListener("click", () => I.omTrimSide && I.omTrimSide("l"));
    if (btnMultiSplit) btnMultiSplit.addEventListener("click", () => I.splitLayerAt && I.splitLayerAt());
    if (btnMultiTrimRight) btnMultiTrimRight.addEventListener("click", () => I.omTrimSide && I.omTrimSide("r"));
    if (btnAlignLeftTl) btnAlignLeftTl.addEventListener("click", () => I.omMultiAlignTimeline && I.omMultiAlignTimeline("left"));
    if (btnAlignDistribTl) btnAlignDistribTl.addEventListener("click", () => I.omMultiAlignTimeline && I.omMultiAlignTimeline("distribute"));
    if (btnAlignRightTl) btnAlignRightTl.addEventListener("click", () => I.omMultiAlignTimeline && I.omMultiAlignTimeline("right"));

    window.omOnMultiSelectChanged = (ids) => {
      const count = ids ? ids.length : 0;
      const elemPanel = document.getElementById("am-element-edit-panel");
      const tlView = document.getElementById("am-timeline-view");
      const selectBottomBar = document.getElementById("am-select-bottom-bar");
      const fabBtn = document.getElementById("am-fab-add");
      const tlOverflow = document.getElementById("am-timeline-overflow-btn");

      if (count > 0) {
        if (navDefault) navDefault.style.display = "none";
        if (navElem) navElem.style.display = "none";
        if (navSelect) navSelect.style.display = "flex";
        if (selNormalHolder) selNormalHolder.style.display = "flex";
        if (selAlignHolder) selAlignHolder.style.display = "none";
        if (selCount) selCount.textContent = `${count} terpilih`;
        if (elemPanel) elemPanel.style.display = "none";
        if (tlView) tlView.style.display = "flex";
        if (selectBottomBar) selectBottomBar.style.display = "flex";
        if (fabBtn) fabBtn.style.display = "none";
        if (tlOverflow) tlOverflow.style.display = "none";
      } else {
        if (navSelect) navSelect.style.display = "none";
        if (selectBottomBar) selectBottomBar.style.display = "none";
        if (fabBtn) fabBtn.style.display = "flex";
        if (tlOverflow) tlOverflow.style.display = "flex";
        if (currentSelectedLayer) {
          if (navElem) navElem.style.display = "flex";
          if (elemPanel) elemPanel.style.display = "flex";
          if (tlView) tlView.style.display = "none";
        } else {
          if (navDefault) navDefault.style.display = "flex";
          if (tlView) tlView.style.display = "flex";
        }
      }
    };

    // Group Navigation (Up / Exit Group)
    const btnGroupUp = document.getElementById("am-btn-group-up");
    if (btnGroupUp) {
      btnGroupUp.addEventListener("click", () => {
        if (I.omExitGroup) I.omExitGroup();
      });
    }

    window.omOnGroupStateChanged = (depth, pathTitle) => {
      if (btnGroupUp) btnGroupUp.style.display = depth > 0 ? "flex" : "none";
      const projTitle = document.getElementById("am-project-title");
      if (projTitle && depth > 0 && pathTitle) {
        projTitle.value = pathTitle;
      }
    };

    // Floating '+' Add Button
    const fabAdd = document.getElementById("am-fab-add");
    const closeAdd = document.getElementById("am-btn-close-add");
    if (fabAdd) fabAdd.addEventListener("click", openAddPopup);
    if (closeAdd) closeAdd.addEventListener("click", closeAddPopup);

    // Quick text add
    const quickText = document.getElementById("am-btn-quick-text");
    if (quickText) {
      quickText.addEventListener("click", () => {
        closeAddPopup();
        const l = addTextLayer();
        if (l) openTextEditor(l);
      });
    }

    const quickDraw = document.getElementById("am-btn-quick-draw");
    if (quickDraw) {
      quickDraw.addEventListener("click", () => {
        closeAddPopup();
        openDrawingMode();
      });
    }

    const quickVector = document.getElementById("am-btn-quick-vector");
    if (quickVector) {
      quickVector.addEventListener("click", () => {
        closeAddPopup();
        openDrawingMode();
      });
    }

    // Media tab in Add Popup
    const addTabs = document.querySelectorAll(".am-add-tab-item");
    addTabs.forEach(t => {
      t.addEventListener("click", () => {
        addTabs.forEach(x => x.classList.remove("active"));
        t.classList.add("active");
        const tab = t.dataset.tab;
        const area = document.getElementById("am-add-content-area");
        if (!area) return;
        if (tab === "shape") renderAddShapes();
        else if (tab === "media") {
          renderAddMedia(area);
        } else if (tab === "audio") {
          renderAddAudio(area);
        } else if (tab === "object") {
          renderAddObjects();
        } else {
          area.innerHTML = `<div style="padding:20px;color:#888;font-size:12px;width:100%;text-align:center;">Kategori ${tab} siap digunakan</div>`;
        }
      });
    });

    // Top Settings and Share (Export)
    const btnSettings = document.getElementById("am-btn-settings");
    const btnShare = document.getElementById("am-btn-share");
    const btnExit = document.getElementById("am-btn-exit");

    if (btnSettings) {
      btnSettings.addEventListener("click", () => {
        openProjectSettings();
      });
    }
    if (btnShare) {
      btnShare.addEventListener("click", () => {
        openExportSheet();
      });
    }
    if (btnExit) {
      btnExit.addEventListener("click", async () => {
        if (I.omSaveProject) {
          try { await I.omSaveProject(); } catch (e) {}
        }
        const home = document.getElementById("am-home-screen");
        const root = document.getElementById("am-mobile-root");
        if (root) root.style.display = "none";
        if (home) {
          home.classList.remove("hidden");
          loadHomeProjects();
          const activeTab = home.querySelector(".am-home-tab.active");
          if (activeTab) updateTabIndicator(activeTab);
        }
        if (history.pushState && location.pathname !== "/") {
          history.pushState({ page: "home" }, "", "/");
        }
      });
    }

    // Project title rename & auto-save
    const projTitleInput = document.getElementById("am-project-title");
    if (projTitleInput) {
      const saveTitle = () => {
        const t = projTitleInput.value.trim();
        if (!t) return;
        if (I.val) {
          I.val.title = t;
        }
        if (I.omSaveProject) {
          I.omSaveProject();
        } else if (I.omScheduleSave) {
          I.omScheduleSave();
        }
      };
      projTitleInput.addEventListener("change", saveTitle);
      projTitleInput.addEventListener("blur", saveTitle);
      projTitleInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") projTitleInput.blur();
      });
    }

    // Layer Parenting Popup (layer_parent_menu_popup.xml)
    let activeParentPopup = null;

    function closeLayerParentPopup() {
      if (activeParentPopup) {
        activeParentPopup.remove();
        activeParentPopup = null;
      }
    }

    function updateParentButtonState(layer) {
      const btnParent = document.getElementById("am-btn-elem-parent");
      if (!btnParent) return;
      const hasParent = !!(layer && layer.parentId);
      if (hasParent) {
        btnParent.classList.add("has-parent");
        const parentName = (layer.parentLayer && (layer.parentLayer.label || layer.parentLayer.id)) || layer.parentId;
        btnParent.setAttribute("title", "Parent: " + parentName);
      } else {
        btnParent.classList.remove("has-parent");
        btnParent.setAttribute("title", "Parenting Layer");
      }
    }

    function openLayerParentPopup(anchorEl) {
      closeLayerParentPopup();
      if (!currentSelectedLayer) return;

      const I = window.__AM_INTERNAL || {};
      const layers = (I.val && I.val.layers) || [];

      const popup = document.createElement("div");
      popup.id = "am-parent-popup";
      popup.className = "am-parent-popup";

      const wouldCauseCycle = (target, candidate) => {
        if (!target || !candidate) return false;
        if (target.id === candidate.id) return true;
        let cur = candidate;
        let count = 0;
        while (cur && count++ < 32) {
          if (cur.id === target.id) return true;
          if (!cur.parentId) break;
          cur = cur.parentLayer || (I.val && I.val.layerById ? I.val.layerById.get(cur.parentId) : null);
          if (!cur && I.val && I.val.layers) {
            cur = I.val.layers.find(l => l.id === candidate.parentId);
          }
        }
        return false;
      };

      const isNoneSelected = !currentSelectedLayer.parentId;
      let itemsHtml = '';
      const displayLayers = [...layers].reverse();

      for (const l of displayLayers) {
        const isSelf = (l.id === currentSelectedLayer.id);
        const isCycle = wouldCauseCycle(currentSelectedLayer, l);
        const isDisabled = isSelf || isCycle;
        const isCurrentParent = (currentSelectedLayer.parentId === l.id);

        let iconSrc = './icons/ac_add_shape.svg';
        let tagColor = '#3366ff';
        let subText = '';

        if (l.tag === 'nullobj') {
          iconSrc = './icons/ic_null.svg';
          tagColor = '#00ffa8';
          subText = 'Objek Null';
        } else if (l.tag === 'camera') {
          iconSrc = './icons/ic_camera_outline.svg';
          tagColor = '#00c3ff';
          subText = 'Kamera';
        } else if (l.tag === 'embedScene' || l.tag === 'group' || (I.isGroup && I.isGroup(l))) {
          iconSrc = './icons/ac_ic_groupelements.svg';
          tagColor = '#a370f7';
          subText = 'Grup';
        } else if (l.tag === 'text') {
          iconSrc = './icons/ac_edit_text.svg';
          tagColor = '#ff9c00';
          subText = 'Teks';
        } else if (l.tag === 'audio') {
          iconSrc = './icons/ac_ic_audio.svg';
          tagColor = '#5cdbd3';
          subText = 'Audio';
        } else if (l.fillType === 'media' || l.fillImage || l.fillVideo) {
          iconSrc = './icons/ic_add_imagevideo.svg';
          tagColor = '#ff5c7c';
          subText = 'Media';
        }

        itemsHtml += `
          <div class="am-parent-item ${isCurrentParent ? 'selected' : ''} ${isDisabled ? 'disabled' : ''}" data-layer-id="${l.id}">
            <div class="am-parent-select-view"></div>
            <div class="am-parent-tag-color" style="background:${tagColor};"></div>
            <div class="am-parent-icon">
              <img src="${iconSrc}" alt="${l.tag}">
            </div>
            <div class="am-parent-labels">
              <span class="am-parent-label">${l.label || l.id || 'Layer'}</span>
              ${subText ? `<span class="am-parent-sublabel">${subText}</span>` : ''}
            </div>
            <div class="am-parent-end-icon" style="${isCurrentParent ? '' : 'display:none;'}">
              <img src="./icons/ic_parent_of_layer.svg" alt="Parent">
            </div>
            <div class="am-parent-disable-view"></div>
          </div>
        `;
      }

      popup.innerHTML = `
        <div class="am-parent-card">
          <div class="am-parent-none ${isNoneSelected ? 'selected' : ''}" id="am-parent-item-none">
            <div class="am-parent-select-view"></div>
            <div class="am-parent-none-icon">
              <img src="./icons/ic_none_circle.svg" alt="None">
            </div>
            <div class="am-parent-labels">
              <span class="am-parent-none-label">Tidak ada</span>
            </div>
            <div class="am-parent-end-icon" style="${isNoneSelected ? '' : 'display:none;'}">
              <img src="./icons/ic_parent_of_layer.svg" alt="Selected">
            </div>
          </div>
          <div class="am-parent-divider"></div>
          <div class="am-parent-list" id="am-parent-layer-list">
            ${itemsHtml}
          </div>
        </div>
      `;

      document.body.appendChild(popup);
      activeParentPopup = popup;

      if (anchorEl) {
        const rect = anchorEl.getBoundingClientRect();
        const popupWidth = 260;
        let left = rect.right - popupWidth;
        if (left < 8) left = 8;
        popup.style.top = (rect.bottom + 6) + 'px';
        popup.style.left = left + 'px';
      }

      const noneBtn = popup.querySelector("#am-parent-item-none");
      if (noneBtn) {
        noneBtn.addEventListener("click", () => {
          closeLayerParentPopup();
          if (I.setLayerParent) {
            I.setLayerParent(currentSelectedLayer, '');
          } else {
            currentSelectedLayer.parentId = '';
            currentSelectedLayer.parentLayer = null;
            if (I.resolveHierarchy) I.resolveHierarchy();
            I.V = true;
            if (I.val2 && I.val2.renderAt) I.val2.renderAt(I.H);
          }
          updateParentButtonState(currentSelectedLayer);
        });
      }

      popup.querySelectorAll(".am-parent-item:not(.disabled)").forEach(item => {
        item.addEventListener("click", () => {
          const targetId = item.dataset.layerId;
          closeLayerParentPopup();
          if (!targetId) return;
          if (I.setLayerParent) {
            I.setLayerParent(currentSelectedLayer, targetId);
          } else {
            currentSelectedLayer.parentId = targetId;
            if (I.resolveHierarchy) I.resolveHierarchy();
            I.V = true;
            if (I.val2 && I.val2.renderAt) I.val2.renderAt(I.H);
          }
          updateParentButtonState(currentSelectedLayer);
        });
      });

      const closeHandler = (ev) => {
        if (!popup.contains(ev.target) && ev.target !== anchorEl && !anchorEl.contains(ev.target)) {
          closeLayerParentPopup();
          document.removeEventListener("pointerdown", closeHandler);
        }
      };
      setTimeout(() => document.addEventListener("pointerdown", closeHandler), 20);
    }

    // Element action bar controls
    const elemBack = document.getElementById("am-btn-elem-back");
    const elemParent = document.getElementById("am-btn-elem-parent");
    const elemDelete = document.getElementById("am-btn-elem-delete");
    const elemOverflow = document.getElementById("am-btn-elem-overflow");
    const elemTitleInput = document.getElementById("am-elem-title");

    if (elemTitleInput) {
      const saveElemTitle = () => {
        if (!currentSelectedLayer) return;
        const t = elemTitleInput.value.trim();
        if (t) {
          currentSelectedLayer.label = t;
          I.V = true;
          if (I.bind4) I.bind4();
          if (I.omScheduleSave) I.omScheduleSave();
        }
      };
      elemTitleInput.addEventListener("change", saveElemTitle);
      elemTitleInput.addEventListener("blur", saveElemTitle);
      elemTitleInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") elemTitleInput.blur();
      });
    }

    if (elemBack) {
      elemBack.addEventListener("click", () => {
        if (I.deselectLayer) I.deselectLayer();
      });
    }
    if (elemParent) {
      elemParent.addEventListener("click", (e) => {
        e.stopPropagation();
        if (!currentSelectedLayer) return;
        openLayerParentPopup(elemParent);
      });
    }
    if (elemDelete) {
      elemDelete.addEventListener("click", () => {
        if (currentSelectedLayer && I.deleteLayer) {
          I.deleteLayer(currentSelectedLayer);
          if (I.deselectLayer) I.deselectLayer();
        }
      });
    }
    if (elemOverflow) {
      elemOverflow.addEventListener("click", (e) => {
        if (!currentSelectedLayer) return;
        const existing = document.getElementById("am-layer-overflow-menu");
        if (existing) { existing.remove(); return; }

        const menu = document.createElement("div");
        menu.id = "am-layer-overflow-menu";
        menu.style.cssText = "position:absolute;top:46px;right:10px;background:#1a1d26;border:1px solid rgba(255,255,255,0.12);border-radius:8px;padding:6px;box-shadow:0 8px 24px rgba(0,0,0,0.6);z-index:999;display:flex;flex-direction:column;gap:4px;min-width:160px;";

        const isGrp = I.isGroup && I.isGroup(currentSelectedLayer);
        const items = [];
        if (isGrp) {
          items.push({ text: "Edit Isi Grup", icon: "./icons/ac_ic_groupelements.svg", action: () => I.omEnterGroup && I.omEnterGroup(currentSelectedLayer) });
          items.push({ text: "Buka Grup (Ungroup)", icon: "./icons/ic_exclude_group_bl.svg", action: () => I.omUngroup && I.omUngroup(currentSelectedLayer) });
        }
        items.push({ text: "Duplikat Layer", icon: "./icons/ic_layer_copy_paste_menu.svg", action: () => I.duplicateLayer && I.duplicateLayer(currentSelectedLayer) });
        items.push({ text: "Hapus Layer", icon: "./icons/ac_ic_delete.svg", danger: true, action: () => {
          if (I.deleteLayer) I.deleteLayer(currentSelectedLayer);
          if (I.deselectLayer) I.deselectLayer();
          currentSelectedLayer = null;
        }});

        items.forEach(it => {
          const btn = document.createElement("button");
          btn.type = "button";
          btn.style.cssText = `background:transparent;border:0;color:${it.danger ? "#ff5252" : "#ffffff"};padding:8px 12px;font-size:12px;font-weight:600;display:flex;align-items:center;gap:8px;border-radius:6px;cursor:pointer;text-align:left;width:100%;`;
          btn.innerHTML = `<img src="${it.icon}" style="width:16px;height:16px;filter:${it.danger ? "none" : "brightness(0) invert(1)"}"><span>${it.text}</span>`;
          btn.addEventListener("click", () => {
            menu.remove();
            it.action();
          });
          menu.appendChild(btn);
        });

        document.body.appendChild(menu);
        const closeMenu = (ev) => {
          if (!menu.contains(ev.target) && ev.target !== elemOverflow && !elemOverflow.contains(ev.target)) {
            menu.remove();
            document.removeEventListener("pointerdown", closeMenu);
          }
        };
        setTimeout(() => document.addEventListener("pointerdown", closeMenu), 20);
      });
    }

    // Keyboard shortcuts: Escape to exit layer/subpanel, Backspace/Delete to remove selected layer
    window.addEventListener("keydown", (e) => {
      const tag = document.activeElement ? document.activeElement.tagName.toLowerCase() : "";
      const isInput = tag === "input" || tag === "textarea" || (document.activeElement && document.activeElement.isContentEditable);

      if (e.key === "Escape") {
        if (isInput) {
          document.activeElement.blur();
          return;
        }
        if (activeCopyPastePopup) {
          closeCopyPastePopup();
          return;
        }
        if (activeParentPopup) {
          closeLayerParentPopup();
          return;
        }
        if (activeLiveShapeLayer) {
          closeLiveShape(true);
          return;
        }
        if (activeEditPointsLayer) {
          closeEditPoints(true);
          return;
        }
        if (activeTextEditorLayer) {
          closeTextEditor(true);
          return;
        }
        const sub = document.getElementById("am-subpanel-container");
        if (sub && sub.classList.contains("open")) {
          closeSubpanel();
          return;
        }
        if (isAddPopupOpen) {
          closeAddPopup();
          return;
        }
        const fxSheet = document.getElementById("am-effect-picker-sheet");
        if (fxSheet) {
          fxSheet.remove();
          return;
        }
        if (typeof window.omCloseMoveTransform === "function") {
          window.omCloseMoveTransform();
        }
        if (I.deselectLayer) {
          I.deselectLayer();
        }
        currentSelectedLayer = null;
        return;
      }

      if ((e.key === "Backspace" || e.key === "Delete") && !isInput) {
        const target = currentSelectedLayer || (I.val && I.val.layers && I.val2 && I.val2.debugSelectedLayerId && I.val.layers.find(x => x.id === I.val2.debugSelectedLayerId));
        if (target && I.deleteLayer) {
          e.preventDefault();
          I.deleteLayer(target);
          if (I.deselectLayer) I.deselectLayer();
          currentSelectedLayer = null;
        }
        return;
      }
    });

    // Element edit panel buttons
    const btnTrimLeft = document.getElementById("am-btn-trim-left");
    const btnSplit = document.getElementById("am-btn-split");
    const btnTrimRight = document.getElementById("am-btn-trim-right");
    const btnAudio = document.getElementById("am-btn-audio");
    const btnMoveTrans = document.getElementById("am-btn-movetransform");
    const btnEditContext = document.getElementById("am-btn-editcontext");
    const btnEffects = document.getElementById("am-btn-effects");
    const btnColorFill = document.getElementById("am-btn-colorfill");
    const btnBorderShadow = document.getElementById("am-btn-bordershadow");
    const btnBlendOpacity = document.getElementById("am-btn-blendopacity");

    const btnSpeed = document.getElementById("am-btn-speed");
    if (btnSpeed) {
      btnSpeed.addEventListener("click", () => {
        openSubpanel("Kecepatan & Retiming", renderSpeedControl);
      });
    }
    if (btnTrimLeft) btnTrimLeft.addEventListener("click", () => I.omTrimSide && I.omTrimSide("l", currentSelectedLayer));
    if (btnSplit) btnSplit.addEventListener("click", () => I.splitLayerAt && I.splitLayerAt(currentSelectedLayer));
    if (btnTrimRight) btnTrimRight.addEventListener("click", () => I.omTrimSide && I.omTrimSide("r", currentSelectedLayer));
    if (btnAudio) {
      btnAudio.addEventListener("click", () => {
        openSubpanel("Volume & Audio", renderAudioVolume);
      });
    }
    if (btnBorderShadow) {
      btnBorderShadow.addEventListener("click", () => {
        openSubpanel("Batas & Bayangan", renderBorderShadow);
      });
    }
    if (btnMoveTrans) {
      btnMoveTrans.addEventListener("click", () => {
        openSubpanel("Move & Transform", renderMoveTransform);
      });
    }
    const elemPanel = document.getElementById("am-element-edit-panel");
    const subpanel = document.getElementById("am-subpanel-container");
    const subpanelContent = document.getElementById("am-subpanel-content");
    const navSetting = document.getElementById("am-navbar-setting");
    const navSettingTitle = document.getElementById("am-setting-title");
    const navSettingBack = document.getElementById("am-btn-setting-back");

    function openSubpanel(title, renderFn) {
      if (!currentSelectedLayer) return;
      if (elemPanel) elemPanel.style.display = "none";
      if (navElem) navElem.style.display = "none";
      if (navDefault) navDefault.style.display = "none";
      if (navSetting) {
        navSetting.style.display = "flex";
        if (navSettingTitle) navSettingTitle.textContent = title;
      }
      if (subpanel) {
        subpanel.classList.add("open");
        if (subpanelContent) {
          subpanelContent.innerHTML = "";
          renderFn(subpanelContent, currentSelectedLayer);
        }
      }
    }

    function closeSubpanel() {
      if (subpanel) subpanel.classList.remove("open");
      if (navSetting) navSetting.style.display = "none";
      if (currentSelectedLayer) {
        if (navElem) navElem.style.display = "flex";
        if (elemPanel) elemPanel.style.display = "flex";
      } else {
        if (navDefault) navDefault.style.display = "flex";
      }
    }

    if (navSettingBack) navSettingBack.addEventListener("click", closeSubpanel);
    window.omCloseSubpanel = closeSubpanel;

    const btnCamera = document.getElementById("am-btn-camera");
    if (btnCamera) {
      btnCamera.addEventListener("click", () => {
        if (!currentSelectedLayer) return;
        openSubpanel("Opsi Kamera", renderCameraOptions);
      });
    }

    if (btnEditContext) {
      btnEditContext.addEventListener("click", () => {
        if (!currentSelectedLayer) return;
        if (currentSelectedLayer.tag === "camera") {
          openSubpanel("Opsi Kamera", renderCameraOptions);
        } else if (I.isGroup && I.isGroup(currentSelectedLayer)) {
          if (I.omEnterGroup) I.omEnterGroup(currentSelectedLayer);
        } else if (currentSelectedLayer.tag === "text") {
          openTextEditor(currentSelectedLayer);
        } else if (currentSelectedLayer.path || currentSelectedLayer.points || currentSelectedLayer.tag === "drawing" || currentSelectedLayer.tag === "vector") {
          openEditPoints(currentSelectedLayer);
        } else {
          openLiveShape(currentSelectedLayer);
        }
      });
    }

    const btnLsBack = document.getElementById("am-btn-liveshape-back");
    const btnLsAspect = document.getElementById("am-btn-liveshape-aspect");
    const imgLsAspect = document.getElementById("am-img-liveshape-aspect");
    const btnLsCenter = document.getElementById("am-btn-liveshape-center");
    const imgLsCenter = document.getElementById("am-img-liveshape-center");

    if (btnLsBack) btnLsBack.addEventListener("click", () => closeLiveShape(true));
    if (btnLsAspect) {
      btnLsAspect.addEventListener("click", () => {
        isShapeRatioLocked = !isShapeRatioLocked;
        btnLsAspect.classList.toggle("active", isShapeRatioLocked);
        if (imgLsAspect) {
          imgLsAspect.src = isShapeRatioLocked ? "./icons/ic_shape_aspect_lock.svg" : "./icons/ic_shape_aspect_unlock.svg";
        }
      });
    }
    if (btnLsCenter) {
      btnLsCenter.addEventListener("click", () => {
        isShapeFromCenter = !isShapeFromCenter;
        btnLsCenter.classList.toggle("active", isShapeFromCenter);
        if (imgLsCenter) {
          imgLsCenter.src = isShapeFromCenter ? "./icons/ic_shape_size_from_center.svg" : "./icons/ic_shape_size_from_corner.svg";
        }
      });
    }

    const btnEpBack1 = document.getElementById("am-btn-editpoints-back");
    const btnEpBack2 = document.getElementById("am-ep-btn-back");
    if (btnEpBack1) btnEpBack1.addEventListener("click", () => closeEditPoints(true));
    if (btnEpBack2) btnEpBack2.addEventListener("click", () => closeEditPoints(true));

    const btnModePoints = document.getElementById("am-btn-mode-points");
    const btnModeKf = document.getElementById("am-btn-mode-keyframes");
    const btnOpenClose = document.getElementById("am-ep-btn-openclose");
    const btnCurveType = document.getElementById("am-ep-btn-curvetype");
    const btnAddDel = document.getElementById("am-ep-btn-adddelpoint");
    const btnKfToggle = document.getElementById("am-ep-btn-kf-toggle");
    const btnKfCurve = document.getElementById("am-ep-btn-kf-curve");

    if (btnModePoints && btnModeKf) {
      btnModePoints.addEventListener("click", () => {
        epIsKeyframeMode = false;
        btnModePoints.classList.add("active");
        btnModeKf.classList.remove("active");
        if (btnOpenClose) btnOpenClose.style.display = "flex";
        if (btnCurveType) btnCurveType.style.display = "flex";
        if (btnAddDel) btnAddDel.style.display = "flex";
        if (btnKfToggle) btnKfToggle.style.display = "none";
        if (btnKfCurve) btnKfCurve.style.display = "none";
      });
      btnModeKf.addEventListener("click", () => {
        epIsKeyframeMode = true;
        btnModeKf.classList.add("active");
        btnModePoints.classList.remove("active");
        if (btnOpenClose) btnOpenClose.style.display = "none";
        if (btnCurveType) btnCurveType.style.display = "none";
        if (btnAddDel) btnAddDel.style.display = "none";
        if (btnKfToggle) btnKfToggle.style.display = "flex";
        if (btnKfCurve) btnKfCurve.style.display = "flex";
      });
    }

    if (btnKfCurve) {
      btnKfCurve.addEventListener("click", () => {
        if (typeof window.omOpenCurveEditor === "function") {
          const epPanel = document.getElementById("am-editpoints-panel");
          if (epPanel) epPanel.classList.remove("open");
          window.omOpenCurveEditor({
            prop: "points",
            layer: activeEditPointsLayer,
            title: "Edit Poin",
            onBack: () => {
              if (epPanel) epPanel.classList.add("open");
            }
          });
        }
      });
    }

    if (btnOpenClose) {
      btnOpenClose.addEventListener("click", () => {
        epIsClosed = !epIsClosed;
        const img = document.getElementById("am-ep-img-openclose");
        if (img) img.src = epIsClosed ? "./icons/ac_ic_path_close.svg" : "./icons/ac_ic_path_open.svg";
        applyPointsToLayer();
        renderCanvasOverlay();
      });
    }

    if (btnCurveType) {
      btnCurveType.addEventListener("click", () => {
        if (!epPoints[epActiveIdx]) return;
        const pt = epPoints[epActiveIdx];
        const img = document.getElementById("am-ep-img-curvetype");
        if (pt.type === "curved") {
          pt.type = "corner";
          pt.in = null;
          pt.out = null;
          if (img) img.src = "./icons/ac_ic_vertex_sharp.svg";
        } else {
          pt.type = "curved";
          const prev = epPoints[(epActiveIdx - 1 + epPoints.length) % epPoints.length];
          const next = epPoints[(epActiveIdx + 1) % epPoints.length];
          const vx = (next.x - prev.x) * 0.25;
          const vy = (next.y - prev.y) * 0.25;
          pt.in = [pt.x - vx, pt.y - vy];
          pt.out = [pt.x + vx, pt.y + vy];
          if (img) img.src = "./icons/ac_ic_vertex_curved.svg";
        }
        applyPointsToLayer();
        renderCanvasOverlay();
      });
    }

    if (btnAddDel) {
      btnAddDel.addEventListener("click", () => {
        if (epPoints.length > 3) {
          epPoints.splice(epActiveIdx, 1);
          epActiveIdx = Math.max(0, epActiveIdx - 1);
        } else {
          const nextIdx = (epActiveIdx + 1) % epPoints.length;
          const p1 = epPoints[epActiveIdx];
          const p2 = epPoints[nextIdx];
          const newPt = {
            x: Math.round((p1.x + p2.x) / 2),
            y: Math.round((p1.y + p2.y) / 2),
            type: "corner",
            in: null,
            out: null
          };
          epPoints.splice(epActiveIdx + 1, 0, newPt);
          epActiveIdx = epActiveIdx + 1;
        }
        applyPointsToLayer();
        updateEditPointsUI();
        renderCanvasOverlay();
      });
    }

    const btnPrevContour = document.getElementById("am-ep-btn-prev-contour");
    const btnNextContour = document.getElementById("am-ep-btn-next-contour");
    if (btnPrevContour) {
      btnPrevContour.addEventListener("click", () => {
        if (!epPoints.length) return;
        epActiveIdx = (epActiveIdx - 1 + epPoints.length) % epPoints.length;
        updateEditPointsUI();
        renderCanvasOverlay();
      });
    }
    if (btnNextContour) {
      btnNextContour.addEventListener("click", () => {
        if (!epPoints.length) return;
        epActiveIdx = (epActiveIdx + 1) % epPoints.length;
        updateEditPointsUI();
        renderCanvasOverlay();
      });
    }

    const epTrackpad = document.getElementById("am-ep-trackpad");
    if (epTrackpad) {
      epTrackpad.addEventListener("pointerdown", (e) => {
        epTrackpad.setPointerCapture(e.pointerId);
        let lx = e.clientX, ly = e.clientY;
        function onMove(ev) {
          const dx = ev.clientX - lx;
          const dy = ev.clientY - ly;
          lx = ev.clientX;
          ly = ev.clientY;
          if (!epPoints[epActiveIdx]) return;
          const pt = epPoints[epActiveIdx];
          pt.x += dx * 1.5;
          pt.y += dy * 1.5;
          if (pt.in) { pt.in[0] += dx * 1.5; pt.in[1] += dy * 1.5; }
          if (pt.out) { pt.out[0] += dx * 1.5; pt.out[1] += dy * 1.5; }
          applyPointsToLayer();
          renderCanvasOverlay();
        }
        function onUp() {
          epTrackpad.removeEventListener("pointermove", onMove);
          epTrackpad.removeEventListener("pointerup", onUp);
          epTrackpad.removeEventListener("pointercancel", onUp);
        }
        epTrackpad.addEventListener("pointermove", onMove);
        epTrackpad.addEventListener("pointerup", onUp);
        epTrackpad.addEventListener("pointercancel", onUp);
      });
    }
    if (btnEffects) {
      btnEffects.addEventListener("click", () => {
        openSubpanel("Efek", renderEffects);
      });
    }
    if (btnColorFill) {
      btnColorFill.addEventListener("click", () => {
        openSubpanel("Warna & Isi", renderColorFill);
      });
    }
    if (btnBlendOpacity) {
      btnBlendOpacity.addEventListener("click", () => {
        openSubpanel("Blending & Opasitas", renderBlendingOpacity);
      });
    }
  }

  function renderBlendingOpacity(contentEl, layer) {
    const I = window.__AM_INTERNAL || {};
    let curOp = 100;
    const op = (layer.transform && layer.transform.opacity) || layer.opacity;
    if (op && Array.isArray(op.value)) {
      curOp = Math.round(op.value[0] * 100);
    } else if (typeof op === "number") {
      curOp = Math.round(op * 100);
    }
    const curBlend = (layer.blendMode || "normal").toLowerCase();

    const blendCategories = [
      {
        id: "normal",
        name: "Normal",
        items: [
          { id: "normal", name: "Normal", mode: "normal" }
        ]
      },
      {
        id: "darken",
        name: "Gelapkan",
        items: [
          { id: "darken", name: "Gelapkan", mode: "darken" },
          { id: "multiply", name: "Gandakan", mode: "multiply" },
          { id: "color-burn", name: "Terbakar Warna", mode: "color-burn" },
          { id: "linear-burn", name: "Linear Burn", mode: "multiply" },
          { id: "darker-color", name: "Warna Lebih Gelap", mode: "darken" }
        ]
      },
      {
        id: "lighten",
        name: "Cerahkan",
        items: [
          { id: "lighten", name: "Cerahkan", mode: "lighten" },
          { id: "screen", name: "Kasa", mode: "screen" },
          { id: "color-dodge", name: "Cerahkan Warna", mode: "color-dodge" },
          { id: "linear-dodge", name: "Linear Dodge", mode: "color-dodge" },
          { id: "lighter-color", name: "Warna Lebih Terang", mode: "lighten" }
        ]
      },
      {
        id: "contrast",
        name: "Kontras",
        items: [
          { id: "overlay", name: "Hamparan", mode: "overlay" },
          { id: "soft-light", name: "Cahaya Lembut", mode: "soft-light" },
          { id: "hard-light", name: "Cahaya Keras", mode: "hard-light" },
          { id: "soft-overlay", name: "Soft Overlay", mode: "overlay" },
          { id: "vivid-light", name: "Cahaya Terang", mode: "hard-light" },
          { id: "linear-light", name: "Cahaya Linear", mode: "hard-light" },
          { id: "pin-light", name: "Cahaya Pin", mode: "hard-light" }
        ]
      },
      {
        id: "difference",
        name: "Perbedaan",
        items: [
          { id: "difference", name: "Perbedaan", mode: "difference" },
          { id: "exclusion", name: "Pengecualian", mode: "exclusion" },
          { id: "subtract", name: "Kurangi", mode: "difference" },
          { id: "divide", name: "Bagi", mode: "color-dodge" }
        ]
      },
      {
        id: "color",
        name: "Warna",
        items: [
          { id: "hue", name: "Rona", mode: "hue" },
          { id: "saturation", name: "Kejenuhan", mode: "saturation" },
          { id: "color", name: "Warna", mode: "color" },
          { id: "luminance", name: "Pencahayaan", mode: "luminosity" }
        ]
      },
      {
        id: "mask",
        name: "Topeng",
        items: [
          { id: "mask", name: "Masker", mode: "mask" },
          { id: "exclude", name: "Kecualikan Masker", mode: "exclude" }
        ]
      }
    ];

    contentEl.innerHTML = `
      <div class="am-opacity-row">
        <img src="./icons/ac_ic_opacity.svg" class="am-opacity-icon" alt="Opacity">
        <button id="am-opacity-kf-btn" class="am-opacity-kf-btn" title="Toggle Keyframe Opasitas"></button>
        <button id="am-opacity-curve-btn" class="am-opacity-curve-btn" title="Kurva Easing Animasi Opasitas">
          <img src="./icons/ac_ic_anim_curve.svg" alt="Easing">
        </button>
        <input type="range" class="am-opacity-slider" id="am-opacity-slider" min="0" max="100" value="${curOp}">
        <div class="am-opacity-box" id="am-opacity-val">${curOp}%</div>
      </div>
      <div class="am-blend-categories" id="am-blend-categories"></div>
    `;

    const slider = contentEl.querySelector("#am-opacity-slider");
    const valBox = contentEl.querySelector("#am-opacity-val");
    const kfBtn = contentEl.querySelector("#am-opacity-kf-btn");
    const curveBtn = contentEl.querySelector("#am-opacity-curve-btn");

    if (curveBtn) {
      curveBtn.addEventListener("click", () => {
        if (typeof window.omOpenCurveEditor === "function") {
          window.omOpenCurveEditor({
            prop: "op",
            layer,
            title: "Opasitas",
            onBack: () => openSubpanel("Blending & Opasitas", renderBlendingOpacity)
          });
        }
      });
    }

    function updateKfButton() {
      const opProp = layer.transform && layer.transform.opacity;
      const tSec = ((I.H || 0) / 1000);
      const hasKf = !!(opProp && opProp.kfs && opProp.kfs.some(k => Math.abs(Number(k.t) - tSec) < 0.002));
      if (hasKf) {
        kfBtn.classList.add("active");
        kfBtn.title = "Hapus Keyframe Opasitas";
        kfBtn.innerHTML = `<svg viewBox="0 0 24 24" width="20" height="20" fill="#00ffa8"><path d="M12 2L4 12l8 10 8-10L12 2z"/></svg>`;
      } else {
        kfBtn.classList.remove("active");
        kfBtn.title = "Tambah Keyframe Opasitas";
        kfBtn.innerHTML = `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#fff" stroke-width="2"><path d="M12 2L4 12l8 10 8-10L12 2z"/></svg>`;
      }
    }
    updateKfButton();

    kfBtn.addEventListener("click", () => {
      const opProp = layer.transform && layer.transform.opacity;
      const tSec = ((I.H || 0) / 1000);
      const hasKf = !!(opProp && opProp.kfs && opProp.kfs.some(k => Math.abs(Number(k.t) - tSec) < 0.002));
      if (hasKf) {
        if (I.omKfRemoveAt) I.omKfRemoveAt("op");
        else if (opProp && opProp.kfs) {
          const idx = opProp.kfs.findIndex(k => Math.abs(Number(k.t) - tSec) < 0.002);
          if (idx >= 0) opProp.kfs.splice(idx, 1);
        }
      } else {
        if (I.omKfInsert) I.omKfInsert("op");
        else {
          if (!layer.transform) layer.transform = {};
          if (!layer.transform.opacity) layer.transform.opacity = { value: [Number(slider.value) / 100], kfs: [] };
          const norm = Number(slider.value) / 100;
          layer.transform.opacity.value = [norm];
          layer.transform.opacity.kfs = layer.transform.opacity.kfs || [];
          const idx = layer.transform.opacity.kfs.findIndex(k => Math.abs(Number(k.t) - tSec) < 0.002);
          if (idx >= 0) layer.transform.opacity.kfs[idx].v = [norm];
          else layer.transform.opacity.kfs.push({ t: tSec, v: [norm], e: null, easing: null });
          layer.transform.opacity.kfs.sort((a, b) => a.t - b.t);
        }
      }
      layer.opacity = layer.transform.opacity;
      layer.userTouched = true;
      I.V = true;
      if (I.val2) I.val2.renderAt(I.H);
      updateKfButton();
    });

    slider.addEventListener("input", () => {
      const v = Number(slider.value);
      valBox.textContent = v + "%";
      const norm = v / 100;
      if (!layer.transform) layer.transform = {};
      if (layer.transform.opacity && typeof layer.transform.opacity === "object") {
        if (I.omSetKeyable) {
          I.omSetKeyable(layer.transform.opacity, norm);
        } else {
          layer.transform.opacity.value = [norm];
          if (layer.transform.opacity.kfs && layer.transform.opacity.kfs.length) {
            const tSec = ((I.H || 0) / 1000);
            const idx = layer.transform.opacity.kfs.findIndex(k => Math.abs(Number(k.t) - tSec) < 0.002);
            if (idx >= 0) layer.transform.opacity.kfs[idx].v = [norm];
            else layer.transform.opacity.kfs.push({ t: tSec, v: [norm], e: null, easing: null });
            layer.transform.opacity.kfs.sort((a, b) => a.t - b.t);
          }
        }
      } else {
        layer.transform.opacity = { value: [norm], kfs: [] };
      }
      layer.opacity = layer.transform.opacity;
      layer.userTouched = true;
      I.V = true;
      if (I.val2) I.val2.renderAt(I.H);
      updateKfButton();
    });

    const catContainer = contentEl.querySelector("#am-blend-categories");

    let activeBlendId = curBlend;
    if (activeBlendId === "diff") activeBlendId = "difference";

    blendCategories.forEach(cat => {
      const card = document.createElement("div");
      card.className = "am-blend-cat-card";

      const matchedItem = cat.items.find(it => it.id === activeBlendId);
      const isCatActive = !!matchedItem;
      if (isCatActive) card.classList.add("open", "active-cat");

      const header = document.createElement("div");
      header.className = "am-blend-cat-header";
      header.innerHTML = `
        <span class="am-blend-expand-icon">
          <svg viewBox="0 0 80 80" width="12" height="12" fill="#fff"><path d="M56.63 42.79L26.71 64.45C25.31 65.46 23.42 65.04 22.5 63.49C22.17 62.95 22 62.31 22 61.66L22 18.34C22 16.5 23.36 15 25.04 15C25.63 15 26.21 15.19 26.71 15.55L56.63 37.21C58.03 38.22 58.42 40.29 57.5 41.84C57.27 42.22 56.98 42.54 56.63 42.79Z"/></svg>
        </span>
        <span class="am-blend-cat-title">${cat.name}</span>
        <span class="am-blend-cat-selected">${isCatActive ? matchedItem.name : ""}</span>
        <span class="am-blend-cat-check" style="${isCatActive ? "" : "display:none;"}">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="#00ffa8"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
        </span>
      `;

      header.addEventListener("click", () => {
        card.classList.toggle("open");
      });

      const modeList = document.createElement("div");
      modeList.className = "am-blend-mode-list";

      cat.items.forEach(it => {
        const itemEl = document.createElement("div");
        itemEl.className = "am-blend-mode-item" + (activeBlendId === it.id ? " active" : "");
        itemEl.dataset.blendId = it.id;

        let previewHtml = "";
        if (it.id === "mask") {
          previewHtml = `
            <div style="width:20px;height:20px;border-radius:50%;background:#00b4d8;position:absolute;left:7px;top:11px;opacity:0.4;"></div>
            <div style="width:20px;height:20px;border-radius:50%;background:#00ffa8;position:absolute;left:14px;top:11px;"></div>
          `;
        } else if (it.id === "exclude") {
          previewHtml = `
            <div style="width:20px;height:20px;border-radius:50%;background:#00b4d8;position:absolute;left:7px;top:11px;"></div>
            <div style="width:16px;height:16px;border-radius:50%;background:#181b28;position:absolute;left:17px;top:13px;"></div>
          `;
        } else {
          previewHtml = `
            <div class="am-blend-prev-c1"></div>
            <div class="am-blend-prev-c2" style="mix-blend-mode:${it.mode};"></div>
          `;
        }

        itemEl.innerHTML = `
          <div class="am-blend-mode-thumb">${previewHtml}</div>
          <div class="am-blend-mode-label">${it.name}</div>
        `;

        itemEl.addEventListener("click", (e) => {
          e.stopPropagation();
          activeBlendId = it.id;
          layer.blendMode = it.id;
          layer.userTouched = true;

          contentEl.querySelectorAll(".am-blend-mode-item").forEach(x => x.classList.remove("active"));
          itemEl.classList.add("active");

          catContainer.querySelectorAll(".am-blend-cat-card").forEach(c => {
            const selEl = c.querySelector(".am-blend-cat-selected");
            const chkEl = c.querySelector(".am-blend-cat-check");
            if (c === card) {
              c.classList.add("active-cat");
              if (selEl) selEl.textContent = it.name;
              if (chkEl) chkEl.style.display = "";
            } else {
              c.classList.remove("active-cat");
              if (selEl) selEl.textContent = "";
              if (chkEl) chkEl.style.display = "none";
            }
          });

          I.V = true;
          if (I.val2) I.val2.renderAt(I.H);
          if (I.bind4) I.bind4();
          if (I.omScheduleSave) I.omScheduleSave();
        });

        modeList.appendChild(itemEl);
      });

      card.appendChild(header);
      card.appendChild(modeList);
      catContainer.appendChild(card);
    });
  }

  function renderColorFill(contentEl, layer) {
    const I = window.__AM_INTERNAL || {};

    const swatches = [
      "#ffffff", "#000000", "#808080", "#c0c0c0",
      "#ff3b30", "#ff9500", "#ffcc00", "#34c759",
      "#00ffa8", "#00c7be", "#30b0c7", "#007aff",
      "#5856d6", "#af52de", "#ff2d55", "#a2845e"
    ];

    function parseColor(c) {
      if (!c) return { r: 0, g: 255, b: 168, a: 1 };
      if (Array.isArray(c)) {
        return {
          r: Math.round(Math.max(0, Math.min(1, c[0] || 0)) * 255),
          g: Math.round(Math.max(0, Math.min(1, c[1] || 0)) * 255),
          b: Math.round(Math.max(0, Math.min(1, c[2] || 0)) * 255),
          a: c[3] === undefined ? 1 : Math.max(0, Math.min(1, c[3]))
        };
      }
      if (typeof c === "string") {
        let hex = c.trim().replace(/^#/, "");
        if (hex.length === 3) hex = hex.split("").map(x => x + x).join("") + "ff";
        else if (hex.length === 6) hex += "ff";
        if (hex.length === 8) {
          return {
            r: parseInt(hex.slice(0, 2), 16) || 0,
            g: parseInt(hex.slice(2, 4), 16) || 0,
            b: parseInt(hex.slice(4, 6), 16) || 0,
            a: (parseInt(hex.slice(6, 8), 16) || 255) / 255
          };
        }
      }
      return { r: 0, g: 255, b: 168, a: 1 };
    }

    function rgbaToHex(r, g, b, a) {
      const hR = Math.round(r).toString(16).padStart(2, "0");
      const hG = Math.round(g).toString(16).padStart(2, "0");
      const hB = Math.round(b).toString(16).padStart(2, "0");
      const alphaVal = a === undefined ? 1 : a;
      if (alphaVal >= 0.999) return `#${hR}${hG}${hB}`;
      const hA = Math.round(Math.max(0, Math.min(1, alphaVal)) * 255).toString(16).padStart(2, "0");
      return `#${hR}${hG}${hB}${hA}`;
    }

    function colorToCss(c) {
      const p = parseColor(c);
      return `rgba(${p.r}, ${p.g}, ${p.b}, ${p.a.toFixed(3)})`;
    }

    function colorToHexStr(c) {
      const p = parseColor(c);
      return rgbaToHex(p.r, p.g, p.b, p.a);
    }

    function resolveMediaSrc(l) {
      if (l.mediaUrl) return l.mediaUrl;
      const key = l.fillImage || l.fillVideo || l.src;
      if (I.val2 && I.val2.images && key) {
        const el = I.val2.images.get(key);
        if (el && el.src) return el.src;
      }
      return "";
    }

    let activeTab = "solid";
    if (layer.fillType === "media") activeTab = "media";
    else if (layer.fillType === "gradient") {
      activeTab = (layer.gradient && layer.gradient.type === "radial") ? "radial" : "linear";
    }

    let currentColor = parseColor(layer.color || layer.fillColor || "#00ffa8");

    let gradStart = (layer.gradient && layer.gradient.start) ? [...layer.gradient.start] : (activeTab === "radial" ? [0.5, 0.5] : [0, 0.5]);
    let gradEnd = (layer.gradient && layer.gradient.end) ? [...layer.gradient.end] : (activeTab === "radial" ? [1, 0.5] : [1, 0.5]);
    let gradColor1 = (layer.gradient && layer.gradient.startColor) ? parseColor(layer.gradient.startColor) : { ...currentColor };
    let gradColor2 = (layer.gradient && layer.gradient.endColor) ? parseColor(layer.gradient.endColor) : { r: 0, g: 85, b: 255, a: 1 };
    let activeGradStop = 1;

    let mediaFillMode = layer.mediaFillMode || "fill";

    function commitChanges() {
      I.V = true;
      if (I.val2 && I.val2.renderAt) I.val2.renderAt(I.H);
      if (I.omScheduleSave) I.omScheduleSave();
    }

    function applySolidColor() {
      layer.fillType = "color";
      const hex = rgbaToHex(currentColor.r, currentColor.g, currentColor.b, currentColor.a);
      layer.color = hex;
      layer.fillColor = [currentColor.r / 255, currentColor.g / 255, currentColor.b / 255, currentColor.a];
      commitChanges();
    }

    function applyGradient() {
      layer.fillType = "gradient";
      const c1Arr = [gradColor1.r / 255, gradColor1.g / 255, gradColor1.b / 255, gradColor1.a];
      const c2Arr = [gradColor2.r / 255, gradColor2.g / 255, gradColor2.b / 255, gradColor2.a];
      layer.gradient = {
        type: activeTab === "radial" ? "radial" : "linear",
        start: [...gradStart],
        end: [...gradEnd],
        startColor: c1Arr,
        endColor: c2Arr,
        stops: [
          { t: 0, color: c1Arr },
          { t: 1, color: c2Arr }
        ]
      };
      commitChanges();
    }

    async function triggerEyeDropper(cb) {
      if (window.EyeDropper) {
        try {
          const ed = new window.EyeDropper();
          const res = await ed.open();
          if (res && res.sRGBHex) {
            cb(res.sRGBHex);
          }
        } catch (e) {}
      } else {
        const dummyPicker = document.createElement("input");
        dummyPicker.type = "color";
        dummyPicker.onchange = (e) => cb(e.target.value);
        dummyPicker.click();
      }
    }

    function checkHasKeyframe() {
      const keyable = layer.fillColorKeyable || (layer.transform && layer.transform.fillColor);
      const tSec = ((I.H || 0) / 1000);
      return !!(keyable && keyable.kfs && keyable.kfs.some(k => Math.abs(Number(k.t) - tSec) < 0.002));
    }

    function renderView() {
      const activeColorObj = activeTab === "solid" ? currentColor : (activeGradStop === 1 ? gradColor1 : gradColor2);
      const activeHexStr = colorToHexStr(activeColorObj);
      const hasKf = checkHasKeyframe();

      contentEl.innerHTML = `
        <div class="am-cf-root">
          <!-- Left Rail (fragment_settings_base.xml) -->
          <div class="am-cf-sidebar-left">
            <button type="button" id="am-cf-btn-back" class="am-vol-side-btn" title="Kembali">
              <img src="./icons/ac_ic_back.svg" alt="Back">
            </button>
            <button type="button" id="am-cf-btn-kf" class="am-vol-side-btn ${hasKf ? 'active' : ''}" title="${hasKf ? 'Hapus Keyframe' : 'Tambah Keyframe'}">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="${hasKf ? '#00ffa8' : 'none'}" stroke="${hasKf ? '#00ffa8' : '#fff'}" stroke-width="2">
                <path d="M12 2L4 12l8 10 8-10L12 2z"/>
              </svg>
            </button>
            <button type="button" id="am-cf-btn-curve" class="am-vol-side-btn" title="Kurva Easing">
              <img src="./icons/ac_ic_anim_curve.svg" alt="Curve">
            </button>
            <div style="flex:1;"></div>
          </div>

          <!-- Center Content (fragment_color_and_fill.xml) -->
          <div class="am-cf-center">
            <!-- tab_holder (CardView with 4 icon buttons) -->
            <div class="am-cf-tab-holder" id="tab_holder">
              <button type="button" class="am-cf-tab-btn ${layer.fillType === 'none' ? 'active' : ''}" id="btn_none" data-tab="none" title="Tanpa Isi">
                <img src="./icons/ic_none.svg" alt="None">
              </button>
              <button type="button" class="am-cf-tab-btn ${activeTab === 'solid' && layer.fillType !== 'none' ? 'active' : ''}" id="btn_fill" data-tab="solid" title="Warna Solid">
                <img src="./icons/ic_tab_fill.svg" alt="Solid">
              </button>
              <button type="button" class="am-cf-tab-btn ${(activeTab === 'linear' || activeTab === 'radial') && layer.fillType !== 'none' ? 'active' : ''}" id="btn_gradation" data-tab="linear" title="Gradien">
                <img src="./icons/ic_tab_gradation.svg" alt="Gradien">
              </button>
              <button type="button" class="am-cf-tab-btn ${activeTab === 'media' && layer.fillType !== 'none' ? 'active' : ''}" id="btn_media" data-tab="media" title="Media / Gambar / Video">
                <img src="./icons/ic_tab_media.svg" alt="Media">
              </button>
              <button type="button" class="am-cf-tab-btn ${activeTab === 'intrinsic' && layer.fillType !== 'none' ? 'active' : ''}" id="btn_intrinsic" data-tab="intrinsic" title="Warna Asli">
                <img src="./icons/ac_ic_groupelements.svg" alt="Intrinsic">
              </button>
            </div>

            ${layer.fillType === 'none' ? `
              <!-- None View: none_view in fragment_color_and_fill.xml -->
              <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;padding:36px 16px;color:#8c93a7;">
                <img src="./icons/ic_none.svg" style="width:48px;height:48px;opacity:0.35;">
                <span style="font-size:13px;font-weight:600;">Tanpa Isi (Transparan)</span>
              </div>
            ` : activeTab === 'solid' ? renderSolidSection(activeHexStr, activeColorObj) :
              activeTab === 'linear' ? renderLinearSection(activeHexStr, activeColorObj) :
              activeTab === 'radial' ? renderRadialSection(activeHexStr, activeColorObj) :
              activeTab === 'intrinsic' ? renderIntrinsicSection() :
              renderMediaSection()}
          </div>
        </div>
      `;

      bindViewEvents();
    }

    function renderIntrinsicSection() {
      return `
        <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;padding:36px 16px;color:#8c93a7;">
          <img src="./icons/ac_ic_groupelements.svg" style="width:48px;height:48px;opacity:0.4;">
          <span style="font-size:13px;font-weight:600;">Warna Asli Elemen</span>
        </div>
      `;
    }

    function renderSolidSection(hexStr, col) {
      return `
        <div style="display:flex;flex-direction:column;gap:12px;">
          <div class="am-cf-top-bar">
            <div class="am-cf-color-preview-wrap">
              <div class="am-cf-color-preview" style="background:${colorToCss(col)};"></div>
            </div>
            <input type="text" id="am-cf-hex-input" class="am-cf-hex-input" value="${hexStr}">
            <button id="am-cf-spoid-btn" class="am-cf-icon-btn" title="Pipet Warna (EyeDropper)">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="m14 7 3 3m-9.5 7.5L3 21l3.5-4.5M14 7l-9 9 2 2 9-9-2-2Zm0 0 2.5-2.5a2.121 2.121 0 0 1 3 3L17 10"/>
              </svg>
            </button>
          </div>

          <div style="font-size:11px;font-weight:700;color:var(--am-p5);text-transform:uppercase;">Palet Warna</div>
          <div class="am-palette-grid" id="am-cf-swatches">
            ${swatches.map(hex => `
              <div class="am-palette-chip ${hex.toLowerCase() === hexStr.slice(0, 7).toLowerCase() ? 'active' : ''}" data-color="${hex}" style="background:${hex};"></div>
            `).join('')}
          </div>

          <div style="display:flex;flex-direction:column;gap:10px;margin-top:4px;">
            <div class="am-cf-slider-row">
              <div class="am-cf-slider-header">
                <span>Merah (R)</span>
                <span id="am-cf-r-val" class="am-cf-slider-val">${col.r}</span>
              </div>
              <input type="range" id="am-cf-r" min="0" max="255" value="${col.r}" class="am-cf-range am-cf-range-r">
            </div>

            <div class="am-cf-slider-row">
              <div class="am-cf-slider-header">
                <span>Hijau (G)</span>
                <span id="am-cf-g-val" class="am-cf-slider-val">${col.g}</span>
              </div>
              <input type="range" id="am-cf-g" min="0" max="255" value="${col.g}" class="am-cf-range am-cf-range-g">
            </div>

            <div class="am-cf-slider-row">
              <div class="am-cf-slider-header">
                <span>Biru (B)</span>
                <span id="am-cf-b-val" class="am-cf-slider-val">${col.b}</span>
              </div>
              <input type="range" id="am-cf-b" min="0" max="255" value="${col.b}" class="am-cf-range am-cf-range-b">
            </div>

            <div class="am-cf-slider-row">
              <div class="am-cf-slider-header">
                <span>Opasitas (Alpha)</span>
                <span id="am-cf-a-val" class="am-cf-slider-val">${Math.round(col.a * 100)}%</span>
              </div>
              <input type="range" id="am-cf-a" min="0" max="100" value="${Math.round(col.a * 100)}" class="am-cf-range am-cf-range-a">
            </div>
          </div>
        </div>
      `;
    }

    function renderLinearSection(hexStr, col) {
      const gradCss = `linear-gradient(to right, ${colorToCss(gradColor1)}, ${colorToCss(gradColor2)})`;
      return `
        <div style="display:flex;flex-direction:column;gap:12px;">
          <div class="am-cf-stops-container">
            <div class="am-cf-stop-card ${activeGradStop === 1 ? 'active' : ''}" id="am-cf-stop-1">
              <div class="am-cf-stop-chip" style="background:${colorToCss(gradColor1)};"></div>
              <div class="am-cf-stop-info">
                <span class="am-cf-stop-title">Titik 1 (Mulai)</span>
                <span class="am-cf-stop-hex">${colorToHexStr(gradColor1)}</span>
              </div>
            </div>

            <button id="am-cf-swap-btn" class="am-cf-swap-btn" title="Tukar Warna">⇄</button>

            <div class="am-cf-stop-card ${activeGradStop === 2 ? 'active' : ''}" id="am-cf-stop-2">
              <div class="am-cf-stop-chip" style="background:${colorToCss(gradColor2)};"></div>
              <div class="am-cf-stop-info">
                <span class="am-cf-stop-title">Titik 2 (Akhir)</span>
                <span class="am-cf-stop-hex">${colorToHexStr(gradColor2)}</span>
              </div>
            </div>
          </div>

          <div class="am-cf-bar-preview" style="background:${gradCss};"></div>

          <div style="display:flex;flex-direction:column;gap:6px;">
            <div style="display:flex;justify-content:space-between;align-items:center;">
              <span style="font-size:11px;font-weight:700;color:var(--am-p5);text-transform:uppercase;">Arah Gradien</span>
            </div>
            <div style="display:flex;gap:6px;">
              <button class="am-crop-btn am-cf-dir-btn" data-sx="0" data-sy="0.5" data-ex="1" data-ey="0.5" style="flex:1;padding:6px;font-size:11px;background:#181b2a;color:#fff;border:1px solid rgba(255,255,255,0.08);border-radius:6px;cursor:pointer;">Horizontal →</button>
              <button class="am-crop-btn am-cf-dir-btn" data-sx="0.5" data-sy="0" data-ex="0.5" data-ey="1" style="flex:1;padding:6px;font-size:11px;background:#181b2a;color:#fff;border:1px solid rgba(255,255,255,0.08);border-radius:6px;cursor:pointer;">Vertikal ↓</button>
              <button class="am-crop-btn am-cf-dir-btn" data-sx="0" data-sy="0" data-ex="1" data-ey="1" style="flex:1;padding:6px;font-size:11px;background:#181b2a;color:#fff;border:1px solid rgba(255,255,255,0.08);border-radius:6px;cursor:pointer;">Diagonal ↘</button>
              <button class="am-crop-btn am-cf-dir-btn" data-sx="0" data-sy="1" data-ex="1" data-ey="0" style="flex:1;padding:6px;font-size:11px;background:#181b2a;color:#fff;border:1px solid rgba(255,255,255,0.08);border-radius:6px;cursor:pointer;">Diagonal ↗</button>
            </div>
          </div>

          <div style="display:flex;gap:10px;">
            <div style="flex:1;display:flex;flex-direction:column;gap:4px;">
              <div style="display:flex;justify-content:space-between;">
                <span style="font-size:10px;font-weight:700;color:#8c93a7;">POSISI X (START)</span>
                <span id="am-cf-sx-val" style="font-size:11px;color:var(--am-y1);font-family:monospace;">${Math.round(gradStart[0] * 100)}%</span>
              </div>
              <input type="range" id="am-cf-sx" min="0" max="100" value="${Math.round(gradStart[0] * 100)}" class="am-cf-range">
            </div>
            <div style="flex:1;display:flex;flex-direction:column;gap:4px;">
              <div style="display:flex;justify-content:space-between;">
                <span style="font-size:10px;font-weight:700;color:#8c93a7;">POSISI X (END)</span>
                <span id="am-cf-ex-val" style="font-size:11px;color:var(--am-y1);font-family:monospace;">${Math.round(gradEnd[0] * 100)}%</span>
              </div>
              <input type="range" id="am-cf-ex" min="0" max="100" value="${Math.round(gradEnd[0] * 100)}" class="am-cf-range">
            </div>
          </div>

          <div style="font-size:11px;font-weight:700;color:var(--am-p5);text-transform:uppercase;margin-top:4px;">
            Warna Titik ${activeGradStop}
          </div>
          <div class="am-cf-top-bar">
            <div class="am-cf-color-preview-wrap">
              <div class="am-cf-color-preview" style="background:${colorToCss(col)};"></div>
            </div>
            <input type="text" id="am-cf-hex-input" class="am-cf-hex-input" value="${hexStr}">
            <button id="am-cf-spoid-btn" class="am-cf-icon-btn" title="Pipet Warna (EyeDropper)">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="m14 7 3 3m-9.5 7.5L3 21l3.5-4.5M14 7l-9 9 2 2 9-9-2-2Zm0 0 2.5-2.5a2.121 2.121 0 0 1 3 3L17 10"/>
              </svg>
            </button>
          </div>

          <div class="am-palette-grid" id="am-cf-swatches">
            ${swatches.map(hex => `
              <div class="am-palette-chip ${hex.toLowerCase() === hexStr.slice(0, 7).toLowerCase() ? 'active' : ''}" data-color="${hex}" style="background:${hex};"></div>
            `).join('')}
          </div>

          <div style="display:flex;flex-direction:column;gap:8px;margin-top:2px;">
            <div class="am-cf-slider-row">
              <div class="am-cf-slider-header">
                <span>Merah (R)</span>
                <span id="am-cf-r-val" class="am-cf-slider-val">${col.r}</span>
              </div>
              <input type="range" id="am-cf-r" min="0" max="255" value="${col.r}" class="am-cf-range am-cf-range-r">
            </div>
            <div class="am-cf-slider-row">
              <div class="am-cf-slider-header">
                <span>Hijau (G)</span>
                <span id="am-cf-g-val" class="am-cf-slider-val">${col.g}</span>
              </div>
              <input type="range" id="am-cf-g" min="0" max="255" value="${col.g}" class="am-cf-range am-cf-range-g">
            </div>
            <div class="am-cf-slider-row">
              <div class="am-cf-slider-header">
                <span>Biru (B)</span>
                <span id="am-cf-b-val" class="am-cf-slider-val">${col.b}</span>
              </div>
              <input type="range" id="am-cf-b" min="0" max="255" value="${col.b}" class="am-cf-range am-cf-range-b">
            </div>
            <div class="am-cf-slider-row">
              <div class="am-cf-slider-header">
                <span>Opasitas (Alpha)</span>
                <span id="am-cf-a-val" class="am-cf-slider-val">${Math.round(col.a * 100)}%</span>
              </div>
              <input type="range" id="am-cf-a" min="0" max="100" value="${Math.round(col.a * 100)}" class="am-cf-range am-cf-range-a">
            </div>
          </div>
        </div>
      `;
    }

    function renderRadialSection(hexStr, col) {
      const gradCss = `radial-gradient(circle, ${colorToCss(gradColor1)} 0%, ${colorToCss(gradColor2)} 100%)`;
      const curRadius = Math.round(Math.hypot(gradEnd[0] - gradStart[0], gradEnd[1] - gradStart[1]) * 100) || 50;
      return `
        <div style="display:flex;flex-direction:column;gap:12px;">
          <div class="am-cf-stops-container">
            <div class="am-cf-stop-card ${activeGradStop === 1 ? 'active' : ''}" id="am-cf-stop-1">
              <div class="am-cf-stop-chip" style="background:${colorToCss(gradColor1)};"></div>
              <div class="am-cf-stop-info">
                <span class="am-cf-stop-title">Pusat (Dalam)</span>
                <span class="am-cf-stop-hex">${colorToHexStr(gradColor1)}</span>
              </div>
            </div>

            <button id="am-cf-swap-btn" class="am-cf-swap-btn" title="Tukar Warna">⇄</button>

            <div class="am-cf-stop-card ${activeGradStop === 2 ? 'active' : ''}" id="am-cf-stop-2">
              <div class="am-cf-stop-chip" style="background:${colorToCss(gradColor2)};"></div>
              <div class="am-cf-stop-info">
                <span class="am-cf-stop-title">Tepi (Luar)</span>
                <span class="am-cf-stop-hex">${colorToHexStr(gradColor2)}</span>
              </div>
            </div>
          </div>

          <div class="am-cf-bar-preview" style="background:${gradCss};"></div>

          <div style="display:flex;flex-direction:column;gap:8px;">
            <div style="display:flex;gap:10px;">
              <div style="flex:1;display:flex;flex-direction:column;gap:4px;">
                <div style="display:flex;justify-content:space-between;">
                  <span style="font-size:10px;font-weight:700;color:#8c93a7;">PUSAT X</span>
                  <span id="am-cf-cx-val" style="font-size:11px;color:var(--am-y1);font-family:monospace;">${Math.round(gradStart[0] * 100)}%</span>
                </div>
                <input type="range" id="am-cf-cx" min="0" max="100" value="${Math.round(gradStart[0] * 100)}" class="am-cf-range">
              </div>
              <div style="flex:1;display:flex;flex-direction:column;gap:4px;">
                <div style="display:flex;justify-content:space-between;">
                  <span style="font-size:10px;font-weight:700;color:#8c93a7;">PUSAT Y</span>
                  <span id="am-cf-cy-val" style="font-size:11px;color:var(--am-y1);font-family:monospace;">${Math.round(gradStart[1] * 100)}%</span>
                </div>
                <input type="range" id="am-cf-cy" min="0" max="100" value="${Math.round(gradStart[1] * 100)}" class="am-cf-range">
              </div>
            </div>

            <div class="am-cf-slider-row">
              <div class="am-cf-slider-header">
                <span>Jari-jari (Radius)</span>
                <span id="am-cf-rad-val" class="am-cf-slider-val">${curRadius}%</span>
              </div>
              <input type="range" id="am-cf-rad" min="10" max="150" value="${curRadius}" class="am-cf-range">
            </div>
          </div>

          <div style="font-size:11px;font-weight:700;color:var(--am-p5);text-transform:uppercase;margin-top:4px;">
            Warna Titik ${activeGradStop === 1 ? 'Pusat' : 'Tepi'}
          </div>
          <div class="am-cf-top-bar">
            <div class="am-cf-color-preview-wrap">
              <div class="am-cf-color-preview" style="background:${colorToCss(col)};"></div>
            </div>
            <input type="text" id="am-cf-hex-input" class="am-cf-hex-input" value="${hexStr}">
            <button id="am-cf-spoid-btn" class="am-cf-icon-btn" title="Pipet Warna (EyeDropper)">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="m14 7 3 3m-9.5 7.5L3 21l3.5-4.5M14 7l-9 9 2 2 9-9-2-2Zm0 0 2.5-2.5a2.121 2.121 0 0 1 3 3L17 10"/>
              </svg>
            </button>
          </div>

          <div class="am-palette-grid" id="am-cf-swatches">
            ${swatches.map(hex => `
              <div class="am-palette-chip ${hex.toLowerCase() === hexStr.slice(0, 7).toLowerCase() ? 'active' : ''}" data-color="${hex}" style="background:${hex};"></div>
            `).join('')}
          </div>

          <div style="display:flex;flex-direction:column;gap:8px;margin-top:2px;">
            <div class="am-cf-slider-row">
              <div class="am-cf-slider-header">
                <span>Merah (R)</span>
                <span id="am-cf-r-val" class="am-cf-slider-val">${col.r}</span>
              </div>
              <input type="range" id="am-cf-r" min="0" max="255" value="${col.r}" class="am-cf-range am-cf-range-r">
            </div>
            <div class="am-cf-slider-row">
              <div class="am-cf-slider-header">
                <span>Hijau (G)</span>
                <span id="am-cf-g-val" class="am-cf-slider-val">${col.g}</span>
              </div>
              <input type="range" id="am-cf-g" min="0" max="255" value="${col.g}" class="am-cf-range am-cf-range-g">
            </div>
            <div class="am-cf-slider-row">
              <div class="am-cf-slider-header">
                <span>Biru (B)</span>
                <span id="am-cf-b-val" class="am-cf-slider-val">${col.b}</span>
              </div>
              <input type="range" id="am-cf-b" min="0" max="255" value="${col.b}" class="am-cf-range am-cf-range-b">
            </div>
            <div class="am-cf-slider-row">
              <div class="am-cf-slider-header">
                <span>Opasitas (Alpha)</span>
                <span id="am-cf-a-val" class="am-cf-slider-val">${Math.round(col.a * 100)}%</span>
              </div>
              <input type="range" id="am-cf-a" min="0" max="100" value="${Math.round(col.a * 100)}" class="am-cf-range am-cf-range-a">
            </div>
          </div>
        </div>
      `;
    }

    function renderMediaSection() {
      const mediaSrc = resolveMediaSrc(layer);
      const isVideo = (layer.fillVideo || (layer.mediaUrl && /\.(mp4|webm|mov)$/i.test(layer.mediaUrl)));
      const hasMedia = !!(mediaSrc || layer.fillImage || layer.fillVideo);
      const mediaTitle = layer.fillImage || layer.fillVideo || layer.label || "Media lokal";

      return `
        <div class="am-cf-media-box">
          ${hasMedia ? `
            <div class="am-cf-media-preview-card">
              ${isVideo ? `
                <video src="${mediaSrc}" autoplay muted loop style="max-height:100%;max-width:100%;object-fit:contain;"></video>
              ` : `
                <img src="${mediaSrc}" style="max-height:100%;max-width:100%;object-fit:contain;" onerror="this.style.display='none'">
              `}
              <div style="position:absolute;bottom:0;left:0;right:0;background:linear-gradient(transparent, rgba(0,0,0,0.85));padding:8px 10px;display:flex;justify-content:space-between;align-items:center;">
                <span style="font-size:11px;font-weight:600;color:#fff;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:200px;">${mediaTitle}</span>
                <span style="font-size:10px;padding:2px 6px;border-radius:4px;background:rgba(0,255,168,0.2);color:var(--am-y1);font-weight:700;">${isVideo ? 'VIDEO' : 'GAMBAR'}</span>
              </div>
            </div>

            <div style="display:flex;gap:8px;">
              <button id="am-cf-change-media-btn" class="am-grid-btn" style="flex:1;flex-direction:row;justify-content:center;height:42px;">
                <img src="./icons/ic_tab_media.svg" style="width:18px;height:18px;">
                <span>Ganti Media</span>
              </button>
            </div>

            <div style="display:flex;flex-direction:column;gap:6px;">
              <span style="font-size:11px;font-weight:700;color:var(--am-p5);text-transform:uppercase;">Skala Media</span>
              <div class="am-cf-media-actions">
                <button class="am-cf-crop-btn ${mediaFillMode === 'fill' ? 'active' : ''}" data-mode="fill">Fill (Isi)</button>
                <button class="am-cf-crop-btn ${mediaFillMode === 'fit' ? 'active' : ''}" data-mode="fit">Fit (Pas)</button>
                <button class="am-cf-crop-btn ${mediaFillMode === 'stretch' ? 'active' : ''}" data-mode="stretch">Stretch (Regang)</button>
              </div>
            </div>
          ` : `
            <div style="background:#181b2a;border:2px dashed rgba(255,255,255,0.1);border-radius:12px;padding:30px 20px;text-align:center;display:flex;flex-direction:column;align-items:center;gap:12px;">
              <img src="./icons/ic_tab_media.svg" style="width:40px;height:40px;opacity:0.6;">
              <div style="font-size:13px;font-weight:600;color:#fff;">Belum Ada Media Dipilih</div>
              <div style="font-size:11px;color:#8c93a7;">Pilih gambar atau video dari perangkat Anda untuk mengisi layer ini.</div>
              <button id="am-cf-change-media-btn" class="am-grid-btn" style="flex-direction:row;justify-content:center;height:42px;width:100%;max-width:240px;margin-top:6px;">
                <img src="./icons/ic_tab_media.svg" style="width:18px;height:18px;">
                <span>Pilih Foto / Video</span>
              </button>
            </div>
          `}
        </div>
      `;
    }

    function bindViewEvents() {
      const btnBack = contentEl.querySelector("#am-cf-btn-back");
      if (btnBack) {
        btnBack.onclick = () => {
          const subpanel = document.getElementById("am-subpanel-container");
          if (subpanel) subpanel.classList.remove("open");
          const ep = document.getElementById("am-element-edit-panel");
          if (ep) ep.style.display = "flex";
        };
      }

      const btnKf = contentEl.querySelector("#am-cf-btn-kf");
      if (btnKf) {
        btnKf.onclick = () => {
          if (checkHasKeyframe()) {
            if (I.omKfRemoveAt) I.omKfRemoveAt("color", layer);
            else if (typeof window.omKfRemoveAt === "function") window.omKfRemoveAt("color", layer);
          } else {
            if (I.omKfInsert) I.omKfInsert("color", layer);
            else if (typeof window.omKfInsert === "function") window.omKfInsert("color", layer);
          }
          renderView();
        };
      }

      const btnCurve = contentEl.querySelector("#am-cf-btn-curve");
      if (btnCurve) {
        btnCurve.onclick = () => {
          if (typeof window.omOpenCurveEditor === "function") {
            window.omOpenCurveEditor({
              prop: "color",
              layer,
              title: "WARNA & ISI",
              onBack: () => openSubpanel("Warna & Isi", renderColorFill)
            });
          }
        };
      }

      contentEl.querySelectorAll(".am-cf-tab-btn").forEach(btn => {
        btn.addEventListener("click", () => {
          const t = btn.dataset.tab;
          if (t === "none") {
            layer.fillType = "none";
            commitChanges();
            renderView();
            return;
          }
          if (layer.fillType === "none") {
            layer.fillType = (t === "media") ? "media" : (t === "linear" || t === "radial") ? "gradient" : "color";
          }
          activeTab = t;
          if (activeTab === "solid") {
            applySolidColor();
          } else if (activeTab === "linear" || activeTab === "radial") {
            applyGradient();
          } else if (activeTab === "media") {
            layer.fillType = "media";
            commitChanges();
          } else if (activeTab === "intrinsic") {
            layer.fillType = "intrinsic";
            commitChanges();
          }
          renderView();
        });
      });


      const hexInput = contentEl.querySelector("#am-cf-hex-input");
      if (hexInput) {
        hexInput.addEventListener("change", (e) => {
          const val = e.target.value.trim();
          const parsed = parseColor(val);
          if (activeTab === "solid") {
            currentColor = parsed;
            applySolidColor();
          } else {
            if (activeGradStop === 1) gradColor1 = parsed;
            else gradColor2 = parsed;
            applyGradient();
          }
          renderView();
        });
      }

      const spoidBtn = contentEl.querySelector("#am-cf-spoid-btn");
      if (spoidBtn) {
        spoidBtn.addEventListener("click", () => {
          triggerEyeDropper((hex) => {
            const parsed = parseColor(hex);
            if (activeTab === "solid") {
              currentColor = parsed;
              applySolidColor();
            } else {
              if (activeGradStop === 1) gradColor1 = parsed;
              else gradColor2 = parsed;
              applyGradient();
            }
            renderView();
          });
        });
      }

      contentEl.querySelectorAll("#am-cf-swatches .am-palette-chip").forEach(chip => {
        chip.addEventListener("click", () => {
          const hex = chip.dataset.color;
          const parsed = parseColor(hex);
          if (activeTab === "solid") {
            currentColor.r = parsed.r;
            currentColor.g = parsed.g;
            currentColor.b = parsed.b;
            applySolidColor();
          } else {
            if (activeGradStop === 1) {
              gradColor1.r = parsed.r;
              gradColor1.g = parsed.g;
              gradColor1.b = parsed.b;
            } else {
              gradColor2.r = parsed.r;
              gradColor2.g = parsed.g;
              gradColor2.b = parsed.b;
            }
            applyGradient();
          }
          renderView();
        });
      });

      const rSlider = contentEl.querySelector("#am-cf-r");
      const gSlider = contentEl.querySelector("#am-cf-g");
      const bSlider = contentEl.querySelector("#am-cf-b");
      const aSlider = contentEl.querySelector("#am-cf-a");

      function updateActiveColorFromSliders() {
        const target = activeTab === "solid" ? currentColor : (activeGradStop === 1 ? gradColor1 : gradColor2);
        if (rSlider) target.r = parseInt(rSlider.value, 10);
        if (gSlider) target.g = parseInt(gSlider.value, 10);
        if (bSlider) target.b = parseInt(bSlider.value, 10);
        if (aSlider) target.a = parseInt(aSlider.value, 10) / 100;

        const rVal = contentEl.querySelector("#am-cf-r-val");
        const gVal = contentEl.querySelector("#am-cf-g-val");
        const bVal = contentEl.querySelector("#am-cf-b-val");
        const aVal = contentEl.querySelector("#am-cf-a-val");
        if (rVal) rVal.textContent = target.r;
        if (gVal) gVal.textContent = target.g;
        if (bVal) bVal.textContent = target.b;
        if (aVal) aVal.textContent = Math.round(target.a * 100) + "%";

        const previewEl = contentEl.querySelector(".am-cf-color-preview");
        if (previewEl) previewEl.style.background = colorToCss(target);
        if (hexInput) hexInput.value = colorToHexStr(target);

        if (activeTab === "solid") {
          applySolidColor();
        } else {
          applyGradient();
          const barPreview = contentEl.querySelector(".am-cf-bar-preview");
          if (barPreview) {
            barPreview.style.background = activeTab === "radial"
              ? `radial-gradient(circle, ${colorToCss(gradColor1)} 0%, ${colorToCss(gradColor2)} 100%)`
              : `linear-gradient(to right, ${colorToCss(gradColor1)}, ${colorToCss(gradColor2)})`;
          }
          const stop1Chip = contentEl.querySelector("#am-cf-stop-1 .am-cf-stop-chip");
          const stop2Chip = contentEl.querySelector("#am-cf-stop-2 .am-cf-stop-chip");
          if (stop1Chip) stop1Chip.style.background = colorToCss(gradColor1);
          if (stop2Chip) stop2Chip.style.background = colorToCss(gradColor2);
        }
      }

      if (rSlider) rSlider.addEventListener("input", updateActiveColorFromSliders);
      if (gSlider) gSlider.addEventListener("input", updateActiveColorFromSliders);
      if (bSlider) bSlider.addEventListener("input", updateActiveColorFromSliders);
      if (aSlider) aSlider.addEventListener("input", updateActiveColorFromSliders);

      const stop1Card = contentEl.querySelector("#am-cf-stop-1");
      const stop2Card = contentEl.querySelector("#am-cf-stop-2");
      if (stop1Card) {
        stop1Card.addEventListener("click", () => {
          activeGradStop = 1;
          renderView();
        });
      }
      if (stop2Card) {
        stop2Card.addEventListener("click", () => {
          activeGradStop = 2;
          renderView();
        });
      }

      const swapBtn = contentEl.querySelector("#am-cf-swap-btn");
      if (swapBtn) {
        swapBtn.addEventListener("click", () => {
          const tmp = { ...gradColor1 };
          gradColor1 = { ...gradColor2 };
          gradColor2 = tmp;
          applyGradient();
          renderView();
        });
      }

      contentEl.querySelectorAll(".am-cf-dir-btn").forEach(btn => {
        btn.addEventListener("click", () => {
          gradStart = [parseFloat(btn.dataset.sx), parseFloat(btn.dataset.sy)];
          gradEnd = [parseFloat(btn.dataset.ex), parseFloat(btn.dataset.ey)];
          applyGradient();
          renderView();
        });
      });

      const sxSlider = contentEl.querySelector("#am-cf-sx");
      const exSlider = contentEl.querySelector("#am-cf-ex");
      if (sxSlider) {
        sxSlider.addEventListener("input", (e) => {
          gradStart[0] = parseInt(e.target.value, 10) / 100;
          const valEl = contentEl.querySelector("#am-cf-sx-val");
          if (valEl) valEl.textContent = e.target.value + "%";
          applyGradient();
        });
      }
      if (exSlider) {
        exSlider.addEventListener("input", (e) => {
          gradEnd[0] = parseInt(e.target.value, 10) / 100;
          const valEl = contentEl.querySelector("#am-cf-ex-val");
          if (valEl) valEl.textContent = e.target.value + "%";
          applyGradient();
        });
      }

      const cxSlider = contentEl.querySelector("#am-cf-cx");
      const cySlider = contentEl.querySelector("#am-cf-cy");
      const radSlider = contentEl.querySelector("#am-cf-rad");
      if (cxSlider) {
        cxSlider.addEventListener("input", (e) => {
          gradStart[0] = parseInt(e.target.value, 10) / 100;
          const valEl = contentEl.querySelector("#am-cf-cx-val");
          if (valEl) valEl.textContent = e.target.value + "%";
          applyGradient();
        });
      }
      if (cySlider) {
        cySlider.addEventListener("input", (e) => {
          gradStart[1] = parseInt(e.target.value, 10) / 100;
          const valEl = contentEl.querySelector("#am-cf-cy-val");
          if (valEl) valEl.textContent = e.target.value + "%";
          applyGradient();
        });
      }
      if (radSlider) {
        radSlider.addEventListener("input", (e) => {
          const r = parseInt(e.target.value, 10) / 100;
          gradEnd = [gradStart[0] + r, gradStart[1]];
          const valEl = contentEl.querySelector("#am-cf-rad-val");
          if (valEl) valEl.textContent = e.target.value + "%";
          applyGradient();
        });
      }

      const changeMediaBtn = contentEl.querySelector("#am-cf-change-media-btn");
      if (changeMediaBtn) {
        changeMediaBtn.addEventListener("click", () => {
          const fi = document.createElement("input");
          fi.type = "file";
          fi.accept = "image/*,video/*";
          fi.onchange = async (e) => {
            const f = e.target.files && e.target.files[0];
            if (!f) return;
            if (I.replaceMediaForLayer) {
              await I.replaceMediaForLayer(layer, f);
            } else {
              layer.fillType = "media";
              layer.mediaUrl = URL.createObjectURL(f);
              layer.fillImage = f.name;
              I.V = true;
            }
            activeTab = "media";
            commitChanges();
            renderView();
          };
          fi.click();
        });
      }

      contentEl.querySelectorAll(".am-cf-crop-btn").forEach(btn => {
        btn.addEventListener("click", () => {
          mediaFillMode = btn.dataset.mode;
          layer.mediaFillMode = mediaFillMode;
          commitChanges();
          renderView();
        });
      });
    }

    renderView();
  }

  function computePathBounds(commands) {
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    function addPt(x, y) {
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }
    let curX = 0, curY = 0;
    for (const cmd of commands) {
      const type = cmd[0];
      if (type === 'M' || type === 'L') {
        curX = cmd[1]; curY = cmd[2];
        addPt(curX, curY);
      } else if (type === 'C') {
        const cp1x = cmd[1], cp1y = cmd[2], cp2x = cmd[3], cp2y = cmd[4], endX = cmd[5], endY = cmd[6];
        for (let s = 0; s <= 16; s++) {
          const t = s / 16;
          const it = 1 - t;
          const x = it*it*it*curX + 3*it*it*t*cp1x + 3*it*t*t*cp2x + t*t*t*endX;
          const y = it*it*it*curY + 3*it*it*t*cp1y + 3*it*t*t*cp2y + t*t*t*endY;
          addPt(x, y);
        }
        curX = endX; curY = endY;
      }
    }
    if (!isFinite(minX) || !isFinite(maxX)) {
      return { minX: -50, minY: -50, maxX: 50, maxY: 50, cx: 0, cy: 0, hx: 50, hy: 50, w: 100, h: 100 };
    }
    const w = Math.max(1, maxX - minX);
    const h = Math.max(1, maxY - minY);
    return {
      minX, minY, maxX, maxY,
      cx: (minX + maxX) / 2,
      cy: (minY + maxY) / 2,
      hx: w / 2,
      hy: h / 2,
      w, h
    };
  }

  function pointsToCommands(points, isClosed) {
    if (!points || !points.length) return [];
    const cmds = [];
    cmds.push(['M', points[0].x, points[0].y]);
    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1];
      const curr = points[i];
      if (prev.type === 'curved' || curr.type === 'curved') {
        const cp1x = prev.out ? prev.out[0] : prev.x;
        const cp1y = prev.out ? prev.out[1] : prev.y;
        const cp2x = curr.in ? curr.in[0] : curr.x;
        const cp2y = curr.in ? curr.in[1] : curr.y;
        cmds.push(['C', cp1x, cp1y, cp2x, cp2y, curr.x, curr.y]);
      } else {
        cmds.push(['L', curr.x, curr.y]);
      }
    }
    if (isClosed && points.length > 2) {
      const last = points[points.length - 1];
      const first = points[0];
      if (last.type === 'curved' || first.type === 'curved') {
        const cp1x = last.out ? last.out[0] : last.x;
        const cp1y = last.out ? last.out[1] : last.y;
        const cp2x = first.in ? first.in[0] : first.x;
        const cp2y = first.in ? first.in[1] : first.y;
        cmds.push(['C', cp1x, cp1y, cp2x, cp2y, first.x, first.y]);
      } else {
        cmds.push(['L', first.x, first.y]);
      }
      cmds.push(['Z']);
    }
    return cmds;
  }

  function commandsToPoints(commands) {
    const points = [];
    let isClosed = false;
    let prevPt = null;
    for (let i = 0; i < commands.length; i++) {
      const cmd = commands[i];
      const type = cmd[0];
      if (type === 'M' || type === 'L') {
        const pt = { x: cmd[1], y: cmd[2], type: 'corner', in: [cmd[1], cmd[2]], out: [cmd[1], cmd[2]] };
        points.push(pt);
        prevPt = pt;
      } else if (type === 'C') {
        const cp1x = cmd[1], cp1y = cmd[2], cp2x = cmd[3], cp2y = cmd[4], x = cmd[5], y = cmd[6];
        if (prevPt) {
          prevPt.type = 'curved';
          prevPt.out = [cp1x, cp1y];
        }
        const pt = { x, y, type: 'curved', in: [cp2x, cp2y], out: [x + (x - cp2x), y + (y - cp2y)] };
        points.push(pt);
        prevPt = pt;
      } else if (type === 'Z') {
        isClosed = true;
      }
    }
    return { points, isClosed };
  }

  function defaultPointsForLayer(layer) {
    const st = (layer.shapeType || '').replace('com.alightcreative.shapes.', '').replace('.', '');
    const w = ((layer.size && layer.size.value && layer.size.value[0]) || 100) / 2;
    const h = ((layer.size && layer.size.value && layer.size.value[1]) || 100) / 2;

    if (st === 'circle' || st === 'ellipse') {
      const cw = w * 0.551915;
      const ch = h * 0.551915;
      return {
        isClosed: true,
        points: [
          { x: 0, y: -h, type: 'curved', in: [-cw, -h], out: [cw, -h] },
          { x: w, y: 0, type: 'curved', in: [w, -ch], out: [w, ch] },
          { x: 0, y: h, type: 'curved', in: [cw, h], out: [-cw, h] },
          { x: -w, y: 0, type: 'curved', in: [-w, ch], out: [-w, -ch] }
        ]
      };
    }
    if (st === 'star') {
      const pts = [];
      const outerR = Math.max(w, h);
      const innerR = outerR * 0.5;
      const count = 5;
      for (let i = 0; i < count; i++) {
        const a1 = (i * 2 * Math.PI) / count - Math.PI / 2;
        pts.push({ x: Math.round(outerR * Math.cos(a1)), y: Math.round(outerR * Math.sin(a1)), type: 'corner', in: null, out: null });
        const a2 = a1 + Math.PI / count;
        pts.push({ x: Math.round(innerR * Math.cos(a2)), y: Math.round(innerR * Math.sin(a2)), type: 'corner', in: null, out: null });
      }
      return { isClosed: true, points: pts };
    }
    if (st === 'triangle') {
      return {
        isClosed: true,
        points: [
          { x: 0, y: -h, type: 'corner', in: null, out: null },
          { x: w, y: h, type: 'corner', in: null, out: null },
          { x: -w, y: h, type: 'corner', in: null, out: null }
        ]
      };
    }
    return {
      isClosed: true,
      points: [
        { x: -w, y: -h, type: 'corner', in: null, out: null },
        { x: w, y: -h, type: 'corner', in: null, out: null },
        { x: w, y: h, type: 'corner', in: null, out: null },
        { x: -w, y: h, type: 'corner', in: null, out: null }
      ]
    };
  }

  let activeLiveShapeLayer = null;
  let liveShapeSnapBefore = null;
  let isShapeRatioLocked = true;
  let isShapeFromCenter = true;
  let selectedLiveShapeParamId = null;
  let selectedLiveShapeSubAxis = "x"; // for point params: "x" or "y"

  const AM_SHAPE_CATALOG = {
    "rect": { name: "Kotak", params: [{ tag: "point", id: "size", label: "Ukuran", default: [100, 100], type: "size" }] },
    "roundrect": { name: "Kotak Persegi", params: [{ tag: "point", id: "size", label: "Ukuran", default: [100, 100], type: "size" }, { tag: "spinner", id: "cornerRadius", label: "Radius", min: 0, max: 2000, default: 25, step: 1, unit: "px" }] },
    "circle": { name: "Lingkaran", params: [{ tag: "spinner", id: "radius", label: "Radius", min: 0, max: 2000, default: 100, step: 1, unit: "px" }] },
    "star": { name: "Bintang", params: [{ tag: "slider", id: "pointCount", label: "Titik", min: 3, max: 32, default: 5, step: 1, unit: "" }, { tag: "spinner", id: "outerRadius", label: "Radius 1", min: 0, max: 2000, default: 100, step: 1, unit: "px" }, { tag: "spinner", id: "innerRadius", label: "Radius 2", min: 0, max: 2000, default: 50, step: 1, unit: "px" }, { tag: "spinner", id: "offsetAngle", label: "Sudut", min: -3600, max: 3600, default: 0, step: 1, unit: "°", isAngle: true }] },
    "poly": { name: "Poligon", params: [{ tag: "slider", id: "sideCount", label: "Sisi", min: 3, max: 32, default: 6, step: 1, unit: "" }, { tag: "spinner", id: "radius", label: "Radius", min: 0, max: 2000, default: 100, step: 1, unit: "px" }, { tag: "spinner", id: "offsetAngle", label: "Sudut", min: -3600, max: 3600, default: 0, step: 1, unit: "°", isAngle: true }] },
    "penta": { name: "Pentagon", params: [{ tag: "slider", id: "sideCount", label: "Sisi", min: 3, max: 32, default: 5, step: 1, unit: "" }, { tag: "spinner", id: "radius", label: "Radius", min: 0, max: 2000, default: 100, step: 1, unit: "px" }, { tag: "spinner", id: "offsetAngle", label: "Sudut", min: -3600, max: 3600, default: 0, step: 1, unit: "°", isAngle: true }] },
    "triangle": { name: "Segitiga", params: [{ tag: "point", id: "p1", label: "Titik 1", default: [-100, 100] }, { tag: "point", id: "p2", label: "Titik 2", default: [0, -100] }, { tag: "point", id: "p3", label: "Titik 3", default: [100, 100] }, { tag: "switch", id: "closed", label: "Tertutup", default: true }] },
    "plus": { name: "Tanda Tambah", params: [{ tag: "point", id: "size", label: "Ukuran", default: [100, 100], type: "size" }, { tag: "spinner", id: "stemSize", label: "Tebal", min: 0, max: 2000, default: 50, step: 1, unit: "px" }] },
    "arrow": { name: "Panah", params: [{ tag: "spinner", id: "length", label: "Panjang", min: 0, max: 2000, default: 200, step: 1, unit: "px" }, { tag: "spinner", id: "width", label: "Lebar", min: 0, max: 2000, default: 80, step: 1, unit: "px" }, { tag: "spinner", id: "headLength", label: "Kepala", min: 0, max: 2000, default: 100, step: 1, unit: "px" }] },
    "pie": { name: "Pie", params: [{ tag: "spinner", id: "startAngle", label: "Mulai", min: -3600, max: 3600, default: 45, step: 1, unit: "°", isAngle: true }, { tag: "spinner", id: "endAngle", label: "Selesai", min: -3600, max: 3600, default: 90, step: 1, unit: "°", isAngle: true }, { tag: "spinner", id: "radius", label: "Radius", min: 0, max: 2000, default: 100, step: 1, unit: "px" }] },
    "arc": { name: "Busur", params: [{ tag: "spinner", id: "startAngle", label: "Mulai", min: -3600, max: 3600, default: 0, step: 1, unit: "°", isAngle: true }, { tag: "spinner", id: "endAngle", label: "Selesai", min: -3600, max: 3600, default: 90, step: 1, unit: "°", isAngle: true }, { tag: "spinner", id: "radius", label: "Radius", min: 0, max: 2000, default: 100, step: 1, unit: "px" }, { tag: "switch", id: "closed", label: "Tertutup", default: false }] },
    "wideline": { name: "Garis Tebal", params: [{ tag: "point", id: "start", label: "Mulai", default: [0, 0] }, { tag: "point", id: "end", label: "Selesai", default: [250, -250] }, { tag: "spinner", id: "lineWidth", label: "Tebal", min: 0, max: 2000, default: 40, step: 1, unit: "px" }] }
  };

  function getShapeDef(layer) {
    if (!layer) return AM_SHAPE_CATALOG["rect"];
    const st = (layer.shapeType || ".rect").replace("com.alightcreative.shapes.", "").replace(".", "");
    return AM_SHAPE_CATALOG[st] || AM_SHAPE_CATALOG["rect"];
  }

  function openLiveShape(layer) {
    if (!layer) return;
    activeLiveShapeLayer = layer;
    liveShapeSnapBefore = I.sceneSnapshot ? I.sceneSnapshot() : null;

    const navDefault = document.getElementById("am-navbar-default");
    const navElem = document.getElementById("am-navbar-element");
    const navLiveShape = document.getElementById("am-navbar-liveshape");
    const navEditPoints = document.getElementById("am-navbar-editpoints");
    const elemPanel = document.getElementById("am-element-edit-panel");
    const subpanel = document.getElementById("am-subpanel-container");
    const liveShapePanel = document.getElementById("am-liveshape-panel");
    const editPointsPanel = document.getElementById("am-editpoints-panel");
    const liveShapeList = document.getElementById("am-liveshape-list");
    const lsTitle = document.getElementById("am-liveshape-title");

    if (navDefault) navDefault.style.display = "none";
    if (navElem) navElem.style.display = "none";
    if (navEditPoints) navEditPoints.style.display = "none";
    if (navLiveShape) navLiveShape.style.display = "flex";
    if (elemPanel) elemPanel.style.display = "none";
    if (subpanel) subpanel.classList.remove("open");
    if (editPointsPanel) editPointsPanel.classList.remove("open");
    if (liveShapePanel) liveShapePanel.classList.add("open");

    const shapeDef = getShapeDef(layer);
    if (lsTitle) lsTitle.textContent = shapeDef.name || "Edit Bentuk";

    // Action bar buttons (fragment_liveshape_actionbar.xml)
    const btnLsBack = document.getElementById("am-btn-liveshape-back");
    const btnLsAspect = document.getElementById("am-btn-liveshape-aspect");
    const imgLsAspect = document.getElementById("am-img-liveshape-aspect");
    const btnLsCenter = document.getElementById("am-btn-liveshape-center");
    const imgLsCenter = document.getElementById("am-img-liveshape-center");

    const hasSizeParam = shapeDef.params.some(p => p.tag === "point" && (p.id === "size" || p.type === "size"));
    if (btnLsAspect) {
      btnLsAspect.style.display = hasSizeParam ? "flex" : "none";
      btnLsAspect.classList.toggle("active", isShapeRatioLocked);
      if (imgLsAspect) imgLsAspect.src = isShapeRatioLocked ? "./icons/ic_shape_aspect_lock.svg" : "./icons/ic_shape_aspect_unlock.svg";
      btnLsAspect.onclick = () => {
        isShapeRatioLocked = !isShapeRatioLocked;
        btnLsAspect.classList.toggle("active", isShapeRatioLocked);
        if (imgLsAspect) imgLsAspect.src = isShapeRatioLocked ? "./icons/ic_shape_aspect_lock.svg" : "./icons/ic_shape_aspect_unlock.svg";
        if (I.handle9) I.handle9(isShapeRatioLocked ? "[BENTUK] Kunci Rasio Aspek Aktif" : "[BENTUK] Kunci Rasio Aspek Nonaktif");
      };
    }
    if (btnLsCenter) {
      btnLsCenter.style.display = hasSizeParam ? "flex" : "none";
      btnLsCenter.classList.toggle("active", isShapeFromCenter);
      btnLsCenter.onclick = () => {
        isShapeFromCenter = !isShapeFromCenter;
        btnLsCenter.classList.toggle("active", isShapeFromCenter);
        if (I.handle9) I.handle9(isShapeFromCenter ? "[BENTUK] Ubah Ukuran Dari Tengah" : "[BENTUK] Ubah Ukuran Bebas");
      };
    }
    if (btnLsBack) btnLsBack.onclick = () => closeLiveShape(true);

    renderLiveShapeSettings(liveShapeList, layer);
  }

  function closeLiveShape(commit) {
    if (!activeLiveShapeLayer) return;
    const navLiveShape = document.getElementById("am-navbar-liveshape");
    const navElem = document.getElementById("am-navbar-element");
    const liveShapePanel = document.getElementById("am-liveshape-panel");
    const elemPanel = document.getElementById("am-element-edit-panel");

    if (navLiveShape) navLiveShape.style.display = "none";
    if (liveShapePanel) liveShapePanel.classList.remove("open");
    if (currentSelectedLayer && navElem) navElem.style.display = "flex";
    if (currentSelectedLayer && elemPanel) elemPanel.style.display = "flex";

    if (commit) {
      if (liveShapeSnapBefore && I.pushUndo) I.pushUndo(liveShapeSnapBefore);
      if (I.omScheduleSave) I.omScheduleSave();
      I.V = true;
      if (I.val2 && I.val2.renderAt) I.val2.renderAt(I.H);
    }
    activeLiveShapeLayer = null;
    liveShapeSnapBefore = null;
    selectedLiveShapeParamId = null;
  }

  function getShapeParam(layer, paramId, defVal) {
    if (!layer) return defVal;
    if (paramId === "size.x" || paramId === "sizeX") {
      return (layer.size && layer.size.value && layer.size.value[0] !== undefined) ? layer.size.value[0] : (Array.isArray(defVal) ? defVal[0] : defVal);
    }
    if (paramId === "size.y" || paramId === "sizeY") {
      return (layer.size && layer.size.value && layer.size.value[1] !== undefined) ? layer.size.value[1] : (Array.isArray(defVal) ? defVal[1] : defVal);
    }
    if (paramId === "size") {
      return (layer.size && layer.size.value) ? layer.size.value : defVal;
    }
    if (paramId === "cornerRadius") {
      return layer.cornerRadius !== undefined ? layer.cornerRadius : defVal;
    }
    if (layer.shapeProps && layer.shapeProps[paramId]) {
      const p = layer.shapeProps[paramId];
      if (p.channel && Array.isArray(p.channel.value)) return p.channel.value[0];
      if (Array.isArray(p.value)) return p.value[0];
      if (typeof p === "number") return p;
    }
    return defVal;
  }

  function setShapeParam(layer, paramId, val) {
    if (!layer) return;
    if (paramId === "size.x" || paramId === "sizeX") {
      if (!layer.size) layer.size = { value: [100, 100], kfs: [] };
      if (!Array.isArray(layer.size.value)) layer.size.value = [100, 100];
      layer.size.value[0] = val;
      if (layer.size.kfs && layer.size.kfs.length) {
        const tt = (I.H || 0) / 1000;
        const idx = layer.size.kfs.findIndex(x => Math.abs(x.t - tt) < 0.001);
        if (idx >= 0) layer.size.kfs[idx].v = layer.size.value.slice();
        else {
          layer.size.kfs.push({ t: tt, v: layer.size.value.slice() });
          layer.size.kfs.sort((a, b) => a.t - b.t);
        }
      }
    } else if (paramId === "size.y" || paramId === "sizeY") {
      if (!layer.size) layer.size = { value: [100, 100], kfs: [] };
      if (!Array.isArray(layer.size.value)) layer.size.value = [100, 100];
      layer.size.value[1] = val;
      if (layer.size.kfs && layer.size.kfs.length) {
        const tt = (I.H || 0) / 1000;
        const idx = layer.size.kfs.findIndex(x => Math.abs(x.t - tt) < 0.001);
        if (idx >= 0) layer.size.kfs[idx].v = layer.size.value.slice();
        else {
          layer.size.kfs.push({ t: tt, v: layer.size.value.slice() });
          layer.size.kfs.sort((a, b) => a.t - b.t);
        }
      }
    } else if (paramId === "cornerRadius") {
      layer.cornerRadius = val;
      if (!layer.cornerRadiusKeyable) layer.cornerRadiusKeyable = { value: [val], kfs: [] };
      layer.cornerRadiusKeyable.value = [val];
      if (layer.cornerRadiusKeyable.kfs && layer.cornerRadiusKeyable.kfs.length) {
        const tt = (I.H || 0) / 1000;
        const idx = layer.cornerRadiusKeyable.kfs.findIndex(x => Math.abs(x.t - tt) < 0.001);
        if (idx >= 0) layer.cornerRadiusKeyable.kfs[idx].v = [val];
        else {
          layer.cornerRadiusKeyable.kfs.push({ t: tt, v: [val] });
          layer.cornerRadiusKeyable.kfs.sort((a, b) => a.t - b.t);
        }
      }
    } else {
      if (!layer.shapeProps) layer.shapeProps = {};
      if (!layer.shapeProps[paramId]) {
        layer.shapeProps[paramId] = { channel: { value: [val], kfs: [] } };
      } else {
        const p = layer.shapeProps[paramId];
        const ch = p.channel || p;
        ch.value = [val];
        if (ch.kfs && ch.kfs.length) {
          const tt = (I.H || 0) / 1000;
          const idx = ch.kfs.findIndex(x => Math.abs(x.t - tt) < 0.001);
          if (idx >= 0) ch.kfs[idx].v = [val];
          else {
            ch.kfs.push({ t: tt, v: [val] });
            ch.kfs.sort((a, b) => a.t - b.t);
          }
        }
      }
    }
    delete layer.mt;
    delete layer.an;
    delete layer.tn;
    I.V = true;
    if (I.val2 && I.val2.renderAt) I.val2.renderAt(I.H);
  }

  function getShapeKeyable(layer, paramId) {
    if (!layer) return null;
    if (paramId.startsWith("size")) {
      if (!layer.size) layer.size = { value: [100, 100], kfs: [] };
      return layer.size;
    }
    if (paramId === "cornerRadius") {
      if (!layer.cornerRadiusKeyable) {
        const cur = layer.cornerRadius !== undefined ? layer.cornerRadius : 25;
        layer.cornerRadiusKeyable = { value: [cur], kfs: [] };
      }
      return layer.cornerRadiusKeyable;
    }
    if (!layer.shapeProps) layer.shapeProps = {};
    if (!layer.shapeProps[paramId]) {
      const def = 100;
      layer.shapeProps[paramId] = { channel: { value: [def], kfs: [] } };
    }
    return layer.shapeProps[paramId].channel || layer.shapeProps[paramId];
  }

  function hasShapeKfAtPlayhead(layer, paramId) {
    if (!layer) return false;
    const tt = (I.H || 0) / 1000;
    if (paramId.startsWith("size")) {
      return !!(layer.size && layer.size.kfs && layer.size.kfs.some(x => Math.abs(x.t - tt) < 0.001));
    }
    if (paramId === "cornerRadius") {
      return !!(layer.cornerRadiusKeyable && layer.cornerRadiusKeyable.kfs && layer.cornerRadiusKeyable.kfs.some(x => Math.abs(x.t - tt) < 0.001));
    }
    if (layer.shapeProps && layer.shapeProps[paramId]) {
      const p = layer.shapeProps[paramId];
      const ch = p.channel || p;
      return !!(ch && ch.kfs && ch.kfs.some(x => Math.abs(x.t - tt) < 0.001));
    }
    return false;
  }

  function toggleShapeKf(layer, paramId) {
    if (!layer) return;
    const tt = (I.H || 0) / 1000;
    if (paramId.startsWith("size")) {
      if (!layer.size) layer.size = { value: [100, 100], kfs: [] };
      if (!layer.size.kfs) layer.size.kfs = [];
      const idx = layer.size.kfs.findIndex(x => Math.abs(x.t - tt) < 0.001);
      if (idx >= 0) {
        layer.size.kfs.splice(idx, 1);
      } else {
        layer.size.kfs.push({ t: tt, v: layer.size.value.slice() });
        layer.size.kfs.sort((a, b) => a.t - b.t);
      }
    } else if (paramId === "cornerRadius") {
      if (!layer.cornerRadiusKeyable) layer.cornerRadiusKeyable = { value: [layer.cornerRadius || 25], kfs: [] };
      if (!layer.cornerRadiusKeyable.kfs) layer.cornerRadiusKeyable.kfs = [];
      const idx = layer.cornerRadiusKeyable.kfs.findIndex(x => Math.abs(x.t - tt) < 0.001);
      if (idx >= 0) {
        layer.cornerRadiusKeyable.kfs.splice(idx, 1);
      } else {
        layer.cornerRadiusKeyable.kfs.push({ t: tt, v: [layer.cornerRadius || 25] });
        layer.cornerRadiusKeyable.kfs.sort((a, b) => a.t - b.t);
      }
    } else {
      if (!layer.shapeProps) layer.shapeProps = {};
      if (!layer.shapeProps[paramId]) layer.shapeProps[paramId] = { channel: { value: [100], kfs: [] } };
      const ch = layer.shapeProps[paramId].channel || layer.shapeProps[paramId];
      if (!ch.kfs) ch.kfs = [];
      const idx = ch.kfs.findIndex(x => Math.abs(x.t - tt) < 0.001);
      if (idx >= 0) {
        ch.kfs.splice(idx, 1);
      } else {
        ch.kfs.push({ t: tt, v: ch.value ? ch.value.slice() : [100] });
        ch.kfs.sort((a, b) => a.t - b.t);
      }
    }
    I.V = true;
    if (I.val2 && I.val2.renderAt) I.val2.renderAt(I.H);
  }

  // 1:1 ValueSpinner canvas engine (horizontal scrolling tick-mark ruler with needle)
  function createValueSpinner(canvas, opts) {
    if (!canvas) return null;
    const ctx = canvas.getContext("2d");
    let isDragging = false;
    let startX = 0;
    let startVal = 0;

    function resize() {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      const w = Math.round((rect.width || 120) * dpr);
      const h = Math.round((rect.height || 45) * dpr);
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
      draw();
    }

    function draw() {
      if (!ctx) return;
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);
      if (!w || !h) return;

      const dpr = window.devicePixelRatio || 1;
      const cx = w / 2;
      const tickSpacing = 5.5 * dpr;
      const tickWidth = 1 * dpr;
      const needleWidth = 1.5 * dpr;
      const step = opts.step || 1;
      const curVal = opts.getVal();
      const offset = (curVal / step) * tickSpacing;

      const halfTicks = Math.ceil(cx / tickSpacing) + 2;
      const centerIndex = Math.round(curVal / step);

      ctx.lineWidth = tickWidth;
      ctx.lineCap = "round";

      for (let i = centerIndex - halfTicks; i <= centerIndex + halfTicks; i++) {
        const x = cx + (i * tickSpacing - offset);
        if (x < 0 || x > w) continue;

        const dist = Math.abs(x - cx);
        const alpha = Math.max(0, 1.0 - (dist / cx));
        const isMajor = (i % 10 === 0) || (i === 0);

        ctx.beginPath();
        if (isMajor) {
          ctx.strokeStyle = `rgba(255, 255, 255, ${alpha * 0.95})`;
          ctx.moveTo(x, 6 * dpr);
          ctx.lineTo(x, h - 6 * dpr);
        } else {
          ctx.strokeStyle = `rgba(112, 121, 140, ${alpha * 0.65})`;
          ctx.moveTo(x, 14 * dpr);
          ctx.lineTo(x, h - 14 * dpr);
        }
        ctx.stroke();
      }

      // Center cyan needle line (app:needleColor="@color/C1" #00e5ff)
      ctx.beginPath();
      ctx.strokeStyle = "#00e5ff";
      ctx.lineWidth = needleWidth;
      ctx.moveTo(cx, 0);
      ctx.lineTo(cx, h);
      ctx.stroke();
    }

    const ro = new ResizeObserver(() => resize());
    ro.observe(canvas);
    setTimeout(resize, 0);

    canvas.addEventListener("pointerdown", (e) => {
      isDragging = true;
      startX = e.clientX;
      startVal = opts.getVal();
      try { canvas.setPointerCapture(e.pointerId); } catch (_) {}
    });

    canvas.addEventListener("pointermove", (e) => {
      if (!isDragging) return;
      const dx = e.clientX - startX;
      const step = opts.step || 1;
      const sensitivity = opts.isAngle ? 0.5 : 0.8;
      const dVal = -dx * step * sensitivity;
      let newVal = startVal + dVal;
      if (opts.min !== undefined) newVal = Math.max(opts.min, newVal);
      if (opts.max !== undefined) newVal = Math.min(opts.max, newVal);
      if (step >= 1) newVal = Math.round(newVal);
      else newVal = Math.round(newVal * 10) / 10;
      opts.setVal(newVal);
      draw();
      if (opts.onChange) opts.onChange(newVal);
    });

    const onUp = (e) => {
      if (!isDragging) return;
      isDragging = false;
      try { canvas.releasePointerCapture(e.pointerId); } catch (_) {}
      draw();
      if (opts.onEnd) opts.onEnd(opts.getVal());
    };

    canvas.addEventListener("pointerup", onUp);
    canvas.addEventListener("pointercancel", onUp);

    return { redraw: draw, resize };
  }

  // 1:1 RotateView canvas engine (matching com.alightcreative.widget.RotateView)
  function createRotateView(canvas, opts) {
    if (!canvas) return null;
    const ctx = canvas.getContext("2d");
    let isDragging = false;
    let startAngle = 0;
    let initAngle = 0;

    function resize() {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      const w = Math.round((rect.width || 180) * dpr);
      const h = Math.round((rect.height || 180) * dpr);
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
      draw();
    }

    function draw() {
      if (!ctx) return;
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);
      if (!w || !h) return;

      const dpr = window.devicePixelRatio || 1;
      const cx = w / 2;
      const cy = h / 2;
      const radius = Math.min(cx, cy) - (20 * dpr);
      if (radius <= 0) return;

      const curAngle = opts.getVal();
      const turns = Math.floor(Math.abs(curAngle) / 360);

      // 1. Background Track Circle (@color/Bl1_a30: rgba(255, 255, 255, 0.12))
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(255, 255, 255, 0.12)";
      ctx.lineWidth = 3.5 * dpr;
      ctx.stroke();

      // 2. Active Arc (@color/C1: #00e5ff)
      if (Math.abs(curAngle) > 0.01) {
        ctx.beginPath();
        const startRad = -Math.PI / 2;
        const angleRad = (curAngle * Math.PI) / 180;
        ctx.arc(cx, cy, radius, startRad, startRad + angleRad, curAngle < 0);
        ctx.strokeStyle = "#00e5ff";
        ctx.lineWidth = (turns > 0 ? 5.5 : 3.5) * dpr;
        ctx.lineCap = "round";
        ctx.stroke();
      }

      // 3. Outer needle/knob at current angle
      const headRad = -Math.PI / 2 + (curAngle * Math.PI) / 180;
      const hx = cx + radius * Math.cos(headRad);
      const hy = cy + radius * Math.sin(headRad);

      ctx.beginPath();
      ctx.arc(hx, hy, 7 * dpr, 0, Math.PI * 2);
      ctx.fillStyle = "#00e5ff";
      ctx.shadowColor = "rgba(0, 229, 255, 0.5)";
      ctx.shadowBlur = 8 * dpr;
      ctx.fill();
      ctx.shadowBlur = 0;

      ctx.beginPath();
      ctx.arc(hx, hy, 3.5 * dpr, 0, Math.PI * 2);
      ctx.fillStyle = "#ffffff";
      ctx.fill();

      // 4. Center Rounded Rect Badge (@color/S9: #1e222d)
      const badgeW = 90 * dpr;
      const badgeH = 32 * dpr;
      const bx = cx - badgeW / 2;
      const by = cy - badgeH / 2;
      const bRad = 6 * dpr;

      ctx.beginPath();
      ctx.roundRect(bx, by, badgeW, badgeH, bRad);
      ctx.fillStyle = "#1e222d";
      ctx.fill();
      ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
      ctx.lineWidth = 1 * dpr;
      ctx.stroke();

      // 5. Center Text (@color/Y1: #00ffa8, @color/P6: #8c93a7)
      ctx.textBaseline = "middle";

      const angleDisplay = (Math.round(curAngle * 10) / 10).toFixed(1) + "°";
      if (turns > 0) {
        const sign = curAngle < 0 ? "-" : "+";
        const turnStr = `${sign}${turns}× `;
        ctx.font = `bold ${10 * dpr}px 'Space Grotesk', -apple-system, sans-serif`;
        const turnW = ctx.measureText(turnStr).width;

        ctx.font = `bold ${12 * dpr}px 'Space Grotesk', -apple-system, sans-serif`;
        const remStr = `${Math.abs(Math.round((curAngle % 360) * 10) / 10).toFixed(1)}°`;
        const remW = ctx.measureText(remStr).width;

        const totalW = turnW + remW;
        const startX = cx - totalW / 2;

        ctx.textAlign = "left";
        ctx.fillStyle = "#8c93a7";
        ctx.font = `bold ${10 * dpr}px 'Space Grotesk', -apple-system, sans-serif`;
        ctx.fillText(turnStr, startX, cy);

        ctx.fillStyle = "#00ffa8";
        ctx.font = `bold ${12 * dpr}px 'Space Grotesk', -apple-system, sans-serif`;
        ctx.fillText(remStr, startX + turnW, cy);
      } else {
        ctx.textAlign = "center";
        ctx.font = `bold ${12 * dpr}px 'Space Grotesk', -apple-system, sans-serif`;
        ctx.fillStyle = "#00ffa8";
        ctx.fillText(angleDisplay, cx, cy);
      }
    }

    const ro = new ResizeObserver(() => resize());
    ro.observe(canvas);
    setTimeout(resize, 0);

    canvas.addEventListener("pointerdown", (e) => {
      isDragging = true;
      try { canvas.setPointerCapture(e.pointerId); } catch (_) {}
      const rect = canvas.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      startAngle = Math.atan2(e.clientY - cy, e.clientX - cx) * (180 / Math.PI);
      initAngle = opts.getVal();
    });

    canvas.addEventListener("pointermove", (e) => {
      if (!isDragging) return;
      const rect = canvas.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const cur = Math.atan2(e.clientY - cy, e.clientX - cx) * (180 / Math.PI);
      let diff = cur - startAngle;
      if (diff > 180) diff -= 360;
      else if (diff < -180) diff += 360;

      let newAngle = Math.round((initAngle + diff) * 10) / 10;
      opts.setVal(newAngle);
      draw();
      if (opts.onChange) opts.onChange(newAngle);
    });

    const onUp = (e) => {
      if (!isDragging) return;
      isDragging = false;
      try { canvas.releasePointerCapture(e.pointerId); } catch (_) {}
      draw();
      if (opts.onEnd) opts.onEnd(opts.getVal());
    };

    canvas.addEventListener("pointerup", onUp);
    canvas.addEventListener("pointercancel", onUp);

    return { redraw: draw, resize };
  }

  function renderLiveShapeSettings(container, layer) {
    if (!container || !layer) return;
    container.innerHTML = "";

    const shapeDef = getShapeDef(layer);
    const params = shapeDef.params || [];
    if (!selectedLiveShapeParamId || !params.some(p => p.id === selectedLiveShapeParamId)) {
      selectedLiveShapeParamId = params[0] ? params[0].id : "size";
    }

    const railBtnBack = document.getElementById("am-btn-liveshape-panel-back");
    const railBtnKf = document.getElementById("am-btn-liveshape-kf");
    const railBtnCurve = document.getElementById("am-btn-liveshape-curve");
    const railBtnOverflow = document.getElementById("am-btn-liveshape-overflow");
    const railImgKf = document.getElementById("am-img-liveshape-kf");

    function getActiveTargetParamId() {
      if (selectedLiveShapeParamId === "size" || selectedLiveShapeParamId === "sizeX" || selectedLiveShapeParamId === "sizeY") {
        return selectedLiveShapeSubAxis === "y" ? "size.y" : "size.x";
      }
      return selectedLiveShapeParamId;
    }

    function updateRailAndRows() {
      const targetParam = getActiveTargetParamId();
      const activeHasKf = hasShapeKfAtPlayhead(layer, targetParam);
      if (railBtnKf) railBtnKf.classList.toggle("active", activeHasKf);
      if (railImgKf) {
        railImgKf.src = activeHasKf ? "./icons/ic_keyframe_del.svg" : "./icons/ac_ic_add_keyframe.svg";
      }

      container.querySelectorAll(".am-ls-row").forEach(r => {
        const pid = r.dataset.paramId;
        const isSel = pid === selectedLiveShapeParamId;
        r.classList.toggle("selected", isSel);
        const lbl = r.querySelector(".am-ls-prop-label");
        if (lbl) lbl.classList.toggle("active", isSel);
        const ind = r.querySelector(".am-ls-kf-indicator");
        if (ind) ind.classList.toggle("has-kf", hasShapeKfAtPlayhead(layer, pid));
      });
    }

    if (railBtnBack) railBtnBack.onclick = () => closeLiveShape(true);
    if (railBtnKf) {
      railBtnKf.onclick = () => {
        toggleShapeKf(layer, getActiveTargetParamId());
        updateRailAndRows();
      };
    }
    if (railBtnCurve) {
      railBtnCurve.onclick = () => {
        if (typeof window.omOpenCurveEditor === "function") {
          const targetParam = getActiveTargetParamId();
          const kfObj = getShapeKeyable(layer, targetParam);
          window.omOpenCurveEditor({
            prop: "shape:" + targetParam,
            layer,
            keyable: kfObj,
            title: "EDIT BENTUK",
            onBack: () => {
              const liveShapePanel = document.getElementById("am-liveshape-panel");
              if (liveShapePanel) liveShapePanel.classList.add("open");
              updateRailAndRows();
            }
          });
        }
      };
    }
    if (railBtnOverflow) {
      railBtnOverflow.onclick = () => {
        if (I.handle9) I.handle9("[BENTUK] Opsi: Nilai Parameter Direset");
      };
    }

    params.forEach(p => {
      const isSel = p.id === selectedLiveShapeParamId;

      // ── TYPE 1: POINT / SIZE (effect_setting_pos.xml) ──
      if (p.tag === "point" || p.type === "size") {
        const curX = Math.round(getShapeParam(layer, p.id === "size" ? "size.x" : p.id + ".x", p.default ? p.default[0] : 100));
        const curY = Math.round(getShapeParam(layer, p.id === "size" ? "size.y" : p.id + ".y", p.default ? p.default[1] : 100));
        const hasKf = hasShapeKfAtPlayhead(layer, p.id === "size" ? "size.x" : p.id);

        const row = document.createElement("div");
        row.className = `am-ls-row am-ls-row-pos ${isSel ? 'selected' : ''}`;
        row.dataset.paramId = p.id;
        row.innerHTML = `
          <button type="button" class="am-ls-prop-label ${isSel ? 'active' : ''}">
            <img class="am-ls-kf-indicator ${hasKf ? 'has-kf' : ''}" src="./icons/ic_keyframe_sign.svg" alt="KF">
            <span>${p.label || "Ukuran"}</span>
          </button>
          <div class="am-ls-spinner-wrap">
            <canvas class="am-ls-spinner-canvas"></canvas>
          </div>
          <div class="am-pos-vals">
            <div class="am-pos-axis-row">
              <span class="am-pos-axis-lbl">X:</span>
              <div class="am-pos-val-btn ${selectedLiveShapeSubAxis === 'x' ? 'selected' : ''}" data-axis="x">${curX} px</div>
            </div>
            <div class="am-pos-axis-row">
              <span class="am-pos-axis-lbl">Y:</span>
              <div class="am-pos-val-btn ${selectedLiveShapeSubAxis === 'y' ? 'selected' : ''}" data-axis="y">${curY} px</div>
            </div>
          </div>
        `;

        const propLabel = row.querySelector(".am-ls-prop-label");
        const btnX = row.querySelector('.am-pos-val-btn[data-axis="x"]');
        const btnY = row.querySelector('.am-pos-val-btn[data-axis="y"]');
        const canvas = row.querySelector(".am-ls-spinner-canvas");

        function updateAxisSelection(axis) {
          selectedLiveShapeParamId = p.id;
          selectedLiveShapeSubAxis = axis;
          btnX.classList.toggle("selected", axis === "x");
          btnY.classList.toggle("selected", axis === "y");
          updateRailAndRows();
        }

        propLabel.addEventListener("click", () => updateAxisSelection(selectedLiveShapeSubAxis));
        btnX.addEventListener("click", (e) => { e.stopPropagation(); updateAxisSelection("x"); });
        btnY.addEventListener("click", (e) => { e.stopPropagation(); updateAxisSelection("y"); });

        row.addEventListener("click", () => updateAxisSelection(selectedLiveShapeSubAxis));

        createValueSpinner(canvas, {
          min: 1,
          max: 4000,
          step: 1,
          getVal: () => {
            const axis = selectedLiveShapeSubAxis === "y" ? "size.y" : "size.x";
            return Math.round(getShapeParam(layer, p.id === "size" ? axis : p.id + "." + selectedLiveShapeSubAxis, 100));
          },
          setVal: (v) => {
            const curOld = getShapeParam(layer, p.id === "size" ? (selectedLiveShapeSubAxis === "y" ? "size.y" : "size.x") : p.id + "." + selectedLiveShapeSubAxis, 100);
            const ratio = curOld > 0 ? v / curOld : 1;

            if (selectedLiveShapeSubAxis === "x") {
              setShapeParam(layer, p.id === "size" ? "size.x" : p.id + ".x", v);
              btnX.textContent = `${Math.round(v)} px`;
              if (isShapeRatioLocked) {
                const otherVal = Math.round(getShapeParam(layer, p.id === "size" ? "size.y" : p.id + ".y", 100) * ratio);
                setShapeParam(layer, p.id === "size" ? "size.y" : p.id + ".y", Math.max(1, otherVal));
                btnY.textContent = `${otherVal} px`;
              }
            } else {
              setShapeParam(layer, p.id === "size" ? "size.y" : p.id + ".y", v);
              btnY.textContent = `${Math.round(v)} px`;
              if (isShapeRatioLocked) {
                const otherVal = Math.round(getShapeParam(layer, p.id === "size" ? "size.x" : p.id + ".x", 100) * ratio);
                setShapeParam(layer, p.id === "size" ? "size.x" : p.id + ".x", Math.max(1, otherVal));
                btnX.textContent = `${otherVal} px`;
              }
            }
          },
          onChange: () => updateRailAndRows()
        });

        container.appendChild(row);
      }

      // ── TYPE 2: SPINNER / ANGLE (effect_setting_spinner.xml) ──
      else if (p.tag === "spinner" || p.isAngle) {
        const curVal = Math.round(getShapeParam(layer, p.id, p.default !== undefined ? Number(p.default) : 100));
        const hasKf = hasShapeKfAtPlayhead(layer, p.id);
        const unit = p.unit || (p.isAngle ? "°" : "px");

        const row = document.createElement("div");
        row.className = `am-ls-row am-ls-row-spinner ${isSel ? 'selected' : ''}`;
        row.dataset.paramId = p.id;
        row.innerHTML = `
          <button type="button" class="am-ls-prop-label ${isSel ? 'active' : ''}">
            <img class="am-ls-kf-indicator ${hasKf ? 'has-kf' : ''}" src="./icons/ic_keyframe_sign.svg" alt="KF">
            <span>${p.label || p.id}</span>
          </button>
          <div class="am-ls-spinner-wrap">
            <canvas class="am-ls-spinner-canvas"></canvas>
          </div>
          <div class="am-ls-prop-value">${curVal}${unit ? ' ' + unit : ''}</div>
        `;

        const propLabel = row.querySelector(".am-ls-prop-label");
        const valBox = row.querySelector(".am-ls-prop-value");
        const canvas = row.querySelector(".am-ls-spinner-canvas");

        propLabel.addEventListener("click", () => {
          selectedLiveShapeParamId = p.id;
          updateRailAndRows();
        });
        row.addEventListener("click", () => {
          selectedLiveShapeParamId = p.id;
          updateRailAndRows();
        });

        createValueSpinner(canvas, {
          min: p.min !== undefined ? Number(p.min) : 0,
          max: p.max !== undefined ? Number(p.max) : 3600,
          step: p.step ? Number(p.step) : 1,
          isAngle: !!p.isAngle,
          getVal: () => Math.round(getShapeParam(layer, p.id, Number(p.default || 0))),
          setVal: (v) => {
            setShapeParam(layer, p.id, v);
            valBox.textContent = `${v}${unit ? ' ' + unit : ''}`;
          },
          onChange: () => updateRailAndRows()
        });

        container.appendChild(row);
      }

      // ── TYPE 3: SLIDER / INTEGER (effect_setting_slider.xml) ──
      else if (p.tag === "slider" || p.type === "integer") {
        const minVal = p.min !== undefined ? Number(p.min) : 3;
        const maxVal = p.max !== undefined ? Number(p.max) : 32;
        const curVal = Math.round(getShapeParam(layer, p.id, p.default ? Number(p.default) : 5));
        const hasKf = hasShapeKfAtPlayhead(layer, p.id);

        const row = document.createElement("div");
        row.className = `am-ls-row am-ls-row-slider ${isSel ? 'selected' : ''}`;
        row.dataset.paramId = p.id;
        row.innerHTML = `
          <button type="button" class="am-ls-prop-label ${isSel ? 'active' : ''}">
            <img class="am-ls-kf-indicator ${hasKf ? 'has-kf' : ''}" src="./icons/ic_keyframe_sign.svg" alt="KF">
            <span>${p.label || p.id}</span>
          </button>
          <div class="am-ls-slider-wrap">
            <input type="range" class="am-ls-slider" min="${minVal}" max="${maxVal}" step="${p.step || 1}" value="${curVal}">
          </div>
          <div class="am-ls-prop-value">${curVal}</div>
        `;

        const propLabel = row.querySelector(".am-ls-prop-label");
        const slider = row.querySelector(".am-ls-slider");
        const valBox = row.querySelector(".am-ls-prop-value");

        propLabel.addEventListener("click", () => {
          selectedLiveShapeParamId = p.id;
          updateRailAndRows();
        });
        row.addEventListener("click", (e) => {
          if (e.target !== slider) {
            selectedLiveShapeParamId = p.id;
            updateRailAndRows();
          }
        });
        slider.addEventListener("input", () => {
          selectedLiveShapeParamId = p.id;
          const v = Number(slider.value);
          valBox.textContent = v;
          setShapeParam(layer, p.id, v);
          updateRailAndRows();
        });

        container.appendChild(row);
      }

      // ── TYPE 4: SWITCH (effect_setting_switch.xml) ──
      else if (p.tag === "switch") {
        const curChecked = !!getShapeParam(layer, p.id, p.default === "true" || p.default === true);

        const row = document.createElement("div");
        row.className = `am-ls-row am-ls-row-switch ${isSel ? 'selected' : ''}`;
        row.dataset.paramId = p.id;
        row.innerHTML = `
          <div class="am-ls-prop-label ${isSel ? 'active' : ''}">
            <span>${p.label || p.id}</span>
          </div>
          <div class="am-ls-switch-wrap">
            <input type="checkbox" class="am-ls-switch" ${curChecked ? 'checked' : ''}>
          </div>
        `;

        const sw = row.querySelector(".am-ls-switch");
        sw.addEventListener("change", () => {
          setShapeParam(layer, p.id, sw.checked);
        });

        container.appendChild(row);
      }
    });

    updateRailAndRows();
  }

  let activeEditPointsLayer = null;
  let editPointsSnapBefore = null;
  let epPoints = [];
  let epIsClosed = true;
  let epActiveIdx = 0;
  let epIsKeyframeMode = false;
  let epOverlayEl = null;

  function openEditPoints(layer) {
    if (!layer) return;
    activeEditPointsLayer = layer;
    editPointsSnapBefore = I.sceneSnapshot ? I.sceneSnapshot() : null;

    if (layer.path && layer.path.commands && layer.path.commands.length) {
      const parsed = commandsToPoints(layer.path.commands);
      epPoints = parsed.points;
      epIsClosed = parsed.isClosed;
    } else {
      const def = defaultPointsForLayer(layer);
      epPoints = def.points;
      epIsClosed = def.isClosed;
      applyPointsToLayer();
    }
    epActiveIdx = 0;
    epIsKeyframeMode = false;

    const navDefault = document.getElementById("am-navbar-default");
    const navElem = document.getElementById("am-navbar-element");
    const navLiveShape = document.getElementById("am-navbar-liveshape");
    const navEditPoints = document.getElementById("am-navbar-editpoints");
    const elemPanel = document.getElementById("am-element-edit-panel");
    const subpanel = document.getElementById("am-subpanel-container");
    const liveShapePanel = document.getElementById("am-liveshape-panel");
    const editPointsPanel = document.getElementById("am-editpoints-panel");

    if (navDefault) navDefault.style.display = "none";
    if (navElem) navElem.style.display = "none";
    if (navLiveShape) navLiveShape.style.display = "none";
    if (navEditPoints) navEditPoints.style.display = "flex";
    if (elemPanel) elemPanel.style.display = "none";
    if (subpanel) subpanel.classList.remove("open");
    if (liveShapePanel) liveShapePanel.classList.remove("open");
    if (editPointsPanel) editPointsPanel.classList.add("open");

    updateEditPointsUI();
    initEditPointsCanvasOverlay();
  }

  function applyPointsToLayer() {
    if (!activeEditPointsLayer || !epPoints.length) return;
    const cmds = pointsToCommands(epPoints, epIsClosed);
    const bounds = computePathBounds(cmds);
    activeEditPointsLayer.path = { commands: cmds, bounds: bounds };
    activeEditPointsLayer.tag = "shape";
    if (!Array.isArray(activeEditPointsLayer.effects)) activeEditPointsLayer.effects = [];
    if (!activeEditPointsLayer.fillType) activeEditPointsLayer.fillType = "color";
    if (!activeEditPointsLayer.fillColor) activeEditPointsLayer.fillColor = [0, 1, 0.66, 1];
    delete activeEditPointsLayer.mt;
    delete activeEditPointsLayer.an;
    delete activeEditPointsLayer.tn;
    I.V = true;
    if (I.val2 && I.val2.renderAt) I.val2.renderAt(I.H);
  }

  function closeEditPoints(commit) {
    if (!activeEditPointsLayer) return;
    const navEditPoints = document.getElementById("am-navbar-editpoints");
    const navElem = document.getElementById("am-navbar-element");
    const editPointsPanel = document.getElementById("am-editpoints-panel");
    const elemPanel = document.getElementById("am-element-edit-panel");

    if (navEditPoints) navEditPoints.style.display = "none";
    if (editPointsPanel) editPointsPanel.classList.remove("open");
    if (currentSelectedLayer && navElem) navElem.style.display = "flex";
    if (currentSelectedLayer && elemPanel) elemPanel.style.display = "flex";

    removeEditPointsCanvasOverlay();

    if (commit) {
      applyPointsToLayer();
      if (editPointsSnapBefore && I.pushUndo) I.pushUndo(editPointsSnapBefore);
      if (I.omScheduleSave) I.omScheduleSave();
      I.V = true;
      if (I.val2 && I.val2.renderAt) I.val2.renderAt(I.H);
    }
    activeEditPointsLayer = null;
    editPointsSnapBefore = null;
    epPoints = [];
  }

  function updateEditPointsUI() {
    const scroller = document.getElementById("am-ep-outline-scroller");
    const info = document.getElementById("am-ep-contour-info");
    const imgOpenClose = document.getElementById("am-ep-img-openclose");
    const imgCurveType = document.getElementById("am-ep-img-curvetype");
    const imgAddDel = document.getElementById("am-ep-img-adddelpoint");

    if (imgOpenClose) {
      imgOpenClose.src = epIsClosed ? "./icons/ac_ic_path_close.svg" : "./icons/ac_ic_path_open.svg";
    }
    if (imgCurveType && epPoints[epActiveIdx]) {
      imgCurveType.src = epPoints[epActiveIdx].type === "curved" ? "./icons/ac_ic_vertex_curved.svg" : "./icons/ac_ic_vertex_sharp.svg";
    }
    if (imgAddDel) {
      imgAddDel.src = epPoints.length > 3 ? "./icons/ac_ic_delete_point_filled.svg" : "./icons/ac_ic_add_point_filled.svg";
    }
    if (info) {
      info.textContent = `Titik ${epActiveIdx + 1} / ${epPoints.length}`;
    }

    if (scroller) {
      scroller.innerHTML = "";
      epPoints.forEach((pt, i) => {
        const node = document.createElement("div");
        node.className = `am-ep-point-node ${i === epActiveIdx ? "active" : ""}`;
        node.textContent = String(i + 1);
        node.addEventListener("click", () => {
          epActiveIdx = i;
          updateEditPointsUI();
          renderCanvasOverlay();
        });
        scroller.appendChild(node);
        if (i === epActiveIdx) {
          node.scrollIntoView({ block: "nearest", behavior: "smooth" });
        }
      });
    }
  }

  function initEditPointsCanvasOverlay() {
    removeEditPointsCanvasOverlay();
    const stage = document.getElementById("am-preview-stage");
    if (!stage) return;
    epOverlayEl = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    epOverlayEl.id = "am-ep-canvas-overlay";
    epOverlayEl.style.cssText = "position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:9000;";
    stage.appendChild(epOverlayEl);
    renderCanvasOverlay();
  }

  function removeEditPointsCanvasOverlay() {
    if (epOverlayEl && epOverlayEl.parentNode) {
      epOverlayEl.parentNode.removeChild(epOverlayEl);
    }
    epOverlayEl = null;
  }

  function renderCanvasOverlay() {
    if (!epOverlayEl || !activeEditPointsLayer || !epPoints.length) return;
    epOverlayEl.innerHTML = "";

    const stage = document.getElementById("am-preview-stage");
    const canvasEl = document.getElementById("view") || (stage ? stage.querySelector("canvas") : null);
    if (!stage || !canvasEl) return;

    const cr = canvasEl.getBoundingClientRect();
    const sr = stage.getBoundingClientRect();
    const sceneW = (I.val && I.val.width) || 1280;
    const canvasScale = cr.width / sceneW;

    const layerX = (activeEditPointsLayer.transform && activeEditPointsLayer.transform.location && activeEditPointsLayer.transform.location.value[0]) || 0;
    const layerY = (activeEditPointsLayer.transform && activeEditPointsLayer.transform.location && activeEditPointsLayer.transform.location.value[1]) || 0;

    function toScreen(px, py) {
      return {
        x: (cr.left - sr.left) + (cr.width / 2) + (layerX + px) * canvasScale,
        y: (cr.top - sr.top) + (cr.height / 2) + (layerY + py) * canvasScale
      };
    }

    let d = "";
    epPoints.forEach((pt, i) => {
      const sp = toScreen(pt.x, pt.y);
      if (i === 0) d += `M ${sp.x} ${sp.y} `;
      else {
        const prev = epPoints[i - 1];
        if (prev.type === "curved" || pt.type === "curved") {
          const cp1 = toScreen(prev.out ? prev.out[0] : prev.x, prev.out ? prev.out[1] : prev.y);
          const cp2 = toScreen(pt.in ? pt.in[0] : pt.x, pt.in ? pt.in[1] : pt.y);
          d += `C ${cp1.x} ${cp1.y}, ${cp2.x} ${cp2.y}, ${sp.x} ${sp.y} `;
        } else {
          d += `L ${sp.x} ${sp.y} `;
        }
      }
    });
    if (epIsClosed && epPoints.length > 2) {
      const last = epPoints[epPoints.length - 1];
      const first = epPoints[0];
      const sp = toScreen(first.x, first.y);
      if (last.type === "curved" || first.type === "curved") {
        const cp1 = toScreen(last.out ? last.out[0] : last.x, last.out ? last.out[1] : last.y);
        const cp2 = toScreen(first.in ? first.in[0] : first.x, first.in ? first.in[1] : first.y);
        d += `C ${cp1.x} ${cp1.y}, ${cp2.x} ${cp2.y}, ${sp.x} ${sp.y} Z`;
      } else {
        d += `L ${sp.x} ${sp.y} Z`;
      }
    }

    const pathEl = document.createElementNS("http://www.w3.org/2000/svg", "path");
    pathEl.setAttribute("d", d);
    pathEl.setAttribute("fill", "none");
    pathEl.setAttribute("stroke", "#00ffa8");
    pathEl.setAttribute("stroke-width", "2");
    pathEl.setAttribute("stroke-dasharray", "4,3");
    epOverlayEl.appendChild(pathEl);

    const actPt = epPoints[epActiveIdx];
    if (actPt && actPt.type === "curved") {
      const sp = toScreen(actPt.x, actPt.y);
      if (actPt.in) {
        const sin = toScreen(actPt.in[0], actPt.in[1]);
        const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
        line.setAttribute("x1", sp.x); line.setAttribute("y1", sp.y);
        line.setAttribute("x2", sin.x); line.setAttribute("y2", sin.y);
        line.setAttribute("stroke", "#ffffff"); line.setAttribute("stroke-width", "1.5");
        epOverlayEl.appendChild(line);

        const sq = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        sq.setAttribute("x", sin.x - 4); sq.setAttribute("y", sin.y - 4);
        sq.setAttribute("width", "8"); sq.setAttribute("height", "8");
        sq.setAttribute("fill", "#00ffa8"); sq.setAttribute("stroke", "#ffffff"); sq.setAttribute("stroke-width", "1");
        sq.style.cursor = "crosshair"; sq.style.pointerEvents = "auto";
        sq.addEventListener("pointerdown", (e) => {
          e.stopPropagation();
          let sx = e.clientX, sy = e.clientY;
          function onHMove(ev) {
            const dx = (ev.clientX - sx) / canvasScale;
            const dy = (ev.clientY - sy) / canvasScale;
            sx = ev.clientX; sy = ev.clientY;
            actPt.in[0] += dx; actPt.in[1] += dy;
            applyPointsToLayer();
            renderCanvasOverlay();
          }
          function onHUp() {
            window.removeEventListener("pointermove", onHMove);
            window.removeEventListener("pointerup", onHUp);
          }
          window.addEventListener("pointermove", onHMove);
          window.addEventListener("pointerup", onHUp);
        });
        epOverlayEl.appendChild(sq);
      }
      if (actPt.out) {
        const sout = toScreen(actPt.out[0], actPt.out[1]);
        const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
        line.setAttribute("x1", sp.x); line.setAttribute("y1", sp.y);
        line.setAttribute("x2", sout.x); line.setAttribute("y2", sout.y);
        line.setAttribute("stroke", "#ffffff"); line.setAttribute("stroke-width", "1.5");
        epOverlayEl.appendChild(line);

        const sq = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        sq.setAttribute("x", sout.x - 4); sq.setAttribute("y", sout.y - 4);
        sq.setAttribute("width", "8"); sq.setAttribute("height", "8");
        sq.setAttribute("fill", "#00ffa8"); sq.setAttribute("stroke", "#ffffff"); sq.setAttribute("stroke-width", "1");
        sq.style.cursor = "crosshair"; sq.style.pointerEvents = "auto";
        sq.addEventListener("pointerdown", (e) => {
          e.stopPropagation();
          let sx = e.clientX, sy = e.clientY;
          function onHMove(ev) {
            const dx = (ev.clientX - sx) / canvasScale;
            const dy = (ev.clientY - sy) / canvasScale;
            sx = ev.clientX; sy = ev.clientY;
            actPt.out[0] += dx; actPt.out[1] += dy;
            applyPointsToLayer();
            renderCanvasOverlay();
          }
          function onHUp() {
            window.removeEventListener("pointermove", onHMove);
            window.removeEventListener("pointerup", onHUp);
          }
          window.addEventListener("pointermove", onHMove);
          window.addEventListener("pointerup", onHUp);
        });
        epOverlayEl.appendChild(sq);
      }
    }

    epPoints.forEach((pt, i) => {
      const sp = toScreen(pt.x, pt.y);
      const isAct = i === epActiveIdx;
      const c = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      c.setAttribute("cx", sp.x);
      c.setAttribute("cy", sp.y);
      c.setAttribute("r", isAct ? "8" : "6");
      c.setAttribute("fill", isAct ? "#00ffa8" : "#ffffff");
      c.setAttribute("stroke", isAct ? "#ffffff" : "#11131c");
      c.setAttribute("stroke-width", "2");
      c.style.cursor = "pointer";
      c.style.pointerEvents = "auto";

      c.addEventListener("pointerdown", (e) => {
        e.stopPropagation();
        epActiveIdx = i;
        updateEditPointsUI();
        renderCanvasOverlay();

        let sx = e.clientX, sy = e.clientY;
        function onPointMove(ev) {
          const dx = (ev.clientX - sx) / canvasScale;
          const dy = (ev.clientY - sy) / canvasScale;
          sx = ev.clientX; sy = ev.clientY;
          pt.x += dx; pt.y += dy;
          if (pt.in) { pt.in[0] += dx; pt.in[1] += dy; }
          if (pt.out) { pt.out[0] += dx; pt.out[1] += dy; }
          applyPointsToLayer();
          renderCanvasOverlay();
        }
        function onPointUp() {
          window.removeEventListener("pointermove", onPointMove);
          window.removeEventListener("pointerup", onPointUp);
        }
        window.addEventListener("pointermove", onPointMove);
        window.addEventListener("pointerup", onPointUp);
      });
      epOverlayEl.appendChild(c);
    });
  }

  const DRAWING_WIDTH_TABLE = [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
    22, 24, 26, 28, 30, 33, 36, 40, 45, 50, 60, 70, 80, 90, 100, 120, 140, 160, 180, 200, 250, 300
  ];
  const DRAWING_PRESET_COLORS = [
    "#ffffff", "#00ffa8", "#00c2ff", "#ffcc00", "#ff3b30", "#af52de", "#5856d6", "#191a1c"
  ];

  let activeDrawingLayer = null;
  let drawingStrokes = [];
  let drawingRedoStrokes = [];
  let currentDrawTool = "pen";
  let currentStrokeWidthIndex = 11;
  let currentStrokeWidth = 12;
  let currentSmoothing = 35;
  let currentDrawColor = "#00ffa8";
  let activeDrawingCanvas = null;
  let activeDrawingCtx = null;
  let currentStroke = null;
  let isPointerDownOnDrawing = false;
  let drawingUIInitialized = false;

  function rdpPoints(points, epsilon) {
    if (!points || points.length <= 2) return points || [];
    let maxDist = 0;
    let index = 0;
    const p1 = points[0];
    const p2 = points[points.length - 1];
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    const lenSq = dx * dx + dy * dy;

    for (let i = 1; i < points.length - 1; i++) {
      const p = points[i];
      let dist;
      if (lenSq === 0) {
        dist = Math.hypot(p.x - p1.x, p.y - p1.y);
      } else {
        const u = Math.max(0, Math.min(1, ((p.x - p1.x) * dx + (p.y - p1.y) * dy) / lenSq));
        dist = Math.hypot(p.x - (p1.x + u * dx), p.y - (p1.y + u * dy));
      }
      if (dist > maxDist) {
        maxDist = dist;
        index = i;
      }
    }
    if (maxDist > epsilon) {
      const left = rdpPoints(points.slice(0, index + 1), epsilon);
      const right = rdpPoints(points.slice(index), epsilon);
      return left.slice(0, -1).concat(right);
    }
    return [p1, p2];
  }

  function pointsToSmoothCommands(pts, isClosed) {
    if (!pts || !pts.length) return [];
    if (pts.length === 1) {
      return [['M', pts[0].x, pts[0].y], ['L', pts[0].x + 0.1, pts[0].y]];
    }
    if (pts.length === 2) {
      return [['M', pts[0].x, pts[0].y], ['L', pts[1].x, pts[1].y]];
    }
    const cmds = [['M', pts[0].x, pts[0].y]];
    const n = pts.length;
    const maxIdx = isClosed ? n : n - 1;
    for (let i = 0; i < maxIdx; i++) {
      const p0 = pts[(i - 1 + n) % n];
      const p1 = pts[i];
      const p2 = pts[(i + 1) % n];
      const p3 = pts[(i + 2) % n];

      const cp1x = p1.x + (p2.x - (isClosed ? p0.x : (i === 0 ? p1.x : p0.x))) / 6;
      const cp1y = p1.y + (p2.y - (isClosed ? p0.y : (i === 0 ? p1.y : p0.y))) / 6;
      const cp2x = p2.x - ((isClosed ? p3.x : (i + 1 === n - 1 ? p2.x : p3.x)) - p1.x) / 6;
      const cp2y = p2.y - ((isClosed ? p3.y : (i + 1 === n - 1 ? p2.y : p3.y)) - p1.y) / 6;

      cmds.push([
        'C',
        Math.round(cp1x * 100) / 100, Math.round(cp1y * 100) / 100,
        Math.round(cp2x * 100) / 100, Math.round(cp2y * 100) / 100,
        Math.round(p2.x * 100) / 100, Math.round(p2.y * 100) / 100
      ]);
    }
    if (isClosed) cmds.push(['Z']);
    return cmds;
  }

  function screenToSceneDraw(e) {
    const stage = document.getElementById("am-preview-stage");
    const canvasEl = document.getElementById("view") || (stage ? stage.querySelector("canvas") : null);
    if (!stage || !canvasEl) return { x: 0, y: 0, p: 0.5 };
    const cr = canvasEl.getBoundingClientRect();
    const sceneW = (I.val && I.val.width) || 1280;
    const canvasScale = cr.width / sceneW;
    const cx = cr.left + cr.width / 2;
    const cy = cr.top + cr.height / 2;
    const p = typeof e.pressure === "number" && e.pressure > 0 ? e.pressure : 0.5;
    return {
      x: (e.clientX - cx) / canvasScale,
      y: (e.clientY - cy) / canvasScale,
      p
    };
  }

  function sceneToScreenDraw(px, py) {
    const stage = document.getElementById("am-preview-stage");
    const canvasEl = document.getElementById("view") || (stage ? stage.querySelector("canvas") : null);
    if (!stage || !canvasEl) return { x: 0, y: 0, scale: 1 };
    const cr = canvasEl.getBoundingClientRect();
    const sr = stage.getBoundingClientRect();
    const sceneW = (I.val && I.val.width) || 1280;
    const canvasScale = cr.width / sceneW;
    const cx = (cr.left - sr.left) + (cr.width / 2);
    const cy = (cr.top - sr.top) + (cr.height / 2);
    return {
      x: cx + px * canvasScale,
      y: cy + py * canvasScale,
      scale: canvasScale
    };
  }

  function resizeDrawingCanvas() {
    if (!activeDrawingCanvas) return;
    const stage = document.getElementById("am-preview-stage");
    if (!stage) return;
    const rect = stage.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    activeDrawingCanvas.width = Math.round(rect.width * dpr);
    activeDrawingCanvas.height = Math.round(rect.height * dpr);
    activeDrawingCanvas.style.width = rect.width + "px";
    activeDrawingCanvas.style.height = rect.height + "px";
    activeDrawingCtx = activeDrawingCanvas.getContext("2d");
    activeDrawingCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
    renderAllStrokesToCanvas();
  }

  function drawSingleStroke(ctx, s) {
    if (!s || !s.points || s.points.length === 0) return;
    const pts = s.points;
    const sp0 = sceneToScreenDraw(pts[0].x, pts[0].y);
    const scale = sp0.scale;
    const strokeWidth = Math.max(1, s.width * scale);

    ctx.save();
    if (s.tool === "fill") {
      ctx.beginPath();
      ctx.moveTo(sp0.x, sp0.y);
      for (let i = 1; i < pts.length; i++) {
        const sp = sceneToScreenDraw(pts[i].x, pts[i].y);
        ctx.lineTo(sp.x, sp.y);
      }
      ctx.closePath();
      ctx.fillStyle = s.color;
      ctx.fill();
      ctx.strokeStyle = s.color;
      ctx.lineWidth = Math.max(1, strokeWidth * 0.5);
      ctx.stroke();
    } else if (s.tool === "brush") {
      const count = pts.length;
      if (count === 1) {
        ctx.beginPath();
        const r = (strokeWidth * (pts[0].p || 0.5)) / 2;
        ctx.arc(sp0.x, sp0.y, Math.max(1, r), 0, Math.PI * 2);
        ctx.fillStyle = s.color;
        ctx.fill();
      } else {
        const scrPts = pts.map(p => {
          const sp = sceneToScreenDraw(p.x, p.y);
          return { x: sp.x, y: sp.y, p: p.p || 0.5 };
        });
        ctx.beginPath();
        for (let i = 0; i < count; i++) {
          const p = scrPts[i];
          const prev = scrPts[Math.max(0, i - 1)];
          const next = scrPts[Math.min(count - 1, i + 1)];
          let dx = next.x - prev.x;
          let dy = next.y - prev.y;
          const dist = Math.hypot(dx, dy) || 1;
          dx /= dist;
          dy /= dist;
          const halfW = (strokeWidth * p.p) / 2;
          const nx = -dy * halfW;
          const ny = dx * halfW;
          if (i === 0) ctx.moveTo(p.x + nx, p.y + ny);
          else ctx.lineTo(p.x + nx, p.y + ny);
        }
        for (let i = count - 1; i >= 0; i--) {
          const p = scrPts[i];
          const prev = scrPts[Math.max(0, i - 1)];
          const next = scrPts[Math.min(count - 1, i + 1)];
          let dx = next.x - prev.x;
          let dy = next.y - prev.y;
          const dist = Math.hypot(dx, dy) || 1;
          dx /= dist;
          dy /= dist;
          const halfW = (strokeWidth * p.p) / 2;
          const nx = -dy * halfW;
          const ny = dx * halfW;
          ctx.lineTo(p.x - nx, p.y - ny);
        }
        ctx.closePath();
        ctx.fillStyle = s.color;
        ctx.fill();
      }
    } else {
      ctx.beginPath();
      ctx.strokeStyle = s.color;
      ctx.lineWidth = strokeWidth;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      if (pts.length === 1) {
        ctx.arc(sp0.x, sp0.y, Math.max(0.5, strokeWidth / 4), 0, Math.PI * 2);
        ctx.fillStyle = s.color;
        ctx.fill();
      } else if (pts.length === 2) {
        const sp1 = sceneToScreenDraw(pts[1].x, pts[1].y);
        ctx.moveTo(sp0.x, sp0.y);
        ctx.lineTo(sp1.x, sp1.y);
        ctx.stroke();
      } else {
        const scrPts = pts.map(p => sceneToScreenDraw(p.x, p.y));
        ctx.moveTo(scrPts[0].x, scrPts[0].y);
        for (let i = 1; i < scrPts.length - 1; i++) {
          const midX = (scrPts[i].x + scrPts[i + 1].x) / 2;
          const midY = (scrPts[i].y + scrPts[i + 1].y) / 2;
          ctx.quadraticCurveTo(scrPts[i].x, scrPts[i].y, midX, midY);
        }
        const last = scrPts[scrPts.length - 1];
        ctx.lineTo(last.x, last.y);
        ctx.stroke();
      }
    }
    ctx.restore();
  }

  function renderAllStrokesToCanvas() {
    if (!activeDrawingCtx || !activeDrawingCanvas) return;
    const dpr = window.devicePixelRatio || 1;
    activeDrawingCtx.save();
    activeDrawingCtx.setTransform(1, 0, 0, 1, 0, 0);
    activeDrawingCtx.clearRect(0, 0, activeDrawingCanvas.width, activeDrawingCanvas.height);
    activeDrawingCtx.restore();

    for (const s of drawingStrokes) {
      drawSingleStroke(activeDrawingCtx, s);
    }
    if (currentStroke) {
      drawSingleStroke(activeDrawingCtx, currentStroke);
    }
  }

  function updateDrawingUndoRedoButtons() {
    const btnUndo = document.getElementById("am-btn-draw-undo");
    const btnRedo = document.getElementById("am-btn-draw-redo");
    if (btnUndo) btnUndo.disabled = drawingStrokes.length === 0;
    if (btnRedo) btnRedo.disabled = drawingRedoStrokes.length === 0;
  }

  function eraseStrokesNear(pt) {
    const radius = Math.max(12, currentStrokeWidth / 2);
    let erased = false;
    for (let i = drawingStrokes.length - 1; i >= 0; i--) {
      const s = drawingStrokes[i];
      const threshold = radius + (s.width || 0) / 2;
      for (const p of s.points) {
        if (Math.hypot(p.x - pt.x, p.y - pt.y) <= threshold) {
          drawingRedoStrokes.push(drawingStrokes.splice(i, 1)[0]);
          erased = true;
          break;
        }
      }
    }
    if (erased) {
      updateDrawingUndoRedoButtons();
      renderAllStrokesToCanvas();
    }
  }

  function initDrawingCanvas() {
    removeDrawingCanvas();
    const stage = document.getElementById("am-preview-stage");
    if (!stage) return;
    activeDrawingCanvas = document.createElement("canvas");
    activeDrawingCanvas.id = "am-drawing-canvas";
    stage.appendChild(activeDrawingCanvas);

    resizeDrawingCanvas();
    window.addEventListener("resize", resizeDrawingCanvas);

    activeDrawingCanvas.addEventListener("pointerdown", (e) => {
      e.preventDefault();
      e.stopPropagation();
      activeDrawingCanvas.setPointerCapture(e.pointerId);
      isPointerDownOnDrawing = true;
      const pt = screenToSceneDraw(e);

      if (currentDrawTool === "eraser") {
        eraseStrokesNear(pt);
        return;
      }

      currentStroke = {
        tool: currentDrawTool,
        color: currentDrawColor,
        width: currentStrokeWidth,
        smoothing: currentSmoothing,
        points: [pt]
      };
      renderAllStrokesToCanvas();
    });

    activeDrawingCanvas.addEventListener("pointermove", (e) => {
      if (!isPointerDownOnDrawing) return;
      e.preventDefault();
      e.stopPropagation();
      const pt = screenToSceneDraw(e);

      if (currentDrawTool === "eraser") {
        eraseStrokesNear(pt);
        return;
      }

      if (!currentStroke) return;
      const last = currentStroke.points[currentStroke.points.length - 1];
      if (last && Math.hypot(pt.x - last.x, pt.y - last.y) < 1.0) return;
      currentStroke.points.push(pt);
      renderAllStrokesToCanvas();
    });

    const onPointerEnd = (e) => {
      if (!isPointerDownOnDrawing) return;
      isPointerDownOnDrawing = false;
      try {
        activeDrawingCanvas.releasePointerCapture(e.pointerId);
      } catch {}

      if (currentDrawTool === "eraser") {
        currentStroke = null;
        return;
      }

      if (currentStroke && currentStroke.points && currentStroke.points.length > 0) {
        if (currentSmoothing > 0 && currentStroke.points.length > 2) {
          const eps = 0.5 + (currentSmoothing / 100) * 3.5;
          currentStroke.points = rdpPoints(currentStroke.points, eps);
        }
        drawingStrokes.push(currentStroke);
        drawingRedoStrokes = [];
        updateDrawingUndoRedoButtons();
      }
      currentStroke = null;
      renderAllStrokesToCanvas();
    };

    activeDrawingCanvas.addEventListener("pointerup", onPointerEnd);
    activeDrawingCanvas.addEventListener("pointercancel", onPointerEnd);
  }

  function removeDrawingCanvas() {
    if (activeDrawingCanvas && activeDrawingCanvas.parentNode) {
      activeDrawingCanvas.parentNode.removeChild(activeDrawingCanvas);
    }
    activeDrawingCanvas = null;
    activeDrawingCtx = null;
    window.removeEventListener("resize", resizeDrawingCanvas);
  }

  function initDrawingUI() {
    if (drawingUIInitialized) return;
    drawingUIInitialized = true;

    const btnBack = document.getElementById("am-btn-drawing-back");
    const btnDone = document.getElementById("am-btn-draw-done");
    const btnUndo = document.getElementById("am-btn-draw-undo");
    const btnRedo = document.getElementById("am-btn-draw-redo");

    if (btnBack) {
      btnBack.addEventListener("click", () => {
        if (drawingStrokes.length > 0) finishDrawingAndCommit();
        else closeDrawingMode(false);
      });
    }

    if (btnDone) {
      btnDone.addEventListener("click", finishDrawingAndCommit);
    }

    if (btnUndo) {
      btnUndo.addEventListener("click", () => {
        if (drawingStrokes.length > 0) {
          drawingRedoStrokes.push(drawingStrokes.pop());
          updateDrawingUndoRedoButtons();
          renderAllStrokesToCanvas();
        }
      });
    }

    if (btnRedo) {
      btnRedo.addEventListener("click", () => {
        if (drawingRedoStrokes.length > 0) {
          drawingStrokes.push(drawingRedoStrokes.pop());
          updateDrawingUndoRedoButtons();
          renderAllStrokesToCanvas();
        }
      });
    }

    const sizeSlider = document.getElementById("am-draw-size-slider");
    const sizeBadge = document.getElementById("am-draw-size-badge");
    if (sizeSlider && sizeBadge) {
      sizeSlider.addEventListener("input", () => {
        currentStrokeWidthIndex = parseInt(sizeSlider.value, 10);
        currentStrokeWidth = DRAWING_WIDTH_TABLE[currentStrokeWidthIndex] || 12;
        sizeBadge.textContent = `${currentStrokeWidth} px`;
      });
    }

    const smoothSlider = document.getElementById("am-draw-smooth-slider");
    const smoothBadge = document.getElementById("am-draw-smooth-badge");
    if (smoothSlider && smoothBadge) {
      smoothSlider.addEventListener("input", () => {
        currentSmoothing = parseInt(smoothSlider.value, 10);
        smoothBadge.textContent = `${currentSmoothing}%`;
      });
    }

    const toolBtns = [
      { id: "am-draw-tool-pen", tool: "pen" },
      { id: "am-draw-tool-brush", tool: "brush" },
      { id: "am-draw-tool-fill", tool: "fill" },
      { id: "am-draw-tool-eraser", tool: "eraser" }
    ];

    toolBtns.forEach(({ id, tool }) => {
      const btn = document.getElementById(id);
      if (btn) {
        btn.addEventListener("click", () => {
          currentDrawTool = tool;
          toolBtns.forEach(t => {
            const b = document.getElementById(t.id);
            if (b) b.classList.toggle("active", t.tool === tool);
          });
        });
      }
    });

    const swatchesContainer = document.getElementById("am-draw-swatches");
    const colorPicker = document.getElementById("am-draw-color-picker");

    if (swatchesContainer) {
      swatchesContainer.innerHTML = "";
      DRAWING_PRESET_COLORS.forEach(c => {
        const sw = document.createElement("div");
        sw.className = "am-draw-swatch" + (c === currentDrawColor ? " active" : "");
        sw.style.backgroundColor = c;
        sw.dataset.color = c;
        sw.addEventListener("click", () => {
          currentDrawColor = c;
          swatchesContainer.querySelectorAll(".am-draw-swatch").forEach(s => s.classList.remove("active"));
          sw.classList.add("active");
          if (colorPicker) colorPicker.value = c;
        });
        swatchesContainer.appendChild(sw);
      });
    }

    if (colorPicker) {
      colorPicker.addEventListener("input", (e) => {
        currentDrawColor = e.target.value;
        if (swatchesContainer) {
          swatchesContainer.querySelectorAll(".am-draw-swatch").forEach(s => {
            s.classList.toggle("active", s.dataset.color.toLowerCase() === currentDrawColor.toLowerCase());
          });
        }
      });
    }
  }

  function openDrawingMode(existingLayer) {
    initDrawingUI();
    activeDrawingLayer = existingLayer || null;
    drawingStrokes = [];
    drawingRedoStrokes = [];
    currentStroke = null;

    if (existingLayer && Array.isArray(existingLayer.strokes)) {
      drawingStrokes = existingLayer.strokes.map(s => ({
        tool: s.type || "pen",
        color: typeof s.color === "string" ? s.color : "#00ffa8",
        width: s.width || 12,
        smoothing: 35,
        points: (s.points || []).map(p => ({ x: p[0], y: p[1], p: p[2] != null ? p[2] : 0.5 }))
      }));
    }

    const navDefault = document.getElementById("am-navbar-default");
    const navElem = document.getElementById("am-navbar-element");
    const navLiveShape = document.getElementById("am-navbar-liveshape");
    const navEditPoints = document.getElementById("am-navbar-editpoints");
    const navDrawing = document.getElementById("am-navbar-drawing");
    const tlView = document.getElementById("am-timeline-view");
    const elemPanel = document.getElementById("am-element-edit-panel");
    const liveShapePanel = document.getElementById("am-liveshape-panel");
    const editPointsPanel = document.getElementById("am-editpoints-panel");
    const drawPanel = document.getElementById("am-drawing-panel");
    const subpanel = document.getElementById("am-subpanel-container");

    if (navDefault) navDefault.style.display = "none";
    if (navElem) navElem.style.display = "none";
    if (navLiveShape) navLiveShape.style.display = "none";
    if (navEditPoints) navEditPoints.style.display = "none";
    if (navDrawing) navDrawing.style.display = "flex";

    if (tlView) tlView.style.display = "none";
    if (elemPanel) elemPanel.style.display = "none";
    if (subpanel) subpanel.classList.remove("open");
    if (liveShapePanel) liveShapePanel.classList.remove("open");
    if (editPointsPanel) editPointsPanel.classList.remove("open");
    if (drawPanel) drawPanel.classList.add("open");

    closeAddPopup();
    initDrawingCanvas();
    updateDrawingUndoRedoButtons();
    renderAllStrokesToCanvas();
  }

  function closeDrawingMode(commit) {
    const navDefault = document.getElementById("am-navbar-default");
    const navElem = document.getElementById("am-navbar-element");
    const navDrawing = document.getElementById("am-navbar-drawing");
    const drawPanel = document.getElementById("am-drawing-panel");
    const elemPanel = document.getElementById("am-element-edit-panel");
    const tlView = document.getElementById("am-timeline-view");

    if (navDrawing) navDrawing.style.display = "none";
    if (drawPanel) drawPanel.classList.remove("open");

    removeDrawingCanvas();

    if (currentSelectedLayer) {
      if (navElem) navElem.style.display = "flex";
      if (elemPanel) elemPanel.style.display = "flex";
    } else {
      if (navDefault) navDefault.style.display = "flex";
      if (tlView) tlView.style.display = "flex";
    }

    activeDrawingLayer = null;
    drawingStrokes = [];
    drawingRedoStrokes = [];
    currentStroke = null;
  }

  function finishDrawingAndCommit() {
    if (!drawingStrokes || drawingStrokes.length === 0) {
      closeDrawingMode(false);
      return;
    }

    const I = window.__AM_INTERNAL;
    if (!I || !I.val) {
      closeDrawingMode(false);
      return;
    }
    const snap = I.sceneSnapshot ? I.sceneSnapshot() : null;

    let allCommands = [];
    let isAnyFill = false;

    for (const stroke of drawingStrokes) {
      if (!stroke.points || stroke.points.length === 0) continue;
      if (stroke.tool === "fill") isAnyFill = true;

      const eps = 0.5 + (stroke.smoothing / 100) * 3.5;
      const simplified = rdpPoints(stroke.points, eps);
      const isClosed = stroke.tool === "fill";
      const strokeCmds = pointsToSmoothCommands(simplified, isClosed);
      allCommands = allCommands.concat(strokeCmds);
    }

    if (allCommands.length === 0) {
      closeDrawingMode(false);
      return;
    }

    const rawBounds = computePathBounds(allCommands);
    const cx = rawBounds.cx;
    const cy = rawBounds.cy;

    const centeredCmds = allCommands.map(cmd => {
      const type = cmd[0];
      if (type === 'M' || type === 'L') {
        return [type, Math.round((cmd[1] - cx) * 100) / 100, Math.round((cmd[2] - cy) * 100) / 100];
      } else if (type === 'C') {
        return [
          'C',
          Math.round((cmd[1] - cx) * 100) / 100, Math.round((cmd[2] - cy) * 100) / 100,
          Math.round((cmd[3] - cx) * 100) / 100, Math.round((cmd[4] - cy) * 100) / 100,
          Math.round((cmd[5] - cx) * 100) / 100, Math.round((cmd[6] - cy) * 100) / 100
        ];
      }
      return cmd;
    });

    const centeredBounds = computePathBounds(centeredCmds);
    const parsed = commandsToPoints(centeredCmds);

    const lastStroke = drawingStrokes[drawingStrokes.length - 1];
    const strokeColor = lastStroke ? lastStroke.color : currentDrawColor;
    const strokeWidth = lastStroke ? lastStroke.width : currentStrokeWidth;

    const layerCount = I.val.layers ? I.val.layers.length : 0;
    const newLayer = {
      id: "vector_" + Date.now().toString(36),
      tag: "shape",
      shapeType: "vector",
      label: "Gambar Vektor " + (layerCount + 1),
      startTime: I.H || 0,
      endTime: (I.H || 0) + 3000,
      path: {
        commands: centeredCmds,
        bounds: centeredBounds
      },
      points: parsed.points,
      strokes: drawingStrokes.map(s => ({
        type: s.tool,
        color: s.color,
        width: s.width,
        points: s.points.map(p => [
          Math.round((p.x - cx) * 100) / 100,
          Math.round((p.y - cy) * 100) / 100,
          p.p != null ? Math.round(p.p * 100) / 100 : 1
        ])
      })),
      pathStroke: {
        enabled: !isAnyFill,
        size: strokeWidth,
        color: strokeColor,
        cap: "round",
        direction: "centered"
      },
      fillType: isAnyFill ? "color" : "none",
      fillColor: strokeColor,
      color: strokeColor,
      transform: {
        location: { value: [Math.round(cx), Math.round(cy), 0], kfs: [] },
        scale: { value: [100, 100], kfs: [] },
        rotation: { value: [0], kfs: [] },
        opacity: { value: [1], kfs: [] }
      },
      effects: []
    };

    if (I.val.layers) {
      I.val.layers.push(newLayer);
      if (snap && I.pushUndo) I.pushUndo(snap);
      I.V = true;
      if (I.bind4) I.bind4();
      if (I.selectLayer) I.selectLayer(newLayer);
      if (I.val2) I.val2.renderAt(I.H);
    }

    currentSelectedLayer = newLayer;
    closeDrawingMode(true);
    if (typeof window.omOnLayerSelected === "function") {
      window.omOnLayerSelected(newLayer);
    }
  }

  window.openDrawingMode = openDrawingMode;
  if (window.__AM_INTERNAL) window.__AM_INTERNAL.openDrawingMode = openDrawingMode;

  function renderBorderShadow(contentEl, layer) {
    const I = window.__AM_INTERNAL || {};
    if (!layer) return;

    if (layer.strokeEnabled === undefined && layer.border) {
      layer.strokeEnabled = layer.border.enabled !== false && (layer.border.size > 0);
      layer.strokeWidth = layer.border.size !== undefined ? layer.border.size : 10;
      layer.strokePosition = layer.border.direction || "outside";
      if (layer.border.color) {
        const c = I.omHexFrom ? I.omHexFrom(layer.border.color) : "#ffffff";
        layer.strokeColor = (/^#[0-9a-f]{8}$/i.test(c) || /^#[0-9a-f]{9}$/i.test(c)) ? "#" + c.slice(3) : c;
      }
    }
    if (layer.shadowEnabled === undefined && layer.shadow) {
      layer.shadowEnabled = layer.shadow.enabled !== false && (layer.shadow.size > 0 || (layer.shadow.offset && (layer.shadow.offset[0] || layer.shadow.offset[1])));
      layer.shadowRadius = layer.shadow.size !== undefined ? layer.shadow.size : 25;
      if (layer.shadow.color) {
        const c2 = I.omHexFrom ? I.omHexFrom(layer.shadow.color) : "#000000";
        layer.shadowColor = (/^#[0-9a-f]{8}$/i.test(c2) || /^#[0-9a-f]{9}$/i.test(c2)) ? "#" + c2.slice(3) : c2;
        layer.shadowAlpha = Math.round((layer.shadow.color[3] !== undefined ? layer.shadow.color[3] : 0.6) * 100);
      }
      if (layer.shadow.offset) {
        layer.shadowX = layer.shadow.offset[0] || 0;
        layer.shadowY = layer.shadow.offset[1] || 10;
      }
    }

    layer.strokeCap = layer.strokeCap || "round";
    layer.strokeJoin = layer.strokeJoin || "round";
    layer.strokePosition = layer.strokePosition || "outside";
    if (layer.strokeWidth === undefined) layer.strokeWidth = 10;
    if (!layer.strokeColor) layer.strokeColor = "#ffffff";
    if (layer.shadowRadius === undefined) layer.shadowRadius = 25;
    if (layer.shadowAlpha === undefined) layer.shadowAlpha = 60;
    if (layer.shadowX === undefined) layer.shadowX = 0;
    if (layer.shadowY === undefined) layer.shadowY = 10;
    if (!layer.shadowColor) layer.shadowColor = "#000000";

    let activeTab = "border";
    let snapBefore = null;

    function beginChange() {
      if (!snapBefore && I.sceneSnapshot) {
        snapBefore = I.sceneSnapshot();
      }
    }

    function commitChange() {
      if (snapBefore && I.pushUndo) {
        I.pushUndo(snapBefore);
        snapBefore = null;
      }
      if (typeof I.omScheduleSave === "function") {
        I.omScheduleSave();
      }
    }

    function syncLayerFx() {
      if (layer.strokeEnabled) {
        const strokeColorArr = I.parseHexColor ? I.parseHexColor(layer.strokeColor || "#ffffff") : [1, 1, 1, 1];
        layer.border = {
          direction: layer.strokePosition || "outside",
          color: strokeColorArr,
          size: layer.strokeWidth !== undefined ? Number(layer.strokeWidth) : 10,
          cap: layer.strokeCap || "round",
          join: layer.strokeJoin || "round",
          enabled: true
        };
      } else {
        delete layer.border;
      }

      if (layer.shadowEnabled) {
        const shColArr = (I.parseHexColor ? I.parseHexColor(layer.shadowColor || "#000000") : [0, 0, 0, 1]).slice();
        shColArr[3] = (layer.shadowAlpha !== undefined ? Number(layer.shadowAlpha) : 60) / 100;
        layer.shadow = {
          enabled: true,
          direction: "outside",
          color: shColArr,
          size: layer.shadowRadius !== undefined ? Number(layer.shadowRadius) : 25,
          offset: [
            layer.shadowX !== undefined ? Number(layer.shadowX) : 0,
            layer.shadowY !== undefined ? Number(layer.shadowY) : 10
          ]
        };
      } else {
        delete layer.shadow;
      }

      layer.userTouched = true;
      I.V = true;
      if (I.val2 && I.val2.renderAt) I.val2.renderAt(I.H);
    }

    const paletteColors = [
      "#ffffff", "#000000", "#ff3b30", "#ff9500", "#ffcc00", "#4cd964", "#007aff", "#af52de",
      "#5ac8fa", "#5856d6", "#ff2d55", "#8e8e93", "#34c759", "#30b0c7", "#a2845e", "#1c1c1e"
    ];

    function checkHasKeyframe() {
      const propKey = activeTab === "border" ? "stroke" : "shadow";
      const keyable = propKey === "stroke" ? layer.strokeKeyable : layer.shadowKeyable;
      const tSec = ((I.H || 0) / 1000);
      return !!(keyable && keyable.kfs && keyable.kfs.some(k => Math.abs(Number(k.t) - tSec) < 0.002));
    }

    function render() {
      const strokeEnabled = !!layer.strokeEnabled;
      const strokeColor = layer.strokeColor || "#ffffff";
      const strokeWidth = layer.strokeWidth !== undefined ? layer.strokeWidth : 10;
      const strokePos = layer.strokePosition || "outside";
      const strokeCap = layer.strokeCap || "round";
      const strokeJoin = layer.strokeJoin || "round";

      const shadowEnabled = !!layer.shadowEnabled;
      const shadowColor = layer.shadowColor || "#000000";
      const shadowRadius = layer.shadowRadius !== undefined ? layer.shadowRadius : 25;
      const shadowAlpha = layer.shadowAlpha !== undefined ? layer.shadowAlpha : 60;
      const shadowX = layer.shadowX !== undefined ? layer.shadowX : 0;
      const shadowY = layer.shadowY !== undefined ? layer.shadowY : 10;

      const hasKf = checkHasKeyframe();

      contentEl.innerHTML = `
        <div class="am-bs-root">
          <!-- Left Rail (fragment_settings_base.xml) -->
          <div class="am-bs-sidebar-left">
            <button type="button" id="am-bs-btn-back" class="am-vol-side-btn" title="Kembali">
              <img src="./icons/ac_ic_back.svg" alt="Back">
            </button>
            <button type="button" id="am-bs-btn-kf" class="am-vol-side-btn ${hasKf ? 'active' : ''}" title="${hasKf ? 'Hapus Keyframe' : 'Tambah Keyframe'}">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="${hasKf ? '#00ffa8' : 'none'}" stroke="${hasKf ? '#00ffa8' : '#fff'}" stroke-width="2">
                <path d="M12 2L4 12l8 10 8-10L12 2z"/>
              </svg>
            </button>
            <button type="button" id="am-bs-btn-curve" class="am-vol-side-btn" title="Kurva Easing">
              <img src="./icons/ac_ic_anim_curve.svg" alt="Curve">
            </button>
            <div style="flex:1;"></div>
          </div>

          <!-- Center Content (fragment_border_and_shadow.xml) -->
          <div class="am-bs-center">
            ${activeTab === 'border' ? `
              <!-- Stroke Tab -->
              <div id="color_switch_holder" class="am-color-switch-holder">
                <div class="am-color-switch-left">
                  <div class="am-color-view-wrap">
                    <div id="color_view" class="am-color-view" style="background:${strokeColor};" title="Pilih warna batas"></div>
                    <input type="color" id="am-bs-stroke-color-view-input" class="am-color-view-input" value="${strokeColor}">
                  </div>
                  <span id="feature_title" class="am-feature-title">Garis Batas</span>
                </div>
                <label class="am-switch-toggle">
                  <input type="checkbox" id="color_switch" ${strokeEnabled ? "checked" : ""}>
                  <span class="am-switch-slider"></span>
                </label>
              </div>

              ${strokeEnabled ? `
                <div class="am-ls-row am-ls-row-spinner" style="margin-top:4px;">
                  <span class="am-ls-prop-label">Ukuran</span>
                  <div class="am-ls-spinner-wrap">
                    <canvas id="strokeWidthSpinner" class="am-ls-spinner-canvas"></canvas>
                  </div>
                  <div id="strokeWidthValue" class="am-ls-prop-value">${strokeWidth} px</div>
                </div>

                <div class="am-bs-section">
                  <span class="am-bs-control-label">Ujung Garis (Cap)</span>
                  <div id="capSelector" class="am-bs-segmented">
                    <button type="button" id="capSelectorButt" class="am-bs-seg-btn ${strokeCap === 'butt' ? 'active' : ''}" data-cap="butt" title="Butt Cap">
                      <svg viewBox="0 0 138 106" width="22" height="17" fill="none">
                        <path d="M129 21H40v64h89" fill="currentColor" fill-opacity="0.25" stroke="currentColor" stroke-width="5" stroke-linecap="round"/>
                        <path d="M40 53H124" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>
                        <circle cx="40" cy="53" r="10" fill="currentColor" stroke="currentColor" stroke-width="3"/>
                      </svg>
                      <span>Butt</span>
                    </button>
                    <button type="button" id="capSelectorRound" class="am-bs-seg-btn ${strokeCap === 'round' ? 'active' : ''}" data-cap="round" title="Round Cap">
                      <svg viewBox="0 0 138 106" width="22" height="17" fill="none">
                        <path d="M129 21C83.7 21 58.7 21 54 21C35 21 24 38 24 53.7C24 69.5 35 85.2 54 85.2C61 85.2 86 85.2 129 85.2" fill="currentColor" fill-opacity="0.25" stroke="currentColor" stroke-width="5" stroke-linecap="round"/>
                        <path d="M50 53.7H124" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>
                        <circle cx="54" cy="53.2" r="10" fill="currentColor" stroke="currentColor" stroke-width="3"/>
                      </svg>
                      <span>Round</span>
                    </button>
                    <button type="button" id="capSelectorSquare" class="am-bs-seg-btn ${strokeCap === 'square' ? 'active' : ''}" data-cap="square" title="Square Cap">
                      <svg viewBox="0 0 138 106" width="22" height="17" fill="none">
                        <path d="M129 21H28v64h101" fill="currentColor" fill-opacity="0.25" stroke="currentColor" stroke-width="5" stroke-linecap="round"/>
                        <path d="M62 53.7H124" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>
                        <circle cx="54" cy="53.2" r="10" fill="currentColor" stroke="currentColor" stroke-width="3"/>
                      </svg>
                      <span>Square</span>
                    </button>
                  </div>
                </div>

                <div class="am-bs-section">
                  <span class="am-bs-control-label">Sudut Sambungan (Join)</span>
                  <div id="joinSelector" class="am-bs-segmented">
                    <button type="button" id="joinSelectorBevel" class="am-bs-seg-btn ${strokeJoin === 'bevel' ? 'active' : ''}" data-join="bevel" title="Bevel Join">
                      <svg viewBox="0 0 138 106" width="22" height="17" fill="none">
                        <path d="M108 13L66 14L29 50V92H108" fill="currentColor" fill-opacity="0.25"/>
                        <path d="M29 92V52L70 14H111" stroke="currentColor" stroke-width="5"/>
                        <path d="M67 53.5H108" stroke="currentColor" stroke-width="4"/>
                        <path d="M68.5 51V92" stroke="currentColor" stroke-width="4"/>
                        <circle cx="69" cy="54" r="10" fill="currentColor" stroke="currentColor" stroke-width="3"/>
                      </svg>
                      <span>Bevel</span>
                    </button>
                    <button type="button" id="joinSelectorRound" class="am-bs-seg-btn ${strokeJoin === 'round' ? 'active' : ''}" data-join="round" title="Round Join">
                      <svg viewBox="0 0 138 106" width="22" height="17" fill="none">
                        <path d="M109 14H74C49.7 14 30 33.7 30 58V93H109" fill="currentColor" fill-opacity="0.25"/>
                        <path d="M30 93V57C30 33.25 49.25 14 73 14H109" stroke="currentColor" stroke-width="5"/>
                        <path d="M68 54.5H109" stroke="currentColor" stroke-width="4"/>
                        <path d="M69.5 52V93" stroke="currentColor" stroke-width="4"/>
                        <circle cx="70" cy="55" r="10" fill="currentColor" stroke="currentColor" stroke-width="3"/>
                      </svg>
                      <span>Round</span>
                    </button>
                    <button type="button" id="joinSelectorMiter" class="am-bs-seg-btn ${strokeJoin === 'miter' ? 'active' : ''}" data-join="miter" title="Miter Join">
                      <svg viewBox="0 0 138 106" width="22" height="17" fill="none">
                        <path d="M111 12H32V91H111" fill="currentColor" fill-opacity="0.25"/>
                        <path d="M31 91V11H111" stroke="currentColor" stroke-width="5"/>
                        <path d="M70 52.5H111" stroke="currentColor" stroke-width="4"/>
                        <path d="M71.5 50V91" stroke="currentColor" stroke-width="4"/>
                        <circle cx="72" cy="53" r="10" fill="currentColor" stroke="currentColor" stroke-width="3"/>
                      </svg>
                      <span>Miter</span>
                    </button>
                  </div>
                </div>

                <div class="am-bs-section">
                  <span class="am-bs-control-label">Posisi Batas</span>
                  <div class="am-bs-segmented">
                    <button type="button" class="am-bs-seg-btn am-pos-btn ${strokePos === 'outside' ? 'active' : ''}" data-pos="outside">Luar (Outside)</button>
                    <button type="button" class="am-bs-seg-btn am-pos-btn ${strokePos === 'center' || strokePos === 'centered' ? 'active' : ''}" data-pos="center">Tengah (Center)</button>
                    <button type="button" class="am-bs-seg-btn am-pos-btn ${strokePos === 'inside' ? 'active' : ''}" data-pos="inside">Dalam (Inside)</button>
                  </div>
                </div>

                <div class="am-bs-section">
                  <div class="am-bs-label-row">
                    <span class="am-bs-control-label">Warna Batas</span>
                    <input type="color" id="am-bs-stroke-color-picker" value="${strokeColor}" style="width:28px;height:24px;border:0;background:transparent;cursor:pointer;">
                  </div>
                  <div class="am-bs-palette-grid">
                    ${paletteColors.map(c => `
                      <div class="am-bs-palette-chip ${c.toLowerCase() === strokeColor.toLowerCase() ? 'active' : ''}" data-color="${c}" style="background:${c};" title="${c}"></div>
                    `).join('')}
                  </div>
                </div>
              ` : `
                <div style="text-align:center;color:#8c93a7;padding:26px 16px;font-size:12px;background:#181b2a;border-radius:10px;border:1px dashed rgba(255,255,255,0.08);">
                  Aktifkan switch di atas untuk menambahkan garis batas (stroke) pada layer ini.
                </div>
              `}
            ` : `
              <!-- Shadow Tab -->
              <div id="color_switch_holder" class="am-color-switch-holder">
                <div class="am-color-switch-left">
                  <div class="am-color-view-wrap">
                    <div id="color_view" class="am-color-view" style="background:${shadowColor};" title="Pilih warna bayangan"></div>
                    <input type="color" id="am-bs-shadow-color-view-input" class="am-color-view-input" value="${shadowColor}">
                  </div>
                  <span id="feature_title" class="am-feature-title">Bayangan</span>
                </div>
                <label class="am-switch-toggle">
                  <input type="checkbox" id="color_switch" ${shadowEnabled ? "checked" : ""}>
                  <span class="am-switch-slider"></span>
                </label>
              </div>

              ${shadowEnabled ? `
                <div class="am-ls-row am-ls-row-spinner" style="margin-top:4px;">
                  <span class="am-ls-prop-label">Ukuran</span>
                  <div class="am-ls-spinner-wrap">
                    <canvas id="am-bs-shadow-r" class="am-ls-spinner-canvas"></canvas>
                  </div>
                  <div id="am-bs-shadow-r-val" class="am-ls-prop-value">${shadowRadius} px</div>
                </div>

                <div class="am-bs-section">
                  <div class="am-bs-label-row">
                    <span class="am-bs-control-label">Opasitas (Alpha)</span>
                    <span id="am-bs-shadow-a-val" class="am-bs-val-box">${shadowAlpha}%</span>
                  </div>
                  <div class="am-bs-slider-row">
                    <input type="range" id="am-bs-shadow-a" min="0" max="100" value="${shadowAlpha}" class="am-bs-slider">
                  </div>
                </div>

                <div class="am-bs-offset-row">
                  <div class="am-bs-offset-col">
                    <div class="am-bs-label-row">
                      <span class="am-bs-control-label">Posisi X</span>
                      <span id="am-bs-shadow-x-val" class="am-bs-val-box">${shadowX} px</span>
                    </div>
                    <input type="range" id="am-bs-shadow-x" min="-200" max="200" value="${shadowX}" class="am-bs-slider">
                  </div>
                  <div class="am-bs-offset-col">
                    <div class="am-bs-label-row">
                      <span class="am-bs-control-label">Posisi Y</span>
                      <span id="am-bs-shadow-y-val" class="am-bs-val-box">${shadowY} px</span>
                    </div>
                    <input type="range" id="am-bs-shadow-y" min="-200" max="200" value="${shadowY}" class="am-bs-slider">
                  </div>
                </div>

                <div class="am-bs-section">
                  <div class="am-bs-label-row">
                    <span class="am-bs-control-label">Warna Bayangan</span>
                    <input type="color" id="am-bs-shadow-color-picker" value="${shadowColor}" style="width:28px;height:24px;border:0;background:transparent;cursor:pointer;">
                  </div>
                  <div class="am-bs-palette-grid">
                    ${paletteColors.map(c => `
                      <div class="am-bs-palette-chip ${c.toLowerCase() === shadowColor.toLowerCase() ? 'active' : ''}" data-color="${c}" style="background:${c};" title="${c}"></div>
                    `).join('')}
                  </div>
                </div>
              ` : `
                <div style="text-align:center;color:#8c93a7;padding:26px 16px;font-size:12px;background:#181b2a;border-radius:10px;border:1px dashed rgba(255,255,255,0.08);">
                  Aktifkan switch di atas untuk menambahkan efek bayangan (drop shadow) pada layer ini.
                </div>
              `}
            `}
          </div>

          <!-- Right Rail (fragment_settings_base.xml) -->
          <div class="am-bs-sidebar-right">
            <button type="button" id="am-bs-tab-border" class="am-bs-tab-btn ${activeTab === 'border' ? 'active' : ''}" title="Garis Batas (Stroke)">
              <svg viewBox="0 0 95 95" width="22" height="22" fill="none">
                <path d="M16.5,4.5 L78.5,4.5 A12,12 0 0 1 90.5,16.5 L90.5,78.5 A12,12 0 0 1 78.5,90.5 L16.5,90.5 A12,12 0 0 1 4.5,78.5 L4.5,16.5 A12,12 0 0 1 16.5,4.5 Z" stroke="currentColor" stroke-width="9"/>
                <path d="M22,15 L73,15 A7,7 0 0 1 80,22 L80,73 A7,7 0 0 1 73,80 L22,80 A7,7 0 0 1 15,73 L15,22 A7,7 0 0 1 22,15 Z" stroke="currentColor" stroke-width="4" stroke-opacity="0.35"/>
              </svg>
            </button>
            <button type="button" id="am-bs-tab-shadow" class="am-bs-tab-btn ${activeTab === 'shadow' ? 'active' : ''}" title="Bayangan (Shadow)">
              <svg viewBox="0 0 95 95" width="22" height="22" fill="none">
                <path d="M94.16,15.88 C94.16,7.11 87.05,0 78.28,0 L15.88,0 C7.11,0 0,7.11 0,15.88 L0,76.45 C0,85.22 7.11,92.33 15.88,92.33 L38.37,94.33 L18.25,73.94 C16.99,72.66 18.1,70.07 18.1,68.14 L18.1,24.2 C18.1,20.32 21.24,17.18 25.11,17.18 L69.05,17.18 C71.17,17.18 73.75,18.26 75.07,17.39 L94.16,36.42 Z" fill="currentColor" fill-opacity="0.35"/>
                <path d="M25,17 L69,17 A7,7 0 0 1 76,24 L76,68 A7,7 0 0 1 69,75 L25,75 A7,7 0 0 1 18,68 L18,24 A7,7 0 0 1 25,17 Z" stroke="currentColor" stroke-width="4"/>
              </svg>
            </button>
          </div>
        </div>
      `;

      // Rail navigation handlers
      const btnBack = contentEl.querySelector("#am-bs-btn-back");
      if (btnBack) {
        btnBack.onclick = () => {
          const subpanel = document.getElementById("am-subpanel-container");
          if (subpanel) subpanel.classList.remove("open");
          const ep = document.getElementById("am-element-edit-panel");
          if (ep) ep.style.display = "flex";
        };
      }

      const btnKf = contentEl.querySelector("#am-bs-btn-kf");
      if (btnKf) {
        btnKf.onclick = () => {
          const propKey = activeTab === "border" ? "stroke" : "shadow";
          if (hasKf) {
            if (I.omKfRemoveAt) I.omKfRemoveAt(propKey, layer);
            else if (typeof window.omKfRemoveAt === "function") window.omKfRemoveAt(propKey, layer);
          } else {
            if (I.omKfInsert) I.omKfInsert(propKey, layer);
            else if (typeof window.omKfInsert === "function") window.omKfInsert(propKey, layer);
          }
          render();
        };
      }

      const btnCurve = contentEl.querySelector("#am-bs-btn-curve");
      if (btnCurve) {
        btnCurve.onclick = () => {
          const propKey = activeTab === "border" ? "stroke" : "shadow";
          if (typeof window.omOpenCurveEditor === "function") {
            window.omOpenCurveEditor({
              prop: propKey,
              layer,
              title: activeTab === "border" ? "GARIS BATAS" : "BAYANGAN",
              onBack: () => openSubpanel("Batas & Bayangan", renderBorderShadow)
            });
          }
        };
      }

      // Tab switcher
      const tabBorder = contentEl.querySelector("#am-bs-tab-border");
      const tabShadow = contentEl.querySelector("#am-bs-tab-shadow");
      if (tabBorder) tabBorder.onclick = () => { activeTab = "border"; render(); };
      if (tabShadow) tabShadow.onclick = () => { activeTab = "shadow"; render(); };

      // Switch toggle
      const switchToggle = contentEl.querySelector("#color_switch");
      if (switchToggle) {
        switchToggle.onchange = () => {
          beginChange();
          if (activeTab === "border") {
            layer.strokeEnabled = switchToggle.checked;
            if (switchToggle.checked && (!layer.strokeWidth || layer.strokeWidth <= 0)) {
              layer.strokeWidth = 10;
            }
          } else {
            layer.shadowEnabled = switchToggle.checked;
            if (switchToggle.checked && (!layer.shadowRadius || layer.shadowRadius <= 0)) {
              layer.shadowRadius = 25;
            }
          }
          syncLayerFx();
          commitChange();
          render();
        };
      }

      // Color view click & input
      const colorViewInput = contentEl.querySelector(".am-color-view-input");
      if (colorViewInput) {
        colorViewInput.oninput = () => {
          beginChange();
          if (activeTab === "border") {
            layer.strokeColor = colorViewInput.value;
          } else {
            layer.shadowColor = colorViewInput.value;
          }
          const cv = contentEl.querySelector("#color_view");
          if (cv) cv.style.background = colorViewInput.value;
          syncLayerFx();
        };
        colorViewInput.onchange = () => {
          commitChange();
          render();
        };
      }

      // Stroke Width 1:1 ValueSpinner (strokeWidthSpinner & strokeWidthValue)
      const strokeSpinner = contentEl.querySelector("#strokeWidthSpinner");
      if (strokeSpinner) {
        createValueSpinner(strokeSpinner, {
          min: 0,
          max: 200,
          step: 0.5,
          getVal: () => layer.strokeWidth !== undefined ? Number(layer.strokeWidth) : 10,
          setVal: (v) => {
            beginChange();
            layer.strokeWidth = Math.round(v * 10) / 10;
            const valBox = contentEl.querySelector("#strokeWidthValue");
            if (valBox) valBox.textContent = layer.strokeWidth + " px";
            syncLayerFx();
          },
          onChange: () => {
            commitChange();
          }
        });
      }

      // Cap Selector (Butt, Round, Square)
      contentEl.querySelectorAll("#capSelector button").forEach(btn => {
        btn.onclick = () => {
          beginChange();
          layer.strokeCap = btn.dataset.cap;
          syncLayerFx();
          commitChange();
          render();
        };
      });

      // Join Selector (Bevel, Round, Miter)
      contentEl.querySelectorAll("#joinSelector button").forEach(btn => {
        btn.onclick = () => {
          beginChange();
          layer.strokeJoin = btn.dataset.join;
          syncLayerFx();
          commitChange();
          render();
        };
      });

      // Stroke Position Buttons
      contentEl.querySelectorAll(".am-pos-btn").forEach(btn => {
        btn.onclick = () => {
          beginChange();
          layer.strokePosition = btn.dataset.pos;
          syncLayerFx();
          commitChange();
          render();
        };
      });

      // Stroke Color Picker
      const strokePicker = contentEl.querySelector("#am-bs-stroke-color-picker");
      if (strokePicker) {
        strokePicker.oninput = () => {
          beginChange();
          layer.strokeColor = strokePicker.value;
          const cv = contentEl.querySelector("#color_view");
          if (cv) cv.style.background = strokePicker.value;
          syncLayerFx();
        };
        strokePicker.onchange = () => {
          commitChange();
          render();
        };
      }

      // Shadow Radius 1:1 ValueSpinner (am-bs-shadow-r & am-bs-shadow-r-val)
      const shadowR = contentEl.querySelector("#am-bs-shadow-r");
      if (shadowR) {
        createValueSpinner(shadowR, {
          min: 0,
          max: 200,
          step: 1,
          getVal: () => layer.shadowRadius !== undefined ? Number(layer.shadowRadius) : 25,
          setVal: (v) => {
            beginChange();
            layer.shadowRadius = Math.round(v);
            const valBox = contentEl.querySelector("#am-bs-shadow-r-val");
            if (valBox) valBox.textContent = layer.shadowRadius + " px";
            syncLayerFx();
          },
          onChange: () => {
            commitChange();
          }
        });
      }

      // Shadow Alpha Slider
      const shadowA = contentEl.querySelector("#am-bs-shadow-a");
      if (shadowA) {
        shadowA.addEventListener("pointerdown", beginChange);
        shadowA.oninput = () => {
          beginChange();
          layer.shadowAlpha = Number(shadowA.value);
          const v = contentEl.querySelector("#am-bs-shadow-a-val");
          if (v) v.textContent = layer.shadowAlpha + "%";
          syncLayerFx();
        };
        shadowA.onchange = () => {
          commitChange();
        };
      }

      // Shadow X Slider
      const shadowXIn = contentEl.querySelector("#am-bs-shadow-x");
      if (shadowXIn) {
        shadowXIn.addEventListener("pointerdown", beginChange);
        shadowXIn.oninput = () => {
          beginChange();
          layer.shadowX = Number(shadowXIn.value);
          const v = contentEl.querySelector("#am-bs-shadow-x-val");
          if (v) v.textContent = layer.shadowX + " px";
          syncLayerFx();
        };
        shadowXIn.onchange = () => {
          commitChange();
        };
      }

      // Shadow Y Slider
      const shadowYIn = contentEl.querySelector("#am-bs-shadow-y");
      if (shadowYIn) {
        shadowYIn.addEventListener("pointerdown", beginChange);
        shadowYIn.oninput = () => {
          beginChange();
          layer.shadowY = Number(shadowYIn.value);
          const v = contentEl.querySelector("#am-bs-shadow-y-val");
          if (v) v.textContent = layer.shadowY + " px";
          syncLayerFx();
        };
        shadowYIn.onchange = () => {
          commitChange();
        };
      }

      // Shadow Color Picker
      const shadowPicker = contentEl.querySelector("#am-bs-shadow-color-picker");
      if (shadowPicker) {
        shadowPicker.oninput = () => {
          beginChange();
          layer.shadowColor = shadowPicker.value;
          const cv = contentEl.querySelector("#color_view");
          if (cv) cv.style.background = shadowPicker.value;
          syncLayerFx();
        };
        shadowPicker.onchange = () => {
          commitChange();
          render();
        };
      }

      // Palette Chips
      contentEl.querySelectorAll(".am-bs-palette-chip").forEach(chip => {
        chip.onclick = () => {
          beginChange();
          if (activeTab === "border") {
            layer.strokeColor = chip.dataset.color;
          } else {
            layer.shadowColor = chip.dataset.color;
          }
          syncLayerFx();
          commitChange();
          render();
        };
      });
    }

    render();
  }

  function renderAudioVolume(contentEl, layer) {
    const I = window.__AM_INTERNAL || {};
    if (!layer) return;

    const hasAudio = !!(layer.tag === "audio" || layer.tag === "video" || layer.fillType === "media" || layer.src || layer.gain);

    if (!hasAudio) {
      contentEl.innerHTML = `
        <div class="am-vol-no-audio-container">
          <div class="am-vol-no-audio-text">Layer ini tidak memiliki audio</div>
        </div>
      `;
      return;
    }

    let curGain = 1;
    if (layer.gain != null) {
      if (typeof layer.gain === "number") {
        curGain = layer.gain;
      } else if (Array.isArray(layer.gain.value) && Number.isFinite(Number(layer.gain.value[0]))) {
        curGain = Number(layer.gain.value[0]);
      }
    }
    if (!Number.isFinite(curGain) || curGain < 0) curGain = 1;
    let curPercent = Math.max(0, Math.min(500, Math.round(curGain * 100)));
    let isMuted = curPercent === 0;
    let prevNonZeroGain = curPercent > 0 ? curPercent : 100;

    function calcDb(p) {
      if (p <= 0) return "-∞ dB";
      const db = 20 * Math.log10(p / 100);
      return (db >= 0 ? "+" : "") + db.toFixed(1) + " dB";
    }

    function checkHasKeyframe() {
      const gProp = layer.gain;
      const tSec = ((I.H || 0) / 1000);
      return !!(gProp && gProp.kfs && gProp.kfs.some(k => Math.abs(Number(k.t) - tSec) < 0.002));
    }

    function render() {
      const hasKf = checkHasKeyframe();
      contentEl.innerHTML = `
        <div class="am-vol-custom-base">
          <div class="am-vol-sidebar">
            <button type="button" id="am-vol-btn-back" class="am-vol-side-btn" title="Kembali">
              <img src="./icons/ac_ic_back.svg" alt="Back">
            </button>
            <button type="button" id="am-vol-btn-kf" class="am-vol-side-btn ${hasKf ? 'active' : ''}" title="${hasKf ? 'Hapus Keyframe' : 'Tambah Keyframe'}">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="${hasKf ? '#00ffa8' : 'none'}" stroke="${hasKf ? '#00ffa8' : '#fff'}" stroke-width="2">
                <path d="M12 2L4 12l8 10 8-10L12 2z"/>
              </svg>
            </button>
            <button type="button" id="am-vol-btn-curve" class="am-vol-side-btn" title="Kurva Easing">
              <img src="./icons/ac_ic_anim_curve.svg" alt="Curve">
            </button>
            <button type="button" id="am-vol-btn-mute" class="am-vol-side-btn ${isMuted ? 'active' : ''}" title="${isMuted ? 'Bunyikan' : 'Bisukan'}">
              <img src="./icons/${isMuted ? 'ac_ic_audio_mute.svg' : 'ac_ic_audio.svg'}" alt="Mute">
            </button>
          </div>

          <div class="am-vol-body">
            <div class="am-vol-top-bar">
              <div class="am-vol-top-tab" id="am-vol-tab-audio">
                <img src="./icons/ac_ic_audio.svg" alt="Audio">
                <div class="am-vol-tab-indicator"></div>
              </div>
            </div>

            <div class="am-vol-main-row">
              <img src="./icons/ac_ic_audiolevel.svg" class="am-vol-level-icon" alt="Audio Level">
              <input type="range" id="am-gain-slider" min="0" max="500" value="${curPercent}" class="am-vol-slider" title="Geser Gain (0% - 500%)">
              <div id="am-gain-value-box" class="am-gain-value-box" title="Klik untuk masukkan persentase/dB">
                <span class="am-gain-value-pct" id="am-gain-pct-text">${curPercent}%</span>
              </div>
            </div>
          </div>
        </div>
      `;

      const btnBack = contentEl.querySelector("#am-vol-btn-back");
      const btnKf = contentEl.querySelector("#am-vol-btn-kf");
      const btnCurve = contentEl.querySelector("#am-vol-btn-curve");
      const btnMute = contentEl.querySelector("#am-vol-btn-mute");
      const slider = contentEl.querySelector("#am-gain-slider");
      const valBox = contentEl.querySelector("#am-gain-value-box");
      const pctText = contentEl.querySelector("#am-gain-pct-text");

      if (btnBack) {
        btnBack.addEventListener("click", () => {
          const sub = document.getElementById("am-subpanel-container");
          if (sub) sub.classList.remove("open");
          const ep = document.getElementById("am-element-edit-panel");
          if (ep && currentSelectedLayer) ep.style.display = "flex";
        });
      }

      function applyVolume(val, skipKfUpdate) {
        curPercent = Math.max(0, Math.min(500, Math.round(Number(val) || 0)));
        if (curPercent > 0) prevNonZeroGain = curPercent;
        isMuted = curPercent === 0;
        const g = curPercent / 100;

        if (!layer.gain) layer.gain = { value: [g], kfs: [] };
        else if (Array.isArray(layer.gain.value)) layer.gain.value[0] = g;
        else layer.gain = { value: [g], kfs: [] };
        layer.userTouched = true;

        if (!skipKfUpdate && layer.gain && Array.isArray(layer.gain.kfs)) {
          const tSec = ((I.H || 0) / 1000);
          const idx = layer.gain.kfs.findIndex(k => Math.abs(Number(k.t) - tSec) < 0.002);
          if (idx >= 0) layer.gain.kfs[idx].v = [g];
        }

        if (I.omSetAudioGain) {
          I.omSetAudioGain(layer, g);
        }
        I.V = true;
        if (I.val2 && I.val2.renderAt) I.val2.renderAt(I.H);

        if (slider) slider.value = curPercent;
        if (pctText) pctText.textContent = curPercent + "%";
        if (btnMute) {
          btnMute.classList.toggle("active", isMuted);
          const icon = btnMute.querySelector("img");
          if (icon) icon.src = `./icons/${isMuted ? 'ac_ic_audio_mute.svg' : 'ac_ic_audio.svg'}`;
        }
      }

      if (slider) {
        slider.addEventListener("input", () => applyVolume(slider.value));
      }

      if (btnMute) {
        btnMute.addEventListener("click", () => {
          if (curPercent > 0) applyVolume(0);
          else applyVolume(prevNonZeroGain);
        });
      }

      if (btnKf) {
        btnKf.addEventListener("click", () => {
          const tSec = ((I.H || 0) / 1000);
          const has = checkHasKeyframe();
          if (has) {
            if (I.omKfRemoveAt) I.omKfRemoveAt("gain", layer);
            else if (layer.gain && layer.gain.kfs) {
              const idx = layer.gain.kfs.findIndex(k => Math.abs(Number(k.t) - tSec) < 0.002);
              if (idx >= 0) layer.gain.kfs.splice(idx, 1);
            }
          } else {
            if (I.omKfInsert) I.omKfInsert("gain", layer);
            else {
              if (!layer.gain) layer.gain = { value: [curPercent / 100], kfs: [] };
              layer.gain.kfs = layer.gain.kfs || [];
              const idx = layer.gain.kfs.findIndex(k => Math.abs(Number(k.t) - tSec) < 0.002);
              if (idx >= 0) layer.gain.kfs[idx].v = [curPercent / 100];
              else layer.gain.kfs.push({ t: tSec, v: [curPercent / 100], e: null, easing: null });
              layer.gain.kfs.sort((a, b) => a.t - b.t);
            }
          }
          layer.userTouched = true;
          I.V = true;
          if (I.val2 && I.val2.renderAt) I.val2.renderAt(I.H);
          render();
        });
      }

      if (btnCurve) {
        btnCurve.addEventListener("click", () => {
          if (typeof window.omOpenCurveEditor === "function") {
            window.omOpenCurveEditor({
              prop: "gain",
              layer,
              title: "Volume",
              onBack: () => openSubpanel("Volume & Audio", renderAudioVolume)
            });
          }
        });
      }

      if (valBox) {
        valBox.addEventListener("click", () => {
          const input = prompt("Masukkan persentase volume (0 - 500%):", curPercent);
          if (input !== null) {
            const num = parseFloat(input);
            if (!isNaN(num)) applyVolume(num);
          }
        });
      }

    }

    render();
  }

  // 1:1 Move & Transform (fragment_move_transform.xml & fragment_settings_base.xml)
  function renderMoveTransform(contentEl, layer) {
    const I = window.__AM_INTERNAL || {};
    if (!layer) return;

    let activeTab = "move";
    let isPivotMode = false;
    let isZMode = false;
    let isScaleLinked = true;

    function getTransform() {
      if (!layer.transform) {
        layer.transform = {
          location: { value: [0, 0, 0], kfs: [] },
          pivot: { value: [0, 0, 0], kfs: [] },
          rotation: { value: 0, kfs: [] },
          scale: { value: [1, 1], kfs: [] },
          skew: { value: [0, 0], kfs: [] }
        };
      }
      return layer.transform;
    }

    function getPropKey() {
      if (activeTab === "move") return isPivotMode ? "pivot" : "loc";
      if (activeTab === "rotate") return "rot";
      if (activeTab === "scale") return "sc";
      if (activeTab === "skew") return "skew";
      return "loc";
    }

    function checkHasKeyframe() {
      const t = getTransform();
      const propKey = getPropKey();
      let keyable = null;
      if (propKey === "loc") keyable = t.location;
      else if (propKey === "pivot") keyable = t.pivot;
      else if (propKey === "rot") keyable = t.rotation;
      else if (propKey === "sc") keyable = t.scale;
      else if (propKey === "skew") keyable = t.skew;

      const tSec = ((I.H || 0) / 1000);
      return !!(keyable && keyable.kfs && keyable.kfs.some(k => Math.abs(Number(k.t) - tSec) < 0.002));
    }

    function commitTransform(propKey) {
      layer.userTouched = true;
      I.V = true;
      if (I.render8) I.render8();
      if (I.bind4) I.bind4();
      if (I.omScheduleSave) I.omScheduleSave();
    }

    function render() {
      const t = getTransform();
      const hasKf = checkHasKeyframe();

      const locVal = (t.location && Array.isArray(t.location.value)) ? t.location.value : [0, 0, 0];
      const pvtVal = (t.pivot && Array.isArray(t.pivot.value)) ? t.pivot.value : [0, 0, 0];
      const rotVal = (t.rotation != null && typeof t.rotation.value === "number") ? t.rotation.value : (Number(t.rotation) || 0);
      const scVal = (t.scale && Array.isArray(t.scale.value)) ? t.scale.value : [1, 1];
      const skewVal = (t.skew && Array.isArray(t.skew.value)) ? t.skew.value : [0, 0];

      const curX = isPivotMode ? Math.round(pvtVal[0] || 0) : Math.round(locVal[0] || 0);
      const curY = isPivotMode ? Math.round(pvtVal[1] || 0) : Math.round(locVal[1] || 0);
      const curZ = isPivotMode ? Math.round(pvtVal[2] || 0) : Math.round(locVal[2] || 0);
      const curRot = (Math.round(rotVal * 10) / 10).toFixed(1);
      const curScaleW = Math.round((scVal[0] || 1) * 100);
      const curScaleH = Math.round((scVal[1] || 1) * 100);
      const curSkewX = (Math.round((skewVal[0] || 0) * 10) / 10).toFixed(1);
      const curSkewY = (Math.round((skewVal[1] || 0) * 10) / 10).toFixed(1);

      contentEl.innerHTML = `
        <div class="am-mt-root">
          <!-- Left Rail (fragment_settings_base.xml) -->
          <div class="am-mt-sidebar-left">
            <button type="button" id="am-mt-btn-back" class="am-vol-side-btn" title="Kembali">
              <img src="./icons/ac_ic_back.svg" alt="Back">
            </button>
            <button type="button" id="am-mt-btn-kf" class="am-vol-side-btn ${hasKf ? 'active' : ''}" title="${hasKf ? 'Hapus Keyframe' : 'Tambah Keyframe'}">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="${hasKf ? '#00ffa8' : 'none'}" stroke="${hasKf ? '#00ffa8' : '#fff'}" stroke-width="2">
                <path d="M12 2L4 12l8 10 8-10L12 2z"/>
              </svg>
            </button>
            <button type="button" id="am-mt-btn-curve" class="am-vol-side-btn" title="Kurva Easing">
              <img src="./icons/ac_ic_anim_curve.svg" alt="Curve">
            </button>
            <div style="flex:1;"></div>
          </div>

          <!-- Center Content Area -->
          <div class="am-mt-center">
            ${activeTab === "move" ? `
              <!-- Location Readouts: locationXYHolder & locationZ -->
              <div class="am-mt-top-readouts">
                <div class="am-mt-pill-group">
                  <div class="am-mt-pill clickable ${!isZMode ? 'selected' : ''}" id="am-mt-readout-xy">
                    <span class="am-mt-pill-val" id="am-mt-val-x">${curX}</span>
                    <span class="am-mt-pill-lbl">X</span>
                    <span style="color:rgba(255,255,255,0.2);margin:0 2px;">|</span>
                    <span class="am-mt-pill-val" id="am-mt-val-y">${curY}</span>
                    <span class="am-mt-pill-lbl">Y</span>
                  </div>
                </div>
                <div class="am-mt-pill clickable ${isZMode ? 'selected' : ''}" id="am-mt-readout-z" style="margin-left: 8px;">
                  <span class="am-mt-pill-val" id="am-mt-val-z">${curZ}</span>
                  <span class="am-mt-pill-lbl">Z</span>
                </div>
              </div>

              <!-- Trackpad: ControlPad (@id/trackpad / @id/pivotPad) -->
              <div class="am-mt-pad" id="am-mt-trackpad">
                <div class="am-mt-corner am-mt-nw"></div>
                <div class="am-mt-corner am-mt-ne"></div>
                <div class="am-mt-corner am-mt-sw"></div>
                <div class="am-mt-corner am-mt-se"></div>

                ${isZMode ? `
                  <div class="am-mt-z-guide-wrap">
                    <svg class="am-mt-z-arrow" viewBox="0 0 24 24" fill="none" stroke="#00ffa8" stroke-width="2.5"><path d="M12 19V5M5 12l7-7 7 7"/></svg>
                    <span class="am-mt-z-text">Sesuaikan posisi Z</span>
                    <svg class="am-mt-z-arrow" viewBox="0 0 24 24" fill="none" stroke="#00ffa8" stroke-width="2.5"><path d="M12 5v14m7-7l-7 7-7-7"/></svg>
                  </div>
                ` : `
                  <div class="am-mt-pad-guide" id="am-mt-pad-guide">
                    ${isPivotMode ? 'Geser di sini untuk memindahkan poros' : 'Geser di sini untuk memindahkan layer'}
                  </div>
                `}
              </div>
            ` : ''}

            ${activeTab === "rotate" ? `
              <!-- Rotate Dial: RotateView (@id/rotatePad) -->
              <div class="am-mt-top-readouts">
                <div class="am-mt-pill selected" style="min-width: 90px;">
                  <span class="am-mt-pill-val" id="am-mt-val-rot">${curRot}°</span>
                  <span class="am-mt-pill-lbl">SUDUT</span>
                </div>
              </div>

              <canvas id="am-mt-rotate-canvas" class="am-mt-rotate-canvas"></canvas>
            ` : ''}

            ${activeTab === "scale" ? `
              <!-- Scale Readouts: elementWidth, elementLink, elementHeight -->
              <div class="am-mt-top-readouts">
                <div class="am-mt-pill selected" id="am-mt-readout-sx">
                  <span class="am-mt-pill-val" id="am-mt-val-sx">${curScaleW} px</span>
                  <span class="am-mt-pill-lbl">LEBAR</span>
                </div>
                <button type="button" id="am-mt-btn-link" class="am-mt-link-btn ${isScaleLinked ? 'active' : ''}" title="${isScaleLinked ? 'Buka Kunci Rasio' : 'Kunci Rasio'}">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                    ${isScaleLinked ? `
                      <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/>
                      <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/>
                    ` : `
                      <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/>
                      <path d="M15 3h6v6"/>
                      <path d="M10 14L21 3"/>
                    `}
                  </svg>
                </button>
                <div class="am-mt-pill selected" id="am-mt-readout-sy">
                  <span class="am-mt-pill-val" id="am-mt-val-sy">${curScaleH} px</span>
                  <span class="am-mt-pill-lbl">TINGGI</span>
                </div>
              </div>

              <div class="am-mt-scale-desc">
                ${isScaleLinked ? 'Rasio skala terkunci: lebar dan tinggi seimbang' : 'Rasio skala bebas: atur lebar dan tinggi terpisah'}
              </div>

              <!-- Scale Spinners: ValueSpinner (@id/scaleSpinner vs @id/scaleSpinnerWidth/@id/scaleSpinnerHeight) -->
              <div class="am-mt-spinners-container">
                ${isScaleLinked ? `
                  <div class="am-mt-spinner-row">
                    <div class="am-mt-spinner-box">
                      <canvas id="am-mt-scale-spinner" class="am-mt-spinner-canvas"></canvas>
                    </div>
                  </div>
                ` : `
                  <div class="am-mt-spinner-row">
                    <span class="am-mt-spinner-label">LEBAR</span>
                    <div class="am-mt-spinner-box">
                      <canvas id="am-mt-scale-w-spinner" class="am-mt-spinner-canvas"></canvas>
                    </div>
                  </div>
                  <div class="am-mt-spinner-row">
                    <span class="am-mt-spinner-label">TINGGI</span>
                    <div class="am-mt-spinner-box">
                      <canvas id="am-mt-scale-h-spinner" class="am-mt-spinner-canvas"></canvas>
                    </div>
                  </div>
                `}
              </div>
            ` : ''}

            ${activeTab === "skew" ? `
              <!-- Skew Readouts: skewAmountX & skewAmountY -->
              <div class="am-mt-top-readouts">
                <div class="am-mt-pill selected" id="am-mt-readout-skewx">
                  <span class="am-mt-pill-val" id="am-mt-val-skewx">${curSkewX}°</span>
                  <span class="am-mt-pill-lbl">X SKEW</span>
                </div>
                <div class="am-mt-pill selected" id="am-mt-readout-skewy" style="margin-left: 8px;">
                  <span class="am-mt-pill-val" id="am-mt-val-skewy">${curSkewY}°</span>
                  <span class="am-mt-pill-lbl">Y SKEW</span>
                </div>
              </div>

              <!-- Skew Spinners: ValueSpinner (@id/skewSpinnerX & @id/skewSpinnerY) -->
              <div class="am-mt-spinners-container">
                <div class="am-mt-spinner-row">
                  <span class="am-mt-spinner-label">KEMIRINGAN X</span>
                  <div class="am-mt-spinner-box">
                    <canvas id="am-mt-skew-x-spinner" class="am-mt-spinner-canvas"></canvas>
                  </div>
                </div>
                <div class="am-mt-spinner-row">
                  <span class="am-mt-spinner-label">KEMIRINGAN Y</span>
                  <div class="am-mt-spinner-box">
                    <canvas id="am-mt-skew-y-spinner" class="am-mt-spinner-canvas"></canvas>
                  </div>
                </div>
              </div>
            ` : ''}
          </div>

          <!-- Right Rail Tabs (fragment_move_transform.xml tabs) -->
          <div class="am-mt-sidebar-right">
            <button type="button" id="am-mt-tab-move" class="am-mt-tab-btn ${activeTab === 'move' ? 'active' : ''}" title="${isPivotMode ? 'Mode Titik Poros (Klik untuk Layer)' : 'Mode Layer (Klik untuk Titik Poros)'}">
              <img src="./icons/${isPivotMode ? 'ac_ic_move_pivot.svg' : 'ac_ic_move.svg'}" alt="Move">
            </button>
            <button type="button" id="am-mt-tab-rotate" class="am-mt-tab-btn ${activeTab === 'rotate' ? 'active' : ''}" title="Rotasi">
              <img src="./icons/ac_ic_rotate.svg" alt="Rotate">
            </button>
            <button type="button" id="am-mt-tab-scale" class="am-mt-tab-btn ${activeTab === 'scale' ? 'active' : ''}" title="Skala & Ukuran">
              <img src="./icons/ac_ic_scale.svg" alt="Scale">
            </button>
            <button type="button" id="am-mt-tab-skew" class="am-mt-tab-btn ${activeTab === 'skew' ? 'active' : ''}" title="Kemiringan (Skew)">
              <img src="./icons/ac_ic_skew.svg" alt="Skew">
            </button>
          </div>
        </div>
      `;

      // ── Event Bindings ──
      const btnBack = document.getElementById("am-mt-btn-back");
      const btnKf = document.getElementById("am-mt-btn-kf");
      const btnCurve = document.getElementById("am-mt-btn-curve");
      const tabMove = document.getElementById("am-mt-tab-move");
      const tabRotate = document.getElementById("am-mt-tab-rotate");
      const tabScale = document.getElementById("am-mt-tab-scale");
      const tabSkew = document.getElementById("am-mt-tab-skew");
      const btnLink = document.getElementById("am-mt-btn-link");

      if (btnBack) {
        btnBack.addEventListener("click", () => {
          const sub = document.getElementById("am-subpanel-container");
          if (sub) sub.classList.remove("open");
          const ep = document.getElementById("am-element-edit-panel");
          if (ep) ep.style.display = "flex";
        });
      }

      if (btnKf) {
        btnKf.addEventListener("click", () => {
          const propKey = getPropKey();
          if (typeof window.omKfInsert === "function") {
            window.omKfInsert(propKey, layer);
          } else if (I.omKfInsert) {
            I.omKfInsert(propKey, layer);
          }
          render();
        });
      }

      if (btnCurve) {
        btnCurve.addEventListener("click", () => {
          const propKey = getPropKey();
          if (typeof window.omOpenCurveEditor === "function") {
            window.omOpenCurveEditor({
              prop: propKey,
              layer,
              title: activeTab.toUpperCase(),
              onBack: () => openSubpanel("Move & Transform", renderMoveTransform)
            });
          }
        });
      }

      if (tabMove) {
        tabMove.addEventListener("click", () => {
          if (activeTab === "move") {
            isPivotMode = !isPivotMode;
          } else {
            activeTab = "move";
          }
          render();
        });
      }
      if (tabRotate) {
        tabRotate.addEventListener("click", () => {
          activeTab = "rotate";
          render();
        });
      }
      if (tabScale) {
        tabScale.addEventListener("click", () => {
          activeTab = "scale";
          render();
        });
      }
      if (tabSkew) {
        tabSkew.addEventListener("click", () => {
          activeTab = "skew";
          render();
        });
      }

      if (btnLink) {
        btnLink.addEventListener("click", () => {
          isScaleLinked = !isScaleLinked;
          render();
        });
      }

      // ── Tab 0: Move / Pivot & Z Trackpad ──
      const pillXY = document.getElementById("am-mt-readout-xy");
      const pillZ = document.getElementById("am-mt-readout-z");
      if (pillXY) {
        pillXY.addEventListener("click", () => {
          isZMode = false;
          render();
        });
      }
      if (pillZ) {
        pillZ.addEventListener("click", () => {
          isZMode = true;
          render();
        });
      }

      const trackpad = document.getElementById("am-mt-trackpad");
      if (trackpad) {
        let startX = 0, startY = 0, initX = 0, initY = 0, initZ = 0;
        let isDragging = false;

        trackpad.addEventListener("pointerdown", e => {
          isDragging = true;
          trackpad.setPointerCapture(e.pointerId);
          startX = e.clientX;
          startY = e.clientY;
          const targetArr = isPivotMode ? pvtVal : locVal;
          initX = targetArr[0] || 0;
          initY = targetArr[1] || 0;
          initZ = targetArr[2] || 0;
        });

        trackpad.addEventListener("pointermove", e => {
          if (!isDragging) return;
          const dx = e.clientX - startX;
          const dy = e.clientY - startY;
          const targetKeyable = isPivotMode ? (t.pivot || { value: [0, 0, 0] }) : (t.location || { value: [0, 0, 0] });
          if (!targetKeyable.value) targetKeyable.value = [0, 0, 0];

          if (isZMode) {
            targetKeyable.value[2] = Math.round(initZ - dy * 2);
            const rz = document.getElementById("am-mt-val-z");
            if (rz) rz.textContent = targetKeyable.value[2];
          } else {
            targetKeyable.value[0] = Math.round(initX + dx);
            targetKeyable.value[1] = Math.round(initY + dy);
            const rx = document.getElementById("am-mt-val-x");
            const ry = document.getElementById("am-mt-val-y");
            if (rx) rx.textContent = targetKeyable.value[0];
            if (ry) ry.textContent = targetKeyable.value[1];
          }

          commitTransform(isPivotMode ? "pivot" : "loc");
        });

        const stopDrag = e => {
          if (!isDragging) return;
          isDragging = false;
          try { trackpad.releasePointerCapture(e.pointerId); } catch (_) {}
          render();
        };
        trackpad.addEventListener("pointerup", stopDrag);
        trackpad.addEventListener("pointercancel", stopDrag);
      }

      // ── Tab 1: RotateView Canvas ──
      const rotCanvas = document.getElementById("am-mt-rotate-canvas");
      if (rotCanvas) {
        createRotateView(rotCanvas, {
          getVal: () => {
            const r = (t.rotation != null && typeof t.rotation.value === "number") ? t.rotation.value : (Number(t.rotation) || 0);
            return r;
          },
          setVal: (v) => {
            if (t.rotation == null || typeof t.rotation === "number") {
              t.rotation = { value: v, kfs: [] };
            } else {
              t.rotation.value = v;
            }
            const valEl = document.getElementById("am-mt-val-rot");
            if (valEl) valEl.textContent = (Math.round(v * 10) / 10).toFixed(1) + "°";
            commitTransform("rot");
          }
        });
      }

      // ── Tab 2: Scale ValueSpinners ──
      if (activeTab === "scale") {
        if (isScaleLinked) {
          const sCanvas = document.getElementById("am-mt-scale-spinner");
          if (sCanvas) {
            createValueSpinner(sCanvas, {
              min: 1,
              max: 5000,
              step: 1,
              getVal: () => Math.round((scVal[0] || 1) * 100),
              setVal: (v) => {
                const norm = Math.max(0.01, v / 100);
                if (!t.scale) t.scale = { value: [1, 1], kfs: [] };
                t.scale.value = [norm, norm];
                const rx = document.getElementById("am-mt-val-sx");
                const ry = document.getElementById("am-mt-val-sy");
                if (rx) rx.textContent = Math.round(v) + " px";
                if (ry) ry.textContent = Math.round(v) + " px";
                commitTransform("sc");
              }
            });
          }
        } else {
          const sWCanvas = document.getElementById("am-mt-scale-w-spinner");
          const sHCanvas = document.getElementById("am-mt-scale-h-spinner");
          if (sWCanvas) {
            createValueSpinner(sWCanvas, {
              min: 1,
              max: 5000,
              step: 1,
              getVal: () => Math.round((scVal[0] || 1) * 100),
              setVal: (v) => {
                const norm = Math.max(0.01, v / 100);
                if (!t.scale) t.scale = { value: [1, 1], kfs: [] };
                t.scale.value[0] = norm;
                const rx = document.getElementById("am-mt-val-sx");
                if (rx) rx.textContent = Math.round(v) + " px";
                commitTransform("sc");
              }
            });
          }
          if (sHCanvas) {
            createValueSpinner(sHCanvas, {
              min: 1,
              max: 5000,
              step: 1,
              getVal: () => Math.round((scVal[1] || 1) * 100),
              setVal: (v) => {
                const norm = Math.max(0.01, v / 100);
                if (!t.scale) t.scale = { value: [1, 1], kfs: [] };
                t.scale.value[1] = norm;
                const ry = document.getElementById("am-mt-val-sy");
                if (ry) ry.textContent = Math.round(v) + " px";
                commitTransform("sc");
              }
            });
          }
        }
      }

      // ── Tab 3: Skew ValueSpinners ──
      if (activeTab === "skew") {
        const skXCanvas = document.getElementById("am-mt-skew-x-spinner");
        const skYCanvas = document.getElementById("am-mt-skew-y-spinner");
        if (skXCanvas) {
          createValueSpinner(skXCanvas, {
            min: -180,
            max: 180,
            step: 0.5,
            isAngle: true,
            getVal: () => (Math.round((skewVal[0] || 0) * 10) / 10),
            setVal: (v) => {
              if (!t.skew) t.skew = { value: [0, 0], kfs: [] };
              t.skew.value[0] = v;
              const rx = document.getElementById("am-mt-val-skewx");
              if (rx) rx.textContent = v.toFixed(1) + "°";
              commitTransform("skew");
            }
          });
        }
        if (skYCanvas) {
          createValueSpinner(skYCanvas, {
            min: -180,
            max: 180,
            step: 0.5,
            isAngle: true,
            getVal: () => (Math.round((skewVal[1] || 0) * 10) / 10),
            setVal: (v) => {
              if (!t.skew) t.skew = { value: [0, 0], kfs: [] };
              t.skew.value[1] = v;
              const ry = document.getElementById("am-mt-val-skewy");
              if (ry) ry.textContent = v.toFixed(1) + "°";
              commitTransform("skew");
            }
          });
        }
      }
    }

    render();
  }

  function drawFrustumCanvas(canvas, layer) {
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    const w = rect.width || canvas.width || 300;
    const h = rect.height || canvas.height || 72;

    if (canvas.width !== Math.round(w * dpr) || canvas.height !== Math.round(h * dpr)) {
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
    }
    ctx.resetTransform();
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, w, h);

    const isPerspective = !layer.cameraType || layer.cameraType === "perspective";
    const midY = h / 2;
    const move5dp = 6;
    const camX = 28;
    const endX = w - 16;

    if (isPerspective) {
      const fov = (layer.fov && layer.fov > 0) ? layer.fov : 60;
      const halfRad = (fov / 2) * Math.PI / 180;
      const spreadH = Math.min(midY - 6, (endX - camX) * Math.tan(halfRad) * 0.45);
      const topY = Math.max(4, midY - spreadH);
      const botY = Math.min(h - 4, midY + spreadH);

      const grad = ctx.createLinearGradient(camX, midY, endX, midY);
      grad.addColorStop(0, "rgba(0, 255, 168, 0.22)");
      grad.addColorStop(1, "rgba(0, 255, 168, 0.02)");
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.moveTo(camX, midY - move5dp);
      ctx.lineTo(endX, topY);
      ctx.lineTo(endX, botY);
      ctx.lineTo(camX, midY + move5dp);
      ctx.closePath();
      ctx.fill();

      ctx.strokeStyle = "#00ffa8";
      ctx.lineWidth = 1.8;
      ctx.setLineDash([]);
      ctx.beginPath();
      ctx.moveTo(camX, midY - move5dp);
      ctx.lineTo(endX, topY);
      ctx.moveTo(camX, midY + move5dp);
      ctx.lineTo(endX, botY);
      ctx.stroke();

      ctx.strokeStyle = "rgba(255, 255, 255, 0.35)";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(endX, topY);
      ctx.lineTo(endX, botY);
      ctx.stroke();
    } else {
      const distY = 16;
      const topY = midY - distY;
      const botY = midY + distY;

      ctx.fillStyle = "rgba(0, 255, 168, 0.08)";
      ctx.fillRect(camX, topY, endX - camX, botY - topY);

      ctx.strokeStyle = "#00ffa8";
      ctx.lineWidth = 1.8;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(camX, topY);
      ctx.lineTo(endX, topY);
      ctx.moveTo(camX, botY);
      ctx.lineTo(endX, botY);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.strokeStyle = "rgba(255, 255, 255, 0.35)";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(endX, topY);
      ctx.lineTo(endX, botY);
      ctx.stroke();
    }

    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(camX - 6, midY, 4, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = "rgba(255, 255, 255, 0.6)";
    ctx.lineWidth = 1.2;
    ctx.strokeRect(camX - 18, midY - 9, 12, 18);
  }

  function renderCameraOptions(contentEl, layer) {
    const I = window.__AM_INTERNAL || {};
    if (!layer) return;

    if (!layer.cameraType) layer.cameraType = "perspective";
    if (typeof layer.fov !== "number" || layer.fov <= 0) layer.fov = 60;
    if (typeof layer.cameraZoom !== "number" || layer.cameraZoom <= 0) {
      let locZ = 500;
      if (layer.transform && layer.transform.location) {
        if (Array.isArray(layer.transform.location.value)) locZ = layer.transform.location.value[2] || 500;
        else if (Array.isArray(layer.transform.location)) locZ = layer.transform.location[2] || 500;
      }
      layer.cameraZoom = locZ;
    }
    if (!layer.focusBlur) {
      layer.focusBlur = { enabled: false, distance: layer.cameraZoom || 500, depthOfField: 100, strength: 0.5 };
    }
    if (!layer.fog) {
      layer.fog = { enabled: false, color: [1, 1, 1, 1], nearZ: 0, farZ: Math.round((layer.cameraZoom || 500) * 1.5) };
    }

    let activeTab = "view";

    function commitCamera(updateZ) {
      if (updateZ && layer.transform && layer.transform.location) {
        const zVal = layer.cameraZoom;
        if (Array.isArray(layer.transform.location.value)) {
          layer.transform.location.value[2] = zVal;
        } else if (Array.isArray(layer.transform.location)) {
          layer.transform.location[2] = zVal;
        }
      }
      I.V = true;
      if (I.val2 && typeof I.val2.renderAt === "function") {
        I.val2.renderAt(I.H || 0);
      }
      if (typeof I.omScheduleSave === "function") I.omScheduleSave();
    }

    function render() {
      const isPersp = layer.cameraType !== "orthographic";
      const curFov = Math.round(layer.fov || 60);
      const curZoom = Math.round(layer.cameraZoom || 500);

      const fb = layer.focusBlur;
      const fg = layer.fog;
      const fgColorHex = rgbaToHex(fg.color);

      contentEl.innerHTML = `
        <div class="am-camera-options-container">
          <div class="am-camera-tabs">
            <button type="button" class="am-camera-tab-btn ${activeTab === 'view' ? 'active' : ''}" data-tab="view" title="Tampilan Kamera">
              <img src="./icons/ic_camera.svg" alt="View">
              <span>Tampilan</span>
            </button>
            <button type="button" class="am-camera-tab-btn ${activeTab === 'focus_blur' ? 'active' : ''}" data-tab="focus_blur" title="Fokus Buram">
              <img src="./icons/ic_cameraoption_focusblur.svg" alt="Focus Blur">
              <span>Fokus Buram</span>
            </button>
            <button type="button" class="am-camera-tab-btn ${activeTab === 'fog' ? 'active' : ''}" data-tab="fog" title="Kabut">
              <img src="./icons/ic_cameraoption_fog.svg" alt="Fog">
              <span>Kabut</span>
            </button>
          </div>

          <div id="am-camera-tab-content">
            ${activeTab === "view" ? `
              <div class="am-camera-mode-card">
                <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;">
                  <button type="button" id="perspectiveButton" class="am-perspective-btn" title="Ganti Tipe Kamera (Perspektif / Paralel)">
                    <img src="./icons/${isPersp ? 'ic_camera_perspective.svg' : 'ic_camera_parallel.svg'}" alt="Perspective">
                  </button>
                  <span class="am-badge-mode" style="${isPersp ? '' : 'background:rgba(140,147,167,0.2);color:#8c93a7;'}">
                    ${isPersp ? 'PERSPEKTIF' : 'PARALEL'}
                  </span>
                </div>

                <div class="am-frustum-preview-box">
                  <canvas id="cameraLineView" class="am-frustum-canvas"></canvas>
                </div>

                ${isPersp ? `
                  <div class="am-camera-param-block" style="margin-top:12px;">
                    <div class="am-param-header">
                      <span class="am-param-label">Sudut Pandang (FOV)</span>
                      <span class="am-val-readout" id="am-cam-fov-text">${curFov}°</span>
                    </div>
                    <div class="am-val-stepper">
                      <button type="button" class="am-cam-step-btn" id="am-cam-fov-dec">-</button>
                      <input type="range" id="cameraAngleSpinner" class="am-vol-slider" min="10" max="120" step="1" value="${curFov}">
                      <button type="button" class="am-cam-step-btn" id="am-cam-fov-inc">+</button>
                    </div>
                  </div>
                ` : ''}

                <div class="am-camera-param-block" style="margin-top:12px;">
                  <div class="am-param-header">
                    <span class="am-param-label">Zoom</span>
                    <span class="am-val-readout" id="am-cam-zoom-text">${curZoom} px</span>
                  </div>
                  <div class="am-val-stepper">
                    <button type="button" class="am-cam-step-btn" id="am-cam-zoom-dec">-</button>
                    <input type="range" id="cameraZoomSpinner" class="am-vol-slider" min="100" max="3000" step="10" value="${curZoom}">
                    <button type="button" class="am-cam-step-btn" id="am-cam-zoom-inc">+</button>
                  </div>
                </div>
              </div>
            ` : ''}

            ${activeTab === "focus_blur" ? `
              <div class="am-camera-section-card">
                <div class="am-switch-header">
                  <div>
                    <div style="font-size:13px;font-weight:700;color:#fff;">Fokus Buram (Depth of Field)</div>
                    <div style="font-size:10px;color:#8c93a7;margin-top:2px;">Mengaburkan objek di luar bidang fokus</div>
                  </div>
                  <input type="checkbox" id="focusBlurSwitch" class="am-cam-switch" ${fb.enabled ? 'checked' : ''}>
                </div>

                ${fb.enabled ? `
                  <div class="am-cam-controls-group">
                    <div class="am-camera-param-block">
                      <div class="am-param-header">
                        <span class="am-param-label">Jarak Fokus</span>
                        <span class="am-val-readout" id="am-fb-dist-text">${Math.round(fb.distance != null ? fb.distance : 500)} px</span>
                      </div>
                      <div class="am-val-stepper">
                        <button type="button" class="am-cam-step-btn" id="am-fb-dist-dec">-</button>
                        <input type="range" id="am-fb-dist-slider" class="am-vol-slider" min="50" max="3000" step="10" value="${Math.round(fb.distance != null ? fb.distance : 500)}">
                        <button type="button" class="am-cam-step-btn" id="am-fb-dist-inc">+</button>
                      </div>
                    </div>

                    <div class="am-camera-param-block">
                      <div class="am-param-header">
                        <span class="am-param-label">Kedalaman Bidang (DoF)</span>
                        <span class="am-val-readout" id="am-fb-dof-text">${Math.round(fb.depthOfField != null ? fb.depthOfField : 100)} px</span>
                      </div>
                      <div class="am-val-stepper">
                        <button type="button" class="am-cam-step-btn" id="am-fb-dof-dec">-</button>
                        <input type="range" id="am-fb-dof-slider" class="am-vol-slider" min="10" max="1000" step="10" value="${Math.round(fb.depthOfField != null ? fb.depthOfField : 100)}">
                        <button type="button" class="am-cam-step-btn" id="am-fb-dof-inc">+</button>
                      </div>
                    </div>

                    <div class="am-camera-param-block">
                      <div class="am-param-header">
                        <span class="am-param-label">Kekuatan Buram</span>
                        <span class="am-val-readout" id="am-fb-str-text">${Number(fb.strength != null ? fb.strength : 0.5).toFixed(2)}x</span>
                      </div>
                      <div class="am-val-stepper">
                        <button type="button" class="am-cam-step-btn" id="am-fb-str-dec">-</button>
                        <input type="range" id="am-fb-str-slider" class="am-vol-slider" min="0" max="2" step="0.05" value="${Number(fb.strength != null ? fb.strength : 0.5)}">
                        <button type="button" class="am-cam-step-btn" id="am-fb-str-inc">+</button>
                      </div>
                    </div>
                  </div>
                ` : ''}
              </div>
            ` : ''}

            ${activeTab === "fog" ? `
              <div class="am-camera-section-card">
                <div class="am-switch-header">
                  <div>
                    <div style="font-size:13px;font-weight:700;color:#fff;">Kabut Atmosferik (Atmospheric Fog)</div>
                    <div style="font-size:10px;color:#8c93a7;margin-top:2px;">Menambahkan kabut kedalaman berdasarkan jarak Z</div>
                  </div>
                  <input type="checkbox" id="fogSwitch" class="am-cam-switch" ${fg.enabled ? 'checked' : ''}>
                </div>

                ${fg.enabled ? `
                  <div class="am-cam-controls-group">
                    <div class="am-camera-param-block">
                      <div class="am-param-header">
                        <span class="am-param-label">Warna Kabut</span>
                        <div style="display:flex;align-items:center;gap:8px;">
                          <input type="color" id="am-fog-color-native" value="${fgColorHex}" style="width:28px;height:24px;border:0;background:transparent;cursor:pointer;padding:0;">
                          <span class="am-val-readout" id="am-fog-color-text">${fgColorHex.toUpperCase()}</span>
                        </div>
                      </div>
                      <div class="am-palette-grid" style="grid-template-columns:repeat(8, 1fr);gap:6px;margin-top:6px;">
                        ${['#ffffff', '#000000', '#888888', '#64b5f6', '#ffb74d', '#ba68c8', '#81c784', '#e57373'].map(c => `
                          <div class="am-palette-chip ${fgColorHex.toLowerCase() === c.toLowerCase() ? 'active' : ''}" data-color="${c}" style="background-color:${c};"></div>
                        `).join('')}
                      </div>
                    </div>

                    <div class="am-camera-param-block">
                      <div class="am-param-header">
                        <span class="am-param-label">Jarak Awal Z (Near Z)</span>
                        <span class="am-val-readout" id="am-fog-near-text">${Math.round(fg.nearZ != null ? fg.nearZ : 0)} px</span>
                      </div>
                      <div class="am-val-stepper">
                        <button type="button" class="am-cam-step-btn" id="am-fog-near-dec">-</button>
                        <input type="range" id="am-fog-near-slider" class="am-vol-slider" min="0" max="2000" step="25" value="${Math.round(fg.nearZ != null ? fg.nearZ : 0)}">
                        <button type="button" class="am-cam-step-btn" id="am-fog-near-inc">+</button>
                      </div>
                    </div>

                    <div class="am-camera-param-block">
                      <div class="am-param-header">
                        <span class="am-param-label">Jarak Akhir Z (Far Z)</span>
                        <span class="am-val-readout" id="am-fog-far-text">${Math.round(fg.farZ != null ? fg.farZ : 1500)} px</span>
                      </div>
                      <div class="am-val-stepper">
                        <button type="button" class="am-cam-step-btn" id="am-fog-far-dec">-</button>
                        <input type="range" id="am-fog-far-slider" class="am-vol-slider" min="100" max="5000" step="50" value="${Math.round(fg.farZ != null ? fg.farZ : 1500)}">
                        <button type="button" class="am-cam-step-btn" id="am-fog-far-inc">+</button>
                      </div>
                    </div>
                  </div>
                ` : ''}
              </div>
            ` : ''}
          </div>
        </div>
      `;

      contentEl.querySelectorAll(".am-camera-tab-btn").forEach(btn => {
        btn.addEventListener("click", () => {
          activeTab = btn.dataset.tab;
          render();
        });
      });

      if (activeTab === "view") {
        const frustumCanvas = contentEl.querySelector("#cameraLineView");
        if (frustumCanvas) {
          requestAnimationFrame(() => drawFrustumCanvas(frustumCanvas, layer));
        }

        const btnPersp = contentEl.querySelector("#perspectiveButton");
        if (btnPersp) {
          btnPersp.addEventListener("click", () => {
            layer.cameraType = layer.cameraType === "orthographic" ? "perspective" : "orthographic";
            commitCamera(false);
            render();
          });
        }

        const fovSlider = contentEl.querySelector("#cameraAngleSpinner");
        const fovText = contentEl.querySelector("#am-cam-fov-text");
        const fovDec = contentEl.querySelector("#am-cam-fov-dec");
        const fovInc = contentEl.querySelector("#am-cam-fov-inc");

        const updateFov = (v) => {
          const clamped = Math.max(10, Math.min(120, Math.round(v)));
          layer.fov = clamped;
          if (fovSlider) fovSlider.value = clamped;
          if (fovText) fovText.textContent = clamped + "°";
          if (frustumCanvas) drawFrustumCanvas(frustumCanvas, layer);
          commitCamera(false);
        };

        if (fovSlider) {
          fovSlider.addEventListener("input", () => updateFov(parseFloat(fovSlider.value)));
        }
        if (fovDec) {
          fovDec.addEventListener("click", () => updateFov((layer.fov || 60) - 5));
        }
        if (fovInc) {
          fovInc.addEventListener("click", () => updateFov((layer.fov || 60) + 5));
        }

        const zoomSlider = contentEl.querySelector("#cameraZoomSpinner");
        const zoomText = contentEl.querySelector("#am-cam-zoom-text");
        const zoomDec = contentEl.querySelector("#am-cam-zoom-dec");
        const zoomInc = contentEl.querySelector("#am-cam-zoom-inc");

        const updateZoom = (v) => {
          const clamped = Math.max(100, Math.min(3000, Math.round(v)));
          layer.cameraZoom = clamped;
          if (zoomSlider) zoomSlider.value = clamped;
          if (zoomText) zoomText.textContent = clamped + " px";
          if (frustumCanvas) drawFrustumCanvas(frustumCanvas, layer);
          commitCamera(true);
        };

        if (zoomSlider) {
          zoomSlider.addEventListener("input", () => updateZoom(parseFloat(zoomSlider.value)));
        }
        if (zoomDec) {
          zoomDec.addEventListener("click", () => updateZoom((layer.cameraZoom || 500) - 50));
        }
        if (zoomInc) {
          zoomInc.addEventListener("click", () => updateZoom((layer.cameraZoom || 500) + 50));
        }
      }

      if (activeTab === "focus_blur") {
        const sw = contentEl.querySelector("#focusBlurSwitch");
        if (sw) {
          sw.addEventListener("change", () => {
            fb.enabled = sw.checked;
            commitCamera(false);
            render();
          });
        }

        const distSlider = contentEl.querySelector("#am-fb-dist-slider");
        const distText = contentEl.querySelector("#am-fb-dist-text");
        const distDec = contentEl.querySelector("#am-fb-dist-dec");
        const distInc = contentEl.querySelector("#am-fb-dist-inc");

        const updateFbDist = (v) => {
          const clamped = Math.max(50, Math.min(3000, Math.round(v)));
          fb.distance = clamped;
          if (distSlider) distSlider.value = clamped;
          if (distText) distText.textContent = clamped + " px";
          commitCamera(false);
        };
        if (distSlider) distSlider.addEventListener("input", () => updateFbDist(parseFloat(distSlider.value)));
        if (distDec) distDec.addEventListener("click", () => updateFbDist((fb.distance || 500) - 50));
        if (distInc) distInc.addEventListener("click", () => updateFbDist((fb.distance || 500) + 50));

        const dofSlider = contentEl.querySelector("#am-fb-dof-slider");
        const dofText = contentEl.querySelector("#am-fb-dof-text");
        const dofDec = contentEl.querySelector("#am-fb-dof-dec");
        const dofInc = contentEl.querySelector("#am-fb-dof-inc");

        const updateFbDof = (v) => {
          const clamped = Math.max(10, Math.min(1000, Math.round(v)));
          fb.depthOfField = clamped;
          if (dofSlider) dofSlider.value = clamped;
          if (dofText) dofText.textContent = clamped + " px";
          commitCamera(false);
        };
        if (dofSlider) dofSlider.addEventListener("input", () => updateFbDof(parseFloat(dofSlider.value)));
        if (dofDec) dofDec.addEventListener("click", () => updateFbDof((fb.depthOfField || 100) - 10));
        if (dofInc) dofInc.addEventListener("click", () => updateFbDof((fb.depthOfField || 100) + 10));

        const strSlider = contentEl.querySelector("#am-fb-str-slider");
        const strText = contentEl.querySelector("#am-fb-str-text");
        const strDec = contentEl.querySelector("#am-fb-str-dec");
        const strInc = contentEl.querySelector("#am-fb-str-inc");

        const updateFbStr = (v) => {
          const clamped = Math.max(0, Math.min(2, Math.round(v * 20) / 20));
          fb.strength = clamped;
          if (strSlider) strSlider.value = clamped;
          if (strText) strText.textContent = clamped.toFixed(2) + "x";
          commitCamera(false);
        };
        if (strSlider) strSlider.addEventListener("input", () => updateFbStr(parseFloat(strSlider.value)));
        if (strDec) strDec.addEventListener("click", () => updateFbStr((fb.strength || 0.5) - 0.1));
        if (strInc) strInc.addEventListener("click", () => updateFbStr((fb.strength || 0.5) + 0.1));
      }

      if (activeTab === "fog") {
        const sw = contentEl.querySelector("#fogSwitch");
        if (sw) {
          sw.addEventListener("change", () => {
            fg.enabled = sw.checked;
            commitCamera(false);
            render();
          });
        }

        const colorInput = contentEl.querySelector("#am-fog-color-native");
        const colorText = contentEl.querySelector("#am-fog-color-text");
        const applyFogColor = (hex) => {
          fg.color = hexToRgba(hex);
          if (colorInput) colorInput.value = hex;
          if (colorText) colorText.textContent = hex.toUpperCase();
          contentEl.querySelectorAll(".am-palette-chip").forEach(chip => {
            chip.classList.toggle("active", chip.dataset.color.toLowerCase() === hex.toLowerCase());
          });
          commitCamera(false);
        };

        if (colorInput) {
          colorInput.addEventListener("input", () => applyFogColor(colorInput.value));
        }

        contentEl.querySelectorAll(".am-palette-chip").forEach(chip => {
          chip.addEventListener("click", () => applyFogColor(chip.dataset.color));
        });

        const nearSlider = contentEl.querySelector("#am-fog-near-slider");
        const nearText = contentEl.querySelector("#am-fog-near-text");
        const nearDec = contentEl.querySelector("#am-fog-near-dec");
        const nearInc = contentEl.querySelector("#am-fog-near-inc");

        const updateFogNear = (v) => {
          const clamped = Math.max(0, Math.min(2000, Math.round(v)));
          fg.nearZ = clamped;
          if (nearSlider) nearSlider.value = clamped;
          if (nearText) nearText.textContent = clamped + " px";
          commitCamera(false);
        };
        if (nearSlider) nearSlider.addEventListener("input", () => updateFogNear(parseFloat(nearSlider.value)));
        if (nearDec) nearDec.addEventListener("click", () => updateFogNear((fg.nearZ || 0) - 25));
        if (nearInc) nearInc.addEventListener("click", () => updateFogNear((fg.nearZ || 0) + 25));

        const farSlider = contentEl.querySelector("#am-fog-far-slider");
        const farText = contentEl.querySelector("#am-fog-far-text");
        const farDec = contentEl.querySelector("#am-fog-far-dec");
        const farInc = contentEl.querySelector("#am-fog-far-inc");

        const updateFogFar = (v) => {
          const clamped = Math.max(100, Math.min(5000, Math.round(v)));
          fg.farZ = clamped;
          if (farSlider) farSlider.value = clamped;
          if (farText) farText.textContent = clamped + " px";
          commitCamera(false);
        };
        if (farSlider) farSlider.addEventListener("input", () => updateFogFar(parseFloat(farSlider.value)));
        if (farDec) farDec.addEventListener("click", () => updateFogFar((fg.farZ || 1500) - 50));
        if (farInc) farInc.addEventListener("click", () => updateFogFar((fg.farZ || 1500) + 50));
      }
    }

    render();
  }

  function renderSpeedControl(contentEl, layer) {
    const I = window.__AM_INTERNAL || {};
    if (!layer) return;

    let curSpeed = (typeof layer.speed === "number" && layer.speed > 0) ? layer.speed : ((typeof layer.timeScale === "number" && layer.timeScale > 0) ? layer.timeScale : 1);
    let stretchMode = layer.timeStretchMode || "stretch";
    let isReversed = !!layer.reversed;
    let isFrozen = layer.freezeTime != null || !!layer.freezeFrame;
    let curCurve = (layer.speedCurve && layer.speedCurve.type) || "linear";
    let isCurveOpen = false;

    function getLayerDuration() {
      const s = layer.startTime || 0;
      const e = layer.endTime != null ? layer.endTime : (I.val ? I.val.totalTime : 0);
      return Math.max(0, e - s);
    }

    function render() {
      const durMs = getLayerDuration();
      const durSec = (durMs / 1000).toFixed(2);
      const origDurSec = layer._origDuration ? (layer._origDuration / 1000).toFixed(2) : durSec;

      contentEl.innerHTML = `
        <div class="am-speed-container">
          <div class="am-retime-section">
            <div class="am-retime-label-row">
              <span class="am-speed-sec-label">Retime ke Playhead</span>
              <span class="am-retime-ph-val">${(Math.round(I.H || 0) / 1000).toFixed(2)}s</span>
            </div>
            <div class="am-retime-button-group">
              <button type="button" id="am-retime-ext-start" class="am-retime-btn left" title="Perpanjang Mulai ke Playhead">
                <img src="./icons/ac_ic_retime_extend_start.svg" alt="Extend Start">
                <span>Perpanjang Mulai</span>
              </button>
              <button type="button" id="am-retime-red-start" class="am-retime-btn center" title="Perpendek Mulai ke Playhead">
                <img src="./icons/ac_ic_retime_reduce_start.svg" alt="Reduce Start">
                <span>Perpendek Mulai</span>
              </button>
              <button type="button" id="am-retime-red-end" class="am-retime-btn center" title="Perpendek Akhir ke Playhead">
                <img src="./icons/ic_ac_ic_retime_reduce_end.svg" alt="Reduce End">
                <span>Perpendek Akhir</span>
              </button>
              <button type="button" id="am-retime-ext-end" class="am-retime-btn right" title="Perpanjang Akhir ke Playhead">
                <img src="./icons/ic_ac_ic_retime_extend_end.svg" alt="Extend End">
                <span>Perpanjang Akhir</span>
              </button>
            </div>
          </div>

          <div class="am-speed-badge-card">
            <div class="am-speed-badge-main">
              <span class="am-speed-sec-label">Kecepatan Pemutaran</span>
              <div class="am-speed-badge-val-row">
                <span id="am-speed-num" class="am-speed-number">${curSpeed.toFixed(2)}x</span>
                <button type="button" id="am-speed-reset-btn" class="am-speed-reset" title="Kembalikan ke 1.00x">Reset</button>
              </div>
            </div>
            <div class="am-speed-duration-info">
              <span>Durasi: <strong>${durSec}s</strong></span>
              ${layer._origDuration && Math.abs(curSpeed - 1) > 0.01 ? `<span class="am-speed-orig-dur">Asli: ${origDurSec}s</span>` : ''}
            </div>
          </div>

          <div class="am-speed-slider-card">
            <div class="am-speed-slider-row">
              <div class="am-speed-slider-icon" title="Lambat">
                <img src="./icons/ac_ic_speed_slow.svg" alt="Slow">
              </div>
              <div class="am-speed-slider-wrap">
                <input type="range" id="am-speed-slider" min="10" max="1600" value="${Math.round(curSpeed * 100)}" class="am-speed-range-input">
                <div class="am-speed-ticks">
                  <span>0.25x</span>
                  <span>0.5x</span>
                  <span>1x</span>
                  <span>2x</span>
                  <span>4x</span>
                  <span>8x</span>
                  <span>16x</span>
                </div>
              </div>
              <div class="am-speed-slider-icon" title="Cepat">
                <img src="./icons/ac_ic_speed_fast.svg" alt="Fast">
              </div>
            </div>
          </div>

          <div class="am-speed-presets-section">
            <div class="am-speed-sec-label">Preset Kecepatan Cepat</div>
            <div class="am-speed-presets-grid">
              ${[
                { label: "1/4x", val: 0.25 },
                { label: "1/2x", val: 0.5 },
                { label: "1x", val: 1.0 },
                { label: "1.5x", val: 1.5 },
                { label: "2x", val: 2.0 },
                { label: "4x", val: 4.0 },
                { label: "8x", val: 8.0 }
              ].map(p => `
                <button type="button" class="am-speed-pbtn ${Math.abs(curSpeed - p.val) < 0.02 ? 'active' : ''}" data-speed="${p.val}">${p.label}</button>
              `).join('')}
            </div>
          </div>

          <div class="am-speed-mode-section">
            <div class="am-speed-sec-label">Mode Time-Stretch</div>
            <div class="am-speed-mode-tabs">
              <button type="button" class="am-speed-mode-btn ${stretchMode === 'stretch' ? 'active' : ''}" data-mode="stretch">
                <span>Ubah Durasi Layer</span>
                <small>Layer memendek/memanjang di timeline</small>
              </button>
              <button type="button" class="am-speed-mode-btn ${stretchMode === 'keep' ? 'active' : ''}" data-mode="keep">
                <span>Pertahankan Durasi</span>
                <small>Panjang layer tetap di timeline</small>
              </button>
            </div>
          </div>

          <div class="am-speed-actions-section">
            <div class="am-speed-sec-label">Kontrol Retiming Khusus</div>
            <div class="am-speed-actions-grid">
              <button type="button" id="am-speed-freeze-btn" class="am-speed-act-btn ${isFrozen ? 'active' : ''}">
                <div class="am-speed-act-icon">
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                    <path d="M12 2L15 8L21 9L17 14L18 20L12 17L6 20L7 14L3 9L9 8L12 2Z"/>
                  </svg>
                </div>
                <div class="am-speed-act-text">
                  <span class="am-speed-act-title">Bekukan Frame (Freeze)</span>
                  <span class="am-speed-act-status">${isFrozen ? `Beku di ${(layer.freezeTime * 100).toFixed(0)}%` : 'Nonaktif'}</span>
                </div>
              </button>
              <button type="button" id="am-speed-reverse-btn" class="am-speed-act-btn ${isReversed ? 'active' : ''}">
                <div class="am-speed-act-icon">
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                    <path d="M11 5V1L4 8L11 15V11C16.5 11 20 12.5 22 17C21 12 18 7 11 5Z"/>
                  </svg>
                </div>
                <div class="am-speed-act-text">
                  <span class="am-speed-act-title">Putar Balik (Reverse)</span>
                  <span class="am-speed-act-status">${isReversed ? 'Putar Balik Aktif' : 'Normal'}</span>
                </div>
              </button>
            </div>
          </div>

          <div class="am-speed-curve-section">
            <div class="am-speed-curve-header" id="am-speed-curve-toggle">
              <div class="am-speed-curve-header-left">
                <img src="./icons/ac_ic_anim_curve.svg" class="am-speed-curve-ic" alt="Curve">
                <span class="am-speed-sec-label" style="margin:0;">Kurva Kecepatan (Speed Curve)</span>
              </div>
              <div class="am-speed-curve-current-badge">${curCurve.replace('_', ' ').toUpperCase()}</div>
            </div>
            <div id="am-speed-curve-panel" class="am-speed-curve-panel ${isCurveOpen ? 'open' : ''}">
              <div class="am-speed-curves-grid">
                ${[
                  { id: "linear", label: "Linier", d: "M 4 28 L 36 4" },
                  { id: "ease_in", label: "Ease In", d: "M 4 28 Q 28 28 36 4" },
                  { id: "ease_out", label: "Ease Out", d: "M 4 28 Q 12 4 36 4" },
                  { id: "ease_in_out", label: "Ease In Out", d: "M 4 28 C 20 28 20 4 36 4" },
                  { id: "fast_start", label: "Fast Start", d: "M 4 28 C 4 8 20 4 36 4" },
                  { id: "slow_motion", label: "Slow Motion", d: "M 4 28 C 16 16 24 16 36 4" },
                  { id: "dramatic", label: "Dramatic", d: "M 4 28 C 28 28 32 16 36 4" }
                ].map(c => `
                  <button type="button" class="am-speed-curve-item ${curCurve === c.id ? 'active' : ''}" data-curve="${c.id}">
                    <svg viewBox="0 0 40 32" class="am-speed-curve-thumb">
                      <path d="${c.d}" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
                    </svg>
                    <span>${c.label}</span>
                  </button>
                `).join('')}
              </div>
            </div>
          </div>
        </div>
      `;

      bindEvents();
    }

    function bindEvents() {
      const btnExtStart = contentEl.querySelector("#am-retime-ext-start");
      const btnRedStart = contentEl.querySelector("#am-retime-red-start");
      const btnRedEnd = contentEl.querySelector("#am-retime-red-end");
      const btnExtEnd = contentEl.querySelector("#am-retime-ext-end");

      if (btnExtStart) {
        btnExtStart.onclick = () => {
          if (I.omRetime) I.omRetime("extend_start", layer);
          curSpeed = layer.speed || 1;
          render();
        };
      }
      if (btnRedStart) {
        btnRedStart.onclick = () => {
          if (I.omRetime) I.omRetime("reduce_start", layer);
          curSpeed = layer.speed || 1;
          render();
        };
      }
      if (btnRedEnd) {
        btnRedEnd.onclick = () => {
          if (I.omRetime) I.omRetime("reduce_end", layer);
          curSpeed = layer.speed || 1;
          render();
        };
      }
      if (btnExtEnd) {
        btnExtEnd.onclick = () => {
          if (I.omRetime) I.omRetime("extend_end", layer);
          curSpeed = layer.speed || 1;
          render();
        };
      }

      const slider = contentEl.querySelector("#am-speed-slider");
      const numDisplay = contentEl.querySelector("#am-speed-num");
      const snaps = [0.25, 0.5, 0.75, 1.0, 1.5, 2.0, 3.0, 4.0, 8.0, 16.0];

      if (slider) {
        slider.oninput = () => {
          let rawVal = Number(slider.value) / 100;
          for (let sn of snaps) {
            if (Math.abs(rawVal - sn) <= 0.04) {
              rawVal = sn;
              break;
            }
          }
          curSpeed = rawVal;
          if (numDisplay) numDisplay.textContent = curSpeed.toFixed(2) + "x";
          if (I.omSetLayerSpeed) {
            I.omSetLayerSpeed(layer, curSpeed, stretchMode === "stretch");
          }
        };
        slider.onchange = () => {
          render();
        };
      }

      const resetBtn = contentEl.querySelector("#am-speed-reset-btn");
      if (resetBtn) {
        resetBtn.onclick = () => {
          curSpeed = 1.0;
          if (I.omSetLayerSpeed) I.omSetLayerSpeed(layer, 1.0, stretchMode === "stretch");
          render();
        };
      }

      contentEl.querySelectorAll(".am-speed-pbtn").forEach(btn => {
        btn.onclick = () => {
          curSpeed = Number(btn.dataset.speed) || 1;
          if (I.omSetLayerSpeed) {
            I.omSetLayerSpeed(layer, curSpeed, stretchMode === "stretch");
          }
          render();
        };
      });

      contentEl.querySelectorAll(".am-speed-mode-btn").forEach(btn => {
        btn.onclick = () => {
          stretchMode = btn.dataset.mode;
          layer.timeStretchMode = stretchMode;
          if (I.omSetLayerSpeed) {
            I.omSetLayerSpeed(layer, curSpeed, stretchMode === "stretch");
          }
          render();
        };
      });

      const freezeBtn = contentEl.querySelector("#am-speed-freeze-btn");
      if (freezeBtn) {
        freezeBtn.onclick = () => {
          if (I.omToggleFreezeFrame) I.omToggleFreezeFrame(layer);
          isFrozen = layer.freezeTime != null || !!layer.freezeFrame;
          render();
        };
      }
      const revBtn = contentEl.querySelector("#am-speed-reverse-btn");
      if (revBtn) {
        revBtn.onclick = () => {
          if (I.omToggleReverse) I.omToggleReverse(layer);
          isReversed = !!layer.reversed;
          render();
        };
      }

      const curveToggle = contentEl.querySelector("#am-speed-curve-toggle");
      if (curveToggle) {
        curveToggle.onclick = () => {
          isCurveOpen = !isCurveOpen;
          const p = contentEl.querySelector("#am-speed-curve-panel");
          if (p) p.classList.toggle("open", isCurveOpen);
        };
      }
      contentEl.querySelectorAll(".am-speed-curve-item").forEach(item => {
        item.onclick = () => {
          curCurve = item.dataset.curve;
          if (I.omSetSpeedCurve) I.omSetSpeedCurve(layer, curCurve);
          render();
        };
      });
    }

    render();
  }

  let cachedEffectCatalog = null;
  async function loadEffectCatalog() {
    if (cachedEffectCatalog) return cachedEffectCatalog;
    try {
      const res = await fetch("/effects-catalog.json");
      if (res.ok) cachedEffectCatalog = await res.json();
    } catch (e) {}
    if (!cachedEffectCatalog || !Array.isArray(cachedEffectCatalog)) {
      try {
        const res2 = await fetch("/effect-index.json");
        if (res2.ok) {
          const idx = await res2.json();
          cachedEffectCatalog = Object.entries(idx).map(([id, file]) => {
            const cleanName = id.split(".").pop().replace(/-/g, " ");
            const formatted = cleanName.charAt(0).toUpperCase() + cleanName.slice(1);
            return {
              id,
              file,
              name: formatted,
              category: "other",
              categoryLabel: "Lainnya",
              desc: file.replace(/\.xml$/i, ""),
              tags: [],
              thumb: "./icons/ac_ic_effects.svg",
              params: []
            };
          });
        }
      } catch (e2) {}
    }
    if (!cachedEffectCatalog) cachedEffectCatalog = [];
    return cachedEffectCatalog;
  }

  const EFFECT_CATEGORIES = [
    { id: "all", label: "Semua" },
    { id: "drawing", label: "Gambar & Tepi" },
    { id: "color", label: "Warna & Cahaya" },
    { id: "blur", label: "Buram" },
    { id: "distort", label: "Distorsi / Warp" },
    { id: "procedural", label: "Prosedural" },
    { id: "3d", label: "3D" },
    { id: "text", label: "Teks" },
    { id: "opacity", label: "Opasitas & Masker" },
    { id: "repeat", label: "Ulangi" },
    { id: "transform", label: "Transformasi" },
    { id: "other", label: "Lainnya" }
  ];

  function hexToRgba(hex) {
    hex = String(hex || "").replace("#", "").trim();
    if (hex.length === 6) hex = hex + "ff";
    if (hex.length === 8) {
      const r = parseInt(hex.slice(0, 2), 16) / 255;
      const g = parseInt(hex.slice(2, 4), 16) / 255;
      const b = parseInt(hex.slice(4, 6), 16) / 255;
      const a = parseInt(hex.slice(6, 8), 16) / 255;
      return [r, g, b, a];
    }
    return [1, 1, 1, 1];
  }

  function rgbaToHex(arr) {
    if (!Array.isArray(arr)) return "#ffffff";
    const r = Math.round(Math.max(0, Math.min(1, arr[0] || 0)) * 255).toString(16).padStart(2, "0");
    const g = Math.round(Math.max(0, Math.min(1, arr[1] || 0)) * 255).toString(16).padStart(2, "0");
    const b = Math.round(Math.max(0, Math.min(1, arr[2] || 0)) * 255).toString(16).padStart(2, "0");
    return `#${r}${g}${b}`;
  }

  async function openMobileEffectPicker(layer, onAdded) {
    const I = window.__AM_INTERNAL || {};
    const catalog = await loadEffectCatalog();
    let currentCat = "all";
    let searchQuery = "";

    const modal = document.createElement("div");
    modal.id = "am-effect-picker-sheet";
    modal.innerHTML = `
      <div class="am-fx-picker-box">
        <div class="am-fx-picker-header">
          <span style="font-size:15px;font-weight:700;color:#fff;">Tambah Efek</span>
          <button id="am-fx-picker-close" style="background:transparent;border:0;color:#fff;font-size:18px;cursor:pointer;padding:4px 8px;">✕</button>
        </div>
        <div class="am-fx-search-bar" style="display:flex;align-items:center;gap:8px;">
          <input type="text" id="am-fx-picker-search" placeholder="Cari efek..." class="am-import-input" style="flex:1;background:#090a0e;border:1px solid rgba(255,255,255,0.1);border-radius:8px;padding:8px 12px;color:#fff;font-size:13px;box-sizing:border-box;">
          <button id="am-fx-search-clear" style="background:transparent;border:0;color:#8c93a7;cursor:pointer;font-size:14px;display:none;padding:4px;">✕</button>
        </div>
        <div class="am-fx-cats-bar">
          ${EFFECT_CATEGORIES.map(c => `
            <button class="am-fx-cat-chip ${c.id === 'all' ? 'active' : ''}" data-cat="${c.id}">${c.label}</button>
          `).join('')}
        </div>
        <div id="am-fx-grid" class="am-fx-picker-grid"></div>
      </div>
    `;

    document.body.appendChild(modal);

    const closeBtn = modal.querySelector("#am-fx-picker-close");
    closeBtn.onclick = () => modal.remove();
    modal.onclick = (e) => {
      if (e.target === modal) modal.remove();
    };

    const searchInput = modal.querySelector("#am-fx-picker-search");
    const searchClear = modal.querySelector("#am-fx-search-clear");

    searchInput.oninput = () => {
      searchQuery = searchInput.value.trim().toLowerCase();
      searchClear.style.display = searchQuery ? "block" : "none";
      renderGrid();
    };

    searchClear.onclick = () => {
      searchInput.value = "";
      searchQuery = "";
      searchClear.style.display = "none";
      searchInput.focus();
      renderGrid();
    };

    const catChips = modal.querySelectorAll(".am-fx-cat-chip");
    catChips.forEach(chip => {
      chip.onclick = () => {
        catChips.forEach(c => c.classList.remove("active"));
        chip.classList.add("active");
        currentCat = chip.dataset.cat;
        renderGrid();
      };
    });

    const gridEl = modal.querySelector("#am-fx-grid");

    function renderGrid() {
      let filtered = catalog;
      if (currentCat !== "all") {
        filtered = filtered.filter(fx => fx.category === currentCat);
      }
      if (searchQuery) {
        filtered = filtered.filter(fx =>
          (fx.name && fx.name.toLowerCase().includes(searchQuery)) ||
          (fx.id && fx.id.toLowerCase().includes(searchQuery)) ||
          (fx.desc && fx.desc.toLowerCase().includes(searchQuery)) ||
          (fx.tags && fx.tags.some(t => t.toLowerCase().includes(searchQuery)))
        );
      }

      if (!filtered.length) {
        gridEl.innerHTML = `<div style="grid-column:1/-1;text-align:center;color:#8c93a7;padding:30px;font-size:12px;">Tidak ada efek yang cocok</div>`;
        return;
      }

      gridEl.innerHTML = filtered.slice(0, 100).map(fx => {
        const thumbUrl = fx.thumb || "./icons/ac_ic_effects.svg";
        const tagsHtml = (fx.tags || []).slice(0, 2).map(t => `<span class="am-fx-tag-badge">${escapeHtml(t)}</span>`).join('');
        const catBadge = `<span class="am-fx-tag-badge cat">${escapeHtml(fx.categoryLabel || fx.category || "Efek")}</span>`;
        return `
          <div class="am-fx-card" data-id="${escapeHtml(fx.id)}">
            <div class="am-fx-card-thumb">
              <img src="${thumbUrl}" onerror="this.src='./icons/ac_ic_effects.svg';this.style.width='36px';this.style.height='36px';" alt="${escapeHtml(fx.name)}">
            </div>
            <div class="am-fx-card-title">${escapeHtml(fx.name)}</div>
            <div class="am-fx-card-tags">${catBadge}${tagsHtml}</div>
            ${fx.desc ? `<div class="am-fx-card-desc">${escapeHtml(fx.desc)}</div>` : ''}
          </div>
        `;
      }).join('');

      gridEl.querySelectorAll(".am-fx-card").forEach(card => {
        card.onclick = async () => {
          const fxId = card.dataset.id;
          const fxDef = catalog.find(x => x.id === fxId);
          modal.remove();

          layer.effects = layer.effects || [];

          const initialParams = (fxDef && fxDef.params ? fxDef.params : [])
            .filter(p => p.tag !== "tip")
            .map(p => {
              let val = p.default;
              if (p.dataType === "color") {
                val = typeof val === "string" ? hexToRgba(val) : (Array.isArray(val) ? val : [1, 1, 1, 1]);
              } else if (!Array.isArray(val)) {
                val = [Number(val) || 0];
              }
              return {
                id: p.id,
                dataType: p.dataType,
                channel: {
                  value: val,
                  kfs: []
                }
              };
            });

          const newFx = {
            id: fxId,
            name: fxDef ? fxDef.name : fxId.split('.').pop(),
            shortId: fxId.split('.').pop(),
            enabled: true,
            hidden: false,
            locallyApplied: true,
            params: initialParams,
            _meta: fxDef
          };
          layer.effects.push(newFx);

          if (I.loadEffect) {
            try { await I.loadEffect(fxId); } catch (e) {}
          } else if (I.val2 && typeof I.val2.loadEffect === "function") {
            try { await I.val2.loadEffect(fxId); } catch (e) {}
          }

          if (I.pushUndo && I.sceneSnapshot) I.pushUndo(I.sceneSnapshot());
          I.V = true;
          if (I.val2 && I.val2.renderAt) I.val2.renderAt(I.H || 0);

          if (onAdded) onAdded(newFx);
        };
      });
    }

    renderGrid();
  }

  function renderEffects(contentEl, layer, selectedEffect = null) {
    const I = window.__AM_INTERNAL || {};
    layer.effects = layer.effects || [];

    if (selectedEffect) {
      renderEffectInspector(contentEl, layer, selectedEffect);
      return;
    }

    contentEl.innerHTML = `
      <div style="display:flex;flex-direction:column;gap:12px;">
        <button id="am-btn-add-fx" class="am-btn-add-fx">
          <img src="./icons/ic_ac_add_mini.svg" style="width:18px;height:18px;filter:brightness(0) invert(1);" alt="+">
          <span>TAMBAH EFEK</span>
        </button>
        <div id="am-fx-list-container" class="am-fx-list"></div>
      </div>
    `;

    const listEl = contentEl.querySelector("#am-fx-list-container");
    if (!layer.effects.length) {
      listEl.innerHTML = `<div style="text-align:center;color:#8c93a7;padding:24px 16px;font-size:12px;">Belum ada efek ditambahkan ke layer ini</div>`;
    } else {
      layer.effects.forEach((fx, idx) => {
        const item = document.createElement("div");
        item.className = "am-fx-item";
        item.style.cursor = "pointer";
        const isHidden = fx.disabled || fx.hidden === true || fx.hidden === "true";
        item.innerHTML = `
          <div style="display:flex;align-items:center;gap:10px;flex:1;overflow:hidden;">
            <button class="am-fx-toggle" style="background:transparent;border:0;cursor:pointer;padding:4px;display:flex;align-items:center;">
              <img src="./icons/ic_visibility.svg" style="width:18px;height:18px;filter:brightness(0) invert(${isHidden ? '0.4' : '1'});">
            </button>
            <div style="display:flex;flex-direction:column;gap:2px;overflow:hidden;">
              <span class="am-fx-name" style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${escapeHtml(fx.name || fx.id || "Efek " + (idx + 1))}</span>
              <span style="font-size:10px;color:#8c93a7;">${(fx.params || []).length} parameter</span>
            </div>
          </div>
          <div style="display:flex;align-items:center;gap:6px;">
            <button class="am-fx-del" data-idx="${idx}" style="background:transparent;border:0;cursor:pointer;padding:4px;">
              <img src="./icons/ac_ic_delete.svg" alt="Hapus">
            </button>
          </div>
        `;

        item.querySelector(".am-fx-toggle").addEventListener("click", (e) => {
          e.stopPropagation();
          const curHidden = fx.disabled || fx.hidden === true || fx.hidden === "true";
          fx.disabled = !curHidden;
          fx.hidden = !curHidden;
          renderEffects(contentEl, layer);
          I.V = true;
          if (I.val2) I.val2.renderAt(I.H || 0);
        });

        item.querySelector(".am-fx-del").addEventListener("click", (e) => {
          e.stopPropagation();
          layer.effects.splice(idx, 1);
          renderEffects(contentEl, layer);
          if (I.pushUndo && I.sceneSnapshot) I.pushUndo(I.sceneSnapshot());
          I.V = true;
          if (I.val2) I.val2.renderAt(I.H || 0);
        });

        item.addEventListener("click", () => {
          renderEffects(contentEl, layer, fx);
        });

        listEl.appendChild(item);
      });
    }

    contentEl.querySelector("#am-btn-add-fx").addEventListener("click", () => {
      openMobileEffectPicker(layer, (newFx) => {
        renderEffects(contentEl, layer, newFx);
      });
    });
  }

  async function renderEffectInspector(contentEl, layer, fx) {
    const I = window.__AM_INTERNAL || {};
    const catalog = await loadEffectCatalog();
    const fxDef = fx._meta || catalog.find(x => x.id === fx.id) || {
      id: fx.id,
      name: fx.name || fx.id.split('.').pop(),
      params: []
    };

    if (I.loadEffect) {
      try { await I.loadEffect(fx.id); } catch (e) {}
    } else if (I.val2 && typeof I.val2.loadEffect === "function") {
      try { await I.val2.loadEffect(fx.id); } catch (e) {}
    }

    const isHidden = fx.disabled || fx.hidden === true || fx.hidden === "true";
    const playheadSec = (I.H || 0) / 1000;

    let hasKfAtCurrentTime = false;
    for (const p of fx.params || []) {
      if (p.channel && Array.isArray(p.channel.kfs)) {
        if (p.channel.kfs.some(k => Math.abs(Number(k.t) - playheadSec) < 0.002)) {
          hasKfAtCurrentTime = true;
          break;
        }
      }
    }

    contentEl.innerHTML = `
      <div class="am-fx-inspector">
        <div class="am-fx-inspector-header">
          <button id="am-fx-insp-back" class="am-fx-inspector-back">
            <span>←</span>
            <span>${escapeHtml(fx.name || fxDef.name || "Efek")}</span>
          </button>
          <div class="am-fx-inspector-actions">
            <button id="am-fx-insp-toggle" class="am-fx-inspector-btn" title="Toggle Efek">
              <img src="./icons/ic_visibility.svg" style="filter:brightness(0) invert(${isHidden ? '0.4' : '1'});">
            </button>
            <button id="am-fx-insp-delete" class="am-fx-inspector-btn" title="Hapus Efek">
              <img src="./icons/ac_ic_delete.svg" alt="Hapus">
            </button>
          </div>
        </div>

        <div class="am-fx-kf-toolbar">
          <div style="font-size:11px;font-weight:600;color:#8c93a7;">Playhead: <span style="color:#fff;">${playheadSec.toFixed(2)}s</span></div>
          <button id="am-fx-insp-kf-btn" class="am-fx-kf-btn ${hasKfAtCurrentTime ? 'active' : ''}">
            <span>${hasKfAtCurrentTime ? '◆− Hapus Keyframe' : '◆+ Tambah Keyframe'}</span>
          </button>
        </div>

        <div id="am-fx-params-box" class="am-fx-param-list"></div>
      </div>
    `;

    contentEl.querySelector("#am-fx-insp-back").onclick = () => {
      renderEffects(contentEl, layer, null);
    };

    contentEl.querySelector("#am-fx-insp-toggle").onclick = () => {
      const curHidden = fx.disabled || fx.hidden === true || fx.hidden === "true";
      fx.disabled = !curHidden;
      fx.hidden = !curHidden;
      I.V = true;
      if (I.val2) I.val2.renderAt(I.H || 0);
      renderEffectInspector(contentEl, layer, fx);
    };

    contentEl.querySelector("#am-fx-insp-delete").onclick = () => {
      const idx = layer.effects.indexOf(fx);
      if (idx >= 0) layer.effects.splice(idx, 1);
      if (I.pushUndo && I.sceneSnapshot) I.pushUndo(I.sceneSnapshot());
      I.V = true;
      if (I.val2) I.val2.renderAt(I.H || 0);
      renderEffects(contentEl, layer, null);
    };

    contentEl.querySelector("#am-fx-insp-kf-btn").onclick = () => {
      const curTime = (I.H || 0) / 1000;
      for (const p of fx.params || []) {
        if (!p.channel) continue;
        p.channel.kfs = p.channel.kfs || [];
        const kfIdx = p.channel.kfs.findIndex(k => Math.abs(Number(k.t) - curTime) < 0.002);
        if (kfIdx >= 0) {
          p.channel.kfs.splice(kfIdx, 1);
        } else {
          p.channel.kfs.push({ t: curTime, v: p.channel.value.slice(), e: null, easing: null });
          p.channel.kfs.sort((a, b) => a.t - b.t);
        }
      }
      if (I.pushUndo && I.sceneSnapshot) I.pushUndo(I.sceneSnapshot());
      I.V = true;
      if (I.val2) I.val2.renderAt(I.H || 0);
      renderEffectInspector(contentEl, layer, fx);
    };

    const paramsBox = contentEl.querySelector("#am-fx-params-box");
    const defParams = fxDef.params || [];

    if (!defParams.length && (!fx.params || !fx.params.length)) {
      paramsBox.innerHTML = `<div style="text-align:center;color:#8c93a7;padding:16px;font-size:12px;">Efek ini tidak memiliki parameter yang dapat diubah</div>`;
      return;
    }

    defParams.forEach(pDef => {
      if (pDef.tag === "tip") {
        const tipEl = document.createElement("div");
        tipEl.className = "am-fx-tip-card";
        tipEl.textContent = pDef.default || pDef.label || "";
        paramsBox.appendChild(tipEl);
        return;
      }

      let pInst = (fx.params || []).find(p => p.id === pDef.id);
      if (!pInst) {
        let defVal = pDef.default;
        if (pDef.dataType === "color") {
          defVal = typeof defVal === "string" ? hexToRgba(defVal) : (Array.isArray(defVal) ? defVal : [1, 1, 1, 1]);
        } else if (!Array.isArray(defVal)) {
          defVal = [Number(defVal) || 0];
        }
        pInst = {
          id: pDef.id,
          dataType: pDef.dataType,
          channel: {
            value: defVal,
            kfs: []
          }
        };
        fx.params.push(pInst);
      }

      const card = document.createElement("div");
      card.className = "am-fx-param-card";

      if (pDef.dataType === "bool" || pDef.tag === "switch") {
        const curVal = !!(pInst.channel.value && pInst.channel.value[0]);
        card.innerHTML = `
          <div class="am-fx-switch-row">
            <span class="am-fx-param-title">${escapeHtml(pDef.label || pDef.id)}</span>
            <label class="am-switch" style="position:relative;display:inline-block;width:38px;height:22px;margin:0;">
              <input type="checkbox" ${curVal ? 'checked' : ''} style="opacity:0;width:0;height:0;">
              <span class="am-switch-slider" style="position:absolute;cursor:pointer;inset:0;background:#252a3b;border-radius:22px;transition:0.2s;"></span>
            </label>
          </div>
        `;
        const cb = card.querySelector('input[type="checkbox"]');
        const sliderSpan = card.querySelector(".am-switch-slider");
        if (curVal) sliderSpan.style.background = "var(--am-y1)";

        cb.onchange = () => {
          const nv = cb.checked ? 1 : 0;
          sliderSpan.style.background = cb.checked ? "var(--am-y1)" : "#252a3b";
          pInst.channel.value = [nv];
          if (pInst.channel.kfs && pInst.channel.kfs.length) {
            const t = (I.H || 0) / 1000;
            const ki = pInst.channel.kfs.findIndex(k => Math.abs(Number(k.t) - t) < 0.002);
            if (ki >= 0) pInst.channel.kfs[ki].v = [nv];
            else {
              pInst.channel.kfs.push({ t, v: [nv], e: null, easing: null });
              pInst.channel.kfs.sort((a, b) => a.t - b.t);
            }
          }
          I.V = true;
          if (I.val2) I.val2.renderAt(I.H || 0);
        };
      } else if (pDef.dataType === "color" || pDef.tag === "color") {
        const curHex = rgbaToHex(pInst.channel.value);
        card.innerHTML = `
          <div class="am-fx-color-row">
            <span class="am-fx-param-title">${escapeHtml(pDef.label || pDef.id)}</span>
            <div class="am-fx-color-preview-box">
              <input type="color" class="am-fx-native-color" value="${curHex}" style="width:32px;height:32px;border:0;padding:0;background:transparent;cursor:pointer;">
              <span class="am-fx-color-hex">${curHex.toUpperCase()}</span>
            </div>
          </div>
          <div class="am-fx-palette">
            ${["#ffffff", "#000000", "#ff3b30", "#34c759", "#007aff", "#5856d6", "#ff9500", "#1fc8ee"].map(c => `
              <div class="am-fx-palette-chip" data-color="${c}" style="background:${c};"></div>
            `).join('')}
          </div>
        `;

        const colorInput = card.querySelector(".am-fx-native-color");
        const hexDisplay = card.querySelector(".am-fx-color-hex");

        function applyColor(hex) {
          const rgba = hexToRgba(hex);
          pInst.channel.value = rgba;
          colorInput.value = hex;
          hexDisplay.textContent = hex.toUpperCase();
          if (pInst.channel.kfs && pInst.channel.kfs.length) {
            const t = (I.H || 0) / 1000;
            const ki = pInst.channel.kfs.findIndex(k => Math.abs(Number(k.t) - t) < 0.002);
            if (ki >= 0) pInst.channel.kfs[ki].v = rgba.slice();
            else {
              pInst.channel.kfs.push({ t, v: rgba.slice(), e: null, easing: null });
              pInst.channel.kfs.sort((a, b) => a.t - b.t);
            }
          }
          I.V = true;
          if (I.val2) I.val2.renderAt(I.H || 0);
        }

        colorInput.oninput = () => applyColor(colorInput.value);
        card.querySelectorAll(".am-fx-palette-chip").forEach(chip => {
          chip.onclick = () => applyColor(chip.dataset.color);
        });
      } else if (pDef.choices && pDef.choices.length) {
        const curVal = (pInst.channel.value && pInst.channel.value[0]) || 0;
        card.innerHTML = `
          <div class="am-fx-selector-row">
            <span class="am-fx-param-title">${escapeHtml(pDef.label || pDef.id)}</span>
            <select class="am-fx-select">
              ${pDef.choices.map(c => `<option value="${c.value}" ${c.value === curVal ? 'selected' : ''}>${escapeHtml(c.label)}</option>`).join('')}
            </select>
          </div>
        `;
        const select = card.querySelector(".am-fx-select");
        select.onchange = () => {
          const nv = parseInt(select.value) || 0;
          pInst.channel.value = [nv];
          I.V = true;
          if (I.val2) I.val2.renderAt(I.H || 0);
        };
      } else {
        const minVal = pDef.min !== undefined ? pDef.min : 0;
        const maxVal = pDef.max !== undefined ? pDef.max : (pDef.isPercent ? 1 : (pDef.isAngle ? 360 : 10));
        const stepVal = pDef.step !== undefined ? pDef.step : 0.01;
        let curVal = Number(pInst.channel.value && pInst.channel.value[0]);
        if (!Number.isFinite(curVal)) curVal = Number(pDef.default) || 0;

        function formatVal(v) {
          if (pDef.isPercent) return (v * 100).toFixed(0) + "%";
          if (pDef.isAngle) return v.toFixed(1) + "°";
          if (pDef.dataType === "int") return Math.round(v).toString();
          return v.toFixed(2);
        }

        card.innerHTML = `
          <div class="am-ls-row am-ls-row-spinner" style="margin:0;padding:6px 0;">
            <span class="am-ls-prop-label">${escapeHtml(pDef.label || pDef.id)}</span>
            <div class="am-ls-spinner-wrap">
              <canvas class="am-ls-spinner-canvas"></canvas>
            </div>
            <div class="am-ls-prop-value">${formatVal(curVal)}</div>
          </div>
        `;

        const canvas = card.querySelector(".am-ls-spinner-canvas");
        const valBox = card.querySelector(".am-ls-prop-value");

        createValueSpinner(canvas, {
          min: minVal,
          max: maxVal,
          step: stepVal,
          getVal: () => {
            const v = Number(pInst.channel.value && pInst.channel.value[0]);
            return Number.isFinite(v) ? v : (Number(pDef.default) || 0);
          },
          setVal: (nv) => {
            nv = Math.max(minVal, Math.min(maxVal, nv));
            valBox.textContent = formatVal(nv);
            pInst.channel.value = [nv];

            if (pInst.channel.kfs && pInst.channel.kfs.length) {
              const t = (I.H || 0) / 1000;
              const ki = pInst.channel.kfs.findIndex(k => Math.abs(Number(k.t) - t) < 0.002);
              if (ki >= 0) pInst.channel.kfs[ki].v = [nv];
              else {
                pInst.channel.kfs.push({ t, v: [nv], e: null, easing: null });
                pInst.channel.kfs.sort((a, b) => a.t - b.t);
              }
            }

            I.V = true;
            if (I.val2) I.val2.renderAt(I.H || 0);
          },
          onChange: () => {
            if (I.pushUndo && I.sceneSnapshot) I.pushUndo(I.sceneSnapshot());
          }
        });
      }

      paramsBox.appendChild(card);
    });
  }

  // Hook layer selection to seamlessly toggle panels
  const origOnLayerSelected = window.omOnLayerSelected;
  window.omOnLayerSelected = function(l) {
    const I = window.__AM_INTERNAL || {};
    if (I.omMulti && I.omMulti.size > 0) {
      return;
    }
    if (activeLiveShapeLayer && activeLiveShapeLayer !== l) closeLiveShape(false);
    if (activeEditPointsLayer && activeEditPointsLayer !== l) closeEditPoints(false);
    if (activeTextEditorLayer && activeTextEditorLayer !== l) closeTextEditor(false);

    currentSelectedLayer = l;
    if (typeof origOnLayerSelected === "function") {
      origOnLayerSelected(l);
    }

    const navDefault = document.getElementById("am-navbar-default");
    const navElem = document.getElementById("am-navbar-element");
    const navLiveShape = document.getElementById("am-navbar-liveshape");
    const navEditPoints = document.getElementById("am-navbar-editpoints");
    const navTextEdit = document.getElementById("am-navbar-textedit");
    const elemTitle = document.getElementById("am-elem-title");
    const tlView = document.getElementById("am-timeline-view");
    const elemPanel = document.getElementById("am-element-edit-panel");
    const ctxText = document.getElementById("am-context-text");
    const ctxIcon = document.getElementById("am-context-icon");
    const btnCam = document.getElementById("am-btn-camera");
    const btnCtx = document.getElementById("am-btn-editcontext");
    const btnColor = document.getElementById("am-btn-colorfill");
    const btnBorder = document.getElementById("am-btn-bordershadow");

    if (navLiveShape) navLiveShape.style.display = "none";
    if (navEditPoints) navEditPoints.style.display = "none";
    if (navTextEdit) navTextEdit.style.display = "none";

    if (l) {
      // Toggle Camera button vs Context Edit button
      if (l.tag === "camera") {
        if (btnCam) btnCam.style.display = "flex";
        if (btnCtx) btnCtx.style.display = "none";
        if (btnColor) {
          btnColor.style.opacity = "0.3";
          btnColor.style.pointerEvents = "none";
        }
        if (btnBorder) {
          btnBorder.style.opacity = "0.3";
          btnBorder.style.pointerEvents = "none";
        }
      } else {
        if (btnCam) btnCam.style.display = "none";
        if (btnCtx) btnCtx.style.display = "flex";
        if (btnColor) {
          btnColor.style.opacity = "1";
          btnColor.style.pointerEvents = "auto";
        }
        if (btnBorder) {
          btnBorder.style.opacity = "1";
          btnBorder.style.pointerEvents = "auto";
        }
      }

      // Show Element Action Bar
      if (navDefault) navDefault.style.display = "none";
      if (navElem) navElem.style.display = "flex";
      if (elemTitle) elemTitle.value = l.label || l.id || "Layer";
      updateParentButtonState(l);

      // Show Element Edit Panel
      if (tlView) tlView.style.display = "none";
      if (elemPanel) elemPanel.style.display = "flex";

      // Context button label & icon
      if (ctxText && ctxIcon) {
        const I = window.__AM_INTERNAL || {};
        if (I.isGroup && I.isGroup(l)) {
          ctxText.textContent = "Edit Grup";
          ctxIcon.src = "./icons/ac_ic_groupelements.svg";
        } else if (l.tag === "text") {
          ctxText.textContent = "Edit Teks";
          ctxIcon.src = "./icons/ac_edit_text.svg";
        } else if (l.path || l.points || l.tag === "drawing" || l.tag === "vector") {
          ctxText.textContent = "Edit Poin";
          ctxIcon.src = "./icons/ac_ic_editpoint.svg";
        } else {
          ctxText.textContent = "Edit Bentuk";
          ctxIcon.src = "./icons/ac_add_shape.svg";
        }
      }
    } else {
      // Restore buttons state
      if (btnCam) btnCam.style.display = "none";
      if (btnCtx) btnCtx.style.display = "flex";
      if (btnColor) {
        btnColor.style.opacity = "1";
        btnColor.style.pointerEvents = "auto";
      }
      if (btnBorder) {
        btnBorder.style.opacity = "1";
        btnBorder.style.pointerEvents = "auto";
      }

      // Return to Default Navigation & Timeline
      if (navDefault) navDefault.style.display = "flex";
      if (navElem) navElem.style.display = "none";
      const navSetting = document.getElementById("am-navbar-setting");
      if (navSetting) navSetting.style.display = "none";
      if (tlView) tlView.style.display = "flex";
      if (elemPanel) elemPanel.style.display = "none";
      const sub = document.getElementById("am-subpanel-container");
      if (sub) sub.classList.remove("open");
      const lsPanel = document.getElementById("am-liveshape-panel");
      if (lsPanel) lsPanel.classList.remove("open");
      const epPanel = document.getElementById("am-editpoints-panel");
      if (epPanel) epPanel.classList.remove("open");
      const textEditBar = document.getElementById("am-text-edit-bar");
      if (textEditBar) textEditBar.style.display = "none";
      if (typeof closeTextPopups === "function") closeTextPopups();
      removeEditPointsCanvasOverlay();
    }
  };

  // ── 7. Authentic Project Settings Modal (project_settings_fragment.xml) ──
  const ASPECT_RESOLUTIONS = {
    "16:9": {
      "1080": { w: 1920, h: 1080 },
      "720":  { w: 1280, h: 720 },
      "540":  { w: 960,  h: 540 },
      "480":  { w: 854,  h: 480 }
    },
    "9:16": {
      "1080": { w: 1080, h: 1920 },
      "720":  { w: 720,  h: 1280 },
      "540":  { w: 540,  h: 960 },
      "480":  { w: 480,  h: 854 }
    },
    "4:5": {
      "1080": { w: 1080, h: 1350 },
      "720":  { w: 720,  h: 900 },
      "540":  { w: 540,  h: 676 },
      "480":  { w: 480,  h: 600 }
    },
    "1:1": {
      "1080": { w: 1080, h: 1080 },
      "720":  { w: 720,  h: 720 },
      "540":  { w: 540,  h: 540 },
      "480":  { w: 480,  h: 480 }
    },
    "4:3": {
      "1080": { w: 1440, h: 1080 },
      "720":  { w: 960,  h: 720 },
      "540":  { w: 720,  h: 540 },
      "480":  { w: 640,  h: 480 }
    }
  };

  function detectProjectAspect(w, h) {
    if (!w || !h) return "9:16";
    const r = w / h;
    if (Math.abs(r - 16 / 9) < 0.05) return "16:9";
    if (Math.abs(r - 9 / 16) < 0.05) return "9:16";
    if (Math.abs(r - 4 / 5) < 0.05) return "4:5";
    if (Math.abs(r - 1) < 0.05) return "1:1";
    if (Math.abs(r - 4 / 3) < 0.05) return "4:3";
    return "custom";
  }

  function detectProjectResLevel(aspect, w, h) {
    if (aspect === "custom") return "720";
    const baseDim = (aspect === "16:9" || aspect === "4:3") ? h : w;
    if (baseDim >= 900) return "1080";
    if (baseDim >= 600) return "720";
    if (baseDim >= 500) return "540";
    return "480";
  }

  function detectProjectBgKey(bgcolor) {
    if (!bgcolor) return "black";
    if (typeof bgcolor === "string") {
      const s = bgcolor.toLowerCase();
      if (s === "transparent" || s === "#00000000") return "transparent";
      if (s === "#ffffffff" || s === "#ffffff") return "white";
      if (s.includes("b3b3b3") || s.includes("808080") || s.includes("c0c0c0") || s.includes("d0d0d0")) return "grey";
      return "black";
    }
    if (Array.isArray(bgcolor)) {
      const [r, g, b, a] = bgcolor;
      if (a === 0 || a < 0.05) return "transparent";
      if (r > 0.85 && g > 0.85 && b > 0.85) return "white";
      if (r > 0.4 && r < 0.85 && Math.abs(r - g) < 0.08 && Math.abs(g - b) < 0.08) return "grey";
      return "black";
    }
    return "black";
  }

  function applyCanvasReconfiguration(changes = {}) {
    const I = window.__AM_INTERNAL;
    if (!I || !I.val) return;
    const val = I.val;
    let changed = false;

    if (changes.title !== undefined) {
      const cleanTitle = String(changes.title).trim();
      if (cleanTitle && val.title !== cleanTitle) {
        val.title = cleanTitle;
        const topTitle = document.getElementById("am-project-title");
        if (topTitle) topTitle.value = cleanTitle;
        changed = true;
      }
    }

    if (changes.width !== undefined && changes.height !== undefined) {
      const w = Math.max(16, Math.round(changes.width));
      const h = Math.max(16, Math.round(changes.height));
      if (val.width !== w || val.height !== h) {
        val.width = w;
        val.height = h;
        val.exportWidth = w;
        val.exportHeight = h;
        I.w = w;
        I.h = h;

        const view = document.getElementById("view");
        if (view) {
          view.width = w;
          view.height = h;
        }
        const debugCanvas = document.getElementById("debugCanvas");
        if (debugCanvas) {
          debugCanvas.width = w;
          debugCanvas.height = h;
        }

        if (I.val2) {
          if (I.val2.scene) {
            I.val2.scene.width = w;
            I.val2.scene.height = h;
          }
          if (typeof I.val2.setResolution === "function") {
            I.val2.setResolution(h);
          } else {
            I.val2.workWidth = w;
            I.val2.workHeight = h;
            I.val2.baseWidth = w;
            I.val2.baseHeight = h;
            if (typeof I.val2.Oe === "function") I.val2.Oe();
          }
        }
        changed = true;
      }
    }

    if (changes.fps !== undefined) {
      const fps = Math.max(1, Math.min(120, Math.round(changes.fps)));
      if (val.fps !== fps) {
        val.fps = fps;
        const topFps = document.getElementById("am-nav-fps");
        if (topFps) topFps.textContent = `${fps} FPS`;
        changed = true;
      }
    }

    if (changes.bgcolor !== undefined) {
      const bg = changes.bgcolor;
      const view = document.getElementById("view");
      if (view) {
        view.classList.remove("am-canvas-bg-black", "am-canvas-bg-white", "am-canvas-bg-grey", "am-canvas-bg-transparent");
      }

      if (bg === "transparent") {
        val.bgcolor = [0, 0, 0, 0];
        if (view) view.classList.add("am-canvas-bg-transparent");
      } else if (bg === "white") {
        val.bgcolor = [1, 1, 1, 1];
        if (view) view.classList.add("am-canvas-bg-white");
      } else if (bg === "grey") {
        val.bgcolor = [0.7, 0.7, 0.7, 1];
        if (view) view.classList.add("am-canvas-bg-grey");
      } else {
        val.bgcolor = [0, 0, 0, 1];
        if (view) view.classList.add("am-canvas-bg-black");
      }
      changed = true;
    }

    if (changed) {
      if (typeof I.fitCanvas === "function") I.fitCanvas();
      if (I.val2 && typeof I.val2.renderAt === "function") {
        I.val2.renderAt(I.H || 0);
      }
      if (typeof I.buildTimeline === "function") I.buildTimeline();
      if (typeof I.bind4 === "function") I.bind4();
      if (typeof I.omScheduleSave === "function") I.omScheduleSave();
    }
  }

  function openProjectSettings() {
    const I = window.__AM_INTERNAL;
    if (!I || !I.val) return;
    const val = I.val;

    let backdrop = document.getElementById("am-project-settings-backdrop");
    if (!backdrop) {
      backdrop = document.createElement("div");
      backdrop.id = "am-project-settings-backdrop";
      backdrop.innerHTML = `
        <div id="am-project-settings-sheet">
          <div class="am-settings-header">
            <button type="button" id="am-settings-close" class="am-settings-cancel-btn" title="Tutup">
              <img src="./icons/ac_ic_cancel.svg" alt="Cancel">
            </button>
            <div class="am-settings-title">Pengaturan Proyek</div>
            <div class="am-settings-header-right"></div>
          </div>

          <div class="am-aspect-holder">
            <div class="am-aspect-card am-aspect-16-9" data-aspect="16:9">
              <div class="am-aspect-box"></div>
              <span>16:9</span>
            </div>
            <div class="am-aspect-card am-aspect-9-16" data-aspect="9:16">
              <div class="am-aspect-box"></div>
              <span>9:16</span>
            </div>
            <div class="am-aspect-card am-aspect-4-5" data-aspect="4:5">
              <div class="am-aspect-box"></div>
              <span>4:5</span>
            </div>
            <div class="am-aspect-card am-aspect-1-1" data-aspect="1:1">
              <div class="am-aspect-box"></div>
              <span>1:1</span>
            </div>
            <div class="am-aspect-card am-aspect-4-3" data-aspect="4:3">
              <div class="am-aspect-box"></div>
              <span>4:3</span>
            </div>
            <div class="am-aspect-card am-aspect-custom" data-aspect="custom">
              <div class="am-aspect-icon">
                <img src="./icons/ac_ic_custom_aspect.svg" alt="Custom">
              </div>
              <span>Kustom</span>
            </div>
          </div>

          <div class="am-settings-form">
            <div class="am-setting-row">
              <div class="am-setting-label-col">
                <span class="am-setting-label">Resolusi</span>
                <span id="am-settings-size-info" class="am-setting-sublabel">1080 × 1920</span>
              </div>
              <div id="am-res-container">
                <select id="am-set-res" class="am-setting-select">
                  <option value="1080">1080p FHD</option>
                  <option value="720">720p HD</option>
                  <option value="540">540p</option>
                  <option value="480">480p</option>
                </select>
                <div id="am-custom-res-holder" class="am-custom-res-box" style="display:none;">
                  <input type="number" id="am-custom-w" class="am-custom-res-input" min="16" max="7680" step="2" />
                  <button type="button" id="am-btn-size-link" class="am-btn-size-link" title="Kunci Rasio Aspek">
                    <img id="am-img-size-link" src="./icons/ic_projectsetup_link.svg" alt="Link" />
                  </button>
                  <input type="number" id="am-custom-h" class="am-custom-res-input" min="16" max="7680" step="2" />
                </div>
              </div>
            </div>

            <div class="am-setting-row">
              <div class="am-setting-label-col">
                <span class="am-setting-label">Frame Rate</span>
              </div>
              <select id="am-set-fps" class="am-setting-select">
                <option value="12">12 fps</option>
                <option value="15">15 fps</option>
                <option value="24">24 fps</option>
                <option value="30">30 fps</option>
                <option value="60">60 fps</option>
              </select>
            </div>

            <div class="am-setting-row">
              <div class="am-setting-label-col">
                <span class="am-setting-label">Latar Belakang</span>
              </div>
              <div class="am-bg-container">
                <div class="am-color-swatches" id="am-set-bgs">
                  <div class="am-color-swatch" data-bg="black" style="background:#000000;box-shadow:inset 0 0 0 1px #444;" title="Hitam"></div>
                  <div class="am-color-swatch" data-bg="white" style="background:#ffffff;" title="Putih"></div>
                  <div class="am-color-swatch" data-bg="grey" style="background:#b3b3b3;" title="Abu-abu Muda"></div>
                  <div class="am-color-swatch" data-bg="transparent" title="Transparan"></div>
                </div>
                <select id="am-set-bg" class="am-setting-select" style="min-width:110px;">
                  <option value="black">Hitam</option>
                  <option value="white">Putih</option>
                  <option value="grey">Abu-abu</option>
                  <option value="transparent">Transparan</option>
                </select>
              </div>
            </div>

            <div class="am-setting-row" style="margin-top:2px;">
              <div class="am-setting-label-col">
                <span class="am-setting-label">Nama Proyek</span>
              </div>
              <input type="text" id="am-set-title" class="am-custom-res-input" style="width:160px;text-align:right;padding:0 10px;" />
            </div>
          </div>
        </div>
      `;
      document.body.appendChild(backdrop);

      backdrop.addEventListener("click", (e) => {
        if (e.target === backdrop) backdrop.classList.remove("open");
      });
      document.getElementById("am-settings-close").addEventListener("click", () => {
        backdrop.classList.remove("open");
      });

      let isSizeLinked = true;
      let customRatio = 9 / 16;

      const sizeInfo = document.getElementById("am-settings-size-info");
      const resSelect = document.getElementById("am-set-res");
      const customHolder = document.getElementById("am-custom-res-holder");
      const customW = document.getElementById("am-custom-w");
      const customH = document.getElementById("am-custom-h");
      const linkBtn = document.getElementById("am-btn-size-link");
      const linkImg = document.getElementById("am-img-size-link");
      const fpsSelect = document.getElementById("am-set-fps");
      const bgSelect = document.getElementById("am-set-bg");
      const titleInput = document.getElementById("am-set-title");

      function updateSizeLabel(w, h) {
        if (sizeInfo) sizeInfo.textContent = `${w} × ${h}`;
      }

      function updateActiveAspectUI(aspect) {
        backdrop.querySelectorAll(".am-aspect-card").forEach(c => {
          c.classList.toggle("active", c.dataset.aspect === aspect);
        });
        if (aspect === "custom") {
          resSelect.style.display = "none";
          customHolder.style.display = "flex";
        } else {
          resSelect.style.display = "block";
          customHolder.style.display = "none";
        }
      }

      function updateBgUI(key) {
        backdrop.querySelectorAll(".am-color-swatch").forEach(s => {
          s.classList.toggle("active", s.dataset.bg === key);
        });
        if (bgSelect) bgSelect.value = key;
      }

      // Aspect card selection
      backdrop.querySelectorAll(".am-aspect-card").forEach(card => {
        card.addEventListener("click", () => {
          const aspect = card.dataset.aspect;
          updateActiveAspectUI(aspect);

          if (aspect === "custom") {
            customW.value = val.width;
            customH.value = val.height;
            customRatio = (val.width / val.height) || (9 / 16);
            updateSizeLabel(val.width, val.height);
          } else {
            const level = resSelect.value || "720";
            const dims = (ASPECT_RESOLUTIONS[aspect] && ASPECT_RESOLUTIONS[aspect][level]) || { w: 720, h: 1280 };
            updateSizeLabel(dims.w, dims.h);
            customW.value = dims.w;
            customH.value = dims.h;
            applyCanvasReconfiguration({ width: dims.w, height: dims.h });
          }
        });
      });

      // Resolution dropdown selection
      if (resSelect) {
        resSelect.addEventListener("change", () => {
          const activeCard = backdrop.querySelector(".am-aspect-card.active");
          const aspect = activeCard ? activeCard.dataset.aspect : "9:16";
          if (aspect !== "custom") {
            const level = resSelect.value;
            const dims = (ASPECT_RESOLUTIONS[aspect] && ASPECT_RESOLUTIONS[aspect][level]) || { w: 720, h: 1280 };
            updateSizeLabel(dims.w, dims.h);
            customW.value = dims.w;
            customH.value = dims.h;
            applyCanvasReconfiguration({ width: dims.w, height: dims.h });
          }
        });
      }

      // Custom width / height inputs
      if (customW) {
        customW.addEventListener("input", () => {
          const w = parseInt(customW.value, 10);
          if (w >= 16) {
            let h = parseInt(customH.value, 10) || val.height;
            if (isSizeLinked && customRatio > 0) {
              h = Math.max(16, Math.round((w / customRatio) / 2) * 2);
              customH.value = h;
            }
            updateSizeLabel(w, h);
            applyCanvasReconfiguration({ width: w, height: h });
          }
        });
      }

      if (customH) {
        customH.addEventListener("input", () => {
          const h = parseInt(customH.value, 10);
          if (h >= 16) {
            let w = parseInt(customW.value, 10) || val.width;
            if (isSizeLinked && customRatio > 0) {
              w = Math.max(16, Math.round((h * customRatio) / 2) * 2);
              customW.value = w;
            }
            updateSizeLabel(w, h);
            applyCanvasReconfiguration({ width: w, height: h });
          }
        });
      }

      // Size link toggle
      if (linkBtn) {
        linkBtn.addEventListener("click", () => {
          isSizeLinked = !isSizeLinked;
          if (linkImg) {
            linkImg.src = isSizeLinked ? "./icons/ic_projectsetup_link.svg" : "./icons/ic_projectsetup_unlink.svg";
          }
          if (isSizeLinked) {
            const w = parseInt(customW.value, 10) || val.width || 720;
            const h = parseInt(customH.value, 10) || val.height || 1280;
            customRatio = (w / h) || (9 / 16);
          }
        });
      }

      // Frame rate selection
      if (fpsSelect) {
        fpsSelect.addEventListener("change", () => {
          const fps = parseInt(fpsSelect.value, 10) || 30;
          applyCanvasReconfiguration({ fps });
        });
      }

      // Background swatches
      backdrop.querySelectorAll(".am-color-swatch").forEach(swatch => {
        swatch.addEventListener("click", () => {
          const bgKey = swatch.dataset.bg;
          updateBgUI(bgKey);
          applyCanvasReconfiguration({ bgcolor: bgKey });
        });
      });

      // Background dropdown
      if (bgSelect) {
        bgSelect.addEventListener("change", () => {
          const bgKey = bgSelect.value;
          updateBgUI(bgKey);
          applyCanvasReconfiguration({ bgcolor: bgKey });
        });
      }

      // Title input
      if (titleInput) {
        titleInput.addEventListener("input", () => {
          applyCanvasReconfiguration({ title: titleInput.value });
        });
      }
    }

    // Populate current values upon opening
    const curW = val.width || 720;
    const curH = val.height || 1280;
    const curAspect = detectProjectAspect(curW, curH);
    const curRes = detectProjectResLevel(curAspect, curW, curH);
    const curBg = detectProjectBgKey(val.bgcolor);
    const curFps = Math.round(val.fps || 30);

    const sizeInfo = document.getElementById("am-settings-size-info");
    if (sizeInfo) sizeInfo.textContent = `${curW} × ${curH}`;

    const resSelect = document.getElementById("am-set-res");
    if (resSelect) resSelect.value = curRes;

    const customHolder = document.getElementById("am-custom-res-holder");
    if (customHolder) customHolder.style.display = curAspect === "custom" ? "flex" : "none";
    if (resSelect) resSelect.style.display = curAspect === "custom" ? "none" : "block";

    const customW = document.getElementById("am-custom-w");
    if (customW) customW.value = curW;
    const customH = document.getElementById("am-custom-h");
    if (customH) customH.value = curH;

    const fpsSelect = document.getElementById("am-set-fps");
    if (fpsSelect) {
      const matchOpt = Array.from(fpsSelect.options).find(o => parseInt(o.value, 10) === curFps);
      if (matchOpt) fpsSelect.value = String(curFps);
      else fpsSelect.value = "30";
    }

    const titleInput = document.getElementById("am-set-title");
    if (titleInput) titleInput.value = val.title || "Proyek Baru";

    backdrop.querySelectorAll(".am-aspect-card").forEach(c => {
      c.classList.toggle("active", c.dataset.aspect === curAspect);
    });

    backdrop.querySelectorAll(".am-color-swatch").forEach(s => {
      s.classList.toggle("active", s.dataset.bg === curBg);
    });
    const bgSelect = document.getElementById("am-set-bg");
    if (bgSelect) bgSelect.value = curBg;

    backdrop.classList.add("open");
  }

  if (typeof window !== "undefined") {
    if (window.__AM_INTERNAL) {
      window.__AM_INTERNAL.openProjectSettings = openProjectSettings;
      window.__AM_INTERNAL.applyCanvasReconfiguration = applyCanvasReconfiguration;
      if (!Object.getOwnPropertyDescriptor(window.__AM_INTERNAL, "w")) {
        Object.defineProperty(window.__AM_INTERNAL, "w", {
          get() {
            const I = window.__AM_INTERNAL;
            return (I.val && I.val.width) || (document.getElementById("view") ? document.getElementById("view").width : 0);
          },
          set(v) {
            const I = window.__AM_INTERNAL;
            if (I.val) {
              I.val.width = Math.round(v);
              I.val.exportWidth = Math.round(v);
            }
          },
          configurable: true
        });
      }
      if (!Object.getOwnPropertyDescriptor(window.__AM_INTERNAL, "h")) {
        Object.defineProperty(window.__AM_INTERNAL, "h", {
          get() {
            const I = window.__AM_INTERNAL;
            return (I.val && I.val.height) || (document.getElementById("view") ? document.getElementById("view").height : 0);
          },
          set(v) {
            const I = window.__AM_INTERNAL;
            if (I.val) {
              I.val.height = Math.round(v);
              I.val.exportHeight = Math.round(v);
            }
          },
          configurable: true
        });
      }
    }
  }

  // ── 8. Authentic Export Sheet (export_list_popup_frag.xml) ──
  // ── 8. Authentic Export Sheet (export_list_popup_frag.xml) ──
  function openExportSheet() {
    const I = window.__AM_INTERNAL;
    let backdrop = document.getElementById("am-export-backdrop");
    if (!backdrop) {
      backdrop = document.createElement("div");
      backdrop.id = "am-export-backdrop";
      backdrop.innerHTML = `
        <div id="am-export-sheet">
          <div class="am-sheet-header-export">
            <button id="am-export-back" class="am-sheet-back">
              <img src="./icons/ac_ic_back.svg" alt="Back">
            </button>
            <div id="am-export-title" class="am-sheet-title">Ekspor dan Bagikan</div>
            <button id="am-export-close" class="am-sheet-close">
              <img src="./icons/ac_ic_cancel.svg" alt="Cancel">
            </button>
          </div>

          <!-- Estimates -->
          <div class="am-export-estimates">
            <span>Ruang tersedia: <strong>14.2 GB</strong></span>
            <span>Perkiraan ukuran: <strong id="am-exp-est-size">~3.8 MB</strong></span>
          </div>

          <!-- View 1: Main Export List -->
          <div id="am-export-list-view">
            <div class="am-export-list">
              <!-- 1. Video -->
              <div class="am-export-item active" data-type="video">
                <div class="am-export-radio"></div>
                <img class="am-export-icon" src="./icons/ic_export_video.svg" alt="Video">
                <div class="am-export-info">
                  <div class="am-export-name">Video</div>
                  <div class="am-export-desc" id="am-video-desc-label">MP4 · 720p HD · 30 fps</div>
                </div>
                <button type="button" id="am-btn-to-settings" class="am-export-arrow-btn" aria-label="Pengaturan Video">
                  <img src="./icons/ic_export_arrow_right.svg" alt="Settings">
                </button>
              </div>

              <!-- Quick options drawer when video selected -->
              <div class="am-export-quick-options" id="am-video-quick-options">
                <div class="am-quick-opt-row">
                  <span>Resolusi Ekspor</span>
                  <select id="am-quick-res" class="am-quick-opt-select">
                    <option value="1080">1080p FHD</option>
                    <option value="720" selected>720p HD</option>
                    <option value="540">540p</option>
                    <option value="480">480p</option>
                    <option value="360">360p</option>
                  </select>
                </div>
                <div class="am-quick-opt-row">
                  <span>Frame Rate</span>
                  <select id="am-quick-fps" class="am-quick-opt-select">
                    <option value="60">60 fps (Penuh)</option>
                    <option value="30" selected>30 fps (Dikurangi)</option>
                    <option value="24">24 fps (Rendah)</option>
                  </select>
                </div>
              </div>

              <!-- 2. GIF Animasi -->
              <div class="am-export-item" data-type="gif">
                <div class="am-export-radio"></div>
                <img class="am-export-icon" src="./icons/ic_export_gif.svg" alt="GIF">
                <div class="am-export-info">
                  <div class="am-export-name">GIF Animasi</div>
                  <div class="am-export-desc">Animasi berulang tanpa suara</div>
                </div>
              </div>

              <!-- 3. Urutan Gambar PNG -->
              <div class="am-export-item" data-type="sequence">
                <div class="am-export-radio"></div>
                <img class="am-export-icon" src="./icons/ic_export_imagesequence.svg" alt="Urutan Gambar">
                <div class="am-export-info">
                  <div class="am-export-name">Urutan Gambar PNG</div>
                  <div class="am-export-desc">Semua frame dalam paket ZIP</div>
                </div>
              </div>

              <!-- 4. Frame Saat Ini sebagai PNG -->
              <div class="am-export-item" data-type="currentframe">
                <div class="am-export-radio"></div>
                <img class="am-export-icon" src="./icons/ic_export_currentframe.svg" alt="Frame Saat Ini">
                <div class="am-export-info">
                  <div class="am-export-name">Frame Saat Ini sebagai PNG</div>
                  <div class="am-export-desc">Gambar tunggal pada playhead</div>
                </div>
              </div>

              <!-- 5. Paket Proyek -->
              <div class="am-export-item" data-type="package">
                <div class="am-export-radio"></div>
                <img class="am-export-icon" src="./icons/ic_export_package.svg" alt="Paket Proyek">
                <div class="am-export-info">
                  <div class="am-export-name">Paket Proyek</div>
                  <div class="am-export-desc">Bundel semua aset dan XML (.amproject)</div>
                </div>
              </div>

              <!-- 6. XML Preset -->
              <div class="am-export-item" data-type="xml">
                <div class="am-export-radio"></div>
                <img class="am-export-icon" src="./icons/ic_export_xml.svg" alt="XML">
                <div class="am-export-info">
                  <div class="am-export-name">XML Proyek Alight Motion</div>
                  <div class="am-export-desc">File preset standar Alight Motion / Open Motion</div>
                </div>
              </div>
            </div>

            <!-- Template Export Toggle -->
            <div class="am-template-toggle-row">
              <div class="am-template-toggle-label">
                <img src="./icons/ic_export_template.svg" alt="Template">
                <span>Ekspor sebagai Templat</span>
              </div>
              <label class="am-switch">
                <input type="checkbox" id="am-template-toggle-input">
                <span class="am-switch-slider"></span>
              </label>
            </div>
          </div>

          <!-- View 2: Video Export Settings (settingsHolder in export_list_popup_frag.xml) -->
          <div id="am-export-settings-view">
            <!-- Resolusi Ekspor -->
            <div class="am-settings-group">
              <div class="am-settings-label-row">
                <span>Resolusi Ekspor</span>
              </div>
              <select id="am-settings-res" class="am-settings-select">
                <option value="1080">1080p FHD</option>
                <option value="720" selected>720p HD</option>
                <option value="540">540p</option>
                <option value="480">480p</option>
                <option value="360">360p</option>
              </select>
            </div>

            <!-- Codec -->
            <div class="am-settings-group">
              <div class="am-settings-label-row">
                <span>Codec</span>
              </div>
              <div class="am-segmented-group" id="am-codec-segmented">
                <button type="button" class="am-segmented-btn active" data-codec="h264">H.264/AVC</button>
                <button type="button" class="am-segmented-btn" data-codec="h265">H.265/HEVC</button>
              </div>
            </div>

            <!-- Kecepatan Frame -->
            <div class="am-settings-group">
              <div class="am-settings-label-row">
                <span>Kecepatan Frame</span>
                <span id="am-settings-fps-label" class="am-settings-val-badge">30 fps</span>
              </div>
              <div class="am-segmented-group" id="am-fps-segmented">
                <button type="button" class="am-segmented-btn" data-fps="24">Rendah (24)</button>
                <button type="button" class="am-segmented-btn active" data-fps="30">Dikurangi (30)</button>
                <button type="button" class="am-segmented-btn" data-fps="60">Penuh (60)</button>
              </div>
            </div>

            <!-- Kualitas / Bitrate Slider -->
            <div class="am-settings-group">
              <div class="am-settings-label-row">
                <span>Kualitas</span>
                <span id="am-settings-quality-label" class="am-settings-val-badge">8.00 Mbps</span>
              </div>
              <div class="am-quality-range-row">
                <span>Rendah</span>
                <span>Tinggi</span>
              </div>
              <input type="range" id="am-settings-quality-slider" class="am-export-slider" min="0.1" max="2.0" step="0.05" value="0.5">
            </div>
          </div>

          <button id="am-btn-do-export" class="am-btn-apply">EKSPOR</button>
        </div>
      `;
      document.body.appendChild(backdrop);

      // State variables
      let currentMode = "list"; // "list" | "settings"
      let currentCodec = "h264";
      let currentFps = 30;
      let currentRes = "720";
      let currentQuality = 0.5;

      const listView = document.getElementById("am-export-list-view");
      const settingsView = document.getElementById("am-export-settings-view");
      const backBtn = document.getElementById("am-export-back");
      const titleEl = document.getElementById("am-export-title");
      const estSizeEl = document.getElementById("am-exp-est-size");
      const videoDescLabel = document.getElementById("am-video-desc-label");

      function updateEstimates() {
        const durSec = Math.max(1, (I?.val?.totalTime || 3000) / 1000);
        const resNum = parseInt(currentRes, 10) || 720;
        const w = Math.round(resNum * 9 / 16);
        const mbps = Math.max(1.0, Math.min(40.0, (w * resNum * currentFps * currentQuality * 0.08) / 1000000));
        const estMB = ((mbps + 0.128) * durSec) / 8;
        if (estSizeEl) estSizeEl.textContent = `~${estMB.toFixed(1)} MB`;
        const qLabel = document.getElementById("am-settings-quality-label");
        if (qLabel) qLabel.textContent = `${mbps.toFixed(2)} Mbps`;
        if (videoDescLabel) {
          videoDescLabel.textContent = `MP4 · ${resNum}p · ${currentFps} fps`;
        }
      }

      function switchMode(mode) {
        currentMode = mode;
        if (mode === "settings") {
          listView.classList.add("hidden");
          settingsView.classList.add("active");
          backBtn.classList.add("visible");
          titleEl.textContent = "Pengaturan Ekspor";
        } else {
          listView.classList.remove("hidden");
          settingsView.classList.remove("active");
          backBtn.classList.remove("visible");
          titleEl.textContent = "Ekspor dan Bagikan";
        }
        updateEstimates();
      }

      backdrop.addEventListener("click", (e) => {
        if (e.target === backdrop) backdrop.classList.remove("open");
      });
      document.getElementById("am-export-close").addEventListener("click", () => {
        backdrop.classList.remove("open");
      });
      backBtn.addEventListener("click", () => {
        switchMode("list");
      });

      // Arrow button to settings
      const btnToSettings = document.getElementById("am-btn-to-settings");
      if (btnToSettings) {
        btnToSettings.addEventListener("click", (e) => {
          e.stopPropagation();
          switchMode("settings");
        });
      }

      // Format selection
      backdrop.querySelectorAll(".am-export-item").forEach(item => {
        item.addEventListener("click", () => {
          backdrop.querySelectorAll(".am-export-item").forEach(x => x.classList.remove("active"));
          item.classList.add("active");
          const quick = document.getElementById("am-video-quick-options");
          if (quick) quick.style.display = item.dataset.type === "video" ? "flex" : "none";
        });
      });

      // Quick options sync
      const quickRes = document.getElementById("am-quick-res");
      const quickFps = document.getElementById("am-quick-fps");
      const setRes = document.getElementById("am-settings-res");
      const setQualitySlider = document.getElementById("am-settings-quality-slider");

      if (quickRes) {
        quickRes.addEventListener("change", () => {
          currentRes = quickRes.value;
          if (setRes) setRes.value = currentRes;
          updateEstimates();
        });
      }
      if (quickFps) {
        quickFps.addEventListener("change", () => {
          currentFps = parseInt(quickFps.value, 10) || 30;
          const fpsBadges = document.querySelectorAll("#am-fps-segmented .am-segmented-btn");
          fpsBadges.forEach(b => {
            b.classList.toggle("active", b.dataset.fps === String(currentFps));
          });
          const lbl = document.getElementById("am-settings-fps-label");
          if (lbl) lbl.textContent = `${currentFps} fps`;
          updateEstimates();
        });
      }

      // Settings options sync
      if (setRes) {
        setRes.addEventListener("change", () => {
          currentRes = setRes.value;
          if (quickRes) quickRes.value = currentRes;
          updateEstimates();
        });
      }

      // Codec segmented
      document.querySelectorAll("#am-codec-segmented .am-segmented-btn").forEach(btn => {
        btn.addEventListener("click", () => {
          document.querySelectorAll("#am-codec-segmented .am-segmented-btn").forEach(b => b.classList.remove("active"));
          btn.classList.add("active");
          currentCodec = btn.dataset.codec || "h264";
        });
      });

      // FPS segmented
      document.querySelectorAll("#am-fps-segmented .am-segmented-btn").forEach(btn => {
        btn.addEventListener("click", () => {
          document.querySelectorAll("#am-fps-segmented .am-segmented-btn").forEach(b => b.classList.remove("active"));
          btn.classList.add("active");
          currentFps = parseInt(btn.dataset.fps, 10) || 30;
          if (quickFps) quickFps.value = String(currentFps);
          const lbl = document.getElementById("am-settings-fps-label");
          if (lbl) lbl.textContent = `${currentFps} fps`;
          updateEstimates();
        });
      });

      // Quality slider
      if (setQualitySlider) {
        setQualitySlider.addEventListener("input", () => {
          currentQuality = parseFloat(setQualitySlider.value) || 0.5;
          updateEstimates();
        });
      }

      // Initial estimates update
      updateEstimates();

      // Perform Export Button Click
      document.getElementById("am-btn-do-export").addEventListener("click", async () => {
        const active = backdrop.querySelector(".am-export-item.active");
        const isTemplate = document.getElementById("am-template-toggle-input")?.checked;
        const type = active ? active.dataset.type : "video";

        backdrop.classList.remove("open");

        if (type === "video") {
          const expRes = document.getElementById("expRes");
          if (expRes) expRes.value = currentRes;
          const expFps = document.getElementById("expFps");
          if (expFps) expFps.value = String(currentFps);
          const expBit = document.getElementById("expBitrate");
          if (expBit) expBit.value = String(currentQuality);
          const expCodec = document.getElementById("expCodec");
          if (expCodec) expCodec.value = currentCodec;

          showExportProgressModal(() => {
            if (I?.cancelVideoExport) I.cancelVideoExport();
          });

          if (I?.startVideoExport) {
            I.startVideoExport({
              resolution: currentRes,
              fps: currentFps,
              bitrate: currentQuality,
              codec: currentCodec
            });
          } else {
            const expStart = document.getElementById("expStart");
            if (expStart) expStart.click();
          }

        } else if (type === "sequence") {
          showExportProgressModal(() => {
            if (I?.cancelVideoExport) I.cancelVideoExport();
          });
          const progTitle = document.querySelector("#am-export-progress-modal .am-progress-title");
          if (progTitle) progTitle.textContent = "Mengekspor Urutan Gambar...";

          if (I?.exportImageSequenceZip) {
            const onProg = (p) => {
              window.dispatchEvent(new CustomEvent("am-export-progress", {
                detail: {
                  phase: "render",
                  frame: p.frame,
                  total: p.total,
                  pct: p.pct,
                  status: `Menyimpan frame ${p.frame}/${p.total}`
                }
              }));
            };
            try {
              const zipBlob = await I.exportImageSequenceZip(onProg);
              const modal = document.getElementById("am-export-progress-modal");
              if (modal) modal.classList.remove("open");
              if (zipBlob) {
                const a = document.createElement("a");
                a.download = (I?.val?.title || "project") + "_frames.zip";
                a.href = URL.createObjectURL(zipBlob);
                a.click();
              }
            } catch (err) {
              const modal = document.getElementById("am-export-progress-modal");
              if (modal) modal.classList.remove("open");
              alert("Ekspor urutan gambar gagal: " + err.message);
            }
          }

        } else if (type === "currentframe") {
          if (I?.exportCurrentFrameBlob) {
            const blob = await I.exportCurrentFrameBlob();
            if (blob) {
              const a = document.createElement("a");
              a.download = (I?.val?.title || "frame") + "_" + Math.round(I?.H || 0) + "ms.png";
              a.href = URL.createObjectURL(blob);
              a.click();
            }
          } else {
            const view = document.getElementById("view");
            if (view) {
              const a = document.createElement("a");
              a.download = (I?.val?.title || "frame") + "_" + Math.round(I?.H || 0) + "ms.png";
              a.href = view.toDataURL("image/png");
              a.click();
            }
          }
        } else if (type === "xml") {
          const xml = I?.omSerializeScene ? I.omSerializeScene() : "";
          if (xml) {
            const blob = new Blob([xml], { type: "application/xml" });
            const a = document.createElement("a");
            a.download = (I?.val?.title || "open_motion_preset") + ".xml";
            a.href = URL.createObjectURL(blob);
            a.click();
          }
        } else if (type === "package" || isTemplate) {
          const xml = I?.omSerializeScene ? I.omSerializeScene() : "";
          const pkg = {
            name: I?.val?.title || "Template Open Motion",
            isTemplate: !!isTemplate,
            exportedAt: new Date().toISOString(),
            xml,
            media: I?.val?.media || []
          };
          const blob = new Blob([JSON.stringify(pkg, null, 2)], { type: "application/json" });
          const a = document.createElement("a");
          a.download = (I?.val?.title || "project") + (isTemplate ? ".amtemplate" : ".amproject");
          a.href = URL.createObjectURL(blob);
          a.click();
        } else if (type === "gif") {
          alert("Format GIF akan segera diproses di build berikutnya.");
        }
      });
    }

    backdrop.classList.add("open");
  }

  // ── 9. Authentic Export Progress Modal (export_progress_dialog.xml) ──
  function showExportProgressModal(onCancel) {
    let modal = document.getElementById("am-export-progress-modal");
    if (!modal) {
      modal = document.createElement("div");
      modal.id = "am-export-progress-modal";
      modal.innerHTML = `
        <div class="am-progress-card">
          <div class="am-progress-title">Mengekspor Video...</div>
          <div class="am-progress-track">
            <div class="am-progress-fill" id="am-prog-fill"></div>
          </div>
          <div class="am-progress-row">
            <span id="am-prog-pct">0%</span>
            <span id="am-prog-eta">Menyiapkan...</span>
          </div>
          <div class="am-progress-status" id="am-prog-status">Menyiapkan frame...</div>
          <button id="am-prog-cancel" class="am-progress-btn-cancel">BATAL</button>
          <div class="am-progress-warning">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            <span>Harap jangan keluar dari Alight Motion atau mengunci layar Anda saat ekspor sedang berlangsung.</span>
          </div>
        </div>
      `;
      document.body.appendChild(modal);

      document.getElementById("am-prog-cancel").addEventListener("click", () => {
        const expCancel = document.getElementById("expCancel");
        if (expCancel) expCancel.click();
        const I = window.__AM_INTERNAL;
        if (I?.cancelVideoExport) I.cancelVideoExport();
        modal.classList.remove("open");
      });
    }

    modal.classList.add("open");
    const fillEl = document.getElementById("am-prog-fill");
    const pctEl = document.getElementById("am-prog-pct");
    const etaEl = document.getElementById("am-prog-eta");
    const statEl = document.getElementById("am-prog-status");

    if (fillEl) fillEl.style.width = "0%";
    if (pctEl) pctEl.textContent = "0%";
    if (etaEl) etaEl.textContent = "Menyiapkan...";
    if (statEl) statEl.textContent = "Menyiapkan encoder...";

    // Listen for custom export events
    function onProgress(e) {
      const d = e.detail;
      if (!d) return;
      const pct = Math.min(100, Math.max(0, d.pct || 0));
      if (fillEl) fillEl.style.width = pct + "%";
      if (pctEl) pctEl.textContent = pct + "%";

      if (etaEl) {
        if (d.etaMs && d.etaMs > 0) {
          const s = Math.round(d.etaMs / 1000);
          const m = Math.floor(s / 60);
          const remS = s % 60;
          etaEl.textContent = `${m}:${String(remS).padStart(2, "0")} tersisa`;
        } else if (pct >= 100) {
          etaEl.textContent = "Selesai";
        }
      }

      if (statEl) {
        if (d.frame && d.total) {
          statEl.textContent = `Merender frame ${d.frame}/${d.total}`;
        } else if (d.status) {
          statEl.textContent = d.status + (d.message ? ` - ${d.message}` : "");
        }
      }
    }

    function onComplete(e) {
      cleanup();
      modal.classList.remove("open");
      if (e.detail) {
        showExportPreviewModal(e.detail);
      }
    }

    function onCancelled() {
      cleanup();
      modal.classList.remove("open");
    }

    function onError(e) {
      cleanup();
      modal.classList.remove("open");
      alert("Ekspor video gagal: " + (e.detail?.message || "Kesalahan tidak diketahui"));
    }

    function cleanup() {
      window.removeEventListener("am-export-progress", onProgress);
      window.removeEventListener("am-export-complete", onComplete);
      window.removeEventListener("am-export-cancelled", onCancelled);
      window.removeEventListener("am-export-error", onError);
    }

    window.addEventListener("am-export-progress", onProgress);
    window.addEventListener("am-export-complete", onComplete);
    window.addEventListener("am-export-cancelled", onCancelled);
    window.addEventListener("am-export-error", onError);
  }

  // ── 10. Authentic Export Preview Modal (activity_export_preview.xml) ──
  function showExportPreviewModal(exportData) {
    const I = window.__AM_INTERNAL;
    let modal = document.getElementById("am-export-preview-modal");
    if (!modal) {
      modal = document.createElement("div");
      modal.id = "am-export-preview-modal";
      modal.innerHTML = `
        <div class="am-preview-header">
          <div class="am-preview-title" id="am-prev-title">Pratinjau Ekspor</div>
        </div>
        <div class="am-preview-player-wrap">
          <video id="am-prev-video" class="am-preview-video" playsinline preload="auto"></video>
          <div class="am-preview-controls">
            <button id="am-prev-play-btn" class="am-preview-play-btn" type="button" aria-label="Play/Pause">
              <svg id="am-prev-play-icon" viewBox="0 0 24 24" fill="currentColor"><polygon points="5,3 19,12 5,21"/></svg>
              <svg id="am-prev-pause-icon" viewBox="0 0 24 24" fill="currentColor" style="display:none;"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
            </button>
            <input type="range" id="am-prev-seek" class="am-preview-seek-slider" min="0" max="100" step="0.1" value="0">
            <div id="am-prev-time" class="am-preview-time">00:00 / 00:00</div>
          </div>
        </div>
        <div class="am-preview-actions-panel">
          <div class="am-preview-btn-row">
            <button id="am-prev-btn-save" class="am-preview-action-btn" type="button">
              <img src="./icons/ic_share_download_wh.svg" alt="Save">
              <span id="am-prev-save-text">Simpan ke Galeri</span>
            </button>
            <button id="am-prev-btn-share" class="am-preview-action-btn" type="button">
              <img src="./icons/ic_share.svg" alt="Share">
              <span>Bagikan</span>
            </button>
          </div>
          <button id="am-prev-btn-close" class="am-preview-btn-done" type="button">Tutup</button>
        </div>
      `;
      document.body.appendChild(modal);

      const video = document.getElementById("am-prev-video");
      const playBtn = document.getElementById("am-prev-play-btn");
      const playIcon = document.getElementById("am-prev-play-icon");
      const pauseIcon = document.getElementById("am-prev-pause-icon");
      const seekSlider = document.getElementById("am-prev-seek");
      const timeDisplay = document.getElementById("am-prev-time");
      const btnSave = document.getElementById("am-prev-btn-save");
      const saveText = document.getElementById("am-prev-save-text");
      const btnShare = document.getElementById("am-prev-btn-share");
      const btnClose = document.getElementById("am-prev-btn-close");

      function formatTime(sec) {
        if (!sec || isNaN(sec)) return "00:00";
        const m = Math.floor(sec / 60);
        const s = Math.floor(sec % 60);
        return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
      }

      function updatePlayState() {
        if (video.paused) {
          playIcon.style.display = "block";
          pauseIcon.style.display = "none";
        } else {
          playIcon.style.display = "none";
          pauseIcon.style.display = "block";
        }
      }

      playBtn.addEventListener("click", () => {
        if (video.paused) {
          video.play();
        } else {
          video.pause();
        }
        updatePlayState();
      });

      video.addEventListener("play", updatePlayState);
      video.addEventListener("pause", updatePlayState);
      video.addEventListener("ended", () => {
        updatePlayState();
        seekSlider.value = 0;
      });

      video.addEventListener("timeupdate", () => {
        if (video.duration) {
          const pct = (video.currentTime / video.duration) * 100;
          seekSlider.value = pct;
          timeDisplay.textContent = `${formatTime(video.currentTime)} / ${formatTime(video.duration)}`;
        }
      });

      seekSlider.addEventListener("input", () => {
        if (video.duration) {
          video.currentTime = (seekSlider.value / 100) * video.duration;
        }
      });

      // Save / Download
      btnSave.addEventListener("click", () => {
        const curData = modal._curData;
        if (!curData || !curData.blob) return;
        const a = document.createElement("a");
        a.href = curData.url || URL.createObjectURL(curData.blob);
        a.download = curData.filename || `${I?.val?.title || "video"}.mp4`;
        a.click();
        saveText.textContent = "Tersimpan ✓";
        setTimeout(() => {
          saveText.textContent = "Simpan ke Galeri";
        }, 2000);
      });

      // Share via Web Share API
      btnShare.addEventListener("click", async () => {
        const curData = modal._curData;
        if (!curData || !curData.blob) return;
        const filename = curData.filename || `${I?.val?.title || "video"}.mp4`;
        const file = new File([curData.blob], filename, { type: "video/mp4" });
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          try {
            await navigator.share({
              title: I?.val?.title || "Alight Motion Video",
              files: [file]
            });
          } catch (e) {}
        } else {
          btnSave.click();
        }
      });

      // Close
      btnClose.addEventListener("click", () => {
        video.pause();
        modal.classList.remove("open");
      });
    }

    modal._curData = exportData;
    const titleEl = document.getElementById("am-prev-title");
    if (titleEl) {
      titleEl.textContent = exportData.filename || `${I?.val?.title || "Proyek"} - Hasil Ekspor`;
    }
    const video = document.getElementById("am-prev-video");
    if (video && exportData.url) {
      video.src = exportData.url;
      video.currentTime = 0;
      video.play().catch(() => {});
    }
    modal.classList.add("open");
  }

  if (window.__AM_INTERNAL) {
    window.__AM_INTERNAL.openExportSheet = openExportSheet;
  }

  // ── Authentic Text Editor (fragment_text_edit.xml & edit_text_actionbar.xml) ──
  const AM_FONTS = [
    { name: "Roboto", family: "Roboto", popular: true },
    { name: "Space Grotesk", family: "Space Grotesk", popular: true },
    { name: "Montserrat", family: "Montserrat", popular: true },
    { name: "Poppins", family: "Poppins", popular: true },
    { name: "Oswald", family: "Oswald", popular: true },
    { name: "Bebas Neue", family: "Bebas Neue", popular: true },
    { name: "Inter", family: "Inter", popular: true },
    { name: "Playfair Display", family: "Playfair Display", popular: true },
    { name: "Anton", family: "Anton", popular: true },
    { name: "Pacifico", family: "Pacifico", popular: true },
    { name: "Caveat", family: "Caveat", popular: true },
    { name: "Dancing Script", family: "Dancing Script", popular: true },
    { name: "Roboto Mono", family: "Roboto Mono", popular: false },
    { name: "Lobster", family: "Lobster", popular: false },
    { name: "Cinzel", family: "Cinzel", popular: false },
    { name: "Permanent Marker", family: "Permanent Marker", popular: false },
    { name: "Raleway", family: "Raleway", popular: false },
    { name: "Merriweather", family: "Merriweather", popular: false }
  ];

  let activeTextEditorLayer = null;
  let textEditSnapBefore = null;
  let currentActiveTextPopup = null;

  function ensureGoogleFont(fontName) {
    if (!fontName || fontName === "Roboto" || fontName === "sans-serif") return;
    if (document.querySelector(`link[data-font="${fontName}"]`)) return;
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.dataset.font = fontName;
    link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(fontName).replace(/%20/g, "+")}:wght@300;400;500;600;700;800;900&display=swap`;
    document.head.appendChild(link);
    if (document.fonts && document.fonts.load) {
      document.fonts.load(`16px "${fontName}"`).then(() => {
        if (I && I.val2) I.val2.renderAt(I.H);
      }).catch(() => {});
    }
  }

  function openTextPopup(type, triggerBtn) {
    if (currentActiveTextPopup === type) {
      closeTextPopups();
      return;
    }
    closeTextPopups();
    const popupMap = {
      font: document.getElementById("am-text-font-popup"),
      size: document.getElementById("am-text-size-popup"),
      spacing: document.getElementById("am-text-spacing-popup"),
      color: document.getElementById("am-text-color-popup")
    };
    const targetPopup = popupMap[type];
    const backdrop = document.getElementById("am-text-popup-backdrop");
    if (!targetPopup) return;

    if (triggerBtn) {
      const rect = triggerBtn.getBoundingClientRect();
      const connector = targetPopup.querySelector(".am-text-popup-connector");
      if (connector) {
        const offset = Math.max(12, Math.min(window.innerWidth - 30, rect.left + rect.width / 2 - 8));
        connector.style.left = offset + "px";
      }
    }

    if (backdrop) backdrop.style.display = "block";
    targetPopup.classList.add("open");
    currentActiveTextPopup = type;
  }

  function closeTextPopups() {
    const popups = document.querySelectorAll(".am-text-popup");
    popups.forEach(p => p.classList.remove("open"));
    const backdrop = document.getElementById("am-text-popup-backdrop");
    if (backdrop) backdrop.style.display = "none";
    currentActiveTextPopup = null;
  }

  function populateMiniFontList() {
    const container = document.getElementById("am-text-minifont-list");
    if (!container) return;
    container.innerHTML = "";
    const activeFont = (activeTextEditorLayer && activeTextEditorLayer.font) || "Roboto";

    AM_FONTS.slice(0, 12).forEach(f => {
      ensureGoogleFont(f.family);
      const item = document.createElement("div");
      item.className = "am-mini-font-item" + (f.name === activeFont ? " active" : "");
      item.innerHTML = `
        <div class="am-mini-font-preview" style="font-family:'${f.family}', sans-serif;">Ag</div>
        <div class="am-mini-font-name">${f.name}</div>
      `;
      item.addEventListener("click", () => {
        applyFont(f.name);
        closeTextPopups();
      });
      container.appendChild(item);
    });
  }

  function populateFontBrowserGrid(filterText = "") {
    const grid = document.getElementById("am-fb-grid");
    if (!grid) return;
    grid.innerHTML = "";
    const activeFont = (activeTextEditorLayer && activeTextEditorLayer.font) || "Roboto";
    const q = filterText.toLowerCase().trim();

    const filtered = AM_FONTS.filter(f => !q || f.name.toLowerCase().includes(q));

    filtered.forEach(f => {
      ensureGoogleFont(f.family);
      const card = document.createElement("div");
      card.className = "am-fb-card" + (f.name === activeFont ? " active" : "");
      card.innerHTML = `
        <div class="am-fb-card-preview" style="font-family:'${f.family}', sans-serif;">Open Motion</div>
        <div class="am-fb-card-name">${f.name}</div>
      `;
      card.addEventListener("click", () => {
        applyFont(f.name);
        const modal = document.getElementById("am-font-browser-modal");
        if (modal) modal.classList.remove("open");
      });
      grid.appendChild(card);
    });
  }

  function applyFont(fontName) {
    if (!activeTextEditorLayer) return;
    activeTextEditorLayer.font = fontName;
    ensureGoogleFont(fontName);
    const fontLabel = document.getElementById("am-text-font-label");
    if (fontLabel) fontLabel.textContent = fontName;
    populateMiniFontList();
    I.V = true;
    if (I.val2) I.val2.renderAt(I.H);
  }

  function applyFontSize(sz) {
    if (!activeTextEditorLayer) return;
    const safeSize = Math.max(6, Math.min(300, sz));
    activeTextEditorLayer.fontSize = safeSize;
    const label = document.getElementById("am-text-size-label");
    const stepperVal = document.getElementById("am-text-size-stepper-val");
    const slider = document.getElementById("am-text-size-slider");
    if (label) label.textContent = safeSize + " pt";
    if (stepperVal) stepperVal.textContent = safeSize + " pt";
    if (slider) slider.value = safeSize;
    I.V = true;
    if (I.val2) I.val2.renderAt(I.H);
  }

  function applyTextAlign(align) {
    if (!activeTextEditorLayer) return;
    activeTextEditorLayer.align = align;
    const img = document.getElementById("am-img-text-align");
    const iconMap = {
      left: "./icons/ac_ic_textalign_left.svg",
      center: "./icons/ac_ic_textalign_center.svg",
      right: "./icons/ac_ic_textalign_right.svg",
      justify: "./icons/ac_ic_textalign_justify.svg"
    };
    if (img) img.src = iconMap[align] || iconMap.center;
    I.V = true;
    if (I.val2) I.val2.renderAt(I.H);
  }

  function applyLetterSpacing(val) {
    if (!activeTextEditorLayer) return;
    activeTextEditorLayer.letterSpacing = val;
    const display = document.getElementById("am-letter-spacing-val");
    if (display) display.textContent = (val > 0 ? "+" : "") + val.toFixed(2) + " em";
    const slider = document.getElementById("am-letter-spacing-slider");
    if (slider) slider.value = val;
    I.V = true;
    if (I.val2) I.val2.renderAt(I.H);
  }

  function applyLineSpacing(val) {
    if (!activeTextEditorLayer) return;
    activeTextEditorLayer.lineSpacing = val;
    const display = document.getElementById("am-line-spacing-val");
    if (display) display.textContent = val.toFixed(2) + "×";
    const slider = document.getElementById("am-line-spacing-slider");
    if (slider) slider.value = val;
    I.V = true;
    if (I.val2) I.val2.renderAt(I.H);
  }

  function parseHexToRgbaArr(hexStr) {
    let hex = String(hexStr || "#ffffffff").trim().replace(/^#/, "");
    if (hex.length === 3) hex = hex.split("").map(c => c + c).join("") + "ff";
    else if (hex.length === 6) hex += "ff";
    else if (hex.length === 8) {}
    else hex = "ffffffff";
    const r = (parseInt(hex.slice(0, 2), 16) || 0) / 255;
    const g = (parseInt(hex.slice(2, 4), 16) || 0) / 255;
    const b = (parseInt(hex.slice(4, 6), 16) || 0) / 255;
    const a = (parseInt(hex.slice(6, 8), 16) || 255) / 255;
    return [r, g, b, a];
  }

  function applyTextColor(hex) {
    if (!activeTextEditorLayer) return;
    activeTextEditorLayer.color = hex;
    activeTextEditorLayer.fillColor = parseHexToRgbaArr(hex);

    const swatchCircle = document.getElementById("am-text-color-swatch");
    if (swatchCircle) swatchCircle.style.background = hex;

    const hexIn = document.getElementById("am-text-hex-input");
    if (hexIn) hexIn.value = hex.toUpperCase();

    const nativePicker = document.getElementById("am-text-native-picker");
    if (nativePicker) nativePicker.value = hex.slice(0, 7);

    const swatches = document.querySelectorAll(".am-text-swatch");
    swatches.forEach(s => {
      s.classList.toggle("active", s.dataset.color.toLowerCase() === hex.toLowerCase());
    });

    I.V = true;
    if (I.val2) I.val2.renderAt(I.H);
  }

  function populateColorSwatches() {
    const grid = document.getElementById("am-text-swatches-grid");
    if (!grid) return;
    grid.innerHTML = "";
    const colorSwatches = [
      "#ffffff", "#000000", "#808080", "#c0c0c0",
      "#ff3b30", "#ff9500", "#ffcc00", "#34c759",
      "#00ffa8", "#00c7be", "#30b0c7", "#007aff",
      "#5856d6", "#af52de", "#ff2d55", "#a2845e"
    ];
    const curColor = (activeTextEditorLayer && (activeTextEditorLayer.color || "#ffffff")).toLowerCase();

    colorSwatches.forEach(c => {
      const s = document.createElement("div");
      s.className = "am-text-swatch" + (c.toLowerCase() === curColor ? " active" : "");
      s.dataset.color = c;
      s.style.background = c;
      s.addEventListener("click", () => applyTextColor(c));
      grid.appendChild(s);
    });
  }

  function openTextEditor(layer) {
    if (!layer || layer.tag !== "text") return;
    activeTextEditorLayer = layer;
    textEditSnapBefore = I.sceneSnapshot ? I.sceneSnapshot() : null;

    const navDefault = document.getElementById("am-navbar-default");
    const navElem = document.getElementById("am-navbar-element");
    const navLiveShape = document.getElementById("am-navbar-liveshape");
    const navEditPoints = document.getElementById("am-navbar-editpoints");
    const navDrawing = document.getElementById("am-navbar-drawing");
    const navTextEdit = document.getElementById("am-navbar-textedit");
    const elemPanel = document.getElementById("am-element-edit-panel");
    const tlView = document.getElementById("am-timeline-view");
    const textEditBar = document.getElementById("am-text-edit-bar");
    const inputBox = document.getElementById("am-text-input-box");

    if (navDefault) navDefault.style.display = "none";
    if (navElem) navElem.style.display = "none";
    if (navLiveShape) navLiveShape.style.display = "none";
    if (navEditPoints) navEditPoints.style.display = "none";
    if (navDrawing) navDrawing.style.display = "none";
    if (navTextEdit) navTextEdit.style.display = "flex";

    if (elemPanel) elemPanel.style.display = "none";
    if (tlView) tlView.style.display = "none";
    if (textEditBar) textEditBar.style.display = "block";

    if (inputBox) {
      inputBox.value = layer.textContent || "";
      setTimeout(() => {
        inputBox.focus();
        inputBox.setSelectionRange(inputBox.value.length, inputBox.value.length);
      }, 50);
    }

    applyTextAlign(layer.align || "center");
    const fontName = layer.font || "Roboto";
    ensureGoogleFont(fontName);
    const fontLabel = document.getElementById("am-text-font-label");
    if (fontLabel) fontLabel.textContent = fontName;

    const sz = layer.fontSize || 28;
    applyFontSize(sz);

    const letSp = layer.letterSpacing !== undefined ? layer.letterSpacing : 0;
    applyLetterSpacing(letSp);

    const lineSp = layer.lineSpacing !== undefined ? layer.lineSpacing : 1;
    applyLineSpacing(lineSp);

    let hexColor = "#ffffff";
    if (layer.color) hexColor = layer.color;
    else if (Array.isArray(layer.fillColor)) {
      const r = Math.round((layer.fillColor[0] || 0) * 255).toString(16).padStart(2, "0");
      const g = Math.round((layer.fillColor[1] || 0) * 255).toString(16).padStart(2, "0");
      const b = Math.round((layer.fillColor[2] || 0) * 255).toString(16).padStart(2, "0");
      hexColor = `#${r}${g}${b}`;
    }
    applyTextColor(hexColor);

    populateMiniFontList();
    populateColorSwatches();
    closeTextPopups();
  }

  function closeTextEditor(commit = true) {
    if (!activeTextEditorLayer) return;
    if (commit && textEditSnapBefore && I.pushUndo) {
      I.pushUndo(textEditSnapBefore);
      if (I.handle9) I.handle9(`[EDIT] Selesai edit teks: ${activeTextEditorLayer.label || "Teks"}`);
    }

    closeTextPopups();
    const modal = document.getElementById("am-font-browser-modal");
    if (modal) modal.classList.remove("open");

    const navTextEdit = document.getElementById("am-navbar-textedit");
    const navElem = document.getElementById("am-navbar-element");
    const navDefault = document.getElementById("am-navbar-default");
    const elemPanel = document.getElementById("am-element-edit-panel");
    const tlView = document.getElementById("am-timeline-view");
    const textEditBar = document.getElementById("am-text-edit-bar");

    if (navTextEdit) navTextEdit.style.display = "none";
    if (textEditBar) textEditBar.style.display = "none";

    if (currentSelectedLayer) {
      if (navElem) navElem.style.display = "flex";
      if (elemPanel) elemPanel.style.display = "flex";
    } else {
      if (navDefault) navDefault.style.display = "flex";
      if (tlView) tlView.style.display = "flex";
    }

    activeTextEditorLayer = null;
    textEditSnapBefore = null;
  }

  function initTextEditorEvents() {
    const btnAlign = document.getElementById("am-btn-text-align");
    const btnFont = document.getElementById("am-btn-text-font");
    const btnSize = document.getElementById("am-btn-text-size");
    const btnSpacing = document.getElementById("am-btn-text-spacing");
    const btnColor = document.getElementById("am-btn-text-color");
    const btnOk = document.getElementById("am-btn-text-ok");
    const backdrop = document.getElementById("am-text-popup-backdrop");
    const inputBox = document.getElementById("am-text-input-box");

    if (btnAlign) {
      btnAlign.addEventListener("click", () => {
        if (!activeTextEditorLayer) return;
        const cycle = ["left", "center", "right", "justify"];
        const curIdx = cycle.indexOf(activeTextEditorLayer.align || "center");
        const next = cycle[(curIdx + 1) % cycle.length];
        applyTextAlign(next);
      });
    }

    if (btnFont) btnFont.addEventListener("click", () => openTextPopup("font", btnFont));
    if (btnSize) btnSize.addEventListener("click", () => openTextPopup("size", btnSize));
    if (btnSpacing) btnSpacing.addEventListener("click", () => openTextPopup("spacing", btnSpacing));
    if (btnColor) btnColor.addEventListener("click", () => openTextPopup("color", btnColor));
    if (backdrop) backdrop.addEventListener("click", closeTextPopups);
    if (btnOk) btnOk.addEventListener("click", () => closeTextEditor(true));

    if (inputBox) {
      inputBox.addEventListener("input", function() {
        if (!activeTextEditorLayer) return;
        activeTextEditorLayer.textContent = this.value;
        I.V = true;
        if (I.val2) I.val2.renderAt(I.H);
      });
    }

    const btnSizeMinus = document.getElementById("am-btn-size-minus");
    const btnSizePlus = document.getElementById("am-btn-size-plus");
    const sliderSize = document.getElementById("am-text-size-slider");

    if (btnSizeMinus) {
      btnSizeMinus.addEventListener("click", () => {
        if (!activeTextEditorLayer) return;
        applyFontSize((activeTextEditorLayer.fontSize || 28) - 2);
      });
    }
    if (btnSizePlus) {
      btnSizePlus.addEventListener("click", () => {
        if (!activeTextEditorLayer) return;
        applyFontSize((activeTextEditorLayer.fontSize || 28) + 2);
      });
    }
    if (sliderSize) {
      sliderSize.addEventListener("input", function() {
        applyFontSize(parseInt(this.value, 10));
      });
    }

    const sliderLetter = document.getElementById("am-letter-spacing-slider");
    const sliderLine = document.getElementById("am-line-spacing-slider");
    const btnResetSpacing = document.getElementById("am-btn-spacing-reset");

    if (sliderLetter) {
      sliderLetter.addEventListener("input", function() {
        applyLetterSpacing(parseFloat(this.value));
      });
    }
    if (sliderLine) {
      sliderLine.addEventListener("input", function() {
        applyLineSpacing(parseFloat(this.value));
      });
    }
    if (btnResetSpacing) {
      btnResetSpacing.addEventListener("click", () => {
        applyLetterSpacing(0);
        applyLineSpacing(1);
      });
    }

    const btnEyedropper = document.getElementById("am-btn-text-eyedropper");
    const nativePicker = document.getElementById("am-text-native-picker");
    const hexInput = document.getElementById("am-text-hex-input");

    if (btnEyedropper) {
      btnEyedropper.addEventListener("click", async () => {
        if (window.EyeDropper) {
          try {
            const res = await new window.EyeDropper().open();
            if (res && res.sRGBHex) applyTextColor(res.sRGBHex);
          } catch (e) {}
        } else if (nativePicker) {
          nativePicker.click();
        }
      });
    }

    if (nativePicker) {
      nativePicker.addEventListener("input", function() {
        applyTextColor(this.value);
      });
    }

    if (hexInput) {
      hexInput.addEventListener("input", function() {
        let v = this.value.trim();
        if (!v.startsWith("#")) v = "#" + v;
        if (/^#[0-9a-fA-F]{6}$/.test(v) || /^#[0-9a-fA-F]{8}$/.test(v)) {
          applyTextColor(v);
        }
      });
    }

    const btnViewAllFonts = document.getElementById("am-btn-view-all-fonts");
    const modalFontBrowser = document.getElementById("am-font-browser-modal");
    const btnFbBack = document.getElementById("am-btn-fb-back");
    const fbSearch = document.getElementById("am-fb-search-input");
    const btnFbImport = document.getElementById("am-btn-fb-import");
    const fbFileInput = document.getElementById("am-fb-file-input");

    if (btnViewAllFonts) {
      btnViewAllFonts.addEventListener("click", () => {
        closeTextPopups();
        if (modalFontBrowser) {
          modalFontBrowser.classList.add("open");
          populateFontBrowserGrid();
        }
      });
    }

    if (btnFbBack && modalFontBrowser) {
      btnFbBack.addEventListener("click", () => {
        modalFontBrowser.classList.remove("open");
      });
    }

    if (fbSearch) {
      fbSearch.addEventListener("input", function() {
        populateFontBrowserGrid(this.value);
      });
    }

    if (btnFbImport && fbFileInput) {
      btnFbImport.addEventListener("click", () => fbFileInput.click());
      fbFileInput.addEventListener("change", async (e) => {
        const file = e.target.files && e.target.files[0];
        if (!file) return;
        const fontName = file.name.replace(/\.[^/.]+$/, "");
        const reader = new FileReader();
        reader.onload = async (ev) => {
          try {
            const font = new FontFace(fontName, ev.target.result);
            await font.load();
            document.fonts.add(font);
            if (I.val2) {
              if (!I.val2.customFonts) I.val2.customFonts = new Map();
              I.val2.customFonts.set(fontName, fontName);
            }
            AM_FONTS.unshift({ name: fontName, family: fontName, popular: true });
            applyFont(fontName);
            if (modalFontBrowser) modalFontBrowser.classList.remove("open");
          } catch (err) {
            alert("Gagal memuat file font: " + err.message);
          }
        };
        reader.readAsArrayBuffer(file);
      });
    }
  }

  function escapeHtml(s) {
    return String(s || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function generateOmId(len = 22) {
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let out = "";
    if (window.crypto && crypto.getRandomValues) {
      const bytes = new Uint8Array(len);
      crypto.getRandomValues(bytes);
      for (let i = 0; i < len; i++) out += alphabet[bytes[i] % alphabet.length];
    } else {
      for (let i = 0; i < len; i++) out += alphabet[Math.floor(Math.random() * alphabet.length)];
    }
    return out;
  }

  function getAspectClass(w, h) {
    if (!w || !h) return "9-16";
    const r = w / h;
    if (Math.abs(r - 16 / 9) < 0.15) return "16-9";
    if (Math.abs(r - 9 / 16) < 0.15) return "9-16";
    if (Math.abs(r - 4 / 5) < 0.15) return "4-5";
    if (Math.abs(r - 1) < 0.15) return "1-1";
    if (Math.abs(r - 4 / 3) < 0.15) return "4-3";
    return r > 1 ? "16-9" : "9-16";
  }

  function calcDimensions(aspect, res) {
    const r = parseInt(res, 10) || 720;
    switch (aspect) {
      case "16:9":
        return { w: Math.round(r * 16 / 9 / 2) * 2, h: r };
      case "9:16":
        return { w: r, h: Math.round(r * 16 / 9 / 2) * 2 };
      case "4:5":
        return { w: r, h: Math.round(r * 5 / 4 / 2) * 2 };
      case "1:1":
        return { w: r, h: r };
      case "4:3":
        return { w: Math.round(r * 4 / 3 / 2) * 2, h: r };
      default:
        return { w: 720, h: 1280 };
    }
  }

  function setupHomeScreen() {
    let home = document.getElementById("am-home-screen");
    if (!home) {
      home = document.createElement("div");
      home.id = "am-home-screen";
      home.innerHTML = `
        <header class="am-home-header">
          <div class="am-home-topbar">
            <button id="am-home-btn-menu" class="am-home-btn" title="Menu">
              <img src="/icons/ac_ic_hamburger_menu.svg" alt="Menu">
            </button>
            <div class="am-home-logo-wrap">
              <img src="/icons/ac_openmotion_logo_white.svg" alt="Open Motion" class="am-home-logo-svg">
            </div>
            <button id="am-home-btn-profile" class="am-home-btn" title="Profil">
              <img src="/icons/ic_account_nologin_profile.svg" alt="Profil">
            </button>
          </div>
          <nav class="am-home-tabs" id="am-home-tabs">
            <button class="am-home-tab" data-tab="tutorial">
              <img src="/icons/ic_tutorial_button.svg" alt="Tutorial">
              <span>Tutorial</span>
            </button>
            <button class="am-home-tab active" data-tab="projects">
              <img src="/icons/ac_projectlist_projects.svg" alt="Proyek">
              <span>Proyek</span>
            </button>
            <button class="am-home-tab" data-tab="elements">
              <img src="/icons/ac_projectlist_elements.svg" alt="Elemen">
              <span>Elemen</span>
            </button>
            <div class="am-home-tab-indicator" id="am-home-tab-indicator"></div>
          </nav>
        </header>

        <div class="am-home-import-bar" id="am-home-import-bar">
          <div class="am-import-input-wrap">
            <input type="url" id="am-home-alight-link" class="am-import-input" placeholder="Tempel link https://alight.link/... atau Drive" autocapitalize="off" spellcheck="false">
            <button id="am-home-btn-import-link" class="am-import-btn">Buka</button>
          </div>
          <div id="am-home-import-status" class="am-import-status" style="display:none;"></div>
        </div>

        <main class="am-home-content" id="am-home-content">
          <div id="am-home-project-list" class="am-project-grid"></div>
        </main>

        <button id="am-home-fab" class="am-home-fab" title="Buat Proyek Baru">
          <img src="/icons/ac_ic_add_element.svg" alt="Buat Proyek">
        </button>
      `;
      document.body.appendChild(home);

      async function handleImportLink(link) {
        const statusEl = document.getElementById("am-home-import-status");
        if (!link) {
          if (statusEl) {
            statusEl.textContent = "Isi link Alight Motion atau Drive dulu.";
            statusEl.className = "am-import-status error";
            statusEl.style.display = "block";
          }
          return;
        }

        if (statusEl) {
          statusEl.textContent = "Mengambil XML & media...";
          statusEl.className = "am-import-status info";
          statusEl.style.display = "block";
        }

        try {
          if (window.AM && window.AM.loadPreset) {
            const newId = (I.omNewId ? I.omNewId() : generateOmId());
            I.omProjectId = newId;
            if (history.pushState) {
              history.pushState({ projectId: newId }, "", "/proyek/" + newId);
            }
            await window.AM.loadPreset(link);
            const home = document.getElementById("am-home-screen");
            const root = document.getElementById("am-mobile-root");
            if (home) home.classList.add("hidden");
            if (root) root.style.display = "flex";
            if (statusEl) statusEl.style.display = "none";
            const topTitle = document.getElementById("am-project-title");
            if (topTitle && I.val) topTitle.value = I.val.title || "Preset Impor";
            if (I.fitCanvas) I.fitCanvas();
            if (I.omScheduleSave) I.omScheduleSave();
          }
        } catch (err) {
          if (statusEl) {
            statusEl.textContent = "Gagal memuat: " + err.message;
            statusEl.className = "am-import-status error";
            statusEl.style.display = "block";
          }
        }
      }

      const impBtn = home.querySelector("#am-home-btn-import-link");
      const impInput = home.querySelector("#am-home-alight-link");
      if (impBtn && impInput) {
        impBtn.addEventListener("click", () => handleImportLink(impInput.value.trim()));
        impInput.addEventListener("keydown", (e) => {
          if (e.key === "Enter") handleImportLink(impInput.value.trim());
        });
      }

      const tabs = home.querySelectorAll(".am-home-tab");
      tabs.forEach(t => {
        t.addEventListener("click", () => {
          tabs.forEach(x => x.classList.remove("active"));
          t.classList.add("active");
          updateTabIndicator(t);
          const importBar = document.getElementById("am-home-import-bar");
          const container = document.getElementById("am-home-project-list");

          if (t.dataset.tab === "projects") {
            if (importBar) importBar.style.display = "flex";
            if (container) container.className = "am-project-grid";
            loadHomeProjects();
          } else if (t.dataset.tab === "tutorial") {
            if (importBar) importBar.style.display = "none";
            if (container) {
              container.className = "am-tutorial-grid";
              container.innerHTML = `
                <div class="am-tutorial-card">
                  <div class="am-tutorial-icon"><img src="/icons/ic_keyframe_add_big.svg" alt="Keyframe"></div>
                  <div class="am-tutorial-info">
                    <div class="am-tutorial-title">Dasar Animasi & Keyframe</div>
                    <div class="am-tutorial-desc">Pelajari cara menambahkan keyframe untuk menganimasikan posisi, ukuran, rotasi, dan opasitas layer.</div>
                  </div>
                </div>
                <div class="am-tutorial-card">
                  <div class="am-tutorial-icon"><img src="/icons/ic_curve_ease_in_out.svg" alt="Easing"></div>
                  <div class="am-tutorial-info">
                    <div class="am-tutorial-title">Kurva Kecepatan (Easing)</div>
                    <div class="am-tutorial-desc">Kuasai editor kurva Bezier, akselerasi ease in/out, dan kurva pantulan untuk gerakan natural.</div>
                  </div>
                </div>
                <div class="am-tutorial-card">
                  <div class="am-tutorial-icon"><img src="/icons/ac_ic_effects.svg" alt="Effects"></div>
                  <div class="am-tutorial-info">
                    <div class="am-tutorial-title">Efek Visual & Shaders</div>
                    <div class="am-tutorial-desc">Terapkan efek distorsi, motion blur, color grade, dan efek pencahayaan pada layer apa pun.</div>
                  </div>
                </div>
                <div class="am-tutorial-card">
                  <div class="am-tutorial-icon"><img src="/icons/ic_masking_group_bl.svg" alt="Masking"></div>
                  <div class="am-tutorial-info">
                    <div class="am-tutorial-title">Grup & Masking</div>
                    <div class="am-tutorial-desc">Kelompokkan beberapa layer untuk pengeditan terpadu atau gunakan bentuk sebagai masking interaktif.</div>
                  </div>
                </div>
                <div class="am-tutorial-card">
                  <div class="am-tutorial-icon"><img src="/icons/ic_export_xml.svg" alt="XML"></div>
                  <div class="am-tutorial-info">
                    <div class="am-tutorial-title">Impor & Ekspor Format Alight</div>
                    <div class="am-tutorial-desc">Bagikan karya melalui XML preset (.xml, .xml2) dan tautan preset Alight Motion online.</div>
                  </div>
                </div>
              `;
            }
          } else {
            if (importBar) importBar.style.display = "none";
            if (container) {
              container.className = "am-project-grid";
              container.innerHTML = `
                <div class="am-home-empty" style="grid-column: 1 / -1;">
                  <img src="/icons/ac_projectlist_elements.svg" alt="Elemen">
                  <p style="font-weight:700;color:#fff;margin-bottom:4px;">Paket Elemen Tersimpan</p>
                  <p>Simpan animasi, teks bergaya, atau grup layer favoritmu sebagai Elemen untuk digunakan langsung di proyek mana pun.</p>
                </div>
              `;
            }
          }
        });
      });

      const fab = home.querySelector("#am-home-fab");
      if (fab) fab.addEventListener("click", openNewProjectModal);
    }
  }

  function updateTabIndicator(btn) {
    const ind = document.getElementById("am-home-tab-indicator");
    if (!ind || !btn) return;
    ind.style.left = btn.offsetLeft + "px";
    ind.style.width = btn.offsetWidth + "px";
  }

  async function loadHomeProjects() {
    const container = document.getElementById("am-home-project-list");
    if (!container) return;
    container.className = "am-project-grid";
    container.innerHTML = '<div style="grid-column: 1 / -1; padding:30px; text-align:center; color:#8c93a7;">Memuat proyek...</div>';
    try {
      const res = await fetch("/api/projects");
      if (!res.ok) throw new Error("HTTP " + res.status);
      const data = await res.json();
      const list = data.projects || [];
      if (!list.length) {
        container.innerHTML = `
          <div class="am-home-empty" style="grid-column: 1 / -1;">
            <img src="/icons/ac_projectlist_projects.svg" alt="Empty">
            <p>Belum ada proyek.<br>Ketuk tombol <strong>+</strong> di bawah untuk membuat proyek baru.</p>
          </div>
        `;
        return;
      }
      container.innerHTML = "";
      list.forEach(p => {
        const item = document.createElement("div");
        item.className = "am-project-card";
        const title = p.name || p.id || "Proyek Tanpa Judul";
        const dateStr = p.updatedAt ? new Date(p.updatedAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }) : "Baru saja";
        const w = p.width || 720;
        const h = p.height || 1280;
        const aspectClass = getAspectClass(w, h);
        const resLabel = h >= 1080 ? "1080p FHD" : (h >= 720 ? "720p HD" : `${h}p`);

        item.innerHTML = `
          <div class="am-project-thumb">
            <div class="am-project-canvas-preview ratio-${aspectClass}">
              ${p.thumb ? `<img src="${p.thumb}" alt="Thumb" loading="lazy">` : `
                <div class="am-project-thumb-placeholder">
                  <img src="/icons/ac_projectlist_projects.svg" alt="Project">
                </div>
              `}
            </div>
            <span class="am-project-thumb-tag">${resLabel}</span>
          </div>
          <div class="am-project-meta">
            <div class="am-project-name" title="${escapeHtml(title)}">${escapeHtml(title)}</div>
            <div class="am-project-details-row">
              <div class="am-project-details">${p.hasPassword ? "🔒 " : ""}${w}×${h} • ${dateStr}</div>
              <button class="am-project-del" title="Hapus Proyek" data-id="${p.id}">
                <img src="/icons/ac_ic_delete.svg" alt="Hapus">
              </button>
            </div>
          </div>
        `;

        item.addEventListener("click", (e) => {
          if (e.target.closest(".am-project-del")) return;
          openProjectById(p.id);
        });

        const delBtn = item.querySelector(".am-project-del");
        if (delBtn) {
          delBtn.addEventListener("click", async (e) => {
            e.stopPropagation();
            try {
              await fetch("/api/project/" + p.id, { method: "DELETE" });
              loadHomeProjects();
            } catch (err) {}
          });
        }

        container.appendChild(item);
      });
    } catch (e) {
      container.innerHTML = '<div style="grid-column: 1 / -1; padding:30px; text-align:center; color:#ff8a8a;">Gagal memuat proyek: ' + e.message + '</div>';
    }
  }

  async function openProjectById(id) {
    const home = document.getElementById("am-home-screen");
    const root = document.getElementById("am-mobile-root");
    if (home) home.classList.add("hidden");
    if (root) root.style.display = "flex";
    if (history.pushState && location.pathname !== "/proyek/" + id) {
      history.pushState({ projectId: id }, "", "/proyek/" + id);
    }
    const fn = (window.__AM_INTERNAL && window.__AM_INTERNAL.omOpenProject) || I.omOpenProject;
    if (fn) {
      await fn(id);
    } else {
      setTimeout(() => {
        const retryFn = (window.__AM_INTERNAL && window.__AM_INTERNAL.omOpenProject) || I.omOpenProject;
        if (retryFn) retryFn(id);
      }, 100);
    }
    if (I.fitCanvas) I.fitCanvas();
  }

  function openNewProjectModal() {
    let backdrop = document.getElementById("am-new-project-backdrop");
    if (!backdrop) {
      backdrop = document.createElement("div");
      backdrop.id = "am-new-project-backdrop";
      backdrop.innerHTML = `
        <div id="am-new-project-card">
          <div style="display:flex;align-items:center;justify-content:space-between;">
            <span style="font-size:16px;font-weight:700;color:#fff;">Buat Proyek</span>
            <button id="am-new-proj-close" class="am-sheet-close">
              <img src="/icons/ac_ic_cancel.svg" alt="Close">
            </button>
          </div>

          <input type="text" id="am-new-proj-title" class="am-new-proj-title-input" value="Proyek Baru" placeholder="Nama Proyek">

          <div class="am-aspect-holder">
            <div class="am-aspect-card am-aspect-16-9" data-aspect="16:9">
              <div class="am-aspect-box"></div>
              <span>16:9</span>
            </div>
            <div class="am-aspect-card am-aspect-9-16 active" data-aspect="9:16">
              <div class="am-aspect-box"></div>
              <span>9:16</span>
            </div>
            <div class="am-aspect-card am-aspect-4-5" data-aspect="4:5">
              <div class="am-aspect-box"></div>
              <span>4:5</span>
            </div>
            <div class="am-aspect-card am-aspect-1-1" data-aspect="1:1">
              <div class="am-aspect-box"></div>
              <span>1:1</span>
            </div>
            <div class="am-aspect-card am-aspect-4-3" data-aspect="4:3">
              <div class="am-aspect-box"></div>
              <span>4:3</span>
            </div>
          </div>

          <div class="am-settings-form" style="gap:10px;">
            <div class="am-setting-row">
              <span class="am-setting-label">Resolusi</span>
              <select id="am-new-proj-res" class="am-setting-control">
                <option value="1080">1080p FHD</option>
                <option value="720" selected>720p HD</option>
                <option value="480">480p SD</option>
              </select>
            </div>

            <div class="am-setting-row">
              <span class="am-setting-label">Frame Rate</span>
              <select id="am-new-proj-fps" class="am-setting-control">
                <option value="30" selected>30 fps</option>
                <option value="60">60 fps</option>
              </select>
            </div>

            <div class="am-setting-row">
              <span class="am-setting-label">Latar Belakang</span>
              <div class="am-color-swatches" id="am-new-proj-bg-holder">
                <div class="am-color-swatch active" data-color="#000000" style="background:#000;" title="Hitam"></div>
                <div class="am-color-swatch" data-color="#ffffff" style="background:#fff;" title="Putih"></div>
                <div class="am-color-swatch" data-color="#808080" style="background:#808080;" title="Abu-abu"></div>
                <div class="am-color-swatch" data-color="transparent" style="background:repeating-conic-gradient(#555 0% 25%, #222 0% 50%) 50% / 10px 10px;" title="Transparan"></div>
              </div>
            </div>
          </div>

          <button id="am-new-proj-btn-submit" class="am-new-proj-btn-create">BUAT PROYEK</button>

          <div style="border-top:1px solid rgba(255,255,255,0.08);padding-top:10px;display:flex;flex-direction:column;gap:8px;">
            <span style="font-size:11px;font-weight:700;color:#8c93a7;text-transform:uppercase;">Atau Impor Preset / Link</span>
            <div style="display:flex;gap:6px;">
              <input type="url" id="am-modal-alight-link" class="am-import-input" style="background:#0f1118;border:1px solid rgba(255,255,255,0.1);border-radius:8px;padding:0 10px;height:36px;flex:1;" placeholder="https://alight.link/...">
              <button id="am-modal-btn-import" class="am-import-btn" style="height:36px;">Buka</button>
            </div>
            <button id="am-modal-btn-file-xml" class="am-grid-btn" style="flex-direction:row;justify-content:center;height:36px;font-size:11px;padding:4px 8px;">
              <img src="/icons/ic_export_xml.svg" style="width:16px;height:16px;">
              <span>Pilih File XML (.xml / .xml2)</span>
            </button>
          </div>
        </div>
      `;
      document.body.appendChild(backdrop);

      backdrop.querySelectorAll(".am-aspect-card").forEach(c => {
        c.addEventListener("click", () => {
          backdrop.querySelectorAll(".am-aspect-card").forEach(x => x.classList.remove("active"));
          c.classList.add("active");
        });
      });

      backdrop.querySelectorAll(".am-color-swatch").forEach(s => {
        s.addEventListener("click", () => {
          backdrop.querySelectorAll(".am-color-swatch").forEach(x => x.classList.remove("active"));
          s.classList.add("active");
        });
      });

      document.getElementById("am-new-proj-close").addEventListener("click", () => {
        backdrop.classList.remove("open");
      });

      const modalImpBtn = document.getElementById("am-modal-btn-import");
      const modalImpInput = document.getElementById("am-modal-alight-link");
      if (modalImpBtn && modalImpInput) {
        modalImpBtn.addEventListener("click", async () => {
          const link = modalImpInput.value.trim();
          if (!link) return;
          backdrop.classList.remove("open");
          const home = document.getElementById("am-home-screen");
          const root = document.getElementById("am-mobile-root");
          if (home) home.classList.add("hidden");
          if (root) root.style.display = "flex";
          if (window.AM && window.AM.loadPreset) {
            const newId = (I.omNewId ? I.omNewId() : generateOmId());
            I.omProjectId = newId;
            if (history.pushState) {
              history.pushState({ projectId: newId }, "", "/proyek/" + newId);
            }
            await window.AM.loadPreset(link);
            const topTitle = document.getElementById("am-project-title");
            if (topTitle && I.val) topTitle.value = I.val.title || "Preset Impor";
            if (I.fitCanvas) I.fitCanvas();
            if (I.omScheduleSave) I.omScheduleSave();
          }
        });
      }

      const modalXmlBtn = document.getElementById("am-modal-btn-file-xml");
      if (modalXmlBtn) {
        modalXmlBtn.addEventListener("click", () => {
          const fi = document.createElement("input");
          fi.type = "file";
          fi.accept = ".xml,.xml2,text/xml,application/xml";
          fi.onchange = async (e) => {
            const f = e.target.files[0];
            if (!f) return;
            backdrop.classList.remove("open");
            const home = document.getElementById("am-home-screen");
            const root = document.getElementById("am-mobile-root");
            if (home) home.classList.add("hidden");
            if (root) root.style.display = "flex";
            if (window.AM && window.AM.loadPreset) {
              const newId = (I.omNewId ? I.omNewId() : generateOmId());
              I.omProjectId = newId;
              if (history.pushState) {
                history.pushState({ projectId: newId }, "", "/proyek/" + newId);
              }
              await window.AM.loadPreset(f);
              const topTitle = document.getElementById("am-project-title");
              if (topTitle && I.val) topTitle.value = I.val.title || f.name.replace(/\.[^/.]+$/, "");
              if (I.fitCanvas) I.fitCanvas();
              if (I.omScheduleSave) I.omScheduleSave();
            }
          };
          fi.click();
        });
      }

      document.getElementById("am-new-proj-btn-submit").addEventListener("click", async () => {
        const titleIn = document.getElementById("am-new-proj-title");
        const title = (titleIn && titleIn.value.trim()) || "Proyek Baru";
        const aspectCard = backdrop.querySelector(".am-aspect-card.active");
        const aspect = aspectCard ? aspectCard.dataset.aspect : "9:16";
        const resSelect = document.getElementById("am-new-proj-res");
        const resVal = resSelect ? resSelect.value : "720";
        const dims = calcDimensions(aspect, resVal);
        const w = dims.w;
        const h = dims.h;

        const fpsIn = document.getElementById("am-new-proj-fps");
        const fps = fpsIn ? parseInt(fpsIn.value, 10) : 30;
        const bgCard = backdrop.querySelector(".am-color-swatch.active");
        const bgHex = bgCard ? bgCard.dataset.color : "#000000";

        let bgcolorHex = "ff000000";
        if (bgHex === "transparent") bgcolorHex = "00000000";
        else if (bgHex === "#ffffff") bgcolorHex = "ffffffff";
        else if (bgHex === "#808080") bgcolorHex = "ff808080";

        backdrop.classList.remove("open");

        const xml = `<?xml version="1.0" encoding="utf-8"?>
<scene title="${escapeHtml(title)}" width="${w}" height="${h}" exportWidth="${w}" exportHeight="${h}" bgcolor="${bgcolorHex}" totalTime="5000" fps="${fps}" modifiedTime="${Date.now()}" amver="1028425" ffver="106" am="com.alightcreative.motion/5.0.273.1028425" amplatform="android" retime="freeze" retimeAdaptFPS="false"></scene>`;

        const newId = (I.omNewId ? I.omNewId() : generateOmId());
        I.omProjectId = newId;
        if (history.pushState) {
          history.pushState({ projectId: newId }, "", "/proyek/" + newId);
        }

        try {
          await fetch("/api/project/" + newId, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: newId, name: title, xml, width: w, height: h, fps, uploads: [] })
          });
        } catch (e) {}

        if (window.AM && window.AM.loadPreset) {
          await window.AM.loadPreset(new File([xml], title + ".xml", { type: "text/xml" }));
        }

        const home = document.getElementById("am-home-screen");
        const root = document.getElementById("am-mobile-root");
        if (home) home.classList.add("hidden");
        if (root) root.style.display = "flex";

        const projTitleEl = document.getElementById("am-project-title");
        if (projTitleEl) projTitleEl.value = title;
        if (I.fitCanvas) I.fitCanvas();
      });
    }

    backdrop.classList.add("open");
  }

  function checkInitialRoute() {
    const isProyek = /\/proyek\/([A-Za-z0-9_-]{8,64})/.test(location.pathname);
    const root = document.getElementById("am-mobile-root");
    const home = document.getElementById("am-home-screen");
    if (isProyek) {
      if (root) root.style.display = "flex";
      if (home) home.classList.add("hidden");
      const m = /\/proyek\/([A-Za-z0-9_-]{8,64})/.exec(location.pathname);
      if (m) {
        const id = m[1];
        if (I.omProjectId !== id) {
          const fn = (window.__AM_INTERNAL && window.__AM_INTERNAL.omOpenProject) || I.omOpenProject;
          if (fn) {
            fn(id);
          } else {
            setTimeout(() => {
              const retryFn = (window.__AM_INTERNAL && window.__AM_INTERNAL.omOpenProject) || I.omOpenProject;
              if (retryFn) retryFn(id);
            }, 100);
          }
        }
      }
    } else {
      if (root) root.style.display = "none";
      if (home) {
        home.classList.remove("hidden");
        loadHomeProjects();
        setTimeout(() => {
          const activeTab = home.querySelector(".am-home-tab.active");
          if (activeTab) updateTabIndicator(activeTab);
        }, 60);
      }
    }
  }

  // ── Authentic Animation Curve Editor (fragment_animation_curve.xml) ──
  const CURVE_CATEGORIES = {
    bezier: {
      name: "BEZIER",
      presets: [
        { name: "LINEAR", token: "linear", p1: [0, 0], p2: [1, 1], icon: "./icons/ic_easing_linear.svg" },
        { name: "MASUK MUDAH", token: "cubicBezier 0.42 0.0 1.0 1.0", p1: [0.42, 0], p2: [1, 1], icon: "./icons/ic_easing_bezier_easein.svg" },
        { name: "KELUAR MUDAH", token: "cubicBezier 0.0 0.0 0.58 1.0", p1: [0, 0], p2: [0.58, 1], icon: "./icons/ic_easing_bezier_easeout.svg" },
        { name: "MASUK-KELUAR MUDAH", token: "cubicBezier 0.42 0.0 0.58 1.0", p1: [0.42, 0], p2: [0.58, 1], icon: "./icons/ic_easing_bezier_easeinout.svg" }
      ]
    },
    bounce: {
      name: "BOUNCE",
      presets: [
        { name: "PANTULAN MASUK", token: "bounce 0.3 0.8", p1: [0.3, 0], p2: [0.8, 1], icon: "./icons/ic_easing_bouncein.svg" },
        { name: "PANTULAN KELUAR", token: "reverse bounce 0.3 0.8", p1: [0.2, 0], p2: [0.7, 1], icon: "./icons/ic_easing_bouncein.svg" },
        { name: "ELASTIS MASUK", token: "elastic 0.5 0.5 0.5 0", p1: [0.5, 0], p2: [0.5, 1], icon: "./icons/ic_easing_bouncein.svg" },
        { name: "ELASTIS KELUAR", token: "reverse elastic 0.5 0.5 0.5 0", p1: [0.5, 0], p2: [0.5, 1], icon: "./icons/ic_easing_bouncein.svg" }
      ]
    },
    steps: {
      name: "STEPS",
      presets: [
        { name: "TANGGA 2", token: "step 0.5 0", p1: [0, 0], p2: [1, 1], icon: "./icons/ic_easing_stairstep.svg" },
        { name: "TANGGA 4", token: "step 0.25 0", p1: [0, 0], p2: [1, 1], icon: "./icons/ic_easing_stairstep.svg" },
        { name: "TANGGA 8", token: "step 0.125 0", p1: [0, 0], p2: [1, 1], icon: "./icons/ic_easing_stairstep.svg" },
        { name: "TANGGA 16", token: "step 0.0625 0", p1: [0, 0], p2: [1, 1], icon: "./icons/ic_easing_stairstep.svg" }
      ]
    },
    custom: {
      name: "CUSTOM",
      presets: [
        { name: "SINE BERKALA", token: "cyclic 0.5 0.5 0.5 0 0", p1: [0.5, 0], p2: [0.5, 1], icon: "./icons/ic_easing_oscillate.svg" },
        { name: "OSILASI CEPAT", token: "cyclic 0.25 0.8 0.5 0 0", p1: [0.25, 0], p2: [0.8, 1], icon: "./icons/ic_easing_oscillate.svg" },
        { name: "TANGGA ELASTIS", token: "elasticStep 0.25 0.5", p1: [0.25, 0], p2: [0.5, 1], icon: "./icons/ic_easing_oscillate.svg" },
        { name: "ACAK", token: "random 0.2 0.8", p1: [0.2, 0], p2: [0.8, 1], icon: "./icons/ic_easing_oscillate.svg" }
      ]
    }
  };

  let cvActiveProp = "loc";
  let cvActiveLayer = null;
  let cvActiveChannel = null;
  let cvActiveCat = "bezier";
  let cvActivePresetIdx = 3;
  let cvP1 = { x: 0.42, y: 0.0 };
  let cvP2 = { x: 0.58, y: 1.0 };
  let cvCurrentToken = "cubicBezier 0.42 0.0 0.58 1.0";
  let cvOnBackCallback = null;
  let cvDragTarget = 0;
  let cvCopiedToken = null;

  function parseCurveToken(token) {
    if (!token) return { type: "linear", p1: { x: 0, y: 0 }, p2: { x: 1, y: 1 } };
    const s = String(token).trim();
    if (s === "linear" || s === "none") {
      return { type: "linear", p1: { x: 0, y: 0 }, p2: { x: 1, y: 1 } };
    }
    const m = s.match(/cubicBezier\s+([-\d.]+)\s+([-\d.]+)\s+([-\d.]+)\s+([-\d.]+)/i);
    if (m) {
      return {
        type: "bezier",
        p1: { x: parseFloat(m[1]) || 0, y: parseFloat(m[2]) || 0 },
        p2: { x: parseFloat(m[3]) || 1, y: parseFloat(m[4]) || 1 }
      };
    }
    if (s.startsWith("step")) {
      return { type: "steps", p1: { x: 0, y: 0 }, p2: { x: 1, y: 1 }, raw: s };
    }
    if (s.includes("bounce")) {
      return { type: "bounce", p1: { x: 0.3, y: 0 }, p2: { x: 0.8, y: 1 }, raw: s };
    }
    if (s.includes("elastic")) {
      return { type: "bounce", p1: { x: 0.5, y: 0 }, p2: { x: 0.5, y: 1 }, raw: s };
    }
    return { type: "custom", p1: { x: 0.5, y: 0 }, p2: { x: 0.5, y: 1 }, raw: s };
  }

  function resolveCurveKeyable(layer, prop, channel) {
    if (channel && channel.kfs) return channel;
    if (!layer) return null;
    const tr = layer.transform || {};
    if (prop === "loc") return tr.location;
    if (prop === "rot") return tr.rotation;
    if (prop === "sc") return tr.scale;
    if (prop === "op") return tr.opacity || layer.opacity;
    if (prop === "skew") return tr.skew;
    if (prop === "pivot") return tr.pivot;
    if (prop === "points" && layer.pointsKeyable) return layer.pointsKeyable;
    if (tr[prop] && tr[prop].kfs) return tr[prop];
    if (layer[prop] && layer[prop].kfs) return layer[prop];
    return null;
  }

  function getActiveCurveInterval(k) {
    if (!k || !k.kfs || k.kfs.length < 2) return null;
    const sorted = [...k.kfs].sort((a, b) => a.t - b.t);
    const tt = (I.H || 0) / 1000;
    let idx = 0;
    for (let i = 0; i < sorted.length - 1; i++) {
      if (tt >= sorted[i].t - 0.001) {
        idx = i;
      }
    }
    return {
      index: idx,
      total: sorted.length - 1,
      kf0: sorted[idx],
      kf1: sorted[idx + 1],
      sorted
    };
  }

  function setCurveEasingOnKeyable(k, token, allKeyframes = false) {
    if (!k || !k.kfs || !k.kfs.length) return;
    const snap = I.sceneSnapshot ? I.sceneSnapshot() : null;
    const parseFn = (window.__AM_INTERNAL && window.__AM_INTERNAL.obj) || I.obj;
    const easingObj = parseFn ? parseFn(token) : null;
    const interval = getActiveCurveInterval(k);

    if (allKeyframes || !interval) {
      k.kfs.forEach(f => {
        f.e = token;
        f.easing = easingObj;
      });
    } else {
      interval.kf1.e = token;
      interval.kf1.easing = easingObj;
    }

    if (snap && I.pushUndo) I.pushUndo(snap);
    I.V = true;
    if (I.val2 && I.val2.renderAt) {
      try { I.val2.renderAt(I.H); } catch (e) {}
    }
  }

  function getCurveDisplayLabel(token, p1, p2) {
    if (token && token.startsWith("step")) return "TANGGA (STEPS)";
    if (token && token.includes("bounce")) return "PANTULAN (BOUNCE)";
    if (token && token.includes("elastic")) return "ELASTIS (ELASTIC)";
    if (token && token.includes("cyclic")) return "BERKALA (CYCLIC)";
    if (token === "linear" || token === "none") return "LINEAR";

    const eps = 0.03;
    const isNear = (a, b) => Math.abs(a - b) < eps;
    if (isNear(p1.x, 0) && isNear(p1.y, 0) && isNear(p2.x, 1) && isNear(p2.y, 1)) return "LINEAR";
    if (isNear(p1.x, 0.42) && isNear(p1.y, 0) && isNear(p2.x, 1) && isNear(p2.y, 1)) return "MASUK MUDAH";
    if (isNear(p1.x, 0) && isNear(p1.y, 0) && isNear(p2.x, 0.58) && isNear(p2.y, 1)) return "KELUAR MUDAH";
    if (isNear(p1.x, 0.42) && isNear(p1.y, 0) && isNear(p2.x, 0.58) && isNear(p2.y, 1)) return "MASUK-KELUAR MUDAH";
    return "KUSTOM (BEZIER)";
  }

  function renderCurveCanvas() {
    const labelEl = document.getElementById("am-curve-label");
    if (labelEl) {
      labelEl.textContent = getCurveDisplayLabel(cvCurrentToken, cvP1, cvP2);
    }

    const canvas = document.getElementById("am-curve-canvas");
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.round(rect.width * dpr);
    canvas.height = Math.round(rect.height * dpr);
    const ctx = canvas.getContext("2d");

    const padX = 36 * dpr;
    const padY = 36 * dpr;
    const boxW = canvas.width - 2 * padX;
    const boxH = canvas.height - 2 * padY;

    const toX = u => padX + u * boxW;
    const toY = v => padY + (1 - v) * boxH;

    ctx.fillStyle = "#474d70";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
    ctx.lineWidth = 1 * dpr;
    ctx.beginPath();
    for (let i = 1; i < 4; i++) {
      const gx = toX(i / 4);
      const gy = toY(i / 4);
      ctx.moveTo(gx, toY(0));
      ctx.lineTo(gx, toY(1));
      ctx.moveTo(toX(0), gy);
      ctx.lineTo(toX(1), gy);
    }
    ctx.stroke();

    ctx.strokeStyle = "rgba(255, 255, 255, 0.25)";
    ctx.lineWidth = 1.2 * dpr;
    ctx.strokeRect(toX(0), toY(1), boxW, boxH);

    ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
    ctx.setLineDash([4 * dpr, 4 * dpr]);
    ctx.beginPath();
    ctx.moveTo(toX(0), toY(0));
    ctx.lineTo(toX(1), toY(1));
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.strokeStyle = "rgba(255, 255, 255, 0.65)";
    ctx.lineWidth = 1.5 * dpr;
    ctx.beginPath();
    ctx.moveTo(toX(0), toY(0));
    ctx.lineTo(toX(cvP1.x), toY(cvP1.y));
    ctx.moveTo(toX(1), toY(1));
    ctx.lineTo(toX(cvP2.x), toY(cvP2.y));
    ctx.stroke();

    ctx.strokeStyle = "#00ffa8";
    ctx.lineWidth = 3.5 * dpr;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.beginPath();
    ctx.moveTo(toX(0), toY(0));

    const evalFn = (window.__AM_INTERNAL && window.__AM_INTERNAL._r) || I._r;
    if (cvActiveCat === "bezier" || cvCurrentToken.startsWith("cubicBezier") || cvCurrentToken === "linear") {
      ctx.bezierCurveTo(toX(cvP1.x), toY(cvP1.y), toX(cvP2.x), toY(cvP2.y), toX(1), toY(1));
    } else if (evalFn) {
      const fn = evalFn(cvCurrentToken);
      if (fn) {
        const steps = 80;
        for (let s = 1; s <= steps; s++) {
          const t = s / steps;
          const val = fn(t);
          ctx.lineTo(toX(t), toY(val));
        }
      } else {
        ctx.bezierCurveTo(toX(cvP1.x), toY(cvP1.y), toX(cvP2.x), toY(cvP2.y), toX(1), toY(1));
      }
    } else {
      ctx.bezierCurveTo(toX(cvP1.x), toY(cvP1.y), toX(cvP2.x), toY(cvP2.y), toX(1), toY(1));
    }
    ctx.stroke();

    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(toX(0), toY(0), 3.5 * dpr, 0, Math.PI * 2);
    ctx.arc(toX(1), toY(1), 3.5 * dpr, 0, Math.PI * 2);
    ctx.fill();

    const drawHandle = (p, isTarget) => {
      const hx = toX(p.x);
      const hy = toY(p.y);

      if (isTarget) {
        ctx.fillStyle = "rgba(0, 255, 168, 0.25)";
        ctx.beginPath();
        ctx.arc(hx, hy, 16 * dpr, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 2.5 * dpr;
      ctx.fillStyle = "#00ffa8";
      ctx.beginPath();
      ctx.arc(hx, hy, 7.5 * dpr, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    };

    drawHandle(cvP1, cvDragTarget === 1);
    drawHandle(cvP2, cvDragTarget === 2);

    if (labelEl) {
      labelEl.textContent = getCurveDisplayLabel(cvCurrentToken, cvP1, cvP2);
    }
  }

  function updateCategoryTabsUI() {
    document.querySelectorAll(".am-curve-cat-btn").forEach(btn => {
      const cat = btn.dataset.cat;
      const isActive = cat === cvActiveCat;
      btn.classList.toggle("active", isActive);
      const holder = btn.closest(".am-curve-tab-holder");
      const cue = holder ? holder.querySelector(".am-curve-cat-cue") : null;
      if (cue) cue.classList.toggle("active", isActive);
    });

    const catData = CURVE_CATEGORIES[cvActiveCat] || CURVE_CATEGORIES.bezier;
    catData.presets.forEach((preset, i) => {
      const btn = document.getElementById(`am-curve-preset-${i}`);
      if (!btn) return;
      btn.title = preset.name;
      const img = btn.querySelector("img");
      if (img) img.src = preset.icon;

      const isPresetActive = preset.token === cvCurrentToken ||
        (cvActiveCat === "bezier" && preset.p1 &&
         Math.abs(preset.p1[0] - cvP1.x) < 0.02 && Math.abs(preset.p1[1] - cvP1.y) < 0.02 &&
         Math.abs(preset.p2[0] - cvP2.x) < 0.02 && Math.abs(preset.p2[1] - cvP2.y) < 0.02);
      btn.classList.toggle("active", isPresetActive);
    });
  }

  function updateCurvePanelUI() {
    const k = resolveCurveKeyable(cvActiveLayer, cvActiveProp, cvActiveChannel);
    const interval = getActiveCurveInterval(k);
    const warning = document.getElementById("am-curve-warning");
    const kfImg = document.getElementById("am-curve-img-kf");

    if (!k || !k.kfs || k.kfs.length < 2) {
      if (warning) warning.style.display = "flex";
      if (kfImg) kfImg.src = "./icons/ac_ic_add_keyframe.svg";
      renderCurveCanvas();
      return;
    }

    if (warning) warning.style.display = "none";

    const tt = (I.H || 0) / 1000;
    const hasKfAtPh = !!(k.kfs.some(f => Math.abs(Number(f.t) - tt) < 0.002));
    if (kfImg) {
      kfImg.src = hasKfAtPh ? "./icons/ac_ic_delete_keyframe.svg" : "./icons/ac_ic_add_keyframe.svg";
    }

    if (interval) {
      const tok = interval.kf1.e || "linear";
      cvCurrentToken = tok;
      const parsed = parseCurveToken(tok);
      cvP1 = { ...parsed.p1 };
      cvP2 = { ...parsed.p2 };

      if (tok.startsWith("step")) cvActiveCat = "steps";
      else if (tok.includes("bounce") || tok.includes("elastic")) cvActiveCat = "bounce";
      else if (tok.includes("cyclic") || tok.includes("random")) cvActiveCat = "custom";
      else cvActiveCat = "bezier";
    }

    const labelEl = document.getElementById("am-curve-label");
    if (labelEl) {
      labelEl.textContent = getCurveDisplayLabel(cvCurrentToken, cvP1, cvP2);
    }

    updateCategoryTabsUI();
    renderCurveCanvas();
  }

  function initAnimationCurveEditor() {
    const canvas = document.getElementById("am-curve-canvas");
    if (!canvas) return;

    let dragSnap = null;

    canvas.addEventListener("pointerdown", e => {
      const k = resolveCurveKeyable(cvActiveLayer, cvActiveProp, cvActiveChannel);
      if (!k || !k.kfs || k.kfs.length < 2) return;

      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      const padX = 36 * dpr;
      const padY = 36 * dpr;
      const boxW = canvas.width - 2 * padX;
      const boxH = canvas.height - 2 * padY;

      const toX = u => padX + u * boxW;
      const toY = v => padY + (1 - v) * boxH;

      const px = (e.clientX - rect.left) * dpr;
      const py = (e.clientY - rect.top) * dpr;

      const d1 = Math.hypot(px - toX(cvP1.x), py - toY(cvP1.y));
      const d2 = Math.hypot(px - toX(cvP2.x), py - toY(cvP2.y));
      const threshold = 32 * dpr;

      if (d1 <= threshold && d1 <= d2) {
        cvDragTarget = 1;
      } else if (d2 <= threshold) {
        cvDragTarget = 2;
      } else {
        cvDragTarget = 0;
        return;
      }

      dragSnap = I.sceneSnapshot ? I.sceneSnapshot() : null;
      canvas.setPointerCapture(e.pointerId);
      renderCurveCanvas();
    });

    canvas.addEventListener("pointermove", e => {
      if (!cvDragTarget) return;
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      const padX = 36 * dpr;
      const padY = 36 * dpr;
      const boxW = canvas.width - 2 * padX;
      const boxH = canvas.height - 2 * padY;

      const px = (e.clientX - rect.left) * dpr;
      const py = (e.clientY - rect.top) * dpr;

      let u = (px - padX) / boxW;
      let v = 1 - (py - padY) / boxH;

      u = Math.max(0, Math.min(1, u));
      v = Math.max(-0.5, Math.min(1.5, v));

      if (cvDragTarget === 1) {
        cvP1.x = +u.toFixed(4);
        cvP1.y = +v.toFixed(4);
      } else if (cvDragTarget === 2) {
        cvP2.x = +u.toFixed(4);
        cvP2.y = +v.toFixed(4);
      }

      cvActiveCat = "bezier";
      cvCurrentToken = `cubicBezier ${cvP1.x} ${cvP1.y} ${cvP2.x} ${cvP2.y}`;

      const k = resolveCurveKeyable(cvActiveLayer, cvActiveProp, cvActiveChannel);
      const interval = getActiveCurveInterval(k);
      if (k && interval) {
        const parseFn = (window.__AM_INTERNAL && window.__AM_INTERNAL.obj) || I.obj;
        interval.kf1.e = cvCurrentToken;
        interval.kf1.easing = parseFn ? parseFn(cvCurrentToken) : null;
        I.V = true;
        if (I.val2 && I.val2.renderAt) {
          try { I.val2.renderAt(I.H); } catch (err) {}
        }
      }

      updateCategoryTabsUI();
      renderCurveCanvas();
    });

    const finishDrag = () => {
      if (!cvDragTarget) return;
      cvDragTarget = 0;
      if (dragSnap && I.pushUndo) I.pushUndo(dragSnap);
      dragSnap = null;
      renderCurveCanvas();
    };

    canvas.addEventListener("pointerup", finishDrag);
    canvas.addEventListener("pointercancel", finishDrag);

    document.querySelectorAll(".am-curve-preset-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const idx = parseInt(btn.dataset.idx, 10) || 0;
        const catData = CURVE_CATEGORIES[cvActiveCat] || CURVE_CATEGORIES.bezier;
        const preset = catData.presets[idx];
        if (!preset) return;

        cvActivePresetIdx = idx;
        cvCurrentToken = preset.token;
        if (preset.p1) cvP1 = { x: preset.p1[0], y: preset.p1[1] };
        if (preset.p2) cvP2 = { x: preset.p2[0], y: preset.p2[1] };

        const k = resolveCurveKeyable(cvActiveLayer, cvActiveProp, cvActiveChannel);
        setCurveEasingOnKeyable(k, cvCurrentToken, false);
        updateCategoryTabsUI();
        renderCurveCanvas();
      });
    });

    document.querySelectorAll(".am-curve-cat-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const cat = btn.dataset.cat;
        if (!CURVE_CATEGORIES[cat]) return;
        cvActiveCat = cat;
        const defaultPreset = CURVE_CATEGORIES[cat].presets[0];
        if (defaultPreset) {
          cvCurrentToken = defaultPreset.token;
          if (defaultPreset.p1) cvP1 = { x: defaultPreset.p1[0], y: defaultPreset.p1[1] };
          if (defaultPreset.p2) cvP2 = { x: defaultPreset.p2[0], y: defaultPreset.p2[1] };
          const k = resolveCurveKeyable(cvActiveLayer, cvActiveProp, cvActiveChannel);
          setCurveEasingOnKeyable(k, cvCurrentToken, false);
        }
        updateCategoryTabsUI();
        renderCurveCanvas();
      });
    });

    const btnReverse = document.getElementById("am-curve-btn-reverse");
    if (btnReverse) {
      btnReverse.addEventListener("click", () => {
        const k = resolveCurveKeyable(cvActiveLayer, cvActiveProp, cvActiveChannel);
        if (!k || !k.kfs || k.kfs.length < 2) return;

        if (cvCurrentToken.startsWith("cubicBezier") || cvCurrentToken === "linear" || cvActiveCat === "bezier") {
          const nx1 = +(1 - cvP2.x).toFixed(4);
          const ny1 = +(1 - cvP2.y).toFixed(4);
          const nx2 = +(1 - cvP1.x).toFixed(4);
          const ny2 = +(1 - cvP1.y).toFixed(4);
          cvP1 = { x: nx1, y: ny1 };
          cvP2 = { x: nx2, y: ny2 };
          cvCurrentToken = `cubicBezier ${nx1} ${ny1} ${nx2} ${ny2}`;
        } else if (cvCurrentToken.startsWith("reverse ")) {
          cvCurrentToken = cvCurrentToken.replace(/^reverse\s+/, "");
        } else {
          cvCurrentToken = "reverse " + cvCurrentToken;
        }

        setCurveEasingOnKeyable(k, cvCurrentToken, false);
        updateCategoryTabsUI();
        renderCurveCanvas();
        if (I.handle9) I.handle9("[EDIT] Balik Kurva");
      });
    }

    const btnOverflow = document.getElementById("am-curve-btn-overflow");
    const menuOverflow = document.getElementById("am-curve-overflow-menu");
    if (btnOverflow && menuOverflow) {
      btnOverflow.addEventListener("click", e => {
        e.stopPropagation();
        menuOverflow.style.display = menuOverflow.style.display === "none" ? "flex" : "none";
      });

      document.addEventListener("pointerdown", ev => {
        if (!menuOverflow.contains(ev.target) && ev.target !== btnOverflow && !btnOverflow.contains(ev.target)) {
          menuOverflow.style.display = "none";
        }
      });
    }

    const btnCopy = document.getElementById("am-curve-menu-copy");
    if (btnCopy) {
      btnCopy.addEventListener("click", () => {
        cvCopiedToken = cvCurrentToken;
        if (menuOverflow) menuOverflow.style.display = "none";
        if (I.handle9) I.handle9("[EDIT] Kurva disalin");
      });
    }

    const btnPaste = document.getElementById("am-curve-menu-paste");
    if (btnPaste) {
      btnPaste.addEventListener("click", () => {
        if (menuOverflow) menuOverflow.style.display = "none";
        if (!cvCopiedToken) {
          if (I.handle9) I.handle9("[EDIT] Belum ada kurva yang disalin");
          return;
        }
        cvCurrentToken = cvCopiedToken;
        const parsed = parseCurveToken(cvCurrentToken);
        cvP1 = { ...parsed.p1 };
        cvP2 = { ...parsed.p2 };

        const k = resolveCurveKeyable(cvActiveLayer, cvActiveProp, cvActiveChannel);
        setCurveEasingOnKeyable(k, cvCurrentToken, false);
        updateCategoryTabsUI();
        renderCurveCanvas();
        if (I.handle9) I.handle9("[EDIT] Kurva ditempel");
      });
    }

    const btnPasteAll = document.getElementById("am-curve-menu-paste-all");
    if (btnPasteAll) {
      btnPasteAll.addEventListener("click", () => {
        if (menuOverflow) menuOverflow.style.display = "none";
        const tok = cvCopiedToken || cvCurrentToken;
        const k = resolveCurveKeyable(cvActiveLayer, cvActiveProp, cvActiveChannel);
        setCurveEasingOnKeyable(k, tok, true);
        updateCategoryTabsUI();
        renderCurveCanvas();
        if (I.handle9) I.handle9("[EDIT] Kurva ditempel ke semua keyframe");
      });
    }

    const btnKf = document.getElementById("am-curve-btn-kf");
    if (btnKf) {
      btnKf.addEventListener("click", () => {
        const k = resolveCurveKeyable(cvActiveLayer, cvActiveProp, cvActiveChannel);
        if (!k) return;
        const tt = (I.H || 0) / 1000;
        const hasKf = !!(k.kfs && k.kfs.some(f => Math.abs(Number(f.t) - tt) < 0.002));
        if (hasKf) {
          if (I.omKfRemoveAt && typeof cvActiveProp === "string") I.omKfRemoveAt(cvActiveProp);
          else if (k.kfs) {
            const idx = k.kfs.findIndex(f => Math.abs(Number(f.t) - tt) < 0.002);
            if (idx >= 0) k.kfs.splice(idx, 1);
          }
        } else {
          if (I.omKfInsert && typeof cvActiveProp === "string") I.omKfInsert(cvActiveProp);
          else if (k.kfs) {
            const val = Array.isArray(k.value) ? k.value.slice() : [Number(k.value) || 0];
            k.kfs.push({ t: tt, v: val, e: cvCurrentToken, easing: null });
            k.kfs.sort((a, b) => a.t - b.t);
          }
        }
        I.V = true;
        if (I.val2 && I.val2.renderAt) {
          try { I.val2.renderAt(I.H); } catch (e) {}
        }
        updateCurvePanelUI();
      });
    }

    const btnPromptAddKf = document.getElementById("am-curve-btn-add-kf-prompt");
    if (btnPromptAddKf) {
      btnPromptAddKf.addEventListener("click", () => {
        const k = resolveCurveKeyable(cvActiveLayer, cvActiveProp, cvActiveChannel);
        if (!k) return;
        k.kfs = k.kfs || [];
        const val = Array.isArray(k.value) ? k.value.slice() : [Number(k.value) || 0];
        if (k.kfs.length === 0) {
          k.kfs.push({ t: 0, v: val.slice(), e: null, easing: null });
          k.kfs.push({ t: 1, v: val.slice(), e: cvCurrentToken, easing: null });
        } else if (k.kfs.length === 1) {
          const t0 = k.kfs[0].t;
          const t1 = t0 >= 1 ? 0 : Math.min(t0 + 1, (I.val ? I.val.totalTime / 1000 : 2));
          k.kfs.push({ t: t1, v: val.slice(), e: cvCurrentToken, easing: null });
          k.kfs.sort((a, b) => a.t - b.t);
        }
        I.V = true;
        if (I.val2 && I.val2.renderAt) {
          try { I.val2.renderAt(I.H); } catch (e) {}
        }
        updateCurvePanelUI();
      });
    }

    const btnPrev = document.getElementById("am-curve-btn-prev");
    const btnNext = document.getElementById("am-curve-btn-next");

    if (btnPrev) {
      btnPrev.addEventListener("click", () => {
        const k = resolveCurveKeyable(cvActiveLayer, cvActiveProp, cvActiveChannel);
        if (!k || !k.kfs || k.kfs.length < 2) return;
        const sorted = [...k.kfs].sort((a, b) => a.t - b.t);
        const tt = (I.H || 0) / 1000;
        for (let i = sorted.length - 1; i >= 0; i--) {
          if (sorted[i].t < tt - 0.01) {
            I.H = Math.round(sorted[i].t * 1000);
            if (I.seek) I.seek(I.H);
            else if (I.val2 && I.val2.renderAt) I.val2.renderAt(I.H);
            updateCurvePanelUI();
            return;
          }
        }
        I.H = Math.round(sorted[0].t * 1000);
        if (I.seek) I.seek(I.H);
        updateCurvePanelUI();
      });
    }

    if (btnNext) {
      btnNext.addEventListener("click", () => {
        const k = resolveCurveKeyable(cvActiveLayer, cvActiveProp, cvActiveChannel);
        if (!k || !k.kfs || k.kfs.length < 2) return;
        const sorted = [...k.kfs].sort((a, b) => a.t - b.t);
        const tt = (I.H || 0) / 1000;
        for (let i = 0; i < sorted.length; i++) {
          if (sorted[i].t > tt + 0.01) {
            I.H = Math.round(sorted[i].t * 1000);
            if (I.seek) I.seek(I.H);
            else if (I.val2 && I.val2.renderAt) I.val2.renderAt(I.H);
            updateCurvePanelUI();
            return;
          }
        }
        I.H = Math.round(sorted[sorted.length - 1].t * 1000);
        if (I.seek) I.seek(I.H);
        updateCurvePanelUI();
      });
    }

    const btnBack = document.getElementById("am-curve-btn-back");
    if (btnBack) {
      btnBack.addEventListener("click", () => closeAnimationCurvePanel());
    }

    window.addEventListener("resize", () => {
      const panel = document.getElementById("am-animcurve-panel");
      if (panel && panel.classList.contains("open")) {
        renderCurveCanvas();
      }
    });
  }

  function openAnimationCurvePanel(options = {}) {
    cvActiveProp = options.prop || "loc";
    cvActiveLayer = options.layer || currentSelectedLayer || (I.omLayerCur && I.omLayerCur()) || null;
    cvActiveChannel = options.channel || null;
    cvOnBackCallback = options.onBack || null;

    const panel = document.getElementById("am-animcurve-panel");
    if (!panel) return;

    const elemPanel = document.getElementById("am-element-edit-panel");
    const subpanel = document.getElementById("am-subpanel-container");
    const liveShapePanel = document.getElementById("am-liveshape-panel");
    const editPointsPanel = document.getElementById("am-editpoints-panel");
    const drawingPanel = document.getElementById("am-drawing-panel");
    const tlView = document.getElementById("am-timeline-view");
    const root = document.getElementById("am-mobile-root");

    if (elemPanel) elemPanel.style.display = "none";
    if (subpanel) subpanel.classList.remove("open");
    if (liveShapePanel) liveShapePanel.classList.remove("open");
    if (editPointsPanel) editPointsPanel.classList.remove("open");
    if (drawingPanel) drawingPanel.style.display = "none";
    if (tlView) tlView.style.display = "none";

    const isMobileMode = root && root.offsetWidth <= 920;
    if (isMobileMode) {
      panel.classList.remove("am-curve-floating");
    } else {
      panel.classList.add("am-curve-floating");
    }

    panel.classList.add("open");
    updateCurvePanelUI();
    setTimeout(() => {
      updateCurvePanelUI();
    }, 30);
  }

  function closeAnimationCurvePanel() {
    const panel = document.getElementById("am-animcurve-panel");
    if (panel) {
      panel.classList.remove("open");
      panel.classList.remove("am-curve-floating");
    }

    if (typeof cvOnBackCallback === "function") {
      const cb = cvOnBackCallback;
      cvOnBackCallback = null;
      cb();
      return;
    }

    const elemPanel = document.getElementById("am-element-edit-panel");
    const tlView = document.getElementById("am-timeline-view");
    if (currentSelectedLayer && elemPanel) {
      elemPanel.style.display = "flex";
    } else if (tlView) {
      tlView.style.display = "flex";
    }
  }

  window.omOpenCurveEditor = openAnimationCurvePanel;
  window.omCloseCurveEditor = closeAnimationCurvePanel;

  window.omOpenLiveShape = openLiveShape;
  window.omCloseLiveShape = closeLiveShape;
  window.omOpenEditPoints = openEditPoints;
  window.omCloseEditPoints = closeEditPoints;

  window.omOpenTextEditor = openTextEditor;
  window.omCloseTextEditor = closeTextEditor;
  window.omAddTextLayer = addTextLayer;

  window.addEventListener("popstate", checkInitialRoute);
})();
