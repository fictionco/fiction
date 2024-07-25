import { colorTheme, deepMerge, safeDirname, toLabel, vue } from '@fiction/core/index.js'
import { CardTemplate } from '@fiction/site/index.js'
import type { SiteUserConfig } from '@fiction/site/schema'
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

const schema = z.object({
  scheme: z.object({
    reverse: z.boolean().optional(),
    light: SchemeSchema.optional(),
    base: SchemeSchema.optional(),
  }).optional(),
})

export type UserConfig = z.infer<typeof schema>

const templateId = 'area'

function modeOptions(mode: 'light' | 'dark'): InputOption {
  return new InputOption({
    key: `scheme.${mode}`,
    label: `${toLabel(mode)} Mode`,
    input: 'group',
    options: [
      new InputOption({ key: `scheme.${mode}.bg.color`, label: 'Background Color', input: 'InputColor' }),
      new InputOption({ key: `scheme.${mode}.theme`, label: 'Text and Element Color', input: 'InputSelect', props: { list: colorTheme } }),
      new InputOption({ key: `scheme.${mode}.primary`, label: 'Primary Color', input: 'InputSelect', props: { list: colorTheme } }),
      new InputOption({ key: `scheme.${mode}.bg.gradient`, label: 'Background Gradient', input: 'InputGradient' }),
    ],
  })
}

const options = [
  new InputOption({ key: 'scheme.reverse', label: 'Flip Color Scheme', description: 'Great for contrast. This will flip the mode to the opposite of the mode for the website (from dark to light or vice versa).', input: 'InputToggle' }),
  modeOptions('light'),
  modeOptions('dark'),
]

export const templates = [
  new CardTemplate({
    root: safeDirname(import.meta.url),
    templateId,
    category: ['basic'],
    description: 'container for other elements',
    icon: 'i-tabler-box-padding',
    colorTheme: 'blue',
    el: vue.defineAsyncComponent(async () => import('./ElArea.vue')),
    isContainer: true, // ui drawer
    getBaseConfig: () => ({
      standard: { spacing: { verticalSpacing: 'none' } },
    }),
    isPublic: true,
    options,
    schema,
    demoPage: async () => {
      const heroCard = (type: string) => {
        return {
          templateId: 'hero',
          userConfig: {
            heading: `${type} Area`.toUpperCase(),
            subHeading: 'Container for other elements',

          },
        }
      }
      const base: SiteUserConfig = {
        standard: {
          scheme: {
            base: { bg: { bgColor: '#000' }, theme: 'gray', primary: 'blue' },
            light: { bg: { bgColor: '#ffffff' }, theme: 'gray', primary: 'green' },
          },
        },
      } as const

      return {
        cards: [
          { templateId, userConfig: base, cards: [heroCard('default')] },
          { templateId, userConfig: { standard: { scheme: { base: { bg: { bgColor: '#e5f4cc' }, theme: 'blueInverted' as const } } } }, cards: [heroCard('theme invert')] },
          { templateId, userConfig: { standard: { fontStyle: { title: { fontKey: 'Playfair+Display', weight: '400' as const }, body: { fontKey: 'Oswald' } } } }, cards: [heroCard('change font')] },
          { templateId, userConfig: deepMerge([base, { standard: { scheme: { base: {
            bg: {
              format: 'video' as const,
              url: 'https://videos.pexels.com/video-files/3121459/3121459-uhd_2560_1440_24fps.mp4',
              overlay: { color: 'rgba(0,0,0,.7)' },
            },
          } } } }]), cards: [heroCard('video')] },
          { templateId, userConfig: deepMerge([base, { standard: { scheme: { base: {
            bg: {
              format: 'url' as const,
              url: 'https://images.unsplash.com/photo-1508624217470-5ef0f947d8be?q=80&w=3870&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
              overlay: { color: 'paleturquoise', blendMode: 'difference' as const },
            },
          } } } }]), cards: [heroCard('image')] },
          { templateId, userConfig: deepMerge([base, { standard: { scheme: { reverse: true } } }]), cards: [heroCard('reversed')] },
          { templateId, userConfig: deepMerge([base, { standard: { scheme: { base: { bg: { bgColor: 'rgb(26 46 5 / .3)' } } } } }]), cards: [heroCard('bgColor')] },
          { templateId, userConfig: deepMerge([base, {
            standard: {
              scheme: {
                base: {
                  bg: { bgGradient: { angle: 45, stops: [{ color: '#dc2626', percent: 0 }, { color: '#2563eb', percent: 100 }] } },
                },
              },
            },
          }]), cards: [heroCard('gradient')] },
          { templateId, userConfig: deepMerge([base, { standard: { scheme: { base: {
            bg: {
              format: 'video' as const,
              url: 'https://videos.pexels.com/video-files/2762211/2762211-uhd_2560_1440_25fps.mp4',
              overlay: { color: 'rgba(0,0,0,.7)' },
            },
          } }, spacing: { verticalSpacing: 'full' as const } } }]), cards: [
            heroCard('sizing'),
            { templateId: 'faq', userConfig: {
              heading: 'Treasure Hunting Services',
              items: [
                { name: 'Expedition Planning', desc: 'Comprehensive planning and logistics for successful treasure hunting expeditions.' },
              ],
            } },
          ] },
        ],
      }
    },
  }),
] as const
