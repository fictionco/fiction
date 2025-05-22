import type { CardFactory } from '@fiction/site/cardFactory'
import type { StandardUserConfig } from '@fiction/site/schema'
import { MediaSchema } from '@fiction/core'
import { createOption } from '@fiction/ui'
import { z } from 'zod/v4'

const pointSchema = z.object({
  content: z.string().optional().meta({ ai: true, description: 'Point text or description' }),
})

export const schema = z.object({
  layout: z.enum(['default', 'left', 'right']).optional().meta({ ai: false, description: 'Content arrangement' }),
  title: z.string().optional().meta({ ai: true, description: 'Section headline' }),
  media: MediaSchema.optional().meta({ ai: true, description: 'Visual illustration' }),
  items: z.array(pointSchema).optional().meta({ ai: true, description: 'List of points/steps' }),
})

export type UserConfig = z.infer<typeof schema> & StandardUserConfig
type PointConfig = z.infer<typeof pointSchema>

// Input options configuration remains the same
function getOptions() {
  return [
    createOption({
      input: 'group',
      key: 'itemsGroup',
      label: 'List Items',
      options: [
        createOption({
          key: 'title',
          label: 'Section Title',
          input: 'InputText',
          isRequired: true,
        }),
        createOption({
          key: 'items',
          input: 'InputList',
          props: {
            itemName: 'Point',
            itemLabel: args => (args?.item as PointConfig)?.content ?? 'Untitled',
          },
          options: [
            createOption({
              key: 'content',
              label: 'Content',
              input: 'InputTextarea',
              props: {
                rows: 3,
                placeholder: 'Enter your point here...',
              },
            }),
          ],
        }),
        createOption({
          key: 'layout',
          label: 'Layout Style',
          input: 'InputRadioButton',
          list: [
            { value: 'default', label: 'Grid Layout' },
            { value: 'left', label: 'Media Left' },
            { value: 'right', label: 'Media Right' },
          ],
        }),
        createOption({
          key: 'media',
          label: 'Featured Media',
          input: 'InputMedia',
          description: 'Optional media to accompany your content',
        }),
      ],
    }),
    createOption({
      input: 'group',
      key: 'settingsGroup',
      label: 'Settings',
      options: [

      ],
    }),

  ]
}

// Demo configurations
const demoConfigs = {
  // Default instructional example
  default: {
    layout: 'default',
    title: 'Create Steps',
    items: [
      { content: 'Start with a compelling headline.' },
      { content: 'Use 4-5 concise bullet points.' },
      { content: 'Add relevant imagery that emotionally connects.' },
      { content: 'End with a strong call-to-action.' },
    ],
  },

  // Pattern: Problem → Solution with emotional triggers
  problems: {
    title: 'Is This Holding You Back?',
    layout: 'left',
    media: { format: 'image' },
    items: [
      { content: 'Feel overwhelmed by constant changes in your industry? Imagine having a clear path forward.' },
      { content: 'Tired of watching competitors get ahead? Discover how to stand out authentically.' },
      { content: 'Struggling to reach the right audience? Learn to attract perfect-fit clients naturally.' },
      { content: 'Ready to stop playing small? It\'s time to amplify your true potential.' },
    ],
  },

  // Pattern: Future Pacing with benefits
  future: {
    title: 'Picture Your Success',
    layout: 'right',
    media: { format: 'image' },
    items: [
      { content: 'Watch as your influence grows and opportunities naturally come to you.' },
      { content: 'Experience the confidence of having a proven system working for you 24/7.' },
      { content: 'Feel the satisfaction of making a bigger impact while working less.' },
      { content: 'Join other successful professionals who\'ve already made this transformation.' },
    ],
  },

  // Pattern: Process steps with embedded commands
  process: {
    title: 'Your Path to Excellence',
    items: [
      { content: 'Start by discovering your unique advantage that sets you apart from the competition.' },
      { content: 'Notice how quickly your audience responds to your authentic message.' },
      { content: 'Realize that building authority becomes natural when you follow this system.' },
      { content: 'Understand that success comes from consistent, strategic action.' },
    ],
  },

  // Pattern: Social proof with presuppositions
  results: {
    title: 'Why Others Choose Us',
    layout: 'right',
    media: { format: 'image' },
    items: [
      { content: 'Our clients already know the value of investing in their success story.' },
      { content: 'You\'ll appreciate how easily our system fits into your busy schedule.' },
      { content: 'Many professionals are surprised by how quickly they see results.' },
      { content: 'Your network will notice the difference in your professional presence.' },
    ],
  },
} satisfies Record<string, UserConfig>

// Config getter function
export async function getConfig(args: { templateId: string, factory: CardFactory }) {
  const { templateId, factory } = args
  const stock = await factory.getStockMedia()

  // Add stock images to configurations that need them
  const configsWithMedia = {
    ...demoConfigs,
    problems: {
      ...demoConfigs.problems,
      media: stock.getRandomByTags(['aspect:portrait']),
    },
    future: {
      ...demoConfigs.future,
      media: stock.getRandomByTags(['aspect:portrait']),
    },
    results: {
      ...demoConfigs.results,
      media: stock.getRandomByTags(['aspect:portrait']),
    },
  }

  return {
    schema,
    options: getOptions(),
    userConfig: configsWithMedia.default,
    demoPage: {
      cards: [
        { templateId, userConfig: configsWithMedia.default },
        { templateId, userConfig: configsWithMedia.problems },
        { templateId, userConfig: configsWithMedia.future },
        { templateId, userConfig: configsWithMedia.process },
        { templateId, userConfig: configsWithMedia.results },
      ],
    },
  }
}
