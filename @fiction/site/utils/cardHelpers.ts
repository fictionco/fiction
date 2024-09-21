import type { Card } from '../card'
import { vue } from '@fiction/core'
import { InputOption } from '@fiction/ui'
import { standardCardOptions } from '../cardStandard'

export function getCardOptionConfig(args: { card?: Card }) {
  const { card } = args
  return vue.computed(() => {
    if (!card)
      return []

    const tpl = card?.tpl.value
    const tplOptions = tpl?.settings.options || []
    const out = []
    if (tplOptions) {
      out.push(new InputOption({ key: 'specific', label: 'Element Options', input: 'group', options: tplOptions }))
    }

    out.push(standardCardOptions({ card }))

    return out as InputOption<any>[]
  })
}
