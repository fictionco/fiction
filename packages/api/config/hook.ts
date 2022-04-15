import { getUserConfig } from "./plugins"

import { HookDictionary, HookDictionaryIndexed } from "./hookDictionary"

type Callbacks = (...args: unknown[]) => Promise<unknown>

const getCallbacks = <T extends keyof HookDictionaryIndexed>(
  hook: T,
): Callbacks[] | undefined => {
  return getUserConfig()
    ?.hooks?.filter((_) => _.hook == hook)
    .map((_) => _.callback) as Callbacks[]
}

export const runHooks = async <T extends keyof HookDictionary>(
  hook: T,
  ...args: HookDictionary[T]["args"]
): Promise<HookDictionary[T]["args"][0]> => {
  const hookArgs = args || []
  const callbacks = getCallbacks(hook)

  let result = hookArgs[0]
  if (callbacks && callbacks.length > 0) {
    for (const cb of callbacks) {
      const returnResult = await cb(result, ...hookArgs.slice(1))

      if (returnResult !== undefined) {
        result = returnResult as HookDictionary[T]["args"][0]
      }
    }
  }

  return result
}
