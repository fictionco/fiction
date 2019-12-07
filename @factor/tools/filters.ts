import { sortPriority } from "@factor/tools/utils"
import Vue from "vue"

type FilterRecord = Record<string, Record<string, FilterItem>>

interface FilterItem {
  _id: string;
  uniqueKey?: string;
  callback: Function;
  context?: object;
  priority?: number;
}

declare module "vue/types/vue" {
  export interface VueConstructor {
    $filters: { filters: FilterRecord; applied: FilterRecord };
  }
}

// This needs to be retained after server restart in development
// Can't be sure that original filters are added again.
if (!Vue.$filters) {
  Vue.$filters = {
    filters: {},
    applied: {}
  }
}

export const getFilters = (): FilterRecord => {
  return Vue.$filters.filters
}

export const getApplied = (): FilterRecord => {
  return Vue.$filters.applied
}

const setFilter = ({
  _id = "",
  uniqueKey = "",
  callback,
  context,
  priority
}: FilterItem): Record<string, any> => {
  Vue.$filters.filters[_id][uniqueKey] = { _id, uniqueKey, callback, context, priority }

  return Vue.$filters.filters[_id]
}

export const getFilterCount = (_id: string): number => {
  const added = getFilters()[_id]

  return added && Object.keys(added).length > 0 ? Object.keys(added).length : 0
}

// Apply filters a maximum of one time, once they've run add to _applied property
// If that is set just return it
export const applyFilters = (_id: string, data: any, ...rest: any[]): any => {
  // Get Filters Added
  const _added = getFilters()[_id]

  // Thread through filters if they exist
  if (_added && Object.keys(_added).length > 0) {
    const _addedArray = Object.keys(_added).map(i => _added[i])
    const _sorted = sortPriority(_addedArray)

    for (const element of _sorted) {
      const { callback, context } = element
      const result = callback.apply(context, [data, ...rest])

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

  getApplied()[_id] = data

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

export const addFilter = <T>(
  _id: string,
  cb: T,
  { context = {}, priority = 100, key = "" } = {}
): T => {
  const $filters = getFilters()

  if (!$filters[_id]) $filters[_id] = {}

  key = key ? key : uniqueObjectHash(cb)

  // create unique ID
  // In certain situations (HMR, dev), the same filter can be added twice
  // Using objects and a hash identifier solves that
  const uniqueKey = `key_${key}`

  // For simpler assignments where no callback is needed
  const callback = typeof cb != "function" ? (): T => cb : cb

  setFilter({ _id, uniqueKey, callback, context, priority })

  return cb
}

export const pushToFilter = <T>(
  _id: string,
  item: T,
  { key = "", pushTo = -1 } = {}
): T => {
  key = key ? key : uniqueObjectHash(item)

  addFilter(
    _id,
    (_: T[], args: object) => {
      item = typeof item == "function" ? item(args) : item

      if (pushTo >= 0) {
        _.splice(pushTo, 0, item)
        return _
      } else {
        return [..._, item]
      }
    },
    { key }
  )

  return item
}

export const addCallback = <T>(
  _id: string,
  callback: Function | T,
  { key = "" } = {}
): Function | T => {
  // get unique signature which includes the caller path of function and stringified callback
  // added the caller because sometimes callbacks look the exact same in different files!
  key = key ? key : uniqueObjectHash(callback)

  const callable = typeof callback != "function" ? (): T => callback : callback

  addFilter(_id, (_: Function[] = [], args: object) => [..._, callable(args)], {
    key
  })

  return callback
}

// Run array of promises and await the result
export const runCallbacks = async (
  _id: string,
  _arguments: object = {}
): Promise<unknown[]> => {
  const _promises: [PromiseLike<unknown>] = applyFilters(_id, [], _arguments)

  return await Promise.all(_promises)
}
