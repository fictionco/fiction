import type { inputs } from '@factor/ui'
import { FactorObject, vue } from '@factor/api'

interface InputOptionConfig<S extends string> {
  optionKey: S
  label?: string
  description?: string
  subLabel?: string
  input: keyof typeof inputs | vue.Component
  props?: vue.ComputedRef<Record<string, unknown>>
  core?: boolean
  category?: 'media' | 'validation' | 'handling' | 'info' | 'design'
  isVisible?: vue.ComputedRef<boolean>
}

export class InputOption<S extends string> extends FactorObject<
  InputOptionConfig<S>
> {
  optionKey = this.settings.optionKey
  label = this.settings.label || this.utils.toLabel(this.settings.optionKey)
  description = this.settings.description || ''
  subLabel = this.settings.subLabel || ''
  input = this.settings.input
  props = this.settings.props || vue.ref({})
  category = this.settings.category
  isVisible = this.settings.isVisible || vue.computed(() => true)

  constructor(settings: InputOptionConfig<S>) {
    super('InputOption', settings)
  }
}
