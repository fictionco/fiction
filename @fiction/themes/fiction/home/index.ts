import type { template as bentoTemplate } from '@fiction/cards/content-bento/index.js'
import type { template as heroTemplate } from '@fiction/cards/content-hero/index.js'
import type { template as marqueeTemplate } from '@fiction/cards/media-marquee/index.js'
import type { template as wrapTemplate } from '@fiction/cards/page/wrap/index.js'
import type { template as logosTemplate } from '@fiction/cards/proof-logos/index'
import type { CardFactory } from '@fiction/site/cardFactory'
import type { StockMedia } from '@fiction/ui/stock/index.js'

export async function getHomePage(args: { factory: CardFactory, stock: StockMedia }) {
  const { factory, stock } = args

  return factory.fromTemplate<typeof wrapTemplate>({
    regionId: 'main',
    templateId: 'cardPageWrapV1',
    slug: '_home',
    title: 'Home',
    userConfig: {
      site: {
        title: 'Create Your Professional Avatar and Personal Brand',
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
            userConfig: {
              superTitle: {
                text: 'The Professional Avatar System',
                theme: 'orange',
                icon: { class: 'i-tabler-award' },
              },
              title: `Build Your [@text_effect type=squiggle]Professional Avatar[/@text_effect].`,
              subTitle: `Get noticed and grow your influence with an AI-enhanced website, newsletter, and reputation.`,

              action: {
                buttons: [
                  {
                    label: 'Get Started',
                    href: '/app/auth/register?_reload=1',
                    theme: 'primary',
                    design: 'solid',
                    iconAfter: 'i-tabler-arrow-big-right-lines',
                  },
                  {
                    label: 'View Tour',
                    href: '/tour',
                    theme: 'default',
                    design: 'solid',
                    iconAfter: 'i-tabler-arrow-big-right-lines',
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
                    url: `${new URL('img/andrew.jpg', import.meta.url).href}?blurhash=UbD%2Be.f%2B9an%24~UbIE2aeskaeV%40W%3BM%7BaeoLbb`,
                  },
                  href: 'https://www.andrewpowers.com',
                },

                {
                  title: 'Hugo Rebora',
                  subTitle: 'Podcaster',
                  media: stock.getAssetBySlug('rebora'),
                },
                {
                  title: 'Selena Gomez',
                  subTitle: 'Musician',
                  media: {
                    url: new URL('img/selena.jpg', import.meta.url).href,
                  },
                },

                {
                  title: 'Olivia Alani',
                  subTitle: 'Fashion Designer',
                  media: stock.getAssetBySlug('olivia'),
                },
                {
                  title: 'Gabriel Torres',
                  subTitle: 'Coach',
                  media: stock.getAssetBySlug('abgcuk'),
                },

                {
                  title: 'Barack Obama',
                  subTitle: 'Politician',
                  media: {
                    url: new URL('img/obama.webp', import.meta.url).href,
                  },
                },
                {
                  title: 'Sarah Bands',
                  subTitle: 'Director',
                  media: stock.getAssetBySlug('bands'),
                },
                {
                  title: 'Dean Stoecker',
                  subTitle: 'Founder, Alteryx',
                  media: {
                    url: new URL('img/dean2.jpg', import.meta.url).href,
                  },
                },
                {
                  title: 'Joe Rogan',
                  subTitle: 'Comedian / Podcaster',
                  media: {
                    url: new URL('img/rogan.jpg', import.meta.url).href,
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
                  label: 'Harvard Business Review',
                  href: 'https://online.hbs.edu/blog/post/personal-branding-at-work',
                  media: stock.getLocalMedia({ key: 'logoHbr' }),
                },
                {
                  label: 'Forbes',
                  href: 'https://www.forbes.com/sites/williamarruda/2025/01/02/9-personal-branding-trends-for-2025/',
                  media: stock.getLocalMedia({ key: 'logoForbes' }),
                },
                {
                  label: 'Inc.',
                  href: 'https://www.inc.com/henna-pryor/personal-branding-just-became-the-future-of-marketing-and-its-more-profitable-than-you-think/90987043',
                  media: stock.getLocalMedia({ key: 'logoInc' }),
                },
                {
                  label: 'Entrepreneur',
                  href: 'https://www.entrepreneur.com/starting-a-business/why-personal-branding-matters-more-than-ever-if-you-want-to/479359',
                  media: stock.getLocalMedia({ key: 'logoEntrepreneur' }),
                },
              ],
              label: 'As Seen In',
            },
          }),
          await factory.fromTemplate<typeof bentoTemplate>({
            templateId: 'cardBentoV1',
            userConfig: {
              items: [
                {
                  cols: 12,
                  rows: 3,
                  superTitle: {
                    icon: { class: 'i-tabler-rocket' },
                    text: 'The Personal Branding Platform',
                  },
                  title: 'It all begins with your story...',
                  content: 'Unlock the next level of success with an unforgettable personal brand. Build your dream website, grow your audience, and share your vision—all in one place.',
                  theme: 'blue',
                  themeMode: 'dark',
                  verticalPosition: 'bottom',
                  horizontalPosition: 'left',
                  bg: {
                    url: 'https://res.cloudinary.com/fiction-com-inc/video/upload/f_auto,q_auto/v1733965053/replicate-prediction-wtfb2100xxrj00ckq1cb7s94hg_rhvr5g.mp4',
                    overlay: { opacity: 0.3 },
                    videoControls: {
                      freeze: { playOnHover: true },
                    },
                  },
                  action: {
                    buttons: [
                      {
                        label: 'Build Your Brand',
                        href: '/app/auth/register?_reload=1',
                        theme: 'overlay',
                        icon: 'i-tabler-user-circle',
                        design: 'solid',
                        size: 'xl',
                      },
                      {
                        label: 'Learn More',
                        href: '/tour',
                        theme: 'overlay',
                        icon: 'i-tabler-rocket',
                        design: 'outline',
                        size: 'xl',
                      },
                    ],
                  },
                },
                {
                  cols: 4,
                  rows: 2,
                  superTitle: {
                    icon: { class: 'i-tabler-rocket' },
                    text: 'Own Your Brand',
                  },
                  title: 'Websites Optimized for Personal Brands',
                  content: 'Your story deserves a home that reflects your voice. Fiction crafts stunning personal websites with effortless customization.',
                  theme: 'orange',
                  themeMode: 'dark',
                  verticalPosition: 'bottom',
                  horizontalPosition: 'left',

                },
                {
                  cols: 4,
                  rows: 2,
                  superTitle: {
                    icon: { class: 'i-tabler-mail' },
                    text: 'Capture & Connect',
                  },
                  title: 'Build an Audience, Start Your Newsletter',
                  content: 'Engage your audience with every send. Fiction helps you build your email list and deliver newsletters that captivate.',
                  theme: 'blue',
                  themeMode: 'dark',
                  verticalPosition: 'bottom',
                  horizontalPosition: 'left',

                },
                {
                  cols: 4,
                  rows: 2,
                  superTitle: {
                    icon: { class: 'i-tabler-bolt' },
                    text: 'Powered by AI',
                  },
                  title: 'Effortless Content Creation with AI',
                  content: 'Stuck on words? Use AI tools to unlock creativity. Craft content that inspires, informs, and converts.',
                  theme: 'green',
                  themeMode: 'dark',
                  verticalPosition: 'bottom',
                  horizontalPosition: 'left',

                },
              ],
            },
          }),

        ],

      }),

    ],
  })
}
