import type { template as faqTemplate } from '@fiction/cards/content-faq'
import type { template as heroTemplate } from '@fiction/cards/content-hero'
import type { template as tourTemplate } from '@fiction/cards/content-tour/index.js'
import type { template as pricingTemplate } from '@fiction/cards/convert-pricing'
import type { template as cardTextEffectV1 } from '@fiction/cards/effect-text/index.js'
import type { template as mapsTemplate, MapUserConfig } from '@fiction/cards/location-maps/index.js'
import type { template as marqueeTemplate } from '@fiction/cards/media-marquee/index.js'
import type { template as cardModalMediaV1 } from '@fiction/cards/modal-media/index.js'
import type { template as areaTemplate } from '@fiction/cards/page-area/index.js'
import type { template as footerProTemplate } from '@fiction/cards/page-footer-pro/index.js'
import type { template as navTemplate } from '@fiction/cards/page-nav/index.js'
import type { template as wrapTemplate } from '@fiction/cards/page-wrap/index.js'
import type { template as logosTemplate } from '@fiction/cards/proof-logos/index'

import type { template as templateMetrics } from '@fiction/cards/proof-metrics/index.js'
import type { template as templateQuotes } from '@fiction/cards/proof-quotes/index.js'

import type { FictionStripe } from '@fiction/plugin-stripe/index.js'
import type { Site } from '@fiction/site'
import type { CardFactory } from '@fiction/site/cardFactory'
import type { SiteUserConfig } from '@fiction/site/schema.js'
import type { StockMedia } from '@fiction/ui/stock/index.js'

import { getCardDemoListing, getDemoPages } from '@fiction/cards'
import { dayjs, type NavItem } from '@fiction/core'
import { getCheckoutUrl } from '@fiction/plugin-stripe/index.js'

import favicon from '@fiction/ui/brand/favicon.svg'
import icon from '@fiction/ui/brand/icon.png'
import shareImage from '@fiction/ui/brand/shareImage.png'
import * as affiliate from './affiliate/index.js'
import * as developer from './developer/index.js'
import * as homePage from './home/index.js'

const social: NavItem[] = [
  { key: 'linkedin', href: 'https://www.linkedin.com/company/fictionco', target: '_blank', label: 'LinkedIn', media: { iconId: `brand-linkedin` } },
  { key: 'github', href: 'https://github.com/fictionco', target: '_blank', label: 'Github', media: { iconId: `brand-github` } },
  { key: 'x', href: 'https://www.x.com/fictionplatform', target: '_blank', label: 'X', media: { iconId: `brand-x` } },
]

async function purchaseUrl(args: { priceId: string, fictionStripe?: FictionStripe }) {
  const { fictionStripe } = args

  const loginPath = '/auth/login'

  if (!fictionStripe) {
    return loginPath
  }

  return await getCheckoutUrl({ fictionStripe, query: { ...args, loginPath } })
}

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

export async function getPricingPage(args: { factory: CardFactory, site: Site }) {
  const { site, factory } = args

  const { fictionStripe } = site.fictionSites.fictionEnv.getService<{ fictionStripe: FictionStripe }>()

  const pricingCard = await factory.fromTemplate<typeof pricingTemplate>({
    templateId: 'cardPricingV1',
    userConfig: {
      annualDiscountPercent: 40,
      prices: [
        {
          title: 'Basic',
          price: 0,
          description: `What's included...`,
          features: [
            { label: 'Up to 2,500 Subscribers' },
            { label: 'Web Hosting' },
            { label: 'Custom Newsletters' },
            { label: 'Free Plugins' },
          ],
        },
        {
          title: 'Pro',
          price: 99,
          description: `Everything in Basic, plus...`,
          button: {
            href: await purchaseUrl({ fictionStripe, priceId: 'price_222' }),
          },

          badge: 'Most Popular',
          features: [
            { label: 'Up to 10,000 subscribers' },
            { label: 'Remove Branding' },
            { label: 'Custom domains' },
            { label: 'Pro Plugins' },
          ],
        },
        {
          title: 'Pro+',
          price: 199,
          description: `Everything in Basic, plus...`,
          button: {
            href: await purchaseUrl({ fictionStripe, priceId: 'price_333' }),
          },
          features: [
            { label: 'Up to 25,000 subscribers' },
            { label: 'Advanced UI cards' },
            { label: 'AI Copilot' },
            { label: 'Additional Pro+ Plugins' },
          ],
        },
      ],
    },
  })

  const topHeroCard = await factory.fromTemplate<typeof heroTemplate>({
    templateId: 'cardHeroV1',
    userConfig: {
      superTitle: { text: 'Simple Premium Pricing' },
      subTitle: `40% Discount When Paying Annually`,
      title: `Plans and Pricing`,
    },
  })

  const valueCard = await factory.fromTemplate<typeof faqTemplate>({
    templateId: 'cardFaqV1',
    userConfig: {
      standard: { headers: { title: 'Frequently Asked Questions', subTitle: 'Get answers to common questions about Fiction' } },
      items: [
        { title: 'Can I Cancel My Subscription At Any Time?', content: `Of course! If you decide that Fiction  isn't the right fit for your business, you can easily cancel your account from your dashboard at any time.` },
        { title: `Does Fiction Take A Cut Of My Revenue?`, content: `No! When you make a sale with Fiction, we don't take a percentage cut of your revenue from that sale (unlike most creator platforms). If you use Stripe or Paypal to collect payments, you will still pay their merchant processing fees (for example, Stripe's merchant processing fee is 2.9% + 30 cents per transaction).` },
        { title: `What should my personal marketing platform include?`, content: `A successful platform should feature a consistent stream of content that your audience finds valuable. This could include articles, videos, audios, courses, live webinars, downloadable resources, perks (like event tickets or physical merchandise), and/or a community section or forum.` },

      ],
    },
  })

  return factory.fromTemplate({
    regionId: 'main',
    templateId: 'cardPageWrapV1',
    slug: 'pricing',
    cards: [
      await factory.fromTemplate({
        templateId: 'cardPageAreaV1',
        cards: [
          topHeroCard,
          pricingCard,
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

export async function getTourPage(args: { factory: CardFactory, stock: StockMedia }) {
  const { factory } = args
  return factory.fromTemplate({
    regionId: 'main',
    templateId: 'cardPageWrapV1',
    slug: 'tour',
    title: 'Tour',
    cards: [
      await factory.fromTemplate<typeof areaTemplate>({
        templateId: 'cardPageAreaV1',
        cards: [
          await factory.fromTemplate<typeof heroTemplate>({
            templateId: 'cardHeroV1',
            userConfig: {
              superTitle: {
                text: 'Your Story Deserves To Be Heard',
                theme: 'green',
                icon: { class: 'i-tabler-arrow-up-right' },
              },
              subTitle: `Fiction helps you to share your story authentically and build genuine connections that last. No more juggling multiple tools or feeling lost in the digital noise.`,
              title: `Are you ready to be seen and to <span data-text-effect data-effect-type="squiggle" data-effect-theme="primary">make your impact?</span>`,
              action: {
                buttons: [
                  {
                    label: 'I Am Ready',
                    href: '/app/login?_reload=1',
                    theme: 'primary',
                    design: 'solid',
                    iconAfter: 'i-tabler-arrow-big-right-lines',
                  },
                ],
              },
            },
          }),

          await factory.fromTemplate<typeof tourTemplate>({
            templateId: 'cardTourV1',
            userConfig: {
              items: [
                {
                  layout: 'right',
                  superTitle: {
                    icon: { iconId: 'browser' },
                    text: 'World-Class Personal Websites',
                    theme: 'orange',
                  },
                  title: 'See Your Personal Brand Come to Life',
                  subTitle: 'Effortlessly create your online presence. Show off a high-quality website, create brilliant content to capture and grow your influence.',
                  media: { url: new URL('img/tour/fig-website-screen.svg', import.meta.url).href },
                  overlays: [{ media: { url: new URL('img/tour/fig-website-alt-1.svg', import.meta.url).href } }],
                  action: {},
                },
                {
                  layout: 'left',
                  superTitle: {
                    icon: { iconId: 'trending-up' },
                    text: 'Audience Growth Tools',
                    theme: 'rose',
                  },
                  title: 'Watch Your Audience Growing Daily',
                  subTitle: 'Wake up to new engaged subscribers every morning. See how your persona resonates as you build an audience that\'s truly yours to nurture and grow.',
                  media: { url: new URL('img/tour/fig-subscribe-screen.svg', import.meta.url).href },
                  overlays: [{ media: { url: new URL('img/tour/fig-subscribe-alt-1.svg', import.meta.url).href } }],
                  action: {},
                },
                {
                  layout: 'right',
                  superTitle: {
                    icon: { iconId: 'news' },
                    text: 'Newsletter and Email Marketing',
                    theme: 'sky',
                  },
                  title: 'Connect Deeply Through Personal Updates',
                  subTitle: 'Experience the difference when your newsletters feel like personal letters. Notice how your audience engagement grows as you share your journey in your authentic voice.',
                  media: { url: new URL('img/tour/fig-email-screen.svg', import.meta.url).href },
                  overlays: [{ media: { url: new URL('img/tour/fig-email-alt-1.svg', import.meta.url).href } }],
                  action: {},
                },
                {
                  layout: 'left',
                  superTitle: {
                    icon: { iconId: 'rocket' },
                    text: '10x Your Influence',
                    theme: 'purple',
                  },
                  title: 'Transform Your Influence Into Income',
                  subTitle: 'Visualize your expertise turning into memberships and opportunities. Feel the freedom as your personal brand opens doors to passive income streams.',
                  media: { url: new URL('img/tour/fig-money-screen.svg', import.meta.url).href },
                  overlays: [{ media: { url: new URL('img/tour/fig-money-alt-1.svg', import.meta.url).href } }],
                  action: {},
                },
                {
                  layout: 'right',
                  superTitle: {
                    icon: { iconId: 'chart-bar' },
                    text: 'Brand Automation',
                    theme: 'yellow',
                  },
                  title: 'Your Brand Works While You Sleep',
                  subTitle: 'Picture your personal brand working 24/7, automatically showcasing your best self. See how our AI-powered tools craft your perfect professional narrative.',
                  media: { url: new URL('img/tour/fig-contact-screen.svg', import.meta.url).href },
                  action: {},
                },
              ],
            },
          }),
        ],
      }),
      await factory.fromTemplate({
        templateId: 'cardPageAreaV1',
        userConfig: {},
        cards: [
          await factory.fromTemplate<typeof templateMetrics>({
            templateId: 'cardMetricsV1',
            userConfig: {
              items: [
                {
                  label: 'Personal Brands',
                  description: 'Built & Thriving',
                  value: 8000,
                },
                {
                  label: 'Audience Connections',
                  description: 'Meaningful Engagements',
                  value: 2_020_000,
                },
                {
                  label: 'Creator Success',
                  description: 'Generated for Our Users',
                  format: 'abbreviatedDollar',
                  value: 12_000_000,
                },
              ],
            },
          }),
          await factory.fromTemplate<typeof templateQuotes>({
            templateId: 'cardQuotesV1',
            userConfig: {
              items: [
                {
                  text: `<p>Ever notice that what people find when they Google your name, shapes their decision to work with, hire, or invest in you?</p><p> Can you afford to let others tell your story?</p>`,
                  author: {
                    label: 'Tim Ferris',
                    media: {
                      format: 'image',
                      url: 'https://imagedelivery.net/mxykd8B2Zc6Xxmx1NDi9mA/12556c45-5956-4c71-aebf-c86a0ed45400/public',
                    },
                    subLabel: 'Author of The 4-Hour Workweek',
                  },
                  org: {
                    label: 'Tim Ferris',
                  },
                },
                {
                  text: `Your personal brand isn't just your first impression anymore—it's your only impression. Every day you wait to build yours is an opportunity passing you by.`,
                  author: {
                    label: 'Gary Vaynerchuk',
                    media: {
                      format: 'image',
                      url: 'https://imagedelivery.net/mxykd8B2Zc6Xxmx1NDi9mA/1a443428-3409-4ed1-7cc8-acb57f566700/public',
                    },
                    subLabel: 'Entrepreneur & Author',
                  },
                  org: {
                    label: 'VaynerMedia',
                  },
                },
                {
                  text: `The best time to build your personal brand was five years ago. The second best time is today. In the digital age, invisibility is a bigger risk than failure.`,
                  author: {
                    label: 'Brené Brown',
                    media: {
                      format: 'image',
                      url: new URL('img/tour/person-brene.webp', import.meta.url).href,
                    },
                    subLabel: 'Research Professor & Author',
                  },
                  org: {
                    label: 'University of Houston',
                  },
                },
                {
                  text: `Every second you're not building your brand online, someone else is building theirs. And they're connecting with the audience that could have been yours.`,
                  author: {
                    label: 'Simon Sinek',
                    media: {
                      format: 'image',
                      url: new URL('img/tour/person-simon.jpg', import.meta.url).href,
                    },
                    subLabel: 'Leadership Expert & Best-Selling Author',
                  },
                  org: {
                    label: 'Start With Why',
                  },
                },
              ],
            },
          }),
        ],
      }),
      await factory.fromTemplate({
        templateId: 'cardPageAreaV1',
        userConfig: {
          standard: {
            primaryColor: 'blue',
            themeColor: 'blue',
            background: {
              gradient: {
                angle: 45,
                stops: [
                  { theme: 'blue', scale: 950, opacity: 0, percent: 50 },
                  { theme: 'blue', scale: 950, opacity: 0.8, percent: 100 },
                ],
              },
            },
          },
        },
        cards: [
          await factory.fromTemplate<typeof heroTemplate>({
            templateId: 'cardHeroV1',
            userConfig: {
              standard: {
                spaceSize: 'lg',
              },
              superTitle: {
                icon: { iconId: 'rocket' },
                text: 'Feeling frustrated? The solution is here.',
                theme: 'orange',
              },
              title: `Your Story Is [text_effect type=squiggle]Worth Telling[/text_effect]`,
              subTitle: `Lots of people struggle to build a personal brand! Fiction simplifies the process, give it a try and see the difference.`,
              action: {
                buttons: [
                  {
                    label: 'Start Now',
                    icon: 'i-tabler-rocket',
                    href: '/auth/login?_reload=1',
                    theme: 'primary',
                  },
                ],
              },
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
                  { label: 'About', href: '/about' },
                  {
                    label: 'Web Elements',
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
                    { label: 'Start Free', theme: 'primary', icon: { iconId: 'bolt' } },
                    { label: 'Talk to Sales', theme: 'default', icon: { iconId: 'phone' } },
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
