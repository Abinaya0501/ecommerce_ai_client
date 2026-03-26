import React, { useState, useRef } from 'react';
import './LoginPage.css';

const GoogleIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
);

const EyeIcon = ({ open }) => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    {open ? (
      <>
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
        <circle cx="12" cy="12" r="3"/>
      </>
    ) : (
      <>
        <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/>
        <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/>
        <line x1="1" y1="1" x2="23" y2="23"/>
      </>
    )}
  </svg>
);

export default function LoginPage({ onNavigate }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);
  const formRef = useRef(null);

  const validate = () => {
    const e = {};
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = 'Enter a valid email';
    if (password.length < 6) e.password = 'Password too short';
    return e;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }
    setLoading(true);
    await new Promise(r => setTimeout(r, 1800));
    setLoading(false);
    onNavigate && onNavigate('landing');
  };

  const clearError = (field) => {
    if (errors[field]) setErrors(p => ({ ...p, [field]: '' }));
  };

  return (
    <div className="login-root">
      {/* Animated BG */}
      <div className="login-bg">
        <div className="bg-orb" />
        <div className="bg-orb" />
        <div className="bg-orb" />
      </div>

      {/* ── Left scene ── */}
      <div className="login-left">
        <div className="login-brand">LUXE<span>MART</span></div>

        <div className="preview-scene">
          <div className="preview-card pc-main">
            <div className="preview-badge">⚡ HOT</div>
            <span className="pc-emoji">👟</span>
            <div className="pc-name">Air Luxe Runner Pro</div>
            <div className="pc-price">$249</div>
          </div>
          <div className="preview-card pc-side1">
            <span className="pc-emoji">⌚</span>
            <div className="pc-name">Apex Smart Watch</div>
            <div className="pc-price">$399</div>
          </div>
          <div className="preview-card pc-side2">
            <span className="pc-emoji">🎧</span>
            <div className="pc-name">Studio Pro ANC</div>
            <div className="pc-price">$189</div>
          </div>
        </div>

        <div className="login-left-copy">
          <h2>Premium products await you</h2>
          <p>Sign in to access exclusive deals and your wishlist</p>
        </div>
      </div>

      {/* ── Right form ── */}
      <div className="login-right">
        <div className="login-form-wrap">
          <div className="lf-header">
            <h2>Welcome back</h2>
            <p>Don't have an account?{' '}
              <a onClick={() => onNavigate && onNavigate('signup')}>Sign up free</a>
            </p>
          </div>

          <form
            ref={formRef}
            className={`login-fields${shake ? ' shake' : ''}`}
            onSubmit={handleSubmit}
            noValidate
          >
            {/* Email */}
            <div className="lf-field">
              <label>Email Address</label>
              <div className="lf-input-wrap">
                <span className="lf-icon">✉️</span>
                <input
                  className="lf-input"
                  type="email"
                  value={email}
                  onChange={e => { setEmail(e.target.value); clearError('email'); }}
                  placeholder="you@example.com"
                />
              </div>
              {errors.email && <span className="lf-field-error">⚠ {errors.email}</span>}
            </div>

            {/* Password */}
            <div className="lf-field">
              <label>Password</label>
              <div className="lf-input-wrap">
                <span className="lf-icon">🔒</span>
                <input
                  className="lf-input"
                  type={showPwd ? 'text' : 'password'}
                  value={password}
                  onChange={e => { setPassword(e.target.value); clearError('password'); }}
                  placeholder="Your password"
                />
                <button type="button" className="lf-eye" onClick={() => setShowPwd(p => !p)}>
                  <EyeIcon open={showPwd} />
                </button>
              </div>
              {errors.password && <span className="lf-field-error">⚠ {errors.password}</span>}
            </div>

            {/* Remember + Forgot */}
            <div className="lf-extras">
              <label className="lf-remember">
                <input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)} />
                Remember me
              </label>
              <button type="button" className="lf-forgot">Forgot password?</button>
            </div>

            <button type="submit" className={`lf-btn${loading ? ' loading' : ''}`}>
              {loading && <span className="lf-spinner" />}
              {loading ? 'Signing in…' : 'Sign In'}
            </button>

            <div className="lf-divider"><span>or sign in with</span></div>

            <div className="lf-socials">
              <button type="button" className="lf-social-btn"><GoogleIcon /> Google</button>
              <button type="button" className="lf-social-btn">🍎 Apple</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}