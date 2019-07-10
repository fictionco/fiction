import qs from "qs"
export default Factor => {
  return new (class {
    constructor() {
      this.endpointBase = "/_api"
    }

    serializer(params) {
      return qs.stringify(params)
    }

    async request({ id, method, params = {}, headers = {} }) {
      const requestPath = `${this.endpointBase}/${id}`

      try {
        if (!method) {
          Factor.$error.throw(500, `Endpoint request to "${id}" requires a method.`)
        }

        const sendData = { method, params }

        await Factor.$user.init()

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
