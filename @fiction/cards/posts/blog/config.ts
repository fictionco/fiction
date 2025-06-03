import type { CardFactory } from '@fiction/site/cardFactory'
import type { StandardUserConfig } from '@fiction/site/schema'
import { MediaSchema } from '@fiction/core'
import { PostHandlingSchema } from '@fiction/posts'
import { createOption } from '@fiction/ui'
import { z } from 'zod/v4'

// Schema definition
export const schema = z.object({
  posts: PostHandlingSchema.optional().meta({ description: 'Blog post configuration and handling' }),
  featuredCount: z.number().optional().meta({ description: 'Number of featured posts to display prominently' }),
  title: z.string().optional().meta({ description: 'Title for the blog section' }),
  subTitle: z.string().optional().meta({ description: 'Description for the blog section' }),
  media: MediaSchema.optional().meta({ description: 'Header media for the blog section' }),
})

export type UserConfig = z.infer<typeof schema> & StandardUserConfig

const options = [
  createOption({
    schema,
    key: 'postsGroup',
    label: 'Settings',
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
        key: 'title',
        label: 'Title',
        input: 'InputText',
        placeholder: 'Enter a title',
      }),
      createOption({
        schema,
        key: 'subTitle',
        label: 'Subtitle',
        input: 'InputText',
        placeholder: 'Enter a subtitle',
      }),
      createOption({
        schema,
        key: 'media',
        label: 'Header Media',
        input: 'InputMedia',
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
      title: '[@promise]',
    },
  }
}
