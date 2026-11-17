import React from 'react';

export function getAspectClass(w, h) {
  if (!w || !h) return '9-16';
  const r = w / h;
  if (Math.abs(r - 16 / 9) < 0.15) return '16-9';
  if (Math.abs(r - 9 / 16) < 0.15) return '9-16';
  if (Math.abs(r - 4 / 5) < 0.15) return '4-5';
  if (Math.abs(r - 1) < 0.15) return '1-1';
  if (Math.abs(r - 4 / 3) < 0.15) return '4-3';
  return r > 1 ? '16-9' : '9-16';
}

function getResolutionLabel(h) {
  if (h >= 1080) return '1080p FHD';
  if (h >= 720) return '720p HD';
  return `${h}p`;
}

function formatDate(date) {
  if (!date) return 'Baru saja';
  try {
    return new Date(date).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  } catch {
    return 'Baru saja';
  }
}

export default function ProjectCard({ project, onOpen, onDelete }) {
  const title = project.name || project.id || 'Proyek Tanpa Judul';
  const w = project.width || 720;
  const h = project.height || 1280;
  const aspectClass = getAspectClass(w, h);
  const resLabel = getResolutionLabel(h);
  const dateStr = formatDate(project.updatedAt || project.createdAt);

  return (
    <div
      className="am-project-card"
      onClick={() => onOpen(project)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onOpen(project);
        }
      }}
    >
      <div className="am-project-thumb">
        <div className={`am-project-canvas-preview ratio-${aspectClass}`}>
          {project.thumb ? (
            <img src={project.thumb} alt={title} loading="lazy" />
          ) : (
            <div className="am-project-thumb-placeholder">
              <img src="/icons/ac_projectlist_projects.svg" alt="Project" />
            </div>
          )}
        </div>
        <span className="am-project-thumb-tag">{resLabel}</span>
      </div>

      <div className="am-project-meta">
        <div className="am-project-name" title={title}>
          {title}
        </div>
        <div className="am-project-details-row">
          <div className="am-project-details">
            {project.hasPassword ? '🔒 ' : ''}
            {w}×{h} • {dateStr}
          </div>
          <button
            className="am-project-del"
            title="Hapus Proyek"
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(project.id);
            }}
          >
            <img src="/icons/ac_ic_delete.svg" alt="Hapus" />
          </button>
        </div>
      </div>
    </div>
  );
}
