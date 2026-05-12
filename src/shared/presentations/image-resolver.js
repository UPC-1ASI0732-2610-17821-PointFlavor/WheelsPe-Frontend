// Resuelve un nombre de imagen (string del backend) a una URL servida por Vite.
// El backend solo guarda el nombre del archivo (`h-brasero.jpg`). Aquí lo
// mapeamos al asset bundleado.
const modules = import.meta.glob('/src/assets/*.{png,jpg,jpeg,webp}', {
  eager: true, query: '?url', import: 'default'
});

const MAP = Object.fromEntries(
  Object.entries(modules).map(([p, url]) => [p.split('/').pop().toLowerCase(), url])
);

// Aliases para tolerar diferentes nombres entre backend y assets locales.
const ALIASES = {
  'pollo.jpg':         ['pollo_brasa.jpg'],
  'marina.jpg':        ['marisco.jpg'],
  'chifa.jpg':         ['chifaref.jpg'],
  'parrillas.jpg':     ['parrillasref.jpg'],
  'postres.jpg':       ['postresref.jpg'],
  'cafe.jpg':          ['caferef.jpeg'],
  'menu.jpg':          ['menuref.jpg'],
  'h-brasero.jpg':     ['elbrasero.jpg'],
  'h-donlucho.jpg':    ['donlucho.jpg'],
  'h-puntogrill.jpg':  ['puntogrill.jpg'],
  'h-brasaycarbon.jpg':['brasaycarbon.jpg'],
  'h-lamarina.jpg':    ['la_marina.jpg'],
  'h-rinconmarino.jpg':['rinconmarino.jpg'],
  'h-marytierra.jpg':  ['marytierra.jpg'],
  'h-picanteria.jpg':  ['la_picanteria.jpg'],
  'h-chifaping.jpg':   ['chifaping.jpg'],
  'h-sanjoylao.jpg':   ['sanjoylao.jpg'],
  'h-donpepe.jpg':     ['don_pepe.jpg'],
  'h-pasteleria.jpg':  ['lapasteleria.jpg'],
  'h-casapostre.jpg':  ['lacasadelpostre.jpg'],
  'h-dulcesazon.jpg':  ['dulcesazon.jpg']
};

const FALLBACK = MAP['slogopuntosabor.png'] || Object.values(MAP)[0] || '';

export function resolveImage(name) {
  if (!name) return FALLBACK;
  const key = String(name).toLowerCase();
  if (MAP[key]) return MAP[key];
  for (const alt of (ALIASES[key] || [])) {
    if (MAP[alt]) return MAP[alt];
  }
  return FALLBACK;
}
