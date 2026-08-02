// ─── Tipos ────────────────────────────────────────────────────────────────
export type CategoryId = 'frio' | 'lluvia' | 'posquirurgico' | 'ocasiones' | 'complementos';

export interface Review {
  id: string;
  author: string;
  location: string;
  rating: number;
  date: string;
  text: string;
  verified: boolean;
  photo?: string;
}

export interface QA { q: string; a: string; }

export interface Product {
  id: string;
  name: string;
  sku: string;
  category: CategoryId;
  species: 'Perro' | 'Gato' | 'Perro y Gato';
  sizes: string[];
  colors: { name: string; hex: string }[];
  price: number;
  originalPrice?: number;
  stock: number;
  images: string[];
  rating: number;
  reviewCount: number;
  isNew?: boolean;
  bestSeller?: boolean;
  badge?: string;
  shortDesc: string;
  description: string;
  specs: { material: string; peso: string; cuidados: string; origen: string; uso: string };
  tags: string[];
  views: number;
  reviews: Review[];
  qa: QA[];
}

// ─── Categorías ───────────────────────────────────────────────────────────
export interface Category {
  id: CategoryId;
  name: string;
  desc: string;
  image: string;
  emoji: string;
}

export const CATEGORIES: Category[] = [
  { id: 'frio', name: 'Abrigos & Suéteres', desc: 'Tejidos artesanales para el frío ibaguereño', image: '/images/p-sueter-nordico.jpg', emoji: '🧶' },
  { id: 'lluvia', name: 'Impermeables', desc: 'Protección total en días de lluvia', image: '/images/p-impermeable-capucha.jpg', emoji: '☔' },
  { id: 'posquirurgico', name: 'Prendas Posquirúrgicas', desc: 'Recuperación cómoda, segura y lavable', image: '/images/p-mameluco-perro.jpg', emoji: '🩺' },
  { id: 'ocasiones', name: 'Ocasiones Especiales', desc: 'Cumpleaños, navidad y momentos únicos', image: '/images/p-poncho-navideno.jpg', emoji: '🎉' },
  { id: 'complementos', name: 'Complementos', desc: 'Bufandas y accesorios tejidos a mano', image: '/images/p-bufanda.jpg', emoji: '🎀' },
];

export const SPECIES = ['Perro', 'Gato', 'Perro y Gato'] as const;

// ─── Guía de tallas ───────────────────────────────────────────────────────
export const SIZE_GUIDE = [
  { size: 'XS', pecho: '20–28 cm', largo: '15–20 cm', peso: '0.5–2 kg', raza: 'Chihuahua, York miniatura, gatitos' },
  { size: 'S', pecho: '28–36 cm', largo: '20–28 cm', peso: '2–4.5 kg', raza: 'Poodle toy, Shih Tzu, gato adulto' },
  { size: 'M', pecho: '36–45 cm', largo: '28–36 cm', peso: '4.5–8 kg', raza: 'Poodle mediano, Schnauzer, Maltés' },
  { size: 'L', pecho: '45–55 cm', largo: '36–45 cm', peso: '8–14 kg', raza: 'Beagle, Cocker, French' },
  { size: 'XL', pecho: '55–65 cm', largo: '45–55 cm', peso: '14–22 kg', raza: 'Golden joven, Boxer pequeño' },
];

// ─── Productos (10) ───────────────────────────────────────────────────────
const STOCK_EXTRA: Record<string, string[]> = {
  sueter: [
    'https://images.pexels.com/photos/30449872/pexels-photo-30449872.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
    'https://images.pexels.com/photos/13073385/pexels-photo-13073385.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
  ],
  gato: [
    'https://images.pexels.com/photos/7288643/pexels-photo-7288643.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
    'https://images.pexels.com/photos/26346315/pexels-photo-26346315.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
  ],
  lluvia: [
    'https://images.pexels.com/photos/8499257/pexels-photo-8499257.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
    'https://images.pexels.com/photos/8499237/pexels-photo-8499237.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
  ],
  fiesta: [
    'https://images.pexels.com/photos/14720760/pexels-photo-14720760.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
    'https://images.pexels.com/photos/9382432/pexels-photo-9382432.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
  ],
};

export const PRODUCTS: Product[] = [
  {
    id: 'sueter-nordico',
    name: 'Suéter Nórdico Tejido a Mano',
    sku: 'RM-001',
    category: 'frio',
    species: 'Perro',
    sizes: ['XS', 'S', 'M', 'L'],
    colors: [{ name: 'Crema', hex: '#f3e9da' }, { name: 'Terracota', hex: '#c4704f' }, { name: 'Gris', hex: '#8d8d92' }],
    price: 54900,
    originalPrice: 64900,
    stock: 5,
    images: ['/images/p-sueter-nordico.jpg', ...STOCK_EXTRA.sueter],
    rating: 4.9,
    reviewCount: 47,
    bestSeller: true,
    shortDesc: 'Suéter de lana acrílica premium tejido punto a punto. Perfecto para las noches frías de Ibagué.',
    description:
      'Tejido a mano con lana acrílica premium suave al tacto, este suéter nórdico mantiene a tu peludo abrigado sin limitar sus movimientos. Su cuello alto estilo nórdico protege del viento y el patrón geométrico lo hace único: no hay dos iguales. Ideal para razas pequeñas y medianas que sienten el frío de las lluvias y las noches en Ibagué. Hecho con amor por manos artesanas colombianas y avalado por el equipo veterinario de Ricaurte Mascotas.',
    specs: {
      material: 'Lana acrílica premium (hipoalergénica, sin picazón)',
      peso: '180 g aprox.',
      cuidados: 'Lavar a mano con agua fría, secar a la sombra. No usar secadora.',
      origen: 'Hecho a mano en Ibagué, Tolima',
      uso: 'Clima frío y lluvioso, paseos nocturnos, hogares con aire acondicionado',
    },
    tags: ['sueter', 'abrigo', 'frio', 'tejido', 'lana', 'perro', 'invierno', 'lluvia'],
    views: 24,
    reviews: [
      { id: 'r1', author: 'María Fernanda G.', location: 'Barrio El Salado, Ibagué', rating: 5, date: '12 enero 2025', verified: true, text: 'Mi chihuahua Tobby no quiere quitarse el suéter. La calidad del tejido es impresionante y le quedó perfecto siguiendo la guía de tallas.', photo: 'https://images.pexels.com/photos/30449872/pexels-photo-30449872.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940' },
      { id: 'r2', author: 'Carlos Rueda', location: 'Mirolindo, Ibagué', rating: 5, date: '28 diciembre 2024', verified: true, text: 'Llegó al día siguiente en Ibagué. Muy bien terminado, las costuras resisten los jalones de mi cachorro.' },
      { id: 'r3', author: 'Diana P.', location: 'San Fernando, Ibagué', rating: 4.5, date: '15 enero 2025', verified: true, text: 'Hermoso y calentico. Le pedí color terracota y quedó divino.' },
    ],
    qa: [
      { q: '¿Cómo sé qué talla pedir?', a: 'Mide el contorno del pecho de tu mascota con una cinta métrica y compáralo con nuestra guía de tallas. Si está entre dos tallas, recomendamos la más grande.' },
      { q: '¿Se puede lavar en lavadora?', a: 'Recomendamos lavado a mano con agua fría para conservar el tejido. Si usas lavadora, usa ciclo delicado y bolsa de malla.' },
    ],
  },
  {
    id: 'poncho-navideno',
    name: 'Poncho Navideño "Rudolph"',
    sku: 'RM-002',
    category: 'ocasiones',
    species: 'Perro',
    sizes: ['S', 'M', 'L'],
    colors: [{ name: 'Rojo Navidad', hex: '#c3272b' }, { name: 'Verde Bosque', hex: '#2e5d3a' }],
    price: 46900,
    stock: 4,
    images: ['/images/p-poncho-navideno.jpg', ...STOCK_EXTRA.fiesta],
    rating: 4.8,
    reviewCount: 31,
    badge: 'Temporada',
    shortDesc: 'Poncho festivo con aplicaciones de reno tejidas a mano. La foto perfecta para diciembre.',
    description:
      'Convierte a tu peludo en la estrella de la navidad con este poncho artesanal en fieltro y lana, adornado con su aplicador de reno tejido a mano y pompón en la capucha. Cómodo, fácil de poner (abre por delante con botones de madera) y súper abrigado para las novenas en Ibagué. Cada pieza incluye bolsita de regalo artesanal.',
    specs: {
      material: 'Fieltro suave + lana acrílica + botones de madera',
      peso: '220 g aprox.',
      cuidados: 'Lavar a mano con agua fría. No retorcer.',
      origen: 'Hecho a mano en Ibagué, Tolima',
      uso: 'Navidad, novenas, sesiones de fotos, celebraciones',
    },
    tags: ['navidad', 'poncho', 'diciembre', 'fiesta', 'perro', 'ocasion', 'fotos', 'reno'],
    views: 18,
    reviews: [
      { id: 'r4', author: 'Laura Herrera', location: 'La Pola, Ibagué', rating: 5, date: '20 diciembre 2024', verified: true, text: 'La foto navideña de mi perro fue la más linda de toda la familia. El poncho es hermoso y muy bien hecho.' },
      { id: 'r5', author: 'Andrés Martínez', location: 'Picaleña, Ibagué', rating: 4.5, date: '5 enero 2025', verified: true, text: 'Muy bonito, a mi French le encantó. El pompón de la capucha es su juguete favorito ahora.' },
    ],
    qa: [
      { q: '¿Incluye el gorro de reno?', a: 'El poncho incluye capucha con pompón. El gorro de reno con cuernos se puede agregar como complemento por $12.900.' },
      { q: '¿Sirve para gatos?', a: 'Este modelo está diseñado para perros, pero en talla XS a medida puede hacerse para gatos. Escríbenos por WhatsApp.' },
    ],
  },
  {
    id: 'bata-posquirurgica-gato',
    name: 'Bata Posquirúrgica de Algodón — Gato',
    sku: 'RM-003',
    category: 'posquirurgico',
    species: 'Gato',
    sizes: ['XS', 'S', 'M'],
    colors: [{ name: 'Celeste', hex: '#a8c8e8' }, { name: 'Blanco', hex: '#f7f5f0' }, { name: 'Rosa Bebé', hex: '#f4c2d4' }],
    price: 38900,
    stock: 6,
    images: ['/images/p-bata-gato.jpg', ...STOCK_EXTRA.gato],
    rating: 5.0,
    reviewCount: 28,
    bestSeller: true,
    shortDesc: 'Body de algodón transpirable con broches traseros. Evita que tu gato se lama la herida tras la cirugía.',
    description:
      'Diseñada junto al equipo veterinario de Ricaurte Mascotas, esta bata posquirúrgica protege heridas, incisiones y puntos sin causar estrés a tu gato. Algodón 100% transpirable, broches de presión en la espalda (fáciles de poner y quitar), orificio para cola y aberturas para necesidades sin desvestir. Corte amplio que no aprieta ni roza la herida. Reemplaza el molesto collar isabelino en la mayoría de casos.',
    specs: {
      material: 'Algodón percal 100% transpirable (2 capas)',
      peso: '60 g aprox.',
      cuidados: 'Lavable a máquina en ciclo delicado. Planchar a baja temperatura.',
      origen: 'Confeccionado a mano en Ibagué, Tolima',
      uso: 'Esterilización, cirugías, heridas, dermatitis, postoperatorio',
    },
    tags: ['posquirurgico', 'gato', 'cirugia', 'esterilizacion', 'body', 'algodon', 'recuperacion', 'heridas'],
    views: 31,
    reviews: [
      { id: 'r6', author: 'Valentina Osorio', location: 'El Vergel, Ibagué', rating: 5, date: '8 enero 2025', verified: true, text: 'Mi gata se dejó poner la bata sin pelear, cosa que jamás logró con el collar isabelino. Sanó su herida de esterilización en tiempo récord.' },
      { id: 'r7', author: 'Juliana R.', location: 'Belén, Ibagué', rating: 5, date: '22 diciembre 2024', verified: true, text: 'Excelente calidad, la recomendó la veterinaria de Ricaurte Mascotas. Ya compré otra de repuesto.' },
    ],
    qa: [
      { q: '¿Reemplaza el collar isabelino?', a: 'En la mayoría de casos sí, porque cubre completamente el abdomen. Para heridas en cabeza o patas, sigue siendo necesario el collar.' },
      { q: '¿Sirve para perros?', a: 'Este modelo es para gatos. Para perros tenemos el Mameluco Posquirúrgico (RM-004) con mayor cobertura.' },
    ],
  },
  {
    id: 'mameluco-posquirurgico',
    name: 'Mameluco Posquirúrgico Recuperación',
    sku: 'RM-004',
    category: 'posquirurgico',
    species: 'Perro',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [{ name: 'Verde Salvia', hex: '#a3b899' }, { name: 'Gris Claro', hex: '#c9c9cd' }],
    price: 42900,
    originalPrice: 49900,
    stock: 3,
    images: ['/images/p-mameluco-perro.jpg', ...STOCK_EXTRA.sueter],
    rating: 4.8,
    reviewCount: 39,
    badge: '-14%',
    shortDesc: 'Mameluco de cuerpo completo con velcro y broches. Máxima protección postoperatoria para perros.',
    description:
      'El favorito de las clínicas veterinarias de Ibagué. Este mameluco de cuerpo completo cubre abdomen, espalda y extremidades traseras, protegiendo incisiones de esterilización, tumores y cirugías. Cierre de velcro reforzado + broches de presión que resisten el intento de quitárselo. Aberturas anatómicas para que tu perro haga sus necesidades sin que tengas que retirar la prenda. Avalado por médicos veterinarios.',
    specs: {
      material: 'Algodón + elastano (4 direcciones) con refuerzos',
      peso: '95 g aprox.',
      cuidados: 'Lavar a máquina en agua fría. Secar a la sombra.',
      origen: 'Confeccionado a mano en Ibagué, Tolima',
      uso: 'Esterilización, cirugías abdominales, heridas, protección de vendajes',
    },
    tags: ['posquirurgico', 'perro', 'mameluco', 'cirugia', 'esterilizacion', 'recuperacion', 'body'],
    views: 22,
    reviews: [
      { id: 'r8', author: 'Santiago Quintero', location: 'El Jardín, Ibagué', rating: 5, date: '18 enero 2025', verified: true, text: 'Mi labrador se operó y este mameluco aguantó sus intentos de quitárselo. La veterinaria quedó impresionada con la calidad.' },
      { id: 'r9', author: 'Paola Arias', location: 'Calambeo, Ibagué', rating: 4.5, date: '30 diciembre 2024', verified: true, text: 'Muy buena tela, no le salió ninguna rozadura. Pídanle bien la talla, si dudan elijan la más grande.' },
    ],
    qa: [
      { q: '¿Se puede usar con vendajes?', a: 'Sí, el corte es amplio para que quepan gasas y vendajes sin apretar la zona afectada.' },
      { q: '¿Cuánto tarda el envío?', a: 'En Ibagué llega en 24–48 horas. A nivel nacional de 3 a 5 días hábiles.' },
    ],
  },
  {
    id: 'impermeable-capucha',
    name: 'Impermeable Urbano con Capucha',
    sku: 'RM-005',
    category: 'lluvia',
    species: 'Perro',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [{ name: 'Amarillo Mostaza', hex: '#e0a82e' }, { name: 'Azul Marino', hex: '#2c3a55' }],
    price: 62900,
    stock: 4,
    images: ['/images/p-impermeable-capucha.jpg', ...STOCK_EXTRA.lluvia],
    rating: 4.9,
    reviewCount: 43,
    bestSeller: true,
    shortDesc: 'Chaqueta 100% impermeable con capucha, bolsillo y tiras reflectivas. Paseos sin mojarse.',
    description:
      'Confeccionado con tela impermeable laminada y costuras termoselladas, este impermeable mantiene a tu perro seco en las lluvias de Ibagué. Incluye capucha ajustable, bolsillo interior para documentos o bolsitas, tiras reflectivas para paseos nocturnos y abertura para arnés. Se pliega y guarda en su propia bolsita de viaje. Ligero: tu perro no sentirá calor mientras camina.',
    specs: {
      material: 'Poliéster impermeable laminado + forro de malla transpirable',
      peso: '160 g aprox.',
      cuidados: 'Limpiar con paño húmedo. No lavar en lavadora.',
      origen: 'Confeccionado a mano en Ibagué, Tolima',
      uso: 'Lluvia, garúa, paseos en clima húmedo, protección del frío',
    },
    tags: ['impermeable', 'lluvia', 'chaqueta', 'capucha', 'reflectivo', 'perro', 'invierno'],
    views: 27,
    reviews: [
      { id: 'r10', author: 'Natalia Bonilla', location: 'La Floresta, Ibagué', rating: 5, date: '10 enero 2025', verified: true, text: 'Con las lluvias de diciembre mi perro llegaba seco y feliz. La capucha es adorable y sí funciona.' },
      { id: 'r11', author: 'Felipe Rojas', location: 'Centro, Ibagué', rating: 4.5, date: '2 enero 2025', verified: true, text: 'Muy buen material, se nota artesanal pero con acabados profesionales. Recomendado.' },
    ],
    qa: [
      { q: '¿Es totalmente impermeable o solo repelente?', a: 'Es 100% impermeable con costuras termoselladas. Probado bajo lluvia fuerte por más de 30 minutos.' },
      { q: '¿Puedo usar el arnés por debajo?', a: 'Sí, tiene una abertura trasera con velcro para pasar el arnés o la correa sin mojarse.' },
    ],
  },
  {
    id: 'chaleco-polar-gato',
    name: 'Chaleco Polar "Calorcito" — Gato',
    sku: 'RM-006',
    category: 'frio',
    species: 'Gato',
    sizes: ['XS', 'S', 'M'],
    colors: [{ name: 'Rosa', hex: '#f2a0b3' }, { name: 'Gris', hex: '#9aa0a6' }, { name: 'Menta', hex: '#9fd3b0' }],
    price: 34900,
    stock: 7,
    images: ['/images/p-chaleco-polar-gato.jpg', ...STOCK_EXTRA.gato],
    rating: 4.7,
    reviewCount: 22,
    isNew: true,
    shortDesc: 'Chaleco de polar extra suave con lazo tejido. Calor sin estorbar sus movimientos felinos.',
    description:
      'Polar de alta densidad, extra suave y sin pilling, cortado y cosido a mano pensando en la anatomía felina: deja libre la zona del arnés, no cubre las patas delanteras (los gatos lo detestan) y se abrocha con un lazo tejido ajustable. Perfecto para gatos de pelo corto que sienten frío, para después del baño o para recuperación de tríos. Su color rosa con lazo lo hace irresistible.',
    specs: {
      material: 'Polar anti-pilling 280 g + lazo tejido a mano',
      peso: '55 g aprox.',
      cuidados: 'Lavar a máquina en agua fría, ciclo suave.',
      origen: 'Hecho a mano en Ibagué, Tolima',
      uso: 'Clima frío, gatos de pelo corto, post-baño, recuperación',
    },
    tags: ['chaleco', 'polar', 'gato', 'frio', 'abrigo', 'suave', 'nuevo'],
    views: 14,
    reviews: [
      { id: 'r12', author: 'Camila Torres', location: 'Simón Bolívar, Ibagué', rating: 5, date: '16 enero 2025', verified: true, text: 'Mi gato esphynx por fin tiene algo que no intenta quitarse. Es súper suave y le encanta dormir con él.' },
      { id: 'r13', author: 'Miguel Ángel P.', location: 'La Cima, Ibagué', rating: 4.5, date: '9 enero 2025', verified: true, text: 'Muy lindo y bien cosido. El lazo es un detalle hermoso.' },
    ],
    qa: [
      { q: '¿A los gatos les molesta la ropa?', a: 'Muchos sí, por eso lo diseñamos sin mangas y con tejido suave. La mayoría se adapta en pocos minutos. Incluye instrucciones de adaptación gradual.' },
      { q: '¿Sirve para razas de pelo largo?', a: 'Sí, el polar no genera estática excesiva y no enreda el pelo si se retira con cuidado.' },
    ],
  },
  {
    id: 'vestido-princesa',
    name: 'Vestido de Princesa con Tules',
    sku: 'RM-007',
    category: 'ocasiones',
    species: 'Perro',
    sizes: ['XS', 'S', 'M'],
    colors: [{ name: 'Rosa Pastel', hex: '#f4c2d4' }, { name: 'Blanco', hex: '#f7f5f0' }],
    price: 52900,
    stock: 3,
    images: ['/images/p-vestido-princesa.jpg', ...STOCK_EXTRA.fiesta],
    rating: 4.9,
    reviewCount: 26,
    shortDesc: 'Vestido con capas de tul, moño de raso y espalda ajustable. Para la princesa de la casa.',
    description:
      'Un vestido digno de la realeza canina: tres capas de tul suave sobre forro de algodón, cinturón de raso con moño tejido y espalda ajustable con broches. Pensado para sesiones de fotos, cumpleaños, bodas y paseos especiales. No pica ni estorba: el tul es de alta calidad, suave al tacto. Cada vestido se cose a mano en Ibagué y se entrega en caja de regalo con lazo.',
    specs: {
      material: 'Algodón + tul suave + cinta de raso',
      peso: '120 g aprox.',
      cuidados: 'Lavar a mano con agua fría. Planchar el forro a baja temperatura.',
      origen: 'Confeccionado a mano en Ibagué, Tolima',
      uso: 'Sesiones de foto, cumpleaños, bodas, eventos',
    },
    tags: ['vestido', 'princesa', 'tul', 'fiesta', 'ocasion', 'perra', 'fotos', 'cumpleaños'],
    views: 19,
    reviews: [
      { id: 'r14', author: 'Isabella Moreno', location: 'Piedrahita, Ibagué', rating: 5, date: '14 enero 2025', verified: true, text: 'Las fotos de mi poodle con el vestido parecen de revista. La calidad del tul es de otro nivel.' },
      { id: 'r15', author: 'Daniela R.', location: 'El Ensueño, Ibagué', rating: 4.5, date: '27 diciembre 2024', verified: true, text: 'Hermosísimo, mi perra parecía novia. Llegó en caja de regalo, un detalle precioso.' },
    ],
    qa: [
      { q: '¿Es cómodo para usos largos?', a: 'Sí, el forro interior es de algodón suave y la espalda es ajustable, ideal para fiestas largas.' },
      { q: '¿Hacen vestidos a medida?', a: 'Sí, por pedido especial en 5 días hábiles. Escríbenos por WhatsApp con las medidas de tu mascota.' },
    ],
  },
  {
    id: 'bufanda-tejida',
    name: 'Bufanda Tejida "Abrazito"',
    sku: 'RM-008',
    category: 'complementos',
    species: 'Perro y Gato',
    sizes: ['Única (ajustable)', 'Única+'],
    colors: [{ name: 'Rosa y Crema', hex: '#f2a0b3' }, { name: 'Verde y Crema', hex: '#9fd3b0' }],
    price: 19900,
    stock: 8,
    images: ['/images/p-bufanda.jpg', ...STOCK_EXTRA.sueter],
    rating: 4.8,
    reviewCount: 35,
    isNew: true,
    shortDesc: 'Bufanda de punto con cierre ajustable. El complemento perfecto para cualquier outfit.',
    description:
      'La bufanda que combina con todo: tejida a mano en punto inglés con lana suave, se ajusta con botón de presión (no hay que amarrar nada) y tiene 12 cm de ancho para cubrir bien el cuello sin estorbar. Disponible para perros y gatos. Es el regalo perfecto de $19.900 para estrenar con cualquier prenda de la tienda. Incluye tarjetica artesanal para regalo.',
    specs: {
      material: 'Lana acrílica suave + botón de presión forrado',
      peso: '40 g aprox.',
      cuidados: 'Lavar a mano con agua fría.',
      origen: 'Tejida a mano en Ibagué, Tolima',
      uso: 'Complemento de abrigos, outfits, fotos, regalos',
    },
    tags: ['bufanda', 'complemento', 'accesorio', 'tejido', 'lana', 'perro', 'gato', 'regalo'],
    views: 11,
    reviews: [
      { id: 'r16', author: 'Andrea Villanueva', location: 'Gaitán, Ibagué', rating: 5, date: '20 enero 2025', verified: true, text: 'Compré dos: una para mi perro y una para el gato de mi mamá. Precio justo y calidad excelente.' },
      { id: 'r17', author: 'Sebastián Hoyos', location: 'La Magdalena, Ibagué', rating: 4.5, date: '11 enero 2025', verified: true, text: 'El botón de presión es genial, se pone en 3 segundos. Mi perro ni se da cuenta.' },
    ],
    qa: [
      { q: '¿Qué diferencia hay entre las tallas?', a: 'Única mide 42 cm de largo (razas pequeñas y gatos). Única+ mide 52 cm (razas medianas).' },
      { q: '¿Se puede personalizar con el nombre?', a: 'Sí, bordamos el nombre por $8.000 adicionales. Tarda 2 días hábiles extra.' },
    ],
  },
  {
    id: 'traje-lluvia-reflectivo',
    name: 'Traje Anti-Lluvia Reflectivo',
    sku: 'RM-009',
    category: 'lluvia',
    species: 'Perro',
    sizes: ['M', 'L', 'XL'],
    colors: [{ name: 'Azul Nocturno', hex: '#2c3a55' }],
    price: 58900,
    originalPrice: 67900,
    stock: 5,
    images: ['/images/p-traje-lluvia.jpg', ...STOCK_EXTRA.lluvia],
    rating: 4.7,
    reviewCount: 19,
    badge: '-13%',
    shortDesc: 'Overol impermeable con franjas reflectivas 360°. Para lluvias torrenciales y paseos de noche.',
    description:
      'El overol más completo para los aguaceros: cubre torso, pecho y espalda con tela impermeable de 3 capas y franjas reflectivas visibles a 360°. Cierre de cremallera impermeable con solapa, capucha con cordón y aberturas anatómicas. Especialmente diseñado para perros medianos y grandes que necesitan salir sí o sí, llueva o truene. Ideal también para noches en zonas poco iluminadas.',
    specs: {
      material: 'Poliéster 3 capas impermeable + reflectivo plateado',
      peso: '210 g aprox.',
      cuidados: 'Limpiar con paño húmedo. Secar colgado a la sombra.',
      origen: 'Confeccionado a mano en Ibagué, Tolima',
      uso: 'Lluvia torrencial, paseos nocturnos, seguridad vial',
    },
    tags: ['impermeable', 'lluvia', 'overol', 'reflectivo', 'seguridad', 'perro', 'noche'],
    views: 9,
    reviews: [
      { id: 'r18', author: 'Manuela Castro', location: 'Ancón, Ibagué', rating: 5, date: '17 enero 2025', verified: true, text: 'Mi golden de 18 kg por fin tiene un impermeable de verdad. Las franjas reflectivas se ven a kilómetros.' },
      { id: 'r19', author: 'Óscar Méndez', location: 'Combeima, Ibagué', rating: 4.5, date: '3 enero 2025', verified: true, text: 'Excelente para el campo, aguantó el aguacero completo sin mojar a mi perro.' },
    ],
    qa: [
      { q: '¿Sirve para gatos?', a: 'No, está diseñado para perros medianos y grandes. Para gatos tenemos la Bata Posquirúrgica y el Chaleco Polar.' },
      { q: '¿Las franjas reflectivas se lavan?', a: 'Sí, son termoselladas y no se despegan con el uso ni el lavado a mano.' },
    ],
  },
  {
    id: 'conjunto-cumpleanos',
    name: 'Conjunto de Cumpleaños "Fiesta"',
    sku: 'RM-010',
    category: 'ocasiones',
    species: 'Perro',
    sizes: ['S', 'M', 'L'],
    colors: [{ name: 'Rojo Festivo', hex: '#c3272b' }, { name: 'Azul', hex: '#2c3a55' }],
    price: 44900,
    stock: 4,
    images: ['https://images.pexels.com/photos/14720760/pexels-photo-14720760.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940', '/images/p-poncho-navideno.jpg'],
    rating: 4.8,
    reviewCount: 24,
    bestSeller: true,
    shortDesc: 'Set de fiesta: camiseta con estampado + corbata de moño + gorro de cumpleaños. Todo a mano.',
    description:
      'El kit completo para celebrar el cumpleaños de tu peludo como se merece: camiseta de algodón con estampado artesanal de "Hoy cumplo años", moño de raso cosido a mano y gorro de fiesta con elástico suave. Todo en una caja de regalo. Perfecto para el primer cumpleaños, adopciones o cualquier celebración. Si tu mascota cumple años este mes, ¡te regalamos la tarjeta de felicitación!',
    specs: {
      material: 'Algodón 100% + raso + cartulina decorativa',
      peso: '110 g aprox.',
      cuidados: 'Camiseta lavable a máquina. Gorro y moño solo limpieza superficial.',
      origen: 'Hecho a mano en Ibagué, Tolima',
      uso: 'Cumpleaños, adopciones, celebraciones, sesiones de foto',
    },
    tags: ['cumpleaños', 'fiesta', 'kit', 'gorro', 'moño', 'perro', 'celebracion', 'regalo'],
    views: 16,
    reviews: [
      { id: 'r20', author: 'Sofía Delgado', location: 'Claret, Ibagué', rating: 5, date: '25 diciembre 2024', verified: true, text: 'Celebramos el primer cumpleaños de Loki con el kit completo. Las fotos quedaron increíbles y la calidad es buenísima.' },
      { id: 'r21', author: 'Juan David S.', location: 'Kennedy, Ibagué', rating: 4.5, date: '13 enero 2025', verified: true, text: 'A mi perro no le gusta el gorro pero la camiseta le encanta y el moño es precioso. ¡Muy recomendado!' },
    ],
    qa: [
      { q: '¿Puedo pedir el gorro con la edad?', a: 'Sí, personalizamos el gorro con el número de años o nombre por $6.000 adicionales.' },
      { q: '¿El estampado se daña con los lavados?', a: 'No, usamos vinilo textil de alta duración. Lava la camiseta al revés en agua fría.' },
    ],
  },
];

// ─── Utilidades de producto ───────────────────────────────────────────────
export const formatCOP = (n: number) =>
  new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(n);

export const getProduct = (id: string) => PRODUCTS.find((p) => p.id === id);

export const discountOf = (p: Product) =>
  p.originalPrice ? Math.round((1 - p.price / p.originalPrice) * 100) : 0;

export const COUPONS: Record<string, number> = {
  BIENVENIDO10: 0.1,
  RICAURTE15: 0.15,
};

export const FREE_SHIPPING_MIN = 100000;

// ─── Testimonios ──────────────────────────────────────────────────────────
export const TESTIMONIALS = [
  {
    name: 'María Fernanda Gutiérrez',
    location: 'El Salado, Ibagué',
    text: 'Compré el suéter nórdico para mi chihuahua y la calidad superó lo que esperaba. Se nota que está hecho a mano con amor. ¡Y llegó en 24 horas!',
    rating: 5,
    product: 'Suéter Nórdico',
  },
  {
    name: 'Carlos Andrés Rueda',
    location: 'Mirolindo, Ibagué',
    text: 'La bata posquirúrgica fue una salvación cuando esterilizaron a mi gata. La veterinaria de Ricaurte Mascotas nos la recomendó y funcionó perfecto.',
    rating: 5,
    product: 'Bata Posquirúrgica Gato',
  },
  {
    name: 'Laura Herrera',
    location: 'La Pola, Ibagué',
    text: 'El poncho navideño es una obra de arte. Recibí mil cumplidos en las novenas y mi perro estuvo calientico toda la noche. Volveré a comprar.',
    rating: 5,
    product: 'Poncho Navideño',
  },
];

// ─── Feed social (UGC) ─────────────────────────────────────────────────────
export const UGC_POSTS = [
  { img: 'https://images.pexels.com/photos/7288643/pexels-photo-7288643.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940', likes: 342, user: '@michicito.ibague' },
  { img: 'https://images.pexels.com/photos/30449872/pexels-photo-30449872.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940', likes: 518, user: '@tobbyelchihuahua' },
  { img: 'https://images.pexels.com/photos/8499257/pexels-photo-8499257.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940', likes: 276, user: '@paseos.ibague' },
  { img: 'https://images.pexels.com/photos/14720760/pexels-photo-14720760.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940', likes: 689, user: '@navidad.peluda' },
  { img: 'https://images.pexels.com/photos/9382432/pexels-photo-9382432.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940', likes: 431, user: '@copito.tolima' },
  { img: 'https://images.pexels.com/photos/13073385/pexels-photo-13073385.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940', likes: 357, user: '@rocky.poodle' },
];

// ─── FAQ ──────────────────────────────────────────────────────────────────
export const FAQS = [
  {
    cat: 'Envíos y entrega',
    items: [
      { q: '¿Cuánto tarda el envío en Ibagué?', a: 'Envío estándar: 2 a 3 días hábiles. Envío exprés: 24 horas. Recogida gratuita en la veterinaria Animalandia (Cra 5 # 10-24) disponible el mismo día.' },
      { q: '¿Hacen envíos a otras ciudades de Colombia?', a: 'Sí, enviamos a todo el país por transportadora con guía de seguimiento: 3 a 5 días hábiles con costo de $18.000.' },
      { q: '¿Cuánto cuesta el envío?', a: 'En Ibagué: $8.000 estándar y $15.000 exprés. ¡Envío GRATIS en compras superiores a $100.000 COP!' },
    ],
  },
  {
    cat: 'Pagos',
    items: [
      { q: '¿Qué métodos de pago aceptan?', a: 'Nequi, Daviplata, transferencia bancaria (Bancolombia y otros) y pago contra entrega en Ibagué con un recargo de $5.000.' },
      { q: '¿Puedo pagar a crédito?', a: 'Por ahora trabajamos con pago de contado. Pronto tendremos opciones de pago a plazos.' },
      { q: '¿Los precios incluyen IVA?', a: 'Sí, todos nuestros precios incluyen IVA e impuestos. No hay cargos ocultos.' },
    ],
  },
  {
    cat: 'Productos y tallas',
    items: [
      { q: '¿Cómo elijo la talla correcta?', a: 'Mide el contorno del pecho y el largo de espalda de tu mascota, y compáralos con nuestra guía de tallas disponible en cada producto.' },
      { q: '¿Hacen prendas a medida?', a: 'Sí, para razas especiales o medidas atípicas hacemos prendas personalizadas en 5 a 7 días hábiles. Escríbenos por WhatsApp.' },
      { q: '¿Las prendas posquirúrgicas reemplazan el collar isabelino?', a: 'En la mayoría de casos sí. Si tienes dudas, consúltanos o pregúntale a tu veterinario.' },
    ],
  },
  {
    cat: 'Devoluciones y garantía',
    items: [
      { q: '¿Qué cubre la garantía de Ricaurte Mascotas?', a: 'Todas nuestras prendas tienen garantía de 30 días por defectos de fabricación: costuras, broches y materiales. Avalada por la veterinaria Ricaurte Mascotas.' },
      { q: '¿Puedo cambiar una talla?', a: 'Sí, tienes 15 días para solicitar cambio de talla sin costo, siempre que la prenda esté sin uso y con su empaque.' },
      { q: '¿Cómo solicito una devolución?', a: 'Desde tu panel de usuario en "Centro de devoluciones" o escribiéndonos por WhatsApp. Procesamos el reembolso en 3 a 5 días hábiles.' },
    ],
  },
];

// ─── Barrios de Ibagué (autocompletado de dirección) ──────────────────────
export const IBAGUE_NEIGHBORHOODS = [
  'El Salado', 'Mirolindo', 'San Fernando', 'La Pola', 'Picaleña', 'El Jardín', 'Belén', 'Centro',
  'La Floresta', 'Calambeo', 'El Vergel', 'Piedrahita', 'Gaitán', 'La Magdalena', 'El Ensueño',
  'Claret', 'Kennedy', 'Simón Bolívar', 'Ancón', 'Combeima', 'La Cima', 'Buenos Aires', 'Jordán',
  'Santa Ana', 'El Carmen', 'Restrepo', 'Villa Pinzón', 'La Estación', 'Arsenal', 'Interlaken',
];
