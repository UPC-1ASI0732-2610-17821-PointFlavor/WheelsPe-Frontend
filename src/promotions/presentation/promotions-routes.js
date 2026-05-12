// Rutas del módulo Promotions
const PromosView = () => import('./views/promos.view.vue');
const PromotionsManagement = () => import('./views/promotions-management.view.vue');
const OwnerDashboard = () => import('./views/owner-dashboard.view.vue');
const OwnerPromoNew = () => import('./views/owner-promo-new.view.vue');

export default [
    { path: '/promos', name: 'promos', component: PromosView, meta: { title: 'Promos' } },
    {
        path: '/owner',
        name: 'owner',
        component: OwnerDashboard,
        meta: { title: 'Panel de dueño', requiresOwner: true }
    },
    {
        path: '/owner/promos',
        name: 'owner-promos',
        component: PromotionsManagement,
        meta: { title: 'Gestionar Promos', requiresOwner: true }
    },
    {
        path: '/owner/promos/new',
        name: 'owner-promo-new',
        component: OwnerPromoNew,
        meta: { title: 'Nueva promoción', requiresOwner: true }
    }
];
