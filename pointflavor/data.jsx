// Mock data for PointFlavor prototype
const CATEGORIES = [
  { id: 'pollo',     name: 'Pollo a la brasa', count: 28, img: 'img/pollo.jpg',     blurb: 'Crocante, ahumado, dorado.' },
  { id: 'criolla',   name: 'Comida criolla',   count: 41, img: 'img/criolla.jpg',   blurb: 'Recetas de la abuela, sin atajos.' },
  { id: 'marina',    name: 'Comida marina',    count: 22, img: 'img/marina.jpg',    blurb: 'Del muelle a la mesa.' },
  { id: 'chifa',     name: 'Chifa',            count: 19, img: 'img/chifa.jpg',     blurb: 'Wok, jengibre, tradición.' },
  { id: 'parrillas', name: 'Parrillas',        count: 14, img: 'img/parrillas.jpg', blurb: 'Carbón vivo, corte preciso.' },
  { id: 'postres',   name: 'Postres',          count: 26, img: 'img/postres.jpg',   blurb: 'Dulces de barrio.' },
  { id: 'cafe',      name: 'Café',             count: 17, img: 'img/cafe.jpg',      blurb: 'Granos peruanos, oficio lento.' },
  { id: 'menu',      name: 'Menú del día',     count: 33, img: 'img/menu.jpg',      blurb: 'Comer rico sin pensarlo.' },
];

const HUARIQUES = [
  {
    id: 1, name: 'El Brasero',           category: 'Pollo a la brasa', cat: 'pollo',
    district: 'Miraflores',  price: 32, rating: 4.7, reviews: 184,
    img: 'img/h-brasero.jpg', address: 'Av. Larco 1102',
    tags: ['Familiar', 'Para llevar', 'WiFi'],
    promo: { discount: 15, label: 'Martes y miércoles' },
    bio: 'Tres generaciones haciendo el mismo pollo. Marinado 18 horas, leña de algarrobo, cremas hechas en casa.',
    hours: 'Lun–Dom · 12:00 – 23:00',
    phone: '+51 1 445 8120',
  },
  {
    id: 2, name: 'Don Lucho',            category: 'Pollo a la brasa', cat: 'pollo',
    district: 'San Borja',   price: 28, rating: 4.5, reviews: 142,
    img: 'img/h-donlucho.jpg', address: 'Jr. Rosa Toro 845',
    tags: ['Familiar', 'Estacionamiento'],
    bio: 'El secreto está en la papa frita. Receta sin cambios desde 1987.',
    hours: 'Lun–Dom · 11:30 – 23:30',
    phone: '+51 1 222 0931',
  },
  {
    id: 3, name: 'Punto Grill',          category: 'Parrillas',         cat: 'parrillas',
    district: 'Surco',       price: 58, rating: 4.6, reviews: 96,
    img: 'img/h-puntogrill.jpg', address: 'Av. El Polo 740',
    tags: ['Romántico', 'Reservar'],
    bio: 'Cortes argentinos, fuego de quebracho, carta corta y precisa.',
    hours: 'Mar–Dom · 13:00 – 23:00',
    phone: '+51 1 372 0099',
  },
  {
    id: 4, name: 'Brasa y Carbón',       category: 'Parrillas',         cat: 'parrillas',
    district: 'Barranco',    price: 52, rating: 4.4, reviews: 71,
    img: 'img/h-brasaycarbon.jpg', address: 'Jr. Centenario 215',
    tags: ['Terraza', 'Música en vivo'],
    bio: 'Parrilla de barrio con alma de bistró. Corte del día y vino de la casa.',
    hours: 'Mié–Dom · 19:00 – 00:00',
    phone: '+51 1 247 4411',
  },
  {
    id: 5, name: 'La Marina',            category: 'Comida marina',     cat: 'marina',
    district: 'Chorrillos',  price: 45, rating: 4.8, reviews: 213,
    img: 'img/h-lamarina.jpg', address: 'Malecón Grau s/n',
    tags: ['Vista al mar', 'Fresco diario'],
    promo: { discount: 20, label: 'Almuerzo entre semana' },
    bio: 'Pesca del día, ceviche al momento, pisco sour reconocido.',
    hours: 'Mar–Dom · 12:00 – 17:00',
    phone: '+51 1 467 1230',
  },
  {
    id: 6, name: 'Rincón Marino',        category: 'Comida marina',     cat: 'marina',
    district: 'San Miguel',  price: 38, rating: 4.3, reviews: 88,
    img: 'img/h-rinconmarino.jpg', address: 'Av. La Marina 2940',
    tags: ['Familiar', 'Menú niño'],
    bio: 'Cevichería de barrio, porción generosa, leche de tigre legendaria.',
    hours: 'Mar–Dom · 11:00 – 17:00',
    phone: '+51 1 561 3322',
  },
  {
    id: 7, name: 'Mary Tierra',          category: 'Comida criolla',    cat: 'criolla',
    district: 'Magdalena',   price: 30, rating: 4.6, reviews: 154,
    img: 'img/h-marytierra.jpg', address: 'Jr. Echenique 511',
    tags: ['Tradicional', 'Caseros'],
    bio: 'Ají de gallina, seco de res, arroz con pato. Como en casa.',
    hours: 'Lun–Sab · 12:00 – 16:00',
    phone: '+51 1 263 8090',
  },
  {
    id: 8, name: 'La Picantería',        category: 'Comida criolla',    cat: 'criolla',
    district: 'Surquillo',   price: 42, rating: 4.7, reviews: 198,
    img: 'img/h-picanteria.jpg', address: 'Calle Sta. Rosa 388',
    tags: ['Tradicional', 'Reservar'],
    bio: 'Criollo arequipeño, picantes, chichas naturales, sobremesa larga.',
    hours: 'Lun–Sab · 12:00 – 17:00',
    phone: '+51 1 421 7700',
  },
  {
    id: 9, name: 'Chifa Ping',           category: 'Chifa',             cat: 'chifa',
    district: 'San Isidro',  price: 35, rating: 4.5, reviews: 121,
    img: 'img/h-chifaping.jpg', address: 'Av. Camino Real 1240',
    tags: ['Para llevar', 'Familiar'],
    bio: 'Chifa cantonés clásico. Aeropuerto, kam lu wantán, sopa wantán.',
    hours: 'Lun–Dom · 12:00 – 23:00',
    phone: '+51 1 421 1190',
  },
  {
    id: 10, name: 'San Joy Lao',         category: 'Chifa',             cat: 'chifa',
    district: 'Centro',      price: 33, rating: 4.4, reviews: 167,
    img: 'img/h-sanjoylao.jpg', address: 'Jr. Ucayali 779',
    tags: ['Histórico', 'Tradicional'],
    bio: 'Más de 90 años en Capón. Wok, brasa, té caliente.',
    hours: 'Lun–Dom · 11:00 – 22:00',
    phone: '+51 1 427 2032',
  },
  {
    id: 11, name: 'Don Pepe',            category: 'Chifa',             cat: 'chifa',
    district: 'La Victoria', price: 26, rating: 4.2, reviews: 79,
    img: 'img/h-donpepe.jpg', address: 'Av. Aviación 2210',
    tags: ['Económico', 'Rápido'],
    bio: 'Chifa de barrio, porciones grandes, llegas y comes.',
    hours: 'Lun–Dom · 12:00 – 23:30',
    phone: '+51 1 472 1188',
  },
  {
    id: 12, name: 'La Pastelería',       category: 'Postres',           cat: 'postres',
    district: 'Miraflores',  price: 18, rating: 4.6, reviews: 89,
    img: 'img/h-pasteleria.jpg', address: 'Av. Pardo 470',
    tags: ['Café', 'Sin gluten'],
    bio: 'Hornada diaria, recetas clásicas francesas con toque limeño.',
    hours: 'Lun–Dom · 08:00 – 21:00',
    phone: '+51 1 444 5677',
  },
  {
    id: 13, name: 'La Casa del Postre',  category: 'Postres',           cat: 'postres',
    district: 'San Isidro',  price: 22, rating: 4.5, reviews: 67,
    img: 'img/h-casapostre.jpg', address: 'Av. Pezet 1110',
    tags: ['Para llevar', 'Eventos'],
    promo: { discount: 10, label: 'Compra mayor a S/40' },
    bio: 'Tres leches, suspiro, alfajores. Lo de siempre, hecho bien.',
    hours: 'Mar–Dom · 10:00 – 22:00',
    phone: '+51 1 421 8800',
  },
  {
    id: 14, name: 'Dulces Sazón',        category: 'Postres',           cat: 'postres',
    district: 'Pueblo Libre',price: 15, rating: 4.4, reviews: 54,
    img: 'img/h-dulcesazon.jpg', address: 'Av. Bolívar 622',
    tags: ['Económico', 'Tradicional'],
    bio: 'Dulces tradicionales: turrón, mazamorra, chapanas.',
    hours: 'Mar–Dom · 09:00 – 20:00',
    phone: '+51 1 461 0440',
  },
];

const REVIEWS = {
  1: [
    { id:'r1', author:'Camila R.', initials:'CR', rating:5, when:'hace 3 días',
      text:'El cuarto de pollo con papas fritas es la versión más limpia que he probado. La crema de ajo es adictiva. Tres generaciones se nota.',
      tags:['Familiar','Vale la espera'] },
    { id:'r2', author:'Andrés Q.',  initials:'AQ', rating:4, when:'hace 1 semana',
      text:'Buen pollo, atención correcta. La salsa de huacatay le da carácter. Lo único: estacionamiento difícil los viernes.',
      tags:['Servicio'] },
    { id:'r3', author:'Marina P.', initials:'MP', rating:5, when:'hace 2 semanas',
      text:'Vine después de años y el sabor sigue intacto. Eso ya es noticia.',
      tags:['Tradicional'] },
    { id:'r4', author:'Diego F.',  initials:'DF', rating:5, when:'hace 1 mes',
      text:'Los miércoles con descuento son una bendición. La papa frita está siempre crujiente.',
      tags:['Buen precio'] },
  ],
  5: [
    { id:'r5', author:'Sofía L.', initials:'SL', rating:5, when:'hace 5 días',
      text:'Pedí tres tipos de ceviche y todos llegaron perfectos. La leche de tigre es de otro nivel. Vista al mar de regalo.',
      tags:['Vista al mar','Fresco'] },
    { id:'r6', author:'Renato M.', initials:'RM', rating:5, when:'hace 1 semana',
      text:'Pisco sour delicado, no muy dulce. La causa de cangrejo vale cada sol.',
      tags:['Pisco'] },
    { id:'r7', author:'Lucía V.', initials:'LV', rating:4, when:'hace 3 semanas',
      text:'Excelente comida, el servicio puede ser lento un sábado pero entendible por la afluencia.',
      tags:['Servicio'] },
  ],
};

const PROMOS = [
  { id:'p1', huariqueId:1, title:'Martes de pollo entero',  discount:15, daysLeft:9,
    note:'Pollo entero + papas grandes + ensalada por dos a S/68.', cat:'pollo', img:'img/h-brasero.jpg' },
  { id:'p2', huariqueId:5, title:'Almuerzo marino',         discount:20, daysLeft:14,
    note:'Ceviche + arroz con mariscos + chicha morada. Lun a vie.', cat:'marina', img:'img/h-lamarina.jpg' },
  { id:'p3', huariqueId:3, title:'Bife con copa',           discount:10, daysLeft:21,
    note:'Bife de chorizo + copa de malbec a S/89.', cat:'parrillas', img:'img/h-puntogrill.jpg' },
  { id:'p4', huariqueId:13, title:'Tres por dos',           discount:33, daysLeft:6,
    note:'En postres clásicos seleccionados, todo el día.', cat:'postres', img:'img/h-casapostre.jpg' },
  { id:'p5', huariqueId:9, title:'Combo familiar chifa',    discount:18, daysLeft:11,
    note:'4 platos + sopa + arroz chaufa para compartir.', cat:'chifa', img:'img/h-chifaping.jpg' },
  { id:'p6', huariqueId:7, title:'Menú criollo del día',    discount:12, daysLeft:30,
    note:'Entrada + fondo + bebida + postre por S/22.', cat:'criolla', img:'img/h-marytierra.jpg' },
];

const PLANS = [
  {
    id:'basic', name:'Curioso', price:0, period:'siempre',
    tagline:'Empieza a descubrir.',
    features:[
      'Búsqueda y filtros básicos',
      'Hasta 10 favoritos',
      'Reseñas leídas',
      'Notificaciones limitadas'
    ]
  },
  {
    id:'premium', name:'Sibarita', price:24, period:'/ mes', popular:true,
    tagline:'Lo justo para comer mejor.',
    features:[
      'Favoritos ilimitados',
      'Reservas prioritarias',
      'Acceso a promos exclusivas',
      'Listas curadas mensuales',
      'Sin anuncios'
    ]
  },
  {
    id:'exclusive', name:'Mecenas', price:69, period:'/ mes',
    tagline:'Para quien quiere acompañar la escena.',
    features:[
      'Todo lo de Sibarita',
      'Cenas privadas con cocineros',
      'Catas y eventos cerrados',
      'Mesa garantizada en huariques top',
      'Soporte personal'
    ]
  },
];

// Pseudo-ubicaciones (porcentaje sobre el lienzo del mapa)
const MAP_PINS = HUARIQUES.map((h, i) => ({
  ...h,
  // distribuir alrededor del centro
  x: 22 + (i * 53) % 64 + (i%3)*4,
  y: 18 + (i * 37) % 56 + (i%2)*3,
}));

window.PF_DATA = { CATEGORIES, HUARIQUES, REVIEWS, PROMOS, PLANS, MAP_PINS };
