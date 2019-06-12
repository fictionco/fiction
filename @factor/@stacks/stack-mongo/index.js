export default Factor => {
  return new (class {
    constructor() {}

    async callEndpoint() {
      const response = await Factor.$endpoint.request({ id: "myEndpoint", method: "testMethod", params: { idk: 555 } })

      console.log("RESPONSE", response)
    }
  })()
}
