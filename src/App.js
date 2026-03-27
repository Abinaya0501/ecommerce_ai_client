import React, { useState, useEffect } from 'react';
import Navbar from './pages/Navbar';
import HeroSection from './pages/HeroSection';
import CategorySection from './pages/CategorySection';
import ProductSection from './pages/ProductSection';
import DealsSection from './pages/DealsSection';
import AboutSection from './pages/AboutSection';
import CartDrawer from './pages/CartDrawer';
import Toast from './pages/Toast';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import './App.css';

export default function App() {
  const [cartItems, setCartItems] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState('landing');
  const [user, setUser] = useState(null);

  // Check for existing login on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
    }
    const t = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(t);
  }, []);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
  };

  const addToCart = (product) => {
    setCartItems(prev => {
      const ex = prev.find(i => i.id === product.id);
      if (ex) return prev.map(i => i.id === product.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { ...product, qty: 1 }];
    });
    showToast(`${product.name} added to cart!`);
  };

  const removeFromCart = (id) => {
    setCartItems(prev => prev.filter(i => i.id !== id));
  };

  const updateQty = (id, delta) => {
    setCartItems(prev => {
      const updated = prev.map(i => i.id === id ? { ...i, qty: Math.max(0, i.qty + delta) } : i);
      return updated.filter(i => i.qty > 0);
    });
  };

  const cartCount = cartItems.reduce((s, i) => s + i.qty, 0);
  const cartTotal = cartItems.reduce((s, i) => s + i.price * i.qty, 0);

  const handleNavigate = (page) => {
    setCurrentPage(page);
  };

  const handleLoginSuccess = (userData, token) => {
    setUser(userData);
    setCurrentPage('landing');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setCurrentPage('landing');
  };

  // Render different pages based on currentPage state
  if (currentPage === 'login') {
    return <LoginPage onNavigate={handleNavigate} onLoginSuccess={handleLoginSuccess} />;
  }

  if (currentPage === 'signup') {
    return <SignupPage onNavigate={handleNavigate} onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="app-root">
      <Navbar
        cartCount={cartCount}
        onCartOpen={() => setCartOpen(true)}
        searchQuery={searchQuery}
        onSearch={setSearchQuery}
        user={user}
        onLoginClick={() => handleNavigate('login')}
        onLogout={handleLogout}
      />
      <main className="app-main">
        <HeroSection loading={loading} onNavigate={handleNavigate} />
        <CategorySection
          loading={loading}
          activeCategory={activeCategory}
          onSelect={setActiveCategory}
        />
        <ProductSection
          loading={loading}
          activeCategory={activeCategory}
          searchQuery={searchQuery}
          onAddToCart={addToCart}
          cartItems={cartItems}
        />
        <DealsSection loading={loading} onAddToCart={addToCart} />
        <AboutSection loading={loading} />
      </main>
      {cartOpen && (
        <CartDrawer
          items={cartItems}
          total={cartTotal}
          onClose={() => setCartOpen(false)}
          onRemove={removeFromCart}
          onQty={updateQty}
        />
      )}
      {toast && (
        <Toast message={toast.msg} type={toast.type} onDone={() => setToast(null)} />
      )}
    </div>
  );
}