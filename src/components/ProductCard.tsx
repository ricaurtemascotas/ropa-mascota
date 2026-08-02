import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CATEGORIES, discountOf, formatCOP, type Product } from '../data/products';
import { useStore } from '../context/StoreContext';
import { IconBolt, IconCart, IconHeart, StarRating } from './Icons';

const SIZES_LABEL = ['XS', 'S', 'M', 'L', 'XL'];

export const ProductCard: React.FC<{ product: Product; delay?: number }> = ({ product, delay = 0 }) => {
  const { addToCart, toggleWishlist, isWishlisted, setQuickView } = useStore();
  const navigate = useNavigate();
  const disc = discountOf(product);
  const wished = isWishlisted(product.id);
  const lowStock = product.stock <= 3;

  return (
    <article
      className="group relative bg-paper rounded-3xl border border-pinky/60 shadow-card hover:shadow-blush hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden anim-fade-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Imagen */}
      <div className="relative aspect-square overflow-hidden bg-cream cursor-pointer" onClick={() => navigate(`/producto/${product.id}`)}>
        <img
          src={product.images[0]}
          alt={product.name}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.badge && (
            <span className="bg-ink text-pinky text-[11px] font-bold px-2.5 py-1 rounded-full shadow">{product.badge}</span>
          )}
          {disc > 0 && (
            <span className="bg-blush text-ink text-[11px] font-bold px-2.5 py-1 rounded-full shadow">-{disc}%</span>
          )}
          {product.isNew && (
            <span className="bg-mint text-ink text-[11px] font-bold px-2.5 py-1 rounded-full shadow">✨ Nuevo</span>
          )}
          {product.bestSeller && !product.isNew && !product.badge && !disc && (
            <span className="bg-pinky text-ink text-[11px] font-bold px-2.5 py-1 rounded-full shadow">🔥 Más vendido</span>
          )}
        </div>
        {lowStock && (
          <span className="absolute bottom-3 left-3 bg-paper/95 text-ink text-[11px] font-semibold px-2.5 py-1 rounded-full shadow flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-blush anim-pulse-dot" /> ¡Últimas {product.stock}!
          </span>
        )}
        {/* Wishlist */}
        <button
          onClick={(e) => { e.stopPropagation(); toggleWishlist(product.id); }}
          aria-label={wished ? 'Quitar de deseos' : 'Agregar a deseos'}
          className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center shadow transition-all ${
            wished ? 'bg-blush text-ink scale-110' : 'bg-paper/90 text-ink hover:bg-blush'
          }`}
        >
          <IconHeart className="w-4.5 h-4.5" filled={wished} />
        </button>
        {/* Quick view */}
        <button
          onClick={(e) => { e.stopPropagation(); setQuickView(product.id); }}
          className="absolute inset-x-3 bottom-3 translate-y-14 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300 bg-ink/85 text-paper text-xs font-semibold py-2.5 rounded-full backdrop-blur hover:bg-ink"
        >
          👁 Vista rápida
        </button>
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-center gap-2 text-[11px] text-body/70 mb-1">
          <span className="font-semibold uppercase tracking-wide text-blush">{product.species}</span>
          <span>•</span>
          <span>{CATEGORIES.find((c) => c.id === product.category)?.name}</span>
        </div>
        <h3 className="font-semibold text-ink text-[15px] leading-snug line-clamp-2 min-h-[2.6em]">
          <Link to={`/producto/${product.id}`} className="hover:text-blush transition-colors">{product.name}</Link>
        </h3>
        <div className="flex items-center gap-1.5 mt-1.5">
          <StarRating rating={product.rating} className="w-3.5 h-3.5" />
          <span className="text-[11px] text-body/70">({product.reviewCount})</span>
        </div>
        <div className="mt-auto pt-3 flex items-end justify-between gap-2">
          <div>
            {product.originalPrice && (
              <span className="block text-xs text-body/60 line-through">{formatCOP(product.originalPrice)}</span>
            )}
            <span className="text-lg font-extrabold text-ink">{formatCOP(product.price)}</span>
          </div>
          <button
            onClick={() => addToCart({ productId: product.id, size: product.sizes[0], color: product.colors[0].name, qty: 1 })}
            aria-label={`Añadir ${product.name} al carrito`}
            className="w-10 h-10 rounded-full bg-blush text-ink flex items-center justify-center shadow-blush hover:scale-110 hover:bg-pinky active:scale-95 transition-all"
          >
            <IconCart className="w-4.5 h-4.5" />
          </button>
        </div>
        <div className="mt-2 flex items-center gap-1 text-[10px] text-body/60">
          <IconBolt className="w-3 h-3 text-amber-500" /> Envío 24–48h en Ibagué
        </div>
      </div>
    </article>
  );
};

export { SIZES_LABEL };
