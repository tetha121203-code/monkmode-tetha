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
        <div className="sb-logo" style={{ background: 'linear-gradient(135deg, #a855f7 0%, #38bdf8 100%)', boxShadow: '0 0 20px rgba(168, 85, 247, 0.5)' }}>
          <Icon name="cpu" size={20} />
        </div>
        {!slim && (
          <div>
            <div className="sb-title">Monk Mode</div>
            <div className="sb-sub">Brutal Transformation</div>
          </div>
        )}
      </div>

      <div className="sb-nav" style={{ marginTop: 10 }}>
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
          <div style={{ background: '#070c1e', border: '1px solid rgba(168, 85, 247, 0.25)', borderRadius: '10px', padding: '12px', marginBottom: '8px', boxShadow: '0 0 15px rgba(168, 85, 247, 0.15)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <span style={{ fontSize: '10px', color: '#a855f7', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.05em' }}>Firestore Cloud Sync</span>
              <span style={{ fontSize: '10px', color: '#00f0ff', fontWeight: 700, textShadow: '0 0 8px rgba(0, 240, 255, 0.6)' }}>● Connected</span>
            </div>
            <div style={{ width: '100%', background: 'rgba(255, 255, 255, 0.08)', height: '4px', borderRadius: '9999px', overflow: 'hidden' }}>
              <div style={{ background: 'linear-gradient(90deg, #a855f7 0%, #38bdf8 100%)', height: '100%', width: '100%' }} />
            </div>
          </div>
        )}

        <button
          className="nb"
          style={{ justifyContent: slim ? 'center' : 'flex-start', color: '#94a3b8' }}
          onClick={onOpenSettings}
          title="Settings"
        >
          <Icon name="settings" size={18} />
          {!slim && 'Settings'}
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
          style={{ color: '#f43f5e', justifyContent: slim ? 'center' : 'flex-start' }}
          onClick={onLogout}
          title="Logout"
        >
          <Icon name="logout" size={18} />
          {!slim && 'Disconnect'}
        </button>
      </div>
    </div>
  );
};
