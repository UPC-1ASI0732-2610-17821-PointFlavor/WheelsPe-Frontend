export default [
    { path: '/categories', name: 'categories', component: () => import('./views/categories.view.vue') },
    { path: '/results', name: 'results', component: () => import('./views/results.view.vue') },
    { path: '/map', name: 'map', component: () => import('./views/map.view.vue') },
    {
        path: '/huariques/:id',
        name: 'huarique-detail',
        component: () => import('./views/huarique-detail.view.vue'),
        meta: { title: 'Huarique' }
    },
    {
        path: '/favorites',
        name: 'favorites',
        component: () => import('./views/favorites.view.vue'),
        meta: { title: 'Mis favoritos' }
    },

    {
        path: '/preferences',
        name: 'preferences',
        component: () => import('./views/preferences.view.vue'),
        meta: { requiresAuth: true, title: 'Mis preferencias' }
    },

    {
        path: '/owner/huariques/new',
        name: 'owner-huarique-new',
        component: () => import('./views/owner-huarique-new.view.vue'),
        meta: { requiresOwner: true, title: 'Registrar huarique' }
    },
    {
        path: '/owner/huariques/:id/edit',
        name: 'owner-huarique-edit',
        component: () => import('./views/owner-huarique-edit.view.vue'),
        meta: { requiresOwner: true, title: 'Editar huarique' }
    }
];
