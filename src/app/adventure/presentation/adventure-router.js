// Adventure Module Routes
export default [
  {
    path: '',
    name: 'adventure-routes',
    component: () => import('./views/adventure-routes.vue'),
    meta: { 
      title: 'Adventure Routes',
      requiresAuth: false 
    }
  },
  {
    path: 'create',
    name: 'create-adventure',
    component: () => import('./views/create-adventure.vue'),
    meta: { 
      title: 'Crear Aventura',
      requiresAuth: true,
      requiresRole: 'owner'
    }
  },
  {
    path: 'my-adventures',
    name: 'my-adventures',
    component: () => import('./views/my-adventures.vue'),
    meta: { 
      title: 'Mis Aventuras',
      requiresAuth: true,
      requiresRole: 'owner'
    }
  },
  {
    path: 'edit/:id',
    name: 'edit-adventure',
    component: () => import('./views/edit-adventure.vue'),
    props: true,
    meta: { 
      title: 'Editar Aventura',
      requiresAuth: true,
      requiresRole: 'owner'
    }
  },
  {
    path: ':id',
    name: 'adventure-route-detail',
    component: () => import('./views/adventure-route-detail.vue'),
    props: true,
    meta: { 
      title: 'Route Detail',
      requiresAuth: false 
    }
  }
]
