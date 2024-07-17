import type { PostItem } from '@fiction/core'
import { vue } from '@fiction/core'
import { CardTemplate } from '@fiction/site'
import { z } from 'zod'
import { InputOption } from '@fiction/ui'
import { standardOption } from '../inputSets'

const el = vue.defineAsyncComponent(async () => import('./ElShowcase.vue'))
const aspects = ['square', 'tall', 'wide', 'golden', 'portrait', 'landscape', 'cinema'] as const
const gridCols = ['1', '2', '3', '4', '5'] as const
const UserConfigSchema = z.object({
  items: z.array(z.object({
    content: z.string().optional(),
    title: z.string().optional(),
    subTitle: z.string().optional(),
    superTitle: z.string().optional(),
    media: z.object({
      format: z.enum(['url', 'html', 'video']).optional(),
      url: z.string().optional(),
      html: z.string().optional(),
    }),
  }) as z.Schema<PostItem>).optional(),
  aspect: z.enum(aspects).optional().describe('Image aspect ratio'),
  gridColsMax: z.enum(gridCols).optional().describe('Max number of columns in the grid on large screen'),
  gridColsMin: z.enum(['1', '2']).optional().describe('Min number of columns in the grid on small screen'),
})

export type UserConfig = z.infer<typeof UserConfigSchema>

export const defaultMediaItems: PostItem[] = [
  {
    title: 'Inception',
    subTitle: 'Dream within a dream',
    content: 'A mind-bending heist film exploring the depths of the subconscious.',
    media: { format: 'url', url: 'https://images.unsplash.com/photo-1500462918059-b1a0cb512f1d?q=80&w=3270&auto=format&fit=crop' },
  },
  {
    title: 'The Dark Knight Trilogy',
    subTitle: 'Redefining superhero cinema',
    media: { format: 'url', url: 'https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?q=80&w=3270&auto=format&fit=crop' },
  },
  {
    title: 'Interstellar',
    subTitle: 'Love transcends time and space',
    media: { format: 'url', url: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?q=80&w=3213&auto=format&fit=crop' },
  },
  {
    title: 'Dunkirk',
    subTitle: 'Survival is victory',
    media: { format: 'url', url: 'https://images.unsplash.com/photo-1563804951831-49844db19644?q=80&w=2895&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
  },
  {
    title: 'Memento',
    subTitle: 'The beginning is the end',
    media: { format: 'url', url: 'https://images.unsplash.com/photo-1527600478564-488952effedb?q=80&w=3270&auto=format&fit=crop' },
  },
  {
    title: 'Tenet',
    subTitle: 'Time inversion thriller',
    media: { format: 'url', url: 'https://images.unsplash.com/photo-1501139083538-0139583c060f?q=80&w=3270&auto=format&fit=crop' },
  },
  {
    title: 'The Prestige',
    subTitle: 'Are you watching closely?',
    media: { format: 'url', url: 'https://images.unsplash.com/photo-1503095396549-807759245b35?q=80&w=3271&auto=format&fit=crop' },
  },
  {
    title: 'Oppenheimer',
    subTitle: 'The man who moved the Earth',
    media: { format: 'url', url: 'https://cdn.pixabay.com/photo/2017/08/10/10/51/atomic-bomb-2621291_1280.jpg' },
  },
  {
    title: 'Insomnia',
    subTitle: 'A waking nightmare',
    media: { format: 'url', url: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=3270&auto=format&fit=crop' },
  },
  {
    title: 'Batman Begins',
    subTitle: 'Fear becomes your enemy',
    media: { format: 'url', url: 'https://images.unsplash.com/photo-1531259683007-016a7b628fc3?q=80&w=3270&auto=format&fit=crop' },
  },
  {
    title: 'The Dark Knight Rises',
    subTitle: 'The legend ends',
    media: { format: 'url', url: 'https://cdn.pixabay.com/photo/2020/05/18/08/05/new-york-5185104_1280.jpg' },
  },
  {
    title: 'Following',
    subTitle: 'Where it all began',
    media: { format: 'url', url: 'https://images.unsplash.com/photo-1504275107627-0c2ba7a43dba?q=80&w=3274&auto=format&fit=crop' },
  },
]
const templateId = 'showcase'
const template = new CardTemplate({
  templateId,
  category: ['portfolio'],
  description: 'Showcase grid of items with popup details',
  icon: 'i-tabler-carousel-horizontal',
  colorTheme: 'pink',
  isPublic: true,
  el,
  options: [
    standardOption.postItems({ key: 'items', label: 'Showcase Items' }),
    new InputOption({ key: 'aspect', label: 'Image Aspect', input: 'InputSelect', list: aspects, default: () => 'golden' }),
    new InputOption({ key: 'gridColsMax', label: 'Max Grid Columns', input: 'InputSelect', list: gridCols, default: () => '4' }),
    new InputOption({ key: 'gridColsMin', label: 'Min Grid Columns', input: 'InputSelect', list: ['1', '2'], default: () => '1' }),
  ],
  userConfig: { items: defaultMediaItems, aspect: 'golden', gridColsMax: '4' },
  schema: UserConfigSchema,
  demoPage: async () => {
    return { cards: [{ templateId, userConfig: { items: defaultMediaItems } }] }
  },
})

export const templates = [template] as const
