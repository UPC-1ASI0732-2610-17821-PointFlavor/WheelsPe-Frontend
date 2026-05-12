import { DiscoveryRepository } from '../infrastructure/discovery.repository.js';
import { resolveImage } from '@/shared/presentations/image-resolver.js';

export function normalizeHuarique(h) {
  return { ...h, img: resolveImage(h?.img) };
}

export async function listHuariquesQuery() {
  const raw = await DiscoveryRepository.listHuariques();
  return (raw || []).map(normalizeHuarique);
}

export async function getHuariqueQuery(id) {
  const raw = await DiscoveryRepository.getById(id);
  return raw ? normalizeHuarique(raw) : null;
}
