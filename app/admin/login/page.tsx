'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    setLoading(false);

    if (error) {
      setErrorMsg('Wrong email or password. Try again.');
      return;
    }

    router.push('/admin/dashboard');
    router.refresh();
  };

  return (
    <div className="login-wrap">
      <div className="panel login-card">
        <p className="eyebrow">✦ whimsiverse ✦</p>
        <h1 style={{ fontSize: '1.6rem', marginBottom: '1.5rem' }}>
          Admin <span className="c-yellow">Login</span>
        </h1>
        <form onSubmit={handleSubmit} className="stack">
          <div className="field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </div>
          <div className="field" style={{ marginBottom: 0 }}>
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </div>
          {errorMsg && <p className="error-text">{errorMsg}</p>}
          <button type="submit" className="btn btn-fill" disabled={loading} style={{ marginTop: '0.5rem' }}>
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  );
}
