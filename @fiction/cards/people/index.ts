import { vue } from '@fiction/core'
import type { Site } from '@fiction/site'
import { CardTemplate } from '@fiction/site'
import { z } from 'zod'
import { InputOption } from '@fiction/ui'
import { staticFileUrls } from '@fiction/site/utils/site'

const templateId = 'people'

const schema = z.object({
  layout: z.enum(['mediabox', 'grid']).optional(),
  heading: z.string().optional(),
  subHeading: z.string().optional(),
  superHeading: z.string().optional(),
  profiles: z.array(z.object({
    name: z.string().optional(),
    desc: z.string().optional(),
    title: z.string().optional(),
    media: z.object({
      format: z.enum(['url']),
      url: z.string(),
    }).optional(),
    social: z.array(z.object({
      name: z.string().optional(),
      icon: z.string().optional(),
      href: z.string().optional(),
    })).optional(),
  })).optional(),
})

export type UserConfig = z.infer<typeof schema>

const options: InputOption[] = [
  new InputOption({ key: 'layout', input: 'InputSelect', label: 'Layout', list: ['mediabox', 'grid'] }),
  new InputOption({ key: 'heading', input: 'InputText', label: 'Heading' }),
  new InputOption({ key: 'subHeading', input: 'InputText', label: 'Sub Heading' }),
  new InputOption({ key: 'superHeading', input: 'InputText', label: 'Super Heading' }),
  new InputOption({ key: 'profiles', input: 'InputList', label: 'Profiles', options: [
    new InputOption({ key: 'name', input: 'InputText', label: 'Name' }),
    new InputOption({ key: 'title', input: 'InputText', label: 'Title' }),
    new InputOption({ key: 'desc', input: 'InputText', label: 'Description' }),
    new InputOption({ key: 'media', input: 'InputMediaDisplay', label: 'Media', props: { formats: { url: true } } }),
    new InputOption({ key: 'social', input: 'InputList', label: 'Social', options: [
      new InputOption({ key: 'name', input: 'InputText', label: 'Name' }),
      new InputOption({ key: 'href', input: 'InputText', label: 'Link' }),
      new InputOption({ key: 'icon', input: 'InputText', label: 'Icon' }),
    ] }),
  ] }),
]

const el = vue.defineAsyncComponent(async () => import('./ElCard.vue'))

async function defaultConfig(args: { site?: Site }): Promise<UserConfig> {
  const { site } = args

  if (!site) {
    throw new Error('Card must have a site to get form templates')
  }

  const filenames = [
    'people-tony.png',
    'people-natasha.png',
    'people-thor.png',
    'people-steve.png',
  ] as const

  const urls = staticFileUrls({ site, filenames })

  return {
    heading: 'Advisors',
    subHeading: 'When the world needs saving, these are the people you want on your side.',
    profiles: [{
      name: 'Tony Stark',
      title: 'Iron Man',
      desc: 'Genius, billionaire, playboy, philanthropist. Known for his high-tech suits and saving the world.',
      media: { format: 'url' as const, url: urls.peopleTony },
      social: [{
        icon: 'i-tabler-brand-linkedin',
        href: 'https://www.linkedin.com/in/[username]',
      }, {
        icon: 'i-tabler-brand-x',
        href: 'https://www.x.com/[username]',
      }],
    }, {
      name: 'Natasha Romanoff',
      title: 'Black Widow',
      desc: 'Master spy and expert in hand-to-hand combat. A critical member of the Avengers team.',
      media: { format: 'url' as const, url: urls.peopleNatasha },
      social: [{
        icon: 'i-tabler-brand-linkedin',
        href: 'https://www.linkedin.com/in/[username]',
      }, {
        icon: 'i-tabler-brand-x',
        href: 'https://www.x.com/[username]',
      }],
    }, {
      name: 'Thor Odinson',
      title: 'God of Thunder',
      desc: 'Asgardian prince with the power to control lightning and wield Mjölnir, his magical hammer.',
      media: { format: 'url' as const, url: urls.peopleThor },
      social: [{
        icon: 'i-tabler-brand-linkedin',
        href: 'https://www.linkedin.com/in/[username]',
      }, {
        icon: 'i-tabler-brand-x',
        href: 'https://www.x.com/[username]',
      }],
    }, {
      name: 'Steve Rogers',
      title: 'Captain America',
      desc: 'The First Avenger. Known for his unwavering moral compass, super strength, and indestructible shield.',
      media: { format: 'url' as const, url: urls.peopleSteve },
      social: [{
        icon: 'i-tabler-brand-linkedin',
        href: 'https://www.linkedin.com/in/[username]',
      }, {
        icon: 'i-tabler-brand-x',
        href: 'https://www.x.com/[username]',
      }],
    }],
  }
}

export const templates = [
  new CardTemplate({
    templateId,
    category: ['advanced'],
    description: 'Showcase profiles with images and social links.',
    icon: 'i-tabler-users',
    colorTheme: 'orange',
    el,
    options,
    schema,
    isPublic: true,
    getUserConfig: _ => defaultConfig(_),
    demoPage: async (args) => {
      const userConfig = await defaultConfig(args)
      return {
        cards: [
          { templateId, userConfig },
        ],
      }
    },
  }),
] as const
