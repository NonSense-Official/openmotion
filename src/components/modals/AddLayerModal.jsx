import React, { useState } from 'react';

const SHAPE_PRESETS = [
  { id: 'rect', name: 'Persegi', icon: './shapes/rectangle.svg', shapeType: 'rect' },
  { id: 'circle', name: 'Lingkaran', icon: './shapes/circle.svg', shapeType: 'circle' },
  { id: 'triangle', name: 'Segitiga', icon: './shapes/triangle.svg', shapeType: 'triangle' },
  { id: 'star', name: 'Bintang', icon: './shapes/star.svg', shapeType: 'star' },
  { id: 'polygon', name: 'Poligon', icon: './shapes/polygon.svg', shapeType: 'polygon' },
  { id: 'heart', name: 'Hati', icon: './shapes/heart.svg', shapeType: 'heart' }
];

const TABS = [
  { id: 'shape', label: 'Bentuk', icon: './icons/ic_add_object.svg' },
  { id: 'media', label: 'Media', icon: './icons/ic_add_imagevideo.svg' },
  { id: 'audio', label: 'Audio', icon: './icons/ic_add_audio.svg' },
  { id: 'object', label: 'Objek', icon: './icons/ic_add_object_element.svg' },
  { id: 'templates', label: 'Template', icon: './icons/ic_add_templates.svg' }
];

export function AddLayerModal({ isOpen, onClose, onAddLayer, onOpenDrawing }) {
  const [activeTab, setActiveTab] = useState('shape');

  if (!isOpen) return null;

  const handleAddShape = (preset) => {
    const newLayer = {
      id: `layer_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      name: preset.name,
      tag: 'shape',
      shapeType: preset.shapeType,
      shapeParams: { size: [200, 200], radius: 0 },
      fillColor: [0, 1, 0.66, 1],
      fillType: 'color',
      transform: {
        location: { value: [0, 0, 0], kfs: [] },
        scale: { value: [1, 1], kfs: [] },
        rotation: { value: [0], kfs: [] },
        pivot: { value: [0, 0], kfs: [] }
      }
    };
    onAddLayer && onAddLayer(newLayer);
    onClose && onClose();
  };

  const handleAddText = () => {
    const newLayer = {
      id: `text_${Date.now()}`,
      name: 'Teks Baru',
      tag: 'text',
      text: 'Teks Baru',
      fontSize: 28,
      fontFamily: 'Roboto',
      fillColor: [1, 1, 1, 1],
      transform: {
        location: { value: [0, 0, 0], kfs: [] },
        scale: { value: [1, 1], kfs: [] },
        rotation: { value: [0], kfs: [] }
      }
    };
    onAddLayer && onAddLayer(newLayer);
    onClose && onClose();
  };

  const handleMediaUpload = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const isVideo = file.type.startsWith('video');
    const isAudio = file.type.startsWith('audio');
    const url = URL.createObjectURL(file);

    const newLayer = {
      id: `media_${Date.now()}`,
      name: file.name,
      tag: isAudio ? 'audio' : (isVideo ? 'video' : 'image'),
      src: url,
      transform: {
        location: { value: [0, 0, 0], kfs: [] },
        scale: { value: [1, 1], kfs: [] },
        rotation: { value: [0], kfs: [] }
      }
    };
    onAddLayer && onAddLayer(newLayer);
    onClose && onClose();
  };

  return (
    <div
      id="am-add-popup"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9992,
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.65)',
        backdropFilter: 'blur(4px)'
      }}
      onClick={(e) => {
        if (e.target.id === 'am-add-popup') onClose && onClose();
      }}
    >
      <div
        className="am-add-main"
        style={{
          width: 'min(100vw, 760px)',
          height: 280,
          backgroundColor: '#191b27',
          borderRadius: '16px 16px 0 0',
          border: '1px solid rgba(255,255,255,0.1)',
          borderBottom: 0,
          display: 'flex',
          overflow: 'hidden'
        }}
      >
        <div className="am-add-body" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <nav className="am-add-tabs" style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.08)', padding: '0 8px', gap: 4 }}>
            {TABS.map((t) => (
              <button
                key={t.id}
                type="button"
                className={`am-add-tab-item ${activeTab === t.id ? 'active' : ''}`}
                onClick={() => setActiveTab(t.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '10px 14px',
                  background: 'transparent',
                  border: 0,
                  borderBottom: activeTab === t.id ? '2px solid #00ffa8' : '2px solid transparent',
                  color: activeTab === t.id ? '#00ffa8' : '#8c93a7',
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                <img src={t.icon} alt={t.label} style={{ width: 16, height: 16, filter: activeTab === t.id ? 'none' : 'brightness(0) invert(0.6)' }} />
                <span>{t.label}</span>
              </button>
            ))}
          </nav>

          <div id="am-add-content-area" className="am-add-content" style={{ flex: 1, padding: 14, overflowY: 'auto' }}>
            {activeTab === 'shape' && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))', gap: 12 }}>
                {SHAPE_PRESETS.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    className="am-shape-card"
                    onClick={() => handleAddShape(s)}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 6,
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      borderRadius: 10,
                      padding: '10px 6px',
                      cursor: 'pointer'
                    }}
                  >
                    <img src={s.icon} alt={s.name} style={{ width: 36, height: 36 }} onError={(e) => { e.currentTarget.src = './icons/ac_add_shape.svg'; }} />
                    <span style={{ fontSize: 11, color: '#fff' }}>{s.name}</span>
                  </button>
                ))}
              </div>
            )}

            {activeTab === 'media' && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 12 }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#00ffa8', color: '#090a0e', padding: '10px 18px', borderRadius: 8, fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>
                  <img src="./icons/ic_add_imagevideo.svg" alt="" style={{ width: 18, height: 18 }} />
                  <span>Pilih Gambar atau Video</span>
                  <input type="file" accept="image/*,video/*" onChange={handleMediaUpload} style={{ display: 'none' }} />
                </label>
                <span style={{ fontSize: 11, color: '#8c93a7' }}>Mendukung MP4, WebM, PNG, JPG, GIF</span>
              </div>
            )}

            {activeTab === 'audio' && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 12 }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.1)', color: '#fff', padding: '10px 18px', borderRadius: 8, fontWeight: 700, fontSize: 13, cursor: 'pointer', border: '1px solid rgba(255,255,255,0.15)' }}>
                  <img src="./icons/ic_add_audio.svg" alt="" style={{ width: 18, height: 18 }} />
                  <span>Impor Berkas Audio</span>
                  <input type="file" accept="audio/*" onChange={handleMediaUpload} style={{ display: 'none' }} />
                </label>
                <span style={{ fontSize: 11, color: '#8c93a7' }}>Mendukung MP3, WAV, AAC, M4A</span>
              </div>
            )}

            {activeTab === 'object' && (
              <div style={{ display: 'flex', gap: 12 }}>
                <button
                  type="button"
                  onClick={() => {
                    onAddLayer && onAddLayer({ id: `null_${Date.now()}`, name: 'Objek Null', tag: 'null', transform: { location: { value: [0,0,0], kfs: [] } } });
                    onClose && onClose();
                  }}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, padding: 12, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, cursor: 'pointer', color: '#fff' }}
                >
                  <img src="./icons/ic_add_object_element.svg" alt="" style={{ width: 32, height: 32 }} />
                  <span style={{ fontSize: 11 }}>Objek Null</span>
                </button>
              </div>
            )}

            {activeTab === 'templates' && (
              <div style={{ textAlign: 'center', color: '#8c93a7', padding: 24, fontSize: 12 }}>
                Belum ada templat tersimpan
              </div>
            )}
          </div>
        </div>

        <aside className="am-add-quickbar" style={{ width: 72, borderLeft: '1px solid rgba(255,255,255,0.08)', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '10px 0', gap: 12 }}>
          <button
            type="button"
            id="am-btn-quick-draw"
            className="am-quick-item"
            title="Gambar Bebas"
            onClick={() => { onClose && onClose(); onOpenDrawing && onOpenDrawing(); }}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, background: 'transparent', border: 0, color: '#8c93a7', fontSize: 10, cursor: 'pointer' }}
          >
            <img src="./icons/ic_add_freehanddrawing.svg" alt="Drawing" style={{ width: 22, height: 22 }} />
            <span>Gambar</span>
          </button>

          <button
            type="button"
            id="am-btn-quick-text"
            className="am-quick-item"
            title="Teks"
            onClick={handleAddText}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, background: 'transparent', border: 0, color: '#8c93a7', fontSize: 10, cursor: 'pointer' }}
          >
            <img src="./icons/ic_add_text.svg" alt="Text" style={{ width: 22, height: 22 }} />
            <span>Teks</span>
          </button>

          <div style={{ flex: 1 }} />

          <button
            type="button"
            id="am-btn-close-add"
            className="am-quick-close"
            title="Tutup"
            onClick={onClose}
            style={{ background: 'transparent', border: 0, cursor: 'pointer', padding: 6 }}
          >
            <img src="./icons/ic_button_close_add.svg" alt="Close" style={{ width: 24, height: 24 }} />
          </button>
        </aside>
      </div>
    </div>
  );
}

export default AddLayerModal;
