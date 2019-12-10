import { sortPriority } from "@factor/api/utils"
import Vue from "vue"
import { omit } from "./utils-lodash"

type FilterRecord = Record<string, Record<string, CallbackItem>>

interface HookItem {
  hook: string;
  key: string;
  priority?: number;
}

interface FilterItem extends HookItem {
  callback: <F>(input: any, _arguments: any) => any;
}

interface CallbackItem extends HookItem {
  callback: Function;
}

declare module "vue/types/vue" {
  export interface VueConstructor {
    $filters: { filters: FilterRecord; applied: FilterRecord };
  }
}

export const getGlobals = (): {
  filters: FilterRecord;
  applied: FilterRecord;
} => {
  if (!Vue.$filters) {
    Vue.$filters = {
      filters: {},
      applied: {}
    }
  }

  return Vue.$filters
}

/**
 * Gets all items attached to a specific hook ID
 * @param hook - hook ID
 */
export const getFilters = (hook: string): Record<string, CallbackItem> => {
  const { filters } = getGlobals()
  if (!filters[hook]) {
    filters[hook] = {}
  }

  return filters[hook]
}

export const getApplied = (): FilterRecord => {
  const { applied } = getGlobals()
  return applied
}

const setFilter = ({
  hook,
  key,
  callback,
  priority
}: CallbackItem): Record<string, any> => {
  const { filters } = getGlobals()
  if (!filters[hook]) filters[hook] = {}

  filters[hook][key] = { hook, key, callback, priority }

  return filters[hook]
}

export const getFilterCount = (hook: string): number => {
  const added = getFilters(hook)

  return added && Object.keys(added).length > 0 ? Object.keys(added).length : 0
}

/**
 * Apply function callbacks that are hooked to an identifier when and fired with this function.
 * Data is passed sequentially from one callback to the next
 *
 * @param hook - unique identifier for the hook item, can be callback, filter, action
 * @param data - data to pass through the filters or callbacks
 * @param rest - additional arguments
 */
export const applyFilters = (hook: string, data: any, ...rest: any[]): any => {
  // Get Filters Added
  const _added = getFilters(hook)

  const filterKeys = Object.keys(_added)
  const numFilters = filterKeys.length

  // Thread through filters if they exist
  if (_added && numFilters > 0) {
    const _addedArray = filterKeys.map(key => _added[key])
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
    data = sortPriority(data)
  }

  getApplied()[hook] = data

  return data
}

// Use the function that called the filter in the key
// this prevents issues where two filters in different may match each other
// which causes difficult to solve bugs (data-schemas is an example)
const callerKey = (): string => {
  const error = new Error()

  let stacker = "no-stack"
  if (error && error.stack) {
    const line = error.stack
      .toString()
      .split("(")
      .find(line => !line.match(/(filter|Error)/))

    if (line) {
      stacker = line.slice(0, Math.max(0, line.indexOf(":")))
    }
  }

  return stacker
}

/**
 * Create a unique identifier based on a provided string, object or function
 *
 * @param object - a string, object, array or function to be converted to hash
 * @returns {string} - a hash ID for provided item
 */
export const uniqueObjectHash = (obj: any): string => {
  if (!obj) return obj

  let str
  if (typeof obj == "string") {
    str = obj
  } else if (typeof obj == "function") {
    str = obj.toString()
  } else {
    // Make sure to remove circular refs
    // https://github.com/WebReflection/flatted#flatted
    const { stringify } = require("flatted/cjs")
    str = stringify(obj)
  }

  if (!str.includes("\n")) {
    str = str + callerKey()
  }

  str = str.slice(0, 500)

  const keyed = str
    .split("")
    .reduce(
      (prevHash: number, currVal: string) =>
        ((prevHash << 5) - prevHash + currVal.charCodeAt(0)) | 0,
      0
    )

  return String(keyed).replace(/-/g, "")
}

export const addFilter = (options: FilterItem): void => {
  let { callback } = options
  const rest = omit(options, ["callback"])

  // For simpler assignments where no callback is needed
  callback = typeof callback != "function" ? (): typeof callback => callback : callback

  setFilter({ ...rest, callback })

  return
}

export const pushToFilter = <T>(options: HookItem & { item: T }): void => {
  let { item } = options
  const rest = omit(options, ["item"])
  addFilter({
    ...rest,
    callback: (input: T[], ...args: any[]): T[] => {
      item = typeof item == "function" ? item(...args) : item

      return [...input, item]
    }
  })

  return
}

export const addCallback = (options: CallbackItem): void => {
  const { callback, ...rest } = options

  addFilter({
    ...rest,
    callback: (_: Function[] = [], ...args: any[]) => [..._, callback(...args)]
  })

  return
}

// Run array of promises and await the result
export const runCallbacks = async (
  hook: string,
  ..._arguments: any[]
): Promise<unknown[]> => {
  const _promises: [PromiseLike<unknown>] = applyFilters(hook, [], ..._arguments)

  return await Promise.all(_promises)
}
