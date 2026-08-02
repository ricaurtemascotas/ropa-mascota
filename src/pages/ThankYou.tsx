import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { formatCOP, getProduct } from '../data/products';
import { useStore } from '../context/StoreContext';
import { IconArrowRight, IconCheck, IconPrint, IconTruck } from '../components/Icons';

const STATUS_FLOW = ['Procesando', 'Enviado', 'En tránsito', 'Entregado'];

export const ThankYou: React.FC = () => {
  const { orderId } = useParams();
  const { orders } = useStore();
  const order = orders.find((o) => o.id === orderId);

  if (!order) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center">
        <h1 className="font-display text-3xl">Pedido no encontrado</h1>
        <Link to="/tienda" className="inline-block mt-5 bg-blush text-ink font-bold px-6 py-3 rounded-full shadow-blush">Ir a la tienda</Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="text-center anim-fade-up">
        <span className="inline-flex w-20 h-20 rounded-full bg-mint text-ink items-center justify-center text-4xl shadow-blush">🐾</span>
        <h1 className="font-display text-3xl sm:text-4xl mt-4">¡Gracias por tu compra! 💖</h1>
        <p className="text-body mt-2">Tu pedido <strong className="text-ink">#{order.id}</strong> fue confirmado. Te enviamos los detalles a tu correo.</p>
        <div className="inline-flex items-center gap-2 bg-mint/50 border border-mint rounded-full px-4 py-2 text-xs font-extrabold text-ink mt-4">
          <IconCheck className="w-4 h-4 text-green-700" /> Estado actual: {order.status}
        </div>
      </div>

      {/* Seguimiento visual */}
      <div className="bg-paper border border-pinky/50 rounded-3xl p-6 shadow-card mt-8 anim-fade-up delay-2">
        <h2 className="font-display text-lg flex items-center gap-2"><IconTruck className="w-5 h-5 text-blush" /> Seguimiento del pedido</h2>
        <ol className="flex items-center mt-5">
          {STATUS_FLOW.map((s, i) => {
            const currentIdx = STATUS_FLOW.indexOf(order.status);
            const done = i <= currentIdx;
            return (
              <li key={s} className={`flex items-center ${i < STATUS_FLOW.length - 1 ? 'flex-1' : ''}`}>
                <div className="flex flex-col items-center">
                  <span className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-extrabold border-2 ${done ? 'bg-blush border-blush text-ink' : 'bg-paper border-body/25 text-body/50'}`}>
                    {done ? '✓' : i + 1}
                  </span>
                  <span className={`text-[10px] font-bold mt-1.5 ${done ? 'text-ink' : 'text-body/50'}`}>{s}</span>
                </div>
                {i < STATUS_FLOW.length - 1 && <span className={`flex-1 h-1 mx-1 mb-5 rounded ${i < currentIdx ? 'bg-blush' : 'bg-body/15'}`} />}
              </li>
            );
          })}
        </ol>
        <p className="text-[11px] text-body/60 mt-3 bg-cream/60 rounded-xl p-3">
          📦 Envío: {order.delivery} • Pago: {order.payment} • Dirección: {order.address}
        </p>
      </div>

      {/* Resumen */}
      <div className="bg-paper border border-pinky/50 rounded-3xl p-6 shadow-card mt-5 anim-fade-up delay-3">
        <h2 className="font-display text-lg">Resumen #{order.id}</h2>
        <div className="mt-4 space-y-2.5">
          {order.items.map((it) => {
            const prod = getProduct(it.productId);
            return (
              <div key={`${it.productId}-${it.size}`} className="flex items-center justify-between text-sm">
                <span className="text-body">{it.qty}× {prod?.name ?? it.productId} <span className="text-body/60 text-xs">({it.size}, {it.color})</span></span>
                <span className="font-bold text-ink">{prod ? formatCOP(prod.price * it.qty) : ''}</span>
              </div>
            );
          })}
          <div className="border-t border-dashed border-pinky pt-3 space-y-1.5 text-sm">
            <div className="flex justify-between"><span className="text-body">Subtotal</span><span className="font-bold text-ink">{formatCOP(order.subtotal)}</span></div>
            {order.discount > 0 && <div className="flex justify-between"><span className="text-body">Descuento</span><span className="font-bold text-green-700">−{formatCOP(order.discount)}</span></div>}
            <div className="flex justify-between"><span className="text-body">Envío</span><span className="font-bold text-ink">{order.shipping === 0 ? 'GRATIS' : formatCOP(order.shipping)}</span></div>
            <div className="flex justify-between text-base"><span className="font-extrabold text-ink">Total pagado</span><span className="font-extrabold text-ink">{formatCOP(order.total)}</span></div>
          </div>
        </div>
        <div className="flex flex-wrap gap-3 mt-5">
          <button onClick={() => window.print()} className="bg-paper border-2 border-body/20 text-ink font-bold px-5 py-3 rounded-full hover:border-ink transition-colors flex items-center gap-2 text-sm">
            <IconPrint className="w-4 h-4" /> Descargar factura (PDF)
          </button>
          <Link to="/cuenta" className="bg-ink text-paper font-bold px-5 py-3 rounded-full hover:bg-body transition-colors text-sm flex items-center gap-2">
            Ver mis pedidos <IconArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      <div className="text-center mt-8">
        <p className="text-sm text-body/70">¿Dudas con tu pedido? Escríbenos por WhatsApp</p>
        <a
          href={`https://wa.me/573001234567?text=Hola%2C%20tengo%20una%20pregunta%20sobre%20mi%20pedido%20${order.id}`}
          target="_blank" rel="noreferrer"
          className="inline-block mt-2 text-sm font-extrabold text-ink underline decoration-blush decoration-2 underline-offset-4 hover:text-blush transition-colors"
        >
          +57 300 123 4567
        </a>
      </div>
    </div>
  );
};
