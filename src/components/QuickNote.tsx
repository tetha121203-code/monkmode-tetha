import React, { useState, useEffect } from 'react';
import { Icon } from './Icon';

interface QuickNoteProps {
  value: string;
  onChange: (val: string) => void;
  onCopyToDiary?: (text: string) => void;
}

export const QuickNote: React.FC<QuickNoteProps> = ({
  value,
  onChange,
  onCopyToDiary
}) => {
  const [isMinimized, setIsMinimized] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [savedStatus, setSavedStatus] = useState<string>('Tersimpan');

  // Local state for smooth typing response
  const [text, setText] = useState<string>(value || '');

  useEffect(() => {
    setText(value || '');
  }, [value]);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setText(val);
    setSavedStatus('Menyimpan...');
    onChange(val);
    setTimeout(() => {
      setSavedStatus('Tersimpan');
    }, 450);
  };

  const handleCopy = () => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    if (text && window.confirm('Hapus catatan Quick Note ini?')) {
      setText('');
      onChange('');
    }
  };

  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  const charCount = text.length;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 24,
        right: 24,
        zIndex: 9000,
        width: isMinimized ? 'auto' : 350,
        maxWidth: 'calc(100vw - 48px)',
        transition: 'all 0.28s cubic-bezier(0.16, 1, 0.3, 1)'
      }}
    >
      {isMinimized ? (
        <button
          onClick={() => setIsMinimized(false)}
          className="pop-in"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '12px 20px',
            borderRadius: 9999,
            background: 'linear-gradient(135deg, rgba(9, 16, 38, 0.95) 0%, rgba(27, 17, 61, 0.95) 100%)',
            border: '1px solid rgba(96, 165, 250, 0.45)',
            color: '#ffffff',
            boxShadow: '0 12px 36px rgba(0, 0, 0, 0.85), 0 0 24px rgba(59, 130, 246, 0.35)',
            cursor: 'pointer',
            fontWeight: 800,
            fontSize: 13,
            backdropFilter: 'blur(16px)',
            transition: 'all 0.22s ease'
          }}
          title="Buka Quick Note"
        >
          <span style={{ color: 'var(--cyan)', display: 'flex', alignItems: 'center' }}>
            <Icon name="note" size={18} className="pulse-glow" />
          </span>
          <span>Quick Note</span>
          {charCount > 0 && (
            <span
              style={{
                fontSize: 10,
                background: 'rgba(56, 189, 248, 0.22)',
                color: 'var(--cyan)',
                padding: '2px 8px',
                borderRadius: 12,
                border: '1px solid rgba(56, 189, 248, 0.4)',
                fontWeight: 900
              }}
            >
              {wordCount} kata
            </span>
          )}
        </button>
      ) : (
        <div
          className="pop-in"
          style={{
            background: 'linear-gradient(135deg, rgba(9, 16, 38, 0.95) 0%, rgba(22, 14, 46, 0.95) 100%)',
            border: '1px solid rgba(96, 165, 250, 0.4)',
            borderRadius: 18,
            boxShadow: '0 24px 60px rgba(0, 0, 0, 0.9), 0 0 30px rgba(59, 130, 246, 0.25), 0 0 40px rgba(139, 92, 246, 0.18)',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            backdropFilter: 'blur(20px)'
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: '13px 18px',
              background: 'rgba(5, 9, 22, 0.85)',
              borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ color: 'var(--cyan)', display: 'flex', alignItems: 'center' }}>
                <Icon name="note" size={17} />
              </span>
              <span style={{ fontSize: 13, fontWeight: 900, color: '#ffffff', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                Quick Note
              </span>
              <span
                style={{
                  fontSize: 10,
                  color: savedStatus === 'Tersimpan' ? 'var(--green-hover)' : 'var(--amber)',
                  fontWeight: 700,
                  marginLeft: 4,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4
                }}
              >
                <span className="glow-dot" style={{ width: 6, height: 6, background: savedStatus === 'Tersimpan' ? 'var(--green-hover)' : 'var(--amber)' }} />
                {savedStatus}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              {text && (
                <button
                  onClick={handleCopy}
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: copied ? 'var(--green)' : 'var(--text2)',
                    cursor: 'pointer',
                    padding: 5,
                    display: 'flex',
                    alignItems: 'center',
                    borderRadius: 6
                  }}
                  title={copied ? 'Tersalin!' : 'Salin Catatan'}
                >
                  <Icon name={copied ? 'check' : 'copy'} size={14} />
                </button>
              )}
              <button
                onClick={() => setIsMinimized(true)}
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: 'var(--text2)',
                  cursor: 'pointer',
                  padding: 5,
                  display: 'flex',
                  alignItems: 'center',
                  borderRadius: 6
                }}
                title="Kecilkan Window"
              >
                <Icon name="min" size={16} />
              </button>
            </div>
          </div>

          {/* Body Textarea */}
          <div style={{ padding: 14 }}>
            <textarea
              value={text}
              onChange={handleTextChange}
              placeholder="Catat ide, insight belajar, rumus, atau catatan penting saat deep work..."
              rows={5}
              style={{
                width: '100%',
                background: 'rgba(14, 23, 53, 0.85)',
                border: '1px solid rgba(59, 130, 246, 0.25)',
                borderRadius: 12,
                color: '#ffffff',
                padding: '12px 14px',
                fontSize: 13,
                lineHeight: 1.6,
                fontFamily: 'inherit',
                resize: 'none',
                outline: 'none',
                transition: 'all 0.2s'
              }}
              onFocus={e => {
                e.target.style.borderColor = 'var(--cyan)';
                e.target.style.boxShadow = '0 0 16px rgba(56, 189, 248, 0.3)';
              }}
              onBlur={e => {
                e.target.style.borderColor = 'rgba(59, 130, 246, 0.25)';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>

          {/* Footer Controls */}
          <div
            style={{
              padding: '10px 16px 14px 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderTop: '1px solid rgba(255, 255, 255, 0.06)',
              fontSize: 11,
              color: 'var(--text3)'
            }}
          >
            <span>{charCount} karakter ({wordCount} kata)</span>
            <div style={{ display: 'flex', gap: 8 }}>
              {text && onCopyToDiary && (
                <button
                  onClick={() => onCopyToDiary(text)}
                  className="btn btn-purple"
                  style={{
                    padding: '5px 12px',
                    fontSize: 11,
                    fontWeight: 800,
                    borderRadius: 8
                  }}
                  title="Simpan ide ini ke Diary"
                >
                  + ke Diary
                </button>
              )}
              {text && (
                <button
                  onClick={handleClear}
                  className="btn btn-ghost"
                  style={{
                    padding: '5px 10px',
                    fontSize: 11,
                    fontWeight: 700,
                    borderRadius: 8,
                    color: 'var(--red-hover)',
                    borderColor: 'var(--red-dim)'
                  }}
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
