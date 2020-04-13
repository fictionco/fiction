import {
  timestamp,
  deepMerge,
  dotSetting,
  emitEvent,
  addPostType,
  addCallback,
  setting,
} from "@factor/api"
import { Component } from "vue"
import { endpointRequest, EndpointParameters } from "@factor/endpoint"
import { ExportToCsv } from "export-to-csv"
import { EmailConfig } from "./types"
const postType = "emailList"

type VerifyEmail = {
  list: string
  email: string
  code: string
} & EndpointParameters

export const factorEmailList = (): Promise<Component> => import("./wrap.vue")

export const getListSettings = (listId = ""): object => {
  const merge = [setting(`emailList.default`)]

  if (listId && listId != "default") {
    const list = setting(`emailList.${listId}`)

    if (list) merge.push(list)
  }
  return deepMerge(merge)
}

export const getSetting = ({ listId, key }: { listId?: string; key: string }): any => {
  return dotSetting({ key, settings: getListSettings(listId) })
}

export const sendEmailListRequest = async (
  method: string,
  params: EndpointParameters
): Promise<void> => {
  await endpointRequest({ id: postType, method, params })

  return
}
export const postTypeUIConfig = {
  postType,
  nameIndex: "Email Lists",
  nameSingle: "List",
  namePlural: "Email Lists",
  listTemplate: (): Promise<Component> => import("./dashboard-list.vue"),
  editTemplate: (): Promise<Component> => import("./dashboard-edit.vue"),
  add: false,
}

addPostType(postTypeUIConfig)

export const deleteEmails = async ({
  emails,
  listId,
}: {
  emails: string[]
  listId: string
}): Promise<void> => {
  await sendEmailListRequest("deleteEmails", { emails, listId })

  return
}

export const csvExport = <T = object>({
  filename,
  data,
}: {
  filename: string
  data: T[]
}): void => {
  filename += `-${timestamp()}`

  const csvExporter = new ExportToCsv({ filename })

  csvExporter.generateCsv(data)
}

export const verifyEmail = async (query: VerifyEmail): Promise<void> => {
  await sendEmailListRequest("verifyEmail", query)

  emitEvent(
    "notify",
    getSetting({ key: "emails.confirm.successMessage", listId: query.list })
  )

  emitEvent("email-list-new-email-confirmed", query)

  return
}

export const addEmail = async ({
  email,
  listId,
  tags = [],
}: EmailConfig): Promise<void> => {
  emitEvent("email-list-new-email-requested", { email, listId, tags })
  await sendEmailListRequest("addEmail", { email, listId, tags })

  return
}

export const setup = (): void => {
  addCallback({
    key: "emailList",
    hook: "route-query-action-verify-email-list",
    callback: (_: VerifyEmail) => verifyEmail(_),
  })
}
setup()
