import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { discountOf, formatCOP, getProduct } from '../data/products';
import { useStore } from '../context/StoreContext';
import { IconArrowRight, IconCart, IconHeart, IconX, StarRating } from './Icons';

export const QuickView: React.FC = () => {
  const { quickView, setQuickView, addToCart, toggleWishlist, isWishlisted } = useStore();
  const navigate = useNavigate();
  const product = quickView ? getProduct(quickView) : null;

  const [size, setSize] = useState('');
  const [color, setColor] = useState('');
  const [qty, setQty] = useState(1);

  useEffect(() => {
    if (product) {
      setSize(product.sizes[0]);
      setColor(product.colors[0].name);
      setQty(1);
    }
  }, [quickView]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    document.body.style.overflow = product ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [product]);

  if (!product) return null;
  const disc = discountOf(product);

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label={`Vista rápida de ${product.name}`}>
      <div className="absolute inset-0 bg-ink/60 backdrop-blur-sm anim-fade-in" onClick={() => setQuickView(null)} />
      <div className="relative bg-paper rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto anim-pop grid md:grid-cols-2">
        <button
          onClick={() => setQuickView(null)}
          aria-label="Cerrar vista rápida"
          className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-paper shadow flex items-center justify-center hover:bg-pinky transition-colors"
        >
          <IconX />
        </button>

        <div className="relative aspect-square md:aspect-auto md:h-full bg-cream">
          <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
          {disc > 0 && (
            <span className="absolute top-3 left-3 bg-blush text-ink text-xs font-bold px-2.5 py-1 rounded-full shadow">-{disc}%</span>
          )}
        </div>

        <div className="p-6 flex flex-col">
          <p className="text-[11px] font-bold uppercase tracking-widest text-blush">{product.species} • SKU {product.sku}</p>
          <h3 className="font-display text-2xl mt-1 leading-tight">{product.name}</h3>
          <div className="flex items-center gap-2 mt-2">
            <StarRating rating={product.rating} />
            <span className="text-xs text-body/70">{product.rating} ({product.reviewCount} reseñas)</span>
          </div>

          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-ink">{formatCOP(product.price)}</span>
            {product.originalPrice && <span className="text-sm text-body/60 line-through">{formatCOP(product.originalPrice)}</span>}
            <span className="text-[11px] text-body/60">IVA incluido</span>
          </div>

          <p className="mt-3 text-sm text-body leading-relaxed">{product.shortDesc}</p>

          <div className="mt-4">
            <span className="text-xs font-semibold text-ink">Talla: <span className="text-body font-normal">{size}</span></span>
            <div className="flex gap-2 mt-1.5">
              {product.sizes.map((s) => (
                <button
                  key={s}
                  onClick={() => setSize(s)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                    size === s ? 'bg-ink text-paper border-ink shadow' : 'border-body/30 text-body hover:border-ink'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-3">
            <span className="text-xs font-semibold text-ink">Color:</span>
            <div className="flex gap-2 mt-1.5">
              {product.colors.map((c) => (
                <button
                  key={c.name}
                  onClick={() => setColor(c.name)}
                  title={c.name}
                  aria-label={`Color ${c.name}`}
                  className={`w-7 h-7 rounded-full border-2 transition-all ${color === c.name ? 'border-ink scale-110' : 'border-transparent'}`}
                  style={{ backgroundColor: c.hex }}
                />
              ))}
            </div>
          </div>

          <div className="mt-3 flex items-center gap-2">
            <span className="text-xs font-semibold text-ink">Cantidad:</span>
            <div className="flex items-center border border-body/30 rounded-full overflow-hidden">
              <button onClick={() => setQty(Math.max(1, qty - 1))} className="px-3 py-1.5 hover:bg-cream transition-colors" aria-label="Reducir cantidad">−</button>
              <span className="px-3 text-sm font-semibold text-ink">{qty}</span>
              <button onClick={() => setQty(qty + 1)} className="px-3 py-1.5 hover:bg-cream transition-colors" aria-label="Aumentar cantidad">+</button>
            </div>
          </div>

          <div className="mt-5 flex gap-2">
            <button
              onClick={() => { addToCart({ productId: product.id, size, color, qty }); setQuickView(null); }}
              className="flex-1 bg-blush text-ink font-bold py-3 rounded-full shadow-blush hover:bg-pinky active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <IconCart className="w-4.5 h-4.5" /> Añadir al carrito
            </button>
            <button
              onClick={() => toggleWishlist(product.id)}
              aria-label="Lista de deseos"
              className={`w-11 h-11 rounded-full border flex items-center justify-center transition-all ${
                isWishlisted(product.id) ? 'bg-blush text-ink border-blush' : 'border-body/30 text-body hover:border-blush hover:text-blush'
              }`}
            >
              <IconHeart className="w-4.5 h-4.5" filled={isWishlisted(product.id)} />
            </button>
          </div>

          <button
            onClick={() => { setQuickView(null); navigate(`/producto/${product.id}`); }}
            className="mt-3 text-sm font-semibold text-ink underline decoration-blush decoration-2 underline-offset-4 hover:text-blush transition-colors flex items-center justify-center gap-1"
          >
            Ver ficha completa <IconArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
