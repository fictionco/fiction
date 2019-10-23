import Factor from "@factor/core"
import filters from "."

export function addFilter(_id, filter, options = {}) {
  return filters.add(_id, filter, options)
}

export function pushToFilter(_id, filter, options = {}) {
  return filters.push(_id, filter, options)
}

export function applyFilters(_id, _initialData) {
  return filters.apply(_id, _initialData)
}

export function addCallback(_id, callback, options = {}) {
  return filters.callback(_id, callback, options)
}

export function runCallbacks(_id, _arguments) {
  return filters.run(_id, _arguments)
}
