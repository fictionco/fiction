const parse = require("qs").parse
const axios = require("axios")
export default Factor => {
  return new (class {
    constructor() {
      this.standardHeaders()
    }
    util() {
      return axios
    }

    post() {
      return axios.post.apply(axios, arguments)
    }

    request() {
      return axios.request.apply(axios, arguments)
    }

    async process({ request, response, handler }) {
      const { query, body, headers } = request

      const meta = { request, response }
      const data = { ...body, ...parse(query) }

      const { authorization } = headers

      if (authorization && authorization.startsWith("Bearer ")) {
        const token = authorization.split("Bearer ")[1]

        meta.bearer = await Factor.$user.retrieveUser({ token, mode: "simple" })
      }

      const responseJson = { result: "", error: "" }

      try {
        responseJson.result = await handler({ data, meta })
      } catch (error) {
        if (!error.statusCode) {
          error.statusCode = error.name == "ValidationError" ? 400 : 500
        }
        responseJson.error = Factor.$error.create(error.statusCode, error.message, { stackTrace: error.stack })
        Factor.$log.error(error)
      }

      response
        .status(200)
        .jsonp(responseJson)
        .end()

      return
    }

    async parseRequest(request) {
      let meta = { request }

      const { headers } = request
      const { authorization } = headers

      if (authorization && authorization.startsWith("Bearer ")) {
        const token = authorization.split("Bearer ")[1]

        meta.bearer = await Factor.$user.retrieveUser({ token })
      }

      return meta
    }

    async standardHeaders() {
      if (Factor.$isNode) return
      const bearerToken = Factor.$user.token() ? `Bearer ${Factor.$user.token()}` : ""
      axios.defaults.headers.common["Authorization"] = bearerToken
    }
  })()
}
