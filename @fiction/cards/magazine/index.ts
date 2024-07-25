import { PostHandlingSchema, safeDirname, vue } from '@fiction/core'
import type { Site } from '@fiction/site'
import { CardTemplate } from '@fiction/site'
import type { SiteUserConfig } from '@fiction/site/schema'
import { staticFileUrls } from '@fiction/site/utils/site'
import { InputOption } from '@fiction/ui'
import { z } from 'zod'

const templateId = 'magazine'

const schema = z.object({
  posts: PostHandlingSchema.optional(),
})

export type UserConfig = z.infer<typeof schema> & SiteUserConfig

const options = [
  new InputOption({ key: 'scheme.reverse', label: 'Reverse Color Scheme', input: 'InputCheckbox' }),
]

async function getDefaultUserConfig(_args: { site: Site }): Promise<UserConfig> {
  return {
    standard: { spacing: { verticalSpacing: 'none' } },
    posts: { mode: 'global', limit: 12 },
  }
}

async function getDemoUserConfig(args: { site: Site }): Promise<UserConfig> {
  const { site } = args

  const filenames = [
    'showcase-adidas.png',
    'showcase-apple.png',
    'showcase-cocacola.png',
    'showcase-disney.png',
    'showcase-google.png',
    'showcase-microsoft.png',
    'showcase-netflix.png',
    'showcase-nike.png',
    'showcase-spotify.png',
    'showcase-starbucks.png',
    'showcase-tesla.png',
    'showcase-amazon.png',
  ] as const
  const urls = staticFileUrls({ site, filenames })

  const c: UserConfig = {
    standard: { spacing: { verticalSpacing: 'sm' } },
    posts: {
      mode: 'inline',
      items: [
        {
          title: 'Revolutionizing UX: My Journey at Tech Giant',
          subTitle: 'From Concept to Launch',
          slug: 'revolutionizing-ux',
          authors: [{ fullName: 'Alex Chen', email: 'alex.chen@example.com' }],
          content: `In my role as Lead UX Designer at one of Silicon Valley's top tech companies, I spearheaded a project that redefined user interaction with AI assistants. This post details the challenges we faced, the innovative solutions we developed, and the impact of our work on millions of users worldwide.`,
          media: { url: urls.showcaseApple, format: 'url' },
          taxonomy: [{ type: 'category', title: 'Design', slug: 'design' }, { type: 'category', title: 'Technology', slug: 'technology' }, { type: 'tag', title: 'UX', slug: 'ux' }],
        },
        {
          title: 'The Future of Sustainable Fashion',
          subTitle: 'My Collaboration with Eco-Friendly Brands',
          slug: 'sustainable-fashion',
          authors: [{ fullName: 'Emma Rodriguez', email: 'emma.rodriguez@example.com' }],
          content: `As a fashion consultant specializing in sustainability, I recently partnered with several leading brands to develop eco-friendly clothing lines. This post explores the innovative materials we used, the challenges of maintaining style while reducing environmental impact, and the consumer response to these groundbreaking collections.`,
          media: { url: urls.showcaseNike, format: 'url' },
          taxonomy: [{ type: 'category', title: 'Design', slug: 'design' }, { type: 'category', title: 'Technology', slug: 'technology' }, { type: 'tag', title: 'Fashion', slug: 'fashion' }],
        },
        {
          title: 'From Startup to IPO: Lessons Learned',
          subTitle: 'A Founder\'s Perspective',
          slug: 'startup-to-ipo',
          authors: [{ fullName: 'Michael Chang', email: 'michael.chang@example.com' }],
          content: `Five years ago, I founded a fintech startup in my garage. Last month, we went public. This post shares the key lessons I learned on this incredible journey, from securing initial funding to scaling the company and navigating the complexities of an IPO.`,
          media: { url: urls.showcaseAmazon, format: 'url' },
        },
        {
          title: 'The Art of Data Storytelling',
          subTitle: 'Making Numbers Speak',
          slug: 'data-storytelling',
          authors: [{ fullName: 'Sarah Johnson', email: 'sarah.johnson@example.com' }],
          content: `As a data scientist, I've learned that numbers alone rarely convince decision-makers. This post delves into the techniques I've developed to turn complex data into compelling narratives, illustrated with case studies from my work with Fortune 500 companies.`,
          taxonomy: [{ type: 'category', title: 'Design', slug: 'design' }, { type: 'category', title: 'Technology', slug: 'technology' }, { type: 'tag', title: 'Fashion', slug: 'fashion' }],

          media: { url: urls.showcaseGoogle, format: 'url' },
        },
        {
          title: 'Redefining Corporate Social Responsibility',
          subTitle: 'My Experience Leading a Global Initiative',
          slug: 'csr-initiative',
          authors: [{ fullName: 'David Nkosi', email: 'david.nkosi@example.com' }],
          content: `In my role as CSR Director for a multinational corporation, I led a groundbreaking initiative that redefined our approach to social responsibility. This post discusses how we aligned our business goals with societal needs, the challenges we overcame, and the measurable impact we achieved across three continents.`,
          media: { url: urls.showcaseStarbucks, format: 'url' },
        },
        {
          title: 'The Future of AI in Healthcare',
          subTitle: 'Revolutionizing Patient Care',
          slug: 'ai-in-healthcare',
          authors: [{ fullName: 'Dr. Elena Rodriguez', email: 'elena.rodriguez@example.com' }],
          content: `As a medical researcher specializing in AI applications, I've witnessed firsthand the transformative power of machine learning in healthcare. This post explores cutting-edge AI technologies that are improving diagnosis accuracy, personalizing treatment plans, and even predicting health crises before they occur. I'll also discuss the ethical considerations and challenges we face as we integrate AI more deeply into patient care.`,
          media: { url: urls.showcaseMicrosoft, format: 'url' },
        },
        {
          title: 'Sustainable Architecture: Building for the Future',
          subTitle: 'Designing Eco-Friendly Skyscrapers',
          slug: 'sustainable-architecture',
          authors: [{ fullName: 'Akira Tanaka', email: 'akira.tanaka@example.com' }],
          content: `In my latest project as lead architect for a revolutionary eco-friendly skyscraper, we pushed the boundaries of sustainable design. This post details our innovative use of recycled materials, integration of vertical gardens, and implementation of AI-driven energy systems. I'll share how we overcame engineering challenges to create a building that not only minimizes its carbon footprint but actually contributes positively to its urban environment.`,
          media: { url: urls.showcaseTesla, format: 'url' },
        },
        {
          title: 'The Psychology of User Experience',
          subTitle: 'Crafting Digital Experiences That Resonate',
          slug: 'psychology-of-ux',
          authors: [{ fullName: 'Maya Patel', email: 'maya.patel@example.com' }],
          content: `As a UX psychologist working with top tech companies, I've discovered that the most effective digital experiences are those that deeply understand human behavior. This post dives into the psychological principles behind successful UX design, from the power of micro-interactions to the impact of color psychology. I'll share case studies of how subtle design changes led to significant improvements in user engagement and satisfaction.`,
          media: { url: urls.showcaseSpotify, format: 'url' },
        },
      ],
    },
  }

  return c
}

export const templates = [
  new CardTemplate({
    root: safeDirname(import.meta.url),
    templateId,
    category: ['posts'],
    description: 'A magazine cards for displaying posts in a grid layout.',
    icon: 'i-tabler-box-padding',
    colorTheme: 'blue',
    el: vue.defineAsyncComponent(async () => import('./ElMagazine.vue')),
    getUserConfig: args => getDefaultUserConfig(args),
    isPublic: false,
    options,
    schema,
    demoPage: async (args) => {
      const demoUserConfig = await getDemoUserConfig(args)
      const defaultUserConfig = await getDefaultUserConfig(args)
      return {
        cards: [
          { templateId, userConfig: demoUserConfig },
          { templateId, userConfig: defaultUserConfig },
        ],
      }
    },
  }),
] as const
