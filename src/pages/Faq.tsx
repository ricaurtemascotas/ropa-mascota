import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FAQS } from '../data/products';
import { IconChevronDown, IconWhatsApp } from '../components/Icons';

export const Faq: React.FC = () => {
  const [open, setOpen] = useState<string | null>(null);
  const [activeCat, setActiveCat] = useState(FAQS[0].cat);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <nav aria-label="Migas de pan" className="text-xs text-body/70 flex items-center gap-1.5">
        <Link to="/" className="hover:text-blush font-semibold">Inicio</Link><span>/</span><span className="text-ink font-bold">Centro de ayuda</span>
      </nav>

      <div className="text-center mt-6">
        <span className="inline-block bg-mint text-ink text-[11px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">Centro de ayuda</span>
        <h1 className="font-display text-4xl mt-3">¿Cómo podemos ayudarte? 🐾</h1>
        <p className="text-body mt-2 max-w-xl mx-auto">Respuestas rápidas sobre envíos, pagos, tallas, devoluciones y la garantía Ricaurte Mascotas.</p>
      </div>

      {/* Categorías */}
      <div className="flex gap-2 mt-8 overflow-x-auto no-scrollbar pb-1 justify-start sm:justify-center">
        {FAQS.map((f) => (
          <button
            key={f.cat}
            onClick={() => { setActiveCat(f.cat); setOpen(null); }}
            className={`shrink-0 px-4 py-2.5 rounded-full text-sm font-extrabold transition-all ${activeCat === f.cat ? 'bg-ink text-paper shadow-soft' : 'bg-paper text-body border border-body/20 hover:border-ink'}`}
          >
            {f.cat}
          </button>
        ))}
      </div>

      {/* Preguntas */}
      <div className="mt-6 space-y-3">
        {FAQS.find((f) => f.cat === activeCat)?.items.map((item, i) => {
          const key = `${activeCat}-${i}`;
          const isOpen = open === key;
          return (
            <div key={key} className="bg-paper border border-pinky/50 rounded-2xl overflow-hidden shadow-card">
              <button
                onClick={() => setOpen(isOpen ? null : key)}
                aria-expanded={isOpen}
                className="w-full flex items-center justify-between gap-3 px-5 py-4 text-left font-bold text-ink hover:bg-cream/50 transition-colors"
              >
                {item.q}
                <IconChevronDown className={`w-4 h-4 text-blush shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
              </button>
              {isOpen && <p className="px-5 pb-5 text-sm text-body leading-relaxed anim-fade-in">{item.a}</p>}
            </div>
          );
        })}
      </div>

      {/* Contacto */}
      <div className="grid sm:grid-cols-2 gap-4 mt-10">
        <div className="bg-cream/70 border border-pinky/50 rounded-3xl p-6 text-center">
          <span className="text-3xl">💬</span>
          <h2 className="font-display text-xl mt-2">WhatsApp directo</h2>
          <p className="text-sm text-body/70 mt-1">Respuesta en menos de 5 minutos en horario laboral.</p>
          <a
            href="https://wa.me/573001234567"
            target="_blank" rel="noreferrer"
            className="inline-flex items-center gap-2 mt-4 bg-mint text-ink font-extrabold px-6 py-3 rounded-full hover:shadow-card transition-all"
          >
            <IconWhatsApp className="w-5 h-5 text-green-700" /> +57 300 123 4567
          </a>
          <p className="text-[11px] text-body/60 mt-2">Lunes a sábado • 8:00 am – 6:00 pm</p>
        </div>
        <div className="bg-ink text-pinky rounded-3xl p-6 text-center">
          <span className="text-3xl">🏥</span>
          <h2 className="font-display text-xl mt-2 text-paper">Punto de recogida</h2>
          <p className="text-sm text-pinky/80 mt-1">Veterinaria Animalandia — Cra 5 # 10-24, Ibagué</p>
          <p className="text-xs mt-3 bg-paper/10 rounded-xl p-3 text-pinky/90">
            🎁 Recoge tu pedido sin costo de envío. Además, el equipo veterinario te asesora gratis sobre la talla de prendas posquirúrgicas.
          </p>
        </div>
      </div>
    </div>
  );
};
