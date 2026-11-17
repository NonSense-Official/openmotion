import React, { useRef, useState, useLayoutEffect } from 'react';

const TABS = [
  { id: 'tutorial', label: 'Tutorial', icon: '/icons/ic_tutorial_button.svg' },
  { id: 'projects', label: 'Proyek', icon: '/icons/ac_projectlist_projects.svg' },
  { id: 'elements', label: 'Elemen', icon: '/icons/ac_projectlist_elements.svg' }
];

export default function HomeTabs({ activeTab, onTabChange }) {
  const tabRefs = useRef({});
  const [indicatorStyle, setIndicatorStyle] = useState({});

  useLayoutEffect(() => {
    const updateIndicator = () => {
      const activeEl = tabRefs.current[activeTab];
      if (activeEl) {
        setIndicatorStyle({
          left: `${activeEl.offsetLeft}px`,
          width: `${activeEl.offsetWidth}px`
        });
      }
    };

    updateIndicator();
    window.addEventListener('resize', updateIndicator);
    return () => window.removeEventListener('resize', updateIndicator);
  }, [activeTab]);

  return (
    <nav className="am-home-tabs" id="am-home-tabs">
      {TABS.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            ref={(el) => { tabRefs.current[tab.id] = el; }}
            className={`am-home-tab ${isActive ? 'active' : ''}`}
            data-tab={tab.id}
            type="button"
            onClick={() => onTabChange(tab.id)}
          >
            <img src={tab.icon} alt={tab.label} />
            <span>{tab.label}</span>
          </button>
        );
      })}
      <div
        className="am-home-tab-indicator"
        id="am-home-tab-indicator"
        style={indicatorStyle}
      />
    </nav>
  );
}
