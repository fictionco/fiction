import type { CardFactory } from '@fiction/site/cardFactory'
import type { StandardUserConfig } from '@fiction/site/schema'
import type { StockMedia } from '@fiction/ui/stock'
import { NavListItemSchema } from '@fiction/core'
import { createOption } from '@fiction/ui'
import { z } from 'zod/v4'

const logoSchema = NavListItemSchema.pick({
  label: true,
  href: true,
  media: true,
  theme: true,
})

// Schema
export const schema = z.object({
  label: z.string().optional().meta({ ai: false, description: 'Section title or heading' }),
  layout: z.enum(['inline', 'stacked']).optional().meta({ ai: false, description: 'Logo arrangement style' }),
  items: z.array(logoSchema).optional().meta({ ai: false, description: 'Collection of logos to display' }),
})

export type LogoConfig = z.infer<typeof logoSchema>
export type UserConfig = z.infer<typeof schema> & StandardUserConfig

export const options = [
  createOption({
    key: 'contentGroup',
    label: 'Content',
    input: 'group',
    icon: { class: 'i-tabler-highlight' },
    options: [
      createOption({
        schema,
        key: 'label',
        label: 'Label Text',
        input: 'InputText',
        props: {
          placeholder: 'e.g. Trusted By Industry Leaders',
        },
      }),
      createOption({
        schema,
        key: 'items',
        label: 'Logos',
        input: 'InputList',
        options: [
          createOption({ schema, key: 'items.0.label', label: 'Company Name', input: 'InputText' }),
          createOption({ schema, key: 'items.0.href', label: 'Link URL', input: 'InputSiteRoute' }),
          createOption({ schema, key: 'items.0.media', label: 'Logo', input: 'InputMedia' }),
          createOption({ schema, key: 'items.0.theme', label: 'Theme', input: 'InputColorTheme' }),
        ],
      }),
    ],
  }),
  createOption({
    key: 'settingsGroup',
    label: 'Settings',
    input: 'group',
    icon: { class: 'i-tabler-settings' },
    options: [
      createOption({
        schema,
        key: 'layout',
        label: 'Layout Style',
        input: 'InputRadioButton',
        props: { uiSize: 'sm' },
        list: [
          { label: 'Inline', value: 'inline' },
          { label: 'Stacked', value: 'stacked' },
        ],
      }),
    ],
  }),

]

// Default configuration
export function getUserConfig(args: { stock: StockMedia, withColor: boolean }): UserConfig {
  const { stock, withColor = false } = args
  return {
    label: 'Trusted By Industry Leaders',
    items: [
      {
        label: 'Coke',
        media: stock.getLocalMedia({ key: 'logoCoke' }),
        href: '#',
        theme: withColor ? 'red' : undefined,
      },
      {
        label: 'Tesla',
        media: stock.getLocalMedia({ key: 'logoTesla' }),
        href: '#',
        theme: withColor ? 'blue' : undefined,
      },
      {
        label: 'Roblox',
        media: stock.getLocalMedia({ key: 'logoRoblox' }),
        href: '#',
        theme: withColor ? 'green' : undefined,
      },
      {
        label: 'Balenciaga',
        media: stock.getLocalMedia({ key: 'logoBalenciaga' }),
        href: '#',
        theme: withColor ? 'pink' : undefined,
      },
      {
        label: 'SpaceX',
        media: stock.getLocalMedia({ key: 'logoSpaceX' }),
        href: '#',
        theme: withColor ? 'indigo' : undefined,
      },

    ],
  }
}

// Demo configurations
export function getDemoConfigs(args: { templateId: string, stock: StockMedia }): Record<string, { templateId: string, userConfig: UserConfig }> {
  const { templateId } = args
  return {
    inline: {
      templateId,
      userConfig: {
        ...getUserConfig({ ...args, withColor: false }),
        layout: 'inline',
      },
    },
    inlineColor: {
      templateId,
      userConfig: {
        ...getUserConfig({ ...args, withColor: true }),
        layout: 'inline',
      },
    },
    stacked: {
      templateId,
      userConfig: {
        ...getUserConfig({ ...args, withColor: false }),
        layout: 'stacked',
      },
    },
    stackedColor: {
      templateId,
      userConfig: {
        ...getUserConfig({ ...args, withColor: true }),
        layout: 'stacked',
      },
    },

  }
}

export async function getConfig(args: { templateId: string, factory: CardFactory }) {
  const { factory } = args
  const stock = await factory.getStockMedia()

  return {
    schema,
    options,
    userConfig: getUserConfig({ ...args, stock, withColor: false }),
    demoPage: {
      cards: Object.values(getDemoConfigs({ ...args, stock })),
    },
  }
}
