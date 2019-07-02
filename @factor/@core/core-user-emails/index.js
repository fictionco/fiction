export default Factor => {
  return new (class {
    constructor() {
      Factor.$filters.callback("route-query-action-verify-email", _ => this.verifyEmail(_))
      Factor.$filters.callback("route-query-action-reset-password", _ => this.verifyAndResetPassword(_))
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

    async verifyAndResetPassword({ _id, code, newPassword }) {
      const result = await this.request("verifyAndResetPassword", { _id, code, newPassword })

      if (result) {
        Factor.$events.$emit("notify", "Password successfully reset!")
      }
    }

    async sendPasswordResetEmail({ email }) {
      const result = await this.request("sendPasswordResetEmail", { email })

      if (result) {
        Factor.$events.$emit("notify", "Password reset email sent.")
      }
    }
  })()
}
