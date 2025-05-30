import type { CardFactory } from '@fiction/site/cardFactory'
import type { StockMedia } from '@fiction/ui/stock/index.js'
import { cardConfig } from '@fiction/cards/index.js'
import ImageAndrew from './img/andrew.jpg'
import ImageBrian from './img/brian.jpg'
import ImageDean from './img/dean2.jpg'
import ImageMorgan from './img/morgan.jpg'
import ImageSelena from './img/selena.jpg'

export async function getHomePage(args: { factory: CardFactory, stock: StockMedia }) {
  const { stock } = args

  return cardConfig({
    regionId: 'main',
    templateId: 'cardPageWrapV1',
    slug: 'home',
    title: 'Home',
    isHome: true,
    nav: 'show',
    priority: 50,
    userConfig: {
      standard: {
        title: 'Your Digital Self in 3 Minutes',
        description: 'Create a personal brand that displays your ideal digital self. Build an AI-enhanced personal brand and professional network with Fiction.',
      },
    },
    cards: [
      cardConfig({
        templateId: 'cardPageAreaV1',
        cards: [
          cardConfig({
            templateId: 'cardHeroV1',
            userConfig: {
              items: [
                {
                  superTitle: {
                    text: 'Great for Link-in-Bio',
                    icon: { class: 'i-tabler-trending-up' },
                  },
                  title: `Your Personal Website in Under [@text_effect type=line]3 Minutes[/@text_effect].`,
                  subTitle: `The simplest way to create a portfolio, newsletter, and more. Built for the next-generation of leaders.`,

                  action: {
                    buttons: [
                      {
                        label: 'Create Account',
                        href: '/app/auth?_reload=1',
                        theme: 'primary',
                        design: 'solid',
                        iconAfter: 'i-tabler-arrow-big-right-lines',
                      },
                    ],
                  },
                },
              ],
            },
          }),
          cardConfig({
            templateId: 'cardMarqueeV1',
            userConfig: {
              items: [
                {
                  title: 'Andrew Powers',
                  subTitle: 'Serial Entrepreneur',
                  media: {
                    url: ImageAndrew,
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
                    url: ImageMorgan,
                  },
                },
                {
                  title: 'Selena Gomez',
                  subTitle: 'Musician',
                  media: {
                    url: ImageSelena,
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
                    url: ImageDean,
                  },
                },
                {
                  title: 'Brian Pentz',
                  subTitle: 'Investor',
                  media: {
                    url: ImageBrian,
                  },
                },

              ],
            },
          }),

          cardConfig({
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
          cardConfig({
            templateId: 'cardBentoV1',
            userConfig: {
              items: [
                {
                  cols: 12,
                  rows: 3,
                  superTitle: {
                    icon: { class: 'i-tabler-rocket' },
                    text: 'AI-Optimize Your Personal Brand',
                  },
                  title: 'Create Your Digital Self',
                  content: 'Use Fiction to tell your story, express your expertise, and build your network.',
                  theme: 'blue',
                  themeMode: 'dark',
                  verticalPosition: 'bottom',
                  horizontalPosition: 'left',
                  bg: {
                    format: 'video',
                    url: 'https://res.cloudinary.com/fiction-com-inc/video/upload/f_auto,q_auto/v1733965053/replicate-prediction-wtfb2100xxrj00ckq1cb7s94hg_rhvr5g.mp4',
                    effects: { overlay: { opacity: 0.3 } },
                    video: {
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
                    ],
                  },
                },
                {
                  cols: 4,
                  rows: 2,
                  superTitle: {
                    icon: { class: 'i-tabler-rocket' },
                    text: 'Homebase',
                  },
                  title: 'Your Website',
                  content: 'A stunning personal website with effortless customization.',
                  theme: 'orange',
                  themeMode: 'dark',
                  verticalPosition: 'bottom',
                  horizontalPosition: 'left',
                  bg: { ...stock.getAssetBySlug('whvmql'), effects: { overlay: { opacity: 0.3 } } },
                },
                {
                  cols: 4,
                  rows: 2,
                  superTitle: {
                    icon: { class: 'i-tabler-mail' },
                    text: 'Inbox',
                  },
                  title: 'Your Newsletter',
                  content: 'Capture your audience, then send them a newsletter.',
                  theme: 'blue',
                  themeMode: 'dark',
                  verticalPosition: 'bottom',
                  horizontalPosition: 'left',
                  bg: { ...stock.getAssetBySlug('dvyiy3'), effects: { overlay: { opacity: 0.3 } } },

                },
                {
                  cols: 4,
                  rows: 2,
                  superTitle: {
                    icon: { class: 'i-tabler-bolt' },
                    text: 'Content',
                  },
                  title: 'Your Ideas',
                  content: 'Put all your content in one place, syndicate it elsewhere.',
                  theme: 'green',
                  themeMode: 'dark',
                  verticalPosition: 'bottom',
                  horizontalPosition: 'left',
                  bg: { ...stock.getAssetBySlug('aratfe'), effects: { overlay: { opacity: 0.3 } } },
                },
              ],
            },
          }),

        ],

      }),

    ],
  })
}
