// @unocss-include

import type { FactorRouter, FactorUser } from '@factor/api'
import { toLabel, vue } from '@factor/api'

interface DashboardUrlOptions {
  path?: string
  queryArgs?: Record<string, string>
}

export interface NavItem {
  name: string
  icon: string
  cb?: (e: MouseEvent) => void
  value?: string
}

export function getDashboardUrl({
  path = '/',
  queryArgs,
}: DashboardUrlOptions = {}): string {
  const url = new URL('https://app.pagelines.com')
  url.pathname = path

  if (queryArgs) {
    const searchParams = new URLSearchParams({ www: '1' })
    Object.entries(queryArgs).forEach(([name, value]) => {
      searchParams.set(name, value)
    })
    url.search = searchParams.toString()
  }

  return url.toString()
}

export const nav = vue.ref<NavItem[]>([
  {
    name: 'Pricing',
    icon: 'i-carbon-rocket',
    value: '/pricing',
  },
  {
    name: 'Dashboard',
    icon: 'i-carbon-rocket',
    value: '/org',
  },
])

export function getNav(args: {
  factorUser: FactorUser
  factorRouter: FactorRouter
  location: 'header' | 'mobile'
}) {
  const { factorUser } = args

  return vue.computed(() => {
    const { location } = args
    const u = factorUser.activeUser.value
    const n = []

    if (location === 'header' || location === 'mobile') {
      n.push(
        {
          name: 'Plans <span class=\'amp\'>&amp;</span> Pricing',
          icon: 'i-heroicons-document-duplicate',
          value: '/pricing',
        },
        {
          name: u ? 'View Dashboard' : 'Login / Signup',
          icon: u
            ? 'i-heroicons-window'
            : 'i-heroicons-arrow-left-on-rectangle',
          value: u ? '/org' : '/auth/login',
        },
      )
    }
    else if (location === 'account') {
      n.push(
        {
          name: 'View Dashboard',
          icon: 'i-carbon-rocket',
          value: '/org',
        },
        {
          name: 'Logout',
          icon: 'i-carbon-rocket',
          cb: async (_args: { e: MouseEvent }) => {
            await factorUser.logout()
          },
        },
      )
    }

    return n
  })
}

export function accountMenu(args: {
  factorUser: FactorUser
  factorRouter: FactorRouter
}) {
  const { factorUser, factorRouter } = args
  return [
    {
      icon: 'i-carbon-dashboard',
      name: 'Dashboard',
      cb: async () => {
        await factorRouter.goto('orgHome')
      },
    },
    {
      icon: 'i-carbon-logout',
      name: 'Logout',
      cb: async () => {
        await factorUser.logout()
      },
    },
  ]
}

interface MediaItemParams<T extends string> {
  key: T
  name?: string
  icon: string
  path?: string
  class?: string
  target?: '_blank'
}

export class MediaItem<T extends string> {
  key: T
  name: string
  icon: string
  path?: string
  target?: '_blank'
  class?: string
  constructor(params: MediaItemParams<T>) {
    this.key = params.key
    this.name = params.name || toLabel(params.key)
    this.icon = params.icon
    this.path = params.path
    this.target = params.target
  }
}

export const socialList = [
  // new MediaItem({
  //   key: "github",
  //   path: "https://github.com/#",
  //   target: "_blank",
  //   name: "Github",
  //   icon: `<svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>`,
  // }),
  // new MediaItem({
  //   key: "linkedin",
  //   path: "https://www.linkedin.com/company/#",
  //   target: "_blank",
  //   name: "LinkedIn",
  //   icon: `<svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M0 7.557h5.349V24H0zM20 7.75c-.057-.018-.111-.037-.17-.054s-.144-.03-.217-.042a4.793 4.793 0 00-.96-.1 7.431 7.431 0 00-5.748 3.144V7.557H7.557V24h5.349v-8.969s4.042-5.63 5.748-1.495V24h5.347V12.9A5.333 5.333 0 0020 7.75z" fill="currentColor"/> <circle cx="3" cy="3" r="3" fill="currentColor"/></svg>`,
  // }),

  new MediaItem({
    key: 'twitter',
    path: 'https://www.twitter.com/pagelines',
    target: '_blank',
    name: 'Twitter',
    icon: `<svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>`,
  }),
]
