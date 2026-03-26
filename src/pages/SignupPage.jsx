import React, { useState } from 'react';
import './SignupPage.css';

const EyeIcon = ({ open }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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

const GoogleIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
);

function getStrength(pwd) {
  if (!pwd) return 0;
  let score = 0;
  if (pwd.length >= 8) score++;
  if (/[A-Z]/.test(pwd)) score++;
  if (/[0-9]/.test(pwd)) score++;
  if (/[^A-Za-z0-9]/.test(pwd)) score++;
  return score;
}

function getStrengthLabel(s) {
  if (s <= 1) return 'weak';
  if (s <= 3) return 'medium';
  return 'strong';
}

export default function SignupPage({ onNavigate }) {
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '',
    password: '', confirmPassword: '', phone: ''
  });
  const [errors, setErrors] = useState({});
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.firstName.trim()) e.firstName = 'First name required';
    if (!form.lastName.trim()) e.lastName = 'Last name required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Valid email required';
    if (form.password.length < 8) e.password = 'Min 8 characters';
    if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match';
    if (!/^\+?[\d\s\-()]{7,}$/.test(form.phone)) e.phone = 'Valid phone required';
    return e;
  };

  const handleChange = (field) => (e) => {
    setForm(p => ({ ...p, [field]: e.target.value }));
    if (errors[field]) setErrors(p => ({ ...p, [field]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 1800));
    setLoading(false);
    setSuccess(true);
    setTimeout(() => { setSuccess(false); onNavigate && onNavigate('login'); }, 2200);
  };

  const strength = getStrength(form.password);
  const strengthLabel = getStrengthLabel(strength);

  return (
    <div className="signup-root">
      {/* ── Left ── */}
      <div className="signup-left">
        <div className="brand-logo">LUXE<span>MART</span></div>
        <div className="left-content">
          <h1 className="left-tagline">
            Shop the <em>finest</em><br />
            curated collection
          </h1>
          <p className="left-desc">
            Join over 2 million shoppers discovering premium products,
            exclusive deals, and lightning-fast delivery — all in one place.
          </p>
          <ul className="features-list">
            <li><div className="feat-icon">🛡️</div>Secure checkout & buyer protection</li>
            <li><div className="feat-icon">🚀</div>Free express shipping on orders $49+</li>
            <li><div className="feat-icon">💎</div>Early access to member-exclusive sales</li>
          </ul>
        </div>
        <div className="float-card">
          <div className="fc-label">Members this month</div>
          <div className="fc-val">128,492</div>
          <div className="fc-change">↑ 12% growth</div>
        </div>
      </div>

      {/* ── Right ── */}
      <div className="signup-right">
        <div className="signup-form-wrap">
          <div className="form-header">
            <h2>Create account</h2>
            <p>Already have one?{' '}
              <a onClick={() => onNavigate && onNavigate('login')}>Sign in</a>
            </p>
          </div>

          <form className="form-grid" onSubmit={handleSubmit} noValidate>
            <div className="form-row">
              <Field label="First Name" icon="👤" value={form.firstName}
                onChange={handleChange('firstName')} placeholder="John"
                error={errors.firstName} />
              <Field label="Last Name" icon="👤" value={form.lastName}
                onChange={handleChange('lastName')} placeholder="Doe"
                error={errors.lastName} />
            </div>

            <Field label="Email Address" icon="✉️" type="email" value={form.email}
              onChange={handleChange('email')} placeholder="john@example.com"
              error={errors.email} />

            <Field label="Phone Number" icon="📱" type="tel" value={form.phone}
              onChange={handleChange('phone')} placeholder="+1 555 000 0000"
              error={errors.phone} />

            {/* Password */}
            <div className="field-wrap">
              <label>Password</label>
              <div className="input-box">
                <span className="i-icon">🔒</span>
                <input type={showPwd ? 'text' : 'password'} value={form.password}
                  onChange={handleChange('password')} placeholder="Min 8 characters" />
                <button type="button" className="eye-btn" onClick={() => setShowPwd(p => !p)}>
                  <EyeIcon open={showPwd} />
                </button>
              </div>
              {form.password && (
                <div className="pwd-strength">
                  {[1,2,3,4].map(i => (
                    <div key={i} className={`pwd-bar ${i <= strength ? strengthLabel : ''}`} />
                  ))}
                </div>
              )}
              {errors.password && <span className="field-error">⚠ {errors.password}</span>}
            </div>

            {/* Confirm Password */}
            <div className="field-wrap">
              <label>Confirm Password</label>
              <div className="input-box">
                <span className="i-icon">🔒</span>
                <input type={showConfirm ? 'text' : 'password'} value={form.confirmPassword}
                  onChange={handleChange('confirmPassword')} placeholder="Repeat password" />
                <button type="button" className="eye-btn" onClick={() => setShowConfirm(p => !p)}>
                  <EyeIcon open={showConfirm} />
                </button>
              </div>
              {errors.confirmPassword && <span className="field-error">⚠ {errors.confirmPassword}</span>}
            </div>

            <button type="submit" className={`submit-btn${loading ? ' loading' : ''}`}>
              {loading && <span className="btn-spinner" />}
              {loading ? 'Creating account…' : 'Create Account'}
            </button>

            <div className="divider"><span>or continue with</span></div>

            <div className="social-row">
              <button type="button" className="social-btn"><GoogleIcon /> Google</button>
              <button type="button" className="social-btn">🍎 Apple</button>
            </div>
          </form>
        </div>
      </div>

      {success && (
        <div className="success-overlay">
          <div className="success-card">
            <span className="success-icon">🎉</span>
            <h3>Welcome aboard!</h3>
            <p>Your account has been created. Redirecting…</p>
          </div>
        </div>
      )}
    </div>
  );
}

function Field({ label, icon, type = 'text', value, onChange, placeholder, error }) {
  return (
    <div className="field-wrap">
      <label>{label}</label>
      <div className="input-box">
        <span className="i-icon">{icon}</span>
        <input type={type} value={value} onChange={onChange} placeholder={placeholder} />
      </div>
      {error && <span className="field-error">⚠ {error}</span>}
    </div>
  );
}