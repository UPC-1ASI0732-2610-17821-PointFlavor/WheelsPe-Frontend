import { api } from '@/shared/infrastructure/base-api';

export const DiscoveryRepository = {
    listCategories() {
        return api('/categories');
    },

    listHuariques() {
        return api('/huariques');
    },

    search(q) {
        const query = typeof q === 'string' ? encodeURIComponent(q) : '';
        return api(`/huariques?q=${query}`);
    },

    nearYou() {
        return api('/huariques?near=true');
    },

    getById(id) {
        return api(`/huariques/${id}`);
    },

    listByCategory(cat) {
        return api(`/huariques?cat=${encodeURIComponent(cat)}`);
    },

    create(dto) {
        const now = new Date().toISOString();
        return api('/huariques', {
            method: 'POST',
            body: JSON.stringify({ ...dto, createdAt: now, updatedAt: now })
        });
    },

    update(id, dto) {
        return api(`/huariques/${id}`, {
            method: 'PATCH',
            body: JSON.stringify({ ...dto, updatedAt: new Date().toISOString() })
        });
    }
};
