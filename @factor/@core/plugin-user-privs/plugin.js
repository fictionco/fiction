module.exports.default = Factor => {
  return new class {
    constructor() {
      this.appTriggers()
    }

    appTriggers() {
      Factor.$events.$on("auth-user-signed-in", credentials => {
        this.appSetCustomClaims(credentials)
      })
    }

    async appSetCustomClaims(credentials) {
      const result = await Factor.$endpoint.request({
        endpoint: "privs",
        action: "apply"
      })

      // If new privs are set,
      // then user auth/tokens need a reset
      if (result.refresh) {
        Factor.$events.$emit("auth-refresh-tokens", credentials)
      }
    }
  }()
}
