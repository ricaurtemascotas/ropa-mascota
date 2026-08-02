import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';

const CONTENT: Record<string, { title: string; emoji: string; intro: string; sections: { h: string; body: string }[] }> = {
  envios: {
    title: 'Política de Envíos y Plazos de Entrega',
    emoji: '🚚',
    intro: 'Llevamos el calor artesanal de Ibagué a todo Colombia. Estos son nuestros tiempos y costos de entrega.',
    sections: [
      { h: 'Envíos en Ibagué', body: 'Envío estándar: $8.000 COP, entrega en 2 a 3 días hábiles puerta a puerta. Envío exprés: $15.000 COP, entrega en 24 horas. ¡Envío GRATIS en compras superiores a $100.000 COP!' },
      { h: 'Envíos nacionales', body: 'Envío a todo Colombia por transportadora con guía de seguimiento: $18.000 COP, entrega estimada de 3 a 5 días hábiles según la ciudad.' },
      { h: 'Recogida en tienda (Click & Collect)', body: 'Recoge tu pedido gratis en la veterinaria Animalandia (Cra 5 # 10-24, Ibagué) de lunes a sábado 8:00 am a 6:00 pm. Te avisamos por WhatsApp cuando esté listo, normalmente el mismo día.' },
      { h: 'Tiempo de preparación', body: 'Todas nuestras prendas son hechas a mano. Los productos en stock se preparan en 24 horas; las prendas a medida toman de 5 a 7 días hábiles adicionales.' },
      { h: 'Seguimiento', body: 'Al despachar tu pedido recibirás la guía por correo y WhatsApp. También puedes ver el estado en tu cuenta, sección "Mis pedidos".' },
    ],
  },
  devoluciones: {
    title: 'Política de Devoluciones, Cambios y Reembolsos',
    emoji: '🔄',
    intro: 'Queremos que tu peludo esté feliz. Si algo no funciona, lo resolvemos sin vueltas.',
    sections: [
      { h: 'Cambio de talla gratis', body: 'Tienes 15 días calendario desde la entrega para cambiar de talla sin costo adicional, siempre que la prenda esté sin uso, sin lavar y con su empaque original.' },
      { h: 'Garantía de fabricación (30 días)', body: 'Todas las prendas tienen 30 días de garantía por defectos de fabricación: costuras, broches, velcro o materiales. Avalada por Ricaurte Mascotas. Reparamos o reponemos la prenda sin costo.' },
      { h: 'Devolución del dinero', body: 'Si el producto no cumple lo prometido, devolvemos el 100% del valor pagado en un máximo de 5 días hábiles, al mismo medio de pago (Nequi, Daviplata o transferencia).' },
      { h: '¿Cómo solicitar?', body: 'Desde tu cuenta en el "Centro de devoluciones" o por WhatsApp al +57 300 123 4567. Te enviaremos las instrucciones y una guía de envío si aplica.' },
      { h: 'Prendas personalizadas', body: 'Las prendas a medida o personalizadas con nombre no tienen cambio de talla, pero sí garantía de fabricación. Escríbenos antes de pedir para asesorarte con las medidas.' },
    ],
  },
  terminos: {
    title: 'Términos y Condiciones de Uso',
    emoji: '📜',
    intro: 'Al usar esta tienda aceptas los siguientes términos. Son simples y justos, como nuestras prendas.',
    sections: [
      { h: '1. Sobre la tienda', body: 'Ricaurte Mascotas SAS (NIT 900.123.456-7), con domicilio en Cra 5 # 10-24, Ibagué, Tolima, comercializa prendas artesanales para mascotas a través de este sitio web.' },
      { h: '2. Productos artesanales', body: 'Al ser prendas hechas a mano, pueden existir pequeñas variaciones de tono o textura entre unidades. Estas diferencias hacen cada prenda única y no constituyen defecto.' },
      { h: '3. Precios y pagos', body: 'Todos los precios están en pesos colombianos (COP) e incluyen IVA. El pedido se confirma al recibir el pago. Aceptamos Nequi, Daviplata, transferencia bancaria y contra entrega (Ibagué).' },
      { h: '4. Pedidos y cancelaciones', body: 'Puedes cancelar un pedido sin costo dentro de las primeras 12 horas o si aún no ha sido despachado. Escríbenos por WhatsApp para gestionarlo.' },
      { h: '5. Propiedad intelectual', body: 'Los diseños, fotografías y textos de esta tienda son propiedad de Ricaurte Mascotas SAS. Prohibida su reproducción sin autorización.' },
    ],
  },
  privacidad: {
    title: 'Política de Privacidad y Tratamiento de Datos',
    emoji: '🔒',
    intro: 'Cumplimos la Ley 1581 de 2012 (protección de datos personales en Colombia). Tus datos están seguros con nosotros.',
    sections: [
      { h: '¿Qué datos recopilamos?', body: 'Nombre, correo electrónico, teléfono, dirección de envío y, si decides crearla, una contraseña cifrada. Nunca almacenamos datos de tarjetas bancarias.' },
      { h: '¿Para qué los usamos?', body: 'Procesar pedidos, coordinar entregas, enviar actualizaciones de envío, mejorar el servicio y, solo si aceptas, enviarte promociones por correo o WhatsApp.' },
      { h: '¿Compartimos tus datos?', body: 'Solo con transportadoras para la entrega del pedido y con plataformas de pago autorizadas. Nunca vendemos tus datos a terceros.' },
      { h: 'Tus derechos', body: 'Puedes solicitar en cualquier momento la consulta, actualización, rectificación o eliminación de tus datos escribiendo a contacto@ricaurte-mascotas.com.' },
      { h: 'Cookies', body: 'Usamos cookies para recordar tu carrito y preferencias. Puedes desactivarlas en tu navegador, aunque la experiencia de compra podría verse afectada.' },
    ],
  },
  garantia: {
    title: 'Garantía Ricaurte Mascotas',
    emoji: '🛡️',
    intro: 'Somos la única tienda de prendas artesanales en Ibagué avalada por una clínica veterinaria. Esto es lo que eso significa para ti.',
    sections: [
      { h: '¿Qué cubre?', body: '30 días de garantía por defectos de fabricación: costuras abiertas, broches o velcro en mal estado, materiales que no correspondan a la ficha técnica. Cubrimos reparación o reposición sin costo.' },
      { h: 'Aval veterinario', body: 'Nuestras prendas posquirúrgicas son revisadas por el equipo médico de la veterinaria Ricaurte Mascotas: verifican materiales seguros, ausencia de tintes tóxicos y cortes que no interfieran con heridas o vendajes.' },
      { h: 'Asesoría de talla gratis', body: 'Si no estás segura de la talla, escríbenos por WhatsApp con las medidas de tu mascota y un veterinario te asesora antes de comprar. Esto reduce devoluciones al mínimo.' },
      { h: '¿Cómo hacer válida la garantía?', body: 'Envía una foto del defecto por WhatsApp o desde tu cuenta en el centro de devoluciones. Respondemos en menos de 24 horas hábiles.' },
      { h: 'Qué no cubre', body: 'Daños por lavado incorrecto, uso indebido, mordidas de la mascota o desgaste normal por uso prolongado.' },
    ],
  },
};

export const Legal: React.FC<{ tipo?: string }> = ({ tipo: tipoProp }) => {
  const { tipo: tipoParam } = useParams();
  const tipo = tipoProp ?? tipoParam;
  const content = CONTENT[tipo ?? ''] ?? CONTENT.terminos;

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = `${content.title} | Ricaurte Mascotas`;
  }, [tipo]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <nav aria-label="Migas de pan" className="text-xs text-body/70 flex items-center gap-1.5">
        <Link to="/" className="hover:text-blush font-semibold">Inicio</Link><span>/</span>
        <span className="text-ink font-bold">{content.title}</span>
      </nav>

      <div className="mt-6 bg-paper border border-pinky/50 rounded-3xl p-6 sm:p-10 shadow-card">
        <span className="text-4xl">{content.emoji}</span>
        <h1 className="font-display text-3xl sm:text-4xl mt-3">{content.title}</h1>
        <p className="text-body mt-2">{content.intro}</p>
        <p className="text-xs text-body/60 mt-1">Última actualización: enero 2025</p>

        <div className="mt-8 space-y-6">
          {content.sections.map((s) => (
            <section key={s.h}>
              <h2 className="font-bold text-ink text-lg">{s.h}</h2>
              <p className="text-sm text-body leading-relaxed mt-1.5">{s.body}</p>
            </section>
          ))}
        </div>

        <div className="mt-10 bg-cream/70 border border-pinky/50 rounded-2xl p-5 text-sm text-body">
          ¿Tienes dudas sobre esta política? Contáctanos:
          <div className="flex flex-wrap gap-x-6 gap-y-1 mt-2 font-semibold text-ink">
            <span>📞 +57 300 123 4567</span>
            <span>✉️ contacto@ricaurte-mascotas.com</span>
            <span>📍 Cra 5 # 10-24, Ibagué</span>
          </div>
        </div>
      </div>
    </div>
  );
};
