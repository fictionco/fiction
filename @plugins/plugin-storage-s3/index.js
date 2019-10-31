import { addFilter, addCallback } from "@factor/tools"
const AWS = require("aws-sdk")

const AWS_ACCESS_KEY = process.env.AWS_ACCESS_KEY
const AWS_ACCESS_KEY_SECRET = process.env.AWS_ACCESS_KEY_SECRET
const AWS_S3_BUCKET = process.env.AWS_S3_BUCKET

const bucket = AWS_S3_BUCKET
const S3 = new AWS.S3()

addFilters()

function addFilters() {
  if (!AWS_ACCESS_KEY || !AWS_ACCESS_KEY_SECRET || !AWS_S3_BUCKET) {
    addFilter("setup-needed", _ => {
      const item = {
        title: "Plugin: S3 Storage Credentials",
        value: "The S3 storage plugin requires AWS S3 information to run correctly.",
        location: ".env/AWS_ACCESS_KEY, AWS_ACCESS_KEY_SECRET, AWS_S3_BUCKET"
      }

      return [..._, item]
    })

    return
  }

  AWS.config.update({
    accessKeyId: AWS_ACCESS_KEY,
    secretAccessKey: AWS_ACCESS_KEY_SECRET
  })

  addFilter("storage-attachment-url", ({ buffer, key }) => {
    return new Promise((resolve, reject) => {
      var params = { Bucket: bucket, Key: key, Body: buffer, ACL: "public-read" }
      S3.upload(params, (err, data) => {
        if (err) reject(err)

        const { Location } = data || {}

        resolve(Location)
      })
    })
  })

  addCallback("delete-attachment", async doc => {
    const key = doc.url.split("amazonaws.com/")[1]

    if (key) {
      var params = { Bucket: bucket, Key: key }
      return await S3.deleteObject(params).promise()
    }
  })
}
