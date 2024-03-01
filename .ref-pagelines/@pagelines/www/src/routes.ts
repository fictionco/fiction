import { AppRoute } from '@factor/api'
import PageHome from './pages/PageHome2.vue'
import AppNotFound from './pages/PageNotFound.vue'

export const routes = [
  new AppRoute({
    name: 'home',
    path: '/',
    component: PageHome,
  }),
  new AppRoute({
    name: 'about',
    path: '/about',
    component: () => import('./pages/about/ElIndex.vue'),
  }),
  new AppRoute({
    name: 'pricing',
    path: '/pricing',
    component: () => import('./pages/PagePricing.vue'),
  }),
  new AppRoute({
    name: 'onboard',
    path: '/onboard',
    component: () => import('./pages/onboard/PageOnboard.vue'),
  }),
  new AppRoute({
    name: 'contact',
    path: '/contact',
    component: () => import('./pages/PageContact.vue'),
  }),
  new AppRoute({
    name: 'affiliate',
    path: '/affiliate',
    component: () => import('./pages/PageAffiliate.vue'),
  }),
  new AppRoute({
    name: 'tour',
    path: '/tour',
    component: () => import('./pages/tour/PageTour.vue'),
  }),
  new AppRoute({
    name: 'privacy',
    path: '/privacy',
    component: () => import('./pages/PageLegal.vue'),
    priority: 1000,
  }),
  new AppRoute({
    name: 'terms',
    path: '/terms',
    component: () => import('./pages/PageLegal.vue'),
    priority: 1000,
  }),
  new AppRoute({
    name: 'gdpr',
    path: '/gdpr',
    component: () => import('./pages/PageLegal.vue'),
    priority: 1000,
  }),
  new AppRoute({
    name: 'ccpa',
    path: '/ccpa',
    component: () => import('./pages/PageLegal.vue'),
    priority: 1000,
  }),
  new AppRoute({
    name: 'notFound404',
    path: '/:pathMatch(.*)*',
    component: AppNotFound,
    priority: 1000,
  }),
]
