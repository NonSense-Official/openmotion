import React, { memo } from 'react';
import TrackItem from './TrackItem';

function TrackList({
  layers = [],
  scale,
  totalTime
}) {
  if (!layers.length) {
    return (
      <div id="timeline-tracks">
        <div className="empty">Scene ini tidak punya layer.</div>
      </div>
    );
  }

  const reversed = [...layers].reverse();

  return (
    <div id="timeline-tracks">
      {reversed.map((layer, idx) => (
        <TrackItem
          key={layer.id || idx}
          layer={layer}
          index={layers.length - 1 - idx}
          scale={scale}
          totalTime={totalTime}
        />
      ))}
    </div>
  );
}

export default memo(TrackList);
