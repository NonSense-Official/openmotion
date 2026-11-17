import React, { useState } from 'react';
import { useEditorStore } from '../../store/editorStore';

export default function SelectNavbar({
  selectedCount: customSelectedCount,
  onCancel,
  onGroup,
  onMask,
  onExclude,
  onDelete,
  onAlign
}) {
  const selectedLayerIds = useEditorStore((state) => state.selectedLayerIds);
  const clearSelection = useEditorStore((state) => state.clearSelection);
  const activeScene = useEditorStore((state) => state.activeScene);
  const updateActiveScene = useEditorStore((state) => state.updateActiveScene);

  const [isAlignMode, setIsAlignMode] = useState(false);

  const selectedCount = customSelectedCount !== undefined
    ? customSelectedCount
    : selectedLayerIds.length;

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      clearSelection();
    }
  };

  const handleGroup = (type) => {
    if (type === 'mask' && onMask) {
      onMask();
      return;
    }
    if (type === 'exclude' && onExclude) {
      onExclude();
      return;
    }
    if (onGroup) {
      onGroup(type);
      return;
    }

    if (!activeScene || selectedLayerIds.length < 2) return;
    const currentLayers = activeScene.layers || [];
    const targetLayers = currentLayers.filter((l) => selectedLayerIds.includes(l.id));
    const remainingLayers = currentLayers.filter((l) => !selectedLayerIds.includes(l.id));

    const newGroup = {
      id: `group_${Math.random().toString(36).substring(2, 9)}`,
      tag: 'group',
      label: type === 'mask' ? 'Grup Masking' : type === 'exclude' ? 'Grup Exclude' : 'Grup',
      groupType: type,
      layers: targetLayers,
      transform: {
        position: { value: [0, 0] },
        scale: { value: [1, 1] },
        rotation: { value: 0 },
        opacity: { value: 1 }
      }
    };

    updateActiveScene((s) => ({
      ...s,
      layers: [...remainingLayers, newGroup]
    }));
    useEditorStore.setState({ selectedLayerIds: [newGroup.id] });
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete();
      return;
    }
    if (!activeScene || !selectedLayerIds.length) return;
    updateActiveScene((s) => ({
      ...s,
      layers: (s.layers || []).filter((l) => !selectedLayerIds.includes(l.id))
    }));
    clearSelection();
  };

  const handleAlign = (alignment) => {
    if (onAlign) {
      onAlign(alignment);
    }
  };

  return (
    <div id="am-navbar-select" style={{ display: 'flex' }}>
      <button
        type="button"
        id="am-btn-sel-cancel"
        className="am-icon-btn am-sel-cancel-btn"
        title="Batal Multi-Pilih"
        onClick={handleCancel}
      >
        <img src="/icons/ac_ic_cancel.svg" alt="Cancel" />
      </button>

      <div
        id="am-sel-normal-holder"
        style={{ display: isAlignMode ? 'none' : 'flex' }}
      >
        <span id="am-select-count">{selectedCount} layer terpilih</span>

        <button
          type="button"
          id="am-btn-sel-group"
          className="am-icon-btn"
          title="Gabungkan ke Grup"
          onClick={() => handleGroup('normal')}
        >
          <img src="/icons/ac_ic_groupelements.svg" alt="Group" />
        </button>

        <button
          type="button"
          id="am-btn-sel-mask"
          className="am-icon-btn"
          title="Grup + Masking"
          onClick={() => handleGroup('mask')}
        >
          <img src="/icons/ic_masking_group_bl.svg" alt="Mask" />
        </button>

        <button
          type="button"
          id="am-btn-sel-exclude"
          className="am-icon-btn"
          title="Grup + Exclude"
          onClick={() => handleGroup('exclude')}
        >
          <img src="/icons/ic_exclude_group_bl.svg" alt="Exclude" />
        </button>

        <button
          type="button"
          id="am-btn-sel-del"
          className="am-icon-btn"
          title="Hapus Terpilih"
          onClick={handleDelete}
        >
          <img src="/icons/ac_ic_delete.svg" alt="Delete" />
        </button>

        <button
          type="button"
          id="am-btn-sel-align-toggle"
          className="am-icon-btn"
          title="Alignment Layar"
          onClick={() => setIsAlignMode(true)}
        >
          <img src="/icons/ic_multiselect_cue.svg" alt="Align" />
        </button>
      </div>

      <div
        id="am-sel-screen-align-holder"
        style={{ display: isAlignMode ? 'flex' : 'none' }}
      >
        <button
          type="button"
          id="am-btn-sel-align-back"
          className="am-icon-btn am-sel-align-back"
          title="Kembali"
          onClick={() => setIsAlignMode(false)}
        >
          <img
            src="/icons/ic_multiselect_cue.svg"
            alt="Back"
            style={{ transform: 'rotate(180deg)' }}
          />
        </button>

        <button
          type="button"
          id="am-btn-align-left-screen"
          className="am-icon-btn"
          title="Rata Kiri Layar"
          data-align="left-screen"
          onClick={() => handleAlign('left-screen')}
        >
          <img src="/icons/ic_align_left_screen_bl.svg" alt="Align Left" />
        </button>

        <button
          type="button"
          id="am-btn-align-center-h-screen"
          className="am-icon-btn"
          title="Tengah Horizontal Layar"
          data-align="center-h-screen"
          onClick={() => handleAlign('center-h-screen')}
        >
          <img src="/icons/ic_align_centerhorizontally_screen_bl.svg" alt="Center H" />
        </button>

        <button
          type="button"
          id="am-btn-align-right-screen"
          className="am-icon-btn"
          title="Rata Kanan Layar"
          data-align="right-screen"
          onClick={() => handleAlign('right-screen')}
        >
          <img src="/icons/ic_align_right_screen_bl.svg" alt="Align Right" />
        </button>

        <button
          type="button"
          id="am-btn-align-top-screen"
          className="am-icon-btn"
          title="Rata Atas Layar"
          data-align="top-screen"
          onClick={() => handleAlign('top-screen')}
        >
          <img src="/icons/ic_align_top_screen_bl.svg" alt="Align Top" />
        </button>

        <button
          type="button"
          id="am-btn-align-center-v-screen"
          className="am-icon-btn"
          title="Tengah Vertikal Layar"
          data-align="center-v-screen"
          onClick={() => handleAlign('center-v-screen')}
        >
          <img src="/icons/ic_align_centervertically_screen_bl.svg" alt="Center V" />
        </button>

        <button
          type="button"
          id="am-btn-align-bottom-screen"
          className="am-icon-btn"
          title="Rata Bawah Layar"
          data-align="bottom-screen"
          onClick={() => handleAlign('bottom-screen')}
        >
          <img src="/icons/ic_align_bottom_screen_bl.svg" alt="Align Bottom" />
        </button>

        <button
          type="button"
          id="am-btn-align-distrib-v-screen"
          className="am-icon-btn"
          title="Distribusi Vertikal"
          data-align="distribute-v-screen"
          onClick={() => handleAlign('distribute-v-screen')}
        >
          <img src="/icons/ic_align_distribute_vertically_screen_bl.svg" alt="Distribute V" />
        </button>

        <button
          type="button"
          id="am-btn-align-distrib-h-screen"
          className="am-icon-btn"
          title="Distribusi Horizontal"
          data-align="distribute-h-screen"
          onClick={() => handleAlign('distribute-h-screen')}
        >
          <img src="/icons/ic_align_distribute_horizontally_screen_bl.svg" alt="Distribute H" />
        </button>
      </div>
    </div>
  );
}
