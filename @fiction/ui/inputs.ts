import type { ListItem } from '@fiction/core'
import { FactorObject, log, removeUndefined, vue } from '@fiction/core'
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
  InputSelectMulti: { el: def(() => import('./InputSelectMulti.vue')), schema: ({ z }) => z.array(z.string()) },
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

export function getOptionSchema(inputOptions?: InputOption[]): z.ZodObject<z.ZodRawShape> | undefined {
  if (!inputOptions || inputOptions.length === 0)
    return undefined
  const schemaFields: Record<string, z.ZodTypeAny> = {}
  inputOptions.forEach((option) => {
    // Skip group input itself but process its nested options if present
    if (option.input.value === 'group' && option.options) {
      const nestedSchema = getOptionSchema(option.options.value) // Recursively call getOptionSchema on nested options
      if (nestedSchema)
        Object.assign(schemaFields, nestedSchema.shape) // Merge nested schema fields at the current level
    }
    else if (option.outputSchema.value && option.key.value) {
      // Only add schema if it's defined and not a group input
      schemaFields[option.key.value] = option.outputSchema.value
    }
  })

  return z.object(schemaFields) // Construct and return the Zod object schema
}

export function getOptionJsonSchema(inputOptions?: InputOption[]): Record<string, unknown> | undefined {
  const zodSchema = getOptionSchema(inputOptions)

  if (!zodSchema)
    return undefined

  return zodToJsonSchema(zodSchema)
}

export type Refinement<T extends RefinementList = RefinementList> = boolean | string | Partial<InputOptionSettings & { refine: T }> | undefined
export type RefinementList = {
  [key: string]: Refinement
}

export class InputOptionsRefiner {
  public basePath: string
  private caller: string
  usedKeys: Set<string> = new Set()
  log = log.contextLogger('InputOptionsRefiner')

  constructor(args: { basePath: string, caller: string }) {
    const { basePath, caller } = args
    this.basePath = basePath
    this.caller = caller
  }

  public refineInputOptions(args: { inputOptions: InputOption[], refineOption: RefinementList, basePath?: string }): InputOption[] {
    const { inputOptions, refineOption, basePath } = args

    const noRefine = typeof refineOption === 'object' && Object.keys(refineOption).length === 0

    const refinedOptions = noRefine ? inputOptions : this.recursiveRefine(inputOptions, refineOption, [])

    if (!noRefine)
      this.warnUnusedKeys(refineOption)

    const finalOptions = this.prefixBasePath({ inputOptions: refinedOptions, basePath })

    return finalOptions
  }

  private recursiveRefine(inputOptions: InputOption[], refineOption: RefinementList, currentPath: string[]): InputOption[] {
    return inputOptions.reduce<InputOption[]>((acc, option) => {
      if (option.input.value === 'group') {
        // Directly push the group option and refine its children if it has any
        option.options.value = option.options.value ? this.recursiveRefine(option.options.value, refineOption, currentPath) : []

        acc.push(option)
        return acc
      }

      const key = option.key.value || ''
      const aliasKey = option.aliasKey?.value || ''
      const refinementKey = refineOption[key]
      const refinementAliased = refineOption[aliasKey]
      const usedKey = refinementKey ? key : refinementAliased ? aliasKey : undefined
      const refinement = refinementKey || refinementAliased

      const optionPath = [...currentPath]
      if (usedKey) {
        optionPath.push(usedKey)
        const k = optionPath.join('.')
        this.usedKeys.add(k)
      }

      if (refinement)
        acc.push(this.applyRefinement(option, refinement, optionPath))

      return acc
    }, [])
  }

  private applyRefinement(option: InputOption, refinement: Refinement, optionPath: string[]): InputOption {
    const schema = option.schema?.value
    if (refinement === true) {
      return option
    }
    else if (typeof refinement === 'string' && schema) {
      option.schema.value = args => schema(args).describe(refinement)
    }
    else if (typeof refinement === 'object') {
      option.update(refinement)
      if (schema)
        option.schema.value = args => schema(args).describe(option.description.value || '')

      if (option.options?.value && refinement.refine)
        option.options.value = this.recursiveRefine(option.options.value, refinement.refine, optionPath)
    }
    return option
  }

  private prefixBasePath(args: { inputOptions: InputOption[], basePath?: string }): InputOption[] {
    const { inputOptions } = args
    return inputOptions.map((option) => {
      const basePath = args.basePath || this.basePath || ''

      if (option.input.value === 'group' && option.options.value)
        option.options.value = this.prefixBasePath({ inputOptions: option.options.value, basePath })
      else if (basePath)
        option.key.value = `${basePath.endsWith('.') ? basePath : `${basePath}.`}${option.key.value}`

      return option
    })
  }

  private warnUnusedKeys(refineOption: RefinementList, prefix: string = ''): void {
    Object.keys(refineOption).forEach((key) => {
      const fullKey = `${prefix}${key}`
      if (!this.usedKeys.has(fullKey))
        console.warn(`Warning: Filter key '${fullKey}' provided by '${this.caller}' was not used.`)

      const r = refineOption[key]
      if (typeof r === 'object' && r.refine)
        this.warnUnusedKeys(r.refine, `${fullKey}.`)
    })
  }
}

// export function refineInputOptions(args: { inputOptions: InputOption[], refineOption: RefinementList, basePath?: string, caller: string }): InputOption[] {
//   const { inputOptions, refineOption, basePath = '', caller = 'unknown' } = args
//   const usedKeys: Set<string> = new Set()

//   const recursiveRefine = (args: { inputOptions: InputOption[], refineOption: RefinementList, currentPath: string[] }) => {
//     const { inputOptions, refineOption, currentPath } = args

//     if (typeof refineOption == 'object' && Object.keys(refineOption).length === 0)
//       return inputOptions

//     const refinedOptions = inputOptions.reduce<InputOption[]>((acc, option) => {
//       // const refinement = refineOption[option.key.value] || refineOption[option.aliasKey.value]
//       let refinement: Refinement = undefined
//       let k = option.key.value
//       if (refineOption[option.key.value]) {
//         refinement = refineOption[option.key.value]
//       }

//       else if (refineOption[option.aliasKey.value]) {
//         refinement = refineOption[option.aliasKey.value]
//         k = option.aliasKey.value
//       }

//       const optionPath = [...currentPath, k]

//       if (refinement !== undefined)
//         usedKeys.add(optionPath.join('.'))

//       if (refinement === undefined) {
//         // If refine option has no matching key, filter out the value.
//         return acc
//       }
//       else if (refinement === true) {
//         // If the key of the record is true, keep the option as is.
//         acc.push(option)
//       }
//       else if (typeof refinement === 'string' && option.schema.value) {
//         const desc = refinement
//         const v = option.schema.value
//         option.schema.value = args => v(args).describe(desc)
//         acc.push(option)
//       }
//       else if (typeof refinement === 'object') {
//         // If the record value is additional InputOptionSettings, update the original.
//         option.update(refinement)
//         if (option.schema.value) {
//           const v = option.schema.value
//           option.schema.value = args => v(args).describe(option.description.value || '')
//         }

//         acc.push(option)
//       }

//       if (option.options.value && option.options.value.length > 0 && refinement instanceof Object && refinement.refine) {
//         // Recursively refine nested options.
//         option.options.value = recursiveRefine({ inputOptions: option.options.value, refineOption: refinement.refine, currentPath: optionPath })
//       }

//       return acc
//     }, [])

//     return refinedOptions
//   }

//   const refinedOptions = recursiveRefine({ inputOptions, refineOption, currentPath: [] })

//   const prefixBasePath = (options: InputOption[]) => {
//     return options.map((option) => {
//       if (option.input.value === 'group' && option.options.value)
//         option.options.value = prefixBasePath(option.options.value)
//       else
//         option.key.value = `${basePath.endsWith('.') ? basePath : `${basePath}.`}${option.key.value}`

//       return option
//     })
//   }

//   const finalOptions = prefixBasePath(refinedOptions)
//   // Function to check and warn about unused filterKeys
//   const warnUnusedKeys = (refineOption: RefinementList | boolean, usedKeys: Set<string>, prefix: string = '') => {
//     if (typeof refineOption === 'object') {
//       Object.keys(refineOption).forEach((key) => {
//         const fullKey = `${prefix}${key}`
//         if (!usedKeys.has(fullKey))
//           console.warn(`Warning: Filter key '${fullKey}' provided by '${caller}' was not used.`)

//         const r = refineOption[key]
//         const nestedFilterKeys = typeof r == 'object' && r?.refine
//         if (typeof nestedFilterKeys === 'object')
//           warnUnusedKeys(nestedFilterKeys, usedKeys, `${fullKey}.`)
//       })
//     }
//   }

//   if (typeof refineOption === 'object')
//     warnUnusedKeys(refineOption, usedKeys)

//   return finalOptions
// }

type SchemaCallback = (args: { z: typeof z, subSchema: z.AnyZodObject }) => z.Schema

export interface InputOptionSettings {
  key: string
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
  default?: () => unknown
  schema?: SchemaCallback
}

type InputOptionConfig = Omit<InputOptionSettings, 'options'> & { options?: InputOptionConfig[] }

export class InputOption extends FactorObject<InputOptionSettings> {
  key = vue.ref(this.settings.key)
  aliasKey = vue.ref(this.settings.aliasKey || this.key)
  input = vue.shallowRef(this.settings.input)
  label = vue.ref(this.settings.label)
  subLabel = vue.ref(this.settings.subLabel)
  placeholder = vue.ref(this.settings.placeholder)
  isRequired = vue.ref(this.settings.isRequired || false)
  description = vue.ref(this.settings.description)
  options = vue.shallowRef(this.settings.options || [])
  list = vue.shallowRef(this.settings.list)
  default = this.settings.default
  subSchema = vue.computed(() => getOptionSchema(this.settings.options))
  schema = vue.shallowRef(this.settings.schema)
  outputSchema = vue.computed(() => this.schema.value
    ? this.schema.value({ z, subSchema: this.subSchema.value as z.AnyZodObject })
    : typeof this.input === 'string' && inputs[this.input]
      ? inputs[this.input].schema({ z, subSchema: this.subSchema.value as z.AnyZodObject })
      : this.subSchema.value)

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
    })
  }
}

export type OptionSetArgs< T extends Record<string, unknown> = Record<string, unknown>> = { label?: string, groupPath?: string, basePath?: string, refineOption?: RefinementList } & T

export type OptionSetSettings< T extends Record<string, unknown> = Record<string, unknown>> = {
  basePath?: string
  defaultRefinement?: RefinementList
  inputOptions?: (args?: OptionSetArgs<T>) => InputOption[]
}

export class OptionSet< T extends Record<string, unknown> = Record<string, unknown>> extends FactorObject<OptionSetSettings<T>> {
  refiner = new InputOptionsRefiner({ basePath: this.settings.basePath || '', caller: `OptionSet` })
  constructor(settings?: OptionSetSettings<T>) {
    super('OptionSet', (settings || {}))
  }

  toOptions(args?: OptionSetArgs<T>) {
    const inputOptions = this.settings?.inputOptions?.(args)

    if (!inputOptions)
      return []

    const refineOption = args?.refineOption || this.settings.defaultRefinement || {}

    const finalOptions = this.refiner.refineInputOptions({ inputOptions, refineOption, basePath: args?.basePath })

    return finalOptions
  }
}
