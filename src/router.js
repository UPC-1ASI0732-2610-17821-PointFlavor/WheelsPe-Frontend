// Main Router Configuration with Nested Routes
import { createRouter, createWebHistory } from 'vue-router'
import DashboardPage from '@/app/shared/views/dashboard-page.vue'
import PageNotFound from '@/app/shared/views/page-not-found.vue'
import NotificationsPage from '@/app/notification/presentation/views/notifications-page.vue'
import { IS_LOCAL_TEST_MODE } from '@/app/iam/infrastructure/local-auth.js'

// Import nested route modules
import iamRoutes from '@/app/iam/presentation/iam-router.js'
import rentalRoutes from '@/app/rental/presentation/rental-router.js'
import adventureRoutes from '@/app/adventure/presentation/adventure-router.js'
import paymentRoutes from '@/app/payment/presentation/payment-router.js'
import supportRoutes from '@/app/support/presentation/support-router.js'

const routes = [
  // Root redirect - Start at login page
  { 
    path: '/', 
    redirect: IS_LOCAL_TEST_MODE ? '/dashboard' : '/auth/login',
    // Hide main layout while redirecting to auth pages to avoid layout flash
    meta: { title: 'MOVEO', hideLayout: true }
  },
  
  // Dashboard
  {
    path: '/dashboard',
    name: 'dashboard',
    component: DashboardPage,
    meta: { title: 'Dashboard', requiresAuth: true }
  },
  
  // Notifications Page
  {
    path: '/notifications',
    name: 'notifications',
    component: NotificationsPage,
    meta: { title: 'Notificaciones', requiresAuth: true }
  },
  
  // IAM Module (Identity and Access Management) - Auth routes
  {
    path: '/auth',
    children: iamRoutes
  },
  
  // Rental Module - Vehicle browsing and rental management
  {
    path: '/rental',
    children: rentalRoutes
  },
  
  // Adventure Module - Themed Travel Routes (For Both Renters and Owners)
  {
    path: '/adventure',
    children: adventureRoutes
    // Note: Auth and role requirements are defined at child route level
  },
  
  // Payment Module
  {
    path: '/payments',
    children: paymentRoutes
  },
  
  // Support Module - Tickets and Customer Service (For both roles)
  {
    path: '/support',
    children: supportRoutes,
    meta: { requiresAuth: true }
  },
  
  // Legacy routes redirects for backwards compatibility
  { path: '/login', redirect: '/auth/login' },
  { path: '/register', redirect: '/auth/register' },
  { path: '/profile', redirect: '/auth/profile' },
  { path: '/rentals', redirect: '/rental/browse' },
  { path: '/my-rentals', redirect: '/rental/my-rentals' },
  { path: '/favorites', redirect: '/rental/favorites' },
  { path: '/my-vehicles', redirect: '/rental/my-vehicles' },
  { path: '/add-vehicle', redirect: '/rental/add-vehicle' },
  { path: '/rental-requests', redirect: '/rental/rental-requests' },
  { path: '/earnings', redirect: '/rental/earnings' },
  { path: '/my-payments', redirect: '/payments/my-payments' },
  
  // 404 Not Found
  { 
    path: '/:pathMatch(.*)*', 
    name: 'not-found', 
    component: PageNotFound,
    meta: { title: 'Page Not Found' }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

// Navigation guard - auth checks disabled
router.beforeEach((to, from, next) => {
  const baseTitle = 'MOVEO'
  document.title = to.meta?.title ? `${baseTitle} - ${to.meta.title}` : baseTitle
  next()
})

export default router