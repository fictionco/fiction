import type { CardFactory } from '@fiction/site/cardFactory'
import type { StandardUserConfig } from '@fiction/site/schema'
import type { InputOption } from '@fiction/ui'
import { ActionAreaSchema, colorThemeUser, MediaSchema, SizeSchema } from '@fiction/core'
import { createOption } from '@fiction/ui'
import { z } from 'zod/v4'

// Individual feature schema
const featureSchema = z.object({
  title: z.string().optional().meta({ ai: true, description: 'Feature name or headline' }),
  description: z.string().optional().meta({ ai: true, description: 'Feature explanation text' }),
  href: z.string().optional().meta({ ai: false, description: 'Link destination' }),
  icon: MediaSchema.optional().meta({ ai: true, description: 'Visual representation' }),
  color: z.enum(colorThemeUser).optional().meta({ ai: false, description: 'Feature color theme' }),
  action: ActionAreaSchema.optional().meta({ ai: true, description: 'Interactive buttons' }),
  columns: z.enum(['1', '2', '3', '4']).optional().meta({ ai: false, description: 'Width in masonry layout' }),
})

export const schema = z.object({
  layout: z.object({
    style: z.enum(['grid', 'masonry', 'cards', 'carousel']).optional().meta({ ai: false, description: 'Display format' }),
    columns: z.enum(['1', '2', '3', '4']).optional().meta({ ai: false, description: 'Grid columns count' }),
    spacing: z.enum(['tight', 'normal', 'relaxed']).optional().meta({ ai: false, description: 'Gap between features' }),
    align: z.enum(['left', 'center']).optional().meta({ ai: false, description: 'Content alignment' }),
  }).optional().meta({ ai: false, description: 'Layout settings' }),
  items: z.array(featureSchema).optional().meta({ ai: true, description: 'Feature list items' }),
  style: z.object({
    iconSize: SizeSchema.optional().meta({ ai: false, description: 'Icon dimensions' }),
    iconStyle: z.enum(['outline', 'solid', 'duotone']).optional().meta({ ai: false, description: 'Icon visual style' }),
  }).optional().meta({ ai: false, description: 'Visual preferences' }),
})

export type FeatureConfig = z.infer<typeof featureSchema>
export type UserConfig = z.infer<typeof schema> & StandardUserConfig

const options: InputOption[] = [
  createOption({
    key: 'group.features',
    label: 'Features',
    input: 'group',
    options: [
      createOption({
        key: 'items',
        input: 'InputList',
        props: {
          itemLabel: args => (args?.item as FeatureConfig)?.title ?? 'Untitled',
          itemName: 'Feature',
        },
        options: [
          createOption({
            key: 'items.0.title',
            label: 'Title',
            input: 'InputText',
            isRequired: true,
            schema,
          }),
          createOption({
            key: 'items.0.description',
            label: 'Description',
            input: 'InputTextarea',
            props: { rows: 3 },
            schema,
          }),
          createOption({
            key: 'items.0.icon',
            label: 'Icon',
            input: 'InputIcon',
            schema,
          }),
          createOption({
            key: 'items.0.color',
            label: 'Accent Color',
            input: 'InputColorTheme',
            schema,
          }),
          createOption({
            key: 'items.0.columns',
            label: 'Column Span (Masonry Mode)',
            subLabel: 'Set the width in masonry layout',
            input: 'InputSelect',
            props: { list: ['1', '2', '3', '4'] },
            schema,
          }),
          createOption({
            input: 'group',
            label: 'Links',
            key: 'linkGroup',
            options: [
              createOption({
                key: 'items.0.href',
                label: 'Link URL',
                input: 'InputSiteRoute',
                schema,
              }),
              createOption({
                key: 'items.0.action.buttons',
                label: 'Actions',
                input: 'InputActions',
                schema,
              }),
            ],
          }),

        ],
      }),
    ],
  }),

  createOption({
    key: 'layout',
    label: 'Layout',
    input: 'group',
    options: [
      createOption({
        key: 'layout.style',
        label: 'Style',
        subLabel: 'Select a style for displaying features',
        input: 'InputSelect',
        list: [
          { label: 'Grid', value: 'grid' },
          { label: 'Masonry', value: 'masonry' },
          { label: 'Cards', value: 'cards' },
          { label: 'Carousel', value: 'carousel' },
        ],
        schema,
      }),
      createOption({
        key: 'layout.columns',
        label: 'Columns',
        subLabel: 'How wide should each feature be?',
        input: 'InputRadioButton',
        props: { uiSize: 'sm' },
        list: ['1', '2', '3', '4'],
        schema,
      }),
      createOption({
        key: 'layout.spacing',
        label: 'Spacing',
        subLabel: 'How much space between features?',
        input: 'InputRadioButton',
        props: { uiSize: 'sm' },
        list: ['tight', 'normal', 'relaxed'],
        schema,
      }),
      createOption({
        key: 'layout.align',
        label: 'Text Alignment',
        subLabel: 'How should text be aligned?',
        input: 'InputRadioButton',
        props: { uiSize: 'sm' },
        list: ['left', 'center'],
        schema,
      }),
    ],
  }),

  createOption({
    key: 'styleGroup',
    label: 'Style Options',
    input: 'group',
    options: [
      createOption({
        key: 'style.iconSize',
        label: 'Icon Size',
        input: 'InputStandardSize',
        schema,
      }),
      createOption({
        key: 'style.iconStyle',
        label: 'Icon Style',
        input: 'InputSelect',
        list: ['outline', 'solid', 'duotone'],
        schema,
      }),
    ],
  }),
]

function getDefaultConfig(): UserConfig {
  return {
    layout: {
      style: 'grid',
      columns: '3',
      spacing: 'normal',
      align: 'left',
    },
    items: [
      {
        title: 'Create Visual Hierarchy',
        description: 'Notice how icons and colors naturally guide attention? Try emphasizing key features by mixing text sizes and adding accent colors that match your brand.',
        icon: { iconId: 'layout' },
        color: 'blue',
      },
      {
        title: 'Guide User Actions',
        description: 'See how clear calls-to-action create momentum? Add buttons strategically to key features that lead visitors toward conversion points.',
        icon: { iconId: 'arrow-right' },
        color: 'emerald',
      },
      {
        title: 'Build Trust',
        description: 'Feel how social proof and benefit-focused descriptions build confidence? Transform features into compelling reasons why visitors should choose your brand.',
        icon: { iconId: 'users' },
        color: 'violet',
      },
    ],
    style: {
      iconSize: 'md',
      iconStyle: 'solid',
    },
  }
}

function getMasonryDemo(): UserConfig {
  return {
    layout: {
      style: 'masonry',
      columns: '4',
      spacing: 'normal',
    },
    items: [
      {
        title: 'Your Brand Story',
        description: 'Imagine your brand story unfolding naturally as visitors scroll. Start with a powerful overview that captures attention and sets expectations.\n\nNotice how varying content lengths create visual interest while maintaining a cohesive narrative?',
        icon: { iconId: 'brush' },
        color: 'blue',
        columns: '3',
        action: { buttons: [{ label: 'Edit Brand Settings', design: 'ghost' }] },
      },
      {
        title: 'Visual Identity',
        description: 'See how your logo, colors, and typography work together? Fiction helps maintain consistency across all touchpoints.',
        icon: { iconId: 'palette' },
        color: 'emerald',
        columns: '3',
      },
      {
        title: 'Brand Voice',
        description: 'Feel how your unique tone shines through?',
        icon: { class: 'i-tabler-speakerphone' },
        color: 'rose',
        columns: '2',
      },
      {
        title: 'Multi-Channel Presence',
        description: 'Notice how your brand adapts seamlessly across different platforms? From websites to email campaigns, maintain a consistent presence everywhere.\n\nExperience automatic responsive design.',
        icon: { iconId: 'phone' },
        color: 'violet',
        columns: '2',
        href: '/channels',
      },
      {
        title: 'Brand Analytics',
        description: 'Track engagement in real-time.',
        icon: { iconId: 'chart-line' },
        color: 'amber',
        columns: '2',
      },
      {
        title: 'Team Collaboration',
        description: 'Watch your team work together seamlessly with shared brand assets and guidelines.',
        icon: { iconId: 'users' },
        color: 'indigo',
        columns: '2',
        action: { buttons: [{ label: 'Invite Team', design: 'solid' }] },
      },
      {
        title: 'Brand Protection',
        description: 'Rest easy knowing your brand assets are secure and centralized.',
        icon: { iconId: 'shield' },
        color: 'slate',
        columns: '4',
      },
      {
        title: 'Design System',
        description: 'Experience how your brand guidelines automatically translate into beautiful, consistent designs.',
        icon: { class: 'i-tabler-cube' },
        color: 'green',
        columns: '4',
        href: '/design-system',
      },
    ],
    style: {
      iconSize: 'lg',
      iconStyle: 'duotone',
    },
  }
}

function getCarouselDemo(): UserConfig {
  return {
    layout: {
      style: 'carousel',
      columns: '3',
      spacing: 'normal',
      align: 'left',
    },
    items: [
      {
        title: 'Start Your Journey',
        description: 'Notice how the carousel guides visitors through your brand story? Each slide reveals another compelling reason to engage.',
        icon: { iconId: 'rocket' },
        color: 'blue',
        action: { buttons: [{ label: 'Get Started', design: 'ghost' }] },
      },
      {
        title: 'Brand Evolution',
        description: 'See how your brand can grow and adapt? The carousel format perfectly showcases your journey and future vision.',
        icon: { iconId: 'trending-up' },
        color: 'violet',
      },
      {
        title: 'Connect & Engage',
        description: 'Feel the emotional connection build as you guide visitors through your unique value proposition.',
        icon: { iconId: 'heart' },
        color: 'emerald',
      },
      {
        title: 'Measure Impact',
        description: 'Watch your brand influence grow with built-in analytics and engagement tracking.',
        icon: { iconId: 'bolt' },
        color: 'amber',
      },
      {
        title: 'Launch Your Brand',
        description: 'Ready to make your mark? Transform visitors into brand advocates with clear next steps.',
        icon: { iconId: 'rocket' },
        color: 'rose',
        action: { buttons: [{ label: 'Launch Now', design: 'solid' }] },
      },
    ],
    style: {
      iconSize: 'md',
      iconStyle: 'duotone',
    },
  }
}

function getLayoutDemos(): UserConfig[] {
  return [
    {
      layout: { style: 'grid', columns: '4', align: 'center' },
      items: [
        {
          title: 'Brand Foundation',
          description: 'See how a balanced grid creates visual harmony? Perfect for showcasing your core brand elements.',
          icon: { iconId: 'grid' },
          color: 'blue',
          action: { buttons: [{ label: 'Customize', design: 'ghost' }] },
        },
        {
          title: 'Visual Elements',
          description: 'Notice how consistent spacing and alignment reinforce your brand\'s professional image?',
          icon: { iconId: 'photo' },
          color: 'violet',

        },
        {
          title: 'Content Strategy',
          description: 'Imagine your content strategically placed to guide visitors through your brand story.',
          icon: { class: 'i-tabler-file-text' },
          color: 'emerald',
          href: '#strategy',
        },
        {
          title: 'Brand Growth',
          description: 'Feel your brand presence expand as you utilize every element to reinforce your message.',
          icon: { iconId: 'target' },
          color: 'amber',
          href: '#growth',
        },
      ],
      style: { iconSize: 'lg', iconStyle: 'solid' },
    },
    getCarouselDemo(),
    getMasonryDemo(),
    {
      layout: { style: 'cards', columns: '3', spacing: 'normal', align: 'center' },
      items: [
        {
          title: 'Brand Presence',
          description: 'Experience how card layouts create a sophisticated, memorable impression of your brand.',
          icon: { iconId: 'bookmark' },
          color: 'blue',
          action: { buttons: [{ label: 'Explore', design: 'ghost' }] },
        },
        {
          title: 'Customer Journey',
          description: 'Notice how each card becomes a stepping stone in your customer\'s journey?',
          icon: { iconId: 'map' },
          color: 'violet',

        },
        {
          title: 'Growth Metrics',
          description: 'Watch your brand metrics improve as you optimize each touchpoint.',
          icon: { iconId: 'chart-line' },
          color: 'emerald',
        },
      ],
      style: { iconSize: 'md', iconStyle: 'solid' },
    },
  ]
}

export async function getConfig(args: { factory: CardFactory, templateId: string }) {
  const { templateId } = args
  return {
    schema,
    options,
    userConfig: getDefaultConfig(),
    demoPage: {
      cards: [
        { templateId, userConfig: getDefaultConfig() },
        ...getLayoutDemos().map(config => ({
          templateId,
          userConfig: config,
        })),
      ],
    },
  }
}
