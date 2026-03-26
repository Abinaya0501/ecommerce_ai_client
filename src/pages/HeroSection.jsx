import React from 'react';
import './HeroSection.css';

const STATS = [
  { val: '500+', label: 'Fresh Products' },
  { val: '2h', label: 'Delivery Time' },
  { val: '50K+', label: 'Happy Customers' },
];

export default function HeroSection({ loading }) {
  return (
    <section className="hero-section" id="home">
      <div className="hero-inner">
        <div className="hero-content">
          {loading ? (
            <div className="hero-skeleton">
              <div className="skeleton" style={{ width: '140px', height: '28px', borderRadius: '99px' }} />
              <div className="skeleton" style={{ width: '100%', height: '56px', marginTop: '20px' }} />
              <div className="skeleton" style={{ width: '80%', height: '56px', marginTop: '8px' }} />
              <div className="skeleton" style={{ width: '90%', height: '20px', marginTop: '20px' }} />
              <div className="skeleton" style={{ width: '70%', height: '20px', marginTop: '8px' }} />
              <div className="skeleton" style={{ width: '180px', height: '52px', marginTop: '32px', borderRadius: '99px' }} />
            </div>
          ) : (
            <>
              <div className="hero-badge">
                <span className="hb-dot" />
                🚀 Free delivery on orders $35+
              </div>
              <h1 className="hero-title">
                Fresh <em>Farm</em> Goodness<br />
                at Your <span className="ht-underline">Doorstep</span>
              </h1>
              <p className="hero-desc">
                Handpicked organic produce, premium groceries and
                artisan foods — delivered fresh in under 2 hours.
              </p>
              <div className="hero-actions">
                <button
                  className="hero-btn-primary"
                  onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Shop Now →
                </button>
                <button
                  className="hero-btn-secondary"
                  onClick={() => document.getElementById('categories')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Browse Categories
                </button>
              </div>
              <div className="hero-stats">
                {STATS.map(s => (
                  <div key={s.label} className="h-stat">
                    <div className="h-stat-val">{s.val}</div>
                    <div className="h-stat-lbl">{s.label}</div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        <div className="hero-visual">
          {loading ? (
            <div className="skeleton" style={{ width: '420px', height: '440px', borderRadius: '32px' }} />
          ) : (
            <div className="hero-img-wrap">
              <img
                src="https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=600&h=600&fit=crop&q=85"
                alt="Fresh produce"
                className="hero-img"
              />
              <div className="hero-img-overlay" />
              {/* Floating tags */}
              <div className="h-float-tag tag-delivery">
                <span>⚡</span>
                <div>
                  <div className="ft-title">Express</div>
                  <div className="ft-sub">2hr delivery</div>
                </div>
              </div>
              <div className="h-float-tag tag-organic">
                <span>🌿</span>
                <div>
                  <div className="ft-title">100%</div>
                  <div className="ft-sub">Organic</div>
                </div>
              </div>
              <div className="h-float-tag tag-rating">
                <div className="rating-stars">⭐⭐⭐⭐⭐</div>
                <div className="rating-text">4.9 / 5 rating</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Wave divider */}
      <div className="hero-wave">
        <svg viewBox="0 0 1440 80" preserveAspectRatio="none">
          <path d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z" fill="#f7f5f0" />
        </svg>
      </div>
    </section>
  );
}