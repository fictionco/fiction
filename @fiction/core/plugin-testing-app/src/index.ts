import { createSSRApp } from 'vue'
import {
  createMemoryHistory,
  createRouter,
  createWebHistory,
} from 'vue-router'
import type { Component } from 'vue'
import type {
  RouteRecordRaw,
} from 'vue-router'
import PageAbout from './el/PageAbout.vue'
import PageHome from './el/PageHome.vue'
import PageOther from './el/PageOther.vue'
import PageSingle from './el/PageSingle.vue'
import PageWrap from './el/PageWrap.vue'
import 'uno.css'

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
