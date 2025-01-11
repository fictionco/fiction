import type { CardFactory } from '@fiction/site/cardFactory'
import type { SiteUserConfig } from '@fiction/site/schema'
import type { StockMedia } from '@fiction/ui/stock'
import { ActionAreaSchema, MediaDisplaySchema, SuperTitleSchema } from '@fiction/core'
import { createOption } from '@fiction/ui'
import { z } from 'zod'

// Core schemas
export const CinemaItemSchema = z.object({
  superTitle: SuperTitleSchema.optional().describe('Short text (2-5 words) appearing above main header for context or categorization'),
  title: z.string().optional().describe('Primary title text - should be compelling and descriptive'),
  subTitle: z.string().optional().describe('Supporting text that provides additional context or call to action'),
  media: MediaDisplaySchema.optional().describe('Background media - supports images or videos for visual impact'),
  action: ActionAreaSchema.pick({ buttons: true }).optional().describe('Call-to-action buttons for slide'),
})

export const schema = z.object({
  items: z.array(CinemaItemSchema).optional().describe('Array of slides to display in the cinema view [ai seconds=15]'),
  autoSlide: z.boolean().optional().describe('Enable automatic slide transitions every 12 seconds'),
})

export type UserConfig = z.infer<typeof schema> & SiteUserConfig
export type CinemaItem = z.infer<typeof CinemaItemSchema>

// Input options configuration
export function getOptions() {
  return [
    createOption({
      schema,
      key: 'group.slides',
      label: 'Slides',
      input: 'group',
      icon: { class: 'i-tabler-slideshow' },
      options: [
        createOption({
          schema,
          key: 'items',
          input: 'InputList',
          props: {
            itemName: 'Cinema Slide',
            itemLabel: args => (args?.item as CinemaItem)?.title ?? 'Untitled',
          },
          options: [

            createOption({
              schema,
              key: 'items.0.title',
              label: 'Main Title',
              input: 'InputText',
              description: 'Primary headline for the slide',
              placeholder: 'e.g., Mountain Expeditions',
            }),
            createOption({
              schema,
              key: 'items.0.subTitle',
              label: 'Sub Title',
              input: 'InputText',
              description: 'Additional context or call-to-action text',
              placeholder: 'e.g., Discover our latest adventures',
            }),
            createOption({
              schema,
              key: 'items.0.superTitle',
              input: 'InputSuperTitle',
            }),

            createOption({
              schema,
              key: 'items.0.media',
              label: 'Background Media',
              input: 'InputMedia',
              description: 'Full-screen background image or video',
              props: {
                isBackground: true,
                formats: { url: true, image: true, video: true },
                aspectRatio: '16:9',
              },
            }),

            createOption({
              schema,
              key: 'items.0.action',
              label: 'Call-to-Action Buttons',
              input: 'InputActionArea',
              description: 'Add buttons to drive user engagement',
            }),
          ],
        }),
      ],
    }),

    createOption({
      schema,
      key: 'group.settings',
      label: 'Settings',
      input: 'group',
      icon: { class: 'i-tabler-settings' },
      options: [
        createOption({
          schema,
          key: 'autoSlide',
          label: 'Auto-Advance Slides',
          input: 'InputToggle',
          description: 'Automatically transition between slides every 12 seconds',
        }),
      ],
    }),

  ]
}

async function getDemos(args: { stock: StockMedia, templateId: string }) {
  const { stock, templateId } = args

  // Showcase best practices for storytelling through visual hierarchy
  const storyTellingDemo: CinemaItem[] = [
    {
      superTitle: { text: 'Visual Impact', icon: { iconId: 'eye' } },
      title: 'Capture Attention Instantly',
      subTitle: 'Notice how full-screen video creates an immersive first impression that stops the scroll',
      media: stock.getRandomByTags(['background', 'video']),
      action: {
        buttons: [
          {
            label: 'See How It Works',
            href: '#',
            design: 'outline',
            icon: 'i-tabler-player-play',
            theme: 'overlay',
          },
        ],
      },
    },
    {
      superTitle: { text: 'Clear Hierarchy', icon: { iconId: 'layout-list' } },
      title: 'Guide Their Journey',
      subTitle: 'Feel how the super title, main heading, and call-to-action create natural eye flow',
      media: stock.getRandomByTags(['background', 'video']),
      action: {
        buttons: [
          { label: 'Start Creating', href: '#', design: 'solid', theme: 'primary' },
          { label: 'Watch Tutorial', href: '#', design: 'outline', theme: 'overlay' },
        ],
      },
    },
    {
      superTitle: { text: 'Engagement', icon: { iconId: 'target' } },
      title: 'Drive Action Through Emotion',
      subTitle: 'Experience how compelling visuals paired with direct calls-to-action boost conversion',
      media: stock.getRandomByTags(['background', 'video']),
      action: {
        buttons: [
          { label: 'Try It Now', href: '#', design: 'outline', theme: 'overlay' },
        ],
      },
    },
  ]

  // Demonstrate different content strategy approaches
  const contentStrategyDemo: CinemaItem[] = [
    {
      superTitle: { text: 'Product Launch', icon: { iconId: 'rocket' } },
      title: 'Transform Features Into Benefits',
      subTitle: 'Watch engagement increase when you focus on what your audience gains',
      media: stock.getRandomByTags(['background']),
      action: {
        buttons: [
          { label: 'Start Your Trial', href: '#', design: 'solid', theme: 'primary' },
          { label: 'See Examples', href: '#', design: 'outline', theme: 'overlay' },
        ],
      },
    },
    {
      superTitle: { text: 'Social Proof', icon: { iconId: 'users' } },
      title: 'Build Trust Through Stories',
      subTitle: 'Discover how customer testimonials and case studies create credibility',
      media: stock.getRandomByTags(['background']),
      action: {
        buttons: [
          { label: 'View Success Stories', href: '#', design: 'outline', theme: 'overlay' },
        ],
      },
    },
  ]

  return [
    {
      templateId,
      title: 'Visual Storytelling Guide',
      description: 'Learn how to create high-impact, conversion-focused sliders',
      userConfig: {
        items: storyTellingDemo,
        autoSlide: true,
      },
    },
    {
      templateId,
      title: 'Content Strategy Examples',
      description: 'See how to structure content for maximum engagement',
      userConfig: {
        items: contentStrategyDemo,
        autoSlide: false,
      },
    },
  ]
}

function getDefaultConfig(args: { stock: StockMedia }): UserConfig {
  const { stock } = args
  return {
    items: [
      {
        superTitle: { text: 'Getting Started', icon: { iconId: 'sparkles' } },
        title: 'Create Your Slider',
        subTitle: 'Select this slide to edit and see how easy it is to customize your content',
        media: {
          ...stock.getRandomByTags(['background', 'video']),
          overlay: {
            gradient: {
              stops: [{ color: '#000000', opacity: 0.5 }],
            },
          },
        },
        action: {
          buttons: [
            {
              label: 'Edit This Slide',
              href: '#',
              design: 'solid',
              theme: 'primary',
              icon: 'i-tabler-edit',
            },
            {
              label: 'View Tutorial',
              href: '#',
              design: 'outline',
              theme: 'overlay',
              icon: 'i-tabler-player-play',
            },
          ],
        },
      },
    ],
    autoSlide: true,
  }
}

// Update the default configuration to be immediately useful
export async function getConfig(args: { templateId: string, factory: CardFactory }) {
  const { factory } = args
  const stock = await factory.getStockMedia()
  const demos = await getDemos({ ...args, stock })

  return {
    schema,
    options: getOptions(),
    userConfig: getDefaultConfig({ stock }),
    demoPage: {
      cards: demos,
    },
  }
}
