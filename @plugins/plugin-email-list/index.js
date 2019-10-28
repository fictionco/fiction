import { timestamp, deepMerge, dotSetting, emitEvent } from "@factor/tools"
export default Factor => {
  return new (class {
    constructor() {
      this.postType = "emailList"

      Factor.$filters.callback("route-query-action-verify-email-list", _ =>
        this.verifyEmail(_)
      )

      Factor.$filters.add("components", _ => {
        _["factor-email-list"] = () => import("./wrap.vue")
        return _
      })

      Factor.$filters.push("post-types", {
        postType: this.postType,
        nameIndex: "Email Lists",
        nameSingle: "List",
        namePlural: "Email Lists",
        listTemplate: () => import("./dashboard-list.vue"),
        editTemplate: () => import("./dashboard-edit.vue"),
        add: false
      })
    }

    async deleteEmails({ emails, listId }) {
      let result
      if (
        confirm(
          `Are you sure? This will permanently delete ${emails.length} items from the "${listId}" list.`
        )
      ) {
        result = await this.request("deleteEmails", { emails, listId })
      }

      return result
    }

    csvExport({ filename, data }) {
      filename += `-${timestamp()}`

      console.log("export", data)

      const ExportToCsv = require("export-to-csv").ExportToCsv

      const csvExporter = new ExportToCsv({ filename })

      csvExporter.generateCsv(data)
    }

    async verifyEmail(query) {
      const result = await this.request("verifyEmail", query)

      if (result) {
        emitEvent(
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
      return deepMerge(merge)
    }

    getSetting({ listId, key, defaultValue = "" }) {
      return dotSetting({ key, settings: this.settings(listId) })
    }

    async request(method, params) {
      return await Factor.$endpoint.request({ id: this.postType, method, params })
    }

    async addEmail({ email, listId, tags = [] }) {
      emitEvent("email-list-new-email-requested", { email, listId, tags })
      return await this.request("addEmail", { email, listId, tags })
    }
  })()
}
