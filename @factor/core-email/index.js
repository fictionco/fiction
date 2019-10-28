import Factor from "@factor/core"
export default () => {
  return new (class {
    constructor() {}

    async request(method, params) {
      return await Factor.$endpoint.request({ id: "email", method, params })
    }
  })()
}
