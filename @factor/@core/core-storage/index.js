const loadImage = require("blueimp-load-image")

module.exports.default = Factor => {
  return new (class {
    constructor() {}

    // createPath(path, vars) {
    //   path = path.replace("__guid", vars.guid)
    //   path = path.replace("__uid", vars.uid)
    //   path = path.replace("__name", vars.name)
    //   path = path.replace("__ext", vars.ext)
    //   path = path.replace("__month", Factor.$time.iMonth())

    //   return path
    // }

    async dataURL(file) {
      const reader = new FileReader()

      return new Promise((resolve, reject) => {
        reader.addEventListener("load", function(e) {
          resolve(e.target.result)
        })

        reader.readAsDataURL(file)
      })
    }

    async request({ method, params, formData, headers = {} }) {
      return await Factor.$endpoint.request({ id: "storage", formData, method, params, headers })
    }

    async delete(params) {
      return await this.request({ method: "delete", params })
    }

    async upload({ file, meta, preprocess, done, error, change }) {
      file = await this.preupload({ file, preprocess })

      let formData = new FormData()

      formData.append("imageUpload", file)
      formData.append("params", JSON.stringify({ meta }))
      formData.append("method", "upload")

      return await Factor.$http.post("/_upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      })
    }

    async preupload({ file, preprocess }, options = {}) {
      let { maxWidth = 2000, maxHeight = 2000, resize = true } = options
      preprocess({
        mode: "started",
        percent: 5
      })

      if (resize && file.type.includes("image")) {
        file = await new Promise(resolve => {
          loadImage(
            file,
            canvas => {
              canvas.toBlob(blob => resolve(blob), "image/jpeg")
            },
            { maxWidth, maxHeight, canvas: true, orientation: true }
          )
        })
        preprocess.call(this, {
          mode: "resized",
          percent: 25,
          preview: URL.createObjectURL(file)
        })
      }

      preprocess({
        mode: "finished",
        percent: 100
      })

      return file
    }
  })()
}
