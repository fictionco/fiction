import { getUserConfig } from "./plugins"

import { HookDictionary } from "./hookDictionary"

export const runHooks = async <T extends keyof HookDictionary>(options: {
  hook: T
  args: HookDictionary[typeof options.hook]["args"]
}): Promise<HookDictionary[typeof options.hook]["args"][0]> => {
  const { hook, args = [] } = options
  const callbacks = getUserConfig()
    ?.hooks?.filter((_) => _.hook == hook)
    .map((_) => _.callback)

  let result = args[0]
  if (callbacks && callbacks.length > 0) {
    for (const cb of callbacks) {
      result = await cb(result, ...args.slice(1))
    }
  }

  return result
}
