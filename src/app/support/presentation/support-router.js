// Support Routes Configuration
export default [
  {
    path: 'tickets',
    name: 'support-tickets',
    component: () => import('./views/support-tickets.vue'),
    meta: { 
      title: 'Tickets de Soporte',
      requiresAuth: true
    }
  },
  {
    path: 'tickets/:id',
    name: 'support-ticket-detail',
    component: () => import('./components/support-ticket-detail.vue'),
    meta: { 
      title: 'Detalle del Ticket',
      requiresAuth: true
    }
  }
]
