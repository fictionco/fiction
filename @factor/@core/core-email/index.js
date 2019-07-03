export default Factor => {
  return new (class {
    constructor() {}

    async request(method, params) {
      return await Factor.$endpoint.request({ id: "email", method, params })
    }
  })()
}
