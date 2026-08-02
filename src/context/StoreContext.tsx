import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { PRODUCTS, COUPONS, type Product } from '../data/products';

// ─── Tipos ────────────────────────────────────────────────────────────────
export interface CartItem {
  productId: string;
  size: string;
  color: string;
  qty: number;
}

export interface User {
  name: string;
  email: string;
}

export interface Order {
  id: string;
  date: string;
  items: CartItem[];
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  payment: string;
  delivery: string;
  address: string;
  status: 'Procesando' | 'Enviado' | 'En tránsito' | 'Entregado';
}

export interface Toast { id: number; msg: string; emoji?: string; }

interface StoreCtx {
  cart: CartItem[];
  cartCount: number;
  cartSubtotal: number;
  cartDetails: (CartItem & { product: Product })[];
  addToCart: (item: CartItem, silent?: boolean) => void;
  updateQty: (index: number, qty: number) => void;
  removeFromCart: (index: number) => void;
  clearCart: () => void;
  wishlist: string[];
  toggleWishlist: (id: string) => void;
  isWishlisted: (id: string) => boolean;
  coupon: string | null;
  couponDiscount: number;
  applyCoupon: (code: string) => boolean;
  removeCoupon: () => void;
  user: User | null;
  login: (name: string, email: string) => void;
  logout: () => void;
  orders: Order[];
  placeOrder: (o: Omit<Order, 'id' | 'date' | 'status'>) => Order;
  requestReturn: (orderId: string, reason: string) => void;
  searchProducts: (q: string) => Product[];
  toasts: Toast[];
  addToast: (msg: string, emoji?: string) => void;
  cartOpen: boolean;
  setCartOpen: (v: boolean) => void;
  quickView: string | null;
  setQuickView: (id: string | null) => void;
  loginOpen: boolean;
  setLoginOpen: (v: boolean) => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (v: boolean) => void;
  searchOpen: boolean;
  setSearchOpen: (v: boolean) => void;
}

const Ctx = createContext<StoreCtx | null>(null);

// ─── Persistencia ─────────────────────────────────────────────────────────
function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

const save = (key: string, value: unknown) => {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* noop */ }
};

// ─── Normalización + Levenshtein (búsqueda tolerante) ────────────────────
export const normalize = (s: string) =>
  s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

function levenshtein(a: string, b: string): number {
  if (Math.abs(a.length - b.length) > 2) return 3;
  const dp: number[][] = Array.from({ length: a.length + 1 }, () => Array(b.length + 1).fill(0));
  for (let i = 0; i <= a.length; i++) dp[i][0] = i;
  for (let j = 0; j <= b.length; j++) dp[0][j] = j;
  for (let i = 1; i <= a.length; i++)
    for (let j = 1; j <= b.length; j++)
      dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
  return dp[a.length][b.length];
}

// ─── Pedidos demo ─────────────────────────────────────────────────────────
const DEMO_ORDERS: Order[] = [
  {
    id: 'RM-2025-0381', date: '2025-01-12', items: [{ productId: 'sueter-nordico', size: 'S', color: 'Crema', qty: 1 }],
    subtotal: 54900, shipping: 0, discount: 0, total: 54900, payment: 'Nequi', delivery: 'Envío estándar (2-3 días)',
    address: 'Cra 5 # 10-24, Barrio Centro, Ibagué', status: 'Entregado',
  },
  {
    id: 'RM-2025-0417', date: '2025-01-28', items: [{ productId: 'bata-posquirurgica-gato', size: 'S', color: 'Celeste', qty: 2 }],
    subtotal: 77800, shipping: 8000, discount: 0, total: 85800, payment: 'Daviplata', delivery: 'Envío exprés (24h)',
    address: 'Mz 12 Casa 8, Mirolindo, Ibagué', status: 'En tránsito',
  },
];

// ─── Proveedor ────────────────────────────────────────────────────────────
export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>(() => load('rm_cart', []));
  const [wishlist, setWishlist] = useState<string[]>(() => load('rm_wishlist', []));
  const [user, setUser] = useState<User | null>(() => load('rm_user', null));
  const [orders, setOrders] = useState<Order[]>(() => load('rm_orders', DEMO_ORDERS));
  const [coupon, setCoupon] = useState<string | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [quickView, setQuickView] = useState<string | null>(null);
  const [loginOpen, setLoginOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => save('rm_cart', cart), [cart]);
  useEffect(() => save('rm_wishlist', wishlist), [wishlist]);
  useEffect(() => save('rm_user', user), [user]);
  useEffect(() => save('rm_orders', orders), [orders]);

  const addToast = useCallback((msg: string, emoji = '✅') => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, msg, emoji }]);
    window.setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 2800);
  }, []);

  const cartDetails = useMemo(
    () =>
      cart
        .map((it) => ({ ...it, product: PRODUCTS.find((p) => p.id === it.productId)! }))
        .filter((it) => Boolean(it.product)),
    [cart],
  );

  const cartCount = useMemo(() => cart.reduce((s, i) => s + i.qty, 0), [cart]);
  const cartSubtotal = useMemo(() => cartDetails.reduce((s, i) => s + i.product.price * i.qty, 0), [cartDetails]);

  const addToCart = useCallback(
    (item: CartItem, silent = false) => {
      setCart((c) => {
        const idx = c.findIndex((i) => i.productId === item.productId && i.size === item.size && i.color === item.color);
        if (idx >= 0) {
          const copy = [...c];
          copy[idx] = { ...copy[idx], qty: copy[idx].qty + item.qty };
          return copy;
        }
        return [...c, item];
      });
      if (!silent) addToast(`${PRODUCTS.find((p) => p.id === item.productId)?.name ?? 'Producto'} añadido al carrito`, '🛒');
    },
    [addToast],
  );

  const updateQty = useCallback((index: number, qty: number) => {
    setCart((c) => c.map((it, i) => (i === index ? { ...it, qty: Math.max(1, qty) } : it)));
  }, []);

  const removeFromCart = useCallback((index: number) => {
    setCart((c) => c.filter((_, i) => i !== index));
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const toggleWishlist = useCallback(
    (id: string) => {
      setWishlist((w) => {
        const has = w.includes(id);
        addToast(has ? 'Eliminado de tu lista de deseos' : 'Guardado en tu lista de deseos', has ? '💔' : '💖');
        return has ? w.filter((x) => x !== id) : [...w, id];
      });
    },
    [addToast],
  );

  const isWishlisted = useCallback((id: string) => wishlist.includes(id), [wishlist]);

  const applyCoupon = useCallback(
    (code: string) => {
      const key = code.trim().toUpperCase();
      if (COUPONS[key]) {
        setCoupon(key);
        addToast(`Cupón ${key} aplicado: ${Math.round(COUPONS[key] * 100)}% de descuento`, '🎟️');
        return true;
      }
      addToast('Cupón no válido o expirado', '⚠️');
      return false;
    },
    [addToast],
  );

  const removeCoupon = useCallback(() => setCoupon(null), []);
  const couponDiscount = coupon ? Math.round(cartSubtotal * COUPONS[coupon]) : 0;

  const login = useCallback((name: string, email: string) => {
    setUser({ name, email });
    save('rm_user', { name, email });
    addToast(`¡Hola, ${name.split(' ')[0]}! Sesión iniciada`, '👋');
  }, [addToast]);

  const logout = useCallback(() => {
    setUser(null);
    save('rm_user', null);
    addToast('Sesión cerrada. ¡Vuelve pronto!', '👋');
  }, [addToast]);

  const placeOrder = useCallback((o: Omit<Order, 'id' | 'date' | 'status'>) => {
    const id = `RM-2025-${Math.floor(1000 + Math.random() * 9000)}`;
    const order: Order = { ...o, id, date: new Date().toISOString().slice(0, 10), status: 'Procesando' };
    setOrders((prev) => [order, ...prev]);
    setCart([]);
    setCoupon(null);
    return order;
  }, []);

  const requestReturn = useCallback((orderId: string, reason: string) => {
    addToast(`Solicitud de ${reason} registrada para el pedido ${orderId}. Te contactaremos en menos de 24h.`, '📦');
  }, [addToast]);

  const searchProducts = useCallback(
    (q: string) => {
      const query = normalize(q.trim());
      if (!query) return [];
      const tokens = query.split(/\s+/).filter(Boolean);
      const scored = PRODUCTS.map((p) => {
        const name = normalize(p.name);
        const tags = p.tags.map(normalize).join(' ');
        const cat = normalize(p.category);
        const haystack = `${name} ${tags} ${cat} ${normalize(p.shortDesc)}`;
        let score = 0;
        // coincidencia exacta / parcial
        if (name === query) score += 100;
        if (name.includes(query)) score += 60;
        for (const t of tokens) {
          if (name.includes(t)) score += 30;
          if (tags.includes(t)) score += 15;
          if (haystack.includes(t)) score += 5;
          // tolerancia ortográfica
          for (const word of name.split(' ')) {
            const d = levenshtein(t, word);
            if (d === 1) score += 20;
            else if (d === 2) score += 8;
          }
        }
        return { p, score };
      })
        .filter((x) => x.score > 0)
        .sort((a, b) => b.score - a.score)
        .map((x) => x.p);
      return scored.slice(0, 6);
    },
    [],
  );

  const value: StoreCtx = {
    cart, cartCount, cartSubtotal, cartDetails, addToCart, updateQty, removeFromCart, clearCart,
    wishlist, toggleWishlist, isWishlisted,
    coupon, couponDiscount, applyCoupon, removeCoupon,
    user, login, logout, orders, placeOrder, requestReturn,
    searchProducts, toasts, addToast,
    cartOpen, setCartOpen, quickView, setQuickView, loginOpen, setLoginOpen,
    mobileMenuOpen, setMobileMenuOpen, searchOpen, setSearchOpen,
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
};

export const useStore = () => {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useStore debe usarse dentro de StoreProvider');
  return ctx;
};
