import React, { useState, useEffect, useRef, useCallback } from 'react';
import './LandingPage.css';

/* ── Data ── */
const PRODUCTS = [
  { id:1, emoji:'👟', name:'Air Luxe Runner Pro', cat:'Footwear', price:249, old:349, rating:4.8, reviews:2341, badge:'Best Seller' },
  { id:2, emoji:'⌚', name:'Apex Smart Watch X1', cat:'Electronics', price:399, old:499, rating:4.9, reviews:987, badge:'New' },
  { id:3, emoji:'🎧', name:'Studio Pro ANC Headphones', cat:'Audio', price:189, old:249, rating:4.7, reviews:1654, badge:'Sale' },
  { id:4, emoji:'💻', name:'UltraBook 14 Pro', cat:'Computers', price:1299, old:1599, rating:4.6, reviews:543, badge:null },
  { id:5, emoji:'📷', name:'Mirrorless Pro Z9', cat:'Cameras', price:879, old:999, rating:4.8, reviews:321, badge:'Hot' },
  { id:6, emoji:'🎮', name:'GamePad Elite V2', cat:'Gaming', price:79, old:99, rating:4.5, reviews:4521, badge:'Sale' },
  { id:7, emoji:'👜', name:'Signature Tote Bag', cat:'Fashion', price:149, old:199, rating:4.9, reviews:876, badge:null },
  { id:8, emoji:'🌟', name:'Aura Fragrance Set', cat:'Beauty', price:89, old:120, rating:4.7, reviews:2109, badge:'Limited' },
];

const CATEGORIES = [
  { emoji:'👟', name:'Footwear', count:'4.2k items' },
  { emoji:'⌚', name:'Electronics', count:'8.1k items' },
  { emoji:'👚', name:'Fashion', count:'12.4k items' },
  { emoji:'🏠', name:'Home & Living', count:'6.7k items' },
  { emoji:'💄', name:'Beauty', count:'3.9k items' },
];

const TESTIMONIALS = [
  { text:'Absolutely blown away by the quality and delivery speed. LuxeMart has completely changed how I shop online.', name:'Priya Sharma', role:'Fashion Designer', stars:5, initial:'P' },
  { text:'The curated selection is unmatched. I found my dream watch here for a fraction of the retail price. 10/10 experience.', name:'Marcus Chen', role:'Tech Entrepreneur', stars:5, initial:'M' },
  { text:'Customer service is exceptional. Had a small issue with delivery and it was resolved within minutes. Truly premium.', name:'Aisha Johnson', role:'Interior Stylist', stars:5, initial:'A' },
];

const MARQUEE_ITEMS = [
  '⚡ Free shipping on orders $49+', '🛡️ 30-day easy returns', '💎 Premium quality guarantee',
  '🚀 Same-day dispatch before 3PM', '🎁 Gift wrapping available', '🌍 Ships to 50+ countries',
];

/* ── Countdown hook ── */
function useCountdown(targetHours = 5) {
  const [time, setTime] = useState({ h: targetHours, m: 59, s: 59 });
  useEffect(() => {
    const id = setInterval(() => {
      setTime(prev => {
        let { h, m, s } = prev;
        s--;
        if (s < 0) { s = 59; m--; }
        if (m < 0) { m = 59; h--; }
        if (h < 0) { h = targetHours; m = 59; s = 59; }
        return { h, m, s };
      });
    }, 1000);
    return () => clearInterval(id);
  }, [targetHours]);
  return time;
}

function pad(n) { return String(n).padStart(2, '0'); }

/* ── Reveal on scroll hook ── */
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal');
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); } });
    }, { threshold: 0.1 });
    els.forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);
}

/* ── Toast ── */
function Toast({ message, onDone }) {
  const [out, setOut] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => { setOut(true); setTimeout(onDone, 350); }, 2800);
    return () => clearTimeout(t);
  }, [onDone]);
  return <div className={`lp-toast${out ? ' toast-out' : ''}`}>✅ {message}</div>;
}

/* ── Product Card ── */
function ProdCard({ product, onCart, onWish, wished }) {
  return (
    <div className="prod-card reveal">
      <div className="prod-img">
        {product.badge && <span className="prod-badge">{product.badge}</span>}
        <button
          className={`prod-wish${wished ? ' wished' : ''}`}
          onClick={(e) => { e.stopPropagation(); onWish(product.id); }}
        >
          {wished ? '❤️' : '🤍'}
        </button>
        {product.emoji}
      </div>
      <div className="prod-body">
        <div className="prod-cat">{product.cat}</div>
        <div className="prod-name">{product.name}</div>
        <div className="prod-stars">
          <span className="stars">{'★'.repeat(Math.round(product.rating))}</span>
          <span className="prod-reviews">({product.reviews.toLocaleString()})</span>
        </div>
        <div className="prod-price-row">
          <span className="prod-price">${product.price}</span>
          {product.old && <span className="prod-old">${product.old}</span>}
        </div>
      </div>
      <button className="prod-cart-btn" onClick={() => onCart(product)}>
        Add to Cart →
      </button>
    </div>
  );
}

/* ── Cart Drawer ── */
function CartDrawer({ items, onClose, onQty }) {
  const total = items.reduce((s, i) => s + i.price * i.qty, 0);
  return (
    <>
      <div className="cart-drawer-overlay" onClick={onClose} />
      <div className="cart-drawer">
        <div className="cd-header">
          <h3>Your Cart ({items.reduce((s,i)=>s+i.qty,0)})</h3>
          <button className="cd-close" onClick={onClose}>✕</button>
        </div>
        <div className="cd-items">
          {items.length === 0 ? (
            <div className="cd-empty">
              <span className="ce-emoji">🛒</span>
              Your cart is empty
            </div>
          ) : items.map(item => (
            <div key={item.id} className="cd-item">
              <div className="cd-item-img">{item.emoji}</div>
              <div className="cd-item-info">
                <div className="cd-item-name">{item.name}</div>
                <div className="cd-item-price">${item.price}</div>
              </div>
              <div className="cd-item-qty">
                <button className="qty-btn" onClick={() => onQty(item.id, -1)}>−</button>
                <span>{item.qty}</span>
                <button className="qty-btn" onClick={() => onQty(item.id, 1)}>+</button>
              </div>
            </div>
          ))}
        </div>
        {items.length > 0 && (
          <div className="cd-footer">
            <div className="cd-total"><span>Total</span><span>${total}</span></div>
            <button className="cd-checkout">Checkout →</button>
          </div>
        )}
      </div>
    </>
  );
}

/* ══════════════════════════════════════
   MAIN LANDING PAGE
══════════════════════════════════════ */
export default function LandingPage({ onNavigate }) {
  const [scrolled, setScrolled] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [wishlisted, setWishlisted] = useState(new Set());
  const [toast, setToast] = useState(null);
  const [nlEmail, setNlEmail] = useState('');
  const [nlDone, setNlDone] = useState(false);
  const time = useCountdown(5);
  useReveal();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const showToast = useCallback((msg) => {
    setToast(msg);
  }, []);

  const addToCart = useCallback((product) => {
    setCartItems(prev => {
      const ex = prev.find(i => i.id === product.id);
      if (ex) return prev.map(i => i.id === product.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { ...product, qty: 1 }];
    });
    showToast(`${product.name} added to cart!`);
  }, [showToast]);

  const toggleWish = useCallback((id) => {
    setWishlisted(prev => {
      const next = new Set(prev);
      if (next.has(id)) { next.delete(id); } else { next.add(id); }
      return next;
    });
  }, []);

  const adjustQty = useCallback((id, delta) => {
    setCartItems(prev => {
      const updated = prev.map(i => i.id === id ? { ...i, qty: Math.max(0, i.qty + delta) } : i);
      return updated.filter(i => i.qty > 0);
    });
  }, []);

  const cartCount = cartItems.reduce((s, i) => s + i.qty, 0);

  const handleNl = (e) => {
    e.preventDefault();
    if (nlEmail.includes('@')) { setNlDone(true); showToast('Subscribed! Check your inbox 🎉'); }
  };

  return (
    <div className="lp-root">
      {/* ── Navbar ── */}
      <nav className={`lp-nav${scrolled ? ' scrolled' : ''}`}>
        <a className="nav-logo">LUXE<span>MART</span></a>
        <ul className="nav-links">
          <li><a href="#categories">Categories</a></li>
          <li><a href="#products">Products</a></li>
          <li><a href="#deals">Deals</a></li>
          <li><a href="#about">About</a></li>
        </ul>
        <div className="nav-actions">
          <button className="nav-icon-btn" title="Search">🔍</button>
          <button className="nav-icon-btn" title="Wishlist">♡</button>
          <button className="nav-icon-btn" title="Cart" onClick={() => setCartOpen(true)}>
            🛒
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </button>
          <button className="nav-cta" onClick={() => onNavigate && onNavigate('signup')}>
            Sign Up
          </button>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="lp-hero">
        <div className="hero-bg-grid" />
        <div className="hero-left">
          <div className="hero-badge">
            <span className="dot" />
            New collection just landed
          </div>
          <h1 className="hero-title">
            Discover
            <span className="line2">Premium Style</span>
            at Your Fingertips
          </h1>
          <p className="hero-desc">
            Curated luxury. Unbeatable prices. Lightning delivery.
            Your gateway to 500,000+ premium products from top brands worldwide.
          </p>
          <div className="hero-actions">
            <button className="hero-btn-primary" onClick={() => document.getElementById('products').scrollIntoView({ behavior:'smooth' })}>
              Shop Now →
            </button>
            <button className="hero-btn-secondary" onClick={() => document.getElementById('categories').scrollIntoView({ behavior:'smooth' })}>
              ▷ Browse Categories
            </button>
          </div>
          <div className="hero-stats">
            <div className="h-stat"><div className="val">500K+</div><div className="lbl">Products</div></div>
            <div className="h-stat"><div className="val">2M+</div><div className="lbl">Happy Customers</div></div>
            <div className="h-stat"><div className="val">50+</div><div className="lbl">Countries</div></div>
          </div>
        </div>
        <div className="hero-right">
          <div className="hero-img-stack">
            <div className="hero-main-img">
              <span>👟</span>
              <div className="hmi-label">Air Luxe Pro</div>
              <div className="hmi-price">$249</div>
            </div>
            <div className="hero-float-tag tag1">
              <span className="ft-emoji">⭐</span>
              <div className="ft-label">Rating</div>
              <div className="ft-value">4.9 / 5</div>
            </div>
            <div className="hero-float-tag tag2">
              <span className="ft-emoji">🚀</span>
              <div className="ft-label">Delivered in</div>
              <div className="ft-value">24 hours</div>
              <div className="ft-sub">Express shipping</div>
            </div>
            <div className="hero-float-tag tag3">
              <span className="ft-emoji">🛍️</span>
              <div className="ft-label">Orders today</div>
              <div className="ft-value">8,421</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Marquee ── */}
      <div className="lp-marquee">
        <div className="marquee-track">
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
            <span key={i} className="marquee-item">
              <span className="m-dot" />{item}
            </span>
          ))}
        </div>
      </div>

      {/* ── Categories ── */}
      <section className="lp-section" id="categories">
        <div className="section-header reveal">
          <div>
            <div className="section-label">Browse by type</div>
            <h2 className="section-title">Shop by <em>Category</em></h2>
          </div>
          <button className="section-link">View all categories →</button>
        </div>
        <div className="cats-grid">
          {CATEGORIES.map((cat, i) => (
            <div key={cat.name} className={`cat-card reveal reveal-delay-${i+1}`}>
              <div className="cat-emoji">{cat.emoji}</div>
              <div className="cat-name">{cat.name}</div>
              <div className="cat-count">{cat.count}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Featured Products ── */}
      <section className="lp-section" id="products" style={{ paddingTop: 0 }}>
        <div className="section-header reveal">
          <div>
            <div className="section-label">Hand-picked for you</div>
            <h2 className="section-title">Featured <em>Products</em></h2>
          </div>
          <button className="section-link">View all products →</button>
        </div>
        <div className="products-grid">
          {PRODUCTS.map(p => (
            <ProdCard key={p.id} product={p} onCart={addToCart} onWish={toggleWish} wished={wishlisted.has(p.id)} />
          ))}
        </div>
      </section>

      {/* ── Flash Sale Banner ── */}
      <div className="lp-banner" id="deals">
        <div className="banner-content">
          <div className="banner-tag">⚡ Flash Sale</div>
          <h2 className="banner-title">Up to 60% Off<br />Today Only</h2>
          <p className="banner-desc">Don't miss out on our biggest sale of the season. Limited stock available on premium products.</p>
          <div className="banner-timer">
            <div className="bt-unit">
              <span className="bt-num">{pad(time.h)}</span>
              <span className="bt-lbl">Hours</span>
            </div>
            <div className="bt-unit">
              <span className="bt-num">{pad(time.m)}</span>
              <span className="bt-lbl">Mins</span>
            </div>
            <div className="bt-unit">
              <span className="bt-num">{pad(time.s)}</span>
              <span className="bt-lbl">Secs</span>
            </div>
          </div>
          <button className="banner-btn">Shop the Sale →</button>
        </div>
        <div className="banner-visual">🛍️</div>
      </div>

      {/* ── Testimonials ── */}
      <section className="lp-section lp-testimonials" id="about">
        <div className="section-header reveal">
          <div>
            <div className="section-label">Customer love</div>
            <h2 className="section-title">What they <em>say</em></h2>
          </div>
        </div>
        <div className="testi-grid">
          {TESTIMONIALS.map((t, i) => (
            <div key={i} className={`testi-card reveal reveal-delay-${i+1}`}>
              <div className="testi-quote">"</div>
              <p className="testi-text">{t.text}</p>
              <div className="testi-author">
                <div className="testi-avatar">{t.initial}</div>
                <div>
                  <div className="testi-name">{t.name}</div>
                  <div className="testi-role">{t.role}</div>
                  <div className="testi-stars">{'★'.repeat(t.stars)}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Newsletter ── */}
      <section className="lp-newsletter">
        <div className="nl-content reveal">
          <h2 className="nl-title">Get <em>exclusive</em> deals<br />in your inbox</h2>
          <p className="nl-desc">Join 500,000+ members who never miss a sale. No spam, ever.</p>
          {!nlDone ? (
            <form className="nl-form" onSubmit={handleNl}>
              <input
                className="nl-input"
                type="email"
                placeholder="Enter your email address…"
                value={nlEmail}
                onChange={e => setNlEmail(e.target.value)}
              />
              <button type="submit" className="nl-btn">Subscribe →</button>
            </form>
          ) : (
            <div style={{ color:'var(--success)', fontSize:'1rem', fontWeight:600, marginBottom:'1.5rem' }}>
              🎉 You're subscribed! Check your inbox.
            </div>
          )}
          <div className="nl-perks">
            <div className="nl-perk"><span className="perk-icon">✓</span> No spam</div>
            <div className="nl-perk"><span className="perk-icon">✓</span> Unsubscribe anytime</div>
            <div className="nl-perk"><span className="perk-icon">✓</span> Exclusive member deals</div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="lp-footer">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="fb-logo">LUXE<span>MART</span></div>
            <p>Your premier destination for curated luxury products. Delivering exceptional quality to 2M+ happy customers worldwide.</p>
            <div className="social-icons">
              {['𝕏','in','▶','📸'].map((s,i) => <button key={i} className="si-btn">{s}</button>)}
            </div>
          </div>
          <div className="footer-col">
            <h4>Shop</h4>
            <ul>
              {['All Products','New Arrivals','Best Sellers','Sale Items','Gift Cards'].map(l => (
                <li key={l}><a href="#">{l}</a></li>
              ))}
            </ul>
          </div>
          <div className="footer-col">
            <h4>Support</h4>
            <ul>
              {['Help Center','Track Order','Returns','Size Guide','Contact Us'].map(l => (
                <li key={l}><a href="#">{l}</a></li>
              ))}
            </ul>
          </div>
          <div className="footer-col">
            <h4>Company</h4>
            <ul>
              {['About Us','Careers','Press','Sustainability','Affiliates'].map(l => (
                <li key={l}><a href="#">{l}</a></li>
              ))}
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2025 LuxeMart. All rights reserved.</p>
          <div className="payment-icons">
            {['VISA','MC','AMEX','PayPal','GPay'].map(p => (
              <span key={p} className="pay-icon">{p}</span>
            ))}
          </div>
        </div>
      </footer>

      {/* ── Cart Drawer ── */}
      {cartOpen && (
        <CartDrawer items={cartItems} onClose={() => setCartOpen(false)} onQty={adjustQty} />
      )}

      {/* ── Toast ── */}
      {toast && <Toast message={toast} onDone={() => setToast(null)} />}
    </div>
  );
}