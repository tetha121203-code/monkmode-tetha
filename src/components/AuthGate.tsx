import React, { useState } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { Icon } from './Icon';

interface AuthGateProps {
  onLogin: (uid: string) => void;
}

export const AuthGate: React.FC<AuthGateProps> = ({ onLogin }) => {
  const [usernameInput, setUsernameInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanId = usernameInput.trim().toLowerCase().replace(/[^a-z0-9_]/g, '');
    if (!cleanId || cleanId.length < 3) {
      setErrorMsg('Minimal 3 karakter alfanumerik.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      const userRef = doc(db, 'users', cleanId);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        await setDoc(userRef, {
          username: cleanId,
          createdAt: new Date().toISOString(),
          lastActive: new Date().toISOString()
        });
      } else {
        await setDoc(userRef, { lastActive: new Date().toISOString() }, { merge: true });
      }

      onLogin(cleanId);
    } catch (err: any) {
      console.error('Login error:', err);
      setErrorMsg('Gagal terhubung ke database. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrap">
      <div className="auth-box fade-up">
        <div className="auth-logo red-glow">
          <Icon name="cpu" size={28} />
        </div>
        <h1 className="auth-h1">Brutal Transformation</h1>
        <p className="auth-tagline">
          81 Hari Monk Mode Protocol<br />12 Okt → 31 Des 2026 (Akhir Tahun 2026)
        </p>

        <form className="auth-form" onSubmit={submit}>
          {errorMsg && (
            <div
              style={{
                background: 'var(--red-dim)',
                border: '1px solid rgba(244,63,94,0.3)',
                borderRadius: 12,
                padding: '12px 16px',
                fontSize: 13,
                color: 'var(--red)'
              }}
            >
              {errorMsg}
            </div>
          )}

          <div>
            <span className="label">Akses ID Protokol</span>
            <input
              value={usernameInput}
              onChange={(e) => setUsernameInput(e.target.value.replace(/[^a-zA-Z0-9_]/g, ''))}
              className="inp"
              placeholder="Masukkan ID Protokol..."
              maxLength={30}
              autoCapitalize="none"
              autoComplete="off"
            />
          </div>

          <button
            type="submit"
            className="btn btn-red btn-lg"
            style={{ width: '100%', marginTop: 8 }}
            disabled={loading || usernameInput.trim().length < 3}
          >
            {loading ? (
              <span className="spin-it">
                <Icon name="loader" />
              </span>
            ) : (
              <Icon name="lock" />
            )}
            {loading ? 'Inisiasi Protocol...' : 'Mulai Eksekusi'}
          </button>
        </form>
      </div>
    </div>
  );
};
