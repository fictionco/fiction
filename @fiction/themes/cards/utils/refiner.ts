import { log } from '@fiction/core'
import type { InputOption } from '@fiction/ui'

type RefineConfig = Record<string, string | boolean>

export function refineOptions(args: { inputOptions: InputOption[], refine: RefineConfig }) {
  const { inputOptions, refine } = args
  const refineOption = (option: InputOption, basePath = '') => {
    // Check for a refinement based on the option's key
    const path = basePath ? `${basePath}.${option.key.value}` : option.key.value
    const aliasKey = option.aliasKey?.value
    const refinement = refine[path] ?? refine[aliasKey]

    if (typeof refinement === 'string')
      option.generation.value.prompt = refinement

    else if (refinement === false || refinement === null)
      option.isHidden.value = true

    // If the option is a group, refine its children
    if (option.input.value === 'group' && option.options?.value)
      option.options.value = option.options.value.map(_ => refineOption(_))

    else if (option.options?.value)
      option.options.value = option.options.value.map(_ => refineOption(_, path))

    return option
  }

  return inputOptions.map(_ => refineOption(_))
}

// export function refineOptions(args: { inputOptions: InputOption[], refine: RefineConfig }): InputOption[] {
//   const recurse = (args: { inputOptions: InputOption[], refine: RefineConfig }): InputOption[] => {

//   }

//   return recurse(args)

//   // return inputOptions.reduce<InputOption[]>((acc, option) => {
//   //   if (option.input.value === 'group') {
//   //     // Directly push the group option and refine its children if it has any
//   //     option.options.value = option.options.value ? this.recursiveRefine(option.options.value, refine, currentPath) : []

//   //     acc.push(option)
//   //     return acc
//   //   }

//   //   const key = option.key.value || ''
//   //   const aliasKey = option.aliasKey?.value || ''
//   //   const refinementKey = refine[key]
//   //   const refinementAliased = refine[aliasKey]
//   //   const usedKey = refinementKey ? key : refinementAliased ? aliasKey : undefined
//   //   const refinement = refinementKey || refinementAliased

//   //   const optionPath = [...currentPath]
//   //   if (usedKey) {
//   //     optionPath.push(usedKey)
//   //     const k = optionPath.join('.')
//   //     this.usedKeys.add(k)
//   //   }

//   //   if (refinement)
//   //     acc.push(this.applyRefinement(option, refine, refinement, optionPath))

//   //   return acc
//   // }, [])
// }

// export class InputOptionsRefiner {
//   private caller: string
//   usedKeys: Set<string> = new Set()
//   log = log.contextLogger('InputOptionsRefiner')

//   constructor(args: { basePath: string, caller: string }) {
//     const { caller } = args

//     this.caller = caller
//   }

//   public refineInputOptions(args: { inputOptions: InputOption[], refine: RefineConfig }): InputOption[] {
//     const { inputOptions, refine } = args

//     const noRefine = typeof refine === 'object' && Object.keys(refine).length === 0

//     const refinedOptions = noRefine ? inputOptions : this.recursiveRefine(inputOptions, refine, [])

//     return refinedOptions
//   }

//   private recursiveRefine(inputOptions: InputOption[], refine: RefineConfig, currentPath: string[]): InputOption[] {
//     return inputOptions.reduce<InputOption[]>((acc, option) => {
//       if (option.input.value === 'group') {
//         // Directly push the group option and refine its children if it has any
//         option.options.value = option.options.value ? this.recursiveRefine(option.options.value, refine, currentPath) : []

//         acc.push(option)
//         return acc
//       }

//       const key = option.key.value || ''
//       const aliasKey = option.aliasKey?.value || ''
//       const refinementKey = refine[key]
//       const refinementAliased = refine[aliasKey]
//       const usedKey = refinementKey ? key : refinementAliased ? aliasKey : undefined
//       const refinement = refinementKey || refinementAliased

//       const optionPath = [...currentPath]
//       if (usedKey) {
//         optionPath.push(usedKey)
//         const k = optionPath.join('.')
//         this.usedKeys.add(k)
//       }

//       if (refinement)
//         acc.push(this.applyRefinement(option, refine, refinement, optionPath))

//       return acc
//     }, [])
//   }

//   private applyRefinement(option: InputOption, refine: RefineConfig, refinement: string | boolean, optionPath: string[]): InputOption {
//     const schema = option.schema?.value
//     if (refinement === true) {
//       return option
//     }
//     else if (typeof refinement === 'string' && schema) {
//       option.generation.value = { ...option.generation.value, prompt: refinement }
//     }
//     else if (typeof refinement === 'object') {
//       option.update(refinement)
//       option.generation.value = { ...option.generation.value, prompt: option.description.value || '' }

//       if (option.options?.value && refine)
//         option.options.value = this.recursiveRefine(option.options.value, refine, optionPath)
//     }
//     return option
//   }
// }
