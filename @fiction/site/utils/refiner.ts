// import { getNested, setNested } from '@fiction/core'
// import type { InputOption } from '@fiction/ui'
// import type { z } from 'zod'
// import type { JsonSchema7ObjectType, JsonSchema7Type } from 'zod-to-json-schema'
// import { zodToJsonSchema } from 'zod-to-json-schema'
// import type { SimpleSchema } from './schema'

// export function refineOptions<T extends z.AnyZodObject>(args: {
//   inputOptions: InputOption[]
//   schema?: T
// }) {
//   const { inputOptions, schema } = args

//   // Return early if no schema is available
//   if (!schema)
//     return { options: inputOptions, unusedSchema: { noSchema: true }, hiddenOptions: [] }

//   let simple = simplifySchema(zodToJsonSchema(schema) as JsonSchema7ObjectType)
//   const hiddenOptions: string[] = []
//   const refineOption = (option: InputOption, basePath = '') => {
//     // Check for a refinement based on the option's key
//     const path = basePath ? `${basePath}.${option.key.value}` : option.key.value

//     // If the option is a group, refine its children
//     if (option.options?.value) {
//       option.options.value = option.options.value.map(_ => refineOption(_, option.input.value !== 'group' ? path : undefined))
//       return option
//     }

//     const schemaPart = getNested<JsonSchema7Type>({ data: simple, path })

//     if (typeof schemaPart !== 'object') {
//       simple = setNested<SimpleSchema>({ data: simple, path, value: undefined })
//     }

//     else if (typeof schemaPart === 'object' && option.shape) {
//       option.shape.value.forEach((f) => {
//         simple = setNested<SimpleSchema>({ data: simple, path: `${path}.${f}`, value: undefined })
//       })
//     }

//     if (typeof schemaPart === 'object' && Object.keys(schemaPart).length === 0)
//       simple = setNested<SimpleSchema>({ data: simple, path, value: undefined })

//     if (!schemaPart) {
//       hiddenOptions.push(option.key.value)
//       option.isHidden.value = true
//     }

//     return option
//   }

//   return { options: inputOptions.map(_ => refineOption(_)), unusedSchema: simple, hiddenOptions }
// }
