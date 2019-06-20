module.exports.default = Factor => {
  return new (class {
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

      let str
      if (typeof obj == "string") {
        str = obj
      } else if (typeof obj == "function") {
        str = obj.toString()
      } else {
        str = JSON.stringify(obj)
      }

      str = str.substring(0, 500)

      return str.split("").reduce((prevHash, currVal) => ((prevHash << 5) - prevHash + currVal.charCodeAt(0)) | 0, 0)
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
        const _sorted = this._sort(_addedArray)

        for (let i = 0; i < _sorted.length; i++) {
          const { callback, context } = _sorted[i]

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
        data = this._sort(data)
      }

      this._applied[name] = data

      return this._applied[name]
    }

    add(name, filter, { context = false, priority = 100, signature = "" } = {}) {
      if (!this._filters[name]) {
        this._filters[name] = {}
      }

      // create unique ID
      // In certain situations (HMR, dev), the same filter can be added twice
      // Using objects and a hash identifier solves that
      const id = `id_${signature}${this.uniqueHash(filter)}`

      // For simpler assignments where no callback is needed
      const callback = typeof filter != "function" ? () => filter : filter

      context = context || this

      this._filters[name][id] = { callback, context, priority }

      return filter
    }

    // Add callbacks into an array of promises, meant to be used with $filters.run
    callback(id, callback, options = {}) {
      options.signature = this.uniqueHash(callback)

      const callable = typeof callback != "function" ? () => callback : callback

      this.add(id, (_ = [], args) => [..._, callable(args)], options)
    }

    // Run array of promises and await the result
    async run(id, args = {}) {
      return await Promise.all(this.apply(id, [], args))
    }
  })()
}
