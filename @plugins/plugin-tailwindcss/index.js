import { addFilter } from "@factor/tools"

// const tailwindConfig = setting("tailwindcss.configURL")

// const tailwindCSS = require("tailwindcss")

addFilters()

function addFilters() {
  addFilter(
    "factor_head",
    _ => {
      const add =  `<link rel="stylesheet" href="./css/build/tailwind.css">`      

      return [..._, add]
    },
    { priority: 200 }
  )
}
