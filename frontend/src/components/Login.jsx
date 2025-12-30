import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { auth } from '../services/api';
import { saveToken } from '../services/auth';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState(null);
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setErr(null);
    try {
      const res = await auth.login({ email, password });
      saveToken(res.data.token);
      nav('/');
    } catch (error) {
      setErr(error.response?.data?.msg || 'Login failed');
    }
  };

  return (
    <div className="auth">
      <form onSubmit={submit} className="card">
        <h2>Login</h2>
        {err && <div className="error">{err}</div>}
        <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
        <button type="submit">Login</button>
        <div>
          Don't have an account? <Link to="/register">Register</Link>
        </div>
      </form>
    </div>
  );
}
