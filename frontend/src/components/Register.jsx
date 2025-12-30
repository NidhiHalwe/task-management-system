import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { auth } from '../services/api';
import { saveToken } from '../services/auth';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState(null);
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setErr(null);
    try {
      const res = await auth.register({ name, email, password });
      saveToken(res.data.token);
      nav('/');
    } catch (error) {
      setErr(error.response?.data?.msg || 'Register failed');
    }
  };

  return (
    <div className="auth">
      <form onSubmit={submit} className="card">
        <h2>Register</h2>
        {err && <div className="error">{err}</div>}
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
        <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
        <button type="submit">Register</button>
        <div>
          Already have an account? <Link to="/login">Login</Link>
        </div>
      </form>
    </div>
  );
}
