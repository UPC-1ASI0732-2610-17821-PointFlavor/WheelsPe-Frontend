import { FavoritesRepository } from '../infrastructure/favorites.repository.js';
import { DiscoveryRepository } from '../infrastructure/discovery.repository.js';
import { getSession } from '@/auth/application/get-session.query.js';
import { normalizeHuarique } from './list-huariques.query.js';

const GUEST_KEY = 'pf-favs-guest';

const readGuest = () => {
  try { return JSON.parse(localStorage.getItem(GUEST_KEY) || '[]'); }
  catch { return []; }
};
const writeGuest = (arr) => {
  localStorage.setItem(GUEST_KEY, JSON.stringify(arr));
  globalThis.dispatchEvent?.(new CustomEvent('pf-favs-updated'));
};

/**
 * Lista los favoritos del usuario actual.
 *  - Si hay sesión: pide /favorites?userId=X y resuelve los huariques.
 *  - Si NO hay sesión: usa localStorage como guest.
 * Devuelve: [{ favoriteId, huarique }]
 */
export async function listFavoritesQuery() {
  const session = getSession();
  if (!session?.id) {
    const guest = readGuest();
    return guest.map(h => ({ favoriteId: `guest-${h.id}`, huarique: { ...h, img: h.img } }));
  }
  const favs = await FavoritesRepository.listByUser(session.id);
  if (!favs?.length) return [];
  // Backend devuelve {id, userId, huariqueId}. Hidratamos cada huarique.
  const huariques = await Promise.all(
    favs.map(f => DiscoveryRepository.getById(f.huariqueId).catch(() => null))
  );
  return favs.map((f, i) => ({
    favoriteId: f.id,
    huarique: huariques[i] ? normalizeHuarique(huariques[i]) : null
  })).filter(x => x.huarique);
}

export async function getFavIdsQuery() {
  const list = await listFavoritesQuery();
  return list.map(x => x.huarique.id);
}

/**
 * Toggle: si ya existe, borra; si no, crea.
 * Retorna el set actualizado de ids.
 */
export async function toggleFavoriteUseCase(huarique) {
  const session = getSession();
  if (!session?.id) {
    const guest = readGuest();
    const i = guest.findIndex(x => x.id === huarique.id);
    if (i >= 0) guest.splice(i, 1);
    else guest.push(huarique);
    writeGuest(guest);
    return guest.map(x => x.id);
  }
  const existing = await FavoritesRepository.listByUser(session.id);
  const match = existing.find(f => Number(f.huariqueId) === Number(huarique.id));
  if (match) await FavoritesRepository.remove(match.id);
  else await FavoritesRepository.add(session.id, huarique.id);
  const fresh = await FavoritesRepository.listByUser(session.id);
  return fresh.map(f => Number(f.huariqueId));
}
