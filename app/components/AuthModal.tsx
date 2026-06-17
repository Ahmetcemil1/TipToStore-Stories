'use client';

import { useState } from 'react';

interface AuthModalProps {
  onClose: () => void;
  onLoginSuccess: (user: { username: string; email: string; avatar: string; bio: string; walletAddress: string }) => void;
  showToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

const AVATARS = ['✍️', '🧊', '🎵', '🌊', '📡', '🖊️', '🦊', '🎨', '🚀', '🧙‍♂️'];

export function AuthModal({ onClose, onLoginSuccess, showToast }: AuthModalProps) {
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [bio, setBio] = useState('');
  const [avatar, setAvatar] = useState(AVATARS[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      showToast('Please fill in email and password.', 'error');
      return;
    }

    if (isRegister) {
      if (!username) {
        showToast('Please choose a username.', 'error');
        return;
      }

      // Read existing users
      const usersRaw = localStorage.getItem('tiptostore_users');
      const users = usersRaw ? JSON.parse(usersRaw) : [];

      // Check if user already exists
      if (users.find((u: any) => u.email === email || u.username === username)) {
        showToast('Username or Email already registered.', 'error');
        return;
      }

      // Create fake wallet address for the registered user
      const fakeWallet = `0x${Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`;

      const newUser = {
        username,
        email,
        password,
        avatar,
        bio: bio || 'No bio written yet.',
        walletAddress: fakeWallet,
      };

      users.push(newUser);
      localStorage.setItem('tiptostore_users', JSON.stringify(users));
      localStorage.setItem('tiptostore_session', JSON.stringify(newUser));

      showToast(`🎉 Registration successful! Welcome, ${username}.`, 'success');
      onLoginSuccess(newUser);
      onClose();
    } else {
      // Login flow
      const usersRaw = localStorage.getItem('tiptostore_users');
      const users = usersRaw ? JSON.parse(usersRaw) : [];

      const foundUser = users.find((u: any) => u.email === email && u.password === password);

      if (!foundUser) {
        showToast('Invalid email or password.', 'error');
        return;
      }

      localStorage.setItem('tiptostore_session', JSON.stringify(foundUser));
      showToast(`👋 Welcome back, ${foundUser.username}!`, 'success');
      onLoginSuccess(foundUser);
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="w-full max-w-md rounded-2xl p-6 border border-[var(--border-subtle)] shadow-xl animate-fade-in-up bg-[var(--bg-card)]">
        {/* Header */}
        <div className="flex justify-between items-start mb-5">
          <div>
            <h3 className="text-xl font-bold font-serif text-[var(--text-primary)]">
              {isRegister ? 'Create Account' : 'Sign In'}
            </h3>
            <p className="text-xs text-[var(--text-secondary)] mt-0.5">
              {isRegister ? 'Join our decentralized publishing ecosystem' : 'Sign in to access your author profile'}
            </p>
          </div>
          <button onClick={onClose} className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors text-xl leading-none p-1">✕</button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <div>
              <label className="block text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-1">Username</label>
              <input
                type="text"
                placeholder="Choose username…"
                value={username}
                onChange={e => setUsername(e.target.value)}
                className="w-full px-4 py-2 text-sm rounded-xl border border-[var(--border-strong)] text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-forest)] transition-all bg-[var(--bg-primary)]"
                required
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-1">Email Address</label>
            <input
              type="email"
              placeholder="Enter email…"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full px-4 py-2 text-sm rounded-xl border border-[var(--border-strong)] text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-forest)] transition-all bg-[var(--bg-primary)]"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-1">Password</label>
            <input
              type="password"
              placeholder="Enter password…"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full px-4 py-2 text-sm rounded-xl border border-[var(--border-strong)] text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-forest)] transition-all bg-[var(--bg-primary)]"
              required
            />
          </div>

          {isRegister && (
            <>
              <div>
                <label className="block text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-1">Short Bio</label>
                <input
                  type="text"
                  placeholder="Tell readers about yourself…"
                  value={bio}
                  onChange={e => setBio(e.target.value)}
                  className="w-full px-4 py-2 text-sm rounded-xl border border-[var(--border-strong)] text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-forest)] transition-all bg-[var(--bg-primary)]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-2">Select Avatar</label>
                <div className="flex flex-wrap gap-2">
                  {AVATARS.map(av => (
                    <button
                      key={av}
                      type="button"
                      onClick={() => setAvatar(av)}
                      className={`w-10 h-10 rounded-xl text-xl flex items-center justify-center border transition-all ${avatar === av ? 'border-[var(--accent-forest)] bg-[var(--accent-forest)]/10 scale-105 shadow-sm' : 'border-[var(--border-strong)] hover:border-[var(--text-secondary)] bg-[var(--bg-card)]'}`}
                    >
                      {av}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          <button
            type="submit"
            className="w-full py-3 rounded-xl font-bold text-sm text-white btn-primary mt-2"
          >
            {isRegister ? 'Register' : 'Sign In'}
          </button>
        </form>

        <div className="divider my-4" />

        <p className="text-center text-xs text-[var(--text-secondary)]">
          {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button
            onClick={() => setIsRegister(!isRegister)}
            className="text-[var(--accent-forest)] font-bold hover:underline"
          >
            {isRegister ? 'Sign In' : 'Register Now'}
          </button>
        </p>
      </div>
    </div>
  );
}
