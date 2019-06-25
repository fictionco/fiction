import qs from "qs"
export default Factor => {
  return new (class {
    constructor() {
      this.endpointBase = "/_api"
    }

    serializer(params) {
      return qs.stringify(params)
    }

    async authHeader() {
      const tokenId = Factor.$user.token()

      return tokenId ? `Bearer ${tokenId}` : ""
    }

    async request({ id, method, params = {}, headers = {} }) {
      const requestPath = `${this.endpointBase}/${id}`

      try {
        if (!method) {
          Factor.$error.throw(500, `Endpoint request to "${id}" requires a method.`)
        }

        headers.Authorization = this.authHeader()

        const sendData = { method, params }

        const {
          data: { result, error }
        } = await Factor.$http.post(requestPath, sendData, { headers })

        if (error) {
          const { statusCode, description, stackTrace } = error
          Factor.$error.throw(statusCode, description, { stackTrace })
        }

        return result
      } catch (error) {
        Factor.$error.notify(error)
      }
    }
  })()
}
