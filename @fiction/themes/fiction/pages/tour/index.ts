import type { CardFactory } from '@fiction/site/cardFactory'

import type { StockMedia } from '@fiction/ui/stock/index.js'
import { cardConfig } from '@fiction/cards'
import ImageAi from './img/ai.png'
import ImageAudience from './img/audience.png'
import ImageFigMoney from './img/fig-money-alt-1.svg'
import ImageSubscribe from './img/fig-subscribe-alt-1.svg'
import ImageManSmiling from './img/man-smiling.png'
import ImageMeeting from './img/meeting.png'
import ImageWebsite from './img/website.svg'

export async function getTourPage(args: { factory: CardFactory, stock: StockMedia }) {
  return cardConfig({
    regionId: 'main',
    templateId: 'cardPageWrapV1',
    slug: 'tour',
    title: 'Why Fiction',
    nav: 'show',
    cards: [
      cardConfig({
        templateId: 'cardPageAreaV1',
        cards: [
          cardConfig({
            templateId: 'cardHeroV1',
            userConfig: {
              items: [{
                superTitle: {
                  text: 'Personal Branding for the AI Age',
                  theme: 'green',
                  icon: { class: 'i-tabler-arrow-up-right' },
                },
                title: `The Most Reliable Way to Improve Your [@text_effect type=squiggle]Results[/@text_effect]`,
                subTitle: `The most effective way to drive new opportunities, and grow your business.`,

                action: {
                  buttons: [
                    {
                      label: 'Get Started',
                      href: '/app/auth/register?_reload=1',
                      theme: 'primary',
                      design: 'solid',
                      iconAfter: 'i-tabler-arrow-big-right-lines',
                    },
                  ],
                },
              }],
            },
          }),

          cardConfig({
            templateId: 'cardHeroV1',
            userConfig: {
              items: [
                {
                  layout: 'right',
                  superTitle: {
                    icon: { iconId: 'browser' },
                    text: 'Command Attention',
                    theme: 'orange',
                  },
                  title: 'A Professional Website for Your Aspirations',
                  subTitle: `Over 80% of people research you online before meeting with you. Your professional avatar sets your first impression.`,
                  media: { url: ImageManSmiling },
                  overlays: [{ media: { url: ImageWebsite }, widthPercent: 50 }],
                  action: {},
                },
                {
                  layout: 'left',
                  superTitle: {
                    icon: { iconId: 'trending-up' },
                    text: 'Inbound Influence',
                    theme: 'rose',
                  },
                  title: 'Content and Email Marketing made Simple',
                  subTitle: `The best way to connect with leaders in your field is to build your personal brand and share your expertise.`,
                  media: { url: ImageAudience },
                  overlays: [{ media: { url: ImageSubscribe } }],
                  action: {},
                },
                {
                  layout: 'right',
                  superTitle: {
                    icon: { iconId: 'rocket' },
                    text: 'Right Place, Right Time',
                    theme: 'purple',
                  },
                  title: 'Build Your Reputation Network',
                  subTitle: `Invite and connect with leaders and colleagues across Fiction's network of sites.`,
                  media: { url: ImageMeeting },
                  overlays: [{ media: { url: ImageFigMoney } }],
                  action: {},
                },
                {
                  layout: 'left',
                  superTitle: {
                    icon: { iconId: 'chart-bar' },
                    text: 'AI for Human Results',
                    theme: 'yellow',
                  },
                  title: 'AI-Enhanced Creation',
                  subTitle: `Fiction tastefully integrates AI to enhance what makes you unique, help you stay focused, and execute on your vision.`,
                  media: { url: ImageAi },
                  action: {},
                },
              ],
            },
          }),
        ],
      }),
      cardConfig({
        templateId: 'cardPageAreaV1',
        userConfig: {},
        cards: [
          // await cardConfig<typeof templateMetrics>({
          //   templateId: 'cardMetricsV1',
          //   userConfig: {
          //     items: [
          //       {
          //         label: 'Personal Brands',
          //         description: 'Launched & Thriving',
          //         value: 8000,
          //       },
          //       {
          //         label: 'Career-Changing Connections',
          //         description: 'Made Through Fiction',
          //         value: 2_020_000,
          //       },
          //       {
          //         label: 'Revenue Generated',
          //         description: 'For Our Members',
          //         format: 'abbreviatedDollar',
          //         value: 12_000_000,
          //       },
          //     ],
          //   },
          // }),
          cardConfig({
            templateId: 'cardQuotesV1',
            userConfig: {
              items: [
                {
                  text: `Not having a professional presence online is career suicide. In today's world, you simply don't exist without one.`,
                  author: {
                    label: 'Brené Brown',
                    media: {
                      format: 'image',
                      url: new URL('img/person-brene.webp', import.meta.url).href,
                    },
                    subLabel: 'Research Professor & Author',
                  },
                  org: {
                    label: 'University of Houston',
                  },
                },
                {
                  text: `<p>Every time someone Googles your name, they're making decisions about you. Are you controlling that narrative or leaving it to chance?</p>`,
                  author: {
                    label: 'Tim Ferris',
                    media: { url: new URL('img/person-ferris.webp', import.meta.url).href },
                    subLabel: 'Author of The 4-Hour Workweek',
                  },
                  org: {
                    label: 'Tim Ferris',
                  },
                },
                {
                  text: `While you hesitate to build your online presence, someone else is taking your spot, connecting with your audience, and claiming your opportunities.`,
                  author: {
                    label: 'Simon Sinek',
                    media: {
                      format: 'image',
                      url: new URL('img/person-simon.jpg', import.meta.url).href,
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
      cardConfig({
        templateId: 'cardPageAreaV1',
        userConfig: {
          standard: {
            primaryColor: 'blue',
            themeColor: 'blue',
            background: {
              gradient: {
                angle: 45,
                stops: [
                  { theme: 'blue', scale: 950, opacity: 0, position: 50 },
                  { theme: 'blue', scale: 950, opacity: 0.8, position: 100 },
                ],
              },
            },
          },
        },
        cards: [
          cardConfig({
            templateId: 'cardHeroV1',
            userConfig: {
              items: [
                {
                  superTitle: {
                    icon: { iconId: 'rocket' },
                    text: 'Feeling frustrated? The solution is here.',
                    theme: 'orange',
                  },
                  title: `Your Story Is [@text_effect type=squiggle]Worth Telling[/@text_effect]`,
                  subTitle: `Lots of people struggle to build a personal brand! Fiction simplifies the process, give it a try and see the difference.`,
                  action: {
                    buttons: [
                      {
                        label: 'Start Now',
                        icon: 'i-tabler-rocket',
                        href: '/app/auth/register?_reload=1',
                        theme: 'primary',
                      },
                    ],
                  },
                },
              ],
            },
          }),
        ],
      }),
    ],
  })
}
