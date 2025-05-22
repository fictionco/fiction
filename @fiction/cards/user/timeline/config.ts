import type { CardFactory } from '@fiction/site/cardFactory'
import type { StandardUserConfig } from '@fiction/site/schema'
import type { StockMedia } from '@fiction/ui/stock'
import { ActionAreaSchema, dayjs, PostSchema } from '@fiction/core'
import { createOption } from '@fiction/ui'
import { z } from 'zod/v4'

const MilestoneSchema = PostSchema.pick({
  title: true,
  subTitle: true,
  content: true,
  media: true,
  icon: true,
  action: true,
}).extend({
  date: z.string().optional(),
  endDate: z.string().optional(),
  badges: ActionAreaSchema.optional(),
})

export const schema = z.object({
  items: z.array(MilestoneSchema).optional(),
})

export type UserConfig = z.infer<typeof schema> & StandardUserConfig
type MilestoneConfig = z.infer<typeof MilestoneSchema>

export function getOptions() {
  return [

    createOption({
      schema,
      key: 'items',
      label: 'Milestones',
      input: 'InputList',
      props: {
        itemName: 'Milestone',
        itemLabel: args => (args?.item as MilestoneConfig)?.title ?? 'Untitled',
      },
      options: [

        createOption({
          input: 'group',
          key: 'dateRange',
          label: 'Date Range',
          options: [

            createOption({
              schema,
              key: 'items.0.date',
              label: 'Start Date',
              input: 'InputDate',
            }),
            createOption({
              schema,
              key: 'items.0.endDate',
              label: 'End Date',
              input: 'InputDate',
            }),
          ],
        }),
        createOption({
          input: 'group',
          key: 'milestoneContentGroup',
          label: 'Content',
          options: [
            createOption({
              schema,
              key: 'items.0.icon',
              label: 'Icon',
              input: 'InputIcon',
            }),
            createOption({
              schema,
              key: 'items.0.title',
              label: 'Milestone Title',
              input: 'InputText',
              isRequired: true,
            }),
            createOption({
              schema,
              key: 'items.0.subTitle',
              label: 'Milestone Subtitle',
              input: 'InputText',
            }),
            createOption({
              schema,
              key: 'items.0.content',
              label: 'Description',
              input: 'InputTextarea',
            }),
            createOption({
              schema,
              key: 'items.0.media',
              label: 'Image',
              input: 'InputMedia',
            }),
            createOption({
              schema,
              key: 'items.0.badges.buttons',
              label: 'Badges',
              input: 'InputActions',
              props: { variants: ['buttons'] },
            }),
          ],
        }),

        createOption({
          schema,
          key: 'items.0.action.buttons',
          input: 'InputActions',
        }),
      ],
    }),
  ]
}

export function getDemoConfig(args: { stock: StockMedia }): UserConfig {
  const { stock } = args
  return {
    items: [
      {
        date: '2024',
        endDate: 'Present',
        title: 'Major Product Launch',
        subTitle: 'Led Development of Core Platform',
        content: 'Orchestrated successful launch of company\'s flagship analytics platform. Increased monthly recurring revenue by 127% and reduced customer onboarding time from 14 days to 48 hours.',
        icon: { iconId: 'rocket' },
        badges: {
          buttons: [
            { label: 'Tech Lead', theme: 'emerald' },
            { label: 'Launch', theme: 'blue' },
          ],
        },
        media: stock.getRandomByTags(['aspect:landscape']),
        action: {
          buttons: [
            { label: 'View Case Study', href: '#', theme: 'primary' },
          ],
        },
      },
      {
        date: '2023',
        endDate: '2024',
        title: 'Team Expansion & Process Optimization',
        subTitle: 'Engineering Excellence Initiative',
        content: 'Scaled engineering team from 4 to 15 while maintaining code quality. Implemented CI/CD pipeline reducing deployment time by 65% and cutting production incidents by half.',
        icon: { iconId: 'users-plus' },
        badges: {
          buttons: [
            { label: 'Leadership', theme: 'violet' },
            { label: 'DevOps', theme: 'amber' },
          ],
        },
      },
      {
        date: '2022',
        endDate: '2023',
        title: 'Infrastructure Modernization',
        subTitle: 'Cloud Migration Project',
        content: 'Successfully migrated legacy systems to cloud infrastructure, resulting in 40% cost reduction and 99.99% uptime. Introduced microservices architecture improving system scalability.',
        icon: { iconId: 'cloud' },
        badges: {
          buttons: [
            { label: 'Architecture', theme: 'cyan' },
            { label: 'Cloud', theme: 'slate' },
          ],
        },
      },
    ],
  }
}

export function getDefaultConfig(): UserConfig {
  return {
    items: [
      {
        date: dayjs().toISOString(),
        title: 'Achievement Title',
        subTitle: 'Role or Project Focus',
        content: 'Describe the impact: Include metrics, scale, and business outcomes.',
        icon: { class: 'i-tabler-flag' },
      },
    ],
  }
}

export async function getConfig(args: { templateId: string, factory: CardFactory }) {
  const { templateId, factory } = args
  const stock = await factory.getStockMedia()
  return {
    schema,
    options: getOptions(),
    userConfig: getDefaultConfig(),
    demoPage: {
      cards: [
        {
          templateId,
          userConfig: getDemoConfig({ ...args, stock }),
        },
      ],
    },
  }
}
