import React, { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FREE_SHIPPING_MIN, formatCOP, IBAGUE_NEIGHBORHOODS } from '../data/products';
import { useStore } from '../context/StoreContext';
import { IconArrowRight, IconCheck, IconMapPin, IconShield } from '../components/Icons';

const DELIVERY_OPTIONS = [
  { id: 'estandar', name: 'Envío estándar Ibagué', desc: '2 a 3 días hábiles • puerta a puerta', price: 8000, icon: '🚚' },
  { id: 'express', name: 'Envío exprés Ibagué', desc: '24 horas • para urgencias peludas', price: 15000, icon: '⚡' },
  { id: 'nacional', name: 'Envío nacional', desc: '3 a 5 días hábiles por transportadora con guía', price: 18000, icon: '📦' },
  { id: 'pickup', name: 'Recogida en veterinaria Animalandia', desc: 'Gratis • Cra 5 # 10-24, Ibagué • mismo día', price: 0, icon: '🏥' },
];

const PAYMENT_METHODS = [
  { id: 'nequi', name: 'Nequi', desc: 'Paga desde tu app Nequi al 300 123 4567', icon: '💗' },
  { id: 'daviplata', name: 'Daviplata', desc: 'Paga desde tu app Daviplata al 300 123 4567', icon: '💙' },
  { id: 'transferencia', name: 'Transferencia bancaria', desc: 'Bancolombia ahorros 123-456789-01 • Gana-gana: recibes tu pedido al confirmar el pago', icon: '🏦' },
  { id: 'cod', name: 'Pago contra entrega', desc: 'Solo en Ibagué • recargo de $5.000 • paga al recibir', icon: '💵' },
];

type Step = 1 | 2 | 3;

export const Checkout: React.FC = () => {
  const { cartDetails, cartSubtotal, coupon, couponDiscount, placeOrder, user, login, addToast } = useStore();
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>(1);

  const [form, setForm] = useState({
    nombre: user?.name ?? '', email: user?.email ?? '', telefono: '',
    departamento: 'Tolima', ciudad: 'Ibagué', barrio: '', direccion: '',
    notas: '', createAccount: false,
  });
  const [delivery, setDelivery] = useState('estandar');
  const [payment, setPayment] = useState('nequi');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [placing, setPlacing] = useState(false);

  const set = (k: string, v: string | boolean) => setForm((f) => ({ ...f, [k]: v }));

  const shipping = delivery === 'pickup' ? 0 : DELIVERY_OPTIONS.find((d) => d.id === delivery)?.price ?? 8000;
  const freeShip = cartSubtotal >= FREE_SHIPPING_MIN && delivery !== 'pickup';
  const total = cartSubtotal - couponDiscount + (freeShip ? 0 : shipping) + (payment === 'cod' ? 5000 : 0);

  const validStep1 = useMemo(() => {
    const e: Record<string, string> = {};
    if (form.nombre.trim().length < 5) e.nombre = 'Ingresa tu nombre completo';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Correo inválido';
    if (!/^3\d{9}$/.test(form.telefono.replace(/\s/g, ''))) e.telefono = 'Celular colombiano inválido (10 dígitos, ej. 3001234567)';
    if (!form.barrio.trim()) e.barrio = 'Selecciona o escribe tu barrio';
    if (delivery !== 'pickup' && form.direccion.trim().length < 6) e.direccion = 'Ingresa la dirección completa';
    setErrors(e);
    return Object.keys(e).length === 0;
  }, [form, delivery]);

  const goStep = (s: Step) => {
    if (s > step && !validStep1) { addToast('Revisa los campos marcados en rojo', '⚠️'); return; }
    setStep(s);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const confirm = () => {
    setPlacing(true);
    window.setTimeout(() => {
      const order = placeOrder({
        items: cartDetails.map(({ productId, size, color, qty }) => ({ productId, size, color, qty })),
        subtotal: cartSubtotal,
        shipping: freeShip ? 0 : shipping,
        discount: couponDiscount,
        total,
        payment: PAYMENT_METHODS.find((p) => p.id === payment)?.name ?? payment,
        delivery: DELIVERY_OPTIONS.find((d) => d.id === delivery)?.name ?? delivery,
        address: `${form.direccion || 'Recogida en tienda'}, ${form.barrio}, ${form.ciudad}`,
      });
      if (form.createAccount && !user) login(form.nombre, form.email);
      navigate(`/gracias/${order.id}`, { replace: true });
    }, 900);
  };

  if (cartDetails.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center">
        <span className="text-6xl">🧺</span>
        <h1 className="font-display text-3xl mt-4">No hay productos para pagar</h1>
        <Link to="/tienda" className="inline-block mt-5 bg-blush text-ink font-bold px-6 py-3 rounded-full shadow-blush">Ir a la tienda</Link>
      </div>
    );
  }

  const input = (key: string, label: string, placeholder: string, type = 'text', extra?: React.ReactNode) => (
    <div>
      <label htmlFor={`f-${key}`} className="text-xs font-extrabold text-ink block mb-1.5">{label}</label>
      <input
        id={`f-${key}`}
        type={type}
        value={String(form[key as keyof typeof form])}
        onChange={(e) => { set(key, e.target.value); if (errors[key]) setErrors((er) => ({ ...er, [key]: '' })); }}
        placeholder={placeholder}
        list={key === 'barrio' ? 'barrios-checkout' : undefined}
        className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blush transition-colors ${errors[key] ? 'border-red-400 bg-red-50' : 'border-body/25'}`}
      />
      {extra}
      {errors[key] && <p className="text-[11px] text-red-500 mt-1">⚠ {errors[key]}</p>}
    </div>
  );

  const steps = [
    { n: 1, label: 'Datos de envío', icon: '📍' },
    { n: 2, label: 'Entrega y pago', icon: '💳' },
    { n: 3, label: 'Confirmación', icon: '✅' },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <nav aria-label="Migas de pan" className="text-xs text-body/70 flex items-center gap-1.5">
        <Link to="/" className="hover:text-blush font-semibold">Inicio</Link><span>/</span>
        <Link to="/carrito" className="hover:text-blush font-semibold">Carrito</Link><span>/</span>
        <span className="text-ink font-bold">Checkout</span>
      </nav>
      <h1 className="font-display text-3xl sm:text-4xl mt-3">Pago seguro y sin complicaciones 🐾</h1>
      <p className="text-sm text-body/80 mt-1">Compra como invitado — no necesitas crear cuenta (aunque te conviene: pedidos e historial 😉)</p>

      {/* Barra de progreso */}
      <ol className="flex items-center gap-2 sm:gap-3 mt-6" aria-label="Progreso del checkout">
        {steps.map((s, i) => (
          <li key={s.n} className="flex items-center gap-2 sm:gap-3 flex-1 last:flex-none">
            <button
              onClick={() => s.n < step && goStep(s.n as Step)}
              className={`flex items-center gap-2 px-3 sm:px-4 py-2.5 rounded-full text-xs sm:text-sm font-extrabold transition-all ${step >= s.n ? 'bg-ink text-paper shadow-soft' : 'bg-paper text-body/60 border border-body/20'}`}
              aria-current={step === s.n ? 'step' : undefined}
            >
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] ${step > s.n ? 'bg-mint text-ink' : step === s.n ? 'bg-blush text-ink' : 'bg-body/10'}`}>
                {step > s.n ? '✓' : s.n}
              </span>
              <span className="hidden sm:inline">{s.label}</span>
            </button>
            {i < steps.length - 1 && <span className={`h-0.5 flex-1 rounded ${step > s.n ? 'bg-blush' : 'bg-body/15'}`} aria-hidden="true" />}
          </li>
        ))}
      </ol>

      <div className="grid lg:grid-cols-[1fr_380px] gap-8 mt-8 items-start">
        <div className="space-y-5">
          {/* PASO 1 */}
          {step === 1 && (
            <section className="bg-paper border border-pinky/50 rounded-3xl p-6 shadow-card anim-fade-up" aria-label="Datos de envío">
              <h2 className="font-display text-xl">📍 ¿A dónde enviamos?</h2>
              <div className="grid sm:grid-cols-2 gap-4 mt-4">
                {input('nombre', 'Nombre completo *', 'Ej. María Fernanda Gutiérrez')}
                {input('telefono', 'Celular (WhatsApp) *', '300 123 4567', 'tel')}
                {input('email', 'Correo electrónico *', 'tucorreo@ejemplo.com', 'email')}
                <div>
                  <label htmlFor="f-departamento" className="text-xs font-extrabold text-ink block mb-1.5">Departamento / Ciudad</label>
                  <div className="flex gap-2">
                    <select id="f-departamento" value={form.departamento} onChange={(e) => set('departamento', e.target.value)} className="border border-body/25 rounded-xl px-3 py-3 text-sm focus:border-blush focus:outline-none bg-paper">
                      <option>Tolima</option><option>Otro</option>
                    </select>
                    <select value={form.ciudad} onChange={(e) => set('ciudad', e.target.value)} className="flex-1 border border-body/25 rounded-xl px-3 py-3 text-sm focus:border-blush focus:outline-none bg-paper">
                      <option>Ibagué</option><option>Otra ciudad</option>
                    </select>
                  </div>
                </div>
                {input('barrio', 'Barrio (autocompleta) *', 'Ej. El Salado', 'text',
                  <datalist id="barrios-checkout">{IBAGUE_NEIGHBORHOODS.map((b) => <option key={b} value={b} />)}</datalist>)}
                {delivery !== 'pickup' && input('direccion', 'Dirección (calle, carrera, casa) *', 'Cra 5 # 10-24, Casa 3')}
              </div>
              {delivery === 'pickup' && (
                <p className="mt-4 bg-mint/40 border border-mint rounded-xl px-4 py-3 text-xs font-bold text-ink flex items-center gap-2">
                  <IconMapPin className="w-4 h-4" /> Recogerás en veterinaria Animalandia: Cra 5 # 10-24, Ibagué (lunes a sábado 8am–6pm)
                </p>
              )}
              <label className="flex items-center gap-2.5 mt-4 text-sm text-body cursor-pointer">
                <input type="checkbox" checked={form.createAccount} onChange={(e) => set('createAccount', e.target.checked)} className="accent-[#ff8ba7] w-4 h-4" />
                Crear mi cuenta al comprar (guardo mis datos para la próxima) — <strong className="text-ink">sin costo</strong>
              </label>
              <button onClick={() => goStep(2)} className="mt-5 w-full sm:w-auto bg-blush text-ink font-extrabold px-8 py-3.5 rounded-full shadow-blush hover:bg-pinky active:scale-[0.98] transition-all flex items-center justify-center gap-2">
                Continuar al pago <IconArrowRight className="w-4 h-4" />
              </button>
            </section>
          )}

          {/* PASO 2 */}
          {step === 2 && (
            <section className="space-y-5 anim-fade-up" aria-label="Entrega y pago">
              <div className="bg-paper border border-pinky/50 rounded-3xl p-6 shadow-card">
                <h2 className="font-display text-xl">🚚 Método de entrega</h2>
                <div className="grid sm:grid-cols-2 gap-3 mt-4">
                  {DELIVERY_OPTIONS.map((d) => (
                    <button
                      key={d.id}
                      onClick={() => setDelivery(d.id)}
                      className={`text-left border-2 rounded-2xl p-4 transition-all ${delivery === d.id ? 'border-blush bg-blush/10 shadow-blush' : 'border-body/15 hover:border-body/40'}`}
                    >
                      <span className="text-2xl">{d.icon}</span>
                      <p className="font-bold text-ink text-sm mt-1.5">{d.name}</p>
                      <p className="text-[11px] text-body/70 mt-0.5">{d.desc}</p>
                      <p className="font-extrabold text-ink mt-1.5">{d.price === 0 ? 'GRATIS' : formatCOP(d.price)}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-paper border border-pinky/50 rounded-3xl p-6 shadow-card">
                <h2 className="font-display text-xl">💳 Método de pago</h2>
                <div className="space-y-3 mt-4">
                  {PAYMENT_METHODS.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setPayment(p.id)}
                      className={`w-full text-left border-2 rounded-2xl p-4 flex items-start gap-3 transition-all ${payment === p.id ? 'border-blush bg-blush/10 shadow-blush' : 'border-body/15 hover:border-body/40'}`}
                    >
                      <span className="text-2xl">{p.icon}</span>
                      <span className="flex-1">
                        <span className="font-bold text-ink text-sm">{p.name}</span>
                        <span className="block text-[11px] text-body/70 mt-0.5">{p.desc}</span>
                      </span>
                      <span className={`w-5 h-5 rounded-full border-2 mt-1 flex items-center justify-center ${payment === p.id ? 'border-blush bg-blush' : 'border-body/30'}`}>
                        {payment === p.id && <IconCheck className="w-3 h-3 text-ink" />}
                      </span>
                    </button>
                  ))}
                </div>
                <p className="text-[11px] text-body/60 mt-3 flex items-center gap-1.5">
                  <IconShield className="w-4 h-4 text-green-600" /> Tus datos de pago están seguros. No almacenamos información financiera.
                </p>
              </div>

              <div className="flex gap-3">
                <button onClick={() => setStep(1)} className="bg-paper border-2 border-body/20 text-ink font-bold px-6 py-3 rounded-full hover:border-ink transition-colors">← Volver</button>
                <button onClick={() => goStep(3)} className="flex-1 bg-blush text-ink font-extrabold px-8 py-3.5 rounded-full shadow-blush hover:bg-pinky active:scale-[0.98] transition-all">
                  Revisar pedido
                </button>
              </div>
            </section>
          )}

          {/* PASO 3 */}
          {step === 3 && (
            <section className="bg-paper border border-pinky/50 rounded-3xl p-6 shadow-card anim-fade-up" aria-label="Confirmación">
              <h2 className="font-display text-xl">✅ Confirma tu pedido</h2>
              <div className="mt-4 space-y-3 text-sm">
                <div className="bg-cream/60 rounded-2xl p-4">
                  <p className="font-extrabold text-ink text-xs uppercase tracking-wide mb-2">📍 Envío a</p>
                  <p className="text-body">{form.nombre} • {form.telefono}</p>
                  <p className="text-body">{form.direccion || 'Recogida en tienda'}, {form.barrio}, {form.ciudad}</p>
                  <p className="text-body/70 text-xs mt-1">{DELIVERY_OPTIONS.find((d) => d.id === delivery)?.name}</p>
                </div>
                <div className="bg-cream/60 rounded-2xl p-4">
                  <p className="font-extrabold text-ink text-xs uppercase tracking-wide mb-2">💳 Pagar con</p>
                  <p className="text-body">{PAYMENT_METHODS.find((p) => p.id === payment)?.name}</p>
                  {payment === 'cod' && <p className="text-xs text-body/70 mt-1">Tendrás a la mano {formatCOP(total)} en efectivo o digital al recibir.</p>}
                </div>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {cartDetails.map((it) => (
                    <div key={`${it.productId}-${it.size}`} className="flex items-center gap-3 bg-paper border border-pinky/40 rounded-xl p-2.5">
                      <img src={it.product.images[0]} alt="" className="w-12 h-12 rounded-lg object-cover" />
                      <span className="flex-1 text-xs font-semibold text-ink">{it.qty}× {it.product.name} <span className="text-body/60 font-normal">({it.size}, {it.color})</span></span>
                      <span className="text-xs font-extrabold text-ink">{formatCOP(it.product.price * it.qty)}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={() => setStep(2)} className="bg-paper border-2 border-body/20 text-ink font-bold px-6 py-3 rounded-full hover:border-ink transition-colors">← Volver</button>
                <button
                  onClick={confirm}
                  disabled={placing}
                  className="flex-1 bg-ink text-paper font-extrabold px-8 py-4 rounded-full hover:bg-body active:scale-[0.98] transition-all disabled:opacity-60 text-base"
                >
                  {placing ? 'Procesando pago… 🐾' : `Confirmar y pagar ${formatCOP(total)}`}
                </button>
              </div>
            </section>
          )}
        </div>

        {/* Resumen lateral */}
        <aside className="bg-paper border border-pinky/50 rounded-3xl p-6 shadow-card lg:sticky lg:top-28">
          <h2 className="font-display text-lg">Tu pedido</h2>
          <div className="mt-4 space-y-3">
            {cartDetails.map((it) => (
              <div key={`${it.productId}-${it.size}`} className="flex items-center gap-3">
                <div className="relative shrink-0">
                  <img src={it.product.images[0]} alt="" className="w-14 h-14 rounded-xl object-cover" />
                  <span className="absolute -top-1.5 -right-1.5 bg-blush text-ink text-[10px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center">{it.qty}</span>
                </div>
                <span className="flex-1 text-xs font-semibold text-ink leading-snug line-clamp-2">{it.product.name}</span>
                <span className="text-xs font-extrabold text-ink">{formatCOP(it.product.price * it.qty)}</span>
              </div>
            ))}
          </div>
          <dl className="mt-5 pt-4 border-t border-dashed border-pinky space-y-2 text-sm">
            <div className="flex justify-between"><dt className="text-body">Subtotal</dt><dd className="font-bold text-ink">{formatCOP(cartSubtotal)}</dd></div>
            {coupon && <div className="flex justify-between"><dt className="text-body">Cupón {coupon}</dt><dd className="font-bold text-green-700">−{formatCOP(couponDiscount)}</dd></div>}
            <div className="flex justify-between"><dt className="text-body">Envío</dt><dd className={`font-bold ${freeShip || shipping === 0 ? 'text-green-700' : 'text-ink'}`}>{freeShip || shipping === 0 ? 'GRATIS' : formatCOP(shipping)}</dd></div>
            {payment === 'cod' && <div className="flex justify-between"><dt className="text-body">Recargo contra entrega</dt><dd className="font-bold text-ink">{formatCOP(5000)}</dd></div>}
            <div className="flex justify-between border-t-2 border-dashed border-pinky pt-3 text-base">
              <dt className="font-extrabold text-ink">Total</dt>
              <dd className="font-extrabold text-ink text-xl">{formatCOP(total)}</dd>
            </div>
            <p className="text-[10px] text-body/60 text-right">IVA incluido • Garantía Ricaurte Mascotas</p>
          </dl>
          <div className="mt-4 flex flex-wrap gap-1.5 justify-center">
            {['Nequi', 'Daviplata', 'Bancolombia', 'PSE', 'COD'].map((p) => (
              <span key={p} className="bg-cream border border-pinky/50 text-[10px] font-bold px-2.5 py-1 rounded-full text-ink">{p}</span>
            ))}
          </div>
          <p className="mt-3 text-center text-[10px] text-body/60 flex items-center justify-center gap-1">
            <IconShield className="w-3.5 h-3.5 text-green-600" /> SSL seguro • Cumplimos la ley de protección de datos
          </p>
        </aside>
      </div>
    </div>
  );
};
