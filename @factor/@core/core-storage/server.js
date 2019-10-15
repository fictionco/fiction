const multer = require("multer")
import { objectIdType, objectId } from "@factor/db/util"
export default Factor => {
  return new (class {
    constructor() {
      this.mime = require("mime-types")
      Factor.$filters.callback("endpoints", { id: "storage", handler: this })

      Factor.$filters.push("data-schemas", () => require("./schema").default(Factor), {
        key: "storage"
      })

      Factor.$filters.add("middleware", _ => {
        _.push({
          path: `/_upload`,
          middleware: [
            multer().single("imageUpload"),
            async (request, response, next) => {
              return await Factor.$http.process({
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
        file: { buffer, mimetype, size, name }
      } = request

      const attachmentModel = Factor.$dbServer.model("attachment")
      const attachment = new attachmentModel()

      Object.assign(attachment, {
        author: [objectId(bearer._id)],
        mimetype,
        size
      })

      const attachmentUrl = await Factor.$filters.apply("storage-attachment-url", {
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
      const doc2 = await Factor.$dbServer.model("attachment").findById(_id)
      const doc = await Factor.$dbServer.model("attachment").findOneAndDelete({ _id })

      if (doc && !doc.url.includes("base64")) {
        await Factor.$filters.run("delete-attachment", doc)
      }

      return doc
    }
  })()
}
