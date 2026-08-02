import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CATEGORIES, formatCOP } from "../data/products";
import { useStore } from "../context/StoreContext";
import {
  IconCart,
  IconChevronDown,
  IconHeart,
  IconMenu,
  IconPaw,
  IconSearch,
  IconTruck,
  IconUser,
  IconWhatsApp,
  IconX,
} from "./Icons";

// ─── Barra de anuncios ────────────────────────────────────────────────────
const AnnouncementBar: React.FC = () => {
  const msgs = [
  { text: '🚚 Envío GRATIS en compras superiores a $100.000 COP en Ibagué', short: '🚚 Envío GRATIS en compras +$100k en Ibagué' },
  { text: '🐾 Avalado por la garantía de Ricaurte Mascotas', short: '🐾 Avalado por Ricaurte Mascotas' },
  { text: '🧶 Prendas 100% hechas a mano en Ibagué, Colombia', short: '🧶 Prendas hechas a mano en Ibagué' },
  { text: '🎁 Suscríbete y recibe 10% OFF en tu primera compra', short: '🎁 10% OFF en tu primera compra' },
];
  const strip = [...msgs, ...msgs];
  return (
    <div
      className="bg-ink text-pinky text-[11px] sm:text-xs font-semibold overflow-hidden py-1.5"
      aria-label="Anuncios"
    >
      <div className="flex w-max anim-marquee">
        {strip.map((m, i) => (
  <span key={i} className="whitespace-nowrap px-6 sm:px-8">
    <span className="hidden sm:inline">{m.text}</span>
    <span className="sm:hidden">{m.short}</span>
    <span className="text-blush mx-2">★</span>
  </span>
))}
      </div>
    </div>
  );
};

// ─── Búsqueda inteligente ─────────────────────────────────────────────────
const SearchBox: React.FC<{ mobile?: boolean; onDone?: () => void }> = ({
  mobile = false,
  onDone,
}) => {
  const { searchProducts, setSearchOpen } = useStore();
  const [q, setQ] = useState("");
  const [focused, setFocused] = useState(false);
  const navigate = useNavigate();
  const results = searchProducts(q);
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node))
        setFocused(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!q.trim()) return;
    setSearchOpen(false);
    setFocused(false);
    onDone?.();
    navigate(`/tienda?busqueda=${encodeURIComponent(q.trim())}`);
    setQ("");
  };

  return (
    <div
      ref={boxRef}
      className={`relative ${mobile ? "w-full" : "w-full max-w-md"}`}
    >
      <form onSubmit={submit} role="search" aria-label="Buscar productos">
        <div className="relative">
          <IconSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-body/50" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onFocus={() => setFocused(true)}
            placeholder="Busca: suéter, impermeable, posquirúrgico…"
            aria-label="Buscar productos"
            className="w-full bg-paper border border-body/20 rounded-full pl-10 pr-4 py-2.5 text-sm shadow-sm focus:border-blush focus:shadow-blush focus:outline-none transition-all"
          />
        </div>
      </form>

      {focused && q.trim().length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-paper rounded-2xl shadow-2xl border border-pinky/50 overflow-hidden z-50 anim-pop">
          <p className="px-4 pt-3 pb-1 text-[10px] font-bold uppercase tracking-widest text-body/60">
            {results.length
              ? "Sugerencias en tiempo real"
              : "Sin resultados — revisa la ortografía o prueba otra palabra"}
          </p>
          {results.map((p) => (
            <button
              key={p.id}
              onClick={() => {
                setSearchOpen(false);
                onDone?.();
                navigate(`/producto/${p.id}`);
                setQ("");
                setFocused(false);
              }}
              className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-cream transition-colors text-left"
            >
              <img
                src={p.images[0]}
                alt=""
                className="w-11 h-11 rounded-xl object-cover bg-cream"
              />
              <span className="flex-1 min-w-0">
                <span className="block text-sm font-semibold text-ink truncate">
                  {p.name}
                </span>
                <span className="block text-[11px] text-body/70">
                  {CATEGORIES.find((c) => c.id === p.category)?.name} •{" "}
                  {p.species}
                </span>
              </span>
              <span className="text-sm font-extrabold text-ink shrink-0">
                {formatCOP(p.price)}
              </span>
            </button>
          ))}
          <button
            onClick={submit}
            className="w-full bg-ink text-paper text-xs font-bold py-3 hover:bg-body transition-colors"
          >
            Ver todos los resultados para “{q}” →
          </button>
        </div>
      )}
    </div>
  );
};

// ─── Header principal ─────────────────────────────────────────────────────
export const Header: React.FC = () => {
  const {
    cartCount,
    wishlist,
    setCartOpen,
    setLoginOpen,
    user,
    setMobileMenuOpen,
    mobileMenuOpen,
    searchOpen,
    setSearchOpen,
  } = useStore();
  const navigate = useNavigate();
  const [megaOpen, setMegaOpen] = useState(false);
  const megaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (megaRef.current && !megaRef.current.contains(e.target as Node))
        setMegaOpen(false);
    };
    document.addEventListener("mouseover", close);
    return () => document.removeEventListener("mouseover", close);
  }, []);

  return (
    <>
      <AnnouncementBar />
      <header className="sticky top-0 z-50 bg-cream/90 backdrop-blur-lg border-b border-pinky/40 shadow-[0_4px_20px_rgba(51,39,42,0.06)]">
        {/* Fila principal */}
        <div className="max-w-7xl mx-auto px-2 sm:px-6 flex items-center gap-1 sm:gap-6 h-16 sm:h-[72px]">
          {/* Hamburguesa móvil */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Abrir menú"
            className="lg:hidden w-10 h-10 rounded-full hover:bg-pinky/60 transition-colors flex items-center justify-center"
          >
            <IconMenu className="w-5 h-5 text-ink" />
          </button>

          {/* Logo */}
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2.5 group shrink-0"
            aria-label="Ricaurte Mascotas — Inicio"
          >
            <span className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-ink text-blush flex items-center justify-center shadow-soft group-hover:rotate-12 transition-transform group-hover:anim-wiggle">
              <IconPaw className="w-5.5 h-5.5" />
            </span>
            <span className="leading-none">
              <span className="block font-display text-sm sm:text-xl text-ink">
                Ricaurte <span className="text-blush">Mascotas</span>
              </span>
              <span className="block text-[8px] sm:text-[10px] tracking-[0.18em] uppercase text-body/70 font-semibold">
                Prendas a mano • Ibagué
              </span>
            </span>
          </Link>

          {/* Buscador desktop */}
          <div className="hidden md:block flex-1 flex justify-center">
            <SearchBox />
          </div>

          {/* Accesos rápidos */}
          <div className="ml-auto flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => setSearchOpen(true)}
              aria-label="Buscar"
              className="md:hidden w-10 h-10 rounded-full hover:bg-pinky/60 transition-colors flex items-center justify-center"
            >
              <IconSearch className="w-5 h-5 text-ink" />
            </button>
            <button
              onClick={() => (user ? navigate("/cuenta") : setLoginOpen(true))}
              aria-label={user ? "Mi cuenta" : "Iniciar sesión"}
              className="hidden sm:flex w-10 h-10 rounded-full hover:bg-pinky/60 transition-colors items-center justify-center relative"
              title={user ? `Hola, ${user.name.split(" ")[0]}` : "Mi cuenta"}
            >
              {user ? (
                <span className="w-8 h-8 rounded-full bg-blush text-ink font-extrabold text-sm flex items-center justify-center shadow-blush">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              ) : (
                <IconUser className="w-5 h-5 text-ink" />
              )}
            </button>
            <Link
              to="/deseos"
              aria-label={`Lista de deseos (${wishlist.length})`}
              className="relative w-10 h-10 rounded-full hover:bg-pinky/60 transition-colors flex items-center justify-center"
            >
              <IconHeart className="w-5 h-5 text-ink" />
              {wishlist.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-blush text-ink text-[10px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center shadow anim-pop">
                  {wishlist.length}
                </span>
              )}
            </Link>
            <button
              onClick={() => setCartOpen(true)}
              aria-label={`Abrir carrito (${cartCount} productos)`}
              className="relative w-10 h-10 rounded-full bg-ink text-paper hover:bg-body transition-colors flex items-center justify-center shadow-soft"
            >
              <IconCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-blush text-ink text-[10px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center shadow anim-pop">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Nav desktop con mega menú */}
        <nav
          className="hidden lg:block border-t border-pinky/30"
          aria-label="Navegación principal"
        >
          <div
            className="max-w-7xl mx-auto px-6 flex items-center gap-1"
            ref={megaRef}
          >
            <div onMouseEnter={() => setMegaOpen(true)} className="relative">
              <button
                className="flex items-center gap-1.5 px-4 py-2.5 text-sm font-bold text-ink hover:text-blush transition-colors"
                aria-expanded={megaOpen}
                aria-haspopup="true"
              >
                <IconMenu className="w-4 h-4" /> Tienda{" "}
                <IconChevronDown
                  className={`w-3.5 h-3.5 transition-transform ${megaOpen ? "rotate-180" : ""}`}
                />
              </button>
              {megaOpen && (
                <div className="absolute left-0 top-full w-[680px] bg-paper rounded-b-3xl rounded-tr-3xl shadow-2xl border border-pinky/50 p-6 anim-pop z-50 grid grid-cols-[1fr_1.4fr] gap-6">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-body/60 mb-2">
                      Explora por especie
                    </p>
                    {[
                      { label: "🐶 Perros", filtro: "especie=Perro" },
                      { label: "🐱 Gatos", filtro: "especie=Gato" },
                      { label: "🐾 Todos", filtro: "" },
                    ].map((s) => (
                      <Link
                        key={s.label}
                        to={`/tienda${s.filtro ? `?${s.filtro}` : ""}`}
                        onClick={() => setMegaOpen(false)}
                        className="block px-3 py-2 rounded-xl text-sm font-semibold text-ink hover:bg-cream hover:text-blush transition-colors"
                      >
                        {s.label}
                      </Link>
                    ))}
                    <p className="text-[10px] font-bold uppercase tracking-widest text-body/60 mb-2 mt-4">
                      Destacados
                    </p>
                    <Link
                      to="/tienda?orden=novedad"
                      onClick={() => setMegaOpen(false)}
                      className="block px-3 py-2 rounded-xl text-sm font-semibold text-ink hover:bg-cream hover:text-blush transition-colors"
                    >
                      ✨ Novedades
                    </Link>
                    <Link
                      to="/tienda?orden=mejor-valorado"
                      onClick={() => setMegaOpen(false)}
                      className="block px-3 py-2 rounded-xl text-sm font-semibold text-ink hover:bg-cream hover:text-blush transition-colors"
                    >
                      ⭐ Mejor valorados
                    </Link>
                    <Link
                      to="/tienda?orden=oferta"
                      onClick={() => setMegaOpen(false)}
                      className="block px-3 py-2 rounded-xl text-sm font-semibold text-ink hover:bg-cream hover:text-blush transition-colors"
                    >
                      🏷️ Ofertas
                    </Link>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-body/60 mb-2">
                      Categorías
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                      {CATEGORIES.map((c) => (
                        <Link
                          key={c.id}
                          to={`/tienda?categoria=${c.id}`}
                          onClick={() => setMegaOpen(false)}
                          className="group/cat flex items-center gap-2.5 bg-cream/60 border border-pinky/40 rounded-2xl p-2 hover:border-blush hover:shadow-card transition-all"
                        >
                          <img
                            src={c.image}
                            alt=""
                            loading="lazy"
                            className="w-11 h-11 rounded-xl object-cover"
                          />
                          <span>
                            <span className="block text-xs font-bold text-ink group-hover/cat:text-blush transition-colors">
                              {c.name}
                            </span>
                            <span className="block text-[10px] text-body/70">
                              {c.desc}
                            </span>
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
            {[
              { label: "🧶 Frío", to: "/tienda?categoria=frio" },
              { label: "☔ Lluvia", to: "/tienda?categoria=lluvia" },
              {
                label: "🩺 Posquirúrgicas",
                to: "/tienda?categoria=posquirurgico",
              },
              { label: "🎉 Ocasiones", to: "/tienda?categoria=ocasiones" },
              {
                label: "🎀 Complementos",
                to: "/tienda?categoria=complementos",
              },
            ].map((l) => (
              <Link
                key={l.label}
                to={l.to}
                className="px-3.5 py-2.5 text-sm font-semibold text-body hover:text-blush hover:bg-pinky/30 rounded-xl transition-colors"
              >
                {l.label}
              </Link>
            ))}
            <div className="ml-auto flex items-center gap-1">
              <Link
                to="/garantia"
                className="px-3.5 py-2.5 text-sm font-semibold text-ink hover:text-blush transition-colors flex items-center gap-1.5"
              >
                <IconTruck className="w-4 h-4" /> Garantía
              </Link>
              <Link
                to="/faq"
                className="px-3.5 py-2.5 text-sm font-semibold text-body hover:text-blush transition-colors"
              >
                Ayuda / FAQ
              </Link>
              <a
                href="https://wa.me/573001234567?text=Hola%2C%20quiero%20información%20sobre%20las%20prendas%20de%20Ricaurte%20Mascotas"
                target="_blank"
                rel="noreferrer"
                className="ml-1 flex items-center gap-1.5 bg-mint text-ink text-sm font-bold px-4 py-2 rounded-full hover:shadow-card transition-all"
              >
                <IconWhatsApp className="w-4 h-4 text-green-700" /> WhatsApp
              </a>
            </div>
          </div>
        </nav>
      </header>

      {/* Buscador móvil (overlay) */}
      {searchOpen && (
        <div
          className="fixed inset-0 z-[85] md:hidden"
          role="dialog"
          aria-label="Buscar"
        >
          <div
            className="absolute inset-0 bg-ink/60 backdrop-blur-sm anim-fade-in"
            onClick={() => setSearchOpen(false)}
          />
          <div className="relative bg-cream px-4 pt-4 pb-3 shadow-xl anim-fade-up">
            <div className="flex items-center gap-2">
              <SearchBox mobile onDone={() => setSearchOpen(false)} />
              <button
                onClick={() => setSearchOpen(false)}
                aria-label="Cerrar búsqueda"
                className="w-9 h-9 rounded-full bg-paper flex items-center justify-center shrink-0"
              >
                <IconX className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Menú móvil (drawer) */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-[85] lg:hidden"
          role="dialog"
          aria-label="Menú"
        >
          <div
            className="absolute inset-0 bg-ink/60 backdrop-blur-sm anim-fade-in"
            onClick={() => setMobileMenuOpen(false)}
          />
          <aside className="absolute left-0 top-0 h-full w-[85%] max-w-sm bg-paper shadow-2xl anim-slide-left flex flex-col overflow-y-auto">
            <div className="flex items-center justify-between px-5 py-4 bg-ink">
              <span className="flex items-center gap-2 text-paper font-display text-lg">
                <IconPaw className="w-5 h-5 text-blush" /> Ricaurte Mascotas
              </span>
              <button
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Cerrar menú"
                className="w-9 h-9 rounded-full text-paper hover:bg-white/10 flex items-center justify-center"
              >
                <IconX />
              </button>
            </div>
            <nav className="p-4 space-y-1" aria-label="Menú móvil">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  user ? navigate("/cuenta") : setLoginOpen(true);
                }}
                className="w-full flex items-center gap-3 px-3 py-3 rounded-2xl bg-cream text-ink font-bold hover:bg-pinky/40 transition-colors"
              >
                <IconUser className="w-5 h-5 text-blush" />{" "}
                {user
                  ? `Hola, ${user.name.split(" ")[0]}`
                  : "Iniciar sesión / Registrarse"}
              </button>
              <p className="px-3 pt-4 pb-1 text-[10px] font-bold uppercase tracking-widest text-body/60">
                Categorías
              </p>
              {CATEGORIES.map((c) => (
                <Link
                  key={c.id}
                  to={`/tienda?categoria=${c.id}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-ink hover:bg-cream transition-colors"
                >
                  <span className="text-lg">{c.emoji}</span> {c.name}
                </Link>
              ))}
              <p className="px-3 pt-4 pb-1 text-[10px] font-bold uppercase tracking-widest text-body/60">
                Tienda
              </p>
              <Link
                to="/tienda?orden=novedad"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2.5 rounded-xl text-sm font-semibold text-ink hover:bg-cream transition-colors"
              >
                ✨ Novedades
              </Link>
              <Link
                to="/tienda?orden=oferta"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2.5 rounded-xl text-sm font-semibold text-ink hover:bg-cream transition-colors"
              >
                🏷️ Ofertas
              </Link>
              <Link
                to="/deseos"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2.5 rounded-xl text-sm font-semibold text-ink hover:bg-cream transition-colors"
              >
                💖 Mis deseos ({wishlist.length})
              </Link>
              <Link
                to="/faq"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2.5 rounded-xl text-sm font-semibold text-ink hover:bg-cream transition-colors"
              >
                ❓ Ayuda / FAQ
              </Link>
              <Link
                to="/garantia"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2.5 rounded-xl text-sm font-semibold text-ink hover:bg-cream transition-colors"
              >
                🛡️ Garantía Ricaurte Mascotas
              </Link>
            </nav>
            <div className="mt-auto p-5 bg-cream/60 border-t border-pinky/40">
              <a
                href="https://wa.me/573001234567"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 bg-mint text-ink font-bold py-3 rounded-full"
              >
                <IconWhatsApp className="w-5 h-5 text-green-700" /> Escríbenos
                por WhatsApp
              </a>
              <p className="text-center text-[11px] text-body/70 mt-3">
                📞 +57 300 123 4567 • Ibagué, Tolima
              </p>
            </div>
          </aside>
        </div>
      )}
    </>
  );
};
