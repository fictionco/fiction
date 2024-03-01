import { AppRoute } from '@factor/api'
import PageHome from './PageHome.vue'
import PageCheckout from './PageCheckout.vue'

export const routes = [
  new AppRoute({
    name: 'home',
    path: '/',
    component: PageHome,
  }),
  new AppRoute({
    name: 'checkout',
    path: '/checkout/:result',
    component: PageCheckout,
  }),
]
