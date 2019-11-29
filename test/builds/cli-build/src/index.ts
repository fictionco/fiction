import { addFilter } from "@factor/tools"

addFilter(
  "server-renderer-options",
  (options: { inject: boolean; template: Function }) => {
    options.inject = false
    options.template = (): string => {
      return "hi"
    }
    return options
  }
)
