import React, { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CATEGORIES, PRODUCTS, discountOf, formatCOP } from '../data/products';
import { ProductCard } from '../components/ProductCard';
import { IconArrowRight, IconCheck, IconChevronDown, IconX } from '../components/Icons';

const SORTS = [
  { id: 'relevancia', label: 'Relevancia' },
  { id: 'precio-asc', label: 'Precio: menor a mayor' },
  { id: 'precio-desc', label: 'Precio: mayor a menor' },
  { id: 'mas-vendido', label: 'Más vendidos' },
  { id: 'novedad', label: 'Novedad' },
  { id: 'mejor-valorado', label: 'Mejor valorados' },
  { id: 'oferta', label: 'Mayor descuento' },
];

const SIZES = ['XS', 'S', 'M', 'L', 'XL'];

export const Shop: React.FC = () => {
  const [params, setParams] = useSearchParams();
  const [filtersOpen, setFiltersOpen] = useState(false);

  const categoria = params.get('categoria') ?? '';
  const especie = params.get('especie') ?? '';
  const busqueda = params.get('busqueda') ?? '';
  const orden = params.get('orden') ?? 'relevancia';
  const tallas = params.getAll('talla');
  const soloStock = params.get('stock') === '1';
  const soloOfertas = params.get('ofertas') === '1';
  const ratingMin = Number(params.get('rating') ?? 0);
  const maxPrice = Number(params.get('max') ?? 70000);

  const setParam = (key: string, value: string) => {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    setParams(next, { replace: true });
  };

  const toggleTalla = (t: string) => {
    const next = new URLSearchParams(params);
    const list = next.getAll('talla');
    if (list.includes(t)) next.delete('talla');
    list.filter((x) => x !== t).forEach((x) => next.append('talla', x));
    if (!list.includes(t)) next.append('talla', t);
    setParams(next, { replace: true });
  };

  const results = useMemo(() => {
    let list = [...PRODUCTS];
    if (categoria) list = list.filter((p) => p.category === categoria);
    if (especie) list = list.filter((p) => p.species === especie || p.species === 'Perro y Gato');
    if (tallas.length) list = list.filter((p) => p.sizes.some((s) => tallas.includes(s)));
    if (soloStock) list = list.filter((p) => p.stock > 0);
    if (soloOfertas) list = list.filter((p) => p.originalPrice);
    if (ratingMin) list = list.filter((p) => p.rating >= ratingMin);
    list = list.filter((p) => p.price <= maxPrice);
    if (busqueda) {
      const q = busqueda.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      list = list.filter((p) =>
        `${p.name} ${p.tags.join(' ')} ${p.category}`.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').includes(q),
      );
    }
    switch (orden) {
      case 'precio-asc': list.sort((a, b) => a.price - b.price); break;
      case 'precio-desc': list.sort((a, b) => b.price - a.price); break;
      case 'mas-vendido': list.sort((a, b) => b.reviewCount - a.reviewCount); break;
      case 'novedad': list.sort((a, b) => Number(b.isNew ?? false) - Number(a.isNew ?? false)); break;
      case 'mejor-valorado': list.sort((a, b) => b.rating - a.rating); break;
      case 'oferta': list.sort((a, b) => discountOf(b) - discountOf(a)); break;
      default: list.sort((a, b) => Number(b.bestSeller ?? false) - Number(a.bestSeller ?? false));
    }
    return list;
  }, [categoria, especie, tallas, soloStock, soloOfertas, ratingMin, maxPrice, busqueda, orden]);

  const activeCat = CATEGORIES.find((c) => c.id === categoria);
  const chip = (label: string, onClear: () => void) => (
    <span className="inline-flex items-center gap-1.5 bg-paper border border-pinky/60 rounded-full px-3 py-1 text-xs font-semibold text-ink shadow-sm">
      {label}
      <button onClick={onClear} aria-label={`Quitar filtro ${label}`} className="text-body hover:text-blush"><IconX className="w-3 h-3" /></button>
    </span>
  );

  const FilterSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="py-4 border-b border-pinky/40">
      <p className="text-xs font-extrabold text-ink uppercase tracking-wide mb-3">{title}</p>
      {children}
    </div>
  );

  const filters = (
    <div className="space-y-0">
      <FilterSection title="Categoría">
        <div className="space-y-1.5">
          <button onClick={() => setParam('categoria', '')} className={`w-full text-left text-sm px-3 py-2 rounded-xl transition-colors ${!categoria ? 'bg-blush/30 font-bold text-ink' : 'text-body hover:bg-cream'}`}>
            Todas las categorías
          </button>
          {CATEGORIES.map((c) => (
            <button key={c.id} onClick={() => setParam('categoria', c.id)} className={`w-full text-left text-sm px-3 py-2 rounded-xl transition-colors ${categoria === c.id ? 'bg-blush/30 font-bold text-ink' : 'text-body hover:bg-cream'}`}>
              {c.emoji} {c.name}
            </button>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Especie">
        <div className="flex gap-2">
          {[['', '🐾 Todos'], ['Perro', '🐶 Perro'], ['Gato', '🐱 Gato']].map(([v, l]) => (
            <button key={v} onClick={() => setParam('especie', v)} className={`flex-1 text-xs font-bold px-3 py-2 rounded-full border transition-all ${especie === v ? 'bg-ink text-paper border-ink' : 'border-body/30 text-body hover:border-ink'}`}>
              {l}
            </button>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Precio máximo">
        <input
          type="range" min={15000} max={70000} step={1000} value={maxPrice}
          onChange={(e) => setParam('max', e.target.value)}
          className="w-full accent-[#ff8ba7]"
          aria-label="Filtrar por precio máximo"
        />
        <div className="flex justify-between text-[11px] text-body/70 font-semibold mt-1">
          <span>$15.000</span><span className="text-ink bg-blush/30 px-2 py-0.5 rounded-full">Hasta {formatCOP(maxPrice)}</span><span>$70.000</span>
        </div>
      </FilterSection>

      <FilterSection title="Talla">
        <div className="flex flex-wrap gap-2">
          {SIZES.map((s) => (
            <button key={s} onClick={() => toggleTalla(s)} className={`w-10 h-10 rounded-full text-xs font-extrabold border transition-all ${tallas.includes(s) ? 'bg-blush text-ink border-blush shadow-blush' : 'border-body/30 text-body hover:border-ink'}`}>
              {s}
            </button>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Disponibilidad">
        <label className="flex items-center gap-2.5 text-sm text-body cursor-pointer py-1">
          <span className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-colors ${soloStock ? 'bg-blush border-blush' : 'border-body/40'}`}>
            {soloStock && <IconCheck className="w-3 h-3 text-ink" />}
          </span>
          <input type="checkbox" checked={soloStock} onChange={(e) => setParam('stock', e.target.checked ? '1' : '')} className="sr-only" />
          Solo en stock
        </label>
        <label className="flex items-center gap-2.5 text-sm text-body cursor-pointer py-1">
          <span className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-colors ${soloOfertas ? 'bg-blush border-blush' : 'border-body/40'}`}>
            {soloOfertas && <IconCheck className="w-3 h-3 text-ink" />}
          </span>
          <input type="checkbox" checked={soloOfertas} onChange={(e) => setParam('ofertas', e.target.checked ? '1' : '')} className="sr-only" />
          Solo ofertas
        </label>
      </FilterSection>

      <FilterSection title="Calificación">
        {[[4.5, '4.5★ o más'], [4, '4★ o más']].map(([v, l]) => (
          <button key={v} onClick={() => setParam('rating', ratingMin === v ? '' : String(v))} className={`w-full text-left text-sm px-3 py-2 rounded-xl transition-colors ${ratingMin === v ? 'bg-blush/30 font-bold text-ink' : 'text-body hover:bg-cream'}`}>
            ⭐ {l}
          </button>
        ))}
      </FilterSection>

      <button onClick={() => setParams(new URLSearchParams(), { replace: true })} className="mt-4 w-full text-sm font-bold text-body underline underline-offset-4 hover:text-blush transition-colors py-2">
        Limpiar todos los filtros
      </button>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      {/* Migas de pan */}
      <nav aria-label="Migas de pan" className="text-xs text-body/70 flex items-center gap-1.5 flex-wrap">
        <Link to="/" className="hover:text-blush font-semibold">Inicio</Link>
        <span>/</span>
        <span className="text-body">Tienda</span>
        {activeCat && (<><span>/</span><span className="text-ink font-bold">{activeCat.name}</span></>)}
        {busqueda && (<><span>/</span><span className="text-ink font-bold">“{busqueda}”</span></>)}
      </nav>

      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mt-4 mb-6">
        <div>
          <h1 className="font-display text-3xl sm:text-4xl">
            {activeCat ? `${activeCat.emoji} ${activeCat.name}` : busqueda ? `Resultados: “${busqueda}”` : '🐾 Catálogo completo'}
          </h1>
          <p className="text-sm text-body/80 mt-1">
            {results.length} producto{results.length !== 1 && 's'} • Todos hechos a mano en Ibagué con garantía Ricaurte Mascotas
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setFiltersOpen(true)} className="lg:hidden bg-ink text-paper text-sm font-bold px-4 py-2.5 rounded-full flex items-center gap-2">
            ⚙️ Filtros
          </button>
          <label className="flex items-center gap-2 text-xs font-bold text-ink">
            Ordenar por
            <span className="relative">
              <select
                value={orden}
                onChange={(e) => setParam('orden', e.target.value)}
                aria-label="Ordenar productos"
                className="appearance-none bg-paper border border-body/25 rounded-full pl-4 pr-9 py-2.5 text-sm font-semibold text-ink focus:border-blush focus:outline-none shadow-sm cursor-pointer"
              >
                {SORTS.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
              </select>
              <IconChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-body" />
            </span>
          </label>
        </div>
      </div>

      {/* Chips activos */}
      {(categoria || especie || tallas.length || soloStock || soloOfertas || ratingMin > 0 || maxPrice < 70000 || busqueda) && (
        <div className="flex flex-wrap gap-2 mb-6">
          {activeCat && chip(activeCat.name, () => setParam('categoria', ''))}
          {especie && chip(`Especie: ${especie}`, () => setParam('especie', ''))}
          {tallas.map((t) => chip(`Talla ${t}`, () => toggleTalla(t)))}
          {soloStock && chip('Solo en stock', () => setParam('stock', ''))}
          {soloOfertas && chip('Solo ofertas', () => setParam('ofertas', ''))}
          {ratingMin > 0 && chip(`${ratingMin}★+`, () => setParam('rating', ''))}
          {maxPrice < 70000 && chip(`Hasta ${formatCOP(maxPrice)}`, () => setParam('max', ''))}
          {busqueda && chip(`“${busqueda}”`, () => setParam('busqueda', ''))}
        </div>
      )}

      <div className="grid lg:grid-cols-[260px_1fr] gap-8">
        {/* Sidebar desktop */}
        <aside className="hidden lg:block bg-paper rounded-3xl border border-pinky/50 p-5 shadow-card h-fit sticky top-28" aria-label="Filtros">
          <h2 className="font-display text-lg mb-1">Filtros</h2>
          {filters}
        </aside>

        {/* Drawer filtros móvil */}
        {filtersOpen && (
          <div className="fixed inset-0 z-[75] lg:hidden" role="dialog" aria-label="Filtros">
            <div className="absolute inset-0 bg-ink/60 backdrop-blur-sm anim-fade-in" onClick={() => setFiltersOpen(false)} />
            <aside className="absolute left-0 top-0 h-full w-[85%] max-w-sm bg-paper shadow-2xl anim-slide-left flex flex-col">
              <header className="flex items-center justify-between px-5 py-4 bg-ink text-paper">
                <h2 className="font-display text-lg">⚙️ Filtros</h2>
                <button onClick={() => setFiltersOpen(false)} aria-label="Cerrar filtros" className="w-9 h-9 rounded-full hover:bg-white/10 flex items-center justify-center"><IconX /></button>
              </header>
              <div className="flex-1 overflow-y-auto px-5">{filters}</div>
              <div className="p-4 border-t border-pinky/40">
                <button onClick={() => setFiltersOpen(false)} className="w-full bg-blush text-ink font-extrabold py-3 rounded-full shadow-blush">
                  Ver {results.length} producto{results.length !== 1 && 's'}
                </button>
              </div>
            </aside>
          </div>
        )}

        {/* Grid */}
        <div>
          {results.length === 0 ? (
            <div className="bg-paper rounded-3xl border border-pinky/50 p-14 text-center shadow-card">
              <span className="text-6xl">🐕‍🦺</span>
              <h3 className="font-display text-2xl mt-4">No encontramos prendas con esos filtros</h3>
              <p className="text-sm text-body/70 mt-2">Prueba quitar algunos filtros o busca con otras palabras. Recuerda: podemos hacer prendas a medida por WhatsApp.</p>
              <button onClick={() => setParams(new URLSearchParams(), { replace: true })} className="mt-5 bg-blush text-ink font-bold px-6 py-3 rounded-full shadow-blush hover:bg-pinky transition-all">
                Limpiar filtros
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {results.map((p, i) => <ProductCard key={p.id} product={p} delay={i * 50} />)}
            </div>
          )}
        </div>
      </div>

      {/* Sugerencia a medida */}
      <div className="mt-10 bg-mint/40 border-2 border-dashed border-mint rounded-3xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="font-display text-xl text-ink">¿Tu mascota no encuentra su talla? 🧵</h3>
          <p className="text-sm text-body mt-1">Hacemos prendas 100% a medida en 5–7 días hábiles. Envíanos las medidas por WhatsApp.</p>
        </div>
        <a href="https://wa.me/573001234567?text=Hola%2C%20necesito%20una%20prenda%20a%20medida" target="_blank" rel="noreferrer" className="bg-ink text-paper font-bold px-6 py-3 rounded-full hover:bg-body transition-colors flex items-center gap-2 shrink-0">
          Pedir a medida <IconArrowRight className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
};
