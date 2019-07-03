export default Factor => {
  return new (class {
    constructor() {
      Factor.$filters.callback("route-query-action-verify-email", _ => this.verifyEmail(_))
      Factor.$filters.callback("route-query-action-reset-password", _ => this.showResetPassword(_))
    }

    async request(method, params) {
      return await Factor.$endpoint.request({ id: "user-emails", method, params })
    }

    async verifyEmail({ _id, code }) {
      const result = await this.request("verifyEmail", { _id, code })

      if (result) {
        Factor.$events.$emit("notify", "Email confirmed!")
      }
      return result
    }

    async showResetPassword({ _id, code }) {
      Factor.$filters.callback("signin-modal-loaded", () => {
        Factor.$events.$emit("signin-modal")
      })
    }

    async verifyAndResetPassword(args) {
      const result = await this.request("verifyAndResetPassword", args)

      if (result) {
        Factor.$events.$emit("notify", "Password successfully reset!")
      }

      return result
    }

    async sendPasswordResetEmail({ email }) {
      const result = await this.request("sendPasswordResetEmail", { email })

      if (result) {
        Factor.$events.$emit("notify", "Password reset email sent.")
      }

      return result
    }
  })()
}
