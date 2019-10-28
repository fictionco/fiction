import Factor from "vue"
import { plugins } from "../extensions"
import { deepMerge } from "@factor/tools"
import axios from "axios"
export default () => {
  return new (class {
    constructor() {}

    async getIndex(page = 1) {
      const slugs = ["axios", "open", "lodash"]

      const index = await Promise.all(slugs.map(async slug => this.getSingle(slug)))

      return index
    }

    async getSingle(slug) {
      const results = await Promise.all([
        axios.get(`https://registry.npmjs.org/${slug}`),
        axios.get(`https://api.npmjs.org/downloads/point/last-month/${slug}`)
      ])

      const allData = deepMerge(results.map(r => r.data))

      return { myData: allData }
    }

    async getReadme(slug) {
      // const _promises = plugins.map(async plugin => {
      //   const _queries = [
      //     axios.get(`https://cors-anywhere.herokuapp.com/registry.npmjs.org/${plugin}`)
      //     // axios.get(
      //     //   `https://cors-anywhere.herokuapp.com/https://api.npmjs.org/downloads/point/last-month/${plugin}`
      //     // )
      //     // axios.get(
      //     //   "https://api.github.com/repos/fiction-com/factor/git/trees/master?recursive=1",
      //     //   {
      //     //     headers: {
      //     //       Authorization: "Bearer + process.env.GITHUB_TOKEN", the token is a variable which holds the token
      //     //       "Content-Type": "application/json"
      //     //     }
      //     //   }
      //     // )
      //     // axios.get(
      //     //   "https://cors-anywhere.herokuapp.com/https://api.npms.io/v2/search?q=keywords%3Afactor-plugin"
      //     // )
      //   ]

      //   // plugin package name
      //   //console.log(plugin)

      //   const [{ data }, index] = await Promise.all(_queries)

      //   //console.log(data)

      //   return { ...data, index }
      // })

      // const pluginsData = await Promise.all([
      //   axios.get(`https://registry.npmjs.org/axios`)
      // ])

      let ghToken = process.env.GITHUB_TOKEN

      const results = await Promise.all([
        axios.get(`https://registry.npmjs.org/${slug}`),
        axios.get(`https://api.npmjs.org/downloads/point/last-month/${slug}`)
        // axios.get(
        //   "https://api.github.com/repos/fiction-com/factor/git/trees/master?recursive=1",
        //   {
        //     headers: {
        //       Authorization: `"Bearer ` + ghToken + `"`, // the token is a variable which holds the token
        //       "Content-Type": "application/json"
        //     }
        //   }
        // )
      ])

      //console.log(results)

      const allData = deepMerge(results.map(r => r.data))

      //console.log(allData)

      return { myData: allData }
    }
  })()
}

// getNpmDownloadsLastMonth: function (name) {
//   return $http.get('https://api.npmjs.org/downloads/point/last-month/' + name).success(function (resp) {
//       return resp;
//   });
// },

// getNpmDownloadsRangeLastMonth: function (name) {
//   return $http.get('https://api.npmjs.org/downloads/range/last-month/' + name).success(function (resp) {
//       return resp;
//   });
// },
