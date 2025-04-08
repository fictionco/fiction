import type { Card } from './card'
import { colorTheme, colorThemeBright, HeaderLayoutSchema, SizeSchema, SizeSchemaComplete } from '@fiction/core'
import { createOption } from '@fiction/ui'
import InputAi from './ai/InputAi.vue'
import { StandardUserConfigSchema as schema } from './schema'

export function standardCardOptions(args: { card: Card }) {
  const { card } = args
  return createOption({
    key: 'standard',
    label: 'Standard',
    icon: { class: 'i-tabler-layout-grid' },
    input: 'group',
    options: [
      createOption({
        key: 'group.bg',
        icon: { class: 'i-tabler-background' },
        isClosed: true,
        label: 'Background',
        input: 'group',
        options: [
          createOption({ key: 'standard.background', label: 'Background', input: 'InputMedia', props: { isBackground: true }, schema }),
          createOption({ key: 'standard.primaryColor', label: 'Primary Color', input: 'InputSelectCustom', list: colorThemeBright, schema }),
          createOption({ key: 'standard.themeColor', label: 'Theme Color', input: 'InputSelectCustom', list: colorTheme, schema }),

        ],
      }),
      // createOption({
      //   key: 'group.ai',
      //   icon: { class: 'i-tabler-sparkles' },
      //   isClosed: true,
      //   label: 'AI',
      //   input: 'group',
      //   options: [
      //     createOption({
      //       key: 'purpose',
      //       input: InputAi,
      //       isUtility: true,
      //       props: { site: card.site },
      //     }),
      //   ],
      // }),
      createOption({
        key: 'group.headers',
        icon: { class: 'i-tabler-heading' },
        isClosed: true,
        label: 'Headers',
        input: 'group',
        options: [
          createOption({
            input: 'group',
            key: 'headersGroup',
            label: 'Content',
            icon: { class: 'i-tabler-align-left' },
            options: [
              createOption({ key: 'standard.headers.title', label: 'Title', input: 'InputText', schema }),
              createOption({ key: 'standard.headers.subTitle', label: 'Sub Title', input: 'InputText', schema }),
              createOption({ key: 'standard.headers.superTitle', input: 'InputSuperTitle', schema, isClosed: true }),

            ],
          }),
          createOption({
            input: 'group',
            key: 'headersStyleGroup',
            label: 'Design',
            icon: { class: 'i-tabler-layout' },
            options: [
              createOption({ key: 'standard.headers.layout', label: 'Alignment', input: 'InputSelectCustom', list: HeaderLayoutSchema.options, schema }),
              createOption({ key: 'standard.headers.size', label: 'Size', input: 'InputSelectCustom', list: SizeSchema.options, schema }),
            ],
          }),

        ],
      }),
      createOption({
        key: 'group.space',
        icon: { class: 'i-tabler-viewport-wide' },
        isClosed: true,
        label: 'Space',
        input: 'group',
        options: [
          createOption({ schema, key: 'standard.widthSize', label: 'Content Width', input: 'InputSelectCustom', list: SizeSchemaComplete.options }),
          createOption({ schema, key: 'standard.spaceSize', label: 'Vertical Spacing', input: 'InputSelectCustom', list: SizeSchemaComplete.options }),
        ],
      }),

    ],
  })
}
