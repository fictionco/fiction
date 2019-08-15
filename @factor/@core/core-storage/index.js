const loadImage = require("blueimp-load-image")

module.exports.default = Factor => {
  return new (class {
    constructor() {
      // Factor.$filters.add("data-schemas", _ => {
      //   _.attachment = require("./schema").default(Factor)
      //   return _
      // })

      Factor.$filters.push("data-schemas", require("./schema").default(Factor))
    }

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
      return await Factor.$endpoint.request({
        id: "storage",
        formData,
        method,
        params,
        headers
      })
    }

    async delete(params) {
      return await this.request({ method: "delete", params })
    }

    async upload({ file, onPrep, onFinished, onError, onChange }) {
      file = await this.preupload({ file, onPrep })

      let formData = new FormData()

      formData.append("imageUpload", file)

      const {
        data: { result, error }
      } = await Factor.$http.post("/_upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        },
        onUploadProgress: function(progressEvent) {
          onChange(progressEvent)
        }
      })

      if (error) {
        onError(error)
      } else {
        Factor.$store.add(result._id, result)
        onFinished(result)
      }
    }

    async resize(fileOrBlobOrUrl, options = {}) {
      let { maxWidth = 1500, maxHeight = 1500 } = options

      return await new Promise(resolve => {
        loadImage(
          fileOrBlobOrUrl,
          canvas => {
            canvas.toBlob(blob => resolve(blob), fileOrBlobOrUrl.type)
          },
          { maxWidth, maxHeight, canvas: true, orientation: true }
        )
      })
    }

    async preupload({ file, onPrep }, options = {}) {
      onPrep({
        mode: "started",
        percent: 5
      })

      if (file.type.includes("image")) {
        file = await this.resize(file, options)

        onPrep({
          mode: "resized",
          percent: 25,
          preview: URL.createObjectURL(file)
        })
      }

      onPrep({
        mode: "finished",
        percent: 100
      })

      return file
    }

    // https://stackoverflow.com/a/36183085/1858322
    async base64ToBlob(b64Data, contentType = "image/jpeg") {
      const url = `data:${contentType};base64,${b64Data}`
      const response = await fetch(url)
      return await response.blob()
    }
  })()
}
