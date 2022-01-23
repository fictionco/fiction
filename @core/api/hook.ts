import {
  CallbackDictionary,
  HookDictionary,
  UserConfigServer,
} from "@factor/types"

import { omit } from "./_"
import { getGlobalThis, sortPriority } from "./utils"

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

export type FilterCallbacks = Record<any, FilterItem>

//type FilterRecord = Record<any, any>

type HookItem<T extends string = string> = {
  hook: T
  key: string
  priority?: number
}

type FilterCallback = (input?: any, ...a: any) => any

type FilterItem<T extends string = string> = HookItem<T> & {
  callback: FilterCallback
}

interface GlobalFilterObject {
  filters: Record<keyof HookDictionary, any>
}

/**
 * Get globally set filter functions
 * @remarks
 * The globals must not get destroyed with a hot server restart
 */
export const getGlobals = (): GlobalFilterObject => {
  // Use global value as filters need to remain in tact
  // even after all modules are purged on server resets
  const _global = getGlobalThis()
  if (!_global.$filters) {
    _global.$filters = {
      filters: {},
    }
  }

  return _global.$filters
}

/**
 * Gets all items attached to a specific hook ID
 * @param hook - hook ID
 */
export const getFilters = (
  hook: keyof HookDictionary,
): Record<any, FilterItem<string>> => {
  const { filters } = getGlobals()
  if (!filters[hook]) {
    filters[hook] = {}
  }

  const hooks = filters[hook]

  return hooks
}

type ReturnType<T extends keyof HookDictionary> =
  T extends keyof CallbackDictionary ? any[] : HookDictionary[T]

/**
 * Apply function callbacks that are hooked to an identifier when and fired with this function.
 * Data is passed sequentially from one callback to the next
 *
 * @param hook - unique identifier for the hook item, can be callback, filter, action
 * @param data - data to pass through the filters or callbacks
 * @param rest - additional arguments
 */
export const applyFilters = <
  T extends keyof HookDictionary,
  V extends any[] = any[],
>(
  hook: T,
  data: ReturnType<T>,
  ...rest: V
): ReturnType<T> => {
  const _added = getFilters(hook) // Get Filters Added

  const filterKeys = Object.keys(_added)
  const numFilters = filterKeys.length

  // Thread through filters if they exist
  if (_added && numFilters > 0) {
    const _addedArray = filterKeys.map((key) => _added[key])
    const _sorted = sortPriority(_addedArray)

    for (const element of _sorted) {
      const { callback } = element
      const result = callback(data, ...rest)

      // Add into what is passed into next item
      // If nothing is returned, don't unset the original data
      if (typeof result !== "undefined") {
        data = result
      }
    }
  }

  // Sort priority if array is returned
  if (Array.isArray(data)) {
    data = sortPriority(data as any[]) as ReturnType<T>
  }

  return data
}
/**
 * Add a filter to data provided to 'applyFilters'
 * Uses a hook Id and receives the parameters provided to that function
 *
 * @param hook - the Hook ID
 * @param callback - the filter callback, must return the end result
 * @param key - a unique cache identifier for the hooked item
 */
export const addFilter = <T extends keyof HookDictionary>(config: {
  hook: T
  key: string
  priority?: number
  callback: (_: HookDictionary[T], ...a: any[]) => HookDictionary[T]
}): void => {
  const { hook, key, callback, priority } = config
  const { filters } = getGlobals()

  if (!filters[hook]) filters[hook] = {}

  filters[hook][key] = { hook, key, callback, priority }

  return
}
/**
 * Helper function
 * Adds an item/object to the end of an array provided to a filter.
 * Only works with array based filters
 *
 * @param item - the item to add to the array
 * @param hook = the hook ID
 * @param key - a unique cache identifier for the hooked item
 */
export const pushToFilter = <
  T extends keyof HookDictionary,
  X = HookDictionary[T],
>(options: {
  hook: T
  key: string
  priority?: number
  item: X | ((...args: any[]) => X)
}): void => {
  const { item } = options
  const rest = omit(options, "item")
  addFilter({
    ...rest,
    callback: (input) => {
      if (!Array.isArray(input)) return input

      input.push(item)

      return input
    },
  })

  return
}
/**
 * Helper function
 * Push a callback to an array of callbacks
 */
export const addCallback = <U = unknown>(config: {
  hook: keyof HookDictionary
  key: string
  priority?: number
  callback: (..._arguments: HookDictionary[typeof config.hook]) => U
}): void => {
  const { callback, ...rest } = config

  addFilter({
    ...rest,
    callback: (_) => {
      _.push(callback)
      return _
    },
  })

  return
}
/**
 * Run array of promises and await the result
 */
export const runCallbacks = async (
  hook: keyof HookDictionary,
  ..._arguments: HookDictionary[typeof hook]
): Promise<any[]> => {
  const callbacks: ((...args: any[]) => PromiseLike<any>)[] = applyFilters(
    hook,
    [],
  )

  const _promises = callbacks.map((cb) => cb(..._arguments))

  return await Promise.all(_promises)
}

// export const addProcessor = <U = unknown>(config: {
//   hook: keyof HookDictionary
//   key: string
//   priority?: number
//   callback: (initial: HookDictionary[typeof config.hook], ...args: any[]) => U
// }): void => {
//   addCallback(config)
//   return
// }
