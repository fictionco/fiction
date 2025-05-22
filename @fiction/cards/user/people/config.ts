import type { CardFactory } from '@fiction/site/cardFactory'
import type { StandardUserConfig } from '@fiction/site/schema'
import type { StockMedia } from '@fiction/ui/stock/index.js'
import { PostSchema } from '@fiction/core'
import { createOption } from '@fiction/ui'
import { z } from 'zod/v4'

// Schema definition with all fields optional
const MemberSchema = PostSchema.pick({ title: true, subTitle: true, content: true, media: true, action: true })

export const schema = z.object({
  layout: z.enum(['mediabox', 'grid']).optional().meta({ ai: false, description: 'Team display format' }),
  title: z.string().optional().meta({ ai: true, description: 'Team section title' }),
  subTitle: z.string().optional().meta({ ai: true, description: 'Team description' }),
  items: z.array(MemberSchema).optional().meta({ ai: true, description: 'Team member list' }),
})

export type UserConfig = z.infer<typeof schema> & StandardUserConfig
type MemberConfig = z.infer<typeof MemberSchema>

function getOptions() {
  return [
    createOption({
      schema,
      input: 'group',
      key: 'groupPeopleItems',
      label: 'Members',
      icon: { class: 'i-tabler-users' },
      options: [
        createOption({
          schema,
          key: 'items',
          input: 'InputList',
          label: 'Team Members',
          props: {
            itemName: 'Member',
            itemLabel: args => (args?.item as MemberConfig)?.title ?? 'Untitled',
          },
          options: [
            createOption({
              schema,
              key: 'items.0.title',
              input: 'InputText',
              label: 'Full Name',
              placeholder: 'Enter their name',
            }),
            createOption({
              schema,
              key: 'items.0.subTitle',
              input: 'InputText',
              label: 'Role or Sub Title',
              placeholder: 'e.g., Chief Innovation Officer',
            }),
            createOption({
              schema,
              key: 'items.0.content',
              input: 'InputTextarea',
              label: 'Details',
              placeholder: 'Share their story, expertise and impact',
            }),
            createOption({
              schema,
              key: 'items.0.media',
              input: 'InputMedia',
              label: 'Profile Photo',
              props: {
                formats: { url: true },
                aspectRatio: '4:5',
                placeholder: 'Upload a professional headshot',
              },
            }),
            createOption({
              schema,
              key: 'items.0.action.buttons',
              input: 'InputActions',
              label: 'Links / Actions',
            }),
          ],
        }),
      ],
    }),
    createOption({
      schema,
      input: 'group',
      key: 'groupPeopleSettings',
      label: 'Settings',
      icon: { class: 'i-tabler-settings' },
      options: [
        createOption({
          schema,
          key: 'layout',
          input: 'InputRadioButton',
          props: { uiSize: 'sm' },
          label: 'Layout Style',
          list: [
            { value: 'mediabox', label: 'Media Box', description: 'Large portraits with side text' },
            { value: 'grid', label: 'Grid', description: 'Modern gallery style layout' },
          ],
        }),
        createOption({
          schema,
          key: 'title',
          input: 'InputText',
          label: 'Overview Heading',
          placeholder: 'e.g., Meet the Minds Behind Our Success',
        }),
        createOption({
          schema,
          key: 'subTitle',
          input: 'InputText',
          label: 'Overview Subheading',
          placeholder: 'Share what makes your team unique',
        }),
      ],
    }),

  ]
}

async function getDefaultConfig(args: { stock: StockMedia }): Promise<UserConfig> {
  const { stock } = args
  return {
    layout: 'grid',
    title: 'Build Trust with Faces',
    subTitle: 'Notice how a well-crafted team section instantly builds credibility. Add your team members to create meaningful connections with visitors.',
    items: [{
      title: 'Your Team Member',
      subTitle: 'Share Their Role',
      content: 'Imagine the impact of sharing their unique story. What expertise do they bring? What accomplishments make them stand out? Use this space to help visitors connect with your team personally.',
      media: stock.getRandomByTags(['person']),
      action: {
        buttons: [
          {
            label: 'LinkedIn',
            icon: { class: 'i-tabler-brand-linkedin' },
            href: 'https://linkedin.com/in/username',
          },
        ],
      },
    }],
  }
}

async function getDemoConfigs(args: { stock: StockMedia }): Promise<Record<string, UserConfig>> {
  const { stock } = args
  return {
    startup: {
      layout: 'grid',
      title: 'Meet Our Innovators',
      subTitle: 'Feel the energy of a team that\'s reshaping the future of technology, one breakthrough at a time.',
      items: [{
        title: 'Alexandra Rivera',
        subTitle: 'Innovation Lead',
        content: 'Visualize the possibilities with Alexandra leading the way. Previously scaled three AI startups, now revolutionizing how we approach machine learning ethics.',
        media: stock.getRandomByTags(['woman']),
        action: {
          buttons: [
            { label: 'LinkedIn', icon: { class: 'i-tabler-brand-linkedin' }, href: '#' },
            { label: 'Twitter', icon: { class: 'i-tabler-brand-x' }, href: '#' },
          ],
        },
      }, {
        title: 'David Kim',
        subTitle: 'Product Architect',
        content: 'Experience seamless innovation through David\'s vision. His design-thinking approach has transformed user experiences for over 2M+ customers globally.',
        media: stock.getRandomByTags(['man']),
        action: {
          buttons: [
            { label: 'LinkedIn', icon: { class: 'i-tabler-brand-linkedin' }, href: '#', theme: 'cyan' },
            { label: 'GitHub', icon: { class: 'i-tabler-brand-github' }, href: '#', theme: 'blue' },
          ],
        },
      }],
    },
    creative: {
      layout: 'mediabox',
      title: 'Creative Minds',
      subTitle: 'Discover the artists and strategists crafting unforgettable brand experiences.',
      items: [{
        title: 'Sophie Laurent',
        subTitle: 'Creative Director',
        content: 'Watch your brand transform under Sophie\'s creative direction. Her award-winning campaigns have captured hearts and headlines across three continents.',
        media: stock.getRandomByTags(['woman']),
        action: {
          buttons: [
            { label: 'Instagram', icon: { class: 'i-tabler-brand-instagram' }, href: '#', theme: 'rose' },
            { label: 'Behance', icon: { class: 'i-tabler-brand-behance' }, href: '#', theme: 'amber' },
          ],
        },
      }, {
        title: 'Marcus Chen',
        subTitle: 'Brand Strategist',
        content: 'Feel the impact of strategic storytelling with Marcus at the helm. His data-driven approach has helped startups achieve 300% growth in brand recognition.',
        media: stock.getRandomByTags(['man']),
        action: {
          buttons: [
            { label: 'LinkedIn', icon: { class: 'i-tabler-brand-linkedin' }, href: '#', theme: 'cyan' },
            { label: 'Medium', icon: { class: 'i-tabler-brand-medium' }, href: '#', theme: 'purple' },
          ],
        },
      }],
    },
    default: await getDefaultConfig({ stock }),
  }
}

export async function getConfig(args: { factory: CardFactory, templateId: string }) {
  const { templateId, factory } = args
  const stock = await factory.getStockMedia()
  const demos = await getDemoConfigs({ stock })
  return {
    schema,
    options: getOptions(),
    userConfig: await getDefaultConfig({ stock }),
    demoPage: {
      cards: Object.entries(demos).map(([_key, config]) => ({
        templateId,
        userConfig: config,
      })),
    },
  }
}
