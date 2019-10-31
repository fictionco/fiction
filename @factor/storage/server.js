import { getModel } from "@factor/post/server"
import multer from "multer"

import {
  addFilter,
  pushToFilter,
  applyFilters,
  runCallbacks,
  addCallback
} from "@factor/tools"
import { objectId } from "@factor/post/util"
import { processEndpointRequest } from "@factor/endpoint/server"

import mime from "mime-types"

import storageSchema from "./schema"

import * as endpointHandler from "@factor/storage/server"

addCallback("endpoints", { id: "storage", handler: endpointHandler })

pushToFilter("data-schemas", () => storageSchema)

addFilter("middleware", _ => {
  _.push({
    path: `/_upload`,
    middleware: [
      multer().single("imageUpload"),
      async (request, response) => {
        return await processEndpointRequest({
          request,
          response,
          handler: _ => handleUpload(_)
        })
      }
    ]
  })
  return _
})

async function handleUpload({ meta }) {
  const { bearer, request } = meta
  const {
    file: { buffer, mimetype, size }
  } = request

  const attachmentModel = getModel("attachment")
  const attachment = new attachmentModel()

  Object.assign(attachment, {
    author: [objectId(bearer._id)],
    mimetype,
    size
  })

  const attachmentUrl = await applyFilters("storage-attachment-url", {
    buffer,
    key: `${attachment._id}.${mime.extension(mimetype)}`,
    _id: attachment._id
  })

  attachment.url =
    typeof attachmentUrl == "string"
      ? attachmentUrl
      : `data:${mimetype};base64,${buffer.toString("base64")}`

  await attachment.save()

  return attachment.toObject()
}

export async function deleteImage({ _id }) {
  const doc = await getModel("attachment").findOneAndDelete({ _id })

  if (doc && !doc.url.includes("base64")) {
    await runCallbacks("delete-attachment", doc)
  }

  return doc
}
