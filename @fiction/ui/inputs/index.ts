import type { ActionButton, ListItem, MediaObject } from '@fiction/core'
import type { z } from 'zod'
import { FictionObject, removeUndefined, vue } from '@fiction/core'

const def = vue.defineAsyncComponent

type InputEntry = { el: vue.Component, shape?: string[] }

export const inputs = {
  InputControl: { el: def(async () => import('./InputControl.vue')) },
  InputProse: { el: def(async () => import('./InputProse.vue')) },
  InputActionList: { el: def(async () => import('./InputActionList.vue')) },
  InputActions: { el: def(async () => import('./InputActions.vue')), shape: ['0.testId', '0.design', '0.href', '0.icon', '0.iconAfter', '0.name', '0.size', '0.target', '0.theme', '0.rounding', '0.disabled', '0.format', '0.loading'] },
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
  InputPosts: { el: def(async () => import('./InputPosts.vue')), shape: ['entries.*', 'media.*', 'query.*', 'limit', 'offset', 'format'] },
  InputLogo: { el: def(async () => import('./InputLogo.vue')), shape: ['url', 'format', 'html', 'el', 'typography.*', 'class', 'iconId'] },
  InputIcon: { el: def(async () => import('./InputIcon.vue')), shape: ['url', 'format', 'html', 'iconId', 'el', 'class'] },
  InputMedia: { el: def(async () => import('./InputMedia.vue')), shape: ['url', 'format', 'html', 'el', 'modify.*'] },
  InputMediaUpload: { el: def(async () => import('./InputMediaUpload.vue')), shape: ['url'] },
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
} as const satisfies Record<string, InputEntry>

type SchemaCallback = (args: { z: typeof z, subSchema: z.AnyZodObject }) => z.Schema

export type InputOptionGeneration = {
  prompt?: string
  isUserEnabled?: boolean
  estimatedMs?: number
  key?: string
  label?: string
  cumulativeTime?: number
}

export type InputControlSurface = Partial<{
  key: string
  value: string | number | boolean | any[] | Record<string, unknown> | undefined
}>

export type ReactiveOrStatic<T> = T | vue.Ref<T> | vue.ComputedRef<T>

export type ValueResponse = {
  status: 'ready' | 'enabled' | 'disabled' | 'incomplete' | 'optional'
  data?: unknown
  message?: string
  format?: 'text' | 'html' | 'media'
}

export interface InputOptionSettings {
  testId?: string
  key?: string
  aliasKey?: string
  label?: string
  description?: string
  subLabel?: string
  placeholder?: string
  input?: keyof typeof inputs | 'title' | 'group' | 'hidden' | vue.Component
  isRequired?: boolean
  isClosed?: boolean
  disabled?: boolean | string
  props?: Record<string, unknown>
  options?: InputOption[] | ((args: { input: InputOption }) => InputOption[])
  list?: (ListItem | string)[] | readonly (ListItem | string)[]
  // default?: () => U
  schema?: SchemaCallback
  generation?: InputOptionGeneration
  isHidden?: boolean
  isUtility?: boolean
  shape?: string[]
  inputClass?: string
  uiFormat?: 'standard' | 'naked' | 'fullWidth'
  getDefaultValue?: () => unknown
  icon?: MediaObject
  format?: 'control' | 'input'
  actions?: (args: { input: InputOption }) => ActionButton[]
  modalActions?: (args: { input: InputOption }) => ActionButton[]
  valueDisplay?: (args: { input: InputOption }) => ValueResponse
}

export type OptArgs = (Partial<InputOptionSettings> & Record<string, unknown>) | undefined

type InputOptionConfig = Omit<InputOptionSettings, 'options'> & { options?: InputOptionConfig[] }

export class InputOption extends FictionObject<InputOptionSettings> {
  key = vue.ref(this.settings.key || '*')
  aliasKey = vue.ref(this.settings.aliasKey || this.key)
  input = vue.shallowRef(this.settings.input)
  shape = vue.ref(typeof this.input.value === 'string' ? (inputs as Record<string, InputEntry>)[this.input.value]?.shape || [] : [])
  label = vue.ref(this.settings.label)
  subLabel = vue.ref(this.settings.subLabel)
  placeholder = vue.ref(this.settings.placeholder)
  isRequired = vue.ref(this.settings.isRequired || false)
  isClosed = vue.ref(this.settings.isClosed || false)
  isHidden = vue.ref(this.settings.isHidden || false)
  description = vue.ref(this.settings.description)

  // modal control options
  isModalOpen = vue.ref(false) // allows for modal input visible
  tempValue = vue.ref<Record<string, any> | undefined>() // temp value for modal input
  actions = vue.computed(() => this.settings.actions?.({ input: this }))
  modalActions = vue.computed(() => this.settings.modalActions?.({ input: this }))
  valueDisplay = vue.computed(() => this.settings.valueDisplay?.({ input: this }))

  props = vue.shallowRef(this.settings.props)
  options = vue.computed(() => (typeof this.settings.options === 'function' ? this.settings.options({ input: this }) : this.settings.options) || [])
  list = vue.shallowRef(this.settings.list)
  schema = vue.shallowRef(this.settings.schema)
  generation = vue.ref(this.settings.generation || {})

  outputProps = vue.computed(() => {
    if (this.input.value === 'InputControl') {
      return {
        disabled: this.settings.disabled,
        options: this.options.value?.map(option => option.toConfig()),
        ...this.props.value,
      }
    }
    else {
      return {
        label: this.label.value,
        subLabel: this.subLabel.value,
        description: this.description.value,
        placeholder: this.placeholder.value,
        required: this.isRequired.value,
        key: this.key.value,
        options: this.options.value,
        list: this.list.value,
        disabled: this.settings.disabled,
        ...this.props.value,
      }
    }
  })

  update(config: Partial<InputOptionSettings>) {
    Object.entries(config).forEach(([key, value]) => {
      if (value !== undefined && vue.isRef(this[key as keyof typeof this]))
        (this[key as keyof typeof this] as vue.Ref).value = value
    })

    return this
  }

  constructor(settings: InputOptionSettings) {
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
