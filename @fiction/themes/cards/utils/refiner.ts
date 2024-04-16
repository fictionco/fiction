import type { InputOption } from '@fiction/ui'

type RefineConfig = Record<string, string | boolean>

export function refineOptions(args: { inputOptions: InputOption[] | readonly InputOption[], refine: RefineConfig }) {
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
