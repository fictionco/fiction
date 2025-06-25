import type { CardFactory } from '@fiction/site/cardFactory'

import type { StockMedia } from '@fiction/ui/stock/index.js'
import { cardConfig } from '@fiction/cards'
import ImageAudience from './img/audience.png'
import ImageInvisible from './img/invisible.png'
import ImageMeeting from './img/meeting.png'
import PersonBrene from './img/person-brene.webp'
import PersonFerris from './img/person-ferris.webp'
import PersonSimon from './img/person-simon.jpg'

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
                  text: 'The Problem',
                  theme: 'red',
                  icon: { class: 'i-tabler-user-off' },
                },
                title: `Your Digital Self [@text_effect type=scribble]Doesn't Exist[/@text_effect]`,
                subTitle: `When people search your name, they find nothing. Or worse, they find someone else. Your opportunities are disappearing while you're invisible online.`,

                action: {
                  buttons: [
                    {
                      label: 'Create Your Digital Self',
                      href: '/app/auth?_reload=1',
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
                    icon: { iconId: 'ghost' },
                    text: 'Invisible',
                    theme: 'orange',
                  },
                  title: `No Digital Self = No Opportunities`,
                  subTitle: `When clients, investors, or employers search your name, they find empty results. Your expertise is hidden. Your digital self doesn't exist.`,
                  // IMAGE: Split screen showing "Before" - empty Google search results with maybe outdated LinkedIn vs "After" - polished Fiction profile at top of results
                  media: {
                    url: ImageInvisible,
                    alt: 'Split screen comparison: Left shows empty Google search results for a person\'s name, right shows a professional Fiction profile dominating the search results',
                  },
                  action: {},
                },
                {
                  layout: 'left',
                  superTitle: {
                    icon: { iconId: 'brain' },
                    text: 'Silent',
                    theme: 'purple',
                  },
                  title: `Your Ideas Have No Home`,
                  subTitle: `You have valuable insights, but nowhere to share them. Social media buries your content. Your digital self has no voice.`,
                  // IMAGE: Person staring at blank screen with thought bubbles full of great ideas, then arrow to engaging content being created
                  media: {
                    url: ImageAudience,
                    alt: 'Person at computer with thought bubbles containing brilliant ideas, then arrow pointing to engaging content being published on their professional website',
                  },
                  action: {},
                },
                {
                  layout: 'right',
                  superTitle: {
                    icon: { class: 'i-tabler-bolt' },
                    text: 'Unprepared',
                    theme: 'yellow',
                  },
                  title: `Every Search is a Missed Chance`,
                  subTitle: `Someone looked you up today. They found nothing. That opportunity is gone. Your digital self needs to be ready 24/7.`,
                  // IMAGE: Before/after of bland corporate text vs engaging, personality-filled content in the person's actual voice
                  media: {
                    url: ImageMeeting,
                    alt: 'Before/after comparison: Left shows generic corporate profile, right shows engaging personal content that captures attention and builds trust',
                  },

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
          cardConfig({
            templateId: 'cardMetricsV1',
            userConfig: {
              items: [
                {
                  label: 'Professionals',
                  description: 'Now Have Digital Selves',
                  value: 12847,
                },
                {
                  label: 'Opportunities',
                  description: 'Captured This Month',
                  value: 89600,
                },
                {
                  label: 'Missed Chances',
                  description: 'Recovered with Fiction',
                  value: 2340,
                },
              ],
            },
          }),
          cardConfig({
            templateId: 'cardQuotesV1',
            userConfig: {
              items: [

                {
                  text: `<p>Personal branding is about managing your name—even if you don't own a business—in a world of misinformation.</p>`,
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
                  text: `While you hesitate to build your online presence, someone else is taking your spot.`,
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
                {
                  text: `Not having a professional presence online is career suicide.`,
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
                    icon: { iconId: 'clock' },
                    text: 'The Solution',
                    theme: 'green',
                  },
                  title: `Your Digital Self [@text_effect type=squiggle]Always Ready[/@text_effect]`,
                  subTitle: `Stop losing opportunities. Create your professional digital self in minutes. Be found. Be trusted. Be ready.`,
                  action: {
                    buttons: [
                      {
                        label: 'Create Your Digital Self',
                        icon: 'i-tabler-user-circle',
                        href: '/app/auth?_reload=1',
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
