// Rental Module Routes
export default [
  {
    path: 'browse',
    name: 'rentals',
    component: () => import('./views/rental-page.vue'),
    meta: { title: 'Browse Vehicles', role: 'renter' }
  },
  {
    path: 'my-rentals',
    name: 'my-rentals',
    component: () => import('./views/my-rentals-page.vue'),
    meta: { title: 'My Rentals', role: 'renter' }
  },
  {
    path: 'details/:id',
    name: 'rental-details',
    component: () => import('./views/rental-details-page.vue'),
    props: true,
    meta: { title: 'Rental Details', requiresAuth: true }
  },
  {
    path: 'favorites',
    name: 'favorites',
    component: () => import('../../shared/views/coming-soon.vue'),
    meta: { title: 'Favorites', role: 'renter' }
  },
  {
    path: 'my-vehicles',
    name: 'my-vehicles',
    component: () => import('./views/my-vehicles-page.vue'),
    meta: { title: 'My Vehicles', role: 'owner' }
  },
  {
    path: 'vehicles/:id',
    name: 'vehicle-detail',
    component: () => import('./views/vehicle-detail-page.vue'),
    props: true,
    meta: { title: 'Vehicle Details', requiresAuth: true }
  },
  {
    path: 'add-vehicle',
    name: 'add-vehicle',
    component: () => import('./views/add-vehicle-page.vue'),
    meta: { title: 'Add Vehicle', role: 'owner', requiresAuth: true }
  },
  {
    path: 'edit-vehicle/:id',
    name: 'edit-vehicle',
    component: () => import('./views/edit-vehicle-page.vue'),
    props: true,
    meta: { title: 'Edit Vehicle', role: 'owner', requiresAuth: true }
  },
  {
    path: 'rental-requests',
    name: 'rental-requests',
    component: () => import('./views/rental-requests-page.vue'),
    meta: { title: 'Rental Requests', role: 'owner', requiresAuth: true }
  },
  {
    path: 'earnings',
    name: 'earnings',
    component: () => import('../../shared/views/coming-soon.vue'),
    meta: { title: 'Earnings', role: 'owner' }
  }
]
