import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { CATEGORIES, PRODUCTS, TESTIMONIALS, UGC_POSTS } from '../data/products';
import { ProductCard } from '../components/ProductCard';
import {
  IconArrowRight, IconCheck, IconHand, IconHeart, IconShield, IconStar, IconTruck, StarRating,
} from '../components/Icons';

// ─── Carrusel genérico ────────────────────────────────────────────────────
const Carousel: React.FC<{ title: string; subtitle?: string; emoji: string; products: typeof PRODUCTS; accent?: string }> = ({
  title, subtitle, emoji, products, accent = 'bg-blush',
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const scroll = (dir: number) => ref.current?.scrollBy({ left: dir * 300, behavior: 'smooth' });

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10" aria-labelledby={`car-${title.replace(/\s/g, '')}`}>
      <div className="flex items-end justify-between mb-5 gap-4">
        <div>
          <span className={`inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest ${accent} text-ink px-3 py-1 rounded-full`}>
            {emoji} {subtitle ?? 'Colección'}
          </span>
          <h2 id={`car-${title.replace(/\s/g, '')}`} className="font-display text-2xl sm:text-3xl mt-2">{title}</h2>
        </div>
        <div className="flex gap-2">
          <button onClick={() => scroll(-1)} aria-label="Anterior" className="w-10 h-10 rounded-full bg-paper border border-pinky/60 hover:bg-blush hover:border-blush transition-colors shadow-card">←</button>
          <button onClick={() => scroll(1)} aria-label="Siguiente" className="w-10 h-10 rounded-full bg-paper border border-pinky/60 hover:bg-blush hover:border-blush transition-colors shadow-card">→</button>
        </div>
      </div>
      <div ref={ref} className="flex gap-4 overflow-x-auto no-scrollbar snap-x snap-mandatory pb-2">
        {products.map((p, i) => (
          <div key={p.id} className="snap-start shrink-0 w-[240px] sm:w-[260px]">
            <ProductCard product={p} delay={i * 60} />
          </div>
        ))}
      </div>
    </section>
  );
};

// ─── Hero ─────────────────────────────────────────────────────────────────
const Hero: React.FC = () => (
  <section className="relative overflow-hidden bg-gradient-to-br from-cream via-pinky/30 to-mint/40" aria-label="Presentación">
    <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-blush/20 blur-3xl" aria-hidden="true" />
    <div className="absolute bottom-0 -left-24 w-80 h-80 rounded-full bg-mint/40 blur-3xl" aria-hidden="true" />

    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 lg:py-20 grid lg:grid-cols-2 gap-10 items-center relative">
      <div className="anim-fade-up">
        <span className="inline-flex items-center gap-2 bg-paper border border-blush/50 text-ink text-xs font-bold px-4 py-2 rounded-full shadow-card">
          🧶 Hecho a mano en Ibagué, Colombia
        </span>
        <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl leading-[1.05] mt-5">
          Prendas con <span className="text-blush relative">amor
            <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 12" fill="none" aria-hidden="true"><path d="M2 9C50 2 150 2 198 9" stroke="#ff8ba7" strokeWidth="5" strokeLinecap="round" /></svg>
          </span> para tu peludo
        </h1>
        <p className="text-body mt-5 text-base sm:text-lg leading-relaxed max-w-lg">
          Abrigos tejidos para el frío, impermeables para la lluvia ibaguereña, outfits para momentos especiales y prendas posquirúrgicas avaladas por veterinarios.
        </p>
        <div className="flex flex-wrap gap-3 mt-7">
          <Link to="/tienda" className="bg-blush text-ink font-extrabold px-7 py-3.5 rounded-full shadow-blush hover:bg-pinky hover:-translate-y-0.5 active:scale-95 transition-all flex items-center gap-2">
            Comprar ahora <IconArrowRight className="w-4 h-4" />
          </Link>
          <Link to="/tienda?categoria=posquirurgico" className="bg-paper text-ink font-bold px-7 py-3.5 rounded-full border-2 border-ink/15 hover:border-ink hover:-translate-y-0.5 active:scale-95 transition-all">
            🩺 Ver posquirúrgicas
          </Link>
        </div>
        <div className="flex items-center gap-6 mt-8 flex-wrap">
          {[
            ['+850', 'clientes felices'],
            ['4.9★', 'valoración media'],
            ['100%', 'artesanal'],
          ].map(([n, l]) => (
            <div key={l}>
              <p className="font-display text-2xl text-ink">{n}</p>
              <p className="text-[11px] text-body/70 font-semibold uppercase tracking-wide">{l}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="relative anim-fade-up delay-2">
        <div className="absolute inset-0 bg-blush/30 rounded-[3rem] rotate-3" aria-hidden="true" />
        <img
          src="/images/hero.jpg"
          alt="Perro con suéter artesanal tejido a mano por Ricaurte Mascotas"
          className="relative rounded-[3rem] shadow-2xl w-full aspect-[4/3] object-cover"
          fetchPriority="high"
        />
        {/* Tarjeta flotante: garantía */}
        <div className="absolute -left-3 sm:-left-6 top-6 bg-paper rounded-2xl shadow-2xl p-3.5 flex items-center gap-3 anim-fade-up delay-3 max-w-[220px]">
          <span className="w-10 h-10 rounded-xl bg-mint text-ink flex items-center justify-center shrink-0"><IconShield className="w-5 h-5" /></span>
          <div>
            <p className="text-xs font-extrabold text-ink leading-tight">Garantía Ricaurte Mascotas</p>
            <p className="text-[10px] text-body/70">Avalado por veterinarios</p>
          </div>
        </div>
        {/* Tarjeta flotante: reseña */}
        <div className="absolute -right-2 sm:-right-4 bottom-8 bg-paper rounded-2xl shadow-2xl p-3.5 flex items-center gap-3 anim-fade-up delay-4 max-w-[230px]">
          <span className="w-10 h-10 rounded-xl bg-blush text-ink flex items-center justify-center shrink-0"><IconHeart className="w-5 h-5" /></span>
          <div>
            <StarRating rating={5} className="w-3 h-3" />
            <p className="text-[11px] font-bold text-ink leading-tight mt-0.5">“Mi perro no se lo quiere quitar”</p>
            <p className="text-[10px] text-body/70">María F. • El Salado</p>
          </div>
        </div>
      </div>
    </div>
  </section>
);

// ─── Barra de beneficios ──────────────────────────────────────────────────
const BENEFITS = [
  { icon: IconTruck, title: 'Envío 24–48h', desc: 'Rápido en Ibagué y nacional' },
  { icon: IconShield, title: 'Garantía real', desc: '30 días avalados por Ricaurte Mascotas' },
  { icon: IconHand, title: 'Hecho a mano', desc: 'Artesanía 100% colombiana' },
  { icon: IconStar, title: '4.9 / 5 estrellas', desc: '+850 clientes felices' },
];

const BenefitsBar: React.FC = () => (
  <section className="bg-ink text-pinky" aria-label="Beneficios">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 grid grid-cols-2 lg:grid-cols-4 gap-4">
      {BENEFITS.map((b) => (
        <div key={b.title} className="flex items-center gap-3">
          <span className="w-11 h-11 rounded-2xl bg-blush text-ink flex items-center justify-center shrink-0 shadow-blush"><b.icon className="w-5 h-5" /></span>
          <div>
            <p className="text-sm font-bold text-paper">{b.title}</p>
            <p className="text-[11px] text-pinky/70">{b.desc}</p>
          </div>
        </div>
      ))}
    </div>
  </section>
);

// ─── Categorías ───────────────────────────────────────────────────────────
const CategoryGrid: React.FC = () => (
  <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12" aria-labelledby="cat-title">
    <div className="text-center mb-8">
      <span className="inline-block bg-pinky text-ink text-[11px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">Explora</span>
      <h2 id="cat-title" className="font-display text-3xl sm:text-4xl mt-2">¿Qué necesita tu peludo hoy?</h2>
    </div>
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {CATEGORIES.map((c, i) => (
        <Link
          key={c.id}
          to={`/tienda?categoria=${c.id}`}
          className={`group relative rounded-3xl overflow-hidden shadow-card hover:shadow-blush transition-all hover:-translate-y-1 ${i === 0 ? 'col-span-2 lg:row-span-2' : ''}`}
        >
          <img
            src={c.image}
            alt={c.name}
            loading="lazy"
            decoding="async"
            className={`w-full object-cover group-hover:scale-105 transition-transform duration-500 ${i === 0 ? 'h-64 lg:h-full' : 'h-40 sm:h-48'}`}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/25 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <span className="text-2xl">{c.emoji}</span>
            <h3 className="text-paper font-bold text-base sm:text-lg leading-tight mt-1">{c.name}</h3>
            <p className="text-pinky/90 text-[11px] sm:text-xs mt-0.5">{c.desc}</p>
            <span className="inline-flex items-center gap-1 text-blush text-xs font-bold mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
              Ver colección <IconArrowRight className="w-3 h-3" />
            </span>
          </div>
        </Link>
      ))}
    </div>
  </section>
);

// ─── Banner garantía ──────────────────────────────────────────────────────
const GuaranteeBanner: React.FC = () => (
  <section className="max-w-7xl mx-auto px-4 sm:px-6 py-6" aria-label="Garantía">
    <div className="bg-paper border-2 border-mint rounded-[2rem] p-6 sm:p-10 grid md:grid-cols-[1.2fr_1fr] gap-6 items-center shadow-soft relative overflow-hidden">
      <div className="absolute -top-10 -right-10 w-44 h-44 bg-mint/40 rounded-full blur-2xl" aria-hidden="true" />
      <div>
        <span className="inline-flex items-center gap-2 bg-mint text-ink text-[11px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">🛡️ Avalado con garantía</span>
        <h2 className="font-display text-2xl sm:text-3xl mt-3">Cada prenda pasa el control veterinario de <span className="text-blush">Ricaurte Mascotas</span></h2>
        <p className="text-sm text-body mt-2 leading-relaxed max-w-xl">
          Nuestras prendas posquirúrgicas y de uso diario son revisadas por el equipo médico de la veterinaria Ricaurte Mascotas: materiales seguros, costuras resistentes y tallas pensadas en la anatomía de tu mascota.
        </p>
        <ul className="mt-4 space-y-2">
          {['Garantía de 30 días por defectos de fabricación', 'Cambio de talla gratis en 15 días', 'Materiales hipoalergénicos y sin tintes tóxicos'].map((t) => (
            <li key={t} className="flex items-center gap-2 text-sm text-body font-medium">
              <span className="w-5 h-5 rounded-full bg-mint text-ink flex items-center justify-center shrink-0"><IconCheck className="w-3 h-3" /></span> {t}
            </li>
          ))}
        </ul>
        <Link to="/garantia" className="inline-flex items-center gap-2 mt-5 bg-ink text-paper font-bold px-6 py-3 rounded-full hover:bg-body transition-colors">
          Conocer la garantía <IconArrowRight className="w-4 h-4" />
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {[
          ['🧵', 'Costuras reforzadas', 'doble puntada en puntos de tensión'],
          ['🌿', 'Tintes naturales', 'sin químicos agresivos'],
          ['📏', 'Guía de tallas', 'medidas exactas por raza'],
          ['💬', 'Asesoría gratis', 'por WhatsApp antes de comprar'],
        ].map(([e, t, d]) => (
          <div key={t} className="bg-cream/70 border border-pinky/40 rounded-2xl p-4 text-center hover:border-blush transition-colors">
            <span className="text-2xl">{e}</span>
            <p className="text-xs font-extrabold text-ink mt-1.5">{t}</p>
            <p className="text-[10px] text-body/70 mt-0.5">{d}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// ─── Testimonios ──────────────────────────────────────────────────────────
const Testimonials: React.FC = () => (
  <section className="bg-paper border-y border-pinky/40" aria-labelledby="test-title">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
      <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-8">
        <div>
          <span className="inline-block bg-blush text-ink text-[11px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">💬 Opiniones reales</span>
          <h2 id="test-title" className="font-display text-3xl sm:text-4xl mt-2">Clientes que aman a sus peludos</h2>
        </div>
        <div className="flex items-center gap-3 bg-cream border border-pinky/50 rounded-2xl px-4 py-3">
          <span className="font-display text-4xl text-ink">4.9</span>
          <div>
            <StarRating rating={4.9} className="w-4 h-4" />
            <p className="text-[11px] text-body/70 font-semibold">+850 reseñas verificadas</p>
          </div>
        </div>
      </div>
      <div className="grid md:grid-cols-3 gap-5">
        {TESTIMONIALS.map((t, i) => (
          <figure key={t.name} className="bg-cream/60 border border-pinky/50 rounded-3xl p-6 shadow-card hover:shadow-blush transition-all anim-fade-up" style={{ animationDelay: `${i * 120}ms` }}>
            <StarRating rating={t.rating} />
            <blockquote className="text-sm text-body leading-relaxed mt-3">“{t.text}”</blockquote>
            <figcaption className="flex items-center gap-3 mt-5">
              <span className="w-11 h-11 rounded-full bg-blush text-ink font-extrabold text-sm flex items-center justify-center">
                {t.name.split(' ').map((w) => w[0]).slice(0, 2).join('')}
              </span>
              <div>
                <p className="text-sm font-bold text-ink">{t.name}</p>
                <p className="text-[11px] text-body/70">{t.location} • compró: {t.product}</p>
              </div>
              <span className="ml-auto bg-mint text-ink text-[9px] font-extrabold px-2 py-1 rounded-full flex items-center gap-1"><IconCheck className="w-2.5 h-2.5" /> Verificada</span>
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  </section>
);

// ─── Feed social UGC ──────────────────────────────────────────────────────
const SocialFeed: React.FC = () => (
  <section className="max-w-7xl mx-auto px-4 sm:px-6 py-14" aria-labelledby="ugc-title">
    <div className="text-center mb-8">
      <span className="inline-block bg-ink text-pinky text-[11px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">📸 @ricaurte.mascotas</span>
      <h2 id="ugc-title" className="font-display text-3xl sm:text-4xl mt-2">Nuestros clientes en acción</h2>
      <p className="text-sm text-body mt-2">Etiquétanos con <strong className="text-ink">#MiPeludoRicaurte</strong> y aparece en nuestra galería</p>
    </div>
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
      {UGC_POSTS.map((post, i) => (
        <a
          key={i}
          href="#"
          onClick={(e) => e.preventDefault()}
          className="group relative aspect-square rounded-2xl overflow-hidden shadow-card"
          aria-label={`Publicación de ${post.user}`}
        >
          <img src={post.img} alt={`Cliente usando prenda Ricaurte Mascotas: ${post.user}`} loading="lazy" decoding="async" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3">
            <p className="text-paper text-[10px] font-bold">{post.user}</p>
            <p className="text-pinky text-[10px] flex items-center gap-1"><IconHeart className="w-3 h-3" /> {post.likes}</p>
          </div>
        </a>
      ))}
    </div>
  </section>
);

// ─── Página Home ──────────────────────────────────────────────────────────
export const Home: React.FC = () => {
  const bestSellers = PRODUCTS.filter((p) => p.bestSeller);
  const news = PRODUCTS.filter((p) => p.isNew);
  const offers = PRODUCTS.filter((p) => p.originalPrice);

  return (
    <>
      <Hero />
      <BenefitsBar />
      <CategoryGrid />
      <Carousel title="Lo más vendido" subtitle="🔥 Best sellers" emoji="🔥" products={bestSellers.length ? bestSellers : PRODUCTS.slice(0, 5)} accent="bg-blush" />
      <GuaranteeBanner />
      <Carousel title="Recién llegados" subtitle="✨ Nuevos lanzamientos" emoji="✨" products={news.length ? news : PRODUCTS.slice(5)} accent="bg-mint" />
      <Carousel title="Ofertas de temporada" subtitle="🏷️ Descuentos" emoji="🏷️" products={offers.length ? offers : PRODUCTS.slice(0, 4)} accent="bg-pinky" />
      <Testimonials />
      <SocialFeed />
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-6 text-center">
        <Link to="/tienda" className="inline-flex items-center gap-2 bg-blush text-ink font-extrabold px-8 py-4 rounded-full shadow-blush hover:bg-pinky hover:-translate-y-0.5 active:scale-95 transition-all">
          Ver todo el catálogo <IconArrowRight className="w-4 h-4" />
        </Link>
        <p className="text-[11px] text-body/60 mt-3">10 productos artesanales hoy — nueva colección cada mes 🧶</p>
      </section>
    </>
  );
};
