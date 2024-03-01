import FictionLogo from '@fiction/core/ui/FictionLogo.vue'
import ElButton from '@factor/ui/ElButton.vue'
import ElFooter from './ElFooter.vue'

import ElHeader from './header/ElHeader.vue'
import { config as home } from './home'
import { config as tour } from './tour'
import { config as legal } from './legal'

const socialList = [
  {
    key: 'linkedin',
    path: 'https://www.linkedin.com/company/pagelines',
    target: '_blank',
    name: 'LinkedIn',
    icon: `<svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M0 7.557h5.349V24H0zM20 7.75c-.057-.018-.111-.037-.17-.054s-.144-.03-.217-.042a4.793 4.793 0 00-.96-.1 7.431 7.431 0 00-5.748 3.144V7.557H7.557V24h5.349v-8.969s4.042-5.63 5.748-1.495V24h5.347V12.9A5.333 5.333 0 0020 7.75z" fill="currentColor"/> <circle cx="3" cy="3" r="3" fill="currentColor"/></svg>`,
  },
  {
    key: 'facebook',
    path: 'https://www.facebook.com/pagelines',
    target: '_blank',
    name: 'Facebook',
    icon: `<svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 24"><path d="M7.5 8.25v-3A1.5 1.5 0 019 3.75h1.5V0h-3A4.5 4.5 0 003 4.5v3.75H0V12h3v12h4.5V12h3L12 8.25z" fill="currentColor"/></svg>`,
  },
  {
    key: 'github',
    path: 'https://github.com/pagelines',
    target: '_blank',
    name: 'Github',
    icon: `<svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>`,
  },
  {
    key: 'twitter',
    path: 'https://www.twitter.com/pagelines',
    target: '_blank',
    name: 'Twitter',
    icon: `<svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>`,
  },
]
export const config = {
  page: [...home, ...tour, ...legal],
  ui: {
    button: { el: ElButton },
  },
  header: [
    {
      id: 'hh1',
      layout: [
        {
          id: 's3313',
          el: ElHeader,
          settings: {
            logoComponent: FictionLogo,
            nav: [
              { name: 'Tour', href: '/tour' },
              { name: 'Pricing', href: '/pricing' },
            ],
            socialList,
          },
        },
      ],
    },
  ],
  footer: [
    {
      layout: [
        {
          id: 's1',
          el: ElFooter,
          settings: {
            icon: `<svg class="inline-block h-12 w-12" viewBox="0 0 42 40" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M34.5005 41H17.187C16.0637 41 15.0057 40.5523 14.211 39.7352L1.01935 26.2084C0.0221016 25.1882 -0.272797 23.6627 0.265224 22.3287C0.805496 20.9924 2.06388 20.1269 3.47534 20.1269H19.6407V3.55352C19.6407 2.11105 20.4827 0.820906 21.7838 0.266998C23.0647 -0.279986 24.591 0.0315868 25.5702 1.03554L38.7686 14.5671C39.5633 15.3864 40 16.4688 40 17.6182V35.364C39.9977 38.4728 37.5328 41 34.5005 41ZM17.9119 34.9024H34.0525V18.3544L25.5882 9.67651V26.2245H9.4476L17.9119 34.9024Z" fill="currentColor" /></svg>`,
            menus: [
              {
                groupName: 'Resources',
                menu: [
                  { path: '/pricing', name: 'Pricing' },
                  { path: '/docs', name: 'Docs' },
                  { path: '/blog', name: 'Blog' },
                ],
              },
              {
                groupName: 'Company',
                menu: [
                  { path: '/about', name: 'About' },
                  { path: '/contact', name: 'Contact' },
                  { path: '/affiliate', name: 'Affiliate' },
                ],
              },
              {
                groupName: 'Legal',
                menu: [
                  { path: '/privacy', name: 'Privacy' },
                  { path: '/terms', name: 'Terms of Service' },
                  { path: '/gdpr', name: 'GDPR' },
                  { path: '/ccpa', name: 'CCPA' },
                ],
              },
            ],
            socialList,
          },
        },
      ],
    },
  ],
}
