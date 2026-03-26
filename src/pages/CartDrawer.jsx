import React, { useState } from 'react';
import './CartDrawer.css';

function CartItem({ item, onRemove, onQty }) {
  return (
    <div className="ci-wrap">
      <div className="ci-img">
        <img src={item.image} alt={item.name} />
      </div>
      <div className="ci-info">
        <div className="ci-name">{item.name}</div>
        <div className="ci-unit">{item.unit}</div>
        <div className="ci-price">${(item.price * item.qty).toFixed(2)}</div>
      </div>
      <div className="ci-controls">
        <div className="ci-qty">
          <button className="qty-btn" onClick={() => onQty(item.id, -1)}>−</button>
          <span className="qty-num">{item.qty}</span>
          <button className="qty-btn" onClick={() => onQty(item.id, 1)}>+</button>
        </div>
        <button className="ci-remove" onClick={() => onRemove(item.id)} title="Remove">🗑</button>
      </div>
    </div>
  );
}

export default function CartDrawer({ items, total, onClose, onRemove, onQty }) {
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [checkingOut, setCheckingOut] = useState(false);
  const [orderDone, setOrderDone] = useState(false);

  const discount = promoApplied ? total * 0.1 : 0;
  const delivery = total >= 35 ? 0 : 3.99;
  const finalTotal = total - discount + delivery;

  const handlePromo = () => {
    if (promoCode.toUpperCase() === 'FRESH10') {
      setPromoApplied(true);
    }
  };

  const handleCheckout = async () => {
    setCheckingOut(true);
    await new Promise(r => setTimeout(r, 2000));
    setCheckingOut(false);
    setOrderDone(true);
  };

  return (
    <>
      <div className="overlay-backdrop" onClick={onClose} />
      <div className="cart-drawer">
        {/* Header */}
        <div className="cd-head">
          <div className="cd-title">
            <span className="cd-icon">🛒</span>
            <div>
              <h2>Your Cart</h2>
              <p>{items.length === 0 ? 'Empty' : `${items.reduce((s,i)=>s+i.qty,0)} items`}</p>
            </div>
          </div>
          <button className="cd-close" onClick={onClose}>✕</button>
        </div>

        {/* Progress bar */}
        {total < 35 && items.length > 0 && (
          <div className="cd-delivery-progress">
            <div className="dp-text">
              Add <strong>${(35 - total).toFixed(2)}</strong> more for free delivery 🚚
            </div>
            <div className="dp-bar">
              <div className="dp-fill" style={{ width: `${Math.min((total / 35) * 100, 100)}%` }} />
            </div>
          </div>
        )}

        {total >= 35 && items.length > 0 && (
          <div className="cd-free-delivery">🎉 You've unlocked free delivery!</div>
        )}

        {/* Items */}
        <div className="cd-items">
          {items.length === 0 ? (
            <div className="cd-empty">
              <span className="ce-emoji">🛒</span>
              <h3>Your cart is empty</h3>
              <p>Add some fresh items to get started!</p>
              <button className="ce-shop-btn" onClick={onClose}>Start Shopping →</button>
            </div>
          ) : (
            items.map(item => (
              <CartItem key={item.id} item={item} onRemove={onRemove} onQty={onQty} />
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="cd-foot">
            {/* Promo code */}
            {!promoApplied ? (
              <div className="cd-promo">
                <input
                  type="text"
                  placeholder="Promo code (try FRESH10)"
                  value={promoCode}
                  onChange={e => setPromoCode(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handlePromo()}
                />
                <button onClick={handlePromo}>Apply</button>
              </div>
            ) : (
              <div className="promo-applied">✓ FRESH10 applied — 10% off!</div>
            )}

            {/* Summary */}
            <div className="cd-summary">
              <div className="cs-row"><span>Subtotal</span><span>${total.toFixed(2)}</span></div>
              {promoApplied && (
                <div className="cs-row discount"><span>Discount</span><span>−${discount.toFixed(2)}</span></div>
              )}
              <div className="cs-row"><span>Delivery</span><span>{delivery === 0 ? <span className="free">FREE</span> : `$${delivery.toFixed(2)}`}</span></div>
              <div className="cs-row total"><span>Total</span><span>${finalTotal.toFixed(2)}</span></div>
            </div>

            {/* Checkout */}
            {orderDone ? (
              <div className="order-success">
                <span>🎉</span>
                <div>
                  <strong>Order placed!</strong>
                  <p>Your groceries are on the way.</p>
                </div>
              </div>
            ) : (
              <button
                className={`checkout-btn${checkingOut ? ' loading' : ''}`}
                onClick={handleCheckout}
                disabled={checkingOut}
              >
                {checkingOut ? (
                  <><span className="ch-spinner" />Processing…</>
                ) : (
                  <>Checkout — ${finalTotal.toFixed(2)}</>
                )}
              </button>
            )}

            <div className="cd-secure">🔒 Secure checkout · SSL encrypted</div>
          </div>
        )}
      </div>
    </>
  );
}