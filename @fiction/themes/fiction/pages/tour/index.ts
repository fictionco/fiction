import type { template as heroTemplate } from '@fiction/cards/content-hero'
import type { template as tourTemplate } from '@fiction/cards/content-tour/index.js'
import type { template as areaTemplate } from '@fiction/cards/page/area/index.js'

import type { template as templateMetrics } from '@fiction/cards/proof-metrics/index.js'
import type { template as templateQuotes } from '@fiction/cards/proof-quotes/index.js'

import type { CardFactory } from '@fiction/site/cardFactory'
import type { StockMedia } from '@fiction/ui/stock/index.js'

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
                text: 'Personal Branding for the AI Age',
                theme: 'green',
                icon: { class: 'i-tabler-arrow-up-right' },
              },
              title: `Establish and Build Your [@text_effect type=squiggle]Reputation[/@text_effect]`,
              subTitle: `Your professional avatar is your web presence, your reputation, and your personal brand. Fiction makes it easy to build and grow.`,


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
                    text: 'Command Attention',
                    theme: 'orange',
                  },
                  title: 'A Professional Website for Your Aspirations',
                  subTitle: `Over 80% of people research you online before meeting with you. Your professional avatar sets your first impression.`,
                  media: { url: new URL('img/man-smiling.png', import.meta.url).href },
                  overlays: [{ media: { url: new URL('img/website.svg', import.meta.url).href }, widthPercent: 50 }],
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
                  media: { url: new URL('img/audience.png', import.meta.url).href },
                  overlays: [{ media: { url: new URL('img/fig-subscribe-alt-1.svg', import.meta.url).href } }],
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
                  media: { url: new URL('img/meeting.png', import.meta.url).href },
                  overlays: [{ media: { url: new URL('img/fig-money-alt-1.svg', import.meta.url).href } }],
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
                  media: { url: new URL('img/ai.png', import.meta.url).href },
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
          // await factory.fromTemplate<typeof templateMetrics>({
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
          await factory.fromTemplate<typeof templateQuotes>({
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
                  { theme: 'blue', scale: 950, opacity: 0, position: 50 },
                  { theme: 'blue', scale: 950, opacity: 0.8, position: 100 },
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
          }),
        ],
      }),
    ],
  })
}
