import { pushToFilter } from "@factor/tools"
export default Factor => {
  return new (class {
    constructor() {
      pushToFilter("data-schemas", () => require("./schema").default(Factor), {
        key: "contact-form"
      })
    }
  })()
}
