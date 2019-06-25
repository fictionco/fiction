const multer = require("multer")
module.exports.default = Factor => {
  return new (class {
    constructor() {
      Factor.$filters.callback("endpoints", { id: "storage", handler: this })

      Factor.$filters.add("middleware", _ => {
        _.push({
          path: `/_upload`,
          middleware: [
            multer().single("imageUpload"),
            async (request, response, next) => {
              return await this.handleUpload({ request, response })
            }
          ]
        })
        return _
      })
    }

    async handleUpload({ request, response }) {
      console.log("***** HANDLE UPLOAD")
    }

    schema() {
      const _this = this // mongoose hooks need 'this'
      return {
        name: "Image",
        callback: Schema => {},
        schema: {
          name: String,
          mimetype: String,
          image: Buffer,
          size: Number
        },
        options: {}
      }
    }

    upload(params) {
      console.log("STORAGE HANDLER", params)
    }
  })()
}
