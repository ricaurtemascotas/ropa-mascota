import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatCOP, FREE_SHIPPING_MIN } from '../data/products';
import { useStore } from '../context/StoreContext';
import { IconArrowRight, IconCart, IconCheck, IconMinus, IconPlus, IconTrash, IconTruck, IconX } from './Icons';

export const CartDrawer: React.FC = () => {
  const { cartOpen, setCartOpen, cartDetails, updateQty, removeFromCart, cartSubtotal, coupon, applyCoupon, removeCoupon, couponDiscount } = useStore();
  const [code, setCode] = useState('');
  const navigate = useNavigate();

  if (!cartOpen) return null;
  const remaining = FREE_SHIPPING_MIN - cartSubtotal;
  const progress = Math.min(100, (cartSubtotal / FREE_SHIPPING_MIN) * 100);

  const go = (path: string) => {
    setCartOpen(false);
    navigate(path);
  };

  return (
    <div className="fixed inset-0 z-[80]" role="dialog" aria-modal="true" aria-label="Carrito de compras">
      <div className="absolute inset-0 bg-ink/60 backdrop-blur-sm anim-fade-in" onClick={() => setCartOpen(false)} />
      <aside className="absolute right-0 top-0 h-full w-full max-w-md bg-paper shadow-2xl anim-slide-right flex flex-col">
        {/* Encabezado */}
        <header className="flex items-center justify-between px-5 py-4 border-b border-pinky/50 bg-cream/60">
          <h2 className="font-display text-xl flex items-center gap-2">
            <IconCart className="w-5 h-5 text-blush" /> Tu carrito
            <span className="text-sm font-sans font-semibold text-body bg-blush/30 px-2.5 py-0.5 rounded-full">{cartDetails.reduce((s, i) => s + i.qty, 0)}</span>
          </h2>
          <button onClick={() => setCartOpen(false)} aria-label="Cerrar carrito" className="w-9 h-9 rounded-full hover:bg-pinky transition-colors flex items-center justify-center">
            <IconX />
          </button>
        </header>

        {/* Barra de progreso envío gratis */}
        <div className="px-5 py-3 bg-mint/40 border-b border-mint">
          {remaining > 0 ? (
            <div>
              <p className="text-xs font-semibold text-ink flex items-center gap-1.5">
                <IconTruck className="w-4 h-4" /> Te faltan <span className="text-blush font-extrabold">{formatCOP(remaining)}</span> para el <strong>envío GRATIS</strong>
              </p>
              <div className="mt-2 h-2 bg-paper rounded-full overflow-hidden">
                <div className="h-full bg-blush rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
              </div>
            </div>
          ) : (
            <p className="text-xs font-bold text-ink flex items-center gap-1.5">
              <IconCheck className="w-4 h-4 text-green-600" /> ¡Felicidades! Tienes <strong>envío GRATIS</strong> en Ibagué 🎉
            </p>
          )}
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {cartDetails.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center gap-3">
              <span className="text-6xl">🛍️</span>
              <p className="font-semibold text-ink">Tu carrito está vacío</p>
              <p className="text-sm text-body/70">Descubre nuestras prendas hechas a mano para tu peludo.</p>
              <button onClick={() => go('/tienda')} className="mt-2 bg-blush text-ink font-bold px-6 py-3 rounded-full shadow-blush hover:bg-pinky transition-all">
                Explorar tienda
              </button>
            </div>
          ) : (
            cartDetails.map((item, idx) => (
              <div key={`${item.productId}-${item.size}-${item.color}`} className="flex gap-3 bg-cream/50 border border-pinky/40 rounded-2xl p-3">
                <img
                  src={item.product.images[0]}
                  alt={item.product.name}
                  loading="lazy"
                  className="w-20 h-20 rounded-xl object-cover shrink-0 cursor-pointer"
                  onClick={() => go(`/producto/${item.product.id}`)}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between gap-2">
                    <p className="text-sm font-semibold text-ink line-clamp-2 leading-snug">{item.product.name}</p>
                    <button onClick={() => removeFromCart(idx)} aria-label="Eliminar artículo" className="text-body/50 hover:text-blush transition-colors shrink-0">
                      <IconTrash />
                    </button>
                  </div>
                  <p className="text-[11px] text-body/70 mt-0.5">Talla {item.size} • {item.color}</p>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center border border-body/25 rounded-full overflow-hidden">
                      <button onClick={() => updateQty(idx, item.qty - 1)} className="px-2 py-1 hover:bg-pinky/50 transition-colors" aria-label="Reducir"><IconMinus className="w-3 h-3" /></button>
                      <span className="px-2.5 text-xs font-bold text-ink">{item.qty}</span>
                      <button onClick={() => updateQty(idx, item.qty + 1)} className="px-2 py-1 hover:bg-pinky/50 transition-colors" aria-label="Aumentar"><IconPlus className="w-3 h-3" /></button>
                    </div>
                    <span className="text-sm font-extrabold text-ink">{formatCOP(item.product.price * item.qty)}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pie */}
        {cartDetails.length > 0 && (
          <footer className="border-t border-pinky/50 px-5 py-4 bg-cream/40 space-y-3">
            {/* Cupón */}
            {coupon ? (
              <div className="flex items-center justify-between bg-mint/60 border border-mint rounded-xl px-3 py-2">
                <span className="text-xs font-bold text-ink">🎟️ Cupón {coupon} (−{formatCOP(couponDiscount)})</span>
                <button onClick={removeCoupon} className="text-[11px] text-body underline hover:text-blush">Quitar</button>
              </div>
            ) : (
              <form
                onSubmit={(e) => { e.preventDefault(); if (applyCoupon(code)) setCode(''); }}
                className="flex gap-2"
              >
                <input
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="Código de cupón (ej. BIENVENIDO10)"
                  aria-label="Código de cupón"
                  className="flex-1 bg-paper border border-body/25 rounded-full px-4 py-2 text-xs focus:border-blush focus:outline-none"
                />
                <button type="submit" className="bg-ink text-paper text-xs font-bold px-4 rounded-full hover:bg-body transition-colors">Aplicar</button>
              </form>
            )}
            <div className="flex justify-between text-sm text-body">
              <span>Subtotal</span><span className="font-bold text-ink">{formatCOP(cartSubtotal)}</span>
            </div>
            <div className="flex justify-between text-sm text-body">
              <span>Envío</span>
              <span className={`font-bold ${remaining <= 0 ? 'text-green-600' : 'text-ink'}`}>{remaining <= 0 ? 'GRATIS' : 'Calculado en checkout'}</span>
            </div>
            <div className="flex justify-between text-base font-extrabold text-ink border-t border-dashed border-body/25 pt-2.5">
              <span>Total</span><span>{formatCOP(cartSubtotal - couponDiscount)}</span>
            </div>
            <button
              onClick={() => go('/checkout')}
              className="w-full bg-blush text-ink font-extrabold py-3.5 rounded-full shadow-blush hover:bg-pinky active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              Finalizar compra <IconArrowRight className="w-4 h-4" />
            </button>
            <button onClick={() => go('/carrito')} className="w-full text-sm font-semibold text-body hover:text-ink transition-colors">
              Ver carrito completo
            </button>
            <p className="text-center text-[10px] text-body/60">🔒 Pago seguro con Nequi, Daviplata, transferencia o contra entrega</p>
          </footer>
        )}
      </aside>
    </div>
  );
};
