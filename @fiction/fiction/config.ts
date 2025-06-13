import type { NavItem } from '@fiction/core'
import type { Site, ThemeConfig } from '@fiction/site'
import type { CardFactory } from '@fiction/site/cardFactory'
import type { SiteGlobalUserConfig } from '@fiction/site/schema.js'
import { cardConfig, getDemoPages } from '@fiction/cards'
import { dayjs } from '@fiction/core'

import { googleOneTap } from '@fiction/core/plugin-user/google.js'
import favicon from '@fiction/ui/brand/favicon.svg'

import icon from '@fiction/ui/brand/icon.png'
import shareImage from '@fiction/ui/brand/shareImage.png'
import * as affiliate from './affiliate/index.js'
import * as developer from './developer/index.js'
import * as homePage from './home/index.js'
import { getAboutPage } from './pages/about/index.js'
import { getPricingPage } from './pages/pricing/index.js'
import { getTourPage } from './pages/tour/index.js'

const social: NavItem[] = [
  { key: 'linkedin', href: 'https://www.linkedin.com/company/fictionco', target: '_blank', label: 'LinkedIn', media: { iconId: `brand-linkedin` } },
  { key: 'github', href: 'https://github.com/fictionco', target: '_blank', label: 'Github', media: { iconId: `brand-github` } },
  { key: 'x', href: 'https://www.x.com/fictionplatform', target: '_blank', label: 'X', media: { iconId: `brand-x` } },
  { key: 'discord', href: 'https://discord.gg/e5wNxdDW8u', target: '_blank', label: 'Discord', media: { iconId: `brand-discord` } },
]

export async function getConfig(args: {
  site: Site
  factory: CardFactory
  domain: string
}): Promise<ThemeConfig> {
  const { site, factory, domain } = args

  const { fictionEnv } = site.fictionSites.fictionEnv.getService()

  const demoPages = await getDemoPages({ templates: factory.templates, fictionEnv, site, factory })
  const stock = await factory.getStockMedia()
  const pageArgs = { ...args, factory, stock }

  const pages = await Promise.all([
    getTourPage(pageArgs),
    homePage.getHomePage(pageArgs),
    getPricingPage(pageArgs),
    getAboutPage(),
    developer.page({ ...args }),
    affiliate.page({ ...args, factory }),
    ...demoPages,
  ])

  const userConfig: SiteGlobalUserConfig = {
    shareImage: { url: shareImage, format: 'image' },
    favicon: { url: favicon, format: 'image' },
    icon: { url: icon, format: 'image' },
    titleTemplate: `{{pageTitle}} - Fiction`,
    googleTagManagerId: `GTM-5LQBZDJ`,
    standard: {
      buttons: { design: 'ghost', rounding: 'full', hover: 'pop' },
    },
  }

  return {
    userConfig,
    pages,
    onMounted: async (args) => {
      const { service: { fictionUser } } = args
      await fictionUser.userInitialized({ caller: 'fictionThemeOnMounted' })
      await googleOneTap({
        autoSignIn: false,
        showPrompt: true,
        fictionUser,
        isDarkMode: true,
        callback: async (r) => {
          if (r.isNew) {
            await site.siteRouter.push('/app?_reload=1&_isNewUser=1', { caller: 'googleOneTap' })
          }
        },
      })
    },
    sections: {

      header: cardConfig({
        templateId: 'cardPageAreaV1',
        cards: [
          cardConfig({
            templateId: 'cardSiteNavV1',
            userConfig: {
              brand: {
                logo: {
                  variant: 'media',
                  media: stock.getLocalMedia({ key: 'fictionIconInline' }),
                },
              },
              hideSubscribe: true,
              redirectAfterLogin: '/app',
            },
          }),
        ],
      }),
      footer: cardConfig({
        templateId: 'cardPageAreaV1',
        cards: [
          cardConfig({
            templateId: 'cardFooterProV1',
            userConfig: {
              brand: {
                logo: {
                  variant: 'media',
                  media: stock.getLocalMedia({ key: 'fictionIconInline' }),
                  typography: { label: 'Fiction' },
                },
                tagline: `Your story begins here...`,
                action: {
                  buttons: [
                    {
                      label: 'Start',
                      theme: 'primary',
                      icon: { iconId: 'bolt' },
                      href: '/app/auth?_reload=1',
                    },
                    // {
                    //   label: 'Contact',
                    //   theme: 'default',
                    //   icon: { iconId: 'phone' },
                    //   href: 'https://discord.gg/e5wNxdDW8u',
                    //   target: '_blank',
                    // },
                  ],
                },
              },
              menus: [

                {
                  title: 'Using Fiction',
                  items: [
                    { href: '/app?_reload=1', label: 'Dashboard' },
                  ],
                },
                {
                  title: 'Company',
                  items: [
                    { href: '/about', label: 'About' },
                    { href: '/tour', label: 'Tour' },
                  ],
                },
              ],

              additional: {
                social,
                links: [
                  { label: 'Privacy', href: `https://docs.${domain}/resources/privacy.html` },
                  { label: 'Terms', href: `https://docs.${domain}/resources/terms.html` },
                  { label: `© ${dayjs().format('YYYY')} Fiction.com` },
                ],
              },

              badges: {
                buttons: [
                  {
                    href: 'https://discord.gg/e5wNxdDW8u',
                    target: '_blank',
                    label: 'Fiction on Discord',
                    icon: { iconId: 'brand-discord' },
                    theme: 'indigo',
                  },
                  {
                    href: 'https://stripe.com/partners',
                    target: '_blank',
                    label: 'Stripe Verified Partner',
                    icon: { iconId: 'brand-stripe' },
                  },
                ],
              },
            },
          }),
        ],
      }),
    },
  }
}
