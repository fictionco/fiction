import type { FictionEnv } from '@fiction/core'
import { safeDirname } from '@fiction/core'
import { Theme } from '@fiction/site/theme.js'
import { getCardTemplates } from '@fiction/cards/index.js'
import type { Site } from '@fiction/site/site.js'
import { CardFactory } from '@fiction/site/cardFactory.js'
import { stockMediaHandler } from '@fiction/cards/stock/index.js'

async function getTemplates() {
  const t = await getCardTemplates()
  const templates = [...t] as const

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
          userConfig: { },
        }),
        await factory.create({
          templateId: 'features',
          baseConfig: {
            standard: {
              spacing: {
                verticalSpacing: 'sm',
              },
            },
          },
          userConfig: {
            standard: {
              spacing: { verticalSpacing: 'sm' },
            },
            superColor: 'primary',
            superIcon: 'i-tabler-bulb',
            superHeading: 'General Topic',
            heading: 'Catchy Heading or Title',
            subHeading: 'A bit more information, keep it short and sweet or people will not read it.',
            items: [
              { name: 'Benefit A', desc: 'A bit more information, keep it short and sweet or people will not read it.', icon: 'i-tabler-user-circle', color: 'primary' },
              { name: 'Benefit B', desc: 'A bit more information, keep it short and sweet or people will not read it.', icon: 'i-tabler-users', color: 'primary' },
              { name: 'Benefit C', desc: 'A bit more information, keep it short and sweet or people will not read it.', icon: 'i-tabler-route', color: 'primary' },
            ],
          },
        }),
        await factory.create({
          templateId: 'ticker',
          userConfig: {
            standard: {
              spacing: {
                verticalSpacing: 'sm',
              },
            },
            items: [
              { text: 'Your Motto or Tagline', outline: true, speed: 20 },
            ],
          },
        }),
        await factory.create({
          templateId: 'story',
          userConfig: {
            items: [
              {
                title: 'Welcome from Alison Groves, Your Leadership Coach',
                content: `
  <p>I'm Alison Groves, a dedicated leadership coach committed to your professional growth.</p>
  <p>Welcome to my website, where transformation meets actionable strategy.</p>
  <p>I believe in unlocking potential through personalized coaching. "Leadership is not about being in charge. It's about taking care of those in your charge," as I often remind my clients.</p>
  <p>Explore how we can work together to elevate your leadership skills and drive meaningful change in your organization.</p>
                `,
                media: stockMediaHandler.getRandomByTags(['person', 'aspect:square', 'headshot', 'silhouette']),
              },
            ],
          },
        }),
        await factory.create({
          templateId: 'showcase',
          userConfig: {
            standard: {
              headers: {
                layout: 'left',
                size: 'md',
                superTitle: 'Client Success Stories',
                title: 'Transformative Results',
                subTitle: 'Real-world impact from our coaching partnerships',
              },
            },
            aspect: 'tall',
            items: [
              {
                title: 'Executive Breakthrough',
                subTitle: 'From Overwhelmed to Empowered',
                content: '<p>Working with Sarah, a C-suite executive facing burnout, we developed strategies to enhance work-life balance and improve team delegation. Within six months, Sarah reported a 40% increase in productivity and a significant boost in job satisfaction.</p><p>This transformation not only revitalized Sarah\'s career but also positively impacted her entire organization, demonstrating the far-reaching effects of effective leadership coaching.</p>',
                media: stockMediaHandler.getRandomByTags(['aspect:portrait', 'object']),
              },
              {
                title: 'Team Alignment Mastery',
                subTitle: 'Turning Conflict into Collaboration',
                content: '<p>A tech startup\'s leadership team was struggling with communication and alignment. Through targeted workshops and individual coaching, we transformed their dynamics. The result? A 50% reduction in project delays and a culture of open, constructive dialogue.</p><p>This success story highlights how addressing team dynamics can lead to tangible business outcomes, showcasing the power of cohesive leadership.</p>',
                media: stockMediaHandler.getRandomByTags(['aspect:portrait', 'object']),
              },
              {
                title: 'Career Transition Triumph',
                subTitle: 'Navigating Change with Confidence',
                content: '<p>John, a mid-career professional, sought guidance in transitioning to a leadership role in a new industry. Our coaching partnership focused on transferable skills and strategic networking. Within three months, John secured a senior position, confidently leading a team in his desired field.</p><p>This case demonstrates the impact of targeted coaching in navigating significant career shifts, empowering professionals to embrace new challenges.</p>',
                media: stockMediaHandler.getRandomByTags(['aspect:portrait', 'object']),
              },
              {
                title: 'Organizational Culture Shift',
                subTitle: 'From Stagnation to Innovation',
                content: '<p>A large corporation was struggling with an outdated, hierarchical culture. Through a comprehensive leadership development program, we empowered managers at all levels to foster innovation and employee engagement. The result was a 30% increase in employee satisfaction and a surge in innovative projects.</p><p>This transformation illustrates how leadership coaching can catalyze organization-wide change, driving both employee satisfaction and business innovation.</p>',
                media: stockMediaHandler.getRandomByTags(['aspect:portrait', 'object']),
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
            superHeading: 'Alison Groves',
            heading: 'I Solve Leadership Challenges for People and Organizations',
            subHeading: `<p>I am a leadership coach, organizational consultant, and keynote speaker. With over 15 years of experience in corporate leadership and executive coaching, I specialize in empowering leaders to unlock their full potential and drive organizational success.</p>
<p>Based in New York, I've had the privilege of working with Fortune 500 executives, startup founders, and non-profit leaders across diverse industries. My approach combines evidence-based strategies with personalized insights to create transformative leadership experiences. I hold certifications in [relevant certifications, e.g., ICF PCC, CPCC] and am a frequent contributor to leading business publications on leadership development.</p>`,
            mediaItems: [
              {
                media: {
                  format: 'url',
                  url: 'https://imagedelivery.net/mxykd8B2Zc6Xxmx1NDi9mA/2a9591f6-8529-4ba1-3ebb-7323e12e9b00/public',
                },
              },
              {
                media: {
                  format: 'url',
                  url: 'https://imagedelivery.net/mxykd8B2Zc6Xxmx1NDi9mA/4f5fbd75-ce12-4135-94c6-d18473410500/public',
                },
              },
            ],
            detailsTitle: 'Let\'s Connect',
            details: [
              { name: 'Location', desc: 'Somewhere, USA' },
              { name: 'Email', desc: 'hello@mywebsite.com', href: 'mailto:hello@example.com' },
              { name: 'Phone', desc: '123-456-7890' },
            ],
            socials: [
              { name: '@handle on facebook', href: '#', icon: 'facebook' },
              { name: '@handle on x', href: '#', icon: 'x' },
              { name: '@handle on linkedin', href: '#', icon: 'linkedin' },
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
                logo: { html: `Alison Groves`, format: 'html' },
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
        userConfig: {
          standard: {
            scheme: { base: { primary: 'yellow' } },
          },
        },
      }
    },

  })
}
