import type { template as heroTemplate } from '@fiction/cards/content-hero'
import type { template as tourTemplate } from '@fiction/cards/content-tour/index.js'
import type { template as areaTemplate } from '@fiction/cards/page-area/index.js'

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
                  media: { url: new URL('img/fig-website-screen.svg', import.meta.url).href },
                  overlays: [{ media: { url: new URL('img/fig-website-alt-1.svg', import.meta.url).href } }],
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
                  media: { url: new URL('img/fig-subscribe-screen.svg', import.meta.url).href },
                  overlays: [{ media: { url: new URL('img/fig-subscribe-alt-1.svg', import.meta.url).href } }],
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
                  media: { url: new URL('img/fig-email-screen.svg', import.meta.url).href },
                  overlays: [{ media: { url: new URL('img/fig-email-alt-1.svg', import.meta.url).href } }],
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
                  media: { url: new URL('img/fig-money-screen.svg', import.meta.url).href },
                  overlays: [{ media: { url: new URL('img/fig-money-alt-1.svg', import.meta.url).href } }],
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
                  media: { url: new URL('img/fig-contact-screen.svg', import.meta.url).href },
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
                  text: `The best time to build your personal brand was five years ago. The second best time is today. In the digital age, invisibility is a bigger risk than failure.`,
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
                  text: `<p>Ever notice that what people find when they Google your name, shapes their decision to work with, hire, or invest in you?</p><p> Can you afford to let others tell your story?</p>`,
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
                  text: `Every second you're not building your brand online, someone else is building theirs. And they're connecting with the audience that could have been yours.`,
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
