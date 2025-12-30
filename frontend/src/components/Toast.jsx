import React from 'react';

export default function Toast({ message, onClose }) {
  if (!message) return null;
  return (
    <div className="toast">
      <div className="toast-inner">
        <strong>{message.title || 'Notice'}</strong>
        <div className="toast-body">{message.body}</div>
        <button className="toast-close" onClick={onClose}>✕</button>
      </div>
    </div>
  );
}
