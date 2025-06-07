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
                  text: 'Why Fiction?',
                  theme: 'red',
                  icon: { class: 'i-tabler-north-star' },
                },
                title: `They Looked You Up [@text_effect type=scribble]Before[/@text_effect] Coffee`,
                subTitle: `That investor. That client. That date. They all did the same thing: searched your name. What did they find? Fiction controls that moment.`,

                action: {
                  buttons: [
                    {
                      label: 'Own Your Story',
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
                    text: 'Presence',
                    theme: 'orange',
                  },
                  title: `Invisible = Irrelevant`,
                  subTitle: `No LinkedIn? Stale website? Random Google results? You're handing opportunities to louder voices. Fiction builds your stage.`,
                  // IMAGE: Split screen showing "Before" - empty Google search results with maybe outdated LinkedIn vs "After" - polished Fiction profile at top of results
                  media: { url: ImageInvisible },
                  action: {},
                },
                {
                  layout: 'left',
                  superTitle: {
                    icon: { iconId: 'brain' },
                    text: 'Content',
                    theme: 'purple',
                  },
                  title: `Great ideas need a platform`,
                  subTitle: `Brilliant thoughts. Zero followers. You know what to say but algorithms bury you. Fiction amplifies your voice without the social media circus.`,
                  // IMAGE: Person staring at blank screen with thought bubbles full of great ideas, then arrow to engaging content being created
                  media: { url: ImageAudience },
                  action: {},
                },
                {
                  layout: 'right',
                  superTitle: {
                    icon: { class: 'i-tabler-bolt' },
                    text: 'Influence',
                    theme: 'yellow',
                  },
                  title: `AI-Enhanced Authenticity`,
                  subTitle: ` Fiction learns your voice, your style, your goals. AI that enhances, never replaces.`,
                  // IMAGE: Before/after of bland corporate text vs engaging, personality-filled content in the person's actual voice
                  media: { url: ImageMeeting },

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
                  description: 'Now Discoverable Online',
                  value: 12847,
                },
                {
                  label: 'Deal-Closing Conversations',
                  description: 'Started from Fiction Profiles',
                  value: 89600,
                },
                {
                  label: 'Lost Opportunities',
                  description: 'Recovered This Month',
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
                    text: 'Time\'s Up',
                    theme: 'red',
                  },
                  title: `A digital presence in [@text_effect type=squiggle]3 minutes[/@text_effect] or less`,
                  subTitle: `Every day you wait, someone else claims your space. Fiction builds your presence in seconds, not months.`,
                  action: {
                    buttons: [
                      {
                        label: 'Start Now',
                        icon: 'i-tabler-rocket',
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
