import React, { useRef } from 'react';

export default function MediaFillSection({ layer, mediaScaleMode, onScaleModeChange, onMediaUpload }) {
  const fileInputRef = useRef(null);

  const mediaSrc = layer.mediaUrl || layer.src || '';
  const hasMedia = Boolean(mediaSrc || layer.fillImage || layer.fillVideo);
  const isVideo = Boolean(layer.fillVideo || (layer.mediaUrl && /\.(mp4|webm|mov)$/i.test(layer.mediaUrl)));
  const mediaTitle = layer.fillImage || layer.fillVideo || layer.label || 'Media lokal';

  const handleChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      onMediaUpload(file);
    }
  };

  return (
    <div className="am-cf-media-box">
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        accept="image/*,video/*"
        onChange={handleChange}
      />
      {hasMedia ? (
        <>
          <div className="am-cf-media-preview-card">
            {isVideo ? (
              <video
                src={mediaSrc}
                autoPlay
                muted
                loop
                style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }}
              />
            ) : (
              <img
                src={mediaSrc}
                alt="Preview"
                style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }}
              />
            )}
            <div
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                background: 'linear-gradient(transparent, rgba(0,0,0,0.85))',
                padding: '8px 10px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: '#fff',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  maxWidth: 200
                }}
              >
                {mediaTitle}
              </span>
              <span
                style={{
                  fontSize: 10,
                  padding: '2px 6px',
                  borderRadius: 4,
                  background: 'rgba(0,255,168,0.2)',
                  color: 'var(--am-y1)',
                  fontWeight: 700
                }}
              >
                {isVideo ? 'VIDEO' : 'GAMBAR'}
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 8 }}>
            <button
              type="button"
              id="am-cf-change-media-btn"
              className="am-grid-btn"
              style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', height: 42 }}
              onClick={() => fileInputRef.current?.click()}
            >
              <img src="./icons/ic_tab_media.svg" alt="Media" style={{ width: 18, height: 18 }} />
              <span>Ganti Media</span>
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--am-p5)', textTransform: 'uppercase' }}>
              Skala Media
            </span>
            <div className="am-cf-media-actions">
              <button
                type="button"
                className={`am-cf-crop-btn ${mediaScaleMode === 'fill' ? 'active' : ''}`}
                onClick={() => onScaleModeChange('fill')}
              >
                Fill (Isi)
              </button>
              <button
                type="button"
                className={`am-cf-crop-btn ${mediaScaleMode === 'fit' ? 'active' : ''}`}
                onClick={() => onScaleModeChange('fit')}
              >
                Fit (Pas)
              </button>
              <button
                type="button"
                className={`am-cf-crop-btn ${mediaScaleMode === 'stretch' ? 'active' : ''}`}
                onClick={() => onScaleModeChange('stretch')}
              >
                Stretch (Regang)
              </button>
            </div>
          </div>
        </>
      ) : (
        <div
          style={{
            background: '#181b2a',
            border: '2px dashed rgba(255,255,255,0.1)',
            borderRadius: 12,
            padding: '30px 20px',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 12
          }}
        >
          <img src="./icons/ic_tab_media.svg" alt="Media" style={{ width: 40, height: 40, opacity: 0.6 }} />
          <div style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>Belum Ada Media Dipilih</div>
          <div style={{ fontSize: 11, color: '#8c93a7' }}>
            Pilih gambar atau video dari perangkat Anda untuk mengisi layer ini.
          </div>
          <button
            type="button"
            id="am-cf-change-media-btn"
            className="am-grid-btn"
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              height: 42,
              width: '100%',
              maxWidth: 240,
              marginTop: 6
            }}
            onClick={() => fileInputRef.current?.click()}
          >
            <img src="./icons/ic_tab_media.svg" alt="Media" style={{ width: 18, height: 18 }} />
            <span>Pilih Foto / Video</span>
          </button>
        </div>
      )}
    </div>
  );
}
