import React, { useState, useMemo } from 'react';

const SYSTEM_FONTS = [
  { name: 'Roboto', category: 'Sans-Serif', family: 'Roboto, sans-serif' },
  { name: 'Inter', category: 'Sans-Serif', family: 'Inter, sans-serif' },
  { name: 'Space Grotesk', category: 'Display', family: "'Space Grotesk', sans-serif" },
  { name: 'Montserrat', category: 'Sans-Serif', family: 'Montserrat, sans-serif' },
  { name: 'Poppins', category: 'Sans-Serif', family: 'Poppins, sans-serif' },
  { name: 'Oswald', category: 'Display', family: 'Oswald, sans-serif' },
  { name: 'Playfair Display', category: 'Serif', family: "'Playfair Display', serif" },
  { name: 'Bebas Neue', category: 'Display', family: "'Bebas Neue', cursive" },
  { name: 'Lato', category: 'Sans-Serif', family: 'Lato, sans-serif' },
  { name: 'Open Sans', category: 'Sans-Serif', family: "'Open Sans', sans-serif" },
  { name: 'Cinzel', category: 'Serif', family: 'Cinzel, serif' },
  { name: 'Courier Prime', category: 'Monospace', family: "'Courier Prime', monospace" }
];

export function FontBrowserModal({ isOpen, onClose, onSelectFont }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [customFonts, setCustomFonts] = useState([]);

  const allFonts = useMemo(() => {
    return [...customFonts, ...SYSTEM_FONTS];
  }, [customFonts]);

  const filteredFonts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return allFonts;
    return allFonts.filter((f) => f.name.toLowerCase().includes(q) || f.category.toLowerCase().includes(q));
  }, [allFonts, searchQuery]);

  if (!isOpen) return null;

  const handleImportFont = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    const fontName = file.name.replace(/\.[^/.]+$/, '');
    const reader = new FileReader();
    reader.onload = (event) => {
      const fontFace = new FontFace(fontName, event.target.result);
      fontFace.load().then((loadedFace) => {
        document.fonts.add(loadedFace);
        setCustomFonts((prev) => [
          { name: fontName, category: 'Kustom', family: `"${fontName}", sans-serif` },
          ...prev
        ]);
      }).catch(() => {});
    };
    reader.readAsArrayBuffer(file);
  };

  return (
    <div
      id="am-font-browser-modal"
      className="am-fb-root open"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9996,
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#141620',
        color: '#fff'
      }}
    >
      {/* Top Bar */}
      <div
        className="am-fb-topbar"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          padding: '10px 16px',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          backgroundColor: '#191b27'
        }}
      >
        <button
          type="button"
          id="am-btn-fb-back"
          className="am-fb-back-btn"
          onClick={onClose}
          style={{ background: 'transparent', border: 0, cursor: 'pointer', padding: 4 }}
        >
          <img src="./icons/ac_ic_back.svg" alt="Back" style={{ width: 20, height: 20 }} />
        </button>

        <span className="am-fb-title" style={{ fontSize: 16, fontWeight: 700 }}>Semua Fon</span>

        <div
          className="am-fb-search-wrap"
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            background: 'rgba(0,0,0,0.3)',
            borderRadius: 8,
            padding: '6px 12px',
            border: '1px solid rgba(255,255,255,0.1)'
          }}
        >
          <img src="./icons/ic_search_white_24dp.svg" className="am-fb-search-icon" alt="" style={{ width: 16, height: 16, opacity: 0.6 }} />
          <input
            type="text"
            id="am-fb-search-input"
            className="am-fb-search-input"
            placeholder="Cari fon..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              background: 'transparent',
              border: 0,
              color: '#fff',
              outline: 'none',
              fontSize: 13,
              width: '100%'
            }}
          />
        </div>
      </div>

      {/* Toolbar */}
      <div
        className="am-fb-toolbar"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '8px 16px',
          backgroundColor: 'rgba(255,255,255,0.02)',
          borderBottom: '1px solid rgba(255,255,255,0.05)'
        }}
      >
        <label
          id="am-btn-fb-import"
          className="am-fb-import-btn"
          style={{
            fontSize: 12,
            fontWeight: 600,
            color: '#00ffa8',
            cursor: 'pointer',
            padding: '4px 8px',
            borderRadius: 6,
            background: 'rgba(0,255,168,0.1)'
          }}
        >
          <span>+ Impor Fon (.ttf/.otf)</span>
          <input
            type="file"
            id="am-fb-file-input"
            accept=".ttf,.otf,.woff,.woff2"
            onChange={handleImportFont}
            style={{ display: 'none' }}
          />
        </label>
        <span style={{ fontSize: 11, color: '#8c93a7' }}>{filteredFonts.length} Fon Tersedia</span>
      </div>

      {/* Fonts Grid */}
      <div
        className="am-fb-grid"
        id="am-fb-grid"
        style={{
          flex: 1,
          padding: 16,
          overflowY: 'auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
          gap: 12
        }}
      >
        {filteredFonts.map((font) => (
          <div
            key={font.name}
            className="am-fb-item"
            onClick={() => {
              onSelectFont && onSelectFont(font.name);
              onClose && onClose();
            }}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
              padding: 12,
              borderRadius: 8,
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              cursor: 'pointer',
              transition: 'background 0.15s'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#8c93a7' }}>
              <span>{font.name}</span>
              <span>{font.category}</span>
            </div>
            <div
              style={{
                fontFamily: font.family,
                fontSize: 18,
                color: '#fff',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}
            >
              The quick brown fox
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FontBrowserModal;
