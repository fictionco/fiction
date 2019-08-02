const multer = require("multer")
module.exports.default = Factor => {
  return new (class {
    constructor() {
      Factor.$filters.callback("endpoints", { id: "storage", handler: this })
      Factor.$filters.add("data-schemas", _ => {
        _.attachment = require("./schema").default(Factor)
        return _
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
        file: { buffer, mimetype, size }
      } = request

      const author = [Factor.$dbServer.objectId(bearer._id)]
      const url = await Factor.$filters.apply(
        "create-attachment-url",
        `data:${mimetype};base64,${buffer.toString("base64")}`
      )
      const img = await Factor.$dbServer
        .model("attachment")
        .create({ url, mimetype, size, author })

      return img.toObject()
    }

    async delete({ _id }) {
      const deleted = await Factor.$filters.run("delete-attachment", { _id })
      return await Factor.$dbServer.model("attachment").findByIdAndDelete(_id)
    }
  })()
}
