import { CallbackDictionary, UserConfigServer } from "."

export const runHooks = async <T extends keyof CallbackDictionary>(options: {
  config: UserConfigServer
  hook: T
  args: CallbackDictionary[typeof options.hook]
}): Promise<any[]> => {
  const { config, hook, args } = options
  const callbacks = config.hooks
    ?.filter((_) => _.hook == hook)
    .map((_) => _.callback)

  const _promises = callbacks?.map((cb) => cb(...args)) ?? []

  return await Promise.all(_promises)
}
