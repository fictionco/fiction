import type { Card } from './card'
import { colorTheme, colorThemeBright, HeaderLayoutSchema, SizeSchema, SizeSchemaComplete } from '@fiction/core'
import { createOption } from '@fiction/ui'
import InputAi from './ai/InputAi.vue'
import { StandardUserConfigSchema as schema } from './schema'

export function standardCardOptions(args: { card: Card }) {
  const { card } = args
  return createOption({ key: 'standard', label: 'Standard Options', input: 'group', options: [
    createOption({
      key: 'group.ai',
      icon: { class: 'i-tabler-sparkles' },
      isClosed: true,
      label: 'AI Content Generation',
      input: 'group',
      options: [
        createOption({
          key: 'purpose',
          input: InputAi,
          isUtility: true,
          props: { site: card.site },
        }),
      ],
    }),
    createOption({
      key: 'group.headers',
      icon: { class: 'i-tabler-heading' },
      isClosed: true,
      label: 'Text Headers',
      input: 'group',
      options: [
        createOption({
          input: 'group',
          key: 'headersGroup',
          label: 'Header Content',
          options: [
            createOption({ key: 'standard.headers.title', label: 'Title', input: 'InputText', schema }),
            createOption({ key: 'standard.headers.subTitle', label: 'Sub Title', input: 'InputText', schema }),
            createOption({ key: 'standard.headers.superTitle', input: 'InputSuperTitle', schema, isClosed: true }),

          ],
        }),
        createOption({
          input: 'group',
          key: 'headersStyleGroup',
          label: 'Header Styling',
          options: [
            createOption({ key: 'standard.headers.layout', label: 'Layout', input: 'InputSelectCustom', list: HeaderLayoutSchema.options, schema }),
            createOption({ key: 'standard.headers.size', label: 'Size', input: 'InputSelectCustom', list: SizeSchema.options, schema }),
          ],
        }),

      ],
    }),
    createOption({
      key: 'group.space',
      icon: { class: 'i-tabler-viewport-wide' },
      isClosed: true,
      label: 'Width / Spacing',
      input: 'group',
      options: [
        createOption({ schema, key: 'standard.widthSize', label: 'Content Width', input: 'InputSelectCustom', list: SizeSchemaComplete.options }),
        createOption({ schema, key: 'standard.spaceSize', label: 'Vertical Spacing', input: 'InputSelectCustom', list: SizeSchemaComplete.options }),
      ],
    }),
    createOption({
      key: 'group.bg',
      icon: { class: 'i-tabler-background' },
      isClosed: true,
      label: 'Color / Background',
      input: 'group',
      options: [
        createOption({
          input: 'group',
          key: 'group.color.base',
          label: 'Background and Theme',
          icon: { class: 'i-tabler-background' },
          options: [
            createOption({ key: 'standard.background', label: 'Background', input: 'InputMedia', props: { isBackground: true }, schema }),
            createOption({ key: 'standard.primaryColor', label: 'Primary Color', input: 'InputSelectCustom', list: colorThemeBright, schema }),
            createOption({ key: 'standard.themeColor', label: 'Theme Color', input: 'InputSelectCustom', list: colorTheme, schema }),
          ],
        }),
        createOption({
          input: 'group',
          key: 'group.color.alt',
          label: 'Alt Background and Theme (Light Mode)',
          icon: { class: 'i-tabler-sun-moon' },
          isClosed: true,
          options: [
            createOption({ key: 'standard.backgroundAlt', label: 'Light Mode Background', input: 'InputMedia', props: { isBackground: true }, schema }),
            createOption({ key: 'standard.primaryColorAlt', label: 'Light Primary Color', input: 'InputSelectCustom', list: colorThemeBright, schema }),
            createOption({ key: 'standard.themeColorAlt', label: 'Light Theme Color', input: 'InputSelectCustom', list: colorTheme, schema }),
            createOption({
              key: 'standard.invertColorScheme',
              label: 'Reverse Ambient Color Mode',
              subLabel: 'If site is in light mode, use dark mode colors (and vice versa)',
              input: 'InputToggle',
              schema,
            }),
          ],
        }),

      ],
    }),
    createOption({
      key: 'standardFont',
      icon: { class: 'i-tabler-text-size' },
      isClosed: true,
      label: 'Font',
      input: 'group',
      options: [
        createOption({
          key: 'standard.fonts.title',
          label: 'Title',
          subLabel: 'Used for titles and headers',
          input: 'InputFont',
          schema,
        }),
        createOption({
          key: 'standard.fonts.body',
          label: 'Body',
          subLabel: 'Used for prose and general text',
          input: 'InputFont',
          schema,
        }),
        createOption({
          key: 'standard.fonts.highlight',
          label: 'Highlight',
          subLabel: 'Used for accents and callouts',
          input: 'InputFont',
          schema,
        }),
      ],
    }),
    createOption({
      key: 'group.handling',
      icon: { class: 'i-tabler-status-change' },
      isClosed: true,
      label: 'Page Handling',
      input: 'group',
      options: [
        createOption({
          key: 'standard.hideOnPage',
          label: 'Hide on Page',
          input: 'InputToggle',
          description: `Hide this element by default on the page. Useful for controlling elements on cards vs pages.`,
          schema,
        }),
        createOption({
          key: 'standard.showOnSingle',
          label: 'Show When Viewing Post',
          input: 'InputToggle',
          description: `Show this element when viewing a post, by default all elements are hidden unless configured otherwise.`,
          schema,
        }),
      ],
    }),
  ] })
}
