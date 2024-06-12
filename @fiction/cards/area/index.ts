import { colorList, colorTheme, deepMerge, safeDirname, toLabel, vue } from '@fiction/core/index.js'
import { CardTemplate, createCard } from '@fiction/site/index.js'
import { InputOption } from '@fiction/ui/index.js'
import { z } from 'zod'

const SchemeSchema = z.object({
  bg: z.object({
    color: z.string().optional(),
    gradient: z.object({
      angle: z.number().optional(),
      stops: z.array(z.object({
        color: z.string(),
        percent: z.number().optional(),
      })).optional(),
    }).optional(),
  }),
  theme: z.enum(colorTheme).optional(),
  primary: z.enum(colorTheme).optional(),
})

const UserConfigSchema = z.object({
  scheme: z.object({
    reverse: z.boolean().optional(),
    light: SchemeSchema.optional(),
    dark: SchemeSchema.optional(),
  }).optional(),
})

export type UserConfig = z.infer<typeof UserConfigSchema>

const templateId = 'area'

function modeOptions(mode: 'light' | 'dark'): InputOption {
  return new InputOption({ key: `scheme.${mode}`, label: `${toLabel(mode)} Mode`, input: 'group', options: [
    new InputOption({ key: `scheme.${mode}.bg.color`, label: 'Background Color', input: 'InputColor' }),
    new InputOption({ key: `scheme.${mode}.theme`, label: 'Text and Element Color', input: 'InputSelect', props: { list: colorTheme } }),
    new InputOption({ key: `scheme.${mode}.primary`, label: 'Primary Color', input: 'InputSelect', props: { list: colorTheme } }),
    new InputOption({ key: `scheme.${mode}.bg.gradient`, label: 'Background Gradient', input: 'InputGradient' }),
  ] })
}

export const templates = [
  new CardTemplate({
    root: safeDirname(import.meta.url),
    templateId,
    category: ['basic'],
    description: 'container for other elements',
    icon: 'i-tabler-box-padding',
    colorTheme: 'blue',
    el: vue.defineAsyncComponent(() => import('./ElArea.vue')),
    isContainer: true, // ui drawer
    userConfig: {
      spacing: { spacingClass: '' },
    },
    isPublic: true,
    options: [
      new InputOption({ key: 'scheme.reverse', label: 'Flip Color Scheme', description: 'Great for contrast. This will flip the mode to the opposite of the mode for the website (from dark to light or vice versa).', input: 'InputToggle' }),
      modeOptions('light'),
      modeOptions('dark'),
    ],
    schema: UserConfigSchema,
  }),
] as const

export function demo() {
  const heroCard = (reverse?: boolean) => {
    return {
      templateId: 'hero',
      userConfig: {
        heading: `Area ${reverse ? '(Reversed)' : ''}`,
        subHeading: 'Container for other elements',
        mediaItems: [{
          media: { format: 'url', url: 'https://via.placeholder.com/800x400' },
        }],
      },
    }
  }
  const base = {
    scheme: {
      reverse: false,
      light: { bg: { color: '#bfdbfe' }, theme: 'blue' },
      dark: { bg: { color: '#1e3a8a' }, theme: 'blue' },
    },
  } as const
  return createCard({
    slug: `card-${templateId}`,
    cards: [
      createCard({ templateId, templates, userConfig: base, cards: [heroCard()] }),
      createCard({ templateId, templates, userConfig: deepMerge([base, { scheme: { reverse: true } }]), cards: [heroCard(true)] }),
    ],
  })
}
