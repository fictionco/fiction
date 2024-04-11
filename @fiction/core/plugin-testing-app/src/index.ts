import 'uno.css'
import type { Component } from 'vue'
import { createSSRApp } from 'vue'
import type {
  RouteRecordRaw,
} from 'vue-router'
import {
  createMemoryHistory,
  createRouter,
  createWebHistory,
} from 'vue-router'
import PageHome from './el/PageHome.vue'
import PageWrap from './el/PageWrap.vue'
import PageSingle from './el/PageSingle.vue'
import PageOther from './el/PageOther.vue'
import PageAbout from './el/PageAbout.vue'

export function initApp(config: { env: 'server' | 'client' }) {
  const { env } = config
  const app = createSSRApp(PageWrap as Component)
  const history = env === 'server' ? createMemoryHistory() : createWebHistory()
  const routes: RouteRecordRaw[] = [
    {
      name: 'home',
      path: '/',
      component: PageHome,
    },
    { name: 'tour', path: '/tour', component: PageSingle },
    { name: 'pricing', path: '/pricing', component: PageOther },
    { name: 'about', path: '/about', component: PageAbout },
  ]
  const router = createRouter({ history, routes })

  app.use(router)

  return { app, router }
}
