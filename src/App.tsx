import React, { useEffect } from 'react';
import { HashRouter, Link, Route, Routes, useLocation } from 'react-router-dom';
import { StoreProvider, useStore } from './context/StoreContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { QuickView } from './components/QuickView';
import { LoginModal } from './components/LoginModal';
import { WhatsAppButton } from './components/WhatsAppButton';
import { Home } from './pages/Home';
import { Shop } from './pages/Shop';
import { ProductDetail } from './pages/ProductDetail';
import { CartPage } from './pages/CartPage';
import { Checkout } from './pages/Checkout';
import { ThankYou } from './pages/ThankYou';
import { Account } from './pages/Account';
import { Wishlist } from './pages/Wishlist';
import { Faq } from './pages/Faq';
import { Legal } from './pages/Legal';

// ─── Scroll + título por ruta ─────────────────────────────────────────────
const TITLES: [string, string][] = [
  ['/', 'Ricaurte Mascotas | Prendas Hechas a Mano para Perros y Gatos en Ibagué'],
  ['/tienda', 'Tienda | Ricaurte Mascotas — Prendas Artesanales para Mascotas'],
  ['/carrito', 'Carrito | Ricaurte Mascotas'],
  ['/checkout', 'Pago seguro | Ricaurte Mascotas'],
  ['/cuenta', 'Mi cuenta | Ricaurte Mascotas'],
  ['/deseos', 'Lista de deseos | Ricaurte Mascotas'],
  ['/faq', 'Centro de ayuda | Ricaurte Mascotas'],
  ['/garantia', 'Garantía | Ricaurte Mascotas'],
];

const RouteEffects: React.FC = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0 });
    const match = TITLES.find(([p]) => pathname.startsWith(p));
    if (match) document.title = match[1];
  }, [pathname]);
  return null;
};

// ─── Toasts ───────────────────────────────────────────────────────────────
const Toasts: React.FC = () => {
  const { toasts } = useStore();
  return (
    <div className="fixed bottom-24 lg:bottom-8 left-1/2 -translate-x-1/2 z-[100] space-y-2 w-[92%] max-w-sm pointer-events-none" aria-live="polite">
      {toasts.map((t) => (
        <div key={t.id} className="bg-ink text-paper text-sm font-bold px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-2.5 anim-pop">
          <span className="text-lg">{t.emoji}</span>
          <span className="flex-1">{t.msg}</span>
        </div>
      ))}
    </div>
  );
};

// ─── 404 ──────────────────────────────────────────────────────────────────
const NotFound: React.FC = () => (
  <div className="max-w-3xl mx-auto px-4 py-24 text-center">
    <span className="text-7xl">🐕‍🦺</span>
    <h1 className="font-display text-4xl mt-5">¡Ups! Página extraviada</h1>
    <p className="text-body mt-3">Esta página se perdió en un paseo. Volvamos a casa.</p>
    <Link to="/" className="inline-block mt-6 bg-blush text-ink font-extrabold px-7 py-3.5 rounded-full shadow-blush hover:bg-pinky transition-all">Ir al inicio</Link>
  </div>
);

// ─── App ──────────────────────────────────────────────────────────────────
const App: React.FC = () => (
  <StoreProvider>
    <HashRouter>
      <RouteEffects />
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/tienda" element={<Shop />} />
            <Route path="/producto/:id" element={<ProductDetail />} />
            <Route path="/carrito" element={<CartPage />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/gracias/:orderId" element={<ThankYou />} />
            <Route path="/cuenta" element={<Account />} />
            <Route path="/deseos" element={<Wishlist />} />
            <Route path="/faq" element={<Faq />} />
            <Route path="/legal/:tipo" element={<Legal />} />
            <Route path="/garantia" element={<Legal tipo="garantia" />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
      <CartDrawer />
      <QuickView />
      <LoginModal />
      <WhatsAppButton />
      <Toasts />
    </HashRouter>
  </StoreProvider>
);

export default App;
