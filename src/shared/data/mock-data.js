// Mock data ported from pointflavor/data.jsx — used by views until backend covers it.
const imgMap = import.meta.glob('/src/assets/*.{png,jpg,jpeg,webp}', {
  eager: true, query: '?url', import: 'default'
});
const IMG = Object.fromEntries(
  Object.entries(imgMap).map(([p, url]) => [p.split('/').pop().toLowerCase(), url])
);
function pickImg(...names) {
  for (const n of names) {
    const key = n.toLowerCase();
    if (IMG[key]) return IMG[key];
  }
  return IMG['slogopuntosabor.png'] || Object.values(IMG)[0];
}

export const CATEGORIES = [
  { id: 'pollo',     name: 'Pollo a la brasa', count: 28, img: pickImg('pollo.jpg','pollo_brasa.jpg'),     blurb: 'Crocante, ahumado, dorado.' },
  { id: 'criolla',   name: 'Comida criolla',   count: 41, img: pickImg('criolla.jpg'),                     blurb: 'Recetas de la abuela, sin atajos.' },
  { id: 'marina',    name: 'Comida marina',    count: 22, img: pickImg('marina.jpg','marisco.jpg'),         blurb: 'Del muelle a la mesa.' },
  { id: 'chifa',     name: 'Chifa',            count: 19, img: pickImg('chifa.jpg','chifaref.jpg'),         blurb: 'Wok, jengibre, tradición.' },
  { id: 'parrillas', name: 'Parrillas',        count: 14, img: pickImg('parrillas.jpg','parrillasref.jpg'), blurb: 'Carbón vivo, corte preciso.' },
  { id: 'postres',   name: 'Postres',          count: 26, img: pickImg('postres.jpg','postresref.jpg'),     blurb: 'Dulces de barrio.' },
  { id: 'cafe',      name: 'Café',             count: 17, img: pickImg('cafe.jpg','caferef.jpeg'),           blurb: 'Granos peruanos, oficio lento.' },
  { id: 'menu',      name: 'Menú del día',     count: 33, img: pickImg('menu.jpg','menuref.jpg'),           blurb: 'Comer rico sin pensarlo.' },
];

export const HUARIQUES = [
  { id: 1, name: 'El Brasero', category: 'Pollo a la brasa', cat: 'pollo',
    district: 'Miraflores', price: 32, rating: 4.7, reviews: 184,
    img: pickImg('h-brasero.jpg','elbrasero.jpg'), address: 'Av. Larco 1102',
    tags: ['Familiar','Para llevar','WiFi'],
    promo: { discount: 15, label: 'Martes y miércoles' },
    bio: 'Tres generaciones haciendo el mismo pollo. Marinado 18 horas, leña de algarrobo, cremas hechas en casa.',
    hours: 'Lun–Dom · 12:00 – 23:00', phone: '+51 1 445 8120' },
  { id: 2, name: 'Don Lucho', category: 'Pollo a la brasa', cat: 'pollo',
    district: 'San Borja', price: 28, rating: 4.5, reviews: 142,
    img: pickImg('h-donlucho.jpg','donlucho.jpg'), address: 'Jr. Rosa Toro 845',
    tags: ['Familiar','Estacionamiento'],
    bio: 'El secreto está en la papa frita. Receta sin cambios desde 1987.',
    hours: 'Lun–Dom · 11:30 – 23:30', phone: '+51 1 222 0931' },
  { id: 3, name: 'Punto Grill', category: 'Parrillas', cat: 'parrillas',
    district: 'Surco', price: 58, rating: 4.6, reviews: 96,
    img: pickImg('h-puntogrill.jpg','puntogrill.jpg'), address: 'Av. El Polo 740',
    tags: ['Romántico','Reservar'],
    bio: 'Cortes argentinos, fuego de quebracho, carta corta y precisa.',
    hours: 'Mar–Dom · 13:00 – 23:00', phone: '+51 1 372 0099' },
  { id: 4, name: 'Brasa y Carbón', category: 'Parrillas', cat: 'parrillas',
    district: 'Barranco', price: 52, rating: 4.4, reviews: 71,
    img: pickImg('h-brasaycarbon.jpg','brasaycarbon.jpg'), address: 'Jr. Centenario 215',
    tags: ['Terraza','Música en vivo'],
    bio: 'Parrilla de barrio con alma de bistró. Corte del día y vino de la casa.',
    hours: 'Mié–Dom · 19:00 – 00:00', phone: '+51 1 247 4411' },
  { id: 5, name: 'La Marina', category: 'Comida marina', cat: 'marina',
    district: 'Chorrillos', price: 45, rating: 4.8, reviews: 213,
    img: pickImg('h-lamarina.jpg','la_marina.jpg'), address: 'Malecón Grau s/n',
    tags: ['Vista al mar','Fresco diario'],
    promo: { discount: 20, label: 'Almuerzo entre semana' },
    bio: 'Pesca del día, ceviche al momento, pisco sour reconocido.',
    hours: 'Mar–Dom · 12:00 – 17:00', phone: '+51 1 467 1230' },
  { id: 6, name: 'Rincón Marino', category: 'Comida marina', cat: 'marina',
    district: 'San Miguel', price: 38, rating: 4.3, reviews: 88,
    img: pickImg('h-rinconmarino.jpg','rinconmarino.jpg'), address: 'Av. La Marina 2940',
    tags: ['Familiar','Menú niño'],
    bio: 'Cevichería de barrio, porción generosa, leche de tigre legendaria.',
    hours: 'Mar–Dom · 11:00 – 17:00', phone: '+51 1 561 3322' },
  { id: 7, name: 'Mary Tierra', category: 'Comida criolla', cat: 'criolla',
    district: 'Magdalena', price: 30, rating: 4.6, reviews: 154,
    img: pickImg('h-marytierra.jpg','marytierra.jpg'), address: 'Jr. Echenique 511',
    tags: ['Tradicional','Caseros'],
    bio: 'Ají de gallina, seco de res, arroz con pato. Como en casa.',
    hours: 'Lun–Sab · 12:00 – 16:00', phone: '+51 1 263 8090' },
  { id: 8, name: 'La Picantería', category: 'Comida criolla', cat: 'criolla',
    district: 'Surquillo', price: 42, rating: 4.7, reviews: 198,
    img: pickImg('h-picanteria.jpg','la_picanteria.jpg'), address: 'Calle Sta. Rosa 388',
    tags: ['Tradicional','Reservar'],
    bio: 'Criollo arequipeño, picantes, chichas naturales, sobremesa larga.',
    hours: 'Lun–Sab · 12:00 – 17:00', phone: '+51 1 421 7700' },
  { id: 9, name: 'Chifa Ping', category: 'Chifa', cat: 'chifa',
    district: 'San Isidro', price: 35, rating: 4.5, reviews: 121,
    img: pickImg('h-chifaping.jpg','chifaping.jpg'), address: 'Av. Camino Real 1240',
    tags: ['Para llevar','Familiar'],
    bio: 'Chifa cantonés clásico. Aeropuerto, kam lu wantán, sopa wantán.',
    hours: 'Lun–Dom · 12:00 – 23:00', phone: '+51 1 421 1190' },
  { id: 10, name: 'San Joy Lao', category: 'Chifa', cat: 'chifa',
    district: 'Centro', price: 33, rating: 4.4, reviews: 167,
    img: pickImg('h-sanjoylao.jpg','sanjoylao.jpg'), address: 'Jr. Ucayali 779',
    tags: ['Histórico','Tradicional'],
    bio: 'Más de 90 años en Capón. Wok, brasa, té caliente.',
    hours: 'Lun–Dom · 11:00 – 22:00', phone: '+51 1 427 2032' },
  { id: 11, name: 'Don Pepe', category: 'Chifa', cat: 'chifa',
    district: 'La Victoria', price: 26, rating: 4.2, reviews: 79,
    img: pickImg('h-donpepe.jpg','don_pepe.jpg'), address: 'Av. Aviación 2210',
    tags: ['Económico','Rápido'],
    bio: 'Chifa de barrio, porciones grandes, llegas y comes.',
    hours: 'Lun–Dom · 12:00 – 23:30', phone: '+51 1 472 1188' },
  { id: 12, name: 'La Pastelería', category: 'Postres', cat: 'postres',
    district: 'Miraflores', price: 18, rating: 4.6, reviews: 89,
    img: pickImg('h-pasteleria.jpg','lapasteleria.jpg'), address: 'Av. Pardo 470',
    tags: ['Café','Sin gluten'],
    bio: 'Hornada diaria, recetas clásicas francesas con toque limeño.',
    hours: 'Lun–Dom · 08:00 – 21:00', phone: '+51 1 444 5677' },
  { id: 13, name: 'La Casa del Postre', category: 'Postres', cat: 'postres',
    district: 'San Isidro', price: 22, rating: 4.5, reviews: 67,
    img: pickImg('h-casapostre.jpg','lacasadelpostre.jpg'), address: 'Av. Pezet 1110',
    tags: ['Para llevar','Eventos'],
    promo: { discount: 10, label: 'Compra mayor a S/40' },
    bio: 'Tres leches, suspiro, alfajores. Lo de siempre, hecho bien.',
    hours: 'Mar–Dom · 10:00 – 22:00', phone: '+51 1 421 8800' },
  { id: 14, name: 'Dulces Sazón', category: 'Postres', cat: 'postres',
    district: 'Pueblo Libre', price: 15, rating: 4.4, reviews: 54,
    img: pickImg('h-dulcesazon.jpg','dulcesazon.jpg'), address: 'Av. Bolívar 622',
    tags: ['Económico','Tradicional'],
    bio: 'Dulces tradicionales: turrón, mazamorra, chapanas.',
    hours: 'Mar–Dom · 09:00 – 20:00', phone: '+51 1 461 0440' },
];

export const REVIEWS = {
  1: [
    { id:'r1', author:'Camila R.', initials:'CR', rating:5, when:'hace 3 días',
      text:'El cuarto de pollo con papas fritas es la versión más limpia que he probado. La crema de ajo es adictiva. Tres generaciones se nota.',
      tags:['Familiar','Vale la espera'] },
    { id:'r2', author:'Andrés Q.', initials:'AQ', rating:4, when:'hace 1 semana',
      text:'Buen pollo, atención correcta. La salsa de huacatay le da carácter.',
      tags:['Servicio'] },
    { id:'r3', author:'Marina P.', initials:'MP', rating:5, when:'hace 2 semanas',
      text:'Vine después de años y el sabor sigue intacto. Eso ya es noticia.',
      tags:['Tradicional'] },
  ],
  5: [
    { id:'r5', author:'Sofía L.', initials:'SL', rating:5, when:'hace 5 días',
      text:'Pedí tres tipos de ceviche y todos llegaron perfectos. La leche de tigre es de otro nivel. Vista al mar de regalo.',
      tags:['Vista al mar','Fresco'] },
    { id:'r6', author:'Renato M.', initials:'RM', rating:5, when:'hace 1 semana',
      text:'Pisco sour delicado, no muy dulce. La causa de cangrejo vale cada sol.',
      tags:['Pisco'] },
  ],
};

export const PROMOS = [
  { id:'p1', huariqueId:1, title:'Martes de pollo entero', discount:15, type:'descuento',
    code:'BRASA15', expires:'30 jun', daysLeft:9,
    note:'Pollo entero + papas grandes + ensalada por dos a S/68.',
    cat:'pollo', img: pickImg('h-brasero.jpg','elbrasero.jpg') },
  { id:'p2', huariqueId:5, title:'Almuerzo marino', discount:20, type:'menú',
    code:'MARINA20', expires:'15 jul', daysLeft:14,
    note:'Ceviche + arroz con mariscos + chicha morada. Lun a vie.',
    cat:'marina', img: pickImg('h-lamarina.jpg','la_marina.jpg') },
  { id:'p3', huariqueId:3, title:'Bife con copa', discount:10, type:'descuento',
    code:'GRILL10', expires:'30 jul', daysLeft:21,
    note:'Bife de chorizo + copa de malbec a S/89.',
    cat:'parrillas', img: pickImg('h-puntogrill.jpg','puntogrill.jpg') },
  { id:'p4', huariqueId:13, title:'Tres por dos', discount:33, type:'2x1',
    code:'POSTRE3X2', expires:'10 jun', daysLeft:6,
    note:'En postres clásicos seleccionados, todo el día.',
    cat:'postres', img: pickImg('h-casapostre.jpg','lacasadelpostre.jpg') },
  { id:'p5', huariqueId:9, title:'Combo familiar chifa', discount:18, type:'menú',
    code:'PING18', expires:'25 jun', daysLeft:11,
    note:'4 platos + sopa + arroz chaufa para compartir.',
    cat:'chifa', img: pickImg('h-chifaping.jpg','chifaping.jpg') },
  { id:'p6', huariqueId:7, title:'Menú criollo del día', discount:12, type:'menú',
    code:'CRIOLLO12', expires:'14 jul', daysLeft:30,
    note:'Entrada + fondo + bebida + postre por S/22.',
    cat:'criolla', img: pickImg('h-marytierra.jpg','marytierra.jpg') },
];

export const MAP_PINS = HUARIQUES.map((h, i) => ({
  ...h,
  x: 18 + (i * 53) % 64 + (i % 3) * 4,
  y: 16 + (i * 37) % 56 + (i % 2) * 3,
}));

export function findHuarique(id) {
  return HUARIQUES.find(h => h.id === Number(id)) || HUARIQUES[0];
}
