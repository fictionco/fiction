import type { InputOption } from '@fiction/ui'

export function getGenerationInputConfig(options: InputOption[]) {
  const getOptions = (opts: InputOption[], parent?: InputOption) => {
    let out: InputOption[] = []
    for (const opt of opts) {
      if (opt.input.value === 'group') {
      // Recursively add only the nested options, not the group container itself
        const sub = getOptions(opt.options.value || [], opt)

        out = [...out, ...sub]
      }
      else if (!opt.settings.isUtility && !parent?.settings.isUtility) {
        out.push(opt)
      }
    }

    return out
  }

  const generationInputConfig = getOptions(options || []).filter(_ => _.isHidden.value !== true)

  return generationInputConfig.map(opt => ({
    key: opt.key.value,
    label: opt.label.value,
    prompt: opt.generation.value.prompt,
    isEnabled: opt.generation.value.isEnabled,
    estimatedMs: opt.generation.value.estimatedMs || 4000,
  }))
}
