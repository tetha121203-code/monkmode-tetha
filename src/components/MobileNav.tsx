import React from 'react';
import { Icon } from './Icon';

interface MobileNavProps {
  tab: string;
  setTab: (tab: string) => void;
  navItems: Array<{ id: string; n: string; l: string }>;
}

export const MobileNav: React.FC<MobileNavProps> = ({ tab, setTab, navItems }) => {
  return (
    <nav className="mobnav" aria-label="Mobile Navigation">
      {navItems.map(n => {
        const isActive = tab === n.id;
        return (
          <button
            key={n.id}
            className={`mobbtn${isActive ? ' on' : ''}`}
            onClick={() => setTab(n.id)}
            aria-label={n.l}
          >
            <span 
              style={{ 
                display: 'flex', 
                alignItems: 'center',
                color: isActive ? 'var(--cyan)' : 'var(--text3)',
                filter: isActive ? 'drop-shadow(0 0 8px rgba(56, 189, 248, 0.7))' : 'none',
                transform: isActive ? 'scale(1.1)' : 'scale(1)',
                transition: 'all 0.22s ease'
              }}
            >
              <Icon name={n.n} size={20} />
            </span>
            <span style={{ fontSize: 10, fontWeight: isActive ? 800 : 600 }}>
              {n.l.split(' ')[0]}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
