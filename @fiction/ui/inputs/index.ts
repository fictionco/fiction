import type { ListItem } from '@fiction/core'
import { FictionObject, removeUndefined, vue } from '@fiction/core'
import type { z } from 'zod'

const def = vue.defineAsyncComponent

export const inputs: Record<string, { el: vue.Component, shape?: string[] }> = {
  InputProse: { el: def(async () => import('./InputProse.vue')) },
  InputActions: { el: def(async () => import('./InputActions.vue')) },
  InputItems: { el: def(async () => import('./InputItems.vue')) },
  InputUsername: { el: def(async () => import('./InputUsername.vue')) },
  InputImage: { el: def(async () => import('./InputImage.vue')) },
  InputMarkdown: { el: def(async () => import('./InputMarkdown.vue')) },
  InputList: { el: def(async () => import('./InputList.vue')) },
  InputEmail: { el: def(async () => import('./InputEmail.vue')) },
  InputOneTimeCode: { el: def(async () => import('./InputOneTimeCode.vue')) },
  InputText: { el: def(async () => import('./InputText.vue')) },
  InputUrl: { el: def(async () => import('./InputUrl.vue')) },
  InputToggle: { el: def(async () => import('./InputToggle.vue')) },
  InputCheckbox: { el: def(async () => import('./InputCheckbox.vue')) },
  InputCheckboxMulti: { el: def(async () => import('./InputCheckboxMulti.vue')) },
  InputRadio: { el: def(async () => import('./InputRadio.vue')) },
  InputRadioButton: { el: def(async () => import('./InputRadioButton.vue')) },
  InputSelect: { el: def(async () => import('./InputSelect.vue')) },
  InputSelectCustom: { el: def(async () => import('./InputSelectCustom.vue')) },
  InputTimezone: { el: def(async () => import('./InputTimezone.vue')) },
  InputPrice: { el: def(async () => import('./InputPrice.vue')) },
  InputPhone: { el: def(async () => import('./InputPhone.vue')) },
  InputSubmit: { el: def(async () => import('./InputSubmit.vue')) },
  InputPassword: { el: def(async () => import('./InputPassword.vue')) },
  InputTextarea: { el: def(async () => import('./InputTextarea.vue')) },
  InputWeight: { el: def(async () => import('./InputWeight.vue')) },
  InputNumber: { el: def(async () => import('./InputNumber.vue')) },
  InputMediaUpload: { el: def(async () => import('./InputMediaUpload.vue')), shape: ['url'] },
  InputMediaDisplay: { el: def(async () => import('./InputMediaDisplay.vue')), shape: ['url', 'format', 'html'] },
  InputRanking: { el: def(async () => import('./InputRanking.vue')) },
  InputMultipleChoice: { el: def(async () => import('./InputMultipleChoice.vue')) },
  InputRating: { el: def(async () => import('./InputRating.vue')) },
  InputChoice: { el: def(async () => import('./InputChoice.vue')) },
  InputDate: { el: def(async () => import('./InputDate.vue')) },
  InputColor: { el: def(async () => import('./InputColor.vue')) },
  InputFont: { el: def(async () => import('./InputFont.vue')) },
  InputColorScheme: { el: def(async () => import('./InputColorScheme.vue')) },
  InputRange: { el: def(async () => import('./InputRange.vue')) },
  InputDropDown: { el: def(async () => import('./InputDropDown.vue')) },
  InputOverlay: { el: def(async () => import('./InputOverlay.vue')) },
  InputGradient: { el: def(async () => import('./InputGradient.vue')), shape: ['angle', 'stops', 'stops.0.color', 'stops.0.percent', 'css'] },
}

type SchemaCallback = (args: { z: typeof z, subSchema: z.AnyZodObject }) => z.Schema

export type InputOptionGeneration = {
  prompt?: string
  isEnabled?: boolean
  estimatedMs?: number
  key?: string
  label?: string
  cumulativeTime?: number
}

export interface InputOptionSettings<T extends string = string, U = any> {
  key: T
  aliasKey?: string
  label?: string
  description?: string
  subLabel?: string
  placeholder?: string
  input?: keyof typeof inputs | 'title' | 'group' | vue.Component
  isRequired?: boolean
  props?: Record<string, unknown>
  options?: InputOption[]
  list?: (ListItem | string)[] | readonly (ListItem | string)[]
  default?: () => U
  schema?: SchemaCallback
  generation?: InputOptionGeneration
  isHidden?: boolean
  isUtility?: boolean
  shape?: string[]
  icon?: string
  inputClass?: string
  uiFormat?: 'standard' | 'naked' | 'fullWidth'
}

export type OptArgs = (Partial<InputOptionSettings> & Record<string, unknown>) | undefined

type InputOptionConfig = Omit<InputOptionSettings, 'options'> & { options?: InputOptionConfig[] }

export class InputOption<T extends string = string, U = any> extends FictionObject<InputOptionSettings<T, U>> {
  key = vue.ref(this.settings.key)
  aliasKey = vue.ref(this.settings.aliasKey || this.key)
  input = vue.shallowRef(this.settings.input)
  shape = vue.ref(typeof this.input.value === 'string' ? inputs[this.input.value]?.shape || [] : [])
  label = vue.ref(this.settings.label)
  subLabel = vue.ref(this.settings.subLabel)
  placeholder = vue.ref(this.settings.placeholder)
  isRequired = vue.ref(this.settings.isRequired || false)
  isHidden = vue.ref(this.settings.isHidden || false)
  description = vue.ref(this.settings.description)
  options = vue.shallowRef(this.settings.options || [])
  list = vue.shallowRef(this.settings.list)
  default = this.settings.default
  schema = vue.shallowRef(this.settings.schema)
  generation = vue.ref(this.settings.generation || {})

  props = vue.shallowRef(this.settings.props)

  outputProps = vue.computed(() => {
    return {
      label: this.label.value,
      subLabel: this.subLabel.value,
      description: this.description.value,
      placeholder: this.placeholder.value,
      required: this.isRequired.value,
      key: this.key.value,
      options: this.options.value,
      list: this.list.value,
      ...this.props.value,
    }
  })

  update(config: Partial<InputOptionSettings<T, U>>) {
    Object.entries(config).forEach(([key, value]) => {
      if (value !== undefined && vue.isRef(this[key as keyof typeof this]))
        (this[key as keyof typeof this] as vue.Ref).value = value
    })

    return this
  }

  constructor(settings: InputOptionSettings<T, U>) {
    super('InputOption', settings)
  }

  toConfig(): InputOptionConfig {
    const subOptions = this.options.value?.map(option => option.toConfig())
    return removeUndefined({
      key: this.key.value,
      aliasKey: this.aliasKey.value,
      label: this.label.value,
      description: this.description.value,
      input: this.input.value,
      props: { ...this.outputProps.value, options: subOptions },
      options: subOptions,
      shape: this.shape.value,
    })
  }
}
