import type { CardFactory } from '@fiction/site/cardFactory'

import type { StockMedia } from '@fiction/ui/stock/index.js'
import { cardConfig } from '@fiction/cards'
import ImageAi from './img/ai.png'
import ImageAudience from './img/audience.png'
import ImageFigMoney from './img/fig-money-alt-1.svg'
import ImageSubscribe from './img/fig-subscribe-alt-1.svg'
import ImageManSmiling from './img/man-smiling.png'
import ImageMeeting from './img/meeting.png'
import PersonBrene from './img/person-brene.webp'
import PersonFerris from './img/person-ferris.webp'
import PersonSimon from './img/person-simon.jpg'
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
                  text: 'Your Digital Self',
                  theme: 'green',
                  icon: { class: 'i-tabler-arrow-up-right' },
                },
                title: `Most People [@text_effect type=scribble]Secretly[/@text_effect] Research You!`,
                subTitle: `Over 80% of people research you online before meeting with you. Fiction helps set your first impression.`,

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
                    text: 'Own the Spotlight',
                    theme: 'orange',
                  },
                  title: `Like a Website, But Better`,
                  subTitle: `Want a website but don't want the complexity? Fiction's AI creates a stunning, personalized site that showcases your expertise.`,
                  media: { url: ImageManSmiling },
                  overlays: [{ media: { url: ImageWebsite }, widthPercent: 50 }],
                  action: {},
                },
                {
                  layout: 'left',
                  superTitle: {
                    icon: { iconId: 'trending-up' },
                    text: 'Influence on Autopilot',
                    theme: 'rose',
                  },
                  title: `Content that Connects`,
                  subTitle: `Have a tough time creating content? Fiction enhances your ideas, making them engaging and shareable.`,
                  media: { url: ImageAudience },
                  overlays: [{ media: { url: ImageSubscribe } }],
                  action: {},
                },
                {
                  layout: 'right',
                  superTitle: {
                    icon: { iconId: 'rocket' },
                    text: 'Network Smarter',
                    theme: 'purple',
                  },
                  title: `Connections that Matter`,
                  subTitle: `Stop relying on social media to connect. Fiction's AI helps you create an audience you own.`,
                  media: { url: ImageMeeting },
                  overlays: [{ media: { url: ImageFigMoney } }],
                  action: {},
                },
                {
                  layout: 'left',
                  superTitle: {
                    icon: { iconId: 'chart-bar' },
                    text: 'AI with Soul',
                    theme: 'yellow',
                  },
                  title: `Create with Clarity`,
                  subTitle: `Overwhelmed by tech? Fiction’s AI enhances your vision, keeping you in control.`,
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
                      url: PersonBrene,
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
                    media: { url: PersonFerris },
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
                      url: PersonSimon,
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
            primaryColor: 'primary',

            background: {
              gradient: {
                angle: 45,
                stops: [
                  { theme: 'primary', scale: 950, opacity: 0, position: 50 },
                  { theme: 'primary', scale: 950, opacity: 0.8, position: 100 },
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
                    text: 'Stuck in the Shadows?',
                    theme: 'orange',
                  },
                  title: `Your Voice [@text_effect type=squiggle]Deserves[/@text_effect] to Lead`,
                  subTitle: `Building a brand feels impossible? Fiction's AI makes it sharp, simple, and yours.`,
                  action: {
                    buttons: [
                      {
                        label: 'Claim Your Stage',
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
