import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { CATEGORIES, SIZE_GUIDE, formatCOP, getProduct, discountOf, PRODUCTS, IBAGUE_NEIGHBORHOODS } from '../data/products';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/ProductCard';
import {
  IconBolt, IconCart, IconCheck, IconChevronDown, IconHeart, IconMapPin, IconShield, IconTruck, IconX, StarRating,
} from '../components/Icons';

export const ProductDetail: React.FC = () => {
  const { id } = useParams();
  const product = id ? getProduct(id) : undefined;
  const navigate = useNavigate();
  const { addToCart, toggleWishlist, isWishlisted, addToast } = useStore();

  const [size, setSize] = useState(product?.sizes[0] ?? '');
  const [color, setColor] = useState(product?.colors[0].name ?? '');
  const [qty, setQty] = useState(1);
  const [imgIdx, setImgIdx] = useState(0);
  const [guideOpen, setGuideOpen] = useState(false);
  const [openSection, setOpenSection] = useState<string>('descripcion');
  const [zip, setZip] = useState('');
  const [estimate, setEstimate] = useState<string | null>(null);
  const [showAllReviews, setShowAllReviews] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (product) {
      setSize(product.sizes[0]);
      setColor(product.colors[0].name);
      setQty(1);
      setImgIdx(0);
      setEstimate(null);
      document.title = `${product.name} | Ricaurte Mascotas Ibagué`;
    }
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  // Schema.org Product JSON-LD
  useEffect(() => {
    if (!product) return;
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'product-schema';
    script.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: product.name,
      sku: product.sku,
      description: product.shortDesc,
      image: product.images,
      brand: { '@type': 'Brand', name: 'Ricaurte Mascotas' },
      offers: {
        '@type': 'Offer',
        priceCurrency: 'COP',
        price: product.price,
        availability: product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
        itemCondition: 'https://schema.org/NewCondition',
      },
      aggregateRating: { '@type': 'AggregateRating', ratingValue: product.rating, reviewCount: product.reviewCount },
    });
    document.head.appendChild(script);
    return () => { document.getElementById('product-schema')?.remove(); };
  }, [product]);

  const crossSell = useMemo(() => {
    if (!product) return [];
    const sameCat = PRODUCTS.filter((p) => p.id !== product.id && p.category === product.category);
    const others = PRODUCTS.filter((p) => p.id !== product.id && p.category !== product.category && p.category === 'complementos');
    return [...sameCat, ...others].slice(0, 4);
  }, [product]);

  if (!product) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center">
        <span className="text-6xl">🐾</span>
        <h1 className="font-display text-3xl mt-4">Producto no encontrado</h1>
        <p className="text-body mt-2">Puede que esta prenda ya no esté disponible. Explora nuestro catálogo.</p>
        <Link to="/tienda" className="inline-block mt-5 bg-blush text-ink font-bold px-6 py-3 rounded-full shadow-blush">Ir a la tienda</Link>
      </div>
    );
  }

  const disc = discountOf(product);
  const lowStock = product.stock <= 3;
  const wished = isWishlisted(product.id);
  const viewers = 8 + Math.round(product.views * 0.6);

  const estimateShipping = (e: React.FormEvent) => {
    e.preventDefault();
    const zipNorm = zip.trim().replace(/\D/g, '');
    if (zipNorm.length < 4) { addToast('Ingresa un código postal o barrio válido (ej. 730001)', '⚠️'); return; }
    const isIbague = zipNorm.startsWith('730') || IBAGUE_NEIGHBORHOODS.some((b) => normalizeLocal(zip) === normalizeLocal(b));
    const days = isIbague ? 2 : 5;
    const date = new Date();
    date.setDate(date.getDate() + days);
    const opts: Intl.DateTimeFormatOptions = { weekday: 'long', day: 'numeric', month: 'long' };
    setEstimate(`${isIbague ? '🚚 Envío en Ibagué' : '📦 Envío nacional'}: llega aproximadamente el ${date.toLocaleDateString('es-CO', opts)}${isIbague ? ' (2-3 días hábiles)' : ' (3-5 días hábiles)'}`);
  };

  const normalizeLocal = (s: string) => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();

  const buyNow = () => {
    addToCart({ productId: product.id, size, color, qty }, true);
    navigate('/checkout');
  };

  const Section: React.FC<{ id: string; title: string; children: React.ReactNode }> = ({ id, title, children }) => (
    <div className="border border-pinky/50 rounded-2xl bg-paper overflow-hidden">
      <button
        onClick={() => setOpenSection(openSection === id ? '' : id)}
        aria-expanded={openSection === id}
        className="w-full flex items-center justify-between px-5 py-4 text-left font-bold text-ink hover:bg-cream/50 transition-colors"
      >
        {title}
        <IconChevronDown className={`w-4 h-4 text-blush transition-transform ${openSection === id ? 'rotate-180' : ''}`} />
      </button>
      {openSection === id && <div className="px-5 pb-5 text-sm text-body leading-relaxed anim-fade-in">{children}</div>}
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 pb-28 lg:pb-6">
      {/* Migas */}
      <nav aria-label="Migas de pan" className="text-xs text-body/70 flex items-center gap-1.5 flex-wrap">
        <Link to="/" className="hover:text-blush font-semibold">Inicio</Link><span>/</span>
        <Link to="/tienda" className="hover:text-blush font-semibold">Tienda</Link><span>/</span>
        <Link to={`/tienda?categoria=${product.category}`} className="hover:text-blush font-semibold">{CATEGORIES.find((c) => c.id === product.category)?.name}</Link><span>/</span>
        <span className="text-ink font-bold">{product.name}</span>
      </nav>

      <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 mt-5">
        {/* ── Galería ── */}
        <div>
          <div className="relative group rounded-[2rem] overflow-hidden bg-cream border border-pinky/40 shadow-soft aspect-square cursor-zoom-in">
            <img
              src={product.images[imgIdx]}
              alt={`${product.name} — foto ${imgIdx + 1}`}
              className="zoom-img w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4 flex flex-col gap-1.5">
              {product.badge && <span className="bg-ink text-pinky text-xs font-bold px-3 py-1.5 rounded-full shadow">{product.badge}</span>}
              {disc > 0 && <span className="bg-blush text-ink text-xs font-bold px-3 py-1.5 rounded-full shadow">-{disc}% OFF</span>}
            </div>
            <span className="absolute bottom-4 right-4 bg-paper/90 text-ink text-[10px] font-bold px-3 py-1.5 rounded-full shadow">🔍 Pasa el cursor para hacer zoom</span>
          </div>
          <div className="flex gap-3 mt-3 overflow-x-auto no-scrollbar">
            {product.images.map((img, i) => (
              <button
                key={i}
                onClick={() => setImgIdx(i)}
                aria-label={`Ver foto ${i + 1}`}
                className={`shrink-0 w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all ${imgIdx === i ? 'border-blush shadow-blush' : 'border-transparent opacity-70 hover:opacity-100'}`}
              >
                <img src={img} alt="" loading="lazy" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* ── Información ── */}
        <div>
          <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-body/60">
            <span className="text-blush">{product.species}</span> • Marca: Ricaurte Mascotas • SKU: {product.sku}
          </div>
          <h1 className="font-display text-3xl sm:text-4xl leading-tight mt-2">{product.name}</h1>

          <div className="flex items-center gap-2 mt-3">
            <StarRating rating={product.rating} className="w-4 h-4" />
            <span className="text-sm font-bold text-ink">{product.rating}</span>
            <span className="text-xs text-body/70">({product.reviewCount} reseñas verificadas)</span>
          </div>

          {/* Precio */}
          <div className="mt-4 flex items-baseline gap-3 flex-wrap">
            <span className="text-3xl sm:text-4xl font-extrabold text-ink">{formatCOP(product.price)}</span>
            {product.originalPrice && <span className="text-lg text-body/50 line-through">{formatCOP(product.originalPrice)}</span>}
            <span className="text-[11px] text-body/60 bg-cream border border-pinky/50 px-2.5 py-1 rounded-full font-semibold">IVA incluido</span>
          </div>

          {/* Urgencia */}
          <div className="flex flex-wrap gap-3 mt-4">
            {lowStock ? (
              <span className="bg-blush/20 border border-blush text-ink text-xs font-extrabold px-3.5 py-2 rounded-full flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blush anim-pulse-dot" /> ¡Últimas {product.stock} unidades en stock!
              </span>
            ) : (
              <span className="bg-mint/50 border border-mint text-ink text-xs font-extrabold px-3.5 py-2 rounded-full flex items-center gap-2">
                <IconCheck className="w-3.5 h-3.5 text-green-700" /> En stock — disponible
              </span>
            )}
            <span className="bg-paper border border-pinky/60 text-ink text-xs font-bold px-3.5 py-2 rounded-full flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400 anim-pulse-dot" /> {viewers} personas están viendo este producto
            </span>
          </div>

          <p className="text-body mt-4 leading-relaxed">{product.shortDesc}</p>

          {/* Talla */}
          <div className="mt-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-ink uppercase tracking-wide">Talla: <span className="text-blush">{size}</span></span>
              <button onClick={() => setGuideOpen(true)} className="text-xs font-bold text-ink underline decoration-blush decoration-2 underline-offset-4 hover:text-blush transition-colors">
                📏 Guía de tallas
              </button>
            </div>
            <div className="flex gap-2 mt-2 flex-wrap">
              {product.sizes.map((s) => (
                <button
                  key={s}
                  onClick={() => setSize(s)}
                  className={`min-w-11 px-3.5 py-2.5 rounded-xl text-sm font-bold border-2 transition-all ${size === s ? 'bg-ink text-paper border-ink shadow-soft' : 'border-body/25 text-body hover:border-ink'}`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Color */}
          <div className="mt-4">
            <span className="text-xs font-extrabold text-ink uppercase tracking-wide">Color: <span className="text-blush">{color}</span></span>
            <div className="flex gap-2.5 mt-2">
              {product.colors.map((c) => (
                <button
                  key={c.name}
                  onClick={() => setColor(c.name)}
                  title={c.name}
                  aria-label={`Color ${c.name}`}
                  className={`w-9 h-9 rounded-full border-2 transition-all ${color === c.name ? 'border-ink scale-110 shadow' : 'border-transparent hover:scale-105'}`}
                  style={{ backgroundColor: c.hex }}
                />
              ))}
            </div>
          </div>

          {/* Cantidad + CTA */}
          <div className="flex flex-wrap items-center gap-3 mt-6">
            <div className="flex items-center border-2 border-body/25 rounded-full overflow-hidden h-12">
              <button onClick={() => setQty(Math.max(1, qty - 1))} aria-label="Reducir cantidad" className="px-4 h-full hover:bg-cream transition-colors font-bold text-lg">−</button>
              <span className="px-3 font-extrabold text-ink">{qty}</span>
              <button onClick={() => setQty(qty + 1)} aria-label="Aumentar cantidad" className="px-4 h-full hover:bg-cream transition-colors font-bold text-lg">+</button>
            </div>
            <button
              onClick={() => addToCart({ productId: product.id, size, color, qty })}
              className="flex-1 min-w-[180px] bg-blush text-ink font-extrabold h-12 rounded-full shadow-blush hover:bg-pinky hover:-translate-y-0.5 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <IconCart className="w-5 h-5" /> Añadir al carrito
            </button>
            <button
              onClick={buyNow}
              className="flex-1 min-w-[150px] bg-ink text-paper font-extrabold h-12 rounded-full hover:bg-body hover:-translate-y-0.5 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              ⚡ Comprar ahora
            </button>
            <button
              onClick={() => toggleWishlist(product.id)}
              aria-label="Agregar a lista de deseos"
              className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all ${wished ? 'bg-blush border-blush text-ink' : 'border-body/25 text-body hover:border-blush hover:text-blush'}`}
            >
              <IconHeart className="w-5 h-5" filled={wished} />
            </button>
          </div>

          {/* Estimador de envío */}
          <form onSubmit={estimateShipping} className="mt-5 bg-cream/70 border border-pinky/50 rounded-2xl p-4">
            <p className="text-xs font-extrabold text-ink flex items-center gap-1.5"><IconTruck className="w-4 h-4 text-blush" /> Calcula tu fecha de entrega</p>
            <div className="flex gap-2 mt-2.5">
              <div className="relative flex-1">
                <IconMapPin className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-body/50" />
                <input
                  value={zip}
                  onChange={(e) => setZip(e.target.value)}
                  placeholder="Código postal o barrio (ej. El Salado, 730001)"
                  aria-label="Código postal o barrio"
                  list="barrios-ibague"
                  className="w-full bg-paper border border-body/25 rounded-full pl-10 pr-4 py-2.5 text-sm focus:border-blush focus:outline-none"
                />
                <datalist id="barrios-ibague">
                  {IBAGUE_NEIGHBORHOODS.map((b) => <option key={b} value={b} />)}
                </datalist>
              </div>
              <button type="submit" className="bg-ink text-paper text-sm font-bold px-5 rounded-full hover:bg-body transition-colors shrink-0">Calcular</button>
            </div>
            {estimate && (
              <p className="text-xs font-bold text-ink mt-2.5 bg-mint/60 border border-mint rounded-xl px-3 py-2 anim-fade-up">{estimate}</p>
            )}
            <p className="text-[10px] text-body/60 mt-2">📦 Envío gratis en Ibagué desde $100.000 • Recogida gratis en veterinaria Animalandia</p>
          </form>

          {/* Garantía express */}
          <div className="flex items-center gap-2.5 mt-4 bg-mint/30 border border-mint rounded-2xl px-4 py-3">
            <IconShield className="w-6 h-6 text-ink shrink-0" />
            <p className="text-xs text-ink font-semibold leading-snug">
              Garantía Ricaurte Mascotas: <span className="font-normal text-body">30 días por defectos de fabricación + cambio de talla gratis en 15 días.</span>
            </p>
          </div>
        </div>
      </div>

      {/* ── Descripción y fichas ── */}
      <div className="grid lg:grid-cols-2 gap-6 mt-12">
        <div className="space-y-4">
          <Section id="descripcion" title={`📖 Descripción — ${product.name}`}>
            <p>{product.description}</p>
            <div className="grid grid-cols-2 gap-2 mt-4">
              {['✂️ Corte anatómico', '🧵 Costuras reforzadas', '💧 Materiales lavables', '🏷️ Etiqueta de talla incluida'].map((f) => (
                <span key={f} className="bg-cream/70 rounded-xl px-3 py-2 text-xs font-bold text-ink">{f}</span>
              ))}
            </div>
          </Section>
          <Section id="especificaciones" title="📋 Ficha técnica y cuidados">
            <dl className="space-y-2.5 text-sm">
              {[
                ['Material', product.specs.material],
                ['Peso', product.specs.peso],
                ['Cuidados', product.specs.cuidados],
                ['Origen', product.specs.origen],
                ['Uso recomendado', product.specs.uso],
                ['Código SKU', product.sku],
              ].map(([k, v]) => (
                <div key={k} className="flex gap-3">
                  <dt className="w-28 shrink-0 font-bold text-ink">{k}</dt>
                  <dd className="text-body">{v}</dd>
                </div>
              ))}
            </dl>
          </Section>
          <Section id="garantia" title="🛡️ Garantía y devoluciones">
            <ul className="space-y-2">
              <li>• Garantía de 30 días por defectos de fabricación, avalada por Ricaurte Mascotas.</li>
              <li>• Cambio de talla GRATIS dentro de los primeros 15 días (prenda sin uso y con empaque).</li>
              <li>• Devolución del 100% si la prenda no cumple lo prometido.</li>
              <li>• Solicítalo desde tu cuenta en "Centro de devoluciones" o por WhatsApp.</li>
            </ul>
          </Section>
        </div>

        {/* ── Reseñas y Q&A ── */}
        <div className="space-y-4">
          <div className="bg-paper border border-pinky/50 rounded-2xl p-5">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <h2 className="font-display text-xl">Reseñas de compradores</h2>
              <div className="text-center bg-cream rounded-2xl px-4 py-2">
                <span className="font-display text-2xl text-ink">{product.rating}</span>
                <StarRating rating={product.rating} className="w-3 h-3" />
              </div>
            </div>
            <div className="space-y-4 mt-4">
              {(showAllReviews ? product.reviews : product.reviews.slice(0, 2)).map((r) => (
                <article key={r.id} className="bg-cream/50 border border-pinky/40 rounded-2xl p-4">
                  <div className="flex items-center gap-3">
                    <span className="w-9 h-9 rounded-full bg-blush text-ink font-extrabold text-xs flex items-center justify-center">
                      {r.author.split(' ').map((w) => w[0]).slice(0, 2).join('')}
                    </span>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-ink">{r.author}</p>
                      <p className="text-[10px] text-body/60">{r.location} • {r.date}</p>
                    </div>
                    <span className="bg-mint text-ink text-[9px] font-extrabold px-2 py-1 rounded-full flex items-center gap-1"><IconCheck className="w-2.5 h-2.5" /> Compra verificada</span>
                  </div>
                  <StarRating rating={r.rating} className="w-3.5 h-3.5 mt-2.5" />
                  <p className="text-sm text-body mt-1.5 leading-relaxed">{r.text}</p>
                  {r.photo && (
                    <img src={r.photo} alt={`Foto de ${r.author} con ${product.name}`} loading="lazy" className="mt-3 w-24 h-24 object-cover rounded-xl border border-pinky/50" />
                  )}
                </article>
              ))}
            </div>
            {product.reviews.length > 2 && (
              <button onClick={() => setShowAllReviews(!showAllReviews)} className="mt-4 text-sm font-bold text-ink underline decoration-blush decoration-2 underline-offset-4 hover:text-blush transition-colors">
                {showAllReviews ? 'Ver menos' : `Ver las ${product.reviews.length} reseñas`}
              </button>
            )}
          </div>

          <div className="bg-paper border border-pinky/50 rounded-2xl p-5">
            <h2 className="font-display text-xl">Preguntas y respuestas</h2>
            <div className="space-y-3 mt-4">
              {product.qa.map((qa, i) => (
                <div key={i} className="border border-pinky/40 rounded-xl p-3.5">
                  <p className="text-sm font-bold text-ink">❓ {qa.q}</p>
                  <p className="text-sm text-body mt-1.5 bg-cream/60 rounded-xl px-3 py-2.5">💬 {qa.a}</p>
                </div>
              ))}
            </div>
            <a href="https://wa.me/573001234567" target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-ink hover:text-blush transition-colors">
              ¿Tienes otra pregunta? Escríbenos por WhatsApp →
            </a>
          </div>
        </div>
      </div>

      {/* ── Venta cruzada ── */}
      {crossSell.length > 0 && (
        <section className="mt-14" aria-labelledby="cross-title">
          <div className="flex items-end justify-between mb-5">
            <div>
              <span className="inline-block bg-pinky text-ink text-[11px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">🧩 Completa el look</span>
              <h2 id="cross-title" className="font-display text-2xl sm:text-3xl mt-2">Combina con otras prendas</h2>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {crossSell.map((p, i) => <ProductCard key={p.id} product={p} delay={i * 60} />)}
          </div>
        </section>
      )}

      {/* ── Modal guía de tallas ── */}
      {guideOpen && (
        <div className="fixed inset-0 z-[85] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label="Guía de tallas">
          <div className="absolute inset-0 bg-ink/60 backdrop-blur-sm anim-fade-in" onClick={() => setGuideOpen(false)} />
          <div className="relative bg-paper rounded-3xl shadow-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto anim-pop p-6">
            <button onClick={() => setGuideOpen(false)} aria-label="Cerrar guía" className="absolute top-4 right-4 w-9 h-9 rounded-full bg-cream hover:bg-pinky flex items-center justify-center transition-colors"><IconX /></button>
            <h2 className="font-display text-2xl">📏 Guía de tallas</h2>
            <p className="text-xs text-body/70 mt-1">Mide el <strong className="text-ink">contorno del pecho</strong> (justo detrás de las patas delanteras) y el <strong className="text-ink">largo de espalda</strong> (del cuello a la cola).</p>
            <div className="overflow-x-auto mt-4">
              <table className="w-full text-sm border-collapse min-w-[480px]">
                <thead>
                  <tr className="bg-ink text-paper">
                    <th className="p-3 text-left rounded-tl-2xl">Talla</th>
                    <th className="p-3 text-left">Pecho</th>
                    <th className="p-3 text-left">Largo</th>
                    <th className="p-3 text-left">Peso</th>
                    <th className="p-3 text-left rounded-tr-2xl">Referencia</th>
                  </tr>
                </thead>
                <tbody>
                  {SIZE_GUIDE.map((g, i) => (
                    <tr key={g.size} className={`${i % 2 ? 'bg-cream/50' : 'bg-paper'} border-b border-pinky/30`}>
                      <td className="p-3 font-extrabold text-ink">{g.size}</td>
                      <td className="p-3">{g.pecho}</td>
                      <td className="p-3">{g.largo}</td>
                      <td className="p-3">{g.peso}</td>
                      <td className="p-3 text-body/80 text-xs">{g.raza}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-body/70 mt-3 bg-cream/70 border border-pinky/40 rounded-xl p-3">
              💡 <strong className="text-ink">¿Entre dos tallas?</strong> Elige la más grande: las prendas artesanales tienen un 5% de margen y tu peludo estará más cómodo. ¿Dudas? Escríbenos por WhatsApp con las medidas y te asesoramos gratis.
            </p>
          </div>
        </div>
      )}

      {/* ── Sticky add to cart móvil ── */}
      <div className="fixed bottom-0 inset-x-0 z-[55] lg:hidden bg-paper/95 backdrop-blur border-t border-pinky/50 px-4 py-3 flex items-center gap-3 shadow-[0_-8px_30px_rgba(51,39,42,0.12)]">
        <div className="min-w-0">
          <p className="text-[10px] text-body/60 font-semibold uppercase tracking-wide">Total</p>
          <p className="font-extrabold text-ink leading-none">{formatCOP(product.price * qty)}</p>
        </div>
        <button
          onClick={() => addToCart({ productId: product.id, size, color, qty })}
          className="flex-1 bg-blush text-ink font-extrabold py-3 rounded-full shadow-blush active:scale-95 transition-all flex items-center justify-center gap-2"
        >
          <IconCart className="w-4.5 h-4.5" /> Añadir al carrito
        </button>
        <button onClick={buyNow} className="bg-ink text-paper font-extrabold py-3 px-4 rounded-full active:scale-95 transition-all flex items-center gap-1.5">
          <IconBolt className="w-4 h-4 text-blush" /> Comprar
        </button>
      </div>
    </div>
  );
};
