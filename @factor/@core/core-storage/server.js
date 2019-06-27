const multer = require("multer")
module.exports.default = Factor => {
  return new (class {
    constructor() {
      Factor.$filters.callback("endpoints", { id: "storage", handler: this })
      Factor.$filters.callback("data-schemas", () => this.imageSchema())

      Factor.$filters.add("middleware", _ => {
        _.push({
          path: `/_upload`,
          middleware: [
            multer().single("imageUpload"),
            async (request, response, next) => {
              return await Factor.$http.process({ request, response, handler: _ => this.handleUpload(_) })
            }
          ]
        })
        return _
      })
    }

    async handleUpload({ request, response, meta }) {
      const { bearer } = meta
      const {
        file: { buffer, mimetype, size }
      } = request

      const author = [Factor.$db.objectId(bearer._id)]
      const url = `data:${mimetype};base64,${buffer.toString("base64")}`
      const img = await Factor.$db.run("Image", "create", [{ url, mimetype, size, author }])

      return img.toObject()
    }

    imageSchema() {
      const _this = this // mongoose hooks need 'this'
      return {
        name: "Image",
        callback: Schema => {},
        schema: {
          mimetype: String,
          imageData: Buffer,
          size: Number,
          url: { type: String, required: true }
        },
        options: {}
      }
    }
  })()
}
