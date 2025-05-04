import type { Card } from './card'
import { colorThemeBright, SizeSchemaComplete } from '@fiction/core'
import { createOption } from '@fiction/ui'
import { StandardUserConfigSchema as schema } from './schema'

export function standardCardOptions(args: { card: Card }) {
  const { card } = args
  return createOption({
    label: 'Styling',
    key: 'group.styling',
    icon: { class: 'i-tabler-palette' },
    input: 'group',
    options: [
      createOption({ key: 'standard.background', label: 'Background', input: 'InputMedia', props: { isBackground: true }, schema }),
      createOption({ key: 'standard.primaryColor', label: 'Primary Color', input: 'InputSelectCustom', list: [{ label: 'Default', value: '' }, ...colorThemeBright], schema }),
      createOption({ schema, key: 'standard.widthSize', label: 'Content Width', input: 'InputSelectCustom', list: [{ label: 'Default', value: '' }, ...SizeSchemaComplete.options] }),
      createOption({ schema, key: 'standard.spaceSize', label: 'Vertical Spacing', input: 'InputSelectCustom', list: [{ label: 'Default', value: '' }, ...SizeSchemaComplete.options] }),

    ],
  })
}
