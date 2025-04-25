export class HooksUtil<T extends Record<string, (...args: any[]) => Promise<void>>> {
  private hooks = new Map<keyof T, Map<string, T[keyof T]>>()

  /**
   * Register a hook for a specific event
   * @param event The event to hook into
   * @param key Unique identifier for this hook (module:purpose format recommended)
   * @param callback The function to execute
   */
  on<K extends keyof T>(event: K, key: string, callback: T[K]): void {
    if (!this.hooks.has(event)) {
      this.hooks.set(event, new Map())
    }

    this.hooks.get(event)!.set(key, callback as T[keyof T])
  }

  /**
   * Run all hooks for a specific event
   * @param event The event to trigger
   * @param args Arguments to pass to the hook callbacks
   */
  async run<K extends keyof T>(event: K, ...args: Parameters<T[K]>): Promise<void> {
    const eventHooks = this.hooks.get(event)
    if (!eventHooks)
      return

    // Execute hooks in deterministic order by key
    const sortedHooks = Array.from(eventHooks.entries()).sort(([a], [b]) => a.localeCompare(b))

    for (const [key, hook] of sortedHooks) {
      try {
        await (hook as T[K])(...args)
      }
      catch (error) {
        console.error(`Error in ${String(event)} hook '${key}':`, error)
      }
    }
  }
}

/**
 * OLD HOOKS SYSTEM
 */
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
