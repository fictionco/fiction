import type { InputOption } from '@fiction/ui'

export function getGenerationInputConfig(options: InputOption[]) {
  const getOptions = (opts: InputOption[]) => {
    let out: InputOption[] = []
    for (const opt of opts) {
      if (opt.input.value === 'group') {
      // Recursively add only the nested options, not the group container itself
        const sub = getOptions(opt.options.value || [])

        out = [...out, ...sub]
      }
      else {
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
    isDisabled: opt.generation.value.isDisabled,
    estimatedMs: opt.generation.value.estimatedMs || 4000,
  }))
}
