import {
  timestamp,
  deepMerge,
  dotSetting,
  emitEvent,
  pushToFilter,
  addCallback,
  registerOnFilter,
  setting
} from "@factor/tools"

import { endpointRequest } from "@factor/endpoint"

const postType = "emailList"

addCallback("route-query-action-verify-email-list", _ => verifyEmail(_))

registerOnFilter("components", "factor-email-list", () => import("./wrap.vue"))

export const postTypeUIConfig = {
  postType,
  nameIndex: "Email Lists",
  nameSingle: "List",
  namePlural: "Email Lists",
  listTemplate: () => import("./dashboard-list.vue"),
  editTemplate: () => import("./dashboard-edit.vue"),
  add: false
}

pushToFilter("dashboard-post-types", postTypeUIConfig)

export async function deleteEmails({ emails, listId }) {
  let result
  if (
    confirm(
      `Are you sure? This will permanently delete ${emails.length} items from the "${listId}" list.`
    )
  ) {
    result = await sendEmailListRequest("deleteEmails", { emails, listId })
  }

  return result
}

export function csvExport({ filename, data }) {
  filename += `-${timestamp()}`

  console.log("export", data)

  const ExportToCsv = require("export-to-csv").ExportToCsv

  const csvExporter = new ExportToCsv({ filename })

  csvExporter.generateCsv(data)
}

export async function verifyEmail(query) {
  const result = await sendEmailListRequest("verifyEmail", query)

  if (result) {
    emitEvent(
      "notify",
      getSetting({ key: "emails.confirm.successMessage", listId: query.list })
    )
  }
  return result
}

function settings(listId = "") {
  const merge = [setting(`emailList.default`)]

  if (listId && listId != "default") {
    const list = setting(`emailList.${listId}`)

    if (list) merge.push(list)
  }
  return deepMerge(merge)
}

export function getSetting({ listId, key }) {
  return dotSetting({ key, settings: settings(listId) })
}

async function sendEmailListRequest(method, params) {
  return await endpointRequest({ id: postType, method, params })
}

export async function addEmail({ email, listId, tags = [] }) {
  emitEvent("email-list-new-email-requested", { email, listId, tags })
  return await sendEmailListRequest("addEmail", { email, listId, tags })
}
