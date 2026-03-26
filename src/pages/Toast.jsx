import React, { useState, useEffect } from 'react';
import './Toast.css';

export default function Toast({ message, type = 'success', onDone }) {
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setLeaving(true), 2800);
    const t2 = setTimeout(() => onDone(), 3200);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [onDone]);

  const icons = { success: '✅', error: '❌', info: 'ℹ️', warning: '⚠️' };

  return (
    <div className={`toast toast-${type}${leaving ? ' toast-out' : ''}`}>
      <span className="toast-icon">{icons[type]}</span>
      <span className="toast-msg">{message}</span>
      <button className="toast-close" onClick={() => { setLeaving(true); setTimeout(onDone, 300); }}>✕</button>
    </div>
  );
}