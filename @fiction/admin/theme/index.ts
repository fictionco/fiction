import { CardTemplate } from '@fiction/site/card.js'
import { Theme, createCard } from '@fiction/site/theme.js'
import type { FictionEnv } from '@fiction/core/index.js'
import { safeDirname, vue } from '@fiction/core/index.js'
import { fictionLogo, templates } from '../templates.js'
import type { FictionAdmin } from '../index.js'

const def = vue.defineAsyncComponent

export async function getPages() {
  return [
    createCard({
      templates,
      regionId: 'main',
      templateId: 'dash',
      slug: '_404',
      title: 'Not Found (404)',
      cards: [
        createCard({ templates, templateId: '404' }),
      ],
    }),
    createCard({
      templates,
      templateId: 'dash',
      slug: 'settings',
      title: 'Settings',
      userConfig: { navIcon: 'i-tabler-settings', navIconAlt: 'i-tabler-settings-filled' },
      cards: [createCard({ el: def(async () => import('../settings/SettingsMain.vue')) })],
    }),
    createCard({
      templates,
      templateId: 'transaction',
      slug: 'auth',
      title: 'Settings',
      cards: [
        createCard({
          tpl: new CardTemplate({
            templateId: 'auth',
            el: def(async () => import('../auth/AuthCard.vue')),
          }),
          userConfig: { logo: { format: 'html' as const, html: fictionLogo }, standard: { spacing: { verticalSpacing: 'none' } } },
        }),
      ],
    }),
  ]
}

export async function setup(args: { fictionEnv: FictionEnv, fictionAdmin: FictionAdmin }) {
  const { fictionEnv, fictionAdmin } = args

  return new Theme({
    fictionEnv,
    root: safeDirname(import.meta.url),
    themeId: 'admin',
    title: 'Admin',
    screenshot: new URL('./img/screenshot.jpg', import.meta.url).href,
    version: '1.0.0',
    templates,
    isPublic: false,
    getConfig: async () => {
      const pg = await getPages()
      const adminPages = await fictionAdmin.getAdminPages()
      const pages = [...pg, ...adminPages]
      return {
        pages,
        sections: {},
        userConfig: {
          styling: {
            fonts: {
              body: { fontKey: 'Inter', stack: 'sans' },
              sans: { fontKey: 'Inter', stack: 'sans' },
            },
            buttons: { design: 'solid', rounding: 'full', hover: 'fade' },
          },
          standard: {
            spacing: { contentWidth: 'sm', verticalSpacing: `sm` },
          },
        },
      }
    },
    templateDefaults: { page: 'dash', transaction: 'transaction' },
    userConfig: {
      colors: { isLightMode: false },
      spacing: { contentWidthSize: 'sm', spacingSize: `none` },
      branding: {
        logo: { format: 'html' as const, html: fictionLogo },
      },
    },

  })
}

// createCard({
//   templates,
//   templateId: 'dash',
//   slug: 'settings',
//   title: 'Settings',
//   cards: [
//     createCard({
//       el: def(() => import('../el/SettingsWrap.vue')),
//       cards: [
//         createCard({
//           slug: 'organization',
//           title: 'Projects',
//           el: def(() => import('./el/ViewSettingsOrg.vue')),
//           userConfig: { isNavItem: true, navIcon: 'i-tabler-cube', navIconAlt: 'i-tabler-cube-plus' },
//         }),
//         createCard({
//           slug: 'newOrg',
//           el: def(() => import('./el/ViewNewOrganization.vue')),
//           userConfig: { isNavItem: false, parentItemId: 'organization' },
//         }),
//         createCard({
//           slug: 'account',
//           el: def(() => import('./el/SettingsAccount.vue')),
//           userConfig: { isNavItem: true, navIcon: 'i-heroicons-user', navIconAlt: 'i-heroicons-user-20-solid' },
//         }),
//         createCard({
//           slug: 'team',
//           el: def(() => import('./el/ViewTeamIndex.vue')),
//           userConfig: { isNavItem: true, navIcon: 'i-heroicons-user-group', navIconAlt: 'i-heroicons-user-group-20-solid' },
//         }),
//         createCard({
//           slug: 'teamEdit',
//           el: def(() => import('./el/ViewTeamEdit.vue')),
//           userConfig: { isNavItem: false, parentItemId: 'team', navIcon: 'i-heroicons-user-group', navIconAlt: 'i-heroicons-user-group-20-solid' },
//         }),
//         createCard({
//           slug: 'teamInvite',
//           el: def(() => import('./el/ViewTeamInvite.vue')),
//           userConfig: { isNavItem: false, parentItemId: 'team', navIcon: 'i-heroicons-user-group', navIconAlt: 'i-heroicons-user-group-20-solid' },
//         }),

//         createCard({
//           slug: 'billing',
//           el: def(() => import('./el/ViewSettingsBilling.vue')),
//           userConfig: { isNavItem: true, navIcon: 'i-heroicons-credit-card', navIconAlt: 'i-heroicons-credit-card-20-solid' },
//         }),
//         createCard({
//           slug: 'billingSuccess',
//           el: def(() => import('./el/ViewBillingSuccess.vue')),
//           userConfig: { isNavItem: false, parentItemId: 'billing', navIcon: 'i-heroicons-credit-card', navIconAlt: 'i-heroicons-credit-card-20-solid' },
//         }),
//         createCard({
//           slug: 'developer',
//           el: def(() => import('./el/ViewSettingsDev.vue')),
//           userConfig: { isNavItem: true, navIcon: 'i-heroicons-code-bracket-square', navIconAlt: 'i-heroicons-code-bracket-square-20-solid' },
//         }),
//       ],
//     }),
//   ],
//   userConfig: { },
// }),
