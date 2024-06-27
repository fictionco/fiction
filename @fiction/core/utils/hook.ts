type Callbacks = (...args: unknown[]) => Promise<unknown>

export type HookType<
  T extends { [K in keyof T]: { args: unknown[] } },
  U extends keyof T = keyof T,
> = {
  [K in keyof T]: {
    hook: K
    caller?: string
    context?: 'cli' | 'app' | 'client' | 'ssr' | 'server'
    callback: (
      ...args: T[K]['args']
    ) =>
    | Promise<T[K]['args'][0] | undefined | void>
    | T[K]['args'][0]
    | undefined
    | void
  }
}[U]

export async function runHooks<
  S extends { [K in keyof S]: { args: unknown[] } },
  T extends keyof S = keyof S,
>(params: {
  list: HookType<S, keyof S>[]
  hook: T
  args?: S[T]['args']
}): Promise<S[T]['args'][0]> {
  const { list = [], hook, args = [] } = params
  const hookArgs = args || []

  const callbacks = list.filter(_ => _.hook === hook).map(_ => _.callback) as Callbacks[]

  let result = hookArgs[0]
  if (callbacks && callbacks.length > 0) {
    for (const cb of callbacks) {
      const returnResult = await cb(result, ...hookArgs.slice(1))

      if (returnResult !== undefined)
        result = returnResult as S[T]['args'][0]
    }
  }

  return result
}

export function runHooksSync<
  S extends { [K in keyof S]: { args: unknown[] } },
  T extends keyof S = keyof S,
>(params: {
  list: HookType<S, keyof S>[]
  hook: T
  args?: S[T]['args']
}): S[T]['args'][0] {
  const { list = [], hook, args = [] } = params
  const hookArgs = args || []

  const callbacks = list
    .filter(_ => _.hook === hook)
    .map(_ => _.callback) as Callbacks[]

  let result = hookArgs[0]
  if (callbacks && callbacks.length > 0) {
    for (const cb of callbacks) {
      const returnResult = cb(result, ...hookArgs.slice(1))

      if (returnResult !== undefined)
        result = returnResult as S[T]['args'][0]
    }
  }

  return result
}
