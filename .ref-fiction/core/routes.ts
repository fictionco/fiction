import { AppRoute } from '@factor/api'

export const routes = [
  new AppRoute({
    name: 'support',
    niceName: () => 'Support',
    external: true,
    menus: ['help'],
    path: 'https://www.fiction.com/support',
  }),
  new AppRoute({
    name: 'docs',
    niceName: () => 'Docs',
    external: true,
    menus: ['help'],
    path: 'https://www.fiction.com/docs',
  }),
]
