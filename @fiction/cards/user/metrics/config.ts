import type { StandardUserConfig } from '@fiction/site/schema'
import { NavListItemSchema, numberFormats } from '@fiction/core'
import { createOption } from '@fiction/ui'
import { z } from 'zod/v4'

export const MetricSchema = NavListItemSchema.pick({
  label: true,
  description: true,
  value: true,
  icon: true,
  theme: true,
  emphasis: true,
}).extend({
  format: z.enum(numberFormats).optional(),
}).meta({ description: 'Metric item with label, description, value, and icon' })

export type MetricItem = z.infer<typeof MetricSchema>

export const schema = z.object({
  layout: z.enum(['grid', 'inline', 'featured']).optional(),
  items: z.array(MetricSchema).optional(),
})

export type UserConfig = z.infer<typeof schema> & StandardUserConfig

const options = [
  createOption({
    schema,
    key: 'group.content',
    label: 'Content',
    input: 'group',
    icon: { class: 'i-tabler-numbers' },
    options: [

      createOption({
        schema,
        key: 'items',
        label: 'items',
        input: 'InputList',
        props: {
          itemLabel: 'Metric',
        },
        options: [
          createOption({
            schema,
            key: 'items.0.label',
            label: 'Metric Name',
            input: 'InputText',
            props: {
              placeholder: 'e.g., "Customer Growth"',
            },
          }),
          createOption({
            schema,
            key: 'items.0.description',
            label: 'Description',
            input: 'InputText',
            props: {
              placeholder: 'Add context or timeframe',
            },
          }),
          createOption({
            schema,
            key: 'items.0.value',
            label: 'Value',
            input: 'InputNumber',
          }),
          createOption({
            schema,
            key: 'items.0.format',
            label: 'Number Format',
            input: 'InputSelect',
            list: numberFormats,
          }),

        ],
      }),
    ],
  }),

]

function defaultConfig(): UserConfig {
  return {
    layout: 'grid',
    items: [
      {
        label: 'Numbers Talk',
        description: 'Show impact with metrics',
        value: 999999,
        format: 'abbreviated',
        icon: { class: 'i-tabler-chart-arrows-vertical' },
        theme: 'emerald',
      },
    ],
  }
}

function getBrandGrowthDemo(): UserConfig {
  return {
    standard: { headers: {
      title: 'Impact',
      subTitle: 'See how we\'ve helped businesses transform their digital presence',
    } },

    layout: 'grid',
    items: [
      {
        label: 'Client Revenue Growth',
        description: 'Average increase in annual revenue',
        value: 127,
        format: 'percent',
        icon: { class: 'i-tabler-chart-arrows-vertical' },
        theme: 'emerald',
      },
      {
        label: 'Brand Recognition',
        description: 'Increase in brand awareness surveys',
        value: 83,
        format: 'percent',
        icon: { class: 'i-tabler-sparkles' },
        theme: 'violet',
      },
      {
        label: 'Success Stories',
        description: 'Brands transformed',
        value: 250,
        format: 'number',
        icon: { class: 'i-tabler-building-store' },
        theme: 'blue',
      },
    ],
  }
}

function getEngagementDemo(): UserConfig {
  return {
    standard: { headers: {
      title: 'Engagement That Drives Results',
      subTitle: 'Metrics from our most successful campaigns',
    } },

    layout: 'featured',
    items: [
      {
        label: 'Social Engagement',
        description: 'Monthly interactions across platforms',
        value: 1200000,
        format: 'abbreviated',
        icon: { class: 'i-tabler-heart-handshake' },
        theme: 'red',
        emphasis: 'highlighted',
      },
      {
        label: 'Conversion Rate',
        description: 'Average campaign performance',
        value: 12.5,
        format: 'percent',
        icon: { class: 'i-tabler-target-arrow' },
        theme: 'amber',
      },
      {
        label: 'ROI Multiple',
        description: 'Average return on ad spend',
        value: 4.7,
        icon: { class: 'i-tabler-chart-dots' },
        theme: 'emerald',
      },
    ],
  }
}

function getEcommerceDemo(): UserConfig {
  return {
    standard: { headers: {
      title: 'Our eCommerce Success Story',
      subTitle: 'Key performance indicators that drive our growth',
    } },

    layout: 'inline',
    items: [
      {
        label: 'Sales Growth',
        description: 'Year over year increase',
        value: 215,
        format: 'percent',
        icon: { class: 'i-tabler-shopping-cart' },
        theme: 'blue',
      },
      {
        label: 'Customer LTV',
        description: 'Average lifetime value',
        value: 2850,
        format: 'dollar',
        icon: { class: 'i-tabler-user-circle' },
        theme: 'emerald',
      },
      {
        label: 'New Markets',
        description: 'Countries expanded to',
        value: 12,
        format: 'number',
        icon: { class: 'i-tabler-world' },
        theme: 'indigo',
      },
    ],
  }
}

export async function getConfig(args: { templateId: string }) {
  return {
    schema,
    options,
    userConfig: defaultConfig(),
    demoPage: {
      cards: [
        { templateId: args.templateId, userConfig: getBrandGrowthDemo() },
        { templateId: args.templateId, userConfig: getEngagementDemo() },
        { templateId: args.templateId, userConfig: getEcommerceDemo() },
      ],
    },
  }
}
