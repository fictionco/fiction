import type { CardFactory } from '@fiction/site/cardFactory'
import type { StandardUserConfig } from '@fiction/site/schema'
import { PostHandlingSchema } from '@fiction/posts'
import { createOption } from '@fiction/ui'
import { z } from 'zod'

// Schema definition
export const schema = z.object({
  posts: PostHandlingSchema.optional().describe('Blog post configuration and handling'),
  featuredCount: z.number().optional().describe('Number of featured posts to display prominently'),
  headline: z.string().optional().describe('Headline for the blog section'),
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
        key: 'featuredCount',
        label: 'Featured Count',
        input: 'InputRadioButton',
        list: ['0', '1', '2', '3', '4', '5'],
      }),
      createOption({
        schema,
        key: 'headline',
        label: 'Headline',
        input: 'InputText',
        placeholder: 'Add a headline',
      }),
    ],
  }),

]

// Main config function
export async function getConfig(args: { templateId: string, factory: CardFactory }) {
  return {
    options,
    schema,
    userConfig: {
      featuredCount: 1,
      headline: '[@brand_headline]',
    },
  }
}
