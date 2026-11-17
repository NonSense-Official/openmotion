import React, { useState, useEffect, useRef } from 'react';
import { useEditorStore } from '../../store/editorStore';

export default function ElementNavbar({
  layer: customLayer,
  onBack,
  onTitleChange,
  onParent,
  onDelete,
  onDuplicate,
  onEnterGroup,
  onUngroup
}) {
  const activeScene = useEditorStore((state) => state.activeScene);
  const selectedLayerIds = useEditorStore((state) => state.selectedLayerIds);
  const clearSelection = useEditorStore((state) => state.clearSelection);
  const removeLayer = useEditorStore((state) => state.removeLayer);
  const updateLayer = useEditorStore((state) => state.updateLayer);
  const addLayer = useEditorStore((state) => state.addLayer);

  const selectedLayer = customLayer || (
    selectedLayerIds.length === 1 && activeScene?.layers
      ? activeScene.layers.find((l) => l.id === selectedLayerIds[0])
      : null
  );

  const [titleValue, setTitleValue] = useState(
    selectedLayer?.label || selectedLayer?.name || 'Layer'
  );
  const [isOverflowOpen, setIsOverflowOpen] = useState(false);
  const overflowRef = useRef(null);

  useEffect(() => {
    setTitleValue(selectedLayer?.label || selectedLayer?.name || 'Layer');
  }, [selectedLayer?.id, selectedLayer?.label, selectedLayer?.name]);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (overflowRef.current && !overflowRef.current.contains(e.target)) {
        setIsOverflowOpen(false);
      }
    };
    if (isOverflowOpen) {
      document.addEventListener('pointerdown', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('pointerdown', handleOutsideClick);
    };
  }, [isOverflowOpen]);

  const handleTitleSubmit = (val) => {
    const trimmed = val.trim();
    if (!trimmed) {
      setTitleValue(selectedLayer?.label || selectedLayer?.name || 'Layer');
      return;
    }
    if (onTitleChange) {
      onTitleChange(trimmed);
    } else if (selectedLayer) {
      updateLayer(selectedLayer.id, { label: trimmed });
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.target.blur();
    }
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      clearSelection();
    }
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(selectedLayer);
    } else if (selectedLayer) {
      removeLayer(selectedLayer.id);
      clearSelection();
    }
    setIsOverflowOpen(false);
  };

  const handleDuplicate = () => {
    if (onDuplicate) {
      onDuplicate(selectedLayer);
    } else if (selectedLayer && activeScene) {
      const cloned = JSON.parse(JSON.stringify(selectedLayer));
      cloned.id = `layer_${Math.random().toString(36).substring(2, 9)}`;
      cloned.label = `${selectedLayer.label || 'Layer'} (Salinan)`;
      addLayer(cloned);
    }
    setIsOverflowOpen(false);
  };

  const handleParent = (e) => {
    if (onParent) {
      onParent(e, selectedLayer);
    }
  };

  const isGroup = selectedLayer?.tag === 'group' || selectedLayer?.type === 'group';
  const hasParent = Boolean(selectedLayer?.parentId);

  return (
    <div id="am-navbar-element" style={{ display: 'flex' }}>
      <button
        type="button"
        id="am-btn-elem-back"
        className="am-icon-btn"
        title="Kembali"
        onClick={handleBack}
      >
        <img src="/icons/ac_ic_back.svg" alt="Back" />
      </button>

      <input
        type="text"
        id="am-elem-title"
        className="am-project-title-input"
        value={titleValue}
        onChange={(e) => setTitleValue(e.target.value)}
        onBlur={() => handleTitleSubmit(titleValue)}
        onKeyDown={handleKeyDown}
        placeholder="Nama Layer"
      />

      <button
        type="button"
        id="am-btn-elem-parent"
        className={`am-icon-btn ${hasParent ? 'has-parent' : ''}`}
        title="Parenting Layer"
        onClick={handleParent}
      >
        <img src="/icons/ic_layer_parent.svg" alt="Parent" />
      </button>

      <button
        type="button"
        id="am-btn-elem-delete"
        className="am-icon-btn"
        title="Hapus Layer"
        onClick={handleDelete}
      >
        <img src="/icons/ac_ic_delete.svg" alt="Delete" />
      </button>

      <div style={{ position: 'relative' }} ref={overflowRef}>
        <button
          type="button"
          id="am-btn-elem-overflow"
          className="am-icon-btn"
          title="Opsi Layer"
          onClick={() => setIsOverflowOpen((prev) => !prev)}
        >
          <img src="/icons/ic_more_vert_white_24dp.svg" alt="More" />
        </button>

        {isOverflowOpen && (
          <div
            id="am-layer-overflow-menu"
            style={{
              position: 'absolute',
              top: '46px',
              right: '4px',
              background: '#1a1d26',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: '8px',
              padding: '6px',
              boxShadow: '0 8px 24px rgba(0,0,0,0.6)',
              zIndex: 999,
              display: 'flex',
              flexDirection: 'column',
              gap: '4px',
              minWidth: '160px'
            }}
          >
            {isGroup && (
              <>
                <button
                  type="button"
                  style={{
                    background: 'transparent',
                    border: 0,
                    color: '#ffffff',
                    padding: '8px 12px',
                    fontSize: '12px',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    textAlign: 'left',
                    width: '100%'
                  }}
                  onClick={() => {
                    setIsOverflowOpen(false);
                    if (onEnterGroup) onEnterGroup(selectedLayer);
                  }}
                >
                  <img src="/icons/ac_ic_groupelements.svg" alt="" style={{ width: 16, height: 16, filter: 'brightness(0) invert(1)' }} />
                  <span>Edit Isi Grup</span>
                </button>

                <button
                  type="button"
                  style={{
                    background: 'transparent',
                    border: 0,
                    color: '#ffffff',
                    padding: '8px 12px',
                    fontSize: '12px',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    textAlign: 'left',
                    width: '100%'
                  }}
                  onClick={() => {
                    setIsOverflowOpen(false);
                    if (onUngroup) onUngroup(selectedLayer);
                  }}
                >
                  <img src="/icons/ic_exclude_group_bl.svg" alt="" style={{ width: 16, height: 16, filter: 'brightness(0) invert(1)' }} />
                  <span>Buka Grup (Ungroup)</span>
                </button>
              </>
            )}

            <button
              type="button"
              style={{
                background: 'transparent',
                border: 0,
                color: '#ffffff',
                padding: '8px 12px',
                fontSize: '12px',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                borderRadius: '6px',
                cursor: 'pointer',
                textAlign: 'left',
                width: '100%'
              }}
              onClick={handleDuplicate}
            >
              <img src="/icons/ic_layer_copy_paste_menu.svg" alt="" style={{ width: 16, height: 16, filter: 'brightness(0) invert(1)' }} />
              <span>Duplikat Layer</span>
            </button>

            <button
              type="button"
              style={{
                background: 'transparent',
                border: 0,
                color: '#ff5252',
                padding: '8px 12px',
                fontSize: '12px',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                borderRadius: '6px',
                cursor: 'pointer',
                textAlign: 'left',
                width: '100%'
              }}
              onClick={handleDelete}
            >
              <img src="/icons/ac_ic_delete.svg" alt="" style={{ width: 16, height: 16 }} />
              <span>Hapus Layer</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
