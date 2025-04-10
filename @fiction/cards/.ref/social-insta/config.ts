// config.ts
import type { CardFactory } from '@fiction/site/cardFactory'
import { MediaDisplaySchema } from '@fiction/core'
import { createOption } from '@fiction/ui'
import { z } from 'zod'

// Schema defines all configurable options
export const schema = z.object({
  account: z.object({
    handle: z.string().optional(),
    isGridView: z.boolean().optional(),
    postCount: z.number().min(1).max(20).optional(),
  }).optional(),

  display: z.object({
    layout: z.enum(['grid', 'masonry', 'carousel']).optional(),
    showCaption: z.boolean().optional(),
    showLikes: z.boolean().optional(),
    showComments: z.boolean().optional(),

    imageSize: z.enum(['small', 'medium', 'large']).optional(),
    gap: z.enum(['none', 'sm', 'md', 'lg']).optional(),
  }).optional(),

  header: z.object({
    show: z.boolean().optional(),
    style: z.enum(['minimal', 'standard']).optional(),
    media: MediaDisplaySchema.optional(),
    showBio: z.boolean().optional(),
    showFollowers: z.boolean().optional(),
    showPostCount: z.boolean().optional(),
  }).optional(),

  action: z.object({
    show: z.boolean().optional(),
    text: z.string().optional(),
    link: z.string().optional(),
  }).optional(),
})

export type UserConfig = z.infer<typeof schema>

function getOptions() {
  return [
    createOption({
      schema,
      key: 'account',
      label: 'Instagram Account',
      input: 'group',
      options: [
        createOption({
          schema,
          key: 'account.handle',
          label: 'Username',
          input: 'InputText',
          placeholder: '@username',
          isRequired: true,
        }),
        createOption({
          schema,
          key: 'account.postCount',
          label: 'Number of Posts',
          input: 'InputNumber',
          props: {
            min: 1,
            max: 20,
          },
        }),
      ],
    }),

    createOption({
      schema,
      key: 'display',
      label: 'Display Settings',
      input: 'group',
      options: [
        createOption({
          schema,
          key: 'display.layout',
          label: 'Layout Style',
          input: 'InputRadio',
          props: {
            options: [
              { label: 'Grid', value: 'grid' },
              { label: 'Masonry', value: 'masonry' },
              { label: 'Carousel', value: 'carousel' },
            ],
          },
        }),
        createOption({
          schema,
          key: 'display.showCaption',
          label: 'Show Captions',
          input: 'InputToggle',
        }),
        createOption({
          schema,
          key: 'display.showLikes',
          label: 'Show Like Count',
          input: 'InputToggle',
        }),
        createOption({
          schema,
          key: 'display.showComments',
          label: 'Show Comment Count',
          input: 'InputToggle',
        }),
        createOption({
          schema,
          key: 'display.imageSize',
          label: 'Image Size',
          input: 'InputRadio',
          props: {
            options: [
              { label: 'Small', value: 'small' },
              { label: 'Medium', value: 'medium' },
              { label: 'Large', value: 'large' },
            ],
          },
        }),
        createOption({
          schema,
          key: 'display.gap',
          label: 'Grid Spacing',
          input: 'InputRadio',
          props: {
            options: [
              { label: 'None', value: 'none' },
              { label: 'Small', value: 'sm' },
              { label: 'Medium', value: 'md' },
              { label: 'Large', value: 'lg' },
            ],
          },
        }),
      ],
    }),

    createOption({
      schema,
      key: 'header',
      label: 'Profile Header',
      input: 'group',
      options: [
        createOption({
          schema,
          key: 'header.show',
          label: 'Show Header',
          input: 'InputToggle',
        }),
        createOption({
          schema,
          key: 'header.style',
          label: 'Header Style',
          input: 'InputRadio',
          props: {
            options: [
              { label: 'Minimal', value: 'minimal' },
              { label: 'Standard', value: 'standard' },
            ],
          },
        }),
        createOption({
          schema,
          key: 'header.media',
          label: 'Custom Logo',
          input: 'InputMedia',
        }),
      ],
    }),

    createOption({
      schema,
      key: 'action',
      label: 'Call to Action',
      input: 'group',
      options: [
        createOption({
          schema,
          key: 'action.show',
          label: 'Show Follow Button',
          input: 'InputToggle',
        }),
        createOption({
          schema,
          key: 'action.text',
          label: 'Button Text',
          input: 'InputText',
          placeholder: 'Follow on Instagram',
        }),
        createOption({
          schema,
          key: 'action.link',
          label: 'Custom Link',
          input: 'InputSiteRoute',
          placeholder: 'https://instagram.com/username',
        }),
      ],
    }),
  ]
}

export function getDefaultConfig(): UserConfig {
  return {
    account: {
      handle: '',
      postCount: 9,
    },
    display: {
      layout: 'grid',
      showCaption: true,
      showLikes: true,
      showComments: true,
      imageSize: 'medium',
      gap: 'md',
    },
    header: {
      show: true,
      style: 'standard',
    },
    action: {
      show: true,
      text: 'Follow on Instagram',
    },
  }
}

export function getDemoConfigs(templateId: string): Record<string, { templateId: string, userConfig: UserConfig }> {
  return {
    default: {
      templateId,
      userConfig: getDefaultConfig(),
    },
    minimal: {
      templateId,
      userConfig: {
        account: {
          handle: 'fiction',
          postCount: 6,
        },
        display: {
          layout: 'grid',
          showCaption: false,
          showLikes: false,
          showComments: false,
          imageSize: 'medium',
          gap: 'sm',
        },
        header: {
          show: false,
        },
        action: {
          show: false,
        },
      },
    },
    masonry: {
      templateId,
      userConfig: {
        account: {
          handle: 'fiction',
          postCount: 12,
        },
        display: {
          layout: 'masonry',
          showCaption: true,
          showLikes: true,
          showComments: true,
          imageSize: 'large',
          gap: 'lg',
        },
        header: {
          show: true,
          style: 'minimal',
        },
        action: {
          show: true,
          text: 'View More on Instagram',
        },
      },
    },
  }
}

export async function getConfig(args: { templateId: string, factory: CardFactory }) {
  return {
    schema,
    options: getOptions(),
    userConfig: getDefaultConfig(),
    demoPage: {
      cards: [
        ...Object.values(getDemoConfigs(args.templateId)),
      ],
    },
  }
}
