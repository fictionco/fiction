import { AppRoute } from '@factor/api'
import PageHome from './PageHome.vue'

export const routes = [
  new AppRoute({
    name: 'engine',
    path: '/:pathMatch(.*)*',
    component: PageHome,
    priority: 1000,
  }),
]
