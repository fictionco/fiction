import type { Card } from './card'
import { colorThemeBright, HeaderLayoutSchema, SizeSchema, SizeSchemaComplete } from '@fiction/core'
import { createOption } from '@fiction/ui'
import { StandardUserConfigSchema as schema } from './schema'

export function standardCardOptions(args: { card: Card }) {
  const { card } = args
  return createOption({
    label: 'Styling',
    key: 'group.styling',
    icon: { class: 'i-tabler-layout-grid' },
    input: 'group',
    options: [
      createOption({ key: 'standard.background', label: 'Background', input: 'InputMedia', props: { isBackground: true }, schema }),
      createOption({ key: 'standard.primaryColor', label: 'Primary Color', input: 'InputSelectCustom', list: colorThemeBright, schema }),
      createOption({ schema, key: 'standard.widthSize', label: 'Content Width', input: 'InputSelectCustom', list: SizeSchemaComplete.options }),
      createOption({ schema, key: 'standard.spaceSize', label: 'Vertical Spacing', input: 'InputSelectCustom', list: SizeSchemaComplete.options }),

    ],
  })
}
