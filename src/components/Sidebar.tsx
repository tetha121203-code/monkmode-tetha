import React from 'react';
import { Icon } from './Icon';

interface SidebarProps {
  tab: string;
  setTab: (tab: string) => void;
  slim: boolean;
  setSlim: React.Dispatch<React.SetStateAction<boolean>>;
  onOpenSettings: () => void;
  onLogout: () => void;
  navItems: Array<{ id: string; n: string; l: string }>;
}

export const Sidebar: React.FC<SidebarProps> = ({
  tab,
  setTab,
  slim,
  setSlim,
  onOpenSettings,
  onLogout,
  navItems
}) => {
  return (
    <div className={`sidebar${slim ? ' slim' : ''}`}>
      <div className="sb-top">
        <div className="sb-logo">
          <Icon name="cpu" size={18} />
        </div>
        {!slim && (
          <div>
            <div className="sb-title">Monk Mode</div>
            <div className="sb-sub">CPNS SKD Mastery</div>
          </div>
        )}
      </div>

      <div className="sb-nav" style={{ marginTop: 8 }}>
        {navItems.map(n => (
          <button
            key={n.id}
            className={`nb${tab === n.id ? ' on' : ''}`}
            onClick={() => setTab(n.id)}
            title={n.l}
            style={{ justifyContent: slim ? 'center' : 'flex-start' }}
          >
            <Icon name={n.n} size={18} />
            {!slim && n.l}
          </button>
        ))}
      </div>

      <div className="sb-foot">
        {!slim && (
          <div style={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: '9px', padding: '10px 12px', marginBottom: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <span style={{ fontSize: '10px', color: 'var(--text3)', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.05em' }}>Cloud Sync</span>
              <span style={{ fontSize: '10px', color: 'var(--blue-hover)', fontWeight: 700 }}>● Active</span>
            </div>
            <div style={{ width: '100%', background: 'rgba(255, 255, 255, 0.08)', height: '3px', borderRadius: '9999px', overflow: 'hidden' }}>
              <div style={{ background: 'var(--blue)', height: '100%', width: '100%' }} />
            </div>
          </div>
        )}

        <button
          className="nb"
          style={{ justifyContent: slim ? 'center' : 'flex-start', color: 'var(--text2)' }}
          onClick={onOpenSettings}
          title="Settings"
        >
          <Icon name="settings" size={18} />
          {!slim && 'Pengaturan'}
        </button>

        <button
          className="nb"
          style={{ justifyContent: slim ? 'center' : 'flex-start' }}
          onClick={() => setSlim(p => !p)}
          title="Toggle sidebar"
        >
          <Icon name={slim ? 'chR' : 'chL'} size={18} />
          {!slim && 'Collapse'}
        </button>

        <button
          className="nb"
          style={{ color: 'var(--red)', justifyContent: slim ? 'center' : 'flex-start' }}
          onClick={onLogout}
          title="Logout"
        >
          <Icon name="logout" size={18} />
          {!slim && 'Keluar Akun'}
        </button>
      </div>
    </div>
  );
};
