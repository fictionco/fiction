import { addFilter } from "@factor/api/hooks"

addFilter({
  hook: "server-renderer-options",
  callback: (options: { inject: boolean; template: () => string }) => {
    options.inject = false
    options.template = (): string => {
      return "hi"
    }
    return options
  },
  key: "test-server-renderer",
})
