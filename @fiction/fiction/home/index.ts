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
        title: 'Your Digital Self, Always Available',
        description: 'Create an AI version of yourself that handles customer support, sales calls, and inquiries on your website, WhatsApp, and everywhere your audience finds you.',
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
                    theme: 'purple',
                    text: 'Join The Discord Community',
                    icon: { class: 'i-tabler-brand-discord' },
                  },
                  title: `AI agents that [@text_effect type=line]act like you[/@text_effect].`,
                  action: {
                    buttons: [
                      {
                        label: 'Start',
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
                    icon: { class: 'i-tabler-user-scan' },
                    text: 'Your Digital Self',
                  },
                  title: 'Handle 10x More Customers',
                  content: 'Your AI answers questions instantly, books qualified meetings, and converts visitors into leads. Works on your website, WhatsApp, and anywhere customers find you.',
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
                        icon: 'i-tabler-user-scan',
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
                    icon: { class: 'i-tabler-world-www' },
                    text: 'Website Chatbot',
                  },
                  title: 'Website Chatbot',
                  content: 'Visitors get instant answers to common questions. AI books meetings with qualified prospects and collects contact info from browsers.',
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
                    icon: { class: 'i-tabler-brand-whatsapp' },
                    text: 'WhatsApp Support',
                  },
                  title: 'WhatsApp Assistant',
                  content: 'Customers text you directly. AI handles support questions, schedules appointments, and sends follow-ups. You only see qualified conversations.',
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
                    icon: { class: 'i-tabler-message-circle' },
                    text: 'Everywhere You Are',
                  },
                  title: 'Multiple Channels',
                  content: 'Same AI works across email, SMS, social DMs, and chat widgets. One setup handles all customer touchpoints in your voice.',
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
