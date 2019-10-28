import Factor from "@factor/core"
import { sortPriority, uniqueObjectHash } from "@factor/tools"

// Singleton
if (!Factor.$filters) {
  class FactorFilters {
    constructor() {
      this._filters = {}
      this._applied = {}
    }

    // Get total number of filters added on an id
    count(name) {
      const _added = this._filters[name]

      return _added && Object.keys(_added).length > 0 ? Object.keys(_added).length : 0
    }

    // Apply filters a maximum of one time, once they've run add to _applied property
    // If that is set just return it
    apply(name, data) {
      //if (!this._applied[name]) {

      // Remove "name" argument
      const params = Array.prototype.slice.call(arguments, 1)

      // Get Filters Added
      const _added = this._filters[name]

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

      this._applied[name] = data

      return this._applied[name]
    }

    add(id, filter, { context = false, priority = 100, key = "", reloads = false } = {}) {
      if (!this._filters[id]) this._filters[id] = {}

      // create unique ID
      // In certain situations (HMR, dev), the same filter can be added twice
      // Using objects and a hash identifier solves that
      const filterKey = `key_${uniqueObjectHash(filter, this.callerKey(key))}`

      // For simpler assignments where no callback is needed
      const callback = typeof filter != "function" ? () => filter : filter

      context = context || this

      this._filters[id][filterKey] = { callback, context, priority }

      return filter
    }

    push(_id, item, options = {}) {
      const { key = "" } = options
      options.key = uniqueObjectHash(item, this.callerKey(key))

      this.add(
        _id,
        (_, args) => {
          item = typeof item == "function" ? item(args) : item
          return [..._, item]
        },
        options
      )
    }

    register(_id, _property, item, options = {}) {
      const { key = "" } = options
      options.key = uniqueObjectHash(item, this.callerKey(key))

      this.add(
        _id,
        (_, args) => {
          item = typeof item == "function" ? item(args) : item
          return { ..._, [_property]: item }
        },
        options
      )
    }

    // Add callbacks into an array of promises, meant to be used with $filters.run
    callback(id, callback, options = {}) {
      // get unique signature which includes the caller path of function and stringified callback
      // added the caller because sometimes callbacks look the exact same in different files!
      const { key = "" } = options
      options.key = uniqueObjectHash(callback, this.callerKey(key))

      const callable = typeof callback != "function" ? () => callback : callback

      this.add(id, (_ = [], args) => [..._, callable(args)], options)
    }

    // Run array of promises and await the result
    async run(id, _arguments = {}) {
      return await Promise.all(this.apply(id, [], _arguments))
    }

    // Use the function that called the filter in the key
    // this prevents issues where two filters in different may match each other
    // which causes difficult to solve bugs (data-schemas is an example)
    callerKey(key) {
      return (
        key +
        new Error().stack
          .toString()
          .split("at")
          .find(line => !line.match(/(filter|Error)/))
      )
    }
  }

  Factor.$filters = Factor.prototype.$filters = new FactorFilters()
}

export default Factor.$filters
