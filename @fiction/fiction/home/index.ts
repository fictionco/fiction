import type { CardFactory } from '@fiction/site/cardFactory'
import type { StockMedia } from '@fiction/ui/stock/index.js'
import { cardConfig } from '@fiction/cards/index.js'
import ImageAndrew from './img/andrew.jpg'
import ImageBrian from './img/brian.jpg'
import ImageDean from './img/dean-profile.webp'
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
        title: 'Your Professional Digital Self',
        description: 'Create a polished online presence that opens doors. Website, content tools, and audience building in one platform.',
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
                    theme: 'orange',
                    text: 'Professional Digital Presence',
                    icon: { class: 'i-tabler-user-circle' },
                  },
                  title: `Your Digital Self. [@text_effect type=line]Always Ready.[/@text_effect]`,
                  subTitle: `Create a professional digital version of yourself that works 24/7. Showcase your expertise, capture leads, and build your audience while you sleep.`,
                  action: {
                    buttons: [
                      {
                        label: 'Build Your Digital Self',
                        href: '/app/auth?_reload=1',
                        theme: 'primary',
                        design: 'solid',
                        iconAfter: 'i-tabler-arrow-right',
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
              stagger: true,
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
                    icon: { class: 'i-tabler-user-circle' },
                    text: 'Your Digital Self',
                  },
                  title: 'Always Professional',
                  content: 'Your digital self never has a bad day. Present your best version 24/7 with a website that captures leads, showcases your work, and builds your authority.',
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
                        label: 'Create Your Digital Self',
                        href: '/app/auth?_reload=1',
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
                    icon: { class: 'i-tabler-world' },
                    text: 'Your Website',
                  },
                  title: 'Your Digital Home',
                  content: 'A polished website that converts visitors into clients and opportunities.',
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
                    text: 'Your Audience',
                  },
                  title: 'Capture & Convert',
                  content: 'Turn website visitors into email subscribers and paying clients.',
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
                    icon: { class: 'i-tabler-file-text' },
                    text: 'Your Content',
                  },
                  title: 'Showcase Expertise',
                  content: 'Publish articles, case studies, and insights that establish your authority.',
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
