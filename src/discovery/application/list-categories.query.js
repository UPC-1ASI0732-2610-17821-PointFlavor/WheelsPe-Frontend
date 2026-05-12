import { DiscoveryRepository } from '../infrastructure/discovery.repository.js';
import { resolveImage } from '@/shared/presentations/image-resolver.js';

export function normalizeCategory(c, i = 0) {
  if (typeof c === 'string') {
    return { id: String(c).toLowerCase(), name: c, count: 0, img: resolveImage(), blurb: '' };
  }
  return { ...c, id: c.id ?? c.name?.toLowerCase() ?? `cat-${i}`, img: resolveImage(c?.img) };
}

export async function listCategoriesQuery() {
  const raw = await DiscoveryRepository.listCategories();
  return (raw || []).map(normalizeCategory);
}
