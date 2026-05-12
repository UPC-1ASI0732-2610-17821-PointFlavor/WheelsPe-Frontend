// IAM Module Routes (Identity and Access Management)
export default [
  {
    path: 'login',
    name: 'login',
    component: () => import('../views/login-page.vue'),
    meta: { title: 'Login', requiresAuth: false, guest: true, hideLayout: true }
  },
  {
    path: 'register',
    redirect: '/auth/register/select-role',
    meta: { hideLayout: true, guest: true }
  },
  {
    path: 'register/select-role',
    name: 'register-select-role',
    component: () => import('../views/role-selection-page.vue'),
    meta: { title: 'Select Role', requiresAuth: false, guest: true, hideLayout: true }
  },
  {
    path: 'register/renter',
    name: 'register-renter',
    component: () => import('../views/register-renter-page.vue'),
    meta: { title: 'Register as Renter', requiresAuth: false, guest: true, hideLayout: true }
  },
  {
    path: 'register/owner',
    name: 'register-owner',
    component: () => import('../views/register-owner-page.vue'),
    meta: { title: 'Register as Owner', requiresAuth: false, guest: true, hideLayout: true }
  },
  {
    path: 'profile',
    name: 'profile',
    component: () => import('../views/profile-page.vue'),
    meta: { title: 'My Profile', requiresAuth: true }
  }
]
