import type { CardFactory } from '@fiction/site/cardFactory'
import type { SiteUserConfig } from '@fiction/site/schema'
import type { StockMedia } from '@fiction/ui/stock'
import { ActionAreaSchema, DecorationShapeSchema } from '@fiction/core'
import { createOption } from '@fiction/ui'
import { z } from 'zod'

// Core schema for individual statement content
export const StatementSchema = z.object({
  title: z.string().optional().describe('The headline that captures attention (3-8 words) [ai]'),
  content: z.string().optional().describe('The main message that drives your point home'),
  action: ActionAreaSchema.optional().describe('call-to-action area'),
  shape: DecorationShapeSchema.optional().describe('The shape of the image'),
})

export type Statement = z.infer<typeof StatementSchema>

// Main configuration schema
export const schema = z.object({
  items: z.array(StatementSchema).optional().describe('A series of powerful statements to showcase'),
  autoplay: z.boolean().optional().describe('Automatically transition between statements'),
  transition: z.enum(['fade', 'slide']).optional().describe('How statements transition'),
})

export type UserConfig = z.infer<typeof schema> & SiteUserConfig

// Input configuration with intuitive labels and guidance
const options = [
  createOption({
    key: 'group.content',
    input: 'group',
    label: 'Statement Content',
    icon: { class: 'i-tabler-highlight' },
    options: [
      createOption({
        schema,
        input: 'InputList',
        key: 'items',
        label: 'Statement Slides',
        description: 'Create a sequence of impactful messages that tell your story',
        props: { itemLabel: 'Statement' },
        options: [
          createOption({
            schema,
            key: 'items.0.title',
            label: 'Headline',
            input: 'InputText',
            description: 'Capture attention with a bold, clear message',
            placeholder: 'Transform Your Ideas Into Reality',
          }),
          createOption({
            schema,
            key: 'items.0.content',
            label: 'Message',
            input: 'InputTextarea',
            description: 'Expand on your headline with compelling details',
            placeholder: 'Share the value you provide in 2-3 impactful sentences',
          }),
          createOption({
            schema,
            key: 'items.0.action',
            label: 'Action Area',
            input: 'InputActionArea',
          }),
          createOption({
            schema,
            key: 'items.0.shape',
            label: 'Decoration Shape',
            input: 'InputSelect',
            list: DecorationShapeSchema.options,
          }),
        ],
      }),
    ],
  }),
  createOption({
    key: 'group.settings',
    input: 'group',
    label: 'Settings',
    icon: { class: 'i-tabler-settings' },
    options: [
      createOption({
        schema,
        key: 'autoplay',
        label: 'Auto-Advance',
        input: 'InputToggle',
        description: 'Automatically transition between statements',
      }),
      createOption({
        schema,
        key: 'transition',
        label: 'Transition Effect',
        input: 'InputSelect',
        props: { list: ['fade', 'slide'] },
        description: 'Choose how statements transition',
      }),
    ],
  }),

]

// Default configuration shows best practices
export async function getUserConfig(): Promise<UserConfig> {
  return {
    items: [
      {
        title: 'Transform Your Vision Into Reality',
        content: 'Notice how this statement immediately engages your audience with a powerful promise. Each word is chosen to create emotional impact and paint a picture of possibilities.',
        action: { buttons: [{ label: 'Start Your Journey', href: '#', theme: 'primary', design: 'solid' }] },
      },

    ],
    transition: 'fade',
    autoplay: true,

  }
}

// Additional demo configurations showcase versatility
export async function getDemoConfig(args: { stock: StockMedia }): Promise<UserConfig> {
  const { stock } = args
  return {
    items: [
      {
        title: 'Revolutionize Your Customer Experience',
        content: 'Watch as our AI-powered platform transforms every interaction into an opportunity for growth. Our solutions have helped companies increase satisfaction by an average of 47%.',
        action: { buttons: [{ label: 'Schedule Demo', href: '#', theme: 'blue', design: 'solid' }] },
      },
      {
        title: 'Data-Driven Decisions Made Simple',
        content: 'Experience the clarity of seeing your entire business at a glance. Our intuitive dashboards turn complex data into actionable insights that drive growth.',
        action: { buttons: [{ label: 'Try It Free', href: '#', theme: 'emerald', design: 'solid' }] },
      },
    ],
    standard: {
      background: {
        ...stock.getRandomByTags(['background']),
        overlay: {
          opacity: 80,
          color: 'black',
        },
      },

    },
  }
}

export async function getConfig(args: { templateId: string, factory: CardFactory }) {
  const { factory, templateId } = args
  const stock = await factory.getStockMedia()
  return {
    schema,
    options,
    userConfig: await getUserConfig(),
    demoPage: {
      cards: [
        { templateId, userConfig: await getUserConfig() },
        { templateId, userConfig: await getDemoConfig({ stock }) },
      ],
    },
  }
}
