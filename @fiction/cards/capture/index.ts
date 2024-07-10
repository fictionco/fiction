import { safeDirname, vue } from '@fiction/core'
import { CardTemplate } from '@fiction/site'
import { InputOption } from '@fiction/ui'
import { z } from 'zod'
import { mediaSchema } from '../schemaSets'
import { standardOption } from '../inputSets.js'

const UserConfigSchema = z.object({
  superHeading: z.string().describe('Social proof Metric or KPI for the newsletter, e.g. "22,300+ subscribers"').optional(),
  heading: z.string().describe('Newsletter hook header 5 words or so').optional(),
  subHeading: z.string().describe('Specific benefits of subscribing').optional(),
  media: mediaSchema,
  presentationMode: z.enum(['inline', 'onScroll', 'onLoad']).optional(),
  dismissText: z.string().optional().describe('Dismisses modal in load and modal modes'),
  buttonText: z.string().optional().describe('Text on the subscribe button'),
  thanksText: z.string().optional().describe('Text on the thank you message'),
})

export type UserConfig = z.infer<typeof UserConfigSchema>

const templateId = 'capture'

const demoUserConfig = {
  superHeading: 'Social Proof or Metric Here',
  heading: 'Get the [Free Resource]',
  subHeading: `Some information about your email updates. What's in it for the subscriber?`,
  media: {
    html: `<svg viewBox="0 0 169 40" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M10.0148 2.5V40H0V2.5H10.0148Z" fill="currentColor"></path>
<path fill-rule="evenodd" clip-rule="evenodd" d="M15.0222 2.5H36.3037C43.2175 2.5 48.8222 8.09644 48.8222 15C48.8222 21.9036 43.2175 27.5 36.3037 27.5H25.037V40H15.0222V2.5ZM25.037 17.5H36.3037C37.6865 17.5 38.8074 16.3807 38.8074 15C38.8074 13.6193 37.6865 12.5 36.3037 12.5H25.037V17.5Z" fill="currentColor"></path>
<path fill-rule="evenodd" clip-rule="evenodd" d="M86.3778 2.5V21.875C86.3778 26.3623 90.0208 30 94.5148 30C99.0088 30 102.652 26.3623 102.652 21.875V2.5H112.667V21.875C112.667 31.8852 104.54 40 94.5148 40C84.4898 40 76.363 31.8852 76.363 21.875V2.5H86.3778Z" fill="currentColor"></path>
<path fill-rule="evenodd" clip-rule="evenodd" d="M52.5778 20C52.5778 10.335 60.4244 2.5 70.1037 2.5H72.6074V12.5H70.1037C65.9554 12.5 62.5926 15.8579 62.5926 20V21.25C62.5926 31.6053 54.1855 40 43.8148 40H42.563V30H43.8148C48.6545 30 52.5778 26.0825 52.5778 21.25V20Z" fill="currentColor"></path>
<path d="M169 3.75C169 5.82107 167.319 7.5 165.244 7.5C163.17 7.5 161.489 5.82107 161.489 3.75C161.489 1.67893 163.17 0 165.244 0C167.319 0 169 1.67893 169 3.75Z" fill="currentColor"></path>
<path d="M123.42 40L128.199 20.0181L131.752 32.0393C133.87 39.2091 144.041 39.2091 146.16 32.0393L149.712 20.0181L154.491 40H164.787L157.273 8.57949C155.486 1.10744 144.941 0.830781 142.763 8.19891L138.956 21.0833L135.148 8.19892C132.971 0.830824 122.425 1.1074 120.638 8.57948L113.124 40H123.42Z" fill="currentColor"></path>
</svg>`,
    format: 'html',
  },
  dismissText: 'No thanks',
  buttonText: 'Subscribe',
  thanksText: 'Thanks for subscribing!',
} as const

const options = [
  new InputOption({ key: 'presentationMode', label: 'Presentation Mode', input: 'InputSelect', list: ['inline', 'onScroll', 'onLoad'], description: 'Show the card inline with content as a popup on load, or when scrolling.' }),
  standardOption.headers(),
  new InputOption({ key: 'media', label: 'Image', input: 'InputMediaDisplay' }),
  new InputOption({ key: 'dismissText', label: 'Dismiss Text', input: 'InputText', placeholder: 'No thanks', description: 'Dismisses modal in load and modal modes' }),
  new InputOption({ key: 'buttonText', label: 'Button Text', input: 'InputText', placeholder: 'Subscribe', description: 'Text on the subscribe button' }),
  new InputOption({ key: 'thanksText', label: 'Thanks Text', input: 'InputText', placeholder: 'Thanks for subscribing!', description: 'Text on the thank you message' }),
]

export const templates = [
  new CardTemplate({
    root: safeDirname(import.meta.url),
    templateId: 'demoProse',
    el: vue.defineAsyncComponent(async () => import('./DemoProse.vue')),
    isPublic: false,
  }),
  new CardTemplate({
    root: safeDirname(import.meta.url),
    templateId,
    title: 'Capture',
    category: ['marketing'],
    description: 'Convert visitors into subscribers with a simple email capture form.',
    icon: 'i-tabler-mail',
    colorTheme: 'blue',
    el: vue.defineAsyncComponent(async () => import('./ElCard.vue')),
    userConfig: {
      superHeading: 'Metric or Social Proof Here',
      heading: 'Get a [Free Resource]', // email magnet
      subHeading: 'Add benefits of subscribing here, free resources, etc. Avoid cliches like "stay up to date"',
      dismissText: 'No thanks',
    },
    isPublic: true,
    options,
    schema: UserConfigSchema,
    demoPage: async () => {
      return {
        cards: [
          { templateId, userConfig: { presentationMode: 'inline' as const, ...demoUserConfig } },
          { templateId: 'demoProse' },
          { templateId, userConfig: { presentationMode: 'onLoad' as const, ...demoUserConfig } },
          { templateId, userConfig: { presentationMode: 'onScroll' as const, ...demoUserConfig } },
        ],
      }
    },
  }),
] as const
