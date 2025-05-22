import type { ActionButton, MediaObject, NavListItem } from '@fiction/core'
import type { SchemaFields } from '@fiction/core/utils/schemas'
import type { z } from 'zod/v4'
import { FictionObject, normList, removeUndefined, vue } from '@fiction/core'

type InputEntry = { el: vue.Component, shape?: string[] }

const def = vue.defineAsyncComponent

export const inputs = {
  InputColorTheme: { el: def(() => import('./InputColorTheme.vue')) },
  InputColorScheme: { el: def(() => import('./InputColorScheme.vue')) },
  InputSuperTitle: { el: def(() => import('./InputSuperTitle.vue')), shape: ['icon.*', 'text', 'theme', 'href'] },
  InputStandardSize: { el: def(() => import('./InputStandardSize.vue')) },
  InputBanner: { el: def(() => import('./InputBanner.vue')) },
  // InputBrand: { el: def(() => import('./InputBrand.vue')), shape: ['action.*', 'logo.*', 'tagline', 'href'] },
  // InputActionArea: { el: def(() => import('./InputActionArea.vue')), shape: ['buttons.*', 'subscribe.*', 'proof.*', 'design', 'size', 'theme', 'title', 'variant'] },
  InputControl: { el: def(() => import('./InputControl.vue')) },
  InputProse: { el: def(() => import('./InputProse.vue')) },
  InputAuthors: { el: def(() => import('./InputAuthors.vue')) },
  InputActionList: { el: def(() => import('./InputActionList.vue')) },
  InputActions: { el: def(() => import('./InputActions.vue')), shape: ['0.testId', '0.design', '0.href', '0.icon', '0.iconAfter', '0.name', '0.size', '0.target', '0.theme', '0.rounding', '0.disabled', '0.format', '0.loading'] },
  InputTags: { el: def(() => import('./InputTags.vue')) },
  InputHandle: { el: def(() => import('./InputHandle.vue')) },
  InputImage: { el: def(() => import('./InputImage.vue')) },
  InputMarkdown: { el: def(() => import('./InputMarkdown.vue')) },
  InputList: { el: def(() => import('./InputList.vue')) },
  InputEmail: { el: def(() => import('./InputEmail.vue')) },
  InputEmailMulti: { el: def(() => import('./InputEmailMulti.vue')) },
  InputOneTimeCode: { el: def(() => import('./InputOneTimeCode.vue')) },
  InputText: { el: def(() => import('./InputText.vue')) },
  InputUrl: { el: def(() => import('./InputUrl.vue')) },
  InputSiteRoute: { el: def(() => import('./InputSiteRoute.vue')) },
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
  InputPosts: { el: def(() => import('./InputPosts.vue')), shape: ['entries.*', 'media.*', 'query.*', 'limit', 'offset', 'format', 'viewSlug'] },
  InputLogo: { el: def(() => import('./InputLogo.vue')), shape: ['url', 'format', 'html', 'el', 'typography.*', 'class', 'iconId', 'media.*', 'scale', 'variant'] },
  InputIcon: { el: def(() => import('./InputIcon.vue')), shape: ['url', 'format', 'html', 'iconId', 'el', 'class', 'props', 'alt', 'aspect'] },
  InputMedia: { el: def(() => import('./InputMedia.vue')), shape: ['*'] },
  InputMediaUpload: { el: def(() => import('./InputMediaUpload.vue')), shape: ['url'] },
  InputRanking: { el: def(() => import('./InputRanking.vue')) },
  InputMultipleChoice: { el: def(() => import('./InputMultipleChoice.vue')) },
  InputRating: { el: def(() => import('./InputRating.vue')) },
  InputChoice: { el: def(() => import('./InputChoice.vue')) },
  InputDate: { el: def(() => import('./InputDate.vue')) },
  InputColor: { el: def(() => import('./InputColor.vue')) },
  InputFont: { el: def(() => import('./InputFont.vue')), shape: ['family', 'stack', 'variants', 'source'] },

  InputRange: { el: def(() => import('./InputRange.vue')) },
  InputDropDown: { el: def(() => import('./InputDropDown.vue')) },
  InputOverlay: { el: def(() => import('./InputOverlay.vue')) },
  InputGradient: { el: def(() => import('./InputGradient.vue')), shape: ['angle', 'stops', 'stops.0.color', 'stops.0.percent', 'css'] },
} as const satisfies Record<string, InputEntry>

export type InputProps<T extends keyof typeof inputs> = InstanceType<(typeof inputs)[T]['el']>['$props'] & { [key: string]: any }

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
  format?: 'text' | 'html' | 'media' | 'list'
}

type InputComponent = keyof typeof inputs | 'title' | 'group' | 'hidden' | vue.Component

export interface InputOptionSettings {
  testId?: string
  key?: string
  aliasKey?: string
  label?: string
  description?: string
  subLabel?: string
  placeholder?: string
  input?: InputComponent
  isRequired?: boolean
  isClosed?: boolean
  disabled?: boolean | string
  props?: Record<string, unknown>
  options?: InputOption[] | ((args: { input: InputOption }) => InputOption[])
  list?: (NavListItem | string)[] | readonly (NavListItem | string)[]
  schema?: z.Schema
  generation?: InputOptionGeneration
  isHidden?: boolean | vue.Ref<boolean>
  // callback
  isVisible?: (args: { index?: number, value?: unknown, path?: string }) => boolean
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

export type InputOptionConfig = Omit<InputOptionSettings, 'options'> & { options?: InputOptionConfig[] }

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
  isHidden = vue.isRef(this.settings.isHidden) ? this.settings.isHidden : vue.ref(this.settings.isHidden || false)
  isVisible = this.settings.isVisible || (() => true)
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

  wrapProps = vue.computed(() => {
    if (this.input.value === 'InputControl') {
      return {}
    }

    return {
      label: this.label.value,
      subLabel: this.subLabel.value,
      description: this.description.value,
      disabled: this.settings.disabled,
    }
  })

  outputProps = vue.computed(() => {
    if (this.input.value === 'InputControl') {
      return {
        disabled: !!this.settings.disabled,
        options: this.options.value?.map(option => option.toConfig()),
        ...this.props.value,
      }
    }
    else {
      return {
        placeholder: this.placeholder.value,
        required: this.isRequired.value,
        key: this.key.value,
        optionPath: this.key.value,
        options: this.options.value,
        list: normList(this.list.value),
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

// Key validation based on input type and schema
type ValidOptionKey<
  TInput extends InputComponent,
  TSchema extends z.ZodType<any> | undefined,
> = TInput extends 'group' | 'title' | 'InputControl'
  ? string
  : TSchema extends z.ZodType<any>
    ? SchemaFields<TSchema> | '*'
    : string

// Settings interface for createOption
type CreateOptionSettings<
  TInput extends InputComponent,
  TSchema extends z.ZodType<any> | undefined = undefined,
> = {
  input: TInput
  key: ValidOptionKey<TInput, TSchema>
  schema?: TSchema
  props?: TInput extends keyof typeof inputs
    ? InputProps<TInput>
    : Record<string, unknown>
} & Omit<InputOptionSettings, 'key' | 'input' | 'props' | 'schema'>

// Main function with improved type handling
export function createOption<
  TInput extends InputComponent,
  TSchema extends z.ZodType<any> | undefined = undefined,
>(settings: CreateOptionSettings<TInput, TSchema>): InputOption {
  const { schema, ...inputSettings } = settings
  const adjustedKey = inputSettings.key.split('.0.').pop() || inputSettings.key
  return new InputOption({ ...inputSettings, key: adjustedKey })
}
