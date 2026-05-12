import { api } from '@/shared/infrastructure/base-api';

/**
 * Favoritos persistidos por usuario en el recurso /favorites.
 * Shape: { id, userId, huariqueId, createdAt }
 */
export const FavoritesRepository = {
    listByUser(userId) {
        return api(`/favorites?userId=${userId}`);
    },

    add(userId, huariqueId) {
        return api('/favorites', {
            method: 'POST',
            body: JSON.stringify({
                userId: Number(userId),
                huariqueId: Number(huariqueId),
                createdAt: new Date().toISOString()
            })
        });
    },

    remove(favoriteId) {
        return api(`/favorites/${favoriteId}`, { method: 'DELETE' });
    }
};
