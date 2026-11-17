import React from 'react';

export default function AddLayerFab({ onClick }) {
  return (
    <button id="am-fab-add" title="Tambah Layer" onClick={onClick}>
      <img src="./icons/add_layer_button.webp" alt="Add Layer" />
    </button>
  );
}
