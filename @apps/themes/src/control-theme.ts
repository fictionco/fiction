import { addFilter } from "@factor/api/hooks"

addFilter({
  hook: "app-base-route",
  key: "addSubAppPath",
  callback: () => {
    return `/alpha`
  }
})
