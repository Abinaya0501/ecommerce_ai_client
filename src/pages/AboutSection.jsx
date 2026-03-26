import React, { useEffect, useRef } from 'react';
import './AboutSection.css';

const FEATURES = [
  { icon: '🌱', title: 'Farm Fresh', desc: 'Sourced directly from local farms within 48 hours of harvest for maximum freshness.' },
  { icon: '⚡', title: 'Express Delivery', desc: 'Under 2-hour delivery guarantee with real-time tracking on every order.' },
  { icon: '🛡️', title: 'Quality Guarantee', desc: '100% satisfaction or your money back. No questions asked, no hassle.' },
  { icon: '🌍', title: 'Sustainable', desc: 'Eco-friendly packaging, carbon-neutral delivery, supporting local farmers.' },
];

const TEAM = [
  { name: 'Aisha Patel', role: 'Head of Sourcing', emoji: '👩‍🌾', color: '#2d7a4f' },
  { name: 'Marcus Roy', role: 'Delivery Lead', emoji: '🚚', color: '#4a90d9' },
  { name: 'Sara Kim', role: 'Quality Chef', emoji: '👩‍🍳', color: '#e8621a' },
];

export default function AboutSection({ loading }) {
  const sectionRef = useRef(null);

  useEffect(() => {
    if (loading) return;
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
      { threshold: 0.1 }
    );
    sectionRef.current?.querySelectorAll('.reveal').forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, [loading]);

  return (
    <section className="about-section" id="about" ref={sectionRef}>
      {/* Wave top */}
      <div className="about-wave-top">
        <svg viewBox="0 0 1440 80" preserveAspectRatio="none">
          <path d="M0,40 C360,0 1080,80 1440,40 L1440,0 L0,0 Z" fill="#f7f5f0" />
        </svg>
      </div>

      <div className="section-wrap">
        {/* Header */}
        <div className="about-header reveal">
          <div>
            <div className="section-label">🌿 Our Story</div>
            <h2 className="section-title">Why <em>FreshBasket</em>?</h2>
          </div>
          <p className="about-tagline">
            We believe fresh food should be accessible to everyone —<br />
            delivered with love, straight from the farm.
          </p>
        </div>

        {/* Feature cards */}
        <div className="about-features">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="skeleton" style={{ height: '180px', borderRadius: '20px' }} />
            ))
          ) : (
            FEATURES.map((f, i) => (
              <div key={f.title} className={`about-feat-card reveal reveal-delay-${i + 1}`}>
                <div className="afc-icon">{f.icon}</div>
                <h3 className="afc-title">{f.title}</h3>
                <p className="afc-desc">{f.desc}</p>
              </div>
            ))
          )}
        </div>

        {/* Stats banner */}
        <div className="about-stats reveal">
          {[
            { val: '500K+', label: 'Orders Delivered', icon: '📦' },
            { val: '98%', label: 'Customer Satisfaction', icon: '⭐' },
            { val: '200+', label: 'Partner Farms', icon: '🌾' },
            { val: '50+', label: 'Cities Served', icon: '🌆' },
          ].map(s => (
            <div key={s.label} className="as-stat">
              <div className="as-icon">{s.icon}</div>
              <div className="as-val">{s.val}</div>
              <div className="as-label">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Team */}
        <div className="about-team-wrap reveal">
          <h3 className="team-title">Meet the Team</h3>
          <div className="about-team">
            {TEAM.map((m, i) => (
              <div key={m.name} className={`team-card reveal reveal-delay-${i + 1}`}>
                <div className="tc-avatar" style={{ background: m.color + '20', color: m.color }}>
                  {m.emoji}
                </div>
                <div className="tc-name">{m.name}</div>
                <div className="tc-role">{m.role}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer strip */}
      <div className="about-footer-strip">
        <div className="afs-inner">
          <div className="afs-left">
            <span className="afs-logo">🌿 FreshBasket</span>
            <span className="afs-copy">© 2025 FreshBasket. Made with 💚</span>
          </div>
          <div className="afs-links">
            {['Privacy', 'Terms', 'Contact', 'Careers'].map(l => (
              <a key={l} href="#" className="afs-link">{l}</a>
            ))}
          </div>
          <div className="afs-payment">
            {['VISA', 'MC', 'AMEX', 'GPay'].map(p => (
              <span key={p} className="pay-chip">{p}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}