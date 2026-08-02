import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { formatCOP, FREE_SHIPPING_MIN } from '../data/products';
import { useStore } from '../context/StoreContext';
import { IconArrowRight, IconCheck, IconMinus, IconPlus, IconShield, IconTrash, IconTruck } from '../components/Icons';

export const CartPage: React.FC = () => {
  const { cartDetails, updateQty, removeFromCart, cartSubtotal, coupon, applyCoupon, removeCoupon, couponDiscount } = useStore();
  const [code, setCode] = useState('');
  const navigate = useNavigate();

  const remaining = FREE_SHIPPING_MIN - cartSubtotal;
  const progress = Math.min(100, (cartSubtotal / FREE_SHIPPING_MIN) * 100);
  const shipping = cartSubtotal >= FREE_SHIPPING_MIN ? 0 : 8000;

  if (cartDetails.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <span className="text-7xl">🛍️</span>
        <h1 className="font-display text-3xl sm:text-4xl mt-5">Tu carrito está vacío</h1>
        <p className="text-body mt-3 max-w-md mx-auto">Descubre abrigos tejidos, impermeables y prendas posquirúrgicas hechas a mano para tu peludo.</p>
        <Link to="/tienda" className="inline-flex items-center gap-2 mt-6 bg-blush text-ink font-extrabold px-7 py-3.5 rounded-full shadow-blush hover:bg-pinky transition-all">
          Explorar tienda <IconArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <nav aria-label="Migas de pan" className="text-xs text-body/70 flex items-center gap-1.5">
        <Link to="/" className="hover:text-blush font-semibold">Inicio</Link><span>/</span><span className="text-ink font-bold">Carrito</span>
      </nav>
      <h1 className="font-display text-3xl sm:text-4xl mt-3">🛒 Tu carrito <span className="text-lg text-body/70 font-sans">({cartDetails.reduce((s, i) => s + i.qty, 0)} artículos)</span></h1>

      {/* Progreso envío gratis */}
      <div className="mt-6 bg-mint/40 border border-mint rounded-2xl p-4">
        {remaining > 0 ? (
          <>
            <p className="text-sm font-bold text-ink flex items-center gap-2">
              <IconTruck className="w-5 h-5 text-blush" />
              Te faltan <span className="text-blush">{formatCOP(remaining)}</span> para el envío GRATIS en Ibagué
            </p>
            <div className="mt-2.5 h-2.5 bg-paper rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-blush to-pinky rounded-full transition-all duration-700" style={{ width: `${progress}%` }} />
            </div>
          </>
        ) : (
          <p className="text-sm font-extrabold text-ink flex items-center gap-2">
            <IconCheck className="w-5 h-5 text-green-600" /> ¡Felicidades! Tu envío es GRATIS 🎉
          </p>
        )}
      </div>

      <div className="grid lg:grid-cols-[1fr_380px] gap-8 mt-8 items-start">
        {/* Items */}
        <div className="space-y-4">
          {cartDetails.map((item, idx) => (
            <div key={`${item.productId}-${item.size}-${item.color}`} className="bg-paper border border-pinky/50 rounded-3xl p-4 flex gap-4 shadow-card">
              <img src={item.product.images[0]} alt={item.product.name} loading="lazy" className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover cursor-pointer" onClick={() => navigate(`/producto/${item.product.id}`)} />
              <div className="flex-1 min-w-0">
                <div className="flex justify-between gap-2">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-blush">SKU {item.product.sku}</p>
                    <Link to={`/producto/${item.product.id}`} className="font-bold text-ink hover:text-blush transition-colors text-sm sm:text-base leading-snug">{item.product.name}</Link>
                    <p className="text-xs text-body/70 mt-1">Talla {item.size} • Color: {item.color} • Hecho a mano</p>
                  </div>
                  <button onClick={() => removeFromCart(idx)} aria-label="Eliminar artículo" className="w-8 h-8 rounded-full hover:bg-blush/20 flex items-center justify-center text-body/60 hover:text-blush transition-colors shrink-0">
                    <IconTrash />
                  </button>
                </div>
                <div className="flex items-center justify-between mt-3 flex-wrap gap-2">
                  <div className="flex items-center border border-body/25 rounded-full overflow-hidden">
                    <button onClick={() => updateQty(idx, item.qty - 1)} className="px-3 py-1.5 hover:bg-pinky/40 transition-colors" aria-label="Reducir"><IconMinus className="w-3.5 h-3.5" /></button>
                    <span className="px-3 text-sm font-extrabold text-ink">{item.qty}</span>
                    <button onClick={() => updateQty(idx, item.qty + 1)} className="px-3 py-1.5 hover:bg-pinky/40 transition-colors" aria-label="Aumentar"><IconPlus className="w-3.5 h-3.5" /></button>
                  </div>
                  <div className="text-right">
                    {item.product.originalPrice && <span className="block text-xs text-body/50 line-through">{formatCOP(item.product.originalPrice * item.qty)}</span>}
                    <span className="font-extrabold text-ink text-lg">{formatCOP(item.product.price * item.qty)}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
          <Link to="/tienda" className="inline-flex items-center gap-2 text-sm font-bold text-ink underline decoration-blush decoration-2 underline-offset-4 hover:text-blush transition-colors">
            ← Seguir comprando
          </Link>
        </div>

        {/* Resumen */}
        <aside className="bg-paper border border-pinky/50 rounded-3xl p-6 shadow-card lg:sticky lg:top-28">
          <h2 className="font-display text-xl">Resumen del pedido</h2>

          {/* Cupón */}
          <div className="mt-4">
            {coupon ? (
              <div className="flex items-center justify-between bg-mint/60 border border-mint rounded-xl px-3 py-2.5">
                <span className="text-xs font-bold text-ink">🎟️ Cupón {coupon} aplicado (−{formatCOP(couponDiscount)})</span>
                <button onClick={removeCoupon} className="text-[11px] text-body underline hover:text-blush">Quitar</button>
              </div>
            ) : (
              <form onSubmit={(e) => { e.preventDefault(); if (applyCoupon(code)) setCode(''); }} className="flex gap-2">
                <input
                  value={code} onChange={(e) => setCode(e.target.value)}
                  placeholder="Cupón (BIENVENIDO10, RICAURTE15)"
                  aria-label="Código promocional"
                  className="flex-1 border border-body/25 rounded-full px-4 py-2.5 text-xs focus:border-blush focus:outline-none bg-cream/40"
                />
                <button type="submit" className="bg-ink text-paper text-xs font-bold px-4 rounded-full hover:bg-body transition-colors">Aplicar</button>
              </form>
            )}
          </div>

          <dl className="mt-5 space-y-2.5 text-sm">
            <div className="flex justify-between"><dt className="text-body">Subtotal</dt><dd className="font-bold text-ink">{formatCOP(cartSubtotal)}</dd></div>
            <div className="flex justify-between"><dt className="text-body">Descuento</dt><dd className="font-bold text-green-700">−{formatCOP(couponDiscount)}</dd></div>
            <div className="flex justify-between"><dt className="text-body">Envío (Ibagué estándar)</dt><dd className={`font-bold ${shipping === 0 ? 'text-green-700' : 'text-ink'}`}>{shipping === 0 ? 'GRATIS' : formatCOP(shipping)}</dd></div>
            <div className="flex justify-between"><dt className="text-body">Impuestos</dt><dd className="font-bold text-ink">Incluidos ✓</dd></div>
            <div className="flex justify-between border-t-2 border-dashed border-pinky pt-3 text-base"><dt className="font-extrabold text-ink">Total</dt><dd className="font-extrabold text-ink text-xl">{formatCOP(cartSubtotal - couponDiscount + shipping)}</dd></div>
          </dl>

          <button
            onClick={() => navigate('/checkout')}
            className="w-full mt-5 bg-blush text-ink font-extrabold py-4 rounded-full shadow-blush hover:bg-pinky active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            Finalizar compra <IconArrowRight className="w-4 h-4" />
          </button>

          <div className="mt-4 space-y-2">
            <p className="flex items-center gap-2 text-[11px] text-body/70"><IconShield className="w-4 h-4 text-mint" /> Compra protegida por la garantía Ricaurte Mascotas</p>
            <p className="flex items-center gap-2 text-[11px] text-body/70"><IconCheck className="w-4 h-4 text-green-600" /> Pagos seguros: Nequi, Daviplata, transferencia, contra entrega</p>
            <p className="flex items-center gap-2 text-[11px] text-body/70"><IconTruck className="w-4 h-4 text-blush" /> Recogida gratis en veterinaria Animalandia</p>
          </div>
          <div className="flex flex-wrap gap-1.5 mt-4">
            {['Nequi', 'Daviplata', 'Bancolombia', 'PSE', 'COD'].map((p) => (
              <span key={p} className="bg-cream border border-pinky/50 text-[10px] font-bold px-2.5 py-1 rounded-full text-ink">{p}</span>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
};
