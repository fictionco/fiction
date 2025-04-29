import type { CardFactory } from '@fiction/site/cardFactory'
import type { StandardUserConfig } from '@fiction/site/schema'
import type { StockMedia } from '@fiction/ui/stock'
import { NavListItemSchema, PostSchema } from '@fiction/core'
import { createOption } from '@fiction/ui'
import { z } from 'zod'

const UserSchema = NavListItemSchema.pick({
  label: true,
  subLabel: true,
  href: true,
  media: true,
})

const TestimonialSchema = PostSchema.pick({
  title: true,
  content: true,
  href: true,
  media: true,
}).extend({
  user: UserSchema.optional(),
})

export type Testimonial = z.infer<typeof TestimonialSchema>

export const schema = z.object({
  layout: z.enum(['slider', 'mega', 'masonry']).optional().describe('Choose how to showcase your testimonials:\n- Slider: Engaging horizontal storytelling\n- Mega: High-impact featured testimonial\n- Masonry: Rich visual collection'),
  items: z.array(TestimonialSchema).optional(),
})

export type UserConfig = z.infer<typeof schema> & StandardUserConfig

// Input Configuration
const options = [
  createOption({
    schema,
    input: 'group',
    key: 'group.settings',
    label: 'Testimonials',
    icon: { class: 'i-tabler-blockquote' },
    options: [
      createOption({
        schema,
        key: 'layout',
        label: 'Layout',
        input: 'InputRadioButton',
        props: { uiSize: 'sm' },
        list: [
          { value: 'slider', label: 'Slider' },
          { value: 'mega', label: 'Spotlight' },
          { value: 'masonry', label: 'Collection' },
        ],
      }),
      createOption({
        schema,
        input: 'InputList',
        key: 'items',
        props: {
          itemName: 'Testimonial',
          itemLabel: args => (args?.item as Testimonial)?.title ?? 'Untitled',
        },
        options: [
          createOption({
            schema,
            input: 'group',
            key: 'group.testimonial',
            label: 'Testimonial Content',
            icon: { class: 'i-tabler-highlight' },
            options: [
              createOption({
                schema,
                key: 'items.0.title',
                label: 'Title',
                input: 'InputText',
              }),
              createOption({
                schema,
                key: 'items.0.content',
                label: 'Content',
                input: 'InputTextarea',
              }),
              createOption({
                schema,
                key: 'items.0.href',
                label: 'Link / URL',
                input: 'InputSiteRoute',
              }),
              createOption({
                schema,
                key: 'items.0.media',
                label: 'Media',
                input: 'InputMedia',
              }),
            ],
          }),

          createOption({
            schema,
            input: 'group',
            key: 'group.testimonial.user',
            label: 'Author',
            icon: { class: 'i-tabler-user' },
            options: [
              createOption({
                schema,
                key: 'items.0.user.label',
                label: 'Name',
                input: 'InputText',
              }),
              createOption({
                schema,
                key: 'items.0.user.subLabel',
                label: 'Role & Subtitle',
                input: 'InputText',
              }),
              createOption({
                schema,
                key: 'items.0.user.media',
                label: 'Avatar',
                input: 'InputMedia',
              }),
              createOption({
                schema,
                key: 'items.0.user.href',
                label: 'URL',
                input: 'InputSiteRoute',
              }),
            ],
          }),

        ],
      }),
    ],
  }),

]

async function getUserConfig(args: { stock: StockMedia }): Promise<UserConfig & StandardUserConfig> {
  const { stock } = args
  return {
    layout: 'slider', // Start with most engaging layout
    items: [
      {
        title: 'From Overwhelmed to Organized',
        content: 'Imagine going from scattered marketing efforts to a streamlined system that practically runs itself.',
        media: stock.getRandomByTags(['person', 'aspect:square']),
        user: {
          label: 'Dr. Maya Patel',
          media: stock.getRandomByTags(['person', 'aspect:square']),
          subLabel: 'Wellness Enterprise Founder',
          href: '#case-study-maya',
        },
      },
      {
        title: 'Doubled Client Engagement',
        content: 'Watch how personalized storytelling changes everything. Since implementing Fiction\'s approach, our client engagement has doubled. ',
        media: stock.getRandomByTags(['person', 'aspect:square']),
        href: '#case-study-james',
        user: {
          label: 'James Chen',
          media: stock.getRandomByTags(['person', 'aspect:square']),
          subLabel: 'Client Success Director',

        },
      },
      {
        title: '10X ROI on Marketing',
        content: 'Feel the impact of authentic connection. Using Fiction\'s storytelling framework, we\'ve achieved 10X ROI on our marketing investment.',
        media: stock.getRandomByTags(['person', 'aspect:landscape']),
        href: '#case-study-sofia',
        user: {
          label: 'Sofia Rodriguez',
          media: stock.getRandomByTags(['person', 'aspect:square']),
          subLabel: 'Marketing Strategist',
        },
      },
      {
        title: 'From Local to Global Reach',
        content: 'Experience the power of strategic storytelling. Within months of implementing Fiction, we expanded from local markets to global opportunities.',
        media: stock.getRandomByTags(['person', 'aspect:landscape']),
        user: {
          label: 'Alex Foster',
          media: stock.getRandomByTags(['person', 'aspect:square']),
          subLabel: 'Growth Director',
          href: '#case-study-alex',
        },
      },
    ],
  }
}

// Demo Configuration showing layout variations
export async function getConfig(args: { factory: CardFactory, templateId: string }) {
  const { factory, templateId } = args
  const stock = await factory.getStockMedia()
  const userConfig = await getUserConfig({ stock })

  return {
    schema,
    options,
    userConfig,
    demoPage: {
      cards: [
        {
          templateId,
          userConfig: {
            ...userConfig,
            layout: 'mega',
            standard: {
              headers: {
                superTitle: { text: 'High-Impact Stories' },
                title: 'Create Instant [@text_effect]Credibility[/@text_effect]',
                subTitle: 'Watch how the mega layout amplifies your most powerful customer stories. Perfect for featuring industry leaders or remarkable transformations.',
              },
            },
          },
        },
        {
          templateId,
          userConfig: {
            ...userConfig,
            layout: 'masonry',
            standard: {
              headers: {
                superTitle: { text: 'Social Proof at Scale' },
                title: 'Build a Wall of Trust',
                subTitle: 'Notice how multiple stories create an overwhelming sense of credibility. Ideal for showcasing diverse experiences and results.',
              },
            },
          },
        },
        {
          templateId,
          userConfig: {
            ...userConfig,
            layout: 'slider',
            standard: {
              headers: {
                superTitle: { text: 'Guided Discovery' },
                title: 'Tell Your Story Step by Step',
                subTitle: 'Experience how the slider layout creates a natural progression of trust. Perfect for walking prospects through a journey of transformation.',
              },
            },
          },
        },
      ],
    },
  }
}
