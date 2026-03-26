import React, { useState, useEffect, useRef } from 'react';
import { DEALS } from './data';
import './DealsSection.css';

function useCountdown(hours = 24) {
  const [time, setTime] = useState({ h: hours, m: 59, s: 59 });
  useEffect(() => {
    const id = setInterval(() => {
      setTime(prev => {
        let { h, m, s } = prev;
        if (--s < 0) { s = 59; if (--m < 0) { m = 59; if (--h < 0) h = hours; } }
        return { h, m, s };
      });
    }, 1000);
    return () => clearInterval(id);
  }, [hours]);
  return time;
}

const pad = n => String(n).padStart(2, '0');

function DealCard({ deal, index }) {
  const time = useCountdown(index === 0 ? 48 : index === 1 ? 72 : 24);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  const handleCopy = () => {
    navigator.clipboard?.writeText(deal.code).catch(() => {});
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div
      className={`deal-card reveal reveal-delay-${index + 1}`}
      style={{ '--deal-bg': deal.bg, '--deal-accent': deal.accent }}
    >
      {/* Background image */}
      <div className="deal-img-bg">
        {!imgLoaded && <div className="skeleton deal-img-skeleton" />}
        <img
          src={deal.image}
          alt={deal.title}
          className={`deal-bg-img${imgLoaded ? ' loaded' : ''}`}
          onLoad={() => setImgLoaded(true)}
        />
        <div className="deal-img-overlay" />
      </div>

      {/* Animated particles */}
      <div className="deal-particles" aria-hidden="true">
        {Array.from({ length: 6 }).map((_, i) => (
          <span key={i} className="dp" style={{ '--i': i }} />
        ))}
      </div>

      {/* Content */}
      <div className="deal-content">
        {/* Left */}
        <div className="deal-left">
          <div className="deal-tag">⚡ Limited Time</div>
          <div className="deal-emoji">{deal.emoji}</div>
          <h3 className="deal-title">{deal.title}</h3>
          <p className="deal-sub">{deal.subtitle}</p>

          {/* Countdown */}
          <div className="deal-timer">
            <div className="dt-label">Ends in:</div>
            <div className="dt-units">
              {[{ val: time.h, lbl: 'HRS' }, { val: time.m, lbl: 'MIN' }, { val: time.s, lbl: 'SEC' }].map(u => (
                <div key={u.lbl} className="dt-unit">
                  <div className="dt-num" key={u.val}>{pad(u.val)}</div>
                  <div className="dt-lbl">{u.lbl}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Coupon */}
          <div className="deal-coupon" onClick={handleCopy} title="Click to copy">
            <span className="coupon-icon">🏷</span>
            <span className="coupon-code">{deal.code}</span>
            <span className="coupon-copy">{copiedCode ? '✓ Copied!' : 'Copy'}</span>
          </div>

          <button className="deal-btn">
            Shop Now →
          </button>
        </div>

        {/* Right - discount badge */}
        <div className="deal-right">
          <div className="deal-discount-badge">
            <div className="ddb-text">{deal.discount}</div>
            <div className="ddb-sub">OFF</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DealSkeleton() {
  return (
    <div className="deals-grid">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="skeleton" style={{ height: '340px', borderRadius: '24px' }} />
      ))}
    </div>
  );
}

export default function DealsSection({ loading, onAddToCart }) {
  const sectionRef = useRef(null);
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    if (loading) return;
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
      { threshold: 0.1 }
    );
    sectionRef.current?.querySelectorAll('.reveal').forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, [loading]);

  // Auto-rotate slide indicators
  useEffect(() => {
    if (loading) return;
    const id = setInterval(() => setActiveSlide(p => (p + 1) % DEALS.length), 3000);
    return () => clearInterval(id);
  }, [loading]);

  return (
    <section className="deals-section section-wrap" id="deals" ref={sectionRef}>
      <div className="section-header reveal">
        <div>
          <div className="section-label">🔥 Hot Deals</div>
          <h2 className="section-title">Today's <span className="orange">Best Offers</span></h2>
        </div>
        <button className="see-all-btn">All Deals →</button>
      </div>

      {/* Marquee strip */}
      <div className="deals-marquee reveal">
        <div className="dm-track">
          {Array.from({ length: 3 }).flatMap(() => [
            '🍎 50% off Fresh Fruits', '🥛 Buy 2 Get 1 Free — Dairy', '🍞 30% off Artisan Breads',
            '🥩 Premium Meat Sale', '🥤 Beverages Bonanza', '🌿 Organic Week Deals',
          ]).map((t, i) => (
            <span key={i} className="dm-item">{t}</span>
          ))}
        </div>
      </div>

      {loading ? <DealSkeleton /> : (
        <>
          <div className="deals-grid">
            {DEALS.map((deal, i) => (
              <DealCard key={deal.id} deal={deal} index={i} />
            ))}
          </div>

          {/* Slide dots */}
          <div className="deal-dots reveal">
            {DEALS.map((_, i) => (
              <button
                key={i}
                className={`deal-dot${activeSlide === i ? ' active' : ''}`}
                onClick={() => setActiveSlide(i)}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}