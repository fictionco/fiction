import { addFilter } from "@factor/tools/hooks"

addFilter({
  hook: "server-renderer-options",
  callback: (options: { inject: boolean; template: Function }) => {
    options.inject = false
    options.template = (): string => {
      return "hi"
    }
    return options
  },
  key: "test-server-renderer"
})
