import { sortPriority, uniqueObjectHash } from "@factor/tools/utils"

let __filters = {}
let __applied = {}

export function getFilterCount(_id) {
  const added = __filters[_id]

  return added && Object.keys(added).length > 0 ? Object.keys(added).length : 0
}

// Apply filters a maximum of one time, once they've run add to _applied property
// If that is set just return it
export function applyFilters(name, data) {
  //if (!__applied[name]) {

  // Remove "name" argument
  const params = Array.prototype.slice.call(arguments, 1)

  // Get Filters Added
  const _added = __filters[name]

  // Thread through filters if they exist
  if (_added && Object.keys(_added).length > 0) {
    const _addedArray = Object.keys(_added).map(i => _added[i])
    const _sorted = sortPriority(_addedArray)

    for (const element of _sorted) {
      const { callback, context } = element
      const result = callback.apply(context, params)

      // Add into what is passed into next item
      // If nothing is returned, don't unset the original data
      if (typeof result !== "undefined") {
        params[0] = result
        data = result
      }
    }
  }

  // Sort priority if array is returned
  if (Array.isArray(data)) {
    data = sortPriority(data)
  }

  __applied[name] = data

  return __applied[name]
}

export function addFilter(id, filter, { context = null, priority = 100, key = "" } = {}) {
  if (!__filters[id]) __filters[id] = {}

  // create unique ID
  // In certain situations (HMR, dev), the same filter can be added twice
  // Using objects and a hash identifier solves that
  const filterKey = `key_${uniqueObjectHash(filter, callerKey(key))}`

  // For simpler assignments where no callback is needed
  const callback = typeof filter != "function" ? () => filter : filter

  __filters[id][filterKey] = { callback, context, priority }

  return filter
}

export function pushToFilter(_id, item, options = {}) {
  const { key = "" } = options
  options.key = uniqueObjectHash(item, callerKey(key))

  addFilter(
    _id,
    (_, args) => {
      item = typeof item == "function" ? item(args) : item
      return [..._, item]
    },
    options
  )
}

export function registerOnFilter(_id, _property, item, options = {}) {
  const { key = "" } = options
  options.key = uniqueObjectHash(item, callerKey(key))

  addFilter(
    _id,
    (_, args) => {
      item = typeof item == "function" ? item(args) : item
      return { ..._, [_property]: item }
    },
    options
  )
}

export function addCallback(_id, callback, options = {}) {
  // get unique signature which includes the caller path of function and stringified callback
  // added the caller because sometimes callbacks look the exact same in different files!
  const { key = "" } = options
  options.key = uniqueObjectHash(callback, callerKey(key))

  const callable = typeof callback != "function" ? () => callback : callback

  addFilter(_id, (_ = [], args) => [..._, callable(args)], options)
}

// Run array of promises and await the result
export async function runCallbacks(_id, _arguments = {}) {
  return await Promise.all(applyFilters(_id, [], _arguments))
}

// Use the function that called the filter in the key
// this prevents issues where two filters in different may match each other
// which causes difficult to solve bugs (data-schemas is an example)
function callerKey(key) {
  return (
    key +
    new Error().stack
      .toString()
      .split("at")
      .find(line => !line.match(/(filter|Error)/))
  )
}
