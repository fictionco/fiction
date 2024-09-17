import { colorTheme, MediaBasicSchema, MediaIconSchema, vue, XButtonSchema } from '@fiction/core'
import { cardTemplate } from '@fiction/site'
import { InputOption } from '@fiction/ui'
import { stockMediaHandler } from '@fiction/ui/stock/index.js'
import { z } from 'zod'

const templateId = 'hero'

const defaultContent: UserConfig = {
  heading: 'Short Catchy Heading',
  subHeading: 'Description of the heading. Typically a sentence or two.',
  superHeading: 'Category or Tagline',
  actions: [],
}

const LayerMediaScheme = z.object({
  media: z.object({ url: z.string().optional() }).optional(),
  opacity: z.number().optional(),
  position: z.enum(['top', 'bottom', 'left', 'right', 'center', 'bottomRight', 'topRight', 'bottomLeft', 'topLeft']).optional(),
  widthPercent: z.number().optional(),
})

export const schema = z.object({
  layout: z.enum(['justify', 'center', 'left', 'right']).optional().describe('Alignment style of text and images'),
  heading: z.string().optional().describe('Primary hero headline, 3 to 13 words [AI]'),
  subHeading: z.string().optional().describe('Secondary hero headline, 10 to 30 words [AI]'),
  superHeading: z.string().optional().describe('Shorter badge above headline, 2 to 5 words [AI]'),
  superIcon: MediaIconSchema.optional().describe('Icon for the super heading [AI]'),
  superColor: z.enum(colorTheme).optional().describe('change color of super heading'),
  splash: MediaBasicSchema.optional().describe('Splash picture for hero [TIME:40000]').refine(_ => true, { params: { time: 40 } }),
  caption: z.string().optional().describe('Caption for the splash image'),
  actions: z.array(XButtonSchema).optional().describe('List of link buttons'),
  overlays: z.array(LayerMediaScheme).optional().describe('Overlays to be placed on top of the splash image'),
})

export type UserConfig = z.infer<typeof schema>
export type OverlayConfig = z.infer<typeof LayerMediaScheme>

export const options: InputOption[] = [
  new InputOption({ key: 'heading', input: 'InputText', label: 'Heading' }),
  new InputOption({ key: 'subHeading', input: 'InputTextarea', label: 'Sub Heading' }),
  new InputOption({ key: 'superHeading', input: 'InputTextarea', label: 'Super Heading' }),
  new InputOption({ key: 'superColor', input: 'InputSelect', label: 'Super Color', props: { list: colorTheme } }),
  new InputOption({ key: 'superIcon', input: 'InputIcon', label: 'Super Icon' }),
  new InputOption({ key: 'layout', input: 'InputSelect', label: 'Layout', props: { list: ['justify', 'center', 'left', 'right'] } }),
  new InputOption({ key: 'actions', input: 'InputActions', label: 'Buttons' }),
  new InputOption({ key: 'splash', input: 'InputMedia', label: 'Splash Image', props: { formats: { url: true } } }),
  new InputOption({ key: 'caption', input: 'InputText', label: 'Splash Caption' }),
  new InputOption({ key: 'overlays', input: 'InputList', label: 'Overlays', options: [
    new InputOption({ key: 'media', label: 'Image', input: 'InputMedia', props: { formats: { url: true } } }),
    new InputOption({ key: 'opacity', label: 'Opacity', input: 'InputNumber' }),
    new InputOption({ key: 'position', label: 'Position', input: 'InputSelect', list: ['top', 'bottom', 'left', 'right', 'center', 'bottomRight', 'topRight', 'bottomLeft', 'topLeft'] as const }),
    new InputOption({ key: 'widthPercent', label: 'Width Percent', input: 'InputRange', props: { min: 10, max: 100 } }),
  ] }),
]

export const templates = [
  cardTemplate({
    templateId,
    category: ['basic'],
    isPublic: true,
    description: 'standard hero section',
    icon: 'i-tabler-layout-bottombar-collapse-filled',
    colorTheme: 'orange',
    el: vue.defineAsyncComponent(async () => import('./ElHero.vue')),
    options,
    getUserConfig: () => defaultContent,
    schema,
    demoPage: async () => {
      const splash = (aspect: 'aspect:square' | 'aspect:portrait' = 'aspect:square') => stockMediaHandler.getRandomByTags(['object', aspect])
      const subHeading = 'lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'

      return {
        cards: [
          { templateId, userConfig: { ...defaultContent, justify: 'center' as const } },
          { templateId, userConfig: { ...defaultContent, layout: 'justify' as const, splash: splash(), superColor: 'purple' as const } },
          { templateId, userConfig: { ...defaultContent, layout: 'right' as const, splash: splash('aspect:portrait'), subHeading, superColor: 'red' as const } },
          { templateId, userConfig: { ...defaultContent, layout: 'left' as const, splash: splash('aspect:portrait'), subHeading, superColor: 'indigo' as const } },
        ],
      }
    },
  }),
] as const
