import React, { useState, useEffect } from 'react';
import './Navbar.css';

export default function Navbar({ cartCount, onCartOpen, searchQuery, onSearch }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  return (
    <header className={`navbar${scrolled ? ' scrolled' : ''}`}>
      <div className="nb-inner">
        {/* Logo */}
        <div className="nb-logo">
          <span className="logo-leaf">🌿</span>
          <div>
            <span className="logo-text">Fresh<em>Basket</em></span>
            <span className="logo-sub">Farm to Door</span>
          </div>
        </div>

        {/* Nav links */}
        <nav className={`nb-links${menuOpen ? ' open' : ''}`}>
          {['Home', 'Categories', 'Products', 'Deals', 'About'].map(l => (
            <a
              key={l}
              href={`#${l.toLowerCase()}`}
              className="nb-link"
              onClick={() => setMenuOpen(false)}
            >
              {l}
            </a>
          ))}
        </nav>

        {/* Search */}
        <div className={`nb-search${searchFocused ? ' focused' : ''}`}>
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search groceries…"
            value={searchQuery}
            onChange={e => onSearch(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
          />
          {searchQuery && (
            <button className="search-clear" onClick={() => onSearch('')}>✕</button>
          )}
        </div>

        {/* Actions */}
        <div className="nb-actions">
          <button className="nb-icon-btn" title="Wishlist">♡</button>
          <button className="nb-icon-btn nb-account" title="Account">
            <span className="account-avatar">U</span>
          </button>
          <button className="nb-cart-btn" onClick={onCartOpen}>
            <span className="cart-icon">🛒</span>
            <span className="cart-label">Cart</span>
            {cartCount > 0 && (
              <span className="cart-badge" key={cartCount}>{cartCount}</span>
            )}
          </button>
          <button className="nb-hamburger" onClick={() => setMenuOpen(p => !p)}>
            <span /><span /><span />
          </button>
        </div>
      </div>
    </header>
  );
}