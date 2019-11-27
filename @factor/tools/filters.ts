import { sortPriority, uniqueObjectHash } from "@factor/tools/utils"

let __filters
let __applied

export function getFilters() {
  if (!__filters) __filters = {}

  return __filters
}

export function getApplied() {
  if (!__applied) __applied = {}

  return __applied
}

export function getFilterCount(_id: string): number {
  const added = getFilters()[_id]

  return added && Object.keys(added).length > 0 ? Object.keys(added).length : 0
}

// Apply filters a maximum of one time, once they've run add to _applied property
// If that is set just return it
export function applyFilters(_id: string, data: any, ...rest): any {
  // Get Filters Added
  const _added = getFilters()[_id]

  // Thread through filters if they exist
  if (_added && Object.keys(_added).length > 0) {
    const _addedArray = Object.keys(_added).map(i => _added[i])
    const _sorted = sortPriority(_addedArray)

    for (const element of _sorted) {
      const { callback, context } = element
      const result = callback.call(context, data, ...rest)

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

export function addFilter<T>(
  _id: string,
  filter: T,
  { context = null, priority = 100, key = "" } = {}
): T {
  const $filters = getFilters()

  if (!$filters[_id]) $filters[_id] = {}

  // create unique ID
  // In certain situations (HMR, dev), the same filter can be added twice
  // Using objects and a hash identifier solves that
  const filterKey = `key_${uniqueObjectHash(filter, callerKey(key))}`

  // For simpler assignments where no callback is needed
  const callback = typeof filter != "function" ? (): T => filter : filter

  $filters[_id][filterKey] = { callback, context, priority }

  return filter
}

export function pushToFilter<T>(_id: string, item: T, { key = "", pushTo = -1 } = {}): T {
  key = uniqueObjectHash(item, callerKey(key))

  addFilter(
    _id,
    (_: T[], args) => {
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

export function addCallback<T>(
  _id: string,
  callback: Function | T,
  options: { key?: string } = {}
): Function | T {
  // get unique signature which includes the caller path of function and stringified callback
  // added the caller because sometimes callbacks look the exact same in different files!
  const { key = "" } = options

  options.key = uniqueObjectHash(callback, callerKey(key))

  const callable = typeof callback != "function" ? (): T => callback : callback

  addFilter(_id, (_ = [], args) => [..._, callable(args)], options)

  return callback
}

// Run array of promises and await the result
export async function runCallbacks(
  _id: string,
  _arguments: object = {}
): Promise<unknown[]> {
  const _promises: [PromiseLike<unknown>] = applyFilters(_id, [], _arguments)
  return await Promise.all(_promises)
}

// Use the function that called the filter in the key
// this prevents issues where two filters in different may match each other
// which causes difficult to solve bugs (data-schemas is an example)
function callerKey(key): string {
  return (
    key +
    new Error().stack
      .toString()
      .split("at")
      .find(line => !line.match(/(filter|Error)/))
  )
}
