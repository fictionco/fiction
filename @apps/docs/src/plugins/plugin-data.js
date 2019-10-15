import Factor from "vue"

import axios from "axios"
export default () => {
  return new (class {
    constructor() {}

    async getReadme() {
      const data = await axios.get("//registry.npmjs.com/@factor/cli/")

      console.log("DATAAAA", data)
    }
  })()
}
