import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { formatCOP, getProduct } from '../data/products';
import { useStore } from '../context/StoreContext';
import { IconCheck, IconHeart, IconMapPin, IconTruck } from '../components/Icons';

type Tab = 'resumen' | 'pedidos' | 'direcciones' | 'devoluciones';

const STATUS_COLORS: Record<string, string> = {
  Procesando: 'bg-amber-100 text-amber-700',
  Enviado: 'bg-sky-100 text-sky-700',
  'En tránsito': 'bg-violet-100 text-violet-700',
  Entregado: 'bg-mint text-ink',
};

export const Account: React.FC = () => {
  const { user, setLoginOpen, orders, wishlist, requestReturn, logout } = useStore();
  const [tab, setTab] = useState<Tab>('resumen');
  const [returnOrder, setReturnOrder] = useState('');
  const [returnReason, setReturnReason] = useState('Cambio de talla');
  const [addrForm, setAddrForm] = useState({ nombre: '', telefono: '', barrio: '', direccion: '', principal: true });
  const [addresses, setAddresses] = useState([
    { nombre: 'María F. Gutiérrez', telefono: '300 123 4567', barrio: 'El Salado', direccion: 'Cra 5 # 10-24, Casa 3', principal: true },
  ]);

  if (!user) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center">
        <span className="text-6xl">🔐</span>
        <h1 className="font-display text-3xl sm:text-4xl mt-5">Inicia sesión para ver tu cuenta</h1>
        <p className="text-body mt-3 max-w-md mx-auto">Accede a tus pedidos, direcciones, lista de deseos y centro de devoluciones. ¿Nuevo? Crear cuenta es gratis y tardas 30 segundos.</p>
        <div className="flex justify-center gap-3 mt-6 flex-wrap">
          <button onClick={() => setLoginOpen(true)} className="bg-blush text-ink font-extrabold px-7 py-3.5 rounded-full shadow-blush hover:bg-pinky transition-all">
            Iniciar sesión / Registrarse
          </button>
          <Link to="/tienda" className="bg-paper border-2 border-body/20 text-ink font-bold px-7 py-3.5 rounded-full hover:border-ink transition-all">
            Seguir comprando
          </Link>
        </div>
      </div>
    );
  }

  const myOrders = orders; // pedidos de la sesión + demo
  const totalSpent = myOrders.reduce((s, o) => s + o.total, 0);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <span className="w-16 h-16 rounded-3xl bg-blush text-ink font-display text-3xl flex items-center justify-center shadow-blush">
            {user.name.charAt(0).toUpperCase()}
          </span>
          <div>
            <h1 className="font-display text-2xl sm:text-3xl">¡Hola, {user.name.split(' ')[0]}! 👋</h1>
            <p className="text-sm text-body/70">{user.email} • Miembro desde 2025</p>
          </div>
        </div>
        <button onClick={logout} className="text-sm font-bold text-body underline underline-offset-4 hover:text-blush transition-colors">
          Cerrar sesión
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-6">
        {[
          [myOrders.length, 'Pedidos realizados'],
          [wishlist.length, 'En tu lista de deseos'],
          [formatCOP(totalSpent), 'Total invertido en amor'],
          ['4.9★', 'Tu tienda favorita'],
        ].map(([v, l]) => (
          <div key={l} className="bg-paper border border-pinky/50 rounded-2xl p-4 text-center shadow-card">
            <p className="font-display text-xl sm:text-2xl text-ink">{v}</p>
            <p className="text-[11px] text-body/70 font-semibold mt-1">{l}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mt-8 overflow-x-auto no-scrollbar pb-1">
        {([
          ['resumen', '🏠 Resumen'],
          ['pedidos', '📦 Mis pedidos'],
          ['direcciones', '📍 Direcciones'],
          ['devoluciones', '🔄 Devoluciones'],
        ] as [Tab, string][]).map(([t, l]) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`shrink-0 px-5 py-2.5 rounded-full text-sm font-extrabold transition-all ${tab === t ? 'bg-ink text-paper shadow-soft' : 'bg-paper text-body border border-body/20 hover:border-ink'}`}
          >
            {l}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {/* ── Resumen ── */}
        {tab === 'resumen' && (
          <div className="grid md:grid-cols-2 gap-5 anim-fade-up">
            <div className="bg-paper border border-pinky/50 rounded-3xl p-6 shadow-card">
              <h2 className="font-display text-lg flex items-center gap-2"><IconTruck className="w-5 h-5 text-blush" /> Último pedido</h2>
              {myOrders[0] ? (
                <div className="mt-4">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-ink">#{myOrders[0].id}</span>
                    <span className={`text-[11px] font-extrabold px-3 py-1 rounded-full ${STATUS_COLORS[myOrders[0].status]}`}>{myOrders[0].status}</span>
                  </div>
                  <p className="text-xs text-body/70 mt-1.5">{myOrders[0].date} • {myOrders[0].items.reduce((s, i) => s + i.qty, 0)} artículos • {formatCOP(myOrders[0].total)}</p>
                  <button onClick={() => setTab('pedidos')} className="mt-4 text-sm font-bold text-ink underline decoration-blush decoration-2 underline-offset-4 hover:text-blush transition-colors">
                    Ver historial completo →
                  </button>
                </div>
              ) : (
                <p className="text-sm text-body/70 mt-3">Aún no has hecho pedidos. ¡Tu peludo te está esperando! 🐶</p>
              )}
            </div>
            <div className="bg-paper border border-pinky/50 rounded-3xl p-6 shadow-card">
              <h2 className="font-display text-lg flex items-center gap-2"><IconHeart className="w-5 h-5 text-blush" /> Tu lista de deseos</h2>
              <div className="mt-4 flex gap-2 overflow-x-auto no-scrollbar">
                {wishlist.slice(0, 4).map((id) => {
                  const p = getProduct(id);
                  return p ? (
                    <Link key={id} to={`/producto/${p.id}`} className="shrink-0">
                      <img src={p.images[0]} alt={p.name} className="w-20 h-20 rounded-2xl object-cover border border-pinky/50" />
                    </Link>
                  ) : null;
                })}
                {wishlist.length === 0 && <p className="text-sm text-body/70">Guarda tus favoritos con el corazón 💖</p>}
              </div>
              <Link to="/deseos" className="inline-block mt-4 text-sm font-bold text-ink underline decoration-blush decoration-2 underline-offset-4 hover:text-blush transition-colors">
                Ver lista completa →
              </Link>
            </div>
            <div className="md:col-span-2 bg-mint/30 border border-mint rounded-3xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h2 className="font-display text-lg text-ink">🎁 ¿Sabías que puedes pagar con Nequi o contra entrega?</h2>
                <p className="text-sm text-body/70 mt-1">Paga como más te guste. Recogida gratis en veterinaria Animalandia.</p>
              </div>
              <Link to="/tienda" className="bg-ink text-paper font-bold px-6 py-3 rounded-full hover:bg-body transition-colors shrink-0">Seguir comprando</Link>
            </div>
          </div>
        )}

        {/* ── Pedidos ── */}
        {tab === 'pedidos' && (
          <div className="space-y-4 anim-fade-up">
            {myOrders.map((o) => (
              <article key={o.id} className="bg-paper border border-pinky/50 rounded-3xl p-5 shadow-card">
                <div className="flex flex-wrap items-center gap-3 justify-between">
                  <div>
                    <p className="font-extrabold text-ink">Pedido #{o.id}</p>
                    <p className="text-xs text-body/70">{o.date} • {o.payment} • {o.delivery}</p>
                  </div>
                  <span className={`text-[11px] font-extrabold px-3 py-1.5 rounded-full ${STATUS_COLORS[o.status]}`}>{o.status}</span>
                </div>
                <div className="flex gap-2 mt-4 overflow-x-auto no-scrollbar">
                  {o.items.map((it, i) => {
                    const p = getProduct(it.productId);
                    return p ? (
                      <div key={i} className="shrink-0 text-center">
                        <img src={p.images[0]} alt={p.name} className="w-16 h-16 rounded-xl object-cover border border-pinky/40" />
                        <span className="block text-[10px] font-bold text-ink mt-1">{it.qty}× {it.size}</span>
                      </div>
                    ) : null;
                  })}
                </div>
                <div className="flex items-center justify-between mt-4 pt-3 border-t border-dashed border-pinky/60">
                  <p className="text-xs text-body/70">{o.address}</p>
                  <p className="font-extrabold text-ink">{formatCOP(o.total)}</p>
                </div>
                <div className="flex gap-2 mt-3 flex-wrap">
                  <button onClick={() => { setReturnOrder(o.id); setTab('devoluciones'); }} className="text-xs font-bold text-body border border-body/25 px-4 py-2 rounded-full hover:border-blush hover:text-blush transition-colors">
                    Solicitar cambio / devolución
                  </button>
                  <a
                    href={`https://wa.me/573001234567?text=Hola%2C%20quiero%20seguimiento%20de%20mi%20pedido%20${o.id}`}
                    target="_blank" rel="noreferrer"
                    className="text-xs font-bold text-ink bg-cream px-4 py-2 rounded-full hover:bg-pinky/50 transition-colors"
                  >
                    Rastrear por WhatsApp
                  </a>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* ── Direcciones ── */}
        {tab === 'direcciones' && (
          <div className="grid md:grid-cols-2 gap-5 anim-fade-up">
            {addresses.map((a, i) => (
              <div key={i} className="bg-paper border border-pinky/50 rounded-3xl p-5 shadow-card relative">
                {a.principal && <span className="absolute top-4 right-4 bg-blush text-ink text-[10px] font-extrabold px-2.5 py-1 rounded-full">Principal</span>}
                <p className="font-extrabold text-ink flex items-center gap-2"><IconMapPin className="w-4 h-4 text-blush" /> {a.nombre}</p>
                <p className="text-sm text-body mt-2">{a.direccion}, {a.barrio}, Ibagué</p>
                <p className="text-xs text-body/70 mt-1">{a.telefono}</p>
              </div>
            ))}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setAddresses((prev) => [...prev, { ...addrForm, principal: false }]);
                setAddrForm({ nombre: '', telefono: '', barrio: '', direccion: '', principal: true });
              }}
              className="bg-cream/60 border-2 border-dashed border-pinky rounded-3xl p-5"
            >
              <h3 className="font-bold text-ink">+ Agregar nueva dirección</h3>
              <div className="grid grid-cols-2 gap-3 mt-3">
                <input required value={addrForm.nombre} onChange={(e) => setAddrForm({ ...addrForm, nombre: e.target.value })} placeholder="Nombre" aria-label="Nombre" className="col-span-2 bg-paper border border-body/25 rounded-xl px-3 py-2.5 text-sm focus:border-blush focus:outline-none" />
                <input required value={addrForm.telefono} onChange={(e) => setAddrForm({ ...addrForm, telefono: e.target.value })} placeholder="Celular" aria-label="Teléfono" className="bg-paper border border-body/25 rounded-xl px-3 py-2.5 text-sm focus:border-blush focus:outline-none" />
                <input required value={addrForm.barrio} onChange={(e) => setAddrForm({ ...addrForm, barrio: e.target.value })} placeholder="Barrio" aria-label="Barrio" className="bg-paper border border-body/25 rounded-xl px-3 py-2.5 text-sm focus:border-blush focus:outline-none" />
                <input required value={addrForm.direccion} onChange={(e) => setAddrForm({ ...addrForm, direccion: e.target.value })} placeholder="Dirección completa" aria-label="Dirección" className="col-span-2 bg-paper border border-body/25 rounded-xl px-3 py-2.5 text-sm focus:border-blush focus:outline-none" />
              </div>
              <button type="submit" className="mt-3 bg-ink text-paper text-sm font-bold px-5 py-2.5 rounded-full hover:bg-body transition-colors">Guardar dirección</button>
            </form>
          </div>
        )}

        {/* ── Devoluciones ── */}
        {tab === 'devoluciones' && (
          <div className="max-w-xl anim-fade-up">
            <div className="bg-paper border border-pinky/50 rounded-3xl p-6 shadow-card">
              <h2 className="font-display text-xl">🔄 Centro de devoluciones y cambios</h2>
              <p className="text-xs text-body/70 mt-1">Solicítalo sin enviar correos: lo gestionamos todo por aquí y por WhatsApp.</p>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  requestReturn(returnOrder || 'pedido reciente', returnReason);
                  setReturnOrder('');
                }}
                className="mt-5 space-y-4"
              >
                <div>
                  <label htmlFor="ret-order" className="text-xs font-extrabold text-ink block mb-1.5">Pedido</label>
                  <select id="ret-order" value={returnOrder} onChange={(e) => setReturnOrder(e.target.value)} required className="w-full border border-body/25 rounded-xl px-4 py-3 text-sm focus:border-blush focus:outline-none bg-paper">
                    <option value="">Selecciona un pedido…</option>
                    {myOrders.map((o) => <option key={o.id} value={o.id}>#{o.id} — {o.date}</option>)}
                  </select>
                </div>
                <div>
                  <label htmlFor="ret-reason" className="text-xs font-extrabold text-ink block mb-1.5">Motivo</label>
                  <select id="ret-reason" value={returnReason} onChange={(e) => setReturnReason(e.target.value)} className="w-full border border-body/25 rounded-xl px-4 py-3 text-sm focus:border-blush focus:outline-none bg-paper">
                    <option>Cambio de talla</option>
                    <option>Cambio de color</option>
                    <option>Producto defectuoso (garantía)</option>
                    <option>No era lo que esperaba</option>
                    <option>Otro</option>
                  </select>
                </div>
                <button type="submit" className="w-full bg-blush text-ink font-extrabold py-3.5 rounded-full shadow-blush hover:bg-pinky active:scale-[0.98] transition-all">
                  Enviar solicitud
                </button>
                <p className="text-[11px] text-body/60 flex items-center gap-1.5">
                  <IconCheck className="w-3.5 h-3.5 text-green-600" /> Te respondemos en menos de 24 horas hábiles. Cambios de talla sin costo en 15 días.
                </p>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
