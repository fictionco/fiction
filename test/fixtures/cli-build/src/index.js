import { addFilter } from "@factor/tools"
addFilter("server-renderer-options", options => {
  options.inject = false
  options.template = () => {
    return "hi"
  }
  return options
})
