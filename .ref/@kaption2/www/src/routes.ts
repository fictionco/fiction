import { AppRoute } from '@factor/api'
import App404 from './AppNotFound.vue'
import { routes as blogRoutes } from './blog/routes'
import { routes as docsRoutes } from './docs/routes'

export default [
  new AppRoute({
    name: 'home',
    path: '/',
    component: () => import('./ui-home/HomePage.vue'),
  }),
  new AppRoute({
    name: 'feature',
    path: '/platform/:featureId',
    component: () => import('./ui-features/FeatureTemplate.vue'),
  }),

  new AppRoute({
    name: 'about',
    path: '/about',
    component: () => import('./ui-pages/AboutKaption.vue'),
  }),
  new AppRoute({
    name: 'support',
    path: '/support',
    component: () => import('./ui-pages/SupportPage.vue'),
  }),
  new AppRoute({
    name: 'pricing',
    path: '/pricing',
    component: () => import('./ui-pages/PagePricing.vue'),
  }),
  new AppRoute({
    name: 'affiliate',
    path: '/affiliate',
    component: () => import('./ui-pages/AffiliateView.vue'),
  }),
  ...blogRoutes,
  ...docsRoutes,
  new AppRoute({
    name: 'notFound404',
    path: '/:pathMatch(.*)*',
    component: App404,
    priority: 1000,
  }),
]
