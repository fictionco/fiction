import { addFilter } from "@factor/tools"

// const tailwindConfig = setting("tailwindcss.configURL")

// const tailwindCSS = require("tailwindcss")

//var resolveUrl = require("resolve-url")

const tailwindCSS = "./css/build/tailwind.css"

addFilters()

function addFilters() {
  addFilter(
    "factor_head",
    _ => {
      const add = `<link rel="stylesheet" href="${tailwindCSS}">`

      return [..._, add]
    },
    { priority: 200 }
  )
}
