import type { ListItem } from '@fiction/core'
import { FictionObject, removeUndefined, vue } from '@fiction/core'
import type { JsonSchema7ObjectType } from 'zod-to-json-schema'
import zodToJsonSchema from 'zod-to-json-schema'
import { z } from 'zod'

const def = vue.defineAsyncComponent

type SchemaDef = (args: { z: typeof z, subSchema: z.AnyZodObject }) => z.Schema

const gradientSetting: SchemaDef = ({ z }) => z.object({ angle: z.number(), stops: z.object({ color: z.string(), percent: z.number(), colorId: z.string() }), css: z.string() })

export const inputs: Record<string, { el: vue.Component, schema: SchemaDef }> = {
  InputUsername: { el: def(() => import('./InputUsername.vue')), schema: ({ z }) => z.string().min(3).optional() },
  InputMarkdown: { el: def(() => import('./InputMarkdown.vue')), schema: ({ z }) => z.string().optional() },
  InputList: { el: def(() => import('./InputList.vue')), schema: ({ z, subSchema }) => z.array(subSchema).optional() },
  InputEmail: { el: def(() => import('./InputEmail.vue')), schema: ({ z }) => z.string().optional() },
  InputOneTimeCode: { el: def(() => import('./InputOneTimeCode.vue')), schema: ({ z }) => z.string().optional() },
  InputText: { el: def(() => import('./InputText.vue')), schema: ({ z }) => z.string().optional() },
  InputUrl: { el: def(() => import('./InputUrl.vue')), schema: ({ z }) => z.string().optional() },
  InputToggle: { el: def(() => import('./InputToggle.vue')), schema: ({ z }) => z.boolean().optional() },
  InputCheckbox: { el: def(() => import('./InputCheckbox.vue')), schema: ({ z }) => z.boolean().optional() },
  InputCheckboxMulti: { el: def(() => import('./InputCheckboxMulti.vue')), schema: ({ z }) => z.array(z.boolean()) },
  InputRadio: { el: def(() => import('./InputRadio.vue')), schema: ({ z }) => z.array(z.boolean()) },
  InputRadioButton: { el: def(() => import('./InputRadioButton.vue')), schema: ({ z }) => z.string().optional() },
  InputSelect: { el: def(() => import('./InputSelect.vue')), schema: ({ z }) => z.string().optional() },
  InputSelectCustom: { el: def(() => import('./InputSelectCustom.vue')), schema: ({ z }) => z.string().optional() },
  InputTimezone: { el: def(() => import('./InputTimezone.vue')), schema: ({ z }) => z.string().optional() },
  InputPrice: { el: def(() => import('./InputPrice.vue')), schema: ({ z }) => z.string().optional() },
  InputPhone: { el: def(() => import('./InputPhone.vue')), schema: ({ z }) => z.string().optional() },
  InputSubmit: { el: def(() => import('./InputSubmit.vue')), schema: ({ z }) => z.string().optional() },
  InputPassword: { el: def(() => import('./InputPassword.vue')), schema: ({ z }) => z.string().optional() },
  InputTextarea: { el: def(() => import('./InputTextarea.vue')), schema: ({ z }) => z.string().optional() },
  InputWeight: { el: def(() => import('./InputWeight.vue')), schema: ({ z }) => z.string().optional() },
  InputNumber: { el: def(() => import('./InputNumber.vue')), schema: ({ z }) => z.number().optional() },
  InputMediaUpload: { el: def(() => import('./InputMediaUpload.vue')), schema: ({ z }) => z.object({ url: z.string().optional() }) },
  InputMediaDisplay: { el: def(() => import('./InputMediaDisplay.vue')), schema: ({ z }) => z.object({ url: z.string().optional() }) },
  InputRanking: { el: def(() => import('./InputRanking.vue')), schema: ({ z }) => z.array(z.string()) },
  InputMultipleChoice: { el: def(() => import('./InputMultipleChoice.vue')), schema: ({ z }) => z.array(z.string()) },
  InputRating: { el: def(() => import('./InputRating.vue')), schema: ({ z }) => z.number().optional() },
  InputChoice: { el: def(() => import('./InputChoice.vue')), schema: ({ z }) => z.string().optional() },
  InputDate: { el: def(() => import('./InputDate.vue')), schema: ({ z }) => z.date().optional() },
  InputColor: { el: def(() => import('./InputColor.vue')), schema: ({ z }) => z.string().optional() },
  InputFont: { el: def(() => import('./InputFont.vue')), schema: ({ z }) => z.string().optional() },
  InputColorScheme: { el: def(() => import('./InputColorScheme.vue')), schema: ({ z }) => z.string().optional() },
  InputRange: { el: def(() => import('./InputRange.vue')), schema: ({ z }) => z.string().optional() },
  InputDropDown: { el: def(() => import('./InputDropDown.vue')), schema: ({ z }) => z.string().optional() },
  InputOverlay: { el: def(() => import('./InputOverlay.vue')), schema: ({ z, subSchema }) => z.object({ opacity: z.number(), blendMode: z.string(), gradient: gradientSetting({ z, subSchema }) }).optional() },
  InputGradient: { el: def(() => import('./InputGradient.vue')), schema: ({ z, subSchema }) => gradientSetting({ z, subSchema }).optional() },
}

export function getOptionSchema(inputOptions?: InputOption[], userInputConfig?: Record<string, InputOptionGeneration>): z.ZodObject<z.ZodRawShape> | undefined {
  if (!inputOptions || inputOptions.length === 0)
    return undefined
  const schemaFields: Record<string, z.ZodTypeAny> = {}
  inputOptions.forEach((option) => {
    const userConfig = userInputConfig?.[option.key.value]

    if (userConfig)
      option.generation.value = { ...option.generation.value, ...userConfig }

    if (option.generation.value.isDisabled)
      return

    // Skip group input itself but process its nested options if present
    if (option.input.value === 'group' && option.options) {
      const nestedSchema = getOptionSchema(option.options.value, userInputConfig) // Recursively call getOptionSchema on nested options
      if (nestedSchema)
        Object.assign(schemaFields, nestedSchema.shape) // Merge nested schema fields at the current level
    }
    else if (option.outputSchema.value) {
      // Only add schema if it's defined and not a group input
      schemaFields[option.key.value] = option.outputSchema.value
    }
  })

  return z.object(schemaFields) // Construct and return the Zod object schema
}

export function getOptionJsonSchema(inputOptions?: InputOption[], userInputConfig?: Record<string, InputOptionGeneration>) {
  const zodSchema = getOptionSchema(inputOptions, userInputConfig)

  if (!zodSchema)
    return undefined

  const r = zodToJsonSchema(zodSchema) as JsonSchema7ObjectType
  return r
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
}

export type OptArgs = (Partial<InputOptionSettings> & Record<string, unknown>) | undefined

type InputOptionConfig = Omit<InputOptionSettings, 'options'> & { options?: InputOptionConfig[] }

export class InputOption<T extends string = string, U = any> extends FictionObject<InputOptionSettings<T, U>> {
  key = vue.ref(this.settings.key)
  aliasKey = vue.ref(this.settings.aliasKey || this.key)
  input = vue.shallowRef(this.settings.input)
  label = vue.ref(this.settings.label)
  subLabel = vue.ref(this.settings.subLabel)
  placeholder = vue.ref(this.settings.placeholder)
  isRequired = vue.ref(this.settings.isRequired || false)
  isHidden = vue.ref(this.settings.isHidden || false)
  description = vue.ref(this.settings.description)
  options = vue.shallowRef(this.settings.options || [])
  list = vue.shallowRef(this.settings.list)
  default = this.settings.default
  subSchema = vue.computed(() => getOptionSchema(this.settings.options))
  schema = vue.shallowRef(this.settings.schema)
  generation = vue.ref(this.settings.generation || {})
  outputSchema = vue.computed(() => {
    const s = this.schema.value
      ? this.schema.value({ z, subSchema: this.subSchema.value as z.AnyZodObject })
      : typeof this.input === 'string' && inputs[this.input]
        ? inputs[this.input]?.schema({ z, subSchema: this.subSchema.value as z.AnyZodObject })
        : this.subSchema.value

    return s?.describe(this.generation.value.prompt || this.label.value || this.key.value)
  })

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
    })
  }
}
