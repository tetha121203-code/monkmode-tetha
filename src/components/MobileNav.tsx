import React from 'react';
import { Icon } from './Icon';

interface MobileNavProps {
  tab: string;
  setTab: (tab: string) => void;
  navItems: Array<{ id: string; n: string; l: string }>;
}

export const MobileNav: React.FC<MobileNavProps> = ({ tab, setTab, navItems }) => {
  return (
    <nav className="mobnav">
      {navItems.map(n => (
        <button
          key={n.id}
          className={`mobbtn${tab === n.id ? ' on' : ''}`}
          onClick={() => setTab(n.id)}
        >
          <Icon name={n.n} size={22} />
          {n.l.split(' ')[0]}
        </button>
      ))}
    </nav>
  );
};
