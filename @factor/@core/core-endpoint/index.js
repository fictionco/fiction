import qs from "qs"
export default Factor => {
  return new (class {
    constructor() {
      this.endpointBase = "/_api"
    }

    serializer(params) {
      return qs.stringify(params)
    }

    async headers() {
      const headers = {}

      if (Factor.$auth) {
        const tokenId = await Factor.$user.token()

        if (tokenId) {
          headers.Authorization = `Bearer ${tokenId}`
        }
      }

      return headers
    }

    async request({ id, method, params = {} }) {
      const requestPath = `${this.endpointBase}/${id}`

      if (!method) {
        console.error(`Endpoint request to ${id} requires a method.`)
      }

      try {
        const headers = await this.headers()

        const {
          data: { result, error }
        } = await Factor.$http.post(requestPath, { method, params }, { headers })

        if (error) {
          const { statusCode, description, stackTrace } = error
          Factor.$error.notify(statusCode, description, { stackTrace })
        }

        return result
      } catch (error) {
        Factor.$error.notify(error)
      }
    }
  })()
}
