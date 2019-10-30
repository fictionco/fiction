const multer = require("multer")
import { getModel } from "@factor/post/server"
import {
  addFilter,
  pushToFilter,
  applyFilters,
  runCallbacks,
  addCallback
} from "@factor/tools"
import { objectId } from "@factor/post/util"
import { processEndpointRequest } from "@factor/endpoint/server"
export default Factor => {
  return new (class {
    constructor() {
      this.mime = require("mime-types")
      addCallback("endpoints", { id: "storage", handler: this })

      pushToFilter("data-schemas", () => require("./schema").default(Factor), {
        key: "storage"
      })

      addFilter("middleware", _ => {
        _.push({
          path: `/_upload`,
          middleware: [
            multer().single("imageUpload"),
            async (request, response, next) => {
              return await processEndpointRequest({
                request,
                response,
                handler: _ => this.handleUpload(_)
              })
            }
          ]
        })
        return _
      })
    }

    async handleUpload({ meta }) {
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
        key: `${attachment._id}.${this.mime.extension(mimetype)}`,
        _id: attachment._id
      })

      attachment.url =
        typeof attachmentUrl == "string"
          ? attachmentUrl
          : `data:${mimetype};base64,${buffer.toString("base64")}`

      await attachment.save()

      return attachment.toObject()
    }

    async delete({ _id }) {
      const doc = await getModel("attachment").findOneAndDelete({ _id })

      if (doc && !doc.url.includes("base64")) {
        await runCallbacks("delete-attachment", doc)
      }

      return doc
    }
  })()
}
