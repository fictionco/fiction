import {
  timestamp,
  deepMerge,
  dotSetting,
  emitEvent,
  addFilter,
  pushToFilter,
  addCallback,
  setting
} from "@factor/tools"
import { endpointRequest } from "@factor/endpoint"
export default Factor => {
  return new (class {
    constructor() {
      this.postType = "emailList"

      addCallback("route-query-action-verify-email-list", _ => this.verifyEmail(_))

      addFilter("components", _ => {
        _["factor-email-list"] = () => import("./wrap.vue")
        return _
      })

      pushToFilter("post-types", {
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
      const merge = [setting(`emailList.default`)]

      if (listId && listId != "default") {
        const list = setting(`emailList.${listId}`)

        if (list) merge.push(list)
      }
      return deepMerge(merge)
    }

    getSetting({ listId, key, defaultValue = "" }) {
      return dotSetting({ key, settings: this.settings(listId) })
    }

    async request(method, params) {
      return await endpointRequest({ id: this.postType, method, params })
    }

    async addEmail({ email, listId, tags = [] }) {
      emitEvent("email-list-new-email-requested", { email, listId, tags })
      return await this.request("addEmail", { email, listId, tags })
    }
  })()
}
