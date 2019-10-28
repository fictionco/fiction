import { addFilter } from "@factor/tools"
export default Factor => {
  return new (class {
    constructor() {
      // Prevent injection in template
      addFilter("server-renderer-options", options => {
        options.inject = false
        options.template = (result, context) => {
          return "hi"
        }
        return options
      })
    }
  })()
}
