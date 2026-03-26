import React, { useEffect, useRef } from 'react';
import { CATEGORIES } from './data';
import './CategorySection.css';

function CategorySkeleton() {
  return (
    <div className="cats-grid">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="cat-skeleton">
          <div className="skeleton" style={{ width: '100%', height: '130px', borderRadius: '16px' }} />
          <div className="skeleton" style={{ width: '70%', height: '14px', margin: '10px auto 6px', borderRadius: '6px' }} />
          <div className="skeleton" style={{ width: '50%', height: '12px', margin: '0 auto', borderRadius: '6px' }} />
        </div>
      ))}
    </div>
  );
}

export default function CategorySection({ loading, activeCategory, onSelect }) {
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
    <section className="cat-section section-wrap" id="categories" ref={sectionRef}>
      <div className="section-header reveal">
        <div>
          <div className="section-label">🛒 Shop by Category</div>
          <h2 className="section-title">What are you <em>looking for?</em></h2>
        </div>
        <button className="see-all-btn">See All Categories →</button>
      </div>

      {loading ? (
        <CategorySkeleton />
      ) : (
        <>
          {/* All pill */}
          <div className="cat-all-row reveal">
            <button
              className={`cat-all-pill${activeCategory === 'All' ? ' active' : ''}`}
              onClick={() => onSelect('All')}
            >
              🌟 All Products
            </button>
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                className={`cat-all-pill${activeCategory === cat.name ? ' active' : ''}`}
                onClick={() => onSelect(cat.name)}
              >
                {cat.emoji} {cat.name}
              </button>
            ))}
          </div>

          <div className="cats-grid">
            {CATEGORIES.map((cat, i) => (
              <div
                key={cat.id}
                className={`cat-card reveal reveal-delay-${(i % 4) + 1}${activeCategory === cat.name ? ' selected' : ''}`}
                onClick={() => onSelect(activeCategory === cat.name ? 'All' : cat.name)}
                role="button"
                tabIndex={0}
                onKeyDown={e => e.key === 'Enter' && onSelect(cat.name)}
              >
                {/* Image */}
                <div className="cat-img-wrap">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="cat-img"
                    loading="lazy"
                  />
                  <div className="cat-img-overlay" style={{ background: `linear-gradient(180deg, transparent 40%, ${cat.color}cc 100%)` }} />
                  {activeCategory === cat.name && (
                    <div className="cat-selected-check">✓</div>
                  )}
                </div>

                {/* Info */}
                <div className="cat-info">
                  <span className="cat-emoji-badge" style={{ background: cat.bg, color: cat.color }}>
                    {cat.emoji}
                  </span>
                  <div className="cat-text">
                    <div className="cat-name">{cat.name}</div>
                    <div className="cat-count">{cat.count} items</div>
                  </div>
                  <span className="cat-arrow" style={{ color: cat.color }}>→</span>
                </div>

                {/* Glow on hover */}
                <div className="cat-glow" style={{ background: cat.color }} />
              </div>
            ))}
          </div>
        </>
      )}
    </section>
  );
}