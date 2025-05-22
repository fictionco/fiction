import type { CardFactory } from '@fiction/site/cardFactory'
import type { StandardUserConfig } from '@fiction/site/schema'
import type { StockMedia } from '@fiction/ui/stock'
import { ActionAreaSchema, MediaSchema } from '@fiction/core'
import { createOption } from '@fiction/ui'
import { z } from 'zod/v4'

const TrekItemSchema = z.object({
  title: z.string().optional().meta({ ai: true, description: 'Captivating headline that draws viewers into each section' }),
  content: z.string().optional().meta({ ai: true, description: 'Evocative story that creates an emotional connection' }),
  media: MediaSchema.optional().meta({ ai: true, description: 'Stunning visuals that transport viewers into your world' }),
  action: ActionAreaSchema.optional().meta({ ai: false, description: 'conversion actions like buttons or forms' }),
  parallaxStrength: z.number().min(0).max(1).optional().meta({ ai: false, description: 'Visual depth intensity (0-1)' }),
})

export const schema = z.object({
  items: z.array(TrekItemSchema).optional().meta({ ai: true, description: 'Chapters in your visual story' }),
})

type Chapter = z.infer<typeof TrekItemSchema>

export type UserConfig = z.infer<typeof schema> & StandardUserConfig

const options = [
  createOption({
    schema,
    key: 'items',
    label: 'Story Chapters',
    input: 'InputList',
    props: {
      itemName: 'Chapter',
      itemLabel: args => (args?.item as Chapter)?.title ?? 'Untitled',
    },
    options: [
      createOption({
        schema,
        key: 'items.0.title',
        label: 'Headline',
        input: 'InputText',
        description: 'Visualize a headline that instantly grabs attention',
        placeholder: 'e.g., "Feel the Adventure" or "Discover Wonder"',
      }),
      createOption({
        schema,
        key: 'items.0.content',
        label: 'Narrative',
        input: 'InputTextarea',
        description: 'Paint a vivid picture that resonates with your audience',
        placeholder: 'Transport your readers into the moment...',
      }),
      createOption({
        schema,
        key: 'items.0.media',
        label: 'Visual Impact',
        input: 'InputMedia',
        description: 'Select imagery that stirs emotions and creates atmosphere',
      }),
      createOption({
        schema,
        key: 'items.0.action.buttons',
        label: 'Engagement Triggers',
        input: 'InputActions',
        description: 'Create momentum with perfectly-timed calls to action',
      }),
      createOption({
        schema,
        key: 'items.0.parallaxStrength',
        label: 'Depth Effect',
        input: 'InputRange',
        props: { min: 0, max: 1, step: 0.1, description: 'Feel how the depth changes as you adjust' },
      }),
    ],
  }),

]

async function getDefaultConfig(args: { stock: StockMedia }): Promise<UserConfig> {
  const { stock } = args
  return {
    items: [
      {
        title: 'Watch Your Story Come Alive',
        content: 'Notice how the background responds to your scrolling? This dynamic parallax effect instantly elevates your content.',
        parallaxStrength: 0.5,
        media: stock.getRandomByTags(['aspect:portrait']),
        action: {
          buttons: [{ label: 'Start Creating', theme: 'primary' }],
        },
      },
      {
        title: 'See Perfect Content Placement',
        content: 'Feel how smoothly your content stays in view while captivating visuals flow behind it?.',
        parallaxStrength: 0.4,
        media: stock.getRandomByTags(['aspect:portrait']),
        action: {
          buttons: [{ label: 'Learn More', theme: 'default', design: 'outline' }],
        },
      },
    ],
  }
}

async function getDemoConfig(args: { stock: StockMedia }): Promise<UserConfig> {
  const { stock } = args
  return {
    items: [
      {
        title: 'Step Into Paradise',
        content: 'Feel the gentle breeze as you discover pristine beaches where turquoise waters meet powder-soft sand. Every scroll reveals another breathtaking vista, carefully crafted to transport you into this island sanctuary.',
        parallaxStrength: 0.5,
        media: stock.getRandomByTags(['aspect:portrait']),
        action: {
          buttons: [
            { label: 'Book Your Escape', theme: 'primary' },
            { label: 'View Gallery', theme: 'default', design: 'outline' },
          ],
        },
      },
      {
        title: 'Taste Culinary Excellence',
        content: 'Immerse yourself in a world where traditional flavors meet modern mastery. Watch as our chefs transform local ingredients into artistic presentations that delight all your senses.',
        parallaxStrength: 0.4,
        media: stock.getRandomByTags(['aspect:portrait']),
        action: {
          buttons: [
            { label: 'Explore Menu', theme: 'emerald' },
          ],
        },
      },
      {
        title: 'Experience Timeless Luxury',
        content: 'Discover where sophistication meets serenity in our carefully curated suites. Feel the perfect harmony of modern comfort and natural beauty as you scroll through our virtual tour.',
        parallaxStrength: 0.6,
        media: stock.getRandomByTags(['aspect:portrait']),
        action: {
          buttons: [
            { label: 'Reserve Now', theme: 'primary' },
            { label: 'View Amenities', theme: 'default', design: 'outline' },
          ],
        },
      },
    ],
  }
}

export async function getConfig(args: { templateId: string, factory: CardFactory }) {
  const { factory, templateId } = args
  const stock = await factory.getStockMedia()
  const defaultUserConfig = await getDefaultConfig({ stock })
  return {
    schema,
    options,
    userConfig: defaultUserConfig,
    demoPage: {
      cards: [
        { templateId, userConfig: await getDemoConfig({ stock }) },
        { templateId, userConfig: { standard: {
          headers: {
            title: 'A Visual Journey',
            subTitle: 'Discover the power of parallax storytelling',
          },
        }, ...defaultUserConfig } },
      ],
    },
  }
}
