import { addFilter } from "@factor/tools"

// const tailwindConfig = setting("tailwindcss.configURL")

// const tailwindCSS = require("tailwindcss")

const tailwindExport = `./css/build/tailwind.css`

addFilters()

function addFilters() {
  addFilter(
    "factor_head",
    _ => {
      const add = `<link rel="stylesheet" href="${tailwindExport}">`

      return [..._, add]
    },
    { priority: 200 }
  )
}
