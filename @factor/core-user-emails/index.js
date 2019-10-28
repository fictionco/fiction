import { emitEvent, addCallback } from "@factor/tools"
export default Factor => {
  return new (class {
    constructor() {
      addCallback("route-query-action-verify-email", _ => this.verifyEmail(_))
      addCallback("route-query-action-reset-password", _ => this.showResetPassword(_))
    }

    async request(method, params) {
      return await Factor.$endpoint.request({ id: "user-emails", method, params })
    }

    async sendVerifyEmail({ _id, email }) {
      const result = await this.request("sendVerifyEmail", { _id, email })

      if (result) {
        emitEvent("notify", "Verification email sent!")
      }

      return result
    }

    async verifyEmail({ _id, code }) {
      const result = await this.request("verifyEmail", { _id, code })

      if (result) {
        emitEvent("notify", "Email confirmed!")
      }
      return result
    }

    async showResetPassword({ _id, code }) {
      addCallback("signin-modal-loaded", () => {
        emitEvent("signin-modal")
      })
    }

    async verifyAndResetPassword(args) {
      const result = await this.request("verifyAndResetPassword", args)

      if (result) {
        emitEvent("notify", "Password successfully reset!")
      }

      return result
    }

    async sendPasswordResetEmail({ email }) {
      const result = await this.request("sendPasswordResetEmail", { email })

      if (result) {
        emitEvent("notify", "Password reset email sent.")
      }

      return result
    }
  })()
}
