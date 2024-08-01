import type { FictionEnv } from '@fiction/core'
import { safeDirname } from '@fiction/core'
import { Theme } from '@fiction/site/theme.js'
import { getCardTemplates } from '@fiction/cards/index.js'
import type { Site } from '@fiction/site/site.js'
import { CardFactory } from '@fiction/site/cardFactory.js'

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
          userConfig: {
            autoSlide: false,
            items: [
              {
                title: 'Alison Groves',
                subTitle: 'Author and Speaker',
                textBlend: 'difference',
                media: {
                  format: 'url',
                  url: 'https://imagedelivery.net/mxykd8B2Zc6Xxmx1NDi9mA/127b8426-2dd5-44a2-c8d2-8a8108f5be00/public',
                },
              },
              {
                title: 'Illuminate Your Insight',
                subTitle: 'Get My Latest Book',
                textBlend: 'difference',
                media: {
                  format: 'url',
                  url: 'https://imagedelivery.net/mxykd8B2Zc6Xxmx1NDi9mA/93a8b4f1-9308-49f2-ffe4-70ddc5d6be00/public',
                },
                mediaBackground: {
                  format: 'url',
                  url: 'https://images.unsplash.com/photo-1527219002998-9e1b7ebedcb5?q=80&w=4140&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
                },
              },
              {
                title: 'Upcoming Event',
                subTitle: 'Speaking at Global Leadership Summit',
                textBlend: 'difference',
                media: {
                  format: 'url',
                  url: 'https://imagedelivery.net/mxykd8B2Zc6Xxmx1NDi9mA/c947ab53-e0b2-43fb-5fbd-8c5a970eba00/public',
                  modify: { flip: 'horizontal' },
                },
              },
              {
                title: 'Design Your Future',
                subTitle: 'Join My Coaching Program',
                textBlend: 'difference',
                media: {
                  format: 'url',
                  url: 'https://imagedelivery.net/mxykd8B2Zc6Xxmx1NDi9mA/720a3e2b-605b-4a1c-1623-2ff55eaff300/public',

                },
              },
            ],
          },
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
              spacing: {
                verticalSpacing: 'sm',
              },

            },
            superColor: 'primary',
            superIcon: 'i-tabler-bulb',
            superHeading: 'Empowering Leaders to Thrive',
            heading: 'Unlock Your Leadership Potential',
            subHeading: 'Transform your career and organization with personalized coaching that drives real results.',
            items: [
              { name: 'Executive Coaching', desc: 'One-on-one sessions to enhance your leadership skills and overcome challenges.', icon: 'i-tabler-user-circle', color: 'primary' },
              { name: 'Team Development', desc: 'Build high-performing teams through targeted workshops and ongoing support.', icon: 'i-tabler-users', color: 'primary' },
              { name: 'Career Transitions', desc: 'Navigate career changes confidently with strategic guidance and actionable plans.', icon: 'i-tabler-route', color: 'primary' },
              { name: 'Leadership Assessments', desc: 'Gain insights into your strengths and growth areas with comprehensive evaluations.', icon: 'i-tabler-chart-dots', color: 'primary' },
              { name: 'Speaking Engagements', desc: 'Inspire and educate your organization with tailored keynotes and workshops.', icon: 'i-tabler-presentation', color: 'primary' },
              { name: 'Leadership Resources', desc: 'Access a curated library of tools and articles to support your ongoing development.', icon: 'i-tabler-book', color: 'primary' },
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
              { text: 'Turn vision into reality', outline: true, speed: 20 },
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
                media: {
                  format: 'url',
                  url: 'https://imagedelivery.net/mxykd8B2Zc6Xxmx1NDi9mA/427b9144-ab8a-4b83-1454-f21a2ef50f00/public',
                },
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
                media: {
                  format: 'url',
                  url: 'https://imagedelivery.net/mxykd8B2Zc6Xxmx1NDi9mA/d4024c64-e35e-4e50-7b21-7b46c6ee4200/public',
                },
              },
              {
                title: 'Team Alignment Mastery',
                subTitle: 'Turning Conflict into Collaboration',
                content: '<p>A tech startup\'s leadership team was struggling with communication and alignment. Through targeted workshops and individual coaching, we transformed their dynamics. The result? A 50% reduction in project delays and a culture of open, constructive dialogue.</p><p>This success story highlights how addressing team dynamics can lead to tangible business outcomes, showcasing the power of cohesive leadership.</p>',
                media: {
                  format: 'url',
                  url: 'https://imagedelivery.net/mxykd8B2Zc6Xxmx1NDi9mA/b04367ad-89a6-453e-24ce-ab18d496d000/public',
                },
              },
              {
                title: 'Career Transition Triumph',
                subTitle: 'Navigating Change with Confidence',
                content: '<p>John, a mid-career professional, sought guidance in transitioning to a leadership role in a new industry. Our coaching partnership focused on transferable skills and strategic networking. Within three months, John secured a senior position, confidently leading a team in his desired field.</p><p>This case demonstrates the impact of targeted coaching in navigating significant career shifts, empowering professionals to embrace new challenges.</p>',
                media: {
                  format: 'url',
                  url: 'https://imagedelivery.net/mxykd8B2Zc6Xxmx1NDi9mA/03388d7c-762b-4593-e32e-ccec53b39400/public',
                },
              },
              {
                title: 'Organizational Culture Shift',
                subTitle: 'From Stagnation to Innovation',
                content: '<p>A large corporation was struggling with an outdated, hierarchical culture. Through a comprehensive leadership development program, we empowered managers at all levels to foster innovation and employee engagement. The result was a 30% increase in employee satisfaction and a surge in innovative projects.</p><p>This transformation illustrates how leadership coaching can catalyze organization-wide change, driving both employee satisfaction and business innovation.</p>',
                media: {
                  format: 'url',
                  url: 'https://imagedelivery.net/mxykd8B2Zc6Xxmx1NDi9mA/ec9cdb82-e611-4299-9e8e-1784b308aa00/public',
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
