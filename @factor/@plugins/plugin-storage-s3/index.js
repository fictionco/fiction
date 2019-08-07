module.exports.default = Factor => {
  return new (class {
    constructor() {
      const AWS = require("aws-sdk")
      AWS.config.update({
        accessKeyId: Factor.$config.setting("AWS_ACCESS_KEY"),
        secretAccessKey: Factor.$config.setting("AWS_ACCESS_KEY_SECRET")
      })

      this.bucket = Factor.$config.setting("AWS_S3_BUCKET")
      this.S3 = new AWS.S3()

      Factor.$filters.add("storage-attachment-url", ({ buffer, key }) => {
        return new Promise((resolve, reject) => {
          var params = { Bucket: this.bucket, Key: key, Body: buffer, ACL: "public-read" }
          this.S3.upload(params, (err, data) => {
            if (err) reject(err)

            const { Location } = data || {}

            resolve(Location)
          })
        })
      })

      Factor.$filters.callback("delete-attachment", async doc => {
        const key = doc.url.split("amazonaws.com/")[1]

        if (key) {
          var params = { Bucket: this.bucket, Key: key }
          return await this.S3.deleteObject(params).promise()
        }
      })
    }
  })()
}
