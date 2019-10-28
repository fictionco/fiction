import axios from "axios"
import { isNode } from "@factor/tools"
export default Factor => {
  return new (class {
    constructor() {
      Factor.$filters.add("before-app", () => {
        this.standardHeaders()
      })
    }
    util() {
      return axios
    }

    post(path, data, options = {}) {
      const { headers = {} } = options

      options.headers = { Authorization: this.bearerToken(), ...headers }

      return axios.post(path, data, options)
    }

    request() {
      return axios.request.apply(axios, arguments)
    }

    bearerToken() {
      return Factor.$user.token() ? `Bearer ${Factor.$user.token()}` : ""
    }

    async standardHeaders() {
      if (isNode) {
        const port = process.env.PORT || 3000

        //  axios.defaults.baseURL = `https://localhost:${port}`
        // axios.defaults.proxy = {
        //   host: "0.0.0.0",
        //   port
        // }
      } else {
        axios.defaults.headers.common["Authorization"] = this.bearerToken()
      }
    }
  })()
}
