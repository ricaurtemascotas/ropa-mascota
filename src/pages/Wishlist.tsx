import React from 'react';
import { Link } from 'react-router-dom';
import { getProduct } from '../data/products';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/ProductCard';
import { IconHeart, IconArrowRight } from '../components/Icons';

export const Wishlist: React.FC = () => {
  const { wishlist } = useStore();
  const items = wishlist.map(getProduct).filter(Boolean) as NonNullable<ReturnType<typeof getProduct>>[];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <nav aria-label="Migas de pan" className="text-xs text-body/70 flex items-center gap-1.5">
        <Link to="/" className="hover:text-blush font-semibold">Inicio</Link><span>/</span><span className="text-ink font-bold">Lista de deseos</span>
      </nav>
      <div className="flex items-center gap-3 mt-3">
        <h1 className="font-display text-3xl sm:text-4xl">💖 Tu lista de deseos</h1>
        <span className="bg-blush/30 text-ink text-sm font-extrabold px-3 py-1 rounded-full">{items.length}</span>
      </div>

      {items.length === 0 ? (
        <div className="bg-paper border border-pinky/50 rounded-3xl p-14 text-center shadow-card mt-8">
          <span className="inline-flex w-16 h-16 rounded-full bg-pinky/50 items-center justify-center"><IconHeart className="w-8 h-8 text-blush" /></span>
          <h2 className="font-display text-2xl mt-4">Aún no has guardado prendas</h2>
          <p className="text-sm text-body/70 mt-2 max-w-md mx-auto">Toca el corazón 💖 en cualquier producto para guardarlo aquí y comprarlo cuando quieras.</p>
          <Link to="/tienda" className="inline-flex items-center gap-2 mt-5 bg-blush text-ink font-extrabold px-7 py-3.5 rounded-full shadow-blush hover:bg-pinky transition-all">
            Explorar tienda <IconArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-8">
          {items.map((p, i) => <ProductCard key={p.id} product={p} delay={i * 60} />)}
        </div>
      )}
    </div>
  );
};
