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
    }, 500);
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
        width: isMinimized ? 'auto' : 340,
        maxWidth: 'calc(100vw - 48px)',
        transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
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
            padding: '12px 18px',
            borderRadius: 9999,
            background: '#0b1120',
            border: '1px solid rgba(56, 189, 248, 0.35)',
            color: '#ffffff',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.8), 0 0 20px rgba(56, 189, 248, 0.2)',
            cursor: 'pointer',
            fontWeight: 800,
            fontSize: 13,
            backdropFilter: 'blur(12px)'
          }}
          title="Buka Quick Note"
        >
          <span style={{ color: '#38bdf8', display: 'flex', alignItems: 'center' }}>
            <Icon name="note" size={18} />
          </span>
          <span>Quick Note</span>
          {charCount > 0 && (
            <span
              style={{
                fontSize: 10,
                background: 'rgba(56, 189, 248, 0.2)',
                color: '#38bdf8',
                padding: '2px 8px',
                borderRadius: 12,
                border: '1px solid rgba(56, 189, 248, 0.3)',
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
            background: '#0b1120',
            border: '1px solid rgba(56, 189, 248, 0.3)',
            borderRadius: 16,
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.9), 0 0 25px rgba(56, 189, 248, 0.15)',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            backdropFilter: 'blur(16px)'
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: '12px 16px',
              background: '#080d1a',
              borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ color: '#38bdf8', display: 'flex', alignItems: 'center' }}>
                <Icon name="note" size={16} />
              </span>
              <span style={{ fontSize: 13, fontWeight: 900, color: '#ffffff', letterSpacing: '0.02em', textTransform: 'uppercase' }}>
                Quick Note
              </span>
              <span
                style={{
                  fontSize: 10,
                  color: savedStatus === 'Tersimpan' ? '#22c55e' : '#f59e0b',
                  fontWeight: 700,
                  marginLeft: 4
                }}
              >
                • {savedStatus}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              {text && (
                <button
                  onClick={handleCopy}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: copied ? '#22c55e' : '#94a3b8',
                    cursor: 'pointer',
                    padding: 4,
                    display: 'flex',
                    alignItems: 'center',
                    borderRadius: 4
                  }}
                  title={copied ? 'Tersalin!' : 'Salin Catatan'}
                >
                  <Icon name={copied ? 'check' : 'copy'} size={14} />
                </button>
              )}
              <button
                onClick={() => setIsMinimized(true)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#cbd5e1',
                  cursor: 'pointer',
                  padding: 4,
                  display: 'flex',
                  alignItems: 'center',
                  borderRadius: 4
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
              placeholder="Catat ide, insight, atau distraksi saat deep work agar tidak lupa..."
              rows={5}
              style={{
                width: '100%',
                background: '#101728',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: 10,
                color: '#ffffff',
                padding: '12px',
                fontSize: 13,
                lineHeight: 1.6,
                fontFamily: 'inherit',
                resize: 'none',
                outline: 'none',
                transition: 'border-color 0.2s'
              }}
              onFocus={e => (e.target.style.borderColor = 'rgba(56, 189, 248, 0.4)')}
              onBlur={e => (e.target.style.borderColor = 'rgba(255, 255, 255, 0.08)')}
            />
          </div>

          {/* Footer Controls */}
          <div
            style={{
              padding: '8px 14px 12px 14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderTop: '1px solid rgba(255, 255, 255, 0.05)',
              fontSize: 11,
              color: '#64748b'
            }}
          >
            <span>{charCount} karakter ({wordCount} kata)</span>
            <div style={{ display: 'flex', gap: 8 }}>
              {text && onCopyToDiary && (
                <button
                  onClick={() => onCopyToDiary(text)}
                  style={{
                    background: 'rgba(168, 85, 247, 0.15)',
                    border: '1px solid rgba(168, 85, 247, 0.3)',
                    color: '#c084fc',
                    borderRadius: 6,
                    padding: '4px 8px',
                    fontSize: 11,
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                  title="Simpan ide ini ke Diary"
                >
                  + ke Diary
                </button>
              )}
              {text && (
                <button
                  onClick={handleClear}
                  style={{
                    background: 'transparent',
                    border: '1px solid rgba(244, 63, 94, 0.2)',
                    color: '#f43f5e',
                    borderRadius: 6,
                    padding: '4px 8px',
                    fontSize: 11,
                    fontWeight: 700,
                    cursor: 'pointer'
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
