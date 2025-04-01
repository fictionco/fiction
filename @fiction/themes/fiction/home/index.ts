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
        title: 'Create Your Ideal Digital Self',
        description: 'Create a personal brand that displays your ideal digital self. Build an AI-enhanced personal brand and professional network with Fiction.',
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
                text: 'Put Your Ideal Digital Self Online',
                theme: 'orange',
                icon: { class: 'i-tabler-rocket' },
              },
              title: `Create a Professional [@text_effect type=squiggle]Personal Website[/@text_effect].`,
              subTitle: `Create your AI avatar and build your personal website in minutes.`,

              action: {
                buttons: [
                  {
                    label: 'Create Account',
                    href: '/app/auth/register?_reload=1',
                    theme: 'primary',
                    design: 'solid',
                    iconAfter: 'i-tabler-arrow-big-right-lines',
                  },
                  {
                    label: 'Why Fiction?',
                    href: '/tour',
                    theme: 'default',
                    design: 'solid',
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
                  title: 'Morgan Jones',
                  subTitle: 'Marketing Executive',
                  media: {
                    url: new URL('img/morgan.jpg', import.meta.url).href,
                  },
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
                  title: 'Brian Pentz',
                  subTitle: 'Investor',
                  media: {
                    url: new URL('img/brian.jpg', import.meta.url).href,
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
                    text: 'Online Personal Branding Meets AI',
                  },
                  title: 'It all begins with your story...',
                  content: 'Your professional avatar is your web presence, your reputation, and your personal brand. Use Fiction to tell your story, express your expertise, and build your network.',
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
