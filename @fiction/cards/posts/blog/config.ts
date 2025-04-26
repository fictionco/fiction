import type { CardFactory } from '@fiction/site/cardFactory'
import type { StandardUserConfig } from '@fiction/site/schema'
import { PostHandlingSchema } from '@fiction/core'
import { createOption } from '@fiction/ui'
import { z } from 'zod'

// Schema definition
export const schema = z.object({
  posts: PostHandlingSchema.optional().describe('Blog post configuration and handling'),
  index: z.object({
    featuredCount: z.number().optional().describe('Number of featured posts to display prominently'),
    sidebar: z.enum(['left', 'right', 'none', '']).optional().describe('Sidebar position for the blog layout'),
    imagePosition: z.enum(['left', 'right', 'top', 'cover', 'none']).optional().describe('Position of the image in the blog layout'),
  }).optional(),
})

export type UserConfig = z.infer<typeof schema> & StandardUserConfig

const options = [
  createOption({
    schema,
    key: 'postsGroup',
    label: 'Post Configuration',
    input: 'group',
    icon: { class: 'i-tabler-file-text' },
    options: [
      createOption({
        schema,
        key: 'index.featuredCount',
        label: 'Featured Count',
        input: 'InputRadioButton',
        props: { uiSize: 'sm' },
        list: [{ value: 1, label: '1' }, { value: 2, label: '2' }, { value: 3, label: '3' }],
      }),
    ],
  }),

]

// Main config function
export async function getConfig(args: { templateId: string, factory: CardFactory }) {
  const { factory } = args

  return {
    options,
    schema,
    userConfig: {},
  }
}
