import Factor from "vue"
import { plugins } from "../extensions"
import { deepMerge } from "@factor/tools/utils"
import axios from "axios"
export default () => {
  return new (class {
    constructor() {}

    async getIndex(page = 1) {
      const slugs = plugins //["axios", "open", "lodash"]

      const index = await Promise.all(slugs.map(async slug => this.getSingle(slug)))

      return index
    }

    async getSingle(slug) {
      // let ghToken = process.env.GITHUB_TOKEN

      const results = await Promise.all([
        axios.get(`https://registry.npmjs.org/${slug}`),
        axios.get(`https://api.npmjs.org/downloads/point/last-month/${slug}`)
        // axios.get("https://api.github.com/repos/fiction-com/factor/", {
        //   headers: {
        //     Authorization: `"Bearer ` + ghToken + `"`, //the token is a variable which holds the token
        //     "Content-Type": "application/json"
        //   }
        // })
      ])

      const allData = deepMerge(results.map(r => r.data))

      //return { myData: allData }

      return allData
    }

    async getReadme(slug) {
      const results = await Promise.all([
        axios.get(`https://registry.npmjs.org/${slug}`),
        axios.get(`https://api.npmjs.org/downloads/point/last-month/${slug}`)
      ])

      const allData = deepMerge(results.map(r => r.data))

      return { myData: allData }
    }
  })()
}
