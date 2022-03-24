import { FullUser } from "@factor/types"

import { getServerConfig } from "./config"

export interface ServerHookDictionary {
  onUserVerified: [FullUser]
  afterServerSetup: []
  afterServerCreated: []
  [key: string]: any[]
}

export const runHooks = async <T extends keyof ServerHookDictionary>(options: {
  hook: T
  args: ServerHookDictionary[typeof options.hook]
}): Promise<any[]> => {
  const { hook, args } = options
  const callbacks = getServerConfig()
    ?.hooks?.filter((_) => _.hook == hook)
    .map((_) => _.callback)

  const _promises = callbacks?.map((cb) => cb(...args)) ?? []

  return await Promise.all(_promises)
}
