// Payment Module Routes
export default [
  {
    path: '',
    name: 'payments',
    component: () => import('../components/views/payments-view.vue'),
    meta: { title: 'Payment Module' }
  },
  {
    path: 'my-payments',
    name: 'my-payments',
    component: () => import('../components/views/payments-view.vue'),
    meta: { title: 'My Payments', requiresAuth: true }
  },
  {
    path: 'checkout',
    name: 'payment-checkout',
    component: () => import('./views/payment-page.vue'),
    meta: { title: 'Checkout', requiresAuth: true }
  },
  {
    path: 'damage/:ticketId',
    name: 'damage-payment',
    component: () => import('./views/damage-payment-page.vue'),
    meta: { title: 'Pago de Daños', requiresAuth: true }
  },
  {
    path: 'ticket/:ticketId',
    name: 'damage-ticket',
    component: () => import('./views/damage-ticket-page.vue'),
    meta: { title: 'Ticket de Daño', requiresAuth: true }
  }
]
