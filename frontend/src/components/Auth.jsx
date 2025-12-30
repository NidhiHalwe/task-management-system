import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth as authAPI } from '../services/api';
import { saveToken } from '../services/auth';
import '../styles.css';

export default function Auth() {
  const [mode, setMode] = useState('signin'); // 'signin' | 'signup'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const nav = useNavigate();

  const switchMode = (m) => {
    setErr(null);
    setMode(m);
  };

  const submit = async (e) => {
    e.preventDefault();
    setErr(null);
    try {
      if (mode === 'signup') {
        const res = await authAPI.register({ name, email, password });
        saveToken(res.data.token);
        nav('/');
      } else {
        const res = await authAPI.login({ email, password });
        saveToken(res.data.token);
        nav('/');
      }
    } catch (error) {
      setErr(error.response?.data?.msg || (error.response?.data?.errors && error.response.data.errors[0].msg) || 'Authentication failed');
    }
  };

  return (
    <div className="auth-outer">
      <div className="auth-box">
        <div className="auth-brand">
          <div className="logo">✓</div>
          <h1>TaskFlow</h1>
        </div>

        <div className="auth-card">
          <h2>Welcome</h2>
          <p className="subtitle">Sign in to manage your tasks efficiently</p>

          <div className="tab-row">
            <button className={`tab ${mode === 'signin' ? 'active' : ''}`} onClick={() => switchMode('signin')}>Sign In</button>
            <button className={`tab ${mode === 'signup' ? 'active' : ''}`} onClick={() => switchMode('signup')}>Sign Up</button>
          </div>

          {err && <div className="error">{err}</div>}

          <form className="auth-form" onSubmit={submit}>
            {mode === 'signup' && (
              <>
                <label>Full Name</label>
                <input value={name} onChange={(e) => setName(e.target.value)} placeholder="John Doe" required />
              </>
            )}

            <label>Email</label>
            <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required />

            <label>Password</label>
            <div className="password-field">
              <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required />
              <button type="button" className="password-toggle" onClick={() => setShowPassword((s) => !s)} aria-label={showPassword ? 'Hide password' : 'Show password'}>
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>

            <div className="actions">
              <button type="submit" className="primary">{mode === 'signup' ? 'Create Account' : 'Sign In'}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
