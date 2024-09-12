import { vue } from '@fiction/core'
import { cardTemplate } from '@fiction/site'
import { InputOption } from '@fiction/ui'
import { stockMediaHandler } from '@fiction/ui/stock/index.js'
import { z } from 'zod'

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
      format: z.enum(['url', 'image', 'video']).optional(),
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
    new InputOption({ key: 'media', input: 'InputMedia', label: 'Media', props: { formats: { url: true } } }),
    new InputOption({ key: 'social', input: 'InputList', label: 'Social', options: [
      new InputOption({ key: 'name', input: 'InputText', label: 'Name' }),
      new InputOption({ key: 'href', input: 'InputText', label: 'Link' }),
      new InputOption({ key: 'icon', input: 'InputText', label: 'Icon' }),
    ] }),
  ] }),
]

const el = vue.defineAsyncComponent(async () => import('./ElCard.vue'))

async function defaultConfig(): Promise<UserConfig> {
  return {
    heading: 'Advisors',
    subHeading: 'When the world needs saving, these are the people you want on your side.',
    profiles: [{
      name: 'Tony Stark',
      title: 'Iron Man',
      desc: 'Genius, billionaire, playboy, philanthropist. Known for his high-tech suits and saving the world.',
      media: stockMediaHandler.getRandomByTags(['person', 'aspect:landscape', 'man']),
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
      media: stockMediaHandler.getRandomByTags(['person', 'aspect:landscape', 'woman']),
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
      media: stockMediaHandler.getRandomByTags(['person', 'aspect:landscape', 'man']),
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
      media: stockMediaHandler.getRandomByTags(['person', 'aspect:landscape', 'man']),
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
  cardTemplate({
    templateId,
    category: ['advanced'],
    description: 'Showcase profiles with images and social links.',
    icon: 'i-tabler-users',
    colorTheme: 'orange',
    el,
    options,
    schema,
    isPublic: true,
    getUserConfig: () => defaultConfig(),
    demoPage: async () => {
      const userConfig = await defaultConfig()
      return {
        cards: [
          { templateId, userConfig },
        ],
      }
    },
  }),
] as const
