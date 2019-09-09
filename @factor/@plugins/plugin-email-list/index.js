export default Factor => {
  return new (class {
    constructor() {
      Factor.$filters.callback("route-query-action-verify-email-list", _ =>
        this.verifyEmail(_)
      )

      Factor.$filters.add("components", _ => {
        _["factor-email-list"] = () => import("./wrap.vue")
        return _
      })
    }

    async verifyEmail(query) {
      const result = await this.request("verifyEmail", query)

      if (result) {
        Factor.$events.$emit(
          "notify",
          this.getSetting({ key: "emails.confirm.successMessage", listId: query.list })
        )
      }
      return result
    }

    settings(listId = "") {
      const merge = [Factor.$setting.get(`emailList.default`)]

      if (listId && listId != "default") {
        const list = Factor.$setting.get(`emailList.${listId}`)

        if (list) merge.push(list)
      }
      return Factor.$utils.deepMerge(merge)
    }

    getSetting({ listId, key, defaultValue = "" }) {
      return Factor.$utils.dotSetting({ key, settings: this.settings(listId) })
    }

    async request(method, params) {
      return await Factor.$endpoint.request({ id: "emailList", method, params })
    }

    async addEmail({ email, listId }) {
      return await this.request("addEmail", { email, listId })
    }
  })()
}
