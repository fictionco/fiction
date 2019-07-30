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
          throw new Error(`Endpoint request to "${id}" requires a method.`)
        }

        const sendData = { method, params }

        // wait for user initialization
        // except for actual request for user from token
        // if (!params.token) {
        //   await Factor.$user.init()
        // }

        const {
          data: { result, error }
        } = await Factor.$http.post(requestPath, sendData, { headers })

        if (error) {
          Factor.$events.$emit("error", error)
          console.warn(error)
        }

        return result
      } catch (error) {
        throw new Error(error)
      }
    }
  })()
}
