export default Factor => {
  return new (class {
    constructor() {
      Factor.$filters.callback("route-query-action-verify-email-list", _ =>
        this.verifyEmail(_)
      )
    }

    async verifyEmail(query) {
      console.log("request verify email", query)
      const result = await this.request("verifyEmail", query)

      if (result) {
        Factor.$events.$emit("notify", "Email confirmed!")
      }
      return result
    }

    settings(listId = "") {
      return Factor.$utils.deepMerge([
        Factor.$setting.get(`emailList`),
        Factor.$setting.get(`emailList.customList.${listId}`)
      ])
    }

    getSetting({ listId, key, defaultValue = "" }) {
      return (
        Factor.$utils.dotSetting({ key, settings: this.settings(listId) }) || defaultValue
      )
    }

    async request(method, params) {
      return await Factor.$endpoint.request({ id: "emailList", method, params })
    }

    async addEmail({ email }) {
      return await this.request("addEmail", { email })
    }
  })()
}
