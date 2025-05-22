import type { CardFactory } from '@fiction/site/cardFactory'
import type { StandardUserConfig } from '@fiction/site/schema'
import { PostSchema } from '@fiction/core'
import { createOption } from '@fiction/ui'
import { z } from 'zod/v4'

const fields = PostSchema.pick({
  title: true,
  content: true,
  media: true,
  action: true,
}).shape

const StorySectionSchema = z.object({
  ...fields,
  title: fields.title.meta({ ai: true, description: 'Headline that captures this story section' }),
  content: fields.content.meta({ ai: true, description: '2-3 engaging paragraphs that draw readers in' }),
  media: fields.media.meta({ ai: true, description: 'Visual element that enhances your story' }),
  action: fields.action.meta({ ai: true, description: 'Optional calls-to-action at key moments' }),
})

export const schema = z.object({
  items: z.array(StorySectionSchema).optional().meta({ ai: true, description: 'Story sections that reveal as users scroll' }),
  layout: z.enum(['left', 'right']).optional().meta({ ai: false, description: 'Media on left or right' }),
  scrollHandling: z.enum(['sticky', 'scrolling']).optional().meta({ ai: false, description: 'Media behavior on scroll' }),
})

export type UserConfig = z.infer<typeof schema> & StandardUserConfig
type StorySection = z.infer<typeof StorySectionSchema>

const options = [
  createOption({
    schema,
    key: 'sectionsGroup',
    input: 'group',
    label: 'Content',
    icon: { class: 'i-tabler-align-left' },
    options: [
      createOption({
        schema,
        key: 'items',
        input: 'InputList',
        props: {
          itemName: 'Section',
          itemLabel: ({ item }) => {
            const section = item as StorySection
            if (section.title)
              return section.title

            // Remove HTML and get preview
            const plainText = section.content?.replace(/<[^>]*>/g, '') || ''
            return plainText.slice(0, 100) || 'Untitled'
          },
        },
        options: [
          createOption({
            schema,
            key: 'items.0.title',
            label: 'Title',
            input: 'InputText',
            placeholder: 'Enter a headline...',
          }),
          createOption({
            schema,
            key: 'items.0.content',
            label: 'Content',
            input: 'InputProse',
            placeholder: 'Write your story...',
          }),
          createOption({
            schema,
            key: 'items.0.media',
            label: 'Media',
            input: 'InputMedia',
          }),
          createOption({
            schema,
            key: 'items.0.action.buttons',
            label: 'Buttons',
            input: 'InputActions',
          }),
        ],
      }),
    ],
  }),
  createOption({
    schema,
    key: 'settingsGroup',
    input: 'group',
    label: 'Design',
    icon: { class: 'i-tabler-layout' },
    options: [
      createOption({
        schema,
        key: 'layout',
        input: 'InputRadioButton',
        label: 'Layout Style',
        props: { uiSize: 'sm' },
        list: [
          { label: 'Media on Left', value: 'left', icon: { class: 'i-tabler-layout-sidebar' } },
          { label: 'Media on Right', value: 'right', icon: { class: 'i-tabler-layout-sidebar-right' } },
        ],
      }),
      createOption({
        schema,
        key: 'scrollHandling',
        input: 'InputRadioButton',
        label: 'Scroll Behavior',
        subLabel: 'Standard scrolling or sticky media',
        props: { uiSize: 'sm' },
        list: [
          { label: 'Standard Scrolling', value: 'scrolling', icon: { class: 'i-tabler-caret-up-down' } },
          { label: 'Sticky Media', value: 'sticky', icon: { class: 'i-tabler-box-align-top' } },
        ],
      }),
    ],
  }),
]

async function getDefaultConfig(args: { factory: CardFactory, numItems?: number }): Promise<UserConfig> {
  const { numItems = 10, factory } = args
  const stock = await factory.getStockMedia()

  const defaultItems: StorySection[] = [
    {
      content: `<p>[@text_effect]Your story[/@text_effect] begins to unfold as readers scroll down the page. This engaging format naturally draws attention and keeps your audience immersed in your narrative.</p>
               <p>See how the images beside your text create visual anchor points, helping readers connect with key moments in your story while maintaining a smooth reading flow.</p>`,
      media: stock.getRandomByTags(['aspect:square']),
    },
    {
      content: `<p>Each new section reveals itself at just the right moment. This pacing helps build anticipation and keeps readers engaged with your content.</p>
               <p>Experience how the clean layout ensures your message remains front and center, while supporting visuals add depth without overwhelming.</p>`,
      media: stock.getRandomByTags(['aspect:square']),
    },
    {
      content: `<p>Feel the natural rhythm as text and images work together to tell your story. This balanced approach helps maintain reader interest while effectively communicating your message.</p>
               <p>Imagine your own narrative unfolding this way - whether you're sharing a company history, showcasing a project, or telling your brand story.</p>`,
      media: stock.getRandomByTags(['aspect:square']),
      action: { buttons: [{ label: 'Start Your Story', href: '#' }] },
    },
  ]

  return {
    layout: 'left',
    scrollHandling: 'scrolling',
    items: defaultItems.slice(0, numItems),
  }
}

async function getDemoConfig(args: { factory: CardFactory }): Promise<UserConfig> {
  const defaultUserConfig = await getDefaultConfig({ ...args })

  return {
    ...defaultUserConfig,
    scrollHandling: 'sticky',
    layout: 'right',
  }
}

export async function getConfig(args: { templateId: string, factory: CardFactory }) {
  return {
    schema,
    options,
    userConfig: await getDefaultConfig({ ...args, numItems: 1 }),
    demoPage: {
      cards: [{
        templateId: args.templateId,
        userConfig: await getDemoConfig(args),
      }],
    },
  }
}
