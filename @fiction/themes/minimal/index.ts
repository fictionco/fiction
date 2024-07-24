import type { FictionEnv } from '@fiction/core'
import { safeDirname } from '@fiction/core'
import { Theme } from '@fiction/site/theme.js'
import { getCardTemplates } from '@fiction/cards/index.js'
import type { Site } from '@fiction/site/site.js'
import { CardFactory } from '@fiction/site/cardFactory.js'
import { templates as templatesMinimalHeader } from './cards/minimal-header/index.js'
import { templates as templatesMinimalFooter } from './cards/minimal-footer/index.js'

async function getTemplates() {
  const t = await getCardTemplates()
  const templates = [
    ...t,
    ...templatesMinimalHeader,
    ...templatesMinimalFooter,
  ] as const

  return templates
}
async function getPages(args: { factory: CardFactory<Awaited<ReturnType<typeof getTemplates>>>, site: Site }) {
  const { factory } = args
  return [
    await factory.create({
      slug: '_home',
      title: 'Home',
      isHome: true,
      cards: [
        await factory.create({
          templateId: 'overSlide',
          userConfig: {
            autoSlide: false,
            items: [
              {
                title: 'Benjamin Franklin',
                subTitle: 'Inventor. Statesman. Visionary.',
                textBlend: 'difference',
                media: {
                  format: 'url',
                  url: 'https://cdn.midjourney.com/d17b5ba8-7e8d-4f31-bf01-50903033de62/0_1.png',
                },
                mediaBackground: {
                  format: 'url',
                  url: 'https://cdn.midjourney.com/6b9e1810-039c-41e9-8b96-b8d27cb282ed/0_1.png',
                },
              },
              {
                title: 'Illuminate Your Legacy',
                subTitle: 'Wisdom for the modern age',
                textBlend: 'difference',
                media: {
                  format: 'url',
                  url: 'https://cdn.midjourney.com/e6752783-ab12-483b-935a-6df3754409a7/0_0.png',
                },
                mediaBackground: {
                  format: 'url',
                  url: 'https://cdn.midjourney.com/1bf86864-968e-40a2-87a7-c8f17ea94401/0_1.png',
                },
              },
              {
                title: 'Upcoming Event',
                subTitle: 'Speaking at the Library of Congress',
                textBlend: 'difference',
                media: {
                  format: 'url',
                  url: 'https://cdn.midjourney.com/b1d5ffb0-c9a8-4228-9108-51098099c896/0_1.png',
                },
                mediaBackground: {
                  format: 'url',
                  url: 'https://cdn.midjourney.com/1bf86864-968e-40a2-87a7-c8f17ea94401/0_1.png',
                },
              },
            ],
          },
        }),
        await factory.create({
          templateId: 'ticker',
          userConfig: {
            spacing: {
              spacingSize: 'sm',
            },
            items: [
              { text: 'Printer', outline: true, rotateX: 3, rotateY: 3, rotateZ: 3 },
              { text: 'Inventor', rotateX: 3, rotateY: 3, rotateZ: 3, direction: 'right', bgColor: '#4f46e5', bgColorDark: '#818cf8' },
            ],
          },
        }),
        await factory.create({
          templateId: 'story',
          userConfig: {
            items: [
              {
                title: 'Introduction from Benjamin Franklin',
                content: `
                  <p>My name is Benjamin Franklin. I am a printer, inventor, and statesman.</p>
                  <p>Welcome to my website, a place where I share my adventures and wisdom.</p>
                  <p>I believe in hard work and clever wit. "An investment in knowledge pays the best interest," I always say.</p>
                  <p>Enjoy your stay and remember: "Well done is better than well said."</p>
                `,
                media: {
                  format: 'url',
                  url: 'https://cdn.midjourney.com/fd305840-eeea-4382-921d-94f75f128814/0_0.png',
                },
              },
            ],
          },
        }),
        await factory.create({
          templateId: 'showcase',
          userConfig: {
            // standard: {
            //   heading: 'Featured Works',
            //   subHeading: 'A selection of my most notable achievements',
            // },

            items: [
              {
                title: 'Invention of the Lightning Rod',
                subTitle: 'Saving Lives and Buildings',
                content: '<p>My invention of the lightning rod has saved countless lives and buildings from the destructive power of lightning. By providing a safe pathway for lightning to travel to the ground, the lightning rod prevents fires and structural damage, ensuring the safety of homes, barns, and other structures.</p><p>This simple yet effective device has transformed how we protect our buildings, demonstrating the profound impact of innovative thinking on public safety. The adoption of the lightning rod worldwide has drastically reduced the number of lightning-related incidents, proving its vital role in modern infrastructure.</p>',
                media: {
                  format: 'url',
                  url: 'https://cdn.midjourney.com/3972ddd4-2409-4e9e-a565-d0ad4388ec51/0_0.png',
                },
              },
              {
                title: 'Author of the Poor Richard\'s Almanack',
                subTitle: 'Timeless Advice and Wisdom',
                content: '<p>My almanac is a bestseller and contains timeless advice and wisdom for everyday life. Published annually, Poor Richard\'s Almanack includes weather forecasts, household tips, puzzles, and other useful information. Its witty aphorisms and practical guidance have made it a staple in American homes for decades.</p><p>The almanac\'s enduring popularity is a testament to its valuable content, which has provided generations with essential knowledge and entertainment. Its influence extends beyond mere practicality, reflecting the cultural and intellectual currents of its time.</p>',
                media: {
                  format: 'url',
                  url: 'https://cdn.midjourney.com/bb1dcfe4-93c4-4c3a-a1c0-eb47c9977bc1/0_1.png',
                },
              },
              {
                title: 'Founding Father of the United States',
                subTitle: 'Drafted the Declaration of Independence and the Constitution',
                content: '<p>As a Founding Father, I played a key role in the drafting of the Declaration of Independence and the United States Constitution. My contributions helped lay the foundation for a new nation built on the principles of liberty, democracy, and justice.</p><p>My involvement in these foundational documents reflects my deep commitment to the ideals of independence and freedom. The principles enshrined in these texts continue to guide the nation, underscoring the enduring relevance of our founding ideals.</p>',
                media: {
                  format: 'url',
                  url: 'https://cdn.midjourney.com/620efc5a-55aa-491a-9b40-34190dd0a68b/0_0.png',
                },
              },
              {
                title: 'Franklin Ovens',
                subTitle: 'Revolutionary Cooking',
                content: '<p>My invention of the Franklin Stove revolutionized home heating and cooking. This innovative design improved fuel efficiency and safety, providing a more effective way to heat homes and cook food. It became an essential household item, greatly enhancing domestic life.</p><p>The Franklin Stove not only brought warmth and convenience to countless homes but also set new standards for household appliances. Its impact on daily life and energy consumption remains a testament to the power of practical innovation.</p>',
                media: {
                  format: 'url',
                  url: 'https://cdn.midjourney.com/6c857f45-07a8-4511-afe1-150ff14b2caf/0_1.png',
                },
              },
            ],
          },
        }),
      ],
    }),
    await factory.create({
      slug: 'about',
      title: 'About',
      cards: [
        await factory.create({
          templateId: 'profile',
          userConfig: {
            superHeading: 'About Me',
            heading: 'Benjamin Franklin',
            subHeading: `<p>I am a printer, inventor, and statesman. I am known for my wit and wisdom, and I am one of the Founding Fathers of the United States. I am also the author of the Poor Richard's Almanack.</p>
            <p>I was born in Boston in 1706 and died in Philadelphia in 1790. I am known for my experiments with electricity and my invention of the lightning rod. I also helped draft the Declaration of Independence and the United States Constitution.</p>`,
            mediaItems: [
              {
                media: {
                  format: 'url',
                  url: 'https://cdn.midjourney.com/662d2d1a-df34-4a9a-9854-f83c2c9cf2b3/0_0.png',
                },
              },
              {
                media: {
                  format: 'url',
                  url: 'https://cdn.midjourney.com/2a670199-65b5-4882-b465-4665e3878be0/0_1.png',
                },
              },
            ],
          },
        }),
      ],
    }),
    await factory.create({
      regionId: 'main',
      templateId: 'wrap',
      slug: 'contact',
      title: 'Contact',
      cards: [
        await factory.create({ templateId: 'maps', userConfig: { } }),
      ],
    }),
  ]
}

export async function setup(args: { fictionEnv: FictionEnv }) {
  const { fictionEnv } = args

  const templates = await getTemplates()

  return new Theme({
    fictionEnv,
    root: safeDirname(import.meta.url),
    themeId: 'minimal',
    title: 'Minimal',
    description: 'Minimal personal branding theme',
    screenshot: new URL('./img/screenshot.jpg', import.meta.url).href,
    version: '1.0.0',
    templates,
    isPublic: true,
    getConfig: async ({ site }) => {
      const factory = new CardFactory({ templates, site })
      return {
        pages: await getPages({ factory, site }),
        sections: {
          header: await factory.create({
            regionId: 'header',
            templateId: 'area',
            cards: [
              await factory.create({ templateId: 'nav', userConfig: {
                logo: { html: `Benjamin Franklin`, format: 'html' },
                navA: [
                  { name: 'About', href: '/about' },
                ],
                navB: [
                  { name: 'Contact', href: '/contact', itemStyle: 'buttonStandard' },
                ],
              } }),
            ],
          }),
          footer: await factory.create({
            regionId: 'footer',
            templateId: 'area',
            cards: [
              await factory.create({ templateId: 'footer', userConfig: {
                logo: { format: 'html', html: `BF` },
                nav: [
                  {
                    name: 'About',
                    href: '/about',
                  },
                  {
                    name: 'Contact',
                    href: '/contact',
                  },
                ],
                legal: {
                  privacyPolicyUrl: `#`,
                  termsOfServiceUrl: `#`,
                  copyrightText: `Your Company or Name, Inc.`,
                },
                socials: [
                  {
                    href: 'https://www.linkedin.com/company/fictionco',
                    target: '_blank',
                    name: 'LinkedIn',
                    icon: `linkedin`,
                  },
                  {
                    href: 'https://github.com/fictionco',
                    target: '_blank',
                    name: 'Github',
                    icon: `github`,
                  },
                  {
                    href: 'https://www.twitter.com/fictionco',
                    target: '_blank',
                    name: 'X',
                    icon: 'x',
                  },

                ],

                badges: [],
              } }),
            ],
          }),
        },
        userConfig: {},
      }
    },

  })
}
