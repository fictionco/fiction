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
                  text: 'They\'re Already Judging',
                  theme: 'red',
                  icon: { class: 'i-tabler-eye' },
                },
                title: `They Looked You Up [@text_effect type=scribble]Before[/@text_effect] Coffee`,
                subTitle: `That investor. That client. That date. They all did the same thing: searched your name. What did they find? Fiction controls that moment.`,

                action: {
                  buttons: [
                    {
                      label: 'Own Your Story',
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
                    icon: { iconId: 'ghost' },
                    text: 'Digital Ghost',
                    theme: 'orange',
                  },
                  title: `Invisible = Irrelevant`,
                  subTitle: `No LinkedIn? Stale website? Random Google results? You're handing opportunities to louder voices. Fiction builds your stage.`,
                  // IMAGE: Split screen showing "Before" - empty Google search results with maybe outdated LinkedIn vs "After" - polished Fiction profile at top of results
                  media: { url: ImageManSmiling },
                  overlays: [{ media: { url: ImageWebsite }, widthPercent: 50 }],
                  action: {},
                },
                {
                  layout: 'left',
                  superTitle: {
                    icon: { iconId: 'brain' },
                    text: 'Content Paralysis',
                    theme: 'purple',
                  },
                  title: `Ideas Trapped Inside`,
                  subTitle: `Brilliant thoughts. Zero followers. You know what to say but algorithms bury you. Fiction amplifies your voice without the social media circus.`,
                  // IMAGE: Person staring at blank screen with thought bubbles full of great ideas, then arrow to engaging content being created
                  media: { url: ImageAudience },
                  overlays: [{ media: { url: ImageSubscribe } }],
                  action: {},
                },
                {
                  layout: 'right',
                  superTitle: {
                    icon: { iconId: 'handshake' },
                    text: 'Networking Nightmare',
                    theme: 'blue',
                  },
                  title: `Connections That Count`,
                  subTitle: `Tired of begging algorithms for reach? Fiction builds an audience that finds YOU. No more posting into the void.`,
                  // IMAGE: Person at networking event being ignored vs person confidently sharing their Fiction profile and people gathering around phone to see
                  media: { url: ImageMeeting },
                  overlays: [{ media: { url: ImageFigMoney } }],
                  action: {},
                },
                {
                  layout: 'left',
                  superTitle: {
                    icon: { iconId: 'lightning-bolt' },
                    text: 'AI That Gets It',
                    theme: 'yellow',
                  },
                  title: `Your Vision, Amplified`,
                  subTitle: `Not another chatbot. Fiction learns your voice, your style, your goals. AI that enhances, never replaces.`,
                  // IMAGE: Before/after of bland corporate text vs engaging, personality-filled content in the person's actual voice
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
                  text: `I lost a $50K client because my Google results were embarrassing. Never again.`,
                  author: {
                    label: 'Sarah Chen',
                    media: {
                      format: 'image',
                      url: PersonBrene, // Replace with actual testimonial photos
                    },
                    subLabel: 'Management Consultant',
                  },
                  org: {
                    label: 'Former Deloitte Partner',
                  },
                },
                {
                  text: `Fiction saved me from explaining why my LinkedIn looked like 2015 threw up on it.`,
                  author: {
                    label: 'Marcus Rodriguez',
                    media: { url: PersonFerris },
                    subLabel: 'Startup Founder',
                  },
                  org: {
                    label: '3x Exit, Now Fiction User',
                  },
                },
                {
                  text: `Went from digital nobody to industry voice in 90 days. Fiction doesn't just build profiles - it builds careers.`,
                  author: {
                    label: 'Dr. Priya Patel',
                    media: {
                      format: 'image',
                      url: PersonSimon,
                    },
                    subLabel: 'Medical Research Director',
                  },
                  org: {
                    label: 'Johns Hopkins',
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
                  title: `Stop Losing to [@text_effect type=squiggle]Louder[/@text_effect] Voices`,
                  subTitle: `Every day you wait, someone else claims your space. Fiction builds your presence in hours, not months.`,
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
