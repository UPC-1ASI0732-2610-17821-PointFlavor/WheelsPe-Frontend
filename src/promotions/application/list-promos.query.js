import { PromosRepository } from '../infrastructure/promos.repository.js';
import { PromotionEntity } from '../domain/model/promotion.entity.js';
import { resolveImage } from '@/shared/presentations/image-resolver.js';

export function normalizePromo(p) {
    return { ...p, img: resolveImage(p?.img) };
}

export const listPromosQuery = async () => {
    const all = await PromosRepository.list();

    const expired = (all || []).filter(p => {
        try {
            if (!p.startDate || !p.endDate) return false;
            const pe = new PromotionEntity(p);
            return pe.hasExpired();
        } catch {
            return false;
        }
    });

    if (expired.length) {
        try {
            await Promise.all(expired.map(p => PromosRepository.delete(p.id)));
        } catch (e) {
            console.warn('Error eliminando promos expiradas:', e.message || e);
        }
    }

    const fresh = await PromosRepository.list();
    return (fresh || []).map(normalizePromo);
};
