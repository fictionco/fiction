export default Factor => {
  return new (class {
    constructor() {
      Factor.$filters.callback("route-query-action-verify-email", _ => this.verifyEmail(_))
    }

    async request(method, params) {
      return await Factor.$endpoint.request({ id: "user-emails", method, params })
    }

    async verifyEmail({ _id, code }) {
      const result = await this.request("verifyEmail", { _id, code })

      if (result) {
        Factor.$events.$emit("notify", "Email confirmed!")
      }
    }
  })()
}
