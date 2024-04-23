import type { ListItem } from '@fiction/core'
import { FictionObject, removeUndefined, vue } from '@fiction/core'
import type { JsonSchema7ObjectType } from 'zod-to-json-schema'
import zodToJsonSchema from 'zod-to-json-schema'
import type { z } from 'zod'

const def = vue.defineAsyncComponent

type SchemaDef = (args: { z: typeof z, subSchema: z.AnyZodObject }) => z.Schema

const gradientSetting: SchemaDef = ({ z }) => z.object({ angle: z.number(), stops: z.object({ color: z.string(), percent: z.number(), colorId: z.string() }), css: z.string() })

export const inputs: Record<string, { el: vue.Component, shape?: string[] }> = {
  InputUsername: { el: def(() => import('./InputUsername.vue')) },
  InputMarkdown: { el: def(() => import('./InputMarkdown.vue')) },
  InputList: { el: def(() => import('./InputList.vue')) },
  InputEmail: { el: def(() => import('./InputEmail.vue')) },
  InputOneTimeCode: { el: def(() => import('./InputOneTimeCode.vue')) },
  InputText: { el: def(() => import('./InputText.vue')) },
  InputUrl: { el: def(() => import('./InputUrl.vue')) },
  InputToggle: { el: def(() => import('./InputToggle.vue')) },
  InputCheckbox: { el: def(() => import('./InputCheckbox.vue')) },
  InputCheckboxMulti: { el: def(() => import('./InputCheckboxMulti.vue')) },
  InputRadio: { el: def(() => import('./InputRadio.vue')) },
  InputRadioButton: { el: def(() => import('./InputRadioButton.vue')) },
  InputSelect: { el: def(() => import('./InputSelect.vue')) },
  InputSelectCustom: { el: def(() => import('./InputSelectCustom.vue')) },
  InputTimezone: { el: def(() => import('./InputTimezone.vue')) },
  InputPrice: { el: def(() => import('./InputPrice.vue')) },
  InputPhone: { el: def(() => import('./InputPhone.vue')) },
  InputSubmit: { el: def(() => import('./InputSubmit.vue')) },
  InputPassword: { el: def(() => import('./InputPassword.vue')) },
  InputTextarea: { el: def(() => import('./InputTextarea.vue')) },
  InputWeight: { el: def(() => import('./InputWeight.vue')) },
  InputNumber: { el: def(() => import('./InputNumber.vue')) },
  InputMediaUpload: { el: def(() => import('./InputMediaUpload.vue')), shape: ['url'] },
  InputMediaDisplay: { el: def(() => import('./InputMediaDisplay.vue')), shape: ['url', 'format', 'html'] },
  InputRanking: { el: def(() => import('./InputRanking.vue')) },
  InputMultipleChoice: { el: def(() => import('./InputMultipleChoice.vue')) },
  InputRating: { el: def(() => import('./InputRating.vue')) },
  InputChoice: { el: def(() => import('./InputChoice.vue')) },
  InputDate: { el: def(() => import('./InputDate.vue')) },
  InputColor: { el: def(() => import('./InputColor.vue')) },
  InputFont: { el: def(() => import('./InputFont.vue')) },
  InputColorScheme: { el: def(() => import('./InputColorScheme.vue')) },
  InputRange: { el: def(() => import('./InputRange.vue')) },
  InputDropDown: { el: def(() => import('./InputDropDown.vue')) },
  InputOverlay: { el: def(() => import('./InputOverlay.vue')) },
  InputGradient: { el: def(() => import('./InputGradient.vue')) },
}

type SchemaCallback = (args: { z: typeof z, subSchema: z.AnyZodObject }) => z.Schema

export type InputOptionGeneration = {
  prompt?: string
  isDisabled?: boolean
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
  list?: (ListItem | string)[]
  default?: () => U
  schema?: SchemaCallback
  generation?: InputOptionGeneration
  isHidden?: boolean
  shape?: string[]
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
