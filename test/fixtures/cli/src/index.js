module.exports.default = Factor => {
  return new (class {
    constructor() {
      // Prevent injection in template
      Factor.$filters.add("server-renderer-options", options => {
        options.inject = false
        options.template = (result, context) => {
          return "hi"
        }
        return options
      })
    }
  })()
}
