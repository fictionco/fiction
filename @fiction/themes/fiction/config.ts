import type { template as faqTemplate } from '@fiction/cards/content-faq'
import type { template as heroTemplate } from '@fiction/cards/content-hero'
import type { template as cardTextEffectV1 } from '@fiction/cards/effect-text/index.js'
import type { template as mapsTemplate, MapUserConfig } from '@fiction/cards/location-maps/index.js'
import type { template as marqueeTemplate } from '@fiction/cards/media-marquee/index.js'
import type { template as cardModalMediaV1 } from '@fiction/cards/modal-media/index.js'
import type { template as areaTemplate } from '@fiction/cards/page-area/index.js'
import type { template as footerProTemplate } from '@fiction/cards/page-footer-pro/index.js'
import type { template as navTemplate } from '@fiction/cards/page-nav/index.js'
import type { template as wrapTemplate } from '@fiction/cards/page-wrap/index.js'
import type { template as logosTemplate } from '@fiction/cards/proof-logos/index'

import type { Site } from '@fiction/site'
import type { CardFactory } from '@fiction/site/cardFactory'
import type { SiteUserConfig } from '@fiction/site/schema.js'
import type { StockMedia } from '@fiction/ui/stock/index.js'
import { getCardDemoListing, getDemoPages } from '@fiction/cards'

import { dayjs, type NavItem } from '@fiction/core'
import favicon from '@fiction/ui/brand/favicon.svg'

import icon from '@fiction/ui/brand/icon.png'
import shareImage from '@fiction/ui/brand/shareImage.png'
import * as affiliate from './affiliate/index.js'
import * as developer from './developer/index.js'
import * as homePage from './home/index.js'
import { getPricingPage } from './pages/pricing/index.js'
import { getTourPage } from './pages/tour/index.js'

const social: NavItem[] = [
  { key: 'linkedin', href: 'https://www.linkedin.com/company/fictionco', target: '_blank', label: 'LinkedIn', media: { iconId: `brand-linkedin` } },
  { key: 'github', href: 'https://github.com/fictionco', target: '_blank', label: 'Github', media: { iconId: `brand-github` } },
  { key: 'x', href: 'https://www.x.com/fictionplatform', target: '_blank', label: 'X', media: { iconId: `brand-x` } },
]

export async function getAboutPage(args: { site: Site, factory: CardFactory }) {
  const { factory } = args
  const topHeroCard = await factory.fromTemplate<typeof heroTemplate>({
    templateId: 'cardHeroV1',
    userConfig: {
      superTitle: {
        icon: { class: 'i-tabler-home' },
        theme: 'primary',
        text: 'About Fiction',
      },
      title: `Built for Storytellers`,
      subTitle: `Fiction helps experts and leaders tell their story. Born in California.`,

      media: {
        format: 'url',
        url: new URL('img/about/fiction-office.webp', import.meta.url).href,
      },
      layout: 'justify',
      action: { buttons: [
        {
          label: 'Join The Community',
          href: '/auth/login',
          theme: 'primary',
          icon: 'i-tabler-users',
        },
      ] },
    },
  })

  const missionHeroCard = await factory.fromTemplate<typeof heroTemplate>({
    templateId: 'cardHeroV1',
    userConfig: {
      superTitle: {
        icon: { class: 'i-tabler-trending-up' },
        text: 'The Vision',
        theme: 'orange',
      },
      title: `Own Your Influence`,
      subTitle: `Stop relying on social media algorithms to reach your audience. Fiction gives you the tools to build a personal brand that lasts.`,

      media: {
        format: 'url' as const,
        url: new URL('img/about/pro.webp', import.meta.url).href,
      },
      layout: 'left',
      action: { buttons: [] },
    },
  })

  const missionHeroCard2 = await factory.fromTemplate<typeof heroTemplate>({
    templateId: 'cardHeroV1',
    userConfig: {
      superTitle: {
        icon: { class: 'i-tabler-users' },
        text: 'Excellence',
        theme: 'green',
      },
      title: `Simple Tools, Powerful Results`,
      subTitle: `Professional tools shouldn't require an engineering degree. Fiction combines powerful features with refined simplicity.`,
      media: {
        format: 'url',
        url: new URL('img/about/girl-computer.webp', import.meta.url).href,
      },
      layout: 'right',
      action: { buttons: [] },
    },
  })

  // const teamCard = await factory.fromTemplate<typeof peopleTemplate>({
  //   templateId: 'cardPeopleV1',
  //   userConfig: {
  //     subTitle: `Innovation in Personal Branding`,
  //     title: `Execs`,
  //     items: [{
  //       title: 'Andrew Powers',
  //       subTitle: 'Founder',
  //       content: 'Andrew has spent his career at the intersection of design and influence. After growing his web-tools company, PageLines, to 70,000 customers, he saw a need: people need an easier way to own their online presence.',
  //       media: {
  //         format: 'url',
  //         url: new URL('img/about/ap.webp', import.meta.url).href,
  //       },
  //       action: {
  //         buttons: [{
  //           label: 'LinkedIn',
  //           theme: 'cyan',
  //           icon: { class: 'i-tabler-brand-linkedin' },
  //           href: 'https://www.linkedin.com/in/arpowers',
  //         }],
  //       },
  //     }],
  //     layout: 'mediabox',
  //   },
  // })

  const mapIrvine: MapUserConfig = {
    lat: 33.5427,
    lng: -117.7854,
    zoom: 15,
    pitch: 60,
    markers: [{ lat: 33.5427, lng: -117.7854, label: 'Orange County, CA' }],
    mapStyle: 'satellite' as const,
  }

  const mapSaltLake: MapUserConfig = {
    lat: 40.7608,
    lng: -111.8910,
    zoom: 8,
    pitch: 80,
    markers: [{ lat: 40.7608, lng: -111.8910, label: 'Salt Lake City, UT' }],
    mapStyle: 'outdoors' as const,
  }

  const mapCard = await factory.fromTemplate<typeof mapsTemplate>({
    templateId: 'cardMapsV1',
    userConfig: {
      maps: [mapIrvine, mapSaltLake],
    },
  })

  const valueCard = await factory.fromTemplate<typeof faqTemplate>({
    templateId: 'cardFaqV1',
    userConfig: {
      layout: 'visible',
      standard: {
        headers: {
          title: 'Core Values',
          subTitle: 'The principles that guide Fiction',
        },
      },
      items: [
        {
          title: 'Purpose-Driven Focus',
          content: `Creating extraordinary value means understanding specific needs. Fiction helps you connect with the people who resonate most with your message.`,
          icon: { iconId: 'target' },
        },
        {
          title: `Refined Excellence`,
          content: `Quality elevates everyone. We craft tools that exceed expectations, because building influence demands the best.`,
          icon: { class: 'i-tabler-sparkles' },
        },
        {
          title: `Beautiful Simplicity`,
          content: `In a complex world, clarity stands out. Fiction strips away the unnecessary, letting you focus on what matters - connecting with your audience.`,
          icon: { iconId: 'sparkles' },
        },
        {
          title: `Forward Motion`,
          content: `Progress requires momentum. We constantly refine and evolve our platform to keep our users ahead of the curve.`,
          icon: { iconId: 'rocket' },
        },
      ],
      support: {
        text: 'Ready to elevate your influence?',
        action: {
          buttons: [
            {
              label: 'Get Started',
              href: '/tour',
              theme: 'primary',
              icon: 'i-tabler-arrow-right',
            },
          ],
        },
      },
    },
  })

  return factory.fromTemplate({
    regionId: 'main',
    templateId: 'cardPageWrapV1',
    slug: 'about',
    cards: [
      await factory.fromTemplate<typeof areaTemplate>({
        templateId: 'cardPageAreaV1',
        cards: [
          topHeroCard,
          missionHeroCard,
          missionHeroCard2,
          mapCard,
          valueCard,
        ],
      }),

    ],
  })
}

export async function getHomePage(args: { factory: CardFactory, stock: StockMedia }) {
  const { factory, stock } = args

  return factory.fromTemplate<typeof wrapTemplate>({
    regionId: 'main',
    templateId: 'cardPageWrapV1',
    slug: '_home',
    title: 'Home',
    userConfig: {
      site: {
        title: 'Fiction - Personal Branding Platform',
        description: 'Transform your expertise into influence using Fiction\'s AI-powered personal branding platform. Create authentic content, grow your audience, and build authority - all guided by intelligent automation.',
      },
    },
    cards: [
      await factory.fromTemplate({
        templateId: 'cardPageAreaV1',
        userConfig: { },
        cards: [
          await factory.fromTemplate<typeof heroTemplate>({
            templateId: 'cardHeroV1',
          }),

          await factory.fromTemplate<typeof heroTemplate>({
            templateId: 'cardHeroV1',
            userConfig: {
              superTitle: {
                text: 'The Personal Marketing Platform',
                theme: 'orange',
                icon: { class: 'i-tabler-rosette-number-1' },
              },
              title: `It all starts with your story...`,
              subTitle: `Discover how Fiction helps experts like you build your brand online—without wrestling with technical chaos.`,

              action: {
                buttons: [
                  {
                    label: 'Create Account',
                    href: '/app?_reload=1',
                    theme: 'primary',
                    icon: 'i-tabler-user-circle',
                    design: 'solid',
                  },
                  {
                    label: 'Why Fiction',
                    href: '/tour',
                    icon: 'i-tabler-compass',
                  },
                ],
              },
            },
          }),
          await factory.fromTemplate<typeof marqueeTemplate>({
            templateId: 'cardMarqueeV1',
            userConfig: {
              items: [
                {
                  title: 'Andrew Powers',
                  subTitle: 'Serial Entrepreneur',
                  media: {
                    url: `${new URL('img/home/andrew.jpg', import.meta.url).href}?blurhash=UbD%2Be.f%2B9an%24~UbIE2aeskaeV%40W%3BM%7BaeoLbb`,
                  },
                  href: 'https://www.andrewpowers.com',
                },

                {
                  title: 'Hugo Rebora',
                  subTitle: 'Podcaster',
                  media: stock.getAssetBySlug('rebora'),
                  href: '#',
                },
                {
                  title: 'Selena Gomez',
                  subTitle: 'Musician',
                  media: {
                    url: new URL('img/home/selena.jpg', import.meta.url).href,
                  },
                },

                {
                  title: 'Olivia Alani',
                  subTitle: 'Fashion Designer',
                  media: stock.getAssetBySlug('olivia'),
                  href: '#',
                },
                {
                  title: 'Gabriel Torres',
                  subTitle: 'Coach',
                  media: stock.getAssetBySlug('abgcuk'),
                  href: '#',
                },

                {
                  title: 'Barack Obama',
                  subTitle: 'Politician',
                  media: {
                    url: new URL('img/home/obama.webp', import.meta.url).href,
                  },
                },
                {
                  title: 'Sarah Bands',
                  subTitle: 'Director',
                  media: stock.getAssetBySlug('bands'),
                  href: '#',
                },
                {
                  title: 'Dean Stoecker',
                  subTitle: 'Founder, Alteryx',
                  media: {
                    url: new URL('img/home/dean2.jpg', import.meta.url).href,
                  },
                },
                {
                  title: 'Joe Rogan',
                  subTitle: 'Comedian / Podcaster',
                  media: {
                    url: new URL('img/home/rogan.jpg', import.meta.url).href,
                  },
                },
              ],
            },
          }),
          await factory.fromTemplate<typeof logosTemplate>({
            templateId: 'cardLogosV1',
            userConfig: {
              items: [
                {
                  label: 'The New York Times',
                  href: 'https://www.nytimes.com/2024/04/05/opinion/ezra-klein-podcast-nilay-patel.html',
                  media: stock.getLocalMedia({ key: 'logoNyt' }),
                },
                {
                  label: 'The Guardian',
                  href: 'https://www.theguardian.com/technology/2022/nov/12/when-ai-can-make-art-what-does-it-mean-for-creativity-dall-e-midjourney',
                  media: stock.getLocalMedia({ key: 'logoGuardian' }),
                },
                {
                  label: 'TechCrunch',
                  href: 'https://techcrunch.com/sponsor/fluency/the-ai-revolution-using-artificial-intelligence-to-unlock-massive-time-savings/',
                  media: stock.getLocalMedia({ key: 'logoTechcrunch' }),
                },
              ],
              label: 'Read About Us In',
            },
          }),
        ],

      }),

    ],
  })
}

export async function getConfig(args: {
  site: Site
  factory: CardFactory
  domain: string
}) {
  const { site, factory, domain } = args

  const { fictionEnv } = site.fictionSites.fictionEnv.getService()

  const demoPages = await getDemoPages({ templates: factory.templates, fictionEnv, site, factory })
  const stock = await factory.getStockMedia()
  const pageArgs = { ...args, factory, stock }

  const pages = await Promise.all([
    getTourPage(pageArgs),
    homePage.getHomePage(pageArgs),
    getPricingPage(pageArgs),
    getAboutPage(pageArgs),
    developer.page({ ...args, factory }),
    affiliate.page({ ...args, factory }),
    ...demoPages,
  ])

  const userConfig: SiteUserConfig = {
    site: {
      shareImage: { url: shareImage, format: 'image' },
      favicon: { url: favicon, format: 'image' },
      icon: { url: icon, format: 'image' },
      titleTemplate: `{{pageTitle}} - Fiction`,
      gtmContainerId: `GTM-5LQBZDJ`,
      buttons: { design: 'ghost', rounding: 'full', hover: 'pop' },
    },
  }

  const webElementDemoItems = await getCardDemoListing()

  return {
    userConfig,
    pages,
    sections: {
      hidden: await factory.fromTemplate({
        cards: [
          await factory.fromTemplate<typeof cardModalMediaV1>({ templateId: 'cardModalMediaV1', userConfig: { } }),
          await factory.fromTemplate<typeof cardTextEffectV1>({ templateId: 'cardTextEffectV1', userConfig: { } }),
        ],
      }),
      header: await factory.fromTemplate({
        cards: [
          await factory.fromTemplate<typeof navTemplate>({
            templateId: 'cardSiteNavV1',
            userConfig: {
              layout: 'navCenter',
              brand: {
                logo: {
                  variant: 'media',
                  media: stock.getLocalMedia({ key: 'fictionLogoComponent' }),
                },
              },
              nav: {
                primary: [
                  { label: 'Why Fiction', href: '/tour' },
                  { label: 'Plans & Pricing', href: '/pricing' },
                  {
                    label: 'Website Cards',
                    list: {
                      description: 'Professional components for your website',
                      variant: 'expanded',
                      items: webElementDemoItems,
                    },
                  },
                ],
                utility: [
                  {
                    label: 'Account',
                    href: '/app?_reload=1',
                    variant: 'avatar',
                    list: {
                      items: [
                        { label: 'Sign In', href: '/app/auth/login?_reload=1', onAuthState: 'loggedOut' },
                        { label: 'Dashboard', href: '/app?_reload=1', onAuthState: 'loggedIn' },
                        { label: 'Logout', href: '/?_logout=1', onAuthState: 'loggedIn' },
                      ],
                    },
                  },
                ],

              },

            },
          }),
        ],
      }),
      footer: await factory.fromTemplate({
        cards: [
          await factory.fromTemplate<typeof footerProTemplate>({
            templateId: 'cardFooterProV1',
            userConfig: {
              brand: {
                logo: {
                  variant: 'media',
                  media: stock.getLocalMedia({ key: 'fictionLogo' }),
                  typography: { label: 'Fiction' },
                },
                tagline: `Your story begins here...`,
                action: {
                  buttons: [
                    {
                      label: 'Start Free',
                      theme: 'primary',
                      icon: { iconId: 'bolt' },
                      href: '/app?_reload=1',
                    },
                    {
                      label: 'Talk to Sales',
                      theme: 'default',
                      icon: { iconId: 'phone' },
                      href: '/contact',
                    },
                  ],
                },
              },
              menus: [
                {
                  title: 'Explore',
                  items: [
                    { href: '/tour', label: 'Tour' },
                    { href: '/pricing', label: 'Pricing' },
                    { href: '/developer', label: 'Developer' },
                  ],
                },
                {
                  title: 'Company',
                  items: [
                    { href: '/about', label: 'About' },
                    { href: '/affiliate', label: 'Affiliate' },
                  ],
                },
                {
                  title: 'Using Fiction',
                  items: [
                    { href: `https://docs.${domain}`, label: 'Docs', target: '_blank' },
                    { href: `https://docs.${domain}/resources/support.html`, label: 'Support', target: '_blank' },
                    { href: '/app?_reload=1', label: 'Dashboard' },
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
