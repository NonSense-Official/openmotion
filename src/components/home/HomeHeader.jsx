import React from 'react';

export default function HomeHeader({ onMenuClick, onProfileClick, children }) {
  return (
    <header className="am-home-header">
      <div className="am-home-topbar">
        <button
          id="am-home-btn-menu"
          className="am-home-btn"
          title="Menu"
          type="button"
          onClick={onMenuClick}
        >
          <img src="/icons/ac_ic_hamburger_menu.svg" alt="Menu" />
        </button>

        <div className="am-home-logo-wrap">
          <img
            src="/icons/ac_openmotion_logo_white.svg"
            alt="Open Motion"
            className="am-home-logo-svg"
          />
        </div>

        <button
          id="am-home-btn-profile"
          className="am-home-btn"
          title="Profil"
          type="button"
          onClick={onProfileClick}
        >
          <img src="/icons/ic_account_nologin_profile.svg" alt="Profil" />
        </button>
      </div>

      {children}
    </header>
  );
}
