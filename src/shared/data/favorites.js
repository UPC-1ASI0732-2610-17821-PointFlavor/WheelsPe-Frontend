const KEY = 'pf-favs';
const read = () => {
  try { return JSON.parse(localStorage.getItem(KEY) || '[]'); }
  catch { return []; }
};
const write = (arr) => {
  localStorage.setItem(KEY, JSON.stringify(arr));
  window.dispatchEvent(new CustomEvent('pf-favs-updated'));
};
export function getFavorites() { return read(); }
export function getFavIds() { return read().map(h => h.id); }
export function isFavorite(id) { return read().some(h => h.id === Number(id)); }
export function toggleFavorite(h) {
  const list = read();
  const i = list.findIndex(x => x.id === h.id);
  if (i >= 0) list.splice(i, 1);
  else list.push(h);
  write(list);
  return list.map(x => x.id);
}
export function clearFavorites() { write([]); }
