import type { StandardUserConfig } from '@fiction/site/schema'
import { fontFamilySchema } from '@fiction/core'
import { createOption } from '@fiction/ui'
import { z } from 'zod/v4'

export const schema = z.object({
  text: z.string().optional().meta({ ai: true, description: 'Text that dynamically adjusts to fill available space' }),
  lines: z.number().optional().meta({ ai: false, description: 'Number of lines to display (1-5)' }),
  minFontSize: z.number().optional().meta({ ai: false, description: 'Minimum font size to maintain readability' }),
  maxFontSize: z.number().optional().meta({ ai: false, description: 'Maximum font size for visual impact' }),
  font: fontFamilySchema.optional().meta({ ai: false, description: 'Font family selection for brand personality' }),
  align: z.enum(['inherit', 'left', 'center', 'right']).optional().meta({ ai: false, description: 'Text alignment' }),
  weight: z.enum(['inherit', 'normal', 'medium', 'semibold', 'bold']).optional().meta({ ai: false, description: 'Font weight' }),
})

export type UserConfig = z.infer<typeof schema> & StandardUserConfig

const options = [
  createOption({
    schema,
    input: 'group',
    key: 'group.content',
    label: 'Content',
    icon: { iconId: 'text-size' },
    options: [
      createOption({
        schema,
        key: 'text',
        label: 'Message',
        description: 'Watch your text dynamically resize to perfectly fill the space',
        input: 'InputTextarea',
        props: {
          placeholder: 'Enter your message - it will automatically fit the space perfectly',
          rows: 2,
        },
      }),
      createOption({
        schema,
        key: 'lines',
        label: 'Line Count',
        description: 'Choose how many lines your message spans:\n• 1 line: Punchy headlines\n• 2 lines: Balanced statements\n• 3+ lines: Detailed messages',
        input: 'InputNumber',
        props: {
          min: 1,
          max: 5,
        },
      }),
      createOption({
        schema,
        key: 'font',
        label: 'Typography',
        description: 'Select a font that matches your message tone:\n• Serif: Elegant & traditional\n• Sans-serif: Modern & clean\n• Display: Bold & distinctive',
        input: 'InputFont',
      }),
      createOption({
        schema,
        key: 'style',
        label: 'Text Style',
        input: 'group',
        options: [
          createOption({
            schema,
            key: 'align',
            label: 'Alignment',
            input: 'InputRadioButton',
            props: { uiSize: 'sm' },
            list: [
              { label: 'Left', value: 'left' },
              { label: 'Center', value: 'center' },
              { label: 'Right', value: 'right' },
            ],
          }),
          createOption({
            schema,
            key: 'weight',
            label: 'Weight',
            input: 'InputRadioButton',
            props: { uiSize: 'sm' },
            list: [
              { label: 'Normal', value: 'normal' },
              { label: 'Medium', value: 'medium' },
              { label: 'Semibold', value: 'semibold' },
              { label: 'Bold', value: 'bold' },
            ],
          }),
        ],
      }),
    ],
  }),

  createOption({
    schema,
    key: 'sizing',
    label: 'Size Controls',
    input: 'group',
    options: [
      createOption({
        schema,
        key: 'minFontSize',
        label: 'Minimum Size',
        description: 'Smallest allowed size to maintain readability',
        input: 'InputNumber',
        props: {
          min: 12,
          max: 48,
        },
      }),
      createOption({
        schema,
        key: 'maxFontSize',
        label: 'Maximum Size',
        description: 'Largest allowed size for visual impact',
        input: 'InputNumber',
        props: {
          min: 32,
          max: 500,
        },
      }),
    ],
  }),
]

export function getUserConfig(): UserConfig {
  return {
    text: `It's a perfect fit.`,
    lines: 1,
    minFontSize: 24,
    maxFontSize: 180,
    font: { family: 'Poppins' },
    align: 'center',
    weight: 'bold',
  }
}

function getDemoConfigs(templateId: string): Record<string, { templateId: string, userConfig: UserConfig }> {
  return {
    headline: {
      templateId,
      userConfig: {
        standard: {
          widthSize: 'full',
          headers: {
            title: 'Bold Impact Headlines',
            subTitle: 'Perfect for hero sections and primary messages',
          },
        },
        text: 'Imagine The Possibilities...',
        lines: 1,
        minFontSize: 32,
        maxFontSize: 200,
        font: { family: 'Fraunces' },
        align: 'center',
      },
    },
    elegantStatement: {
      templateId,
      userConfig: {
        standard: {
          headers: {
            title: 'Elegant Multi-line Statements',
            subTitle: 'Ideal for mission statements and brand messaging',
          },
        },
        text: 'Yesterday you said tomorrow.',

        lines: 2,
        minFontSize: 28,
        maxFontSize: 120,
        font: { family: 'Cormorant' },
        align: 'center',
        weight: 'medium',
      },
    },
    modernTech: {
      templateId,
      userConfig: {
        standard: {
          headers: {
            title: 'Technical & Modern',
            subTitle: 'Great for feature highlights and technical content',
          },
        },
        text: 'Change your story. Change your life.',
        lines: 3,
        minFontSize: 24,
        maxFontSize: 90,
        font: { family: 'Space Grotesk' },
        align: 'left',
        weight: 'medium',
      },
    },
    creative: {
      templateId,
      userConfig: {
        standard: {
          headers: {
            title: 'Creative & Dynamic',
            subTitle: 'Perfect for artistic and expressive content',
          },
        },
        text: 'Let\'s create something beautiful together.',
        lines: 1,
        minFontSize: 32,
        maxFontSize: 160,
        font: { family: 'Caveat' },
        align: 'center',
        weight: 'bold',
      },
    },
    impactStatement: {
      templateId,
      userConfig: {
        standard: {
          headers: {
            title: 'High-Impact Features',
            subTitle: 'Showcase key benefits and features',
          },
        },
        text: 'What can you do today to improve tomorrow?',
        lines: 2,
        minFontSize: 28,
        maxFontSize: 100,
        font: { family: 'Plus Jakarta Sans' },
        align: 'center',
        weight: 'semibold',
      },
    },
    default: {
      templateId,
      userConfig: getUserConfig(),
    },
  }
}

export async function getDemo(args: { templateId: string }) {
  const { templateId } = args
  return {
    cards: Object.values(getDemoConfigs(templateId)),
  }
}

export async function getConfig(args: { templateId: string }) {
  return {
    schema,
    options,
    userConfig: getUserConfig(),
    demoPage: await getDemo(args),
  }
}
