import React, { useState, useEffect, useRef, useMemo } from 'react';
import { PRODUCTS, CATEGORIES } from './data';
import './ProductSection.css';

const SORT_OPTIONS = ['Default', 'Price: Low to High', 'Price: High to Low', 'Highest Rated', 'Most Reviewed'];
const VISIBLE_INIT = 8;

function ProductSkeleton() {
  return (
    <>
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="prod-card-skeleton">
          <div className="skeleton" style={{ width: '100%', height: '200px', borderRadius: '16px 16px 0 0' }} />
          <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div className="skeleton" style={{ width: '60%', height: '12px', borderRadius: '6px' }} />
            <div className="skeleton" style={{ width: '90%', height: '16px', borderRadius: '6px' }} />
            <div className="skeleton" style={{ width: '40%', height: '14px', borderRadius: '6px' }} />
            <div className="skeleton" style={{ width: '100%', height: '40px', borderRadius: '10px', marginTop: '8px' }} />
          </div>
        </div>
      ))}
    </>
  );
}

function StarRating({ rating }) {
  return (
    <div className="star-row">
      {[1,2,3,4,5].map(i => (
        <span key={i} className={`star${i <= Math.round(rating) ? ' filled' : ''}`}>★</span>
      ))}
      <span className="rating-num">{rating}</span>
    </div>
  );
}

function ProductCard({ product, onAddToCart, inCart, cartQty }) {
  const [clicked, setClicked] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const discount = product.oldPrice
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : null;

  const handleAdd = () => {
    onAddToCart(product);
    setClicked(true);
    setTimeout(() => setClicked(false), 600);
  };

  return (
    <div className={`prod-card${inCart ? ' in-cart' : ''}`}>
      {/* Badge */}
      {product.badge && <span className="prod-badge">{product.badge}</span>}
      {product.tag === 'best-seller' && <span className="prod-tag tag-best">🔥 Best Seller</span>}
      {product.tag === 'new' && <span className="prod-tag tag-new">✨ New</span>}
      {product.tag === 'sale' && <span className="prod-tag tag-sale">🏷 Sale</span>}

      {/* Image */}
      <div className="prod-img-wrap">
        {!imgLoaded && <div className="skeleton prod-img-skeleton" />}
        <img
          src={product.image}
          alt={product.name}
          className={`prod-img${imgLoaded ? ' loaded' : ''}`}
          onLoad={() => setImgLoaded(true)}
          loading="lazy"
        />
        {discount && <span className="prod-discount">-{discount}%</span>}

        {/* Quick actions overlay */}
        <div className="prod-overlay">
          <button className="prod-quick-btn" title="Add to Wishlist">♡ Wishlist</button>
          <button className="prod-quick-btn" title="Quick View">👁 Quick View</button>
        </div>
      </div>

      {/* Body */}
      <div className="prod-body">
        <div className="prod-cat-tag">{product.category}</div>
        <div className="prod-name">{product.name}</div>
        <div className="prod-unit">{product.unit}</div>
        <StarRating rating={product.rating} />
        <span className="prod-reviews">({product.reviews.toLocaleString()} reviews)</span>

        <div className="prod-price-row">
          <span className="prod-price">${product.price.toFixed(2)}</span>
          {product.oldPrice && <span className="prod-old">${product.oldPrice.toFixed(2)}</span>}
        </div>

        <button
          className={`prod-add-btn${clicked ? ' clicked' : ''}`}
          onClick={handleAdd}
        >
          {clicked ? (
            <span className="btn-confirm">✓ Added!</span>
          ) : inCart ? (
            <><span>🛒</span> In Cart ({cartQty})</>
          ) : (
            <><span>+</span> Add to Cart</>
          )}
        </button>
      </div>
    </div>
  );
}

export default function ProductSection({ loading, activeCategory, searchQuery, onAddToCart, cartItems }) {
  const [sort, setSort] = useState('Default');
  const [visibleCount, setVisibleCount] = useState(VISIBLE_INIT);
  const sectionRef = useRef(null);

  // Reset visible count when filters change
  useEffect(() => { setVisibleCount(VISIBLE_INIT); }, [activeCategory, searchQuery]);

  // Reveal on scroll
  useEffect(() => {
    if (loading) return;
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
      { threshold: 0.08 }
    );
    const timer = setTimeout(() => {
      sectionRef.current?.querySelectorAll('.reveal').forEach(el => obs.observe(el));
    }, 100);
    return () => { clearTimeout(timer); obs.disconnect(); };
  }, [loading, visibleCount]);

  const filtered = useMemo(() => {
    let list = PRODUCTS;

    // Category filter
    if (activeCategory !== 'All') {
      const catObj = CATEGORIES.find(c => c.name === activeCategory);
      if (catObj) list = list.filter(p => p.category === catObj.id);
    }

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        (p.badge && p.badge.toLowerCase().includes(q))
      );
    }

    // Sort
    switch (sort) {
      case 'Price: Low to High': return [...list].sort((a, b) => a.price - b.price);
      case 'Price: High to Low': return [...list].sort((a, b) => b.price - a.price);
      case 'Highest Rated':      return [...list].sort((a, b) => b.rating - a.rating);
      case 'Most Reviewed':      return [...list].sort((a, b) => b.reviews - a.reviews);
      default: return list;
    }
  }, [activeCategory, searchQuery, sort]);

  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  return (
    <section className="prod-section section-wrap" id="products" ref={sectionRef}>
      <div className="section-header reveal">
        <div>
          <div className="section-label">🌟 Fresh Picks</div>
          <h2 className="section-title">
            {activeCategory !== 'All' ? <><em>{activeCategory}</em></> : <>Our <em>Products</em></>}
          </h2>
          {filtered.length > 0 && (
            <p className="prod-count">{filtered.length} items found</p>
          )}
        </div>
        <div className="prod-controls">
          <select
            className="sort-select"
            value={sort}
            onChange={e => setSort(e.target.value)}
          >
            {SORT_OPTIONS.map(o => <option key={o}>{o}</option>)}
          </select>
        </div>
      </div>

      <div className="products-grid">
        {loading ? (
          <ProductSkeleton />
        ) : filtered.length === 0 ? (
          <div className="prod-empty">
            <div className="pe-emoji">🔍</div>
            <h3>No products found</h3>
            <p>Try adjusting your search or category filter</p>
          </div>
        ) : (
          visible.map((product, i) => {
            const cartItem = cartItems.find(c => c.id === product.id);
            return (
              <div key={product.id} className={`reveal reveal-delay-${(i % 4) + 1}`}>
                <ProductCard
                  product={product}
                  onAddToCart={onAddToCart}
                  inCart={!!cartItem}
                  cartQty={cartItem?.qty || 0}
                />
              </div>
            );
          })
        )}
      </div>

      {!loading && hasMore && (
        <div className="view-more-wrap reveal">
          <button className="view-more-btn" onClick={() => setVisibleCount(c => c + 4)}>
            View More Products ({filtered.length - visibleCount} remaining)
            <span className="vm-arrow">↓</span>
          </button>
        </div>
      )}
    </section>
  );
}