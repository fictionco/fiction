import {
  timestamp,
  deepMerge,
  dotSetting,
  emitEvent,
  addPostType,
  addCallback,
  setting
} from "@factor/tools"
import Vue from "vue"
import { endpointRequest } from "@factor/endpoint"
import { EmailConfig } from "./types"
const postType = "emailList"

interface VerifyEmail {
  list: string;
  email: string;
  code: string;
}

addCallback("route-query-action-verify-email-list", (_: VerifyEmail) => verifyEmail(_))

export const factorEmailList = (): Promise<Vue> => import("./wrap.vue")

export const postTypeUIConfig = {
  postType,
  nameIndex: "Email Lists",
  nameSingle: "List",
  namePlural: "Email Lists",
  listTemplate: (): Promise<Vue> => import("./dashboard-list.vue"),
  editTemplate: (): Promise<Vue> => import("./dashboard-edit.vue"),
  add: false
}

addPostType(postTypeUIConfig)

export async function deleteEmails({
  emails,
  listId
}: {
  emails: string[];
  listId: string;
}): Promise<object | void> {
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

export function csvExport({
  filename,
  data
}: {
  filename: string;
  data: object[];
}): void {
  filename += `-${timestamp()}`

  const ExportToCsv = require("export-to-csv").ExportToCsv

  const csvExporter = new ExportToCsv({ filename })

  csvExporter.generateCsv(data)
}

export async function verifyEmail(query: VerifyEmail): Promise<object> {
  const result = await sendEmailListRequest("verifyEmail", query)

  if (result) {
    emitEvent(
      "notify",
      getSetting({ key: "emails.confirm.successMessage", listId: query.list })
    )
  }
  return result
}

export function getListSettings(listId = ""): object {
  const merge = [setting(`emailList.default`)]

  if (listId && listId != "default") {
    const list = setting(`emailList.${listId}`)

    if (list) merge.push(list)
  }
  return deepMerge(merge)
}

export function getSetting({ listId, key }: { listId?: string; key: string }): any {
  return dotSetting({ key, settings: getListSettings(listId) })
}

async function sendEmailListRequest(method: string, params: object): Promise<object> {
  return await endpointRequest({ id: postType, method, params })
}

export async function addEmail({
  email,
  listId,
  tags = []
}: EmailConfig): Promise<object> {
  emitEvent("email-list-new-email-requested", { email, listId, tags })
  return await sendEmailListRequest("addEmail", { email, listId, tags })
}
