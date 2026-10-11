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
    <aside className={`sidebar${slim ? ' slim' : ''}`}>
      <div className="sb-top">
        <div className="sb-logo">
          <Icon name="cpu" size={20} />
        </div>
        {!slim && (
          <div>
            <div className="sb-title">MONK MODE</div>
            <div className="sb-sub" style={{ color: 'var(--purple-light)', letterSpacing: '0.08em' }}>
              MONK PROTOCOL • AKHIR 2026
            </div>
          </div>
        )}
      </div>

      <nav className="sb-nav">
        {navItems.map(n => {
          const isActive = tab === n.id;
          return (
            <button
              key={n.id}
              className={`nb${isActive ? ' on' : ''}`}
              onClick={() => setTab(n.id)}
              title={n.l}
              style={{ justifyContent: slim ? 'center' : 'flex-start' }}
            >
              <span style={{ 
                color: isActive ? 'var(--cyan)' : 'var(--text3)', 
                display: 'flex', 
                alignItems: 'center',
                filter: isActive ? 'drop-shadow(0 0 8px rgba(56, 189, 248, 0.6))' : 'none',
                transition: 'all 0.2s ease'
              }}>
                <Icon name={n.n} size={19} />
              </span>
              {!slim && <span>{n.l}</span>}
            </button>
          );
        })}
      </nav>

      <div className="sb-foot">
        {!slim && (
          <div 
            style={{ 
              background: 'linear-gradient(135deg, rgba(14, 23, 53, 0.75) 0%, rgba(27, 17, 61, 0.75) 100%)', 
              border: '1px solid rgba(96, 165, 250, 0.25)', 
              borderRadius: '12px', 
              padding: '12px 14px', 
              marginBottom: '10px',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.35)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '10px', color: 'var(--text3)', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.06em' }}>
                FIRESTORE LIVE
              </span>
              <span style={{ fontSize: '10px', color: 'var(--cyan)', fontWeight: 800, display: 'flex', alignItems: 'center', gap: 5 }}>
                <span className="glow-dot" style={{ background: 'var(--cyan)' }} /> SYNCED
              </span>
            </div>
            <div style={{ width: '100%', background: 'rgba(255, 255, 255, 0.08)', height: '4px', borderRadius: '9999px', overflow: 'hidden' }}>
              <div 
                style={{ 
                  background: 'linear-gradient(90deg, #3b82f6, #8b5cf6, #38bdf8)', 
                  height: '100%', 
                  width: '100%',
                  boxShadow: '0 0 10px rgba(59, 130, 246, 0.8)' 
                }} 
              />
            </div>
          </div>
        )}

        <button
          className="nb"
          style={{ justifyContent: slim ? 'center' : 'flex-start', color: 'var(--text2)' }}
          onClick={onOpenSettings}
          title="Pengaturan Silabus & Jadwal"
        >
          <Icon name="settings" size={18} />
          {!slim && 'Pengaturan'}
        </button>

        <button
          className="nb"
          style={{ justifyContent: slim ? 'center' : 'flex-start' }}
          onClick={() => setSlim(p => !p)}
          title={slim ? 'Buka Sidebar' : 'Kecilkan Sidebar'}
        >
          <Icon name={slim ? 'chR' : 'chL'} size={18} />
          {!slim && 'Collapse'}
        </button>

        <button
          className="nb"
          style={{ color: 'var(--red-hover)', justifyContent: slim ? 'center' : 'flex-start' }}
          onClick={onLogout}
          title="Keluar dari Akun"
        >
          <Icon name="logout" size={18} />
          {!slim && 'Keluar Akun'}
        </button>
      </div>
    </aside>
  );
};
