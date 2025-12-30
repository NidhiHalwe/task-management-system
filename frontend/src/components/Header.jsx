import React from 'react';
import { useNavigate } from 'react-router-dom';
import { removeToken } from '../services/auth';

export default function Header({ user }) {
  const initials = user?.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : 'U';
  const nav = useNavigate();

  const logout = () => {
    removeToken();
    nav('/login');
  };

  return (
    <header className="app-header">
      <div className="brand">
        <div className="logo">✓</div>
        <div className="brand-title">TaskFlow</div>
      </div>
      <div className="header-right">
        <div className="avatar">{initials}</div>
        <button className="logout" onClick={logout}>Logout</button>
      </div>
    </header>
  );
}
