module.exports = Factor => {
  return new class {
    constructor() {
      this._filters = {}
      this._applied = {}
    }

    _sort(arr) {
      return arr.sort((a, b) => {
        const ap = a.priority || 100
        const bp = b.priority || 100

        if (ap < bp) {
          return -1
        } else if (ap > bp) {
          return 1
        } else {
          return 0
        }
      })
    }

    uniqueHash(obj) {
      if (!obj) {
        return obj
      }

      let str = typeof obj !== "string" ? obj.toString() : obj

      str = str.substring(0, 500)

      return str
        .split("")
        .reduce((prevHash, currVal) => ((prevHash << 5) - prevHash + currVal.charCodeAt(0)) | 0, 0)
    }

    async applyService({ service, filter, args }) {
      const added = this.apply(filter, [], args)

      if (added.length == 0) {
        console.warn(`[Factor] No [${filter}] handler added in [${service}] service`)
        return null
      }

      const results = await Promise.all(added)

      return Factor.$lodash.flatten(results)[0]
    }

    // Services should always be an array of promises
    // This function allows a simple async function to be added as an arg
    // then it turns it into the array format needed
    addService(args) {
      let { name, service, options } = args

      this.add(
        name,
        (_, filterArgs) => {
          _.push(service(filterArgs))
          return _
        },
        options
      )
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
        const _sorted = this._sort(_addedArray)

        for (let i = 0; i < _sorted.length; i++) {
          const { callback, context } = _sorted[i]

          data = callback.apply(context, params)

          // Add into what is passed into next item
          if (data !== "undefined") {
            params[0] = data
          }
        }
      }

      // Sort priority if array is returned
      if (Array.isArray(data)) {
        data = this._sort(data)
      }

      this._applied[name] = data

      return this._applied[name]
    }

    add(name, filter, { context = false, priority = 100 } = {}) {
      if (!this._filters[name]) {
        this._filters[name] = {}
      }

      // create unique ID
      // In certain situations (HMR, dev), the same filter can be added twice
      // Using objects and a hash identifier solves that
      const id = "id" + this.uniqueHash(filter)

      // For simpler assignments where no callback is needed
      const callback = typeof filter != "function" ? () => filter : filter

      context = context || this

      this._filters[name][id] = { callback, context, priority }

      return filter
    }

    addFilter(name, callback, args) {
      return this.add(name, callback, args)
    }

    applyFilters(name, data) {
      return this.apply(name, data)
    }

    get(name, data) {
      return this.apply(name, data)
    }
  }()
}
